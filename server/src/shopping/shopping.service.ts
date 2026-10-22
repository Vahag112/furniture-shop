import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ShoppingService {
    constructor(private readonly prismaService: PrismaService) { }

    async getShoppings(userId: number) {
        return await this.prismaService.shopping.findMany({
            where: {
                userId
            },
            include: {
                product: true
            }
        })
    }

    async addShoppingItem(userId: number, productId: number) {
        return await this.prismaService.shopping.upsert({
            where: {
                userId_productId: {
                    userId,
                    productId,

                }
            },
            create: {
                userId,
                productId,
                quantity: 1
            },
            update: {
                quantity: {
                    increment: 1
                }
            }
        })
    }


    async removeShoppingItem(userId: number, productId: number) {
        return await this.prismaService.shopping.delete({
            where: {
                userId_productId: {
                    userId,
                    productId
                }
            }
        })
    }



    async updateQuantity(id: number, quantity: number, userId: number) {
        if (!Number.isInteger(quantity) || quantity < 1) {
            throw new BadRequestException('Quantity must be at least 1')
        }

        const shopping = await this.prismaService.shopping.findFirst({
            where: {
                id,
                userId
            }
        })

        if(!shopping){
            throw new NotFoundException('Shopping item not found')
        }

        return this.prismaService.shopping.update({
            where: { id },
            data: { quantity }
        })

    }


       async getUsersShopping() {
        const users = await this.prismaService.user.findMany({
            select: {
                id: true,
                username: true,
                shoppings: {
                    select: {
                        quantity: true,
                        product: {
                            select: {
                                id: true,
                                title: true,
                                price: true,
                            },
                        },
                    },
                },
            },
        });

        return users.map((user) => {
            const productsCount = user.shoppings.reduce((sum, item) => sum + item.quantity,0);

            const totalPrice = user.shoppings.reduce((sum, item) =>sum + Number(item.product.price) * item.quantity,0);

            return {
                id: user.id,
                username: user.username,
                productsCount,
                totalPrice,
                shopping: user.shoppings.map((item) => ({
                    productId: item.product.id,
                    title: item.product.title,
                    price: item.product.price,
                    quantity: item.quantity,
                }))
            };
        });
    }
}
