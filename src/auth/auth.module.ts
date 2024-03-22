import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt-strategy.service';

@Module({
    imports: [UsersModule, PassportModule],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService]
})
export class AuthModule {}
