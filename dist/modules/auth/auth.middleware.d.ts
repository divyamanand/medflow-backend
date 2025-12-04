import { NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { RefreshToken } from '../../entities/refresh-token.entity';
import { AuthService } from './auth.service';
export declare class AuthMiddleware implements NestMiddleware {
    private readonly jwt;
    private refreshRepo;
    private readonly authSvc;
    constructor(jwt: JwtService, refreshRepo: Repository<RefreshToken>, authSvc: AuthService);
    use(req: any, res: any, next: () => void): Promise<void>;
}
