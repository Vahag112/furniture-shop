import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class isLoggedIn implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest() as Request
        if (!req.user) {
            throw new UnauthorizedException()
        }

        return true
    }
}

export class isGuest implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest() as Request
        if (req.user) {
            throw new ForbiddenException()
        }
        return true
    }
}


export class checkAvatar implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest() as Request

        if (!req.user!.avatar) {
            throw new NotFoundException()
        }

        return true

    }
}


