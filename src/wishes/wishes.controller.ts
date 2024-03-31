import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { AuthUserId } from 'src/shared/custom.decorators';
import { User } from 'src/users/entities/user.entity';
import { JwtGuard } from 'src/auth/passport-strategies/jwt-guard';
import { UserId } from 'src/shared/shared.types';

@UseGuards(JwtGuard)
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) { }

  @Get('last')
  getLast() {
    return this.wishesService.findLast();
  }

  @Get('top')
  getTop() {
    return this.wishesService.findPopular();
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    // return this.wishesService.findOneById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @AuthUserId() userId: UserId, @Body() updateWishDto: UpdateWishDto) {
    return this.wishesService.updateOne(+id, userId, updateWishDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @AuthUserId() userId: UserId) {
    return this.wishesService.removeOne(+id, userId);
  }

  @Post()
  create(@AuthUserId() user: User, @Body() createWishDto: CreateWishDto) {
    return this.wishesService.create({ ...createWishDto, owner: user });
  }

}
