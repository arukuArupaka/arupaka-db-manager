"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomPrismaService = void 0;
const client_1 = require("@prisma/client");
class CustomPrismaService extends client_1.PrismaClient {
    constructor() {
        super();
        this.$connect();
    }
}
exports.CustomPrismaService = CustomPrismaService;
//# sourceMappingURL=prisma.service.js.map