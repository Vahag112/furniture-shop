import { Controller, Get, UseGuards } from '@nestjs/common';
import { ShoppingService } from '../shopping/shopping.service';
import { AdminGuard } from './guards/admin.guard';
import { isLoggedIn } from '../auth/guards/auth.guards';


@UseGuards(isLoggedIn, AdminGuard)
@Controller('admin')
export class AdminController {
    constructor(private readonly shoppingService: ShoppingService){}


    @Get('users-shopping')
    getUsersShopping(){
        return this.shoppingService.getUsersShopping()
    }
}
