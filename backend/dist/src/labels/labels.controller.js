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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabelsController = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const labels_service_1 = require("./labels.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
class CreateLabelDto {
    name;
    color;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(30),
    __metadata("design:type", String)
], CreateLabelDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^#[0-9a-fA-F]{6}$/),
    __metadata("design:type", String)
], CreateLabelDto.prototype, "color", void 0);
class UpdateLabelDto {
    name;
    color;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(30),
    __metadata("design:type", String)
], UpdateLabelDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^#[0-9a-fA-F]{6}$/),
    __metadata("design:type", String)
], UpdateLabelDto.prototype, "color", void 0);
let LabelsController = class LabelsController {
    labels;
    constructor(labels) {
        this.labels = labels;
    }
    list(req) {
        return this.labels.getAll(req.user.id);
    }
    create(req, dto) {
        return this.labels.create(req.user.id, dto.name, dto.color ?? '#6366f1');
    }
    update(req, id, dto) {
        return this.labels.update(id, req.user.id, dto.name, dto.color);
    }
    remove(req, id) {
        return this.labels.remove(id, req.user.id);
    }
};
exports.LabelsController = LabelsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LabelsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateLabelDto]),
    __metadata("design:returntype", void 0)
], LabelsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, UpdateLabelDto]),
    __metadata("design:returntype", void 0)
], LabelsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], LabelsController.prototype, "remove", null);
exports.LabelsController = LabelsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('labels'),
    __metadata("design:paramtypes", [labels_service_1.LabelsService])
], LabelsController);
//# sourceMappingURL=labels.controller.js.map