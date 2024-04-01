import { Controller, Get, Post, Body, Param, UseGuards, NotFoundException } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { AuthUser, AuthUserId } from 'src/shared/custom.decorators';
import { User } from 'src/users/entities/user.entity';
import { JwtGuard } from 'src/auth/passport-strategies/jwt-guard';
import { UserId } from 'src/shared/shared.types';

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
  async findOne(@Param('id') offerId: string, @AuthUserId() userId: UserId) {
    const offer = await this.offersService.findOne({
      relations: { user: true },
      where: {
        id: offerId,
        user: {
          id: userId
        }
      }
    });
    if (!offer) throw new NotFoundException();
    return offer;
  }
}
