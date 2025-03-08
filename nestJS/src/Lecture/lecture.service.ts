import { Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { BKCBuildings } from './classroom/bkc-buildings';
import { OICBuildings } from './classroom/oic-buildings';
import { KICBuildings } from './classroom/kic-buildings';
import { LectureCreatePayload } from './interface/lecture-create.payload';
import { Campus } from '@prisma/client';
import { GetAvailableClassroomsInput } from './interface/get-available-classrooms.input';

@Injectable()
export class LectureService {
  constructor(private readonly prisma: CustomPrismaService) {}

  private splitClassroom(classroom: string) {
    // 各キャンパスごとに、建物名をキー、教室名の配列を値とするオブジェクト
    const BKCClassrooms: { [key: string]: string[] } = {};
    const OICClassrooms: { [key: string]: string[] } = {};
    const KICClassrooms: { [key: string]: string[] } = {};

    // 初期化
    BKCBuildings.forEach((b) => (BKCClassrooms[b] = []));
    OICBuildings.forEach((b) => (OICClassrooms[b] = []));
    KICBuildings.forEach((b) => (KICClassrooms[b] = []));

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
    }

    return {
      BKC: BKCClassrooms,
      OIC: OICClassrooms,
      KIC: KICClassrooms,
    };
  }

  async loadLecture() {
    // 建物作成済みキャッシュ（キーは "campus:buildingName"）
    const buildingCache = new Map<string, { id: number; campus: string }>();
    // 一度に挿入する講義数を抑えるためのバッチサイズ
    const BATCH_SIZE = 100;
    let lectureBatch: LectureCreatePayload[] = [];
    const classroomCache = new Map<string, string>();

    for (let i = 1; i < 4; i++) {
      const filePath = path.join(__dirname, `mymodel${i}.json`);
      const jsonData = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(jsonData);

      // 各講義を逐次処理
      for (const el of data) {
        // '/' で区切られた教室名を建物ごとに分割
        const classroomTable = this.splitClassroom(el.fields.classroom);

        // 各キャンパスごとに建物を作成（キャッシュ済みなら再利用）
        for (const campus of ['BKC', 'OIC', 'KIC']) {
          // そのキャンパスの建物を全取得
          const buildingNames = Object.keys(classroomTable[campus]);
          for (const buildingName of buildingNames) {
            const cacheKey = `${campus}:${buildingName}`;
            if (!buildingCache.has(cacheKey)) {
              // DB へ建物を作成
              const building = await this.prisma.building.create({
                data: { name: buildingName, campus: campus as Campus },
              });
              buildingCache.set(cacheKey, building);
            }
            const rooms: string[] = classroomTable[campus][buildingName];
            const uniqueRooms = [...new Set(rooms)];
            if (uniqueRooms && uniqueRooms.length > 0) {
              // 建物 ID を取得
              const building = await this.prisma.building.findUnique({
                where: { name: buildingName },
              });

              if (
                uniqueRooms.some((room) =>
                  classroomCache.has(`${room}:${buildingName}`),
                )
              ) {
                continue; // 次の buildingName へ
              }

              await this.prisma.classroom.createMany({
                data: uniqueRooms.map((room) => ({
                  name: room,
                  buildingId: building.id,
                })),
              });

              uniqueRooms.forEach((room) => {
                classroomCache.set(`${room}:${buildingName}`, 'exists');
              });
            }
            if (campus === 'BKC') {
              console.log(buildingName);
            }
          }
        }

        // 講義オブジェクトを作成してバッチに追加
        lectureBatch.push({
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
        });

        // バッチサイズに達したらDBへ一括挿入
        if (lectureBatch.length >= BATCH_SIZE) {
          await this.prisma.lecture.createMany({ data: lectureBatch });
          lectureBatch = [];
        }
      }

      // そのファイル内で残った講義を挿入
      if (lectureBatch.length > 0) {
        await this.prisma.lecture.createMany({ data: lectureBatch });
        lectureBatch = [];
      }
    }

    // 必要に応じて作成した講義一覧を返す
    return 'ok';
  }

  async getAvailableClassrooms(input: GetAvailableClassroomsInput) {
    const classrooms = await this.prisma.lecture.findMany({
      where: {
        campus: input.campus,
        schoolYear: input.schoolYear,
        semester: input.semester,
        weekday: input.weekday,
        period: input.period,
      },
      select: {
        lectureClassRooms: {
          select: {
            classRoom: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return new Set(
      classrooms.map((el) => el.lectureClassRooms[0].classRoom
  }
}
