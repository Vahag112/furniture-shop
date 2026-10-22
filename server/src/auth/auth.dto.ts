import { Transform } from 'class-transformer'
import { IsNotEmpty, IsString } from 'class-validator'

export class RegisterDto {
    @IsString()
    @Transform(({ value }) => value.trim())
    @IsNotEmpty({ message: 'Fill the field' })
    username!: string

    @IsString()
    @Transform(({ value }) => value.trim())
    @IsNotEmpty({ message: 'Fill the field' })
    password!: string

    @IsString()
    @Transform(({ value }) => value.trim())
    @IsNotEmpty({ message: 'Fill the field' })
    password2!: string
}

export class LoginDto{
    @IsString()
    @Transform(({value}) => value.trim())
    @IsNotEmpty({message: 'Fill the Field'})
    username!: string

    @IsString()
    @Transform(({value}) => value.trim())
    @IsNotEmpty({message: 'Fill the field'})
    password!: string
}
