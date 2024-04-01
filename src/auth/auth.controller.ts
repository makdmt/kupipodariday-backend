import { Controller, UseGuards, Post, Req, Body } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LocalGuard } from './passport-strategies/local-guard';
import { Request } from 'express';
import { SignUpDto } from './dto/signup.dto';

@Controller()
export class AuthController {
    constructor(
        private userService: UsersService,
        private authService: AuthService
    ) { }

    @UseGuards(LocalGuard)
    @Post('signin')
    signin(@Req() req: Request) {
        return this.authService.auth(req.user);
    }

    @Post('signup')
    async signup(@Body() createUserDto: SignUpDto) {
        const user = await this.userService.create(createUserDto);
        return this.authService.auth(user);
    }


}
