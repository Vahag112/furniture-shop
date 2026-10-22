import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaModule } from '../prisma.module';

@Module({
    imports: [PrismaModule, JwtModule.register({})],
    controllers:[AuthController],
    providers:[ AuthService, JwtService],
    exports: [
        AuthService, JwtModule
    ]
})
export class AuthModule {}
