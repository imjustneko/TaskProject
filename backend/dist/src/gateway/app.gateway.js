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
exports.AppGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const messages_service_1 = require("../messages/messages.service");
let AppGateway = class AppGateway {
    jwt;
    config;
    messages;
    server;
    constructor(jwt, config, messages) {
        this.jwt = jwt;
        this.config = config;
        this.messages = messages;
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth?.token ??
                client.handshake.headers?.authorization?.replace('Bearer ', '');
            const payload = this.jwt.verify(token, {
                secret: this.config.getOrThrow('JWT_SECRET'),
            });
            client.userId = payload.sub;
            client.join(`user:${client.userId}`);
        }
        catch {
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        if (client.userId) {
            this.server.emit('user:offline', { userId: client.userId });
        }
    }
    handleJoinRoom(client, data) {
        client.join(`room:${data.roomId}`);
        return { event: 'joined', data: { roomId: data.roomId } };
    }
    handleLeaveRoom(client, data) {
        client.leave(`room:${data.roomId}`);
    }
    async handleMessage(client, data) {
        if (!client.userId)
            return;
        const dto = { content: data.content };
        if (data.roomId) {
            const msg = await this.messages.sendRoomMessage(data.roomId, client.userId, dto);
            this.server.to(`room:${data.roomId}`).emit('message:new', msg);
        }
        else if (data.recipientId) {
            const msg = await this.messages.sendDM(client.userId, data.recipientId, dto);
            this.server.to(`user:${data.recipientId}`).emit('message:new', msg);
            this.server.to(`user:${client.userId}`).emit('message:new', msg);
        }
    }
    handleTypingStart(client, data) {
        client.to(data.chatId).emit('typing:indicator', {
            userId: client.userId,
            chatId: data.chatId,
            isTyping: true,
        });
    }
    handleTypingStop(client, data) {
        client.to(data.chatId).emit('typing:indicator', {
            userId: client.userId,
            chatId: data.chatId,
            isTyping: false,
        });
    }
    emitStatusUpdate(userId, status) {
        this.server.emit('status:changed', { userId, status });
    }
};
exports.AppGateway = AppGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], AppGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join:room'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AppGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave:room'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AppGateway.prototype, "handleLeaveRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('send:message'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing:start'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AppGateway.prototype, "handleTypingStart", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing:stop'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AppGateway.prototype, "handleTypingStop", null);
exports.AppGateway = AppGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: '*', credentials: true },
        namespace: '/',
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService,
        messages_service_1.MessagesService])
], AppGateway);
//# sourceMappingURL=app.gateway.js.map