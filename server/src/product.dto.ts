import { Type } from "class-transformer";
import { IsInt, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateProductDto {
    @IsString()
    title!: string;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    price!: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    oldPrice?: number | null;


    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    discount?: number | null;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    categoryId?: number | null;
}




export class UpdateProductDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    price?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    oldPrice?: number | null;

    @IsOptional()
    @IsInt()
    discount?: number | null;

    @IsOptional()
    @IsString()
    img?: string;

    @IsOptional()
    @IsInt()
    categoryId?: number;
}