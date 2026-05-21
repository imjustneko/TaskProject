"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabelsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let LabelsService = class LabelsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAll(userId) {
        return this.prisma.label.findMany({
            where: { userId },
            orderBy: { name: 'asc' },
            include: { _count: { select: { tasks: true } } },
        });
    }
    async create(userId, name, color) {
        return this.prisma.label.upsert({
            where: { userId_name: { userId, name } },
            create: { userId, name, color },
            update: { color },
        });
    }
    async update(id, userId, name, color) {
        const label = await this.prisma.label.findUnique({ where: { id } });
        if (!label || label.userId !== userId)
            throw new common_1.ForbiddenException();
        return this.prisma.label.update({
            where: { id },
            data: { name, color },
        });
    }
    async remove(id, userId) {
        const label = await this.prisma.label.findUnique({ where: { id } });
        if (!label)
            throw new common_1.NotFoundException();
        if (label.userId !== userId)
            throw new common_1.ForbiddenException();
        await this.prisma.label.delete({ where: { id } });
    }
};
exports.LabelsService = LabelsService;
exports.LabelsService = LabelsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LabelsService);
//# sourceMappingURL=labels.service.js.map