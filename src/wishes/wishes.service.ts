import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { UserId, WishId } from 'src/shared/shared.types';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>
  ) { }

  create(createWishDto: CreateWishDto, user: User) {
    createWishDto['owner'] = user;
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

  async duplicateOne(wishId: WishId, user: User) {
    const wish = await this.wishesRepository.findOne(
      {
        select: {
          id: true,
          name: true,
          link: true,
          image: true,
          price: true,
          description: true,
          copied: true,
        },
        relations: { owner: true },
        where: { id: wishId },
      })

    if (!wish) throw new NotFoundException();

    wish.copied++;
    await this.wishesRepository.save(wish); //update source wish

    delete wish.id;
    delete wish.copied;
    wish['owner'] = user;
    return this.wishesRepository.save(wish); //create wish copy for user
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

  findLast() {
    return this.wishesRepository.find({
      relations: { owner: true },
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

  findOne(params: FindOneOptions) {
    return this.wishesRepository.findOne(params);
  }

  findMany(params: FindManyOptions) {
    return this.wishesRepository.find(params);
  }

  isOwner(wish: Wish, userId: UserId): boolean {
    return !!wish.owner?.id && wish.owner.id === userId
  }

  private hasOffers(wish: Wish): boolean {
    if (wish.offers.length > 0) return true;
    return false;
  }
}
