import { PrismaClient } from '@prisma/client';

export class CustomPrismaService extends PrismaClient {
  constructor() {
    super();
    this.$connect(); // 自動接続
  }
}
