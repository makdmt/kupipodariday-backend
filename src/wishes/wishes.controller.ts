import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, NotFoundException, UseInterceptors } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { AuthUser, AuthUserId } from 'src/shared/custom.decorators';
import { User } from 'src/users/entities/user.entity';
import { JwtGuard } from 'src/auth/passport-strategies/jwt-guard';
import { UserId, WishId } from 'src/shared/shared.types';
import { RemoveHiddenOffersInterceptor } from './wishes.interceptors';


@UseInterceptors(RemoveHiddenOffersInterceptor)
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

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  copy(@AuthUser() user: User, @Param('id') wishId: WishId) {
    return this.wishesService.duplicateOne(wishId, user);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const wish = await this.wishesService.findOne({
      relations: {
        owner: true,
        offers: true
      },
      where: { id }
    });

    if (!wish) throw new NotFoundException();
    return wish;
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(@Param('id') id: string, @AuthUserId() userId: UserId, @Body() updateWishDto: UpdateWishDto) {
    return this.wishesService.updateOne(+id, userId, updateWishDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @AuthUserId() userId: UserId) {
    return this.wishesService.removeOne(+id, userId);
  }

  @UseGuards(JwtGuard)
  @Post()
  create(@AuthUserId() user: User, @Body() createWishDto: CreateWishDto) {
    return this.wishesService.create(createWishDto, user);
  }
}
