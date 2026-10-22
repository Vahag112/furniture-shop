import { Injectable, NestMiddleware } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth/auth.service";

@Injectable()
export class LoadCurrentUser implements NestMiddleware{
    constructor(private readonly jwtService: JwtService, private readonly authService: AuthService ){}
    async use(req: Request, res: Response, next: NextFunction) {
        const token = req.cookies?.accessToken

        if(token){
            let decoded
            try {
                decoded =await this.jwtService.verifyAsync(token, {secret: process.env.ASECRET})
            } catch {
                ;
            }
            const user = await this.authService.getUser(decoded.name)
            
            if(user){
                req.user = {
                   username: user.username,
                   id: (user.id).toString(),
                   avatar: user.avatar || null,
                   role: user.role
                }
            }

        }

        next()
    }
}