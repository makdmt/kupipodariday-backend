import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { AuthUserId } from 'src/shared/custom.decorators';
import { User } from 'src/users/entities/user.entity';
import { JwtGuard } from 'src/auth/passport-strategies/jwt-guard';

@UseGuards(JwtGuard)
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) { }

  @Post()
  create(@AuthUserId() user: User, @Body() createWishDto: CreateWishDto) {
    return this.wishesService.create({ ...createWishDto, owner: user });
  }

  @Get()
  findAll() {
    return this.wishesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWishDto: UpdateWishDto) {
    return this.wishesService.update(+id, updateWishDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wishesService.remove(+id);
  }
}
