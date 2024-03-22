import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt-strategy.service';
import { LocalStrategy } from './local-strategy.service';
import { AuthController } from './auth.controller';
import { JwtConfigFactory } from '../config/jwt-module-config.factory';


@Module({
    imports: [
        UsersModule,
        PassportModule,
        // JwtModule.register({
            // secret: 'super secret key!!',
            // global: true,
            // signOptions: { expiresIn: '60s'},
        JwtModule.registerAsync({
            useClass: JwtConfigFactory,
        })
    ],
    providers: [AuthService, JwtStrategy, LocalStrategy],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule { }
