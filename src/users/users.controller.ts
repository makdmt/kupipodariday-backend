import { Controller, Get, Post, Body, Patch, Param, UseGuards, UseInterceptors, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PatchUserDto } from './dto/patch-user.dto';
import { JwtGuard } from '../auth/passport-strategies/jwt-guard';
import { AuthUserId } from 'src/shared/custom.decorators';
import { RemoveUserPasswordInterceptor } from './users.interceptors';
import { FindUsersDto } from './dto/find-users.dto';
import { UserId } from 'src/shared/shared.types';

@UseGuards(JwtGuard)
@UseInterceptors(RemoveUserPasswordInterceptor)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  @Get('me/wishes')
  getMyWishes(@AuthUserId() userId: UserId) {
    return this.usersService.userWishes("user.id = :userId", { userId });
  }

  @Get(':username/wishes')
  getUserWishes(@Param('username') username: string) {
    return this.usersService.userWishes("user.username = :username", { username });
  }

  @Get('me')
  findMe(@AuthUserId() id: UserId) {
    return this.usersService.findById(id);
  }

  @Patch('me')
  async patchMe(@AuthUserId() id: UserId, @Body() patchUserDto: PatchUserDto) {
    return this.usersService.updateOne(id, patchUserDto);
  }

  @Get(':username')
  async findOne(@Param('username') username: string) {
    const user = await this.usersService.findOne({ where: { username } });
    if (!user) throw new NotFoundException();
    return user;
  }

  @Post('find')
  findMany(@Body() { query }: FindUsersDto) {
    return this.usersService.findByEmailOrUsername(query);
  }
}
