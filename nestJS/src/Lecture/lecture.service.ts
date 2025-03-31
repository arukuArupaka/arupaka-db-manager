/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { BKCBuildings } from './classroom/bkc-buildings';
import { OICBuildings } from './classroom/oic-buildings';
import { KICBuildings } from './classroom/kic-buildings';
import { Campus } from '@prisma/client';
import { LectureCreatePayload } from './interface/lecture-create.payload';
import { UpsertLectureInput } from './interface/lecture-upsert.input';
import { LecturesGetInput } from './interface/lectures-get.input';
import { LecturePayload } from './interface/lecture.payload';
import { convertFullwidthDigitsToHalfwidth } from '../common/convertFullwidthDigitsToHalfwidth';
import { OccupiedClassroomsGetInput } from './interface/occupied-classrooms-get.input';
import { OccupiedClassroomsGetPayload } from './interface/occupied-classrooms-get.payload';
import { BuildingAndClassroomsGetInput } from './interface/building-and-classrooms-get.input';
import { removeJapanese } from '../common/remove-japanese';
import { LectureGetByClassroomInput } from './interface/lecture-get-by-classroom.input';

@Injectable()
export class LectureService {
  constructor(private readonly prisma: CustomPrismaService) {}

  /**
   * 教室名を読みやすく変換するメソッド（例：コラーニングⅠ101号室 → C101）
   * @param classroom
   * @param campus
   * @param building
   * @returns
   */
  private formatClassroomName(
    classroom: string,
    campus: Campus,
    building: string,
  ) {
    if (campus === 'BKC') {
      if (building === 'コラーニングⅠ' || building === 'コラーニングⅡ') {
        return classroom.includes('情報')
          ? classroom
          : `C${removeJapanese(classroom)}`;
      }
      if (building === 'フォレストハウス') {
        return `F${removeJapanese(classroom)}`;
      }
      if (building === 'プリズム') {
        return classroom.includes('情報')
          ? classroom
          : `P${removeJapanese(classroom)}`;
      }
      if (building === 'アドセミナリオ') {
        return `A${removeJapanese(classroom)}`;
      }
      if (building === 'アクロス') {
        return classroom.includes('情報')
          ? classroom
          : `AC${removeJapanese(classroom)}`;
      }
    }
    if (campus === 'OIC') {
      return `${removeJapanese(classroom)}`;
    }
    return removeJapanese(classroom);
  }

  private splitClassroom(classroom: string) {
    // 各キャンパスごとに、建物名をキー、教室名の配列を値とするオブジェクト
    const BKCClassrooms: { [key: string]: string[] } = {};
    const OICClassrooms: { [key: string]: string[] } = {};
    const KICClassrooms: { [key: string]: string[] } = {};
    const OtherClassrooms: { [key: string]: string[] } = {};

    // 初期化
    BKCBuildings.forEach((b) => (BKCClassrooms[b] = []));
    OICBuildings.forEach((b) => (OICClassrooms[b] = []));
    KICBuildings.forEach((b) => (KICClassrooms[b] = []));
    OtherClassrooms['Other'] = [];

    // 各キャンパスの建物リストから正規表現を事前生成
    const regexBKC = new RegExp(BKCBuildings.join('|'), 'g');
    const regexOIC = new RegExp(OICBuildings.join('|'), 'g');
    const regexKIC = new RegExp(KICBuildings.join('|'), 'g');

    // '/' で区切られた文字列を分割
    const splitted = classroom.split('/');

    for (const roomStr of splitted) {
      // 教室名にBKCを含む場合、OICのB棟とご認識されるので早期リターン
      if (roomStr.includes('BKC')) {
        OtherClassrooms['Other'].push(roomStr);
        continue;
      }

      // BKC 用
      let matches = roomStr.match(regexBKC);
      if (matches) {
        // 同じ建物名が複数回出現しても処理
        matches.forEach((building) => {
          const room = roomStr.replace(building, '').trim();
          const convertedRoom = convertFullwidthDigitsToHalfwidth(room);
          const formattedRoom = this.formatClassroomName(
            convertedRoom,
            'BKC',
            building,
          );
          BKCClassrooms[building].push(formattedRoom);
        });
      }
      // OIC 用
      matches = roomStr.match(regexOIC);
      if (matches) {
        matches.forEach((building) => {
          const room = roomStr.trim();
          const convertedRoom = convertFullwidthDigitsToHalfwidth(room);
          const formattedRoom = this.formatClassroomName(
            convertedRoom,
            'OIC',
            building,
          );
          OICClassrooms[building].push(formattedRoom);
        });
      }
      // KIC 用
      matches = roomStr.match(regexKIC);
      if (matches) {
        matches.forEach((building) => {
          const room = roomStr.replace(building, '').trim();
          const convertedRoom = convertFullwidthDigitsToHalfwidth(room);
          const formattedRoom = this.formatClassroomName(
            convertedRoom,
            'KIC',
            building,
          );
          KICClassrooms[building].push(formattedRoom);
        });
      }

      // どのキャンパスにも含まれない場合はOtherとして処理
      if (!matches) {
        OtherClassrooms['Other'].push(roomStr);
      }
    }

    return {
      BKC: BKCClassrooms,
      OIC: OICClassrooms,
      KIC: KICClassrooms,
      Other: OtherClassrooms,
    };
  }

  /**
   * loadLectures実行後に、建物名を正しくなおす関数
   * @returns
   */
  async renameBuildingNames(): Promise<void> {
    // loadLectures実行後に、教室名を正しくなおす対象（適宜手動で追加が必要）
    const targetBuildings = [
      { oldName: 'アクロス', newName: 'アクロスウィング' },
      { oldName: 'プリズム', newName: 'プリズムハウス' },
    ];
    const updatePromises = (params: { oldName: string; newName: string }) => {
      return this.prisma.building.update({
        where: {
          name: params.oldName,
        },
        data: {
          name: params.newName,
        },
      });
    };
    Promise.all(
      targetBuildings.map((building) => {
        return updatePromises({
          oldName: building.oldName,
          newName: building.newName,
        });
      }),
    );
  }

  /**
   * lectureの一括登録処理
   * @param props
   */
  async upsertLecture(props: UpsertLectureInput) {
    const insertionPromises = [];
    // まず、各 mapping を集約する配列を用意
    const lectureClassroomMappings: {
      classroomId: number;
      lectureId: number;
    }[] = [];

    // 各教室ごとに登録処理を行う
    for (const [
      classroomId,
      lectures,
    ] of props.classroomIdLectureMap.entries()) {
      for (const lecture of lectures) {
        const lectureUniqueKey = `${lecture.schoolYear}-${lecture.academic}-${lecture.semester}-${lecture.classCode}`;
        let upsertPromise = props.lectureUpsertCache.get(lectureUniqueKey);
        // upsert処理自体を配列に格納しておく（Promise.all でまとめて処理）
        if (!upsertPromise) {
          upsertPromise = this.prisma.lecture.upsert({
            where: {
              academic_schoolYear_semester_classCode_weekday_period: {
                schoolYear: lecture.schoolYear,
                academic: lecture.academic,
                semester: lecture.semester,
                classCode: lecture.classCode,
                weekday: lecture.weekday,
                period: lecture.period,
              },
            },
            update: {},
            create: lecture,
          });
          props.lectureUpsertCache.set(lectureUniqueKey, upsertPromise);
        }
        // 各 upsert の完了後に mapping 情報を配列に追加
        insertionPromises.push(
          upsertPromise.then((createdLecture) => {
            lectureClassroomMappings.push({
              classroomId,
              lectureId: createdLecture.id,
            });
          }),
        );
      }
    }

    await Promise.all(insertionPromises);

    // すべての mapping を一括挿入（skipDuplicates オプションを利用）
    await this.prisma.lectureClassroom.createMany({
      data: lectureClassroomMappings,
      skipDuplicates: true, // 重複している場合はスキップ
    });

    await Promise.all(insertionPromises);
    // バッチ処理済みの Map はクリアしてメモリ解放
    props.classroomIdLectureMap.clear();
  }

  /**
   * 時間割JSONデータを読み込んでDBに登録
   * @returns
   */
  async loadLectures() {
    // キャッシュをMapで管理する（より高速なキー検索とループ制御が可能）
    const buildingCache = new Map<string, { id: number; campus: string }>();
    const classroomCache = new Map<string, number>();
    // 教室ごとの講義をMapで管理
    const classroomIdLectureMap = new Map<number, LectureCreatePayload[]>();

    // 講義の重複 upsert を避けるためのキャッシュ
    const lectureUpsertCache = new Map<string, Promise<any>>();

    // バッチサイズ
    const BATCH_SIZE = 100;
    // 講義の一括登録用バッチ（Otherキャンパスなど）
    let lectureBatch: LectureCreatePayload[] = [];

    for (let i = 1; i < 4; i++) {
      const filePath = path.join(__dirname, 'lecture-data', `2025-${i}.json`);
      const jsonData = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(jsonData);

      // 各講義の逐次処理
      for (const el of data) {
        // 教室名を建物ごとに分割する（例: { BKC: { '建物A': ['101号室', '102号室'], ... }, ... }）
        const classroomTable = this.splitClassroom(el.fields.classroom);
        const newLecture: LectureCreatePayload = {
          schoolYear: el.fields.schoolYear,
          classCode: el.fields.classCode,
          name: el.fields.name,
          credits: Number(el.fields.credits),
          syllabus: el.fields.syllabus,
          teacher: el.fields.teacher,
          academic: el.fields.academic,
          semester: Boolean(el.fields.semester) ? 'Autumn' : 'Spring',
          weekday: el.fields.weekday,
          period: el.fields.period,
          campus: el.fields.campus !== 'None' ? el.fields.campus : undefined,
          rawClassroom: el.fields.classroom,
        };

        // 各キャンパスごとに処理
        for (const campus of ['BKC', 'OIC', 'KIC', 'Other']) {
          if (campus === 'Other') {
            // Otherキャンパスはそのまま一括登録用バッチに追加
            lectureBatch.push(newLecture);
            continue;
          }

          // 指定キャンパスの建物一覧を取得
          const buildingNames = Object.keys(classroomTable[campus] || {});
          for (const buildingName of buildingNames) {
            const cacheKey = `${campus}:${buildingName}`;
            let building = buildingCache.get(cacheKey);
            if (!building) {
              // キャッシュにない場合はDBに作成しキャッシュ登録
              building = await this.prisma.building.create({
                data: { name: buildingName, campus: campus as Campus },
              });
              buildingCache.set(cacheKey, building);
            }

            // 教室のリスト（重複排除）
            const rooms: string[] = classroomTable[campus][buildingName] || [];
            const uniqueRooms = Array.from(new Set(rooms));
            if (uniqueRooms.length > 0) {
              // キャッシュから建物情報を再取得するのではなく、先ほど作成・キャッシュしたbuildingを利用
              for (const room of uniqueRooms) {
                const classroomKey = `${room}:${buildingName}`;
                const classroomId = classroomCache.get(classroomKey);
                if (classroomId) {
                  // 既に存在する場合は講義を追加
                  let lectures = classroomIdLectureMap.get(classroomId);
                  if (!lectures) {
                    lectures = [];
                    classroomIdLectureMap.set(classroomId, lectures);
                  }
                  lectures.push(newLecture);
                  // 教室が見つかった時点で、同一建物の他の教室への追加は不要なら次の建物へ
                  continue;
                }
              }

              // 新規教室がある場合、バッチで作成して講義を登録
              await Promise.all(
                uniqueRooms.map(async (room) => {
                  const classroomKey = `${room}:${buildingName}`;
                  // 既にキャッシュにあればスキップ（並列処理時の競合対策）
                  if (classroomCache.has(classroomKey)) return;
                  const createdClassroom = await this.prisma.classroom.create({
                    data: { name: room, buildingId: building.id },
                  });
                  classroomCache.set(classroomKey, createdClassroom.id);
                  classroomIdLectureMap.set(createdClassroom.id, [newLecture]);
                }),
              );
            }
          }
        }

        // 教室ごとの講義が一定件数に達したら、一括DB挿入
        if (classroomIdLectureMap.size >= BATCH_SIZE) {
          await this.upsertLecture({
            classroomIdLectureMap,
            lectureUpsertCache,
          });
        }
      }

      // バッチ処理で残った講義を一括登録
      if (classroomIdLectureMap.size > 0) {
        await this.upsertLecture({
          classroomIdLectureMap,
          lectureUpsertCache,
        });
      }

      // other キャンパスの講義を一括登録
      if (lectureBatch.length > 0) {
        // キャッシュマップを使って重複を排除
        const uniqueLectureMap = new Map<string, LectureCreatePayload>();
        lectureBatch.forEach((lecture) => {
          const key = `${lecture.schoolYear}-${lecture.academic}-${lecture.semester}-${lecture.classCode}-${lecture.weekday}-${lecture.period}`;
          if (!uniqueLectureMap.has(key)) {
            uniqueLectureMap.set(key, lecture);
          }
        });
        const uniqueLectureBatch = Array.from(uniqueLectureMap.values());

        // skipDuplicatesを使用して重複していたらスキップ
        await this.prisma.lecture.createMany({
          data: uniqueLectureBatch,
          skipDuplicates: true,
        });
        lectureBatch = [];
      }
    }

    await this.renameBuildingNames();

    return 'ok';
  }

  private chunkArray(array: any[], chunkSize = 100) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  async checkAllLectures() {
    const diffArray = [];
    for (let i = 1; i < 4; i++) {
      const filePath = path.join(__dirname, 'lecture-data', `2025-${i}.json`);
      const jsonData = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(jsonData);
      const splitedArray = this.chunkArray(
        data.map((el) => el.fields.classCode),
      );

      await Promise.all(
        splitedArray.map(async (arr) => {
          const lectures = await this.prisma.lecture.findMany({
            where: {
              classCode: {
                in: arr,
              },
            },
            select: {
              classCode: true,
            },
          });
          const lectureCodes = lectures.map((l) => l.classCode);
          diffArray.push(
            ...new Set(arr.filter((code) => !lectureCodes.includes(code))),
          );
        }),
      );
    }
    return diffArray;
  }

  /**
   * 条件付きで講義情報を取得
   * 全てオプショナルなため、フロントから柔軟に検索可能
   * @param input LecturesGetInput
   * @returns LecturePayload[]
   */
  async getLectures(input: LecturesGetInput): Promise<LecturePayload[]> {
    return this.prisma.lecture.findMany({
      where: {
        ...(input.academic && { academic: input.academic }),
        ...(input.campus && { campus: input.campus }),
        ...(input.schoolYear && { schoolYear: input.schoolYear }),
        ...(input.semester && { semester: input.semester }),
        ...(input.weekday && { weekday: input.weekday }),
        ...(input.period && { period: input.period }),
        ...(input.classCode && { classCode: input.classCode }),
        ...(input.name && { name: input.name }),
        ...(input.teacher && { teacher: input.teacher }),
      },
    });
  }

  async getOccupiedClassrooms(
    input: OccupiedClassroomsGetInput,
  ): Promise<OccupiedClassroomsGetPayload[]> {
    // 「教室名」をキーとして、講義情報（OccupiedClassroomsGetPayload）を保持するMap
    const classroomLectureMap = new Map<string, OccupiedClassroomsGetPayload>();

    // 建物とその教室を取得（必要な情報だけselect）
    const buildings = await this.prisma.building.findMany({
      where: { campus: input.campus },
      select: {
        name: true,
        classrooms: { select: { name: true } },
      },
    });

    // 条件に合致する講義を取得
    const lectures = await this.prisma.lecture.findMany({
      where: {
        campus: input.campus,
        schoolYear: input.schoolYear,
        semester: input.semester,
        weekday: input.weekday,
        period: input.period,
      },
      select: {
        name: true,
        teacher: true,
        // 講義に紐づく教室情報を取得
        lectureClassrooms: {
          select: {
            classroom: {
              select: {
                name: true,
                building: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // 講義ごとに、該当する教室名をキーとしてMapに登録
    lectures.forEach((lecture) => {
      lecture.lectureClassrooms.forEach((lc) => {
        // キーは「教室名」だけにしていますが、必要に応じて「建物名:教室名」といった形式にするとより一意にできます
        const key = lc.classroom.name;
        // すでに登録済みなら（複数講義がある場合）、ここでは最初の講義情報のみを保持
        if (!classroomLectureMap.has(key)) {
          classroomLectureMap.set(key, {
            building: lc.classroom.building.name,
            classroom: lc.classroom.name,
            isUsed: true,
            name: lecture.name,
            teacher: lecture.teacher,
          });
        }
      });
    });

    // 建物一覧から利用可能な教室の配列を作成
    // ここでは各建物の各教室について、Map に登録された講義情報があれば使用中(true)、
    // なければ利用可能(false)として返します
    const occupiedClassrooms = buildings.flatMap((building) =>
      building.classrooms.map((classroom) => {
        // Mapからキー（ここでは教室名）で情報を取得
        const lecture = classroomLectureMap.get(classroom.name);
        if (!lecture) {
          return {
            building: building.name,
            classroom: classroom.name,
            isUsed: false,
          } as OccupiedClassroomsGetPayload;
        }
        // もし Map にあれば、その講義情報を返す
        return lecture;
      }),
    );

    occupiedClassrooms.sort((a, b) => a.classroom.localeCompare(b.classroom));

    return [...new Set(occupiedClassrooms)];
  }

  async getBuildingAndClassrooms(input: BuildingAndClassroomsGetInput) {
    const building = await this.prisma.building.findUnique({
      where: {
        name: input.buildingName,
      },
      select: {
        name: true,
        classrooms: {
          select: {
            name: true,
          },
        },
      },
    });

    building.classrooms.sort((a, b) => a.name.localeCompare(b.name));

    return building.classrooms;
  }

  async getLectureByClassroom(query: LectureGetByClassroomInput) {
    const lectures = await this.prisma.lectureClassroom.findMany({
      where: {
        classroomId: Number(query.classroomId),
      },
      select: {
        lecture: true,
      },
    });
    return lectures;
  }

  async deleteLectures(): Promise<number> {
    await this.prisma.lectureClassroom.deleteMany({});
    await this.prisma.classroom.deleteMany({});
    await this.prisma.building.deleteMany({});
    const countLecture = await this.prisma.lecture.deleteMany({});
    return countLecture.count;
  }
}
