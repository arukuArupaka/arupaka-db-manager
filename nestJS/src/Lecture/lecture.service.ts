import { Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { BKCBuildings } from './classroom/bkc-buildings';
import { OICBuildings } from './classroom/oic-buildings';
import { KICBuildings } from './classroom/kic-buildings';
import { LectureCreatePayload } from './interface/lecture-create.payload';
import { Campus } from '@prisma/client';

@Injectable()
export class LectureService {
  constructor(private readonly prisma: CustomPrismaService) {}

  // async getClassRoom(
  //   campus: Campus,
  //   year: number,
  //   semester: boolean,
  //   day: Weekday,
  //   period: number,
  // ): Promise<UnavailableRoomsPayload> {
  //   const lectures = await this.prisma.lecture.findMany({
  //     where: {
  //       schoolYear: year,
  //       semester: semester,
  //       weekday: day,
  //       period: period,
  //       campus: campus,
  //     },
  //   });

  //   return unavailableRooms;
  // }

  // 事前定義済みの各キャンパスの建物リスト（例）
  BKCBuildings = ['BKC_A', 'BKC_B']; // 実際の建物名リスト
  OICBuildings = ['OIC_A', 'OIC_B'];
  KICBuildings = ['KIC_A', 'KIC_B'];

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

    // mymodel1.json ～ mymodel3.json を順次処理
    for (let i = 1; i < 4; i++) {
      const filePath = path.join(__dirname, `mymodel${i}.json`);
      const jsonData = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(jsonData);

      // 各講義を逐次処理
      for (const el of data) {
        const classroomTable = this.splitClassroom(el.fields.classroom);

        // 各キャンパスごとに建物を作成（キャッシュ済みなら再利用）
        for (const campus of ['BKC', 'OIC', 'KIC']) {
          // classroomTable[campus] は、キーが建物名、値が教室名配列のオブジェクト
          const buildingNames = Object.keys(classroomTable[campus]);
          for (const buildingName of buildingNames) {
            const cacheKey = `${campus}:${buildingName}`;
            if (!buildingCache.has(cacheKey)) {
              // DB へ建物を作成
              const building = await this.prisma.building.create({
                data: { name: buildingName, campus: campus as Campus },
              });
              buildingCache.set(cacheKey, building);
              // 対応する教室を一括作成（重複登録対策は必要に応じて追加）
              const rooms = classroomTable[campus][buildingName];
              if (rooms && rooms.length > 0) {
                await this.prisma.classRoom.createMany({
                  data: rooms.map((room) => ({
                    name: room,
                    buildingId: building.id,
                  })),
                });
              }
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
    return;
  }
}
