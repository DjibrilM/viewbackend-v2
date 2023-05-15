import { Module } from "@nestjs/common";
import { AuthController } from './auth.controller'
import { AuthServices } from './auth.service'
import { PrismaService } from '../prisma-client/prisma.service'
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';


@Module({
    providers: [AuthServices, PrismaService],
    controllers: [AuthController],
    imports: [JwtModule.register({ secret: "jwtkeytoken", global: true }), ScheduleModule.forRoot()
    ],

})
export class AuthModule { }

