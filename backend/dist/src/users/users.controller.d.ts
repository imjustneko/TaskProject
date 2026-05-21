import type { Request as ExpressRequest } from 'express';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import type { SafeUser } from './users.service';
interface AuthRequest extends ExpressRequest {
    user: SafeUser;
}
export declare class UsersController {
    private readonly users;
    constructor(users: UsersService);
    me(req: AuthRequest): SafeUser;
    updateMe(req: AuthRequest, dto: UpdateProfileDto): Promise<SafeUser>;
    uploadAvatar(req: AuthRequest, file: Express.Multer.File): Promise<SafeUser>;
    search(req: AuthRequest, q: string): Promise<SafeUser[]>;
    getByUsername(username: string): Promise<SafeUser | null>;
}
export {};
