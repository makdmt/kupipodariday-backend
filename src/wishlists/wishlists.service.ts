import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { User } from 'src/users/entities/user.entity';
import { UserId } from 'src/shared/shared.types';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist) private readonly wishlistsRepositoy: Repository<Wishlist>,
    private readonly wishesService: WishesService
  ) { }

  async create(user: User, createWishlistDto: CreateWishlistDto) {
    createWishlistDto['owner'] = user;
    await this.convertWishesIdToWishesInDto(createWishlistDto);
    return this.wishlistsRepositoy.save(createWishlistDto);
  }

  async updateOne(user: User, id: number, updateWishlistDto: UpdateWishlistDto) {
    const wishlist = await this.wishlistsRepositoy.findOne({ where: { id }, relations: { owner: true } });
    if (!wishlist) throw new NotFoundException();
    if (!this.isOwner(wishlist, user.id)) throw new ForbiddenException();
    await this.convertWishesIdToWishesInDto(updateWishlistDto);
    return this.wishlistsRepositoy.save(updateWishlistDto);
  }

  async removeOne(user: User, id: number) {
    const wishlist = await this.wishlistsRepositoy.findOne({ where: { id }, relations: { owner: true } });
    if (!wishlist) throw new NotFoundException();
    if (!this.isOwner(wishlist, user.id)) throw new ForbiddenException();
    return this.wishlistsRepositoy.remove(wishlist);
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} wishlist`;
  // }

  // findAll() {
  //   return `This action returns all wishlists`;
  // }

  private async convertWishesIdToWishesInDto(wishesDto: CreateWishlistDto | UpdateWishlistDto) {
    if ('itemsId' in wishesDto && wishesDto.itemsId.length > 0) {
      const wishes = await this.wishesService.findMany({ where: { id: In(wishesDto.itemsId) } })
      delete wishesDto.itemsId
      wishesDto['items'] = wishes;
    }
    return wishesDto
  }

  private isOwner(wishList: Wishlist, userId: UserId) {
    return !!wishList?.owner?.id && wishList.owner.id === userId;
  }
}
