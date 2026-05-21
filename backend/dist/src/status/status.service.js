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
exports.StatusService = exports.SetPresenceDto = exports.SetStatusDto = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
const prisma_service_1 = require("../prisma/prisma.service");
class SetStatusDto {
    type;
    presence;
    customText;
    emoji;
}
exports.SetStatusDto = SetStatusDto;
__decorate([
    (0, class_validator_1.IsEnum)(client_1.StatusType),
    __metadata("design:type", String)
], SetStatusDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.PresenceType),
    __metadata("design:type", String)
], SetStatusDto.prototype, "presence", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], SetStatusDto.prototype, "customText", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SetStatusDto.prototype, "emoji", void 0);
class SetPresenceDto {
    presence;
}
exports.SetPresenceDto = SetPresenceDto;
__decorate([
    (0, class_validator_1.IsEnum)(client_1.PresenceType),
    __metadata("design:type", String)
], SetPresenceDto.prototype, "presence", void 0);
let StatusService = class StatusService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async setStatus(userId, dto) {
        return this.prisma.userStatus.upsert({
            where: { userId },
            create: { userId, ...dto },
            update: dto,
        });
    }
    async setPresence(userId, presence) {
        return this.prisma.userStatus.upsert({
            where: { userId },
            create: { userId, type: 'WORKING', presence },
            update: { presence },
        });
    }
    async clearStatus(userId) {
        await this.prisma.userStatus.deleteMany({ where: { userId } });
    }
    static maskPresence(status, viewerId, ownerId) {
        if (!status)
            return status;
        if (viewerId === ownerId)
            return status;
        if (status.presence === client_1.PresenceType.INVISIBLE) {
            return { ...status, presence: client_1.PresenceType.INVISIBLE };
        }
        return status;
    }
};
exports.StatusService = StatusService;
exports.StatusService = StatusService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StatusService);
//# sourceMappingURL=status.service.js.map