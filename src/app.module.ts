import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module'

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [AuthModule]
})
export class AppModule { }
