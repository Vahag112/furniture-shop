import { CanActivate, ExecutionContext, ForbiddenException, UseGuards } from "@nestjs/common";
import { isLoggedIn } from "../../auth/guards/auth.guards";


export class AdminGuard implements CanActivate{
    canActivate(context: ExecutionContext): boolean  {
        const req = context.switchToHttp().getRequest()

        if(req.user?.role !== 'admin'){
            throw new ForbiddenException()
        }
        return true

    }
}