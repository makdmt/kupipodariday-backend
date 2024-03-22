import { Controller, UseGuards, Post, Req, Body } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LocalGuard } from './local-guard';
import { Request } from 'express';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller()
export class AuthController {
    constructor(
        private userService: UsersService,
        private authService: AuthService
    ) {}

    @UseGuards(LocalGuard)
    @Post('signin')
    signin(@Req() req: Request) {
        return this.authService.auth(req.user);
    }

    @Post('signup')
    async signup(@Body() createUserDto: CreateUserDto) {
        const user = await this.userService.create(createUserDto);
        return this.authService.auth(user);
    }


}
