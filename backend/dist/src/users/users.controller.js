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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const users_service_1 = require("./users.service");
const update_profile_dto_1 = require("./dto/update-profile.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let UsersController = class UsersController {
    users;
    constructor(users) {
        this.users = users;
    }
    me(req) {
        return req.user;
    }
    updateMe(req, dto) {
        return this.users.updateProfile(req.user.id, dto);
    }
    async uploadAvatar(req, file) {
        if (!file)
            throw new common_1.BadRequestException('No file uploaded');
        const port = process.env.PORT ?? 3001;
        const baseUrl = `${req.protocol}://${req.hostname}:${port}`;
        const avatarUrl = `${baseUrl}/uploads/avatars/${file.filename}`;
        return this.users.updateProfile(req.user.id, { avatarUrl });
    }
    listEmojis(req) {
        return this.users.getEmojis(req.user.id);
    }
    async addEmoji(req, name, file) {
        if (!file)
            throw new common_1.BadRequestException('No file uploaded');
        if (!name?.trim())
            throw new common_1.BadRequestException('Emoji name required');
        const port = process.env.PORT ?? 3001;
        const baseUrl = `${req.protocol}://${req.hostname}:${port}`;
        const imageUrl = `${baseUrl}/uploads/emojis/${file.filename}`;
        return this.users.addEmoji(req.user.id, name.trim().toLowerCase().replace(/\s+/g, '_'), imageUrl);
    }
    deleteEmoji(req, id) {
        return this.users.deleteEmoji(id, req.user.id);
    }
    search(req, q) {
        return this.users.search(q ?? '', req.user.id);
    }
    getByUsername(req, username) {
        return this.users.findByUsername(username, req.user.id);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "me", null);
__decorate([
    (0, common_1.Patch)('me'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_profile_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateMe", null);
__decorate([
    (0, common_1.Post)('me/avatar'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: (0, path_1.join)(process.cwd(), 'uploads', 'avatars'),
            filename: (_, file, cb) => {
                const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, `${unique}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: (_, file, cb) => {
            if (file.mimetype.startsWith('image/'))
                cb(null, true);
            else
                cb(new common_1.BadRequestException('Only image files are allowed'), false);
        },
    })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "uploadAvatar", null);
__decorate([
    (0, common_1.Get)('me/emojis'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "listEmojis", null);
__decorate([
    (0, common_1.Post)('me/emojis'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: (0, path_1.join)(process.cwd(), 'uploads', 'emojis'),
            filename: (_, file, cb) => {
                cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
        limits: { fileSize: 256 * 1024 },
        fileFilter: (_, file, cb) => {
            if (file.mimetype.startsWith('image/'))
                cb(null, true);
            else
                cb(new common_1.BadRequestException('Only image files'), false);
        },
    })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('name')),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "addEmoji", null);
__decorate([
    (0, common_1.Delete)('me/emojis/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "deleteEmoji", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "search", null);
__decorate([
    (0, common_1.Get)(':username'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getByUsername", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map