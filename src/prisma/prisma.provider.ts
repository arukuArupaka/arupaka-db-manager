import { CustomPrismaService } from './prisma.service';

export const PrismaServiceProvider = {
  provide: 'PrismaService',
  useClass: CustomPrismaService,
};
