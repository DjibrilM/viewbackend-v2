import { IsEmail, IsNotEmpty } from "class-validator";

export class registerDto {
    @IsEmail()
    email: string

    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    password: string
}

export class loginRegister {
    @IsEmail()
    email: string

    @IsNotEmpty()
    password: string
}

export class restTokenDto {
    @IsEmail()
    email: string

    @IsNotEmpty()
    password: string
}