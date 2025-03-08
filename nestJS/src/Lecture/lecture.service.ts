import { Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { BKCBuildings } from './classroom/bkc-buildings';
import { OICBuildings } from './classroom/oic-buildings';
import { KICBuildings } from './classroom/kic-buildings';
import { Campus } from '@prisma/client';
import { GetAvailableClassroomsInput } from './interface/get-available-classrooms.input';
import { GetAvailableClassroomsPayload } from './interface/get-available-classrooms.payload';
import { LectureCreatePayload } from './interface/lecture-create.payload';
import { getBuildingClassroomsInput } from './interface/get-building-classrooms.input';

@Injectable()
export class LectureService {
  constructor(private readonly prisma: CustomPrismaService) {}

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
      // BKC 用
      let matches = roomStr.match(regexBKC);
      if (matches) {
        // 同じ建物名が複数回出現しても処理
        matches.forEach((building) => {
          const room = roomStr.replace(building, '').trim();
          BKCClassrooms[building].push(room);
        });
      }
      // OIC 用
      matches = roomStr.match(regexOIC);
      if (matches) {
        matches.forEach((building) => {
          const room = roomStr.replace(building, '').trim();
          OICClassrooms[building].push(room);
        });
      }
      // KIC 用
      matches = roomStr.match(regexKIC);
      if (matches) {
        matches.forEach((building) => {
          const room = roomStr.replace(building, '').trim();
          KICClassrooms[building].push(room);
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

  async loadLecture() {
    // キャッシュをMapで管理する（より高速なキー検索とループ制御が可能）
    const buildingCache = new Map<string, { id: number; campus: string }>();
    const classroomCache = new Map<string, number>();
    // 教室ごとの講義をMapで管理
    const classroomIdLectureMap = new Map<number, LectureCreatePayload[]>();

    // 講義の重複 upsert を避けるためのキャッシュ
    const lectureUpsertCache = new Map<string, Promise<any>>();

    // バッチサイズ（教室ごとの講義登録件数で判定）
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
          semester: Boolean(el.fields.semester),
          weekday: el.fields.weekday,
          period: el.fields.period,
          campus: el.fields.campus === '不明' ? 'OIC' : el.fields.campus,
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
          ] of classroomIdLectureMap.entries()) {
            for (const lecture of lectures) {
              const lectureUniqueKey = `${lecture.schoolYear}-${lecture.academic}-${lecture.semester}-${lecture.name}`;
              let upsertPromise = lectureUpsertCache.get(lectureUniqueKey);
              if (!upsertPromise) {
                upsertPromise = this.prisma.lecture.upsert({
                  where: {
                    academic_schoolYear_semester_name: {
                      schoolYear: lecture.schoolYear,
                      academic: lecture.academic,
                      semester: lecture.semester,
                      name: lecture.name,
                    },
                  },
                  update: {},
                  create: lecture,
                });
                lectureUpsertCache.set(lectureUniqueKey, upsertPromise);
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
          classroomIdLectureMap.clear();
        }
      }

      // ファイル単位で残った講義を挿入（lectureBatch の場合）
      if (lectureBatch.length > 0) {
        // 講義のユニークなキーでデデュプリケーション
        const uniqueLectureMap = new Map<string, LectureCreatePayload>();
        lectureBatch.forEach((lecture) => {
          const key = `${lecture.schoolYear}-${lecture.academic}-${lecture.semester}-${lecture.name}`;
          if (!uniqueLectureMap.has(key)) {
            uniqueLectureMap.set(key, lecture);
          }
        });
        const uniqueLectureBatch = Array.from(uniqueLectureMap.values());

        // skipDuplicates オプションも併用（Prisma が対応している場合）
        await this.prisma.lecture.createMany({
          data: uniqueLectureBatch,
          skipDuplicates: true,
        });
        lectureBatch = [];
      }

      return 'ok';
    }
  }

  async getAvailableClassrooms(
    input: GetAvailableClassroomsInput,
  ): Promise<GetAvailableClassroomsPayload[]> {
    // 「教室名」をキーとして、講義情報（GetAvailableClassroomsPayload）を保持するMap
    const classroomLectureMap = new Map<
      string,
      GetAvailableClassroomsPayload
    >();

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
    const availableClassrooms = buildings.flatMap((building) =>
      building.classrooms.map((classroom) => {
        // Mapからキー（ここでは教室名）で情報を取得
        const lecture = classroomLectureMap.get(classroom.name);
        if (!lecture) {
          return {
            building: building.name,
            classroom: classroom.name,
            isUsed: false,
          } as GetAvailableClassroomsPayload;
        }
        // もし Map にあれば、その講義情報を返す
        return lecture;
      }),
    );

    return availableClassrooms;
  }

  async getBuildingClassrooms(input: getBuildingClassroomsInput) {
    const buildings = await this.prisma.building.findUnique({
      where: {
        name: input.name,
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

    return buildings;
  }
}
