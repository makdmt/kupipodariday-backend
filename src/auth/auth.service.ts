import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isCorrectHash } from 'src/shared/hash';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UsersService
    ) { }

    auth(user: User) {
        return { access_token: this.jwtService.sign({ sub: user.id }) }
    }

    async validatePassword(username: string, password: string) {
        const user = await this.userService.findByUsername(username);
        if (!user || !isCorrectHash(user.password, password)) throw new UnauthorizedException('wrong username or password');
        delete user.password;
        return user;
    }
}
