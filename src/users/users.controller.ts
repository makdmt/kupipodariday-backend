import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { PatchUserDto } from './dto/patch-user.dto';
import { JwtGuard } from '../auth/passport-strategies/jwt-guard';
import { AuthUserId } from 'src/shared/custom.decorators';
import { User } from './entities/user.entity';
import { RemoveUserEmailAndPasswordInterceptor } from './users.interceptors';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseInterceptors(RemoveUserEmailAndPasswordInterceptor)
  @Get('me')
  findMe(@AuthUserId() id: User['id']) {
    return this.usersService.findById(id);
  }

  @Patch('me')
  async patchMe(@AuthUserId() id: User['id'], @Body() patchUserDto: PatchUserDto) {
    await this.usersService.updateOne(id, patchUserDto);
    // return this.usersService.findOne()
  }



  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
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
