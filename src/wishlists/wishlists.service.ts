import { Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist) private readonly wishlistsRepositoy: Repository<Wishlist>,
    private readonly wishesService: WishesService
  ) { }

  async create(user: User, createWishlistDto: CreateWishlistDto) {
    const wishes = await this.wishesService.findMany({ where: { id: In(createWishlistDto.itemsId) } })
    delete createWishlistDto.itemsId;
    createWishlistDto['owner'] = user;
    createWishlistDto['items'] = wishes;
    return this.wishlistsRepositoy.save(createWishlistDto);
  }

  findAll() {
    return `This action returns all wishlists`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wishlist`;
  }

  update(id: number, updateWishlistDto: UpdateWishlistDto) {
    return `This action updates a #${id} wishlist`;
  }

  remove(id: number) {
    return `This action removes a #${id} wishlist`;
  }
}
