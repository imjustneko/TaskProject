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
exports.PartnersController = void 0;
const common_1 = require("@nestjs/common");
const partners_service_1 = require("./partners.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let PartnersController = class PartnersController {
    partners;
    constructor(partners) {
        this.partners = partners;
    }
    getPartners(req) {
        return this.partners.getMyPartners(req.user.id);
    }
    getRequests(req) {
        return this.partners.getIncomingRequests(req.user.id);
    }
    getPairStatus(req, targetId) {
        return this.partners.getPairStatus(req.user.id, targetId);
    }
    sendRequest(req, userId) {
        return this.partners.sendRequest(req.user.id, userId);
    }
    accept(req, pairId) {
        return this.partners.accept(pairId, req.user.id);
    }
    decline(req, pairId) {
        return this.partners.decline(pairId, req.user.id);
    }
    remove(req, pairId) {
        return this.partners.remove(pairId, req.user.id);
    }
};
exports.PartnersController = PartnersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PartnersController.prototype, "getPartners", null);
__decorate([
    (0, common_1.Get)('requests'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PartnersController.prototype, "getRequests", null);
__decorate([
    (0, common_1.Get)('status/:targetId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('targetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PartnersController.prototype, "getPairStatus", null);
__decorate([
    (0, common_1.Post)('request/:userId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PartnersController.prototype, "sendRequest", null);
__decorate([
    (0, common_1.Patch)('accept/:pairId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('pairId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PartnersController.prototype, "accept", null);
__decorate([
    (0, common_1.Patch)('decline/:pairId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('pairId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PartnersController.prototype, "decline", null);
__decorate([
    (0, common_1.Delete)(':pairId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('pairId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PartnersController.prototype, "remove", null);
exports.PartnersController = PartnersController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('partners'),
    __metadata("design:paramtypes", [partners_service_1.PartnersService])
], PartnersController);
//# sourceMappingURL=partners.controller.js.map