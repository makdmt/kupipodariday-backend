import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PatchUserDto } from './dto/patch-user.dto';
import { JwtGuard } from '../auth/passport-strategies/jwt-guard';
import { AuthUserId } from 'src/shared/custom.decorators';
import { User } from './entities/user.entity';
import { RemoveUserPasswordInterceptor, RemoveUserEmailInterceptor } from './users.interceptors';
import { FindUsersDto } from './dto/find-users.dto';
import { UserId } from 'src/shared/shared.types';

@UseGuards(JwtGuard)
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

  @UseInterceptors(
    RemoveUserPasswordInterceptor,
    RemoveUserEmailInterceptor)
  @Get('me')
  findMe(@AuthUserId() id: User['id']) {
    return this.usersService.findById(id);
  }

  @UseInterceptors(
    RemoveUserPasswordInterceptor
  )
  @Patch('me')
  async patchMe(@AuthUserId() id: User['id'], @Body() patchUserDto: PatchUserDto) {
    await this.usersService.updateOne(id, patchUserDto);
    return this.usersService.findById(id);
  }

  @UseInterceptors(
    RemoveUserPasswordInterceptor,
    RemoveUserEmailInterceptor)
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: PatchUserDto) {
    // return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
