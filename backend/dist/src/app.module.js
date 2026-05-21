"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./prisma/prisma.module");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const tasks_module_1 = require("./tasks/tasks.module");
const friends_module_1 = require("./friends/friends.module");
const status_module_1 = require("./status/status.module");
const messages_module_1 = require("./messages/messages.module");
const gateway_module_1 = require("./gateway/gateway.module");
const rooms_module_1 = require("./rooms/rooms.module");
const admin_module_1 = require("./admin/admin.module");
const posts_module_1 = require("./posts/posts.module");
const labels_module_1 = require("./labels/labels.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            prisma_module_1.PrismaModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            tasks_module_1.TasksModule,
            friends_module_1.FriendsModule,
            status_module_1.StatusModule,
            messages_module_1.MessagesModule,
            gateway_module_1.GatewayModule,
            rooms_module_1.RoomsModule,
            admin_module_1.AdminModule,
            posts_module_1.PostsModule,
            labels_module_1.LabelsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map