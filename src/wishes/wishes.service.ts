import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { UserId, WishId } from 'src/shared/shared.types';


type Owner = Pick<Wish, 'owner'>;

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>
  ) { }

  create(createWishDto: CreateWishDto & Owner) {
    return this.wishesRepository.save(createWishDto);
  }

  async updateOne(wishId: WishId, userId: UserId, updateWishDto: UpdateWishDto) {
    const wish = await this.wishesRepository.findOne(
      {
        where: { id: wishId },
        relations: {
          owner: true,
          offers: true
        }
      });

    if (!wish) throw new NotFoundException();
    if (!this.isOwner(wish, userId)) throw new ForbiddenException();
    if ('price' in updateWishDto && this.hasOffers(wish)) throw new ForbiddenException();
    updateWishDto['id'] = wishId;
    return await this.wishesRepository.save(updateWishDto);
  }

  async donate(wish: Wish, amount: number) {
    wish.raised += amount;
    return this.wishesRepository.save(wish);
  }

  async removeOne(wishId: WishId, userId: UserId) {
    const wish = await this.wishesRepository.findOne({
      where: { id: wishId },
      relations: {
        owner: true
      }
    });

    if (!wish) throw new NotFoundException();
    if (!this.isOwner(wish, userId)) throw new ForbiddenException();

    return this.wishesRepository.remove(wish);
  }

  async findOneById(id: WishId) {
    const wish = await this.wishesRepository.findOne(
      {
        where: { id },
        relations: {
          offers: true,
          owner: true
        }
      })
    if (!wish) throw new NotFoundException();
    return wish;
  }

  findLast() {
    return this.wishesRepository.find({
      take: 40,
      order: { createdAt: 'DESC' }
    })
  }

  findPopular() {
    return this.wishesRepository.createQueryBuilder()
      .select('*')
      .from(Wish, 'wish')
      .distinctOn(['wish.name'])
      .orderBy({
        'wish.name': 'ASC',
        'wish.copied': 'DESC'
      })
      .take(20)
      .execute()
  }

  findMany(params: FindManyOptions) {
    return this.wishesRepository.find(params);
  }

  isOwner(wish: Wish, userId: UserId): boolean {
    return wish.owner.id === userId
  }

  private hasOffers(wish: Wish): boolean {
    if (wish.offers.length > 0) return true;
    return false;
  }
}
