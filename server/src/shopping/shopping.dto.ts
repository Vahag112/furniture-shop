import { IsInt, Min } from "class-validator";


export class AddShoppingDto{
    @IsInt()
    @Min(1)
    productId!: number
}