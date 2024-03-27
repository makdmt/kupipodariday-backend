import { Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()

export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>
  ) { }

  create(createWishDto: CreateWishDto & { owner: User }) {
    return this.wishRepository.save(createWishDto);
  }

  findAll() {
    return this.wishRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} wish`;
  }

  update(id: number, updateWishDto: UpdateWishDto) {
    return `This action updates a #${id} wish`;
  }

  remove(id: number) {
    return `This action removes a #${id} wish`;
  }
}
