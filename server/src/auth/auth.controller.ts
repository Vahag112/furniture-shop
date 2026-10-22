import { BadRequestException, Body, ConflictException, Controller, Delete, Get, HttpCode, Post, Req, Res, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { randomBytes, timingSafeEqual } from 'crypto';
import { LoginDto, RegisterDto } from './auth.dto';
import { compareTokenHash, hashToken, pbkdf2Promisified } from '../utility';
import type { CookieOptions, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { checkAvatar, isGuest, isLoggedIn } from './guards/auth.guards';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

const cookieOpts: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
}

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly jwtService: JwtService) { }

    @UseGuards(isGuest)
    @Post('register')
    @HttpCode(201)
    async register(@Body() body: RegisterDto) {
        console.log('register');
        console.log(body);
        console.log(body.username);


        const existingUser = await this.authService.getUser(body.username)

        if (existingUser) {
            throw new ConflictException({
                errors: {
                    username: {
                        msg: 'Username already exists'
                    }
                }
            })
        }

        if (body.password !== body.password2) {
            throw new ConflictException({
                errors: {
                    password2: {
                        msg: "Passwords don't match"
                    }
                }
            })
        }

        const salt = randomBytes(16)
        const hash = await pbkdf2Promisified(body.password, salt)

        const item = {
            username: body.username,
            password: hash,
            salt
        }
        console.log('register');

        await this.authService.addUser(item)
        return {
            message: 'Signed up'
        }
    }


    @UseGuards(isGuest)
    @Post('login')
    @HttpCode(200)
    async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {

        const user = await this.authService.getUser(body.username)

        if (!user) {
            throw new UnauthorizedException('Invalid username or password')
        }

        const savedPassword = Buffer.from(user.password)
        const salt = Buffer.from(user.salt)
        const password = await pbkdf2Promisified(body.password, salt)

        if (!timingSafeEqual(savedPassword, password)) {
            throw new UnauthorizedException({
                errors: {
                    password: {
                        msg: 'Wrong password'
                    }
                }
            })
        }

        const payload = {
            name: user.username,
            id: user.id.toString()
        }


        const accessToken = await this.jwtService.signAsync(payload, { secret: process.env.ASECRET, expiresIn: '15m' })
        const refreshToken = await this.jwtService.signAsync(payload, { secret: process.env.RSECRET, expiresIn: '3d' })

        await this.authService.setRefreshTokenHash(user.username, hashToken(refreshToken))

        res.cookie('accessToken', accessToken, { ...cookieOpts, maxAge: 1000 * 60 * 15 })
        res.cookie('refreshToken', refreshToken, { ...cookieOpts, maxAge: 1000 * 60 * 60 * 24 * 3 })

        return {
            username: user.username,
            id: user.id,
            avatar: user?.avatar,
            role:   user.role

        }



    }

    @Post('refresh')
    @HttpCode(200)
    async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const token = req.cookies?.refreshToken

        if (!token) {
            throw new UnauthorizedException('Refresh token missing')
        }

        let decoded;

        try {
            decoded = await this.jwtService.verifyAsync(token, { secret: process.env.RSECRET })
        } catch {
            throw new UnauthorizedException('Invalid token')
        }

        const user = await this.authService.getUser(decoded.name)

        if (!user || !user.refreshTokenHash || !compareTokenHash(token, user.refreshTokenHash)) {
            if (user) await this.authService.setRefreshTokenHash(user.username, null);
            throw new UnauthorizedException('Refresh Token revoked')

        }

        const payload = {
            name: user.username,
            id: user.id.toString()
        }

        const newAccessToken = await this.jwtService.signAsync(payload, { secret: process.env.ASECRET, expiresIn: '15m' })
        const newRefreshToken = await this.jwtService.signAsync(payload, { secret: process.env.RSECRET, expiresIn: '3d' })

        await this.authService.setRefreshTokenHash(user.username, hashToken(newRefreshToken))

        res.cookie('accessToken', newAccessToken, { ...cookieOpts, maxAge: 1000 * 60 * 15 })
        res.cookie('refreshToken', newRefreshToken, { ...cookieOpts, maxAge: 1000 * 60 * 60 * 24 * 3 })

        return {
            message: 'token refreshed'
        }
    }

    @Post('logout')
    @HttpCode(200)
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const token = req.cookies?.refreshToken

        if (token) {
            let decoded
            try {
                decoded = await this.jwtService.verifyAsync(token, { secret: process.env.RSECRET })

                const user = await this.authService.getUser(decoded.name)
                if (user) {
                    await this.authService.setRefreshTokenHash(user.username, null)
                }
            } catch {
                ;
            }

        }

        res.clearCookie('accessToken', { ...cookieOpts })
        res.clearCookie('refreshToken', { ...cookieOpts })

        return {
            message: 'logged out'
        }
    }

    @UseGuards(isLoggedIn)
    @Get('me')
    async me(@Req() req: Request) {
        return {
            username: req.user!.username,
            id: req.user!.id,
            avatar: req.user?.avatar,
            role: req.user!.role
        }
    }

    @UseGuards(isLoggedIn)
    @Post('avatar')
    @UseInterceptors(
        FileInterceptor('avatar', {
            storage: diskStorage({
                destination: './uploads/avatars',
                filename: (req, file, cb) => {
                    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`
                    cb(null, uniqueName)
                }
            }),
            limits: {
                fileSize: 2 * 1024 * 1024
            },

            fileFilter: (req, file, cb) => {
                if (!file.mimetype.startsWith('image/')) {
                    return cb(
                        new Error('only image file are allowed'),
                        false
                    )
                }
                cb(null, true)
            },


        }),
    )
    async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
        if (!file) {
            throw new BadRequestException('Avatar file is required');
        }


        const avatar = `/uploads/avatars/${file.filename}`;

        return this.authService.updateAvatar(Number(req.user!.id), avatar);
    }


    @UseGuards(isLoggedIn)
    @UseGuards(checkAvatar)
    @Delete('avatar')
    async removeAvatar(@Req() req: Request) {

      return await this.authService.deleteAvatar(Number(req.user!.id));

    }


}
