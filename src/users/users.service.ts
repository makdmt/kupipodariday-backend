import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { PatchUserDto } from './dto/patch-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { hashValue } from 'src/shared/hash';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { SignUpDto } from 'src/auth/dto/signup.dto';

const USER_EXIST_ERR_MSG = 'user already exist'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)

    private usersRepository: Repository<User>,
    @Inject(CACHE_MANAGER)
    private cache: Cache
  ) { }


  async create(createUserDto: SignUpDto): Promise<User> {
    let user: User = null;
    try {
      user = await this.usersRepository.save({ ...createUserDto, password: await hashValue(createUserDto.password) });

    } catch (err) {
      if ('code' in err) {
        if (err.code === '23505') throw new ConflictException(USER_EXIST_ERR_MSG)
      }
    }
    return user;
  }

  async findById(id: User['id']) {
    const cachedUser = await this.getFromCache(id);
    if (cachedUser) return cachedUser;

    const user = await this.usersRepository.findOne({ where: { id } });
    await this.addToCache(user);

    return user;
  }

  findOne(userParams: FindOneOptions<User>) {
    return this.usersRepository.findOne(userParams);
  }

  updateOne(id: string, patchUserDto: PatchUserDto) {
    return this.usersRepository.save({ ...patchUserDto, id });
  }

  findByUsername(username: string) {
    return this.usersRepository.findOne({ where: { username } })
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  private getCacheKey(id: string) {
    return `userId:${id}`
  }

  private async addToCache(user: User) {
    const TTL = 300000; //5 min
    await this.cache.set(this.getCacheKey(user.id), user, TTL);
  }

  private async getFromCache(id: string): Promise<User> {
    return this.cache.get(this.getCacheKey(id));
  }

  private async removeFromCache(id: string) {
    this.cache.del(this.getCacheKey(id));
  }
}
