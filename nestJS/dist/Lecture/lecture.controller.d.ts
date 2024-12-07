import { CustomPrismaService } from '../prisma/prisma.service';
export declare class LectureController {
    private readonly prisma;
    constructor(prisma: CustomPrismaService);
    getLecture(): Promise<{
        id: number;
        classCode: number;
        name: string;
        credits: number;
        category: string | null;
        field: string | null;
        syllabus: string | null;
        teacher: string;
        academics: import(".prisma/client").$Enums.Academic;
        building: string | null;
        classroom: string | null;
        schoolYear: number;
        semester: boolean;
        weekday: import(".prisma/client").$Enums.Weekday;
        period: number;
    }[]>;
}
