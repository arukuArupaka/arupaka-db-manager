import { CustomPrismaService } from './prisma.service';
export declare const PrismaServiceProvider: {
    provide: string;
    useClass: typeof CustomPrismaService;
};
