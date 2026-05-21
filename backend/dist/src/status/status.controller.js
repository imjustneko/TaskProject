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
exports.StatusController = void 0;
const common_1 = require("@nestjs/common");
const status_service_1 = require("./status.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let StatusController = class StatusController {
    status;
    constructor(status) {
        this.status = status;
    }
    set(req, dto) {
        return this.status.setStatus(req.user.id, dto);
    }
    setPresence(req, dto) {
        return this.status.setPresence(req.user.id, dto.presence);
    }
    clear(req) {
        return this.status.clearStatus(req.user.id);
    }
};
exports.StatusController = StatusController;
__decorate([
    (0, common_1.Put)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, status_service_1.SetStatusDto]),
    __metadata("design:returntype", void 0)
], StatusController.prototype, "set", null);
__decorate([
    (0, common_1.Patch)('presence'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, status_service_1.SetPresenceDto]),
    __metadata("design:returntype", void 0)
], StatusController.prototype, "setPresence", null);
__decorate([
    (0, common_1.Delete)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StatusController.prototype, "clear", null);
exports.StatusController = StatusController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('status'),
    __metadata("design:paramtypes", [status_service_1.StatusService])
], StatusController);
//# sourceMappingURL=status.controller.js.map