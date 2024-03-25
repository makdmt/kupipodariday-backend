import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offerf } from './entities/offer.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Offerf])],
  controllers: [OffersController],
  providers: [OffersService],
})
export class OffersModule { }
