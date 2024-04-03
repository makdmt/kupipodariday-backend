import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, NotFoundException } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtGuard } from 'src/auth/passport-strategies/jwt-guard';
import { AuthUser } from 'src/shared/custom.decorators';
import { User } from 'src/users/entities/user.entity';

@UseGuards(JwtGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) { }


  @Post()
  create(@AuthUser() user: User, @Body() createWishlistDto: CreateWishlistDto) {
    return this.wishlistsService.create(user, createWishlistDto);
  }

  @Patch(':id')
  update(@AuthUser() user: User, @Body() updateWishlistDto: UpdateWishlistDto, @Param('id') id: number) {
    return this.wishlistsService.updateOne(user, id, updateWishlistDto);
  }

  @Delete(':id')
  delete(@AuthUser() user: User, @Param('id') id: number) {
    return this.wishlistsService.removeOne(user, id);
  }

  @Get()
  findAll() {
    return this.wishlistsService.findMany({
      relations: {
        owner: true,
        items: true
      }
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const wishlist = await this.wishlistsService.findOne({
      relations: {
        owner: true,
        items: true
      },
      where: { id }
    });

    if (!wishlist) throw new NotFoundException()
    return wishlist;
  }

}
