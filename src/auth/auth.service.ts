
import { PrismaService } from "src/prisma-client/prisma.service";
import {
    HttpException,
    Injectable,
    NotFoundException,
    UnauthorizedException

} from "@nestjs/common";
import { HttpStatus } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare, encrypt } from '../helpers/bcrypt';
import { loginInterface } from './interfaces/auth.interface';
import { resetpasswordToken } from "src/helpers/generateRandomNumber";
import { sendRsetToken } from "src/helpers/email";




@Injectable()
export class AuthServices {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService) { };

    async register(name: string, email: string, password: string): Promise<any> {
        try {
            //find if thre is a new user with the provided email address
            const user = await this.prisma.user.findFirst({
                where: {
                    email: { equals: email }
                }
            });

            if (user) {
                const error = new Error("User with this email address already exit");
                throw error;
            }

            const hashedPassword = await encrypt(password);
            const newUser = await this.prisma.user.create({
                data: {
                    email: email,
                    name: name,
                    password: hashedPassword
                },
                select: {
                    email: true,
                    name: true,
                    id: true,
                    profileImage: true,
                    location: true
                }
            });

            //jwt payload
            const payload = { ...newUser };
            const cookiePayload = { ...newUser, cooieIdentifier: new Date() };
            return {
                ...newUser,
                authToken: await this.jwtService.signAsync(payload),
                cookiePaylad: cookiePayload,
            }
        } catch (error: unknown | any) {
            throw new HttpException({
                status: HttpStatus.FORBIDDEN,
                error: error.message,
            }, HttpStatus.FORBIDDEN, {
                cause: error
            });
        }
    }

    async login(email: string, password: string): Promise<loginInterface> {
        //find the user 
        const user = this.prisma.user.findFirst({
            where: {
                email: {
                    equals: email
                }
            }
        });

        if (!user) {
            const error = new Error("user with this email not found.");
            throw new HttpException({
                status: 404,
                error: error.message
            }, HttpStatus.NOT_FOUND, {
                cause: error,
            })
        };

        const comparePassword = await compare(password, (await user).password);
        if (!comparePassword) {
            const error = new Error("Inavlid password.");
            throw new HttpException({
                status: 403,
                error: error.message
            }, HttpStatus.NOT_FOUND, {
                cause: error,
            });
        }

        const payload = { ...user, password: null };
        const cookiePayload: any = { ...user, password: null, cooieIdentifier: new Date() };

        return {
            email: (await user).email,
            name: (await user).email,
            id: (await user).id,
            authToken: await this.jwtService.signAsync(payload),
            cookiePaylad: cookiePayload,
            profileImage: (await user).profileImage,
            location: (await user).profileImage
        }
    }



    async createForgotenPasswordToken(email: string, password: string): Promise<string> {
        const user = this.prisma.user.findFirst({
            where: {
                email: {
                    equals: email
                }
            }
        })

        //check if there is an existing user with the provided email address!
        if (!user) {
            throw new NotFoundException("User with this email does not exist.");
        }

        //validate the provided password
        const comparePassword = await compare(password, (await user).password);
        if (!comparePassword) {
            throw new UnauthorizedException("Wrong password.");
        }
        //generate token 
        const newToken = resetpasswordToken();
        await this.prisma.user.update({
            where: { email: email }, data: {
                restToken: newToken
            }
        });

        //send token via email
        try {
            await sendRsetToken(email, newToken);
        } catch (error) {
            //if fail to send the message delete the token directly
            await this.prisma.user.update({
                where: {
                    email: email
                },
                data: {
                    restToken: null
                }
            });
            throw new HttpException('Faild', HttpStatus.FAILED_DEPENDENCY);
        }

        setTimeout(() => {
            this.prisma.user.update({
                where: {
                    email: email
                },
                data: {
                    restToken: null
                }
            })
        }, 1000 * 12);

        return "Token sent"
    }
}