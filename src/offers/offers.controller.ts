import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { AuthUser } from 'src/shared/custom.decorators';
import { User } from 'src/users/entities/user.entity';
import { JwtGuard } from 'src/auth/passport-strategies/jwt-guard';

@UseGuards(JwtGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) { }

  @Post()
  create(@AuthUser() user: User, @Body() createOfferDto: CreateOfferDto) {
    return this.offersService.create(user, createOfferDto);
  }

  @Get()
  findAll() {
    return this.offersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offersService.findOne({ where: { id } });
  }
}
