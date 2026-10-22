import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ShoppingService } from './shopping.service';
import { AddShoppingDto } from './shopping.dto';
import type { Request } from 'express';
import { isLoggedIn } from '../auth/guards/auth.guards';

@Controller('shopping')
export class ShoppingController {
    constructor(private readonly shoppingService: ShoppingService){}

    @UseGuards(isLoggedIn)
    @Post()
    async addShopping(@Req() req: Request, @Body() body: AddShoppingDto ){
        const userId = Number(req.user!.id) 

        return await this.shoppingService.addShoppingItem(userId, body.productId)

    }

    @UseGuards(isLoggedIn)
    @Get()
    async shoppings(@Req() req: Request){
        return await this.shoppingService.getShoppings(Number(req.user!.id))
    }


    @UseGuards(isLoggedIn)
    @Delete(':productId')
    async removeShopping(@Req() req: Request, @Param('productId') productId: string){
        try {
            await this.shoppingService.removeShoppingItem(Number(req.user!.id), Number(productId) )
            
        } catch {
            throw new NotFoundException('Not found')
        }
        return {message: 'deleted'}

    }

    @UseGuards(isLoggedIn)
    @Patch(':id')
    async updateShoppingQuantity(@Param('id', ParseIntPipe) id: number, @Body() body: {quantity: number}, @Req() req: Request ){
        return this.shoppingService.updateQuantity(id, body.quantity, Number(req.user!.id) )
    }

}
