import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOneOptions, Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class OffersService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,

    private readonly wishesService: WishesService
  ) { }

  async create(user: User, createOfferDto: CreateOfferDto) {
    const wish = await this.wishesService.findOne(
      {
        where: { id: createOfferDto.itemId },
        relations: { owner: true }
      });
    if (!wish) throw new NotFoundException();
    if (this.wishesService.isOwner(wish, user.id)) throw new ForbiddenException('donate to own wish is prohibited');

    const donateLimit = this.calcDonateLimit(wish);
    if (createOfferDto.amount > donateLimit) throw new ForbiddenException(`donate limit is ${donateLimit}`)

    createOfferDto['item'] = wish;
    createOfferDto['user'] = user;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect()
    await queryRunner.startTransaction();

    try {
      await Promise.all([
        this.offerRepository.save(createOfferDto),
        this.wishesService.donate(wish, createOfferDto.amount)
      ])
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return {};
  }

  findAll() {
    return this.offerRepository.find({
      relations: { user: true },
      where: { hidden: false }
    });
  }

  findOne(params: FindOneOptions) {
    return this.offerRepository.findOne(params);
  }

  private calcDonateLimit(wish: Wish): number {
    return parseFloat((wish.price - wish.raised).toFixed(2));
  }
}
