"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaServiceProvider = void 0;
const prisma_service_1 = require("./prisma.service");
exports.PrismaServiceProvider = {
    provide: 'PrismaService',
    useClass: prisma_service_1.CustomPrismaService,
};
//# sourceMappingURL=prisma.provider.js.map