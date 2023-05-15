import { Controller, Post, Body, Response, HttpCode } from "@nestjs/common";
import { registerDto, loginRegister, restTokenDto } from "./dto/auth.dto";
import { AuthServices } from "./auth.service";
import { Response as responseType } from "express";
import { registerInteface, loginControllerInterface } from './interfaces/auth.interface';
import { authKeyName } from './constants';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthServices) { }
    @Post('register')
    async register(@Body() body: registerDto, @Response({ passthrough: true }) res: responseType): Promise<registerInteface | any> {
        const register = await this.authService.register(body.name, body.email, body.password);
        //send auth cooke
        res.cookie('authCookie', register.cookiePaylad);

        return res.status(202).json({
            name: register.name,
            emai: register.email,
            id: register.id,
            authToken: register.authToken,
        })
    };

    @Post("login")
    async login(@Body() body: loginRegister, @Response({ passthrough: true }) res: responseType): Promise<loginControllerInterface | any> {
        const login = await this.authService.login(body.email, body.password);
        res.cookie(authKeyName, login.cookiePaylad);

        return res.status(200).json({
            email: login.email,
            name: login.name,
            id: login.id,
            authToken: login.authToken,
            profileImage: login.profileImage,
        })

    };

    @HttpCode(202)
    @Post('createResetToken')
    async createResetPassword(@Body() body: restTokenDto): Promise<string> {
        return this.authService.createForgotenPasswordToken(body.email, body.password);
    }
}