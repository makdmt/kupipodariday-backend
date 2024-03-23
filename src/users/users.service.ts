import { Injectable, Inject } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hashValue } from 'src/shared/hash';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)

    private userRepository: Repository<User>,
    @Inject(CACHE_MANAGER)
    private cache: Cache
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.save({ ...createUserDto, password: await hashValue(createUserDto.password) });
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findById(id: string) {
    const cachedUser = await this.getFromCache(id);
    if (cachedUser) return cachedUser;

    const user = await this.userRepository.findOne({ where: { id } });
    await this.addToCache(user);

    return user;
  }

  findOne(userParams: Partial<User>) {
    return this.userRepository.findOne({ where: userParams });
  }

  findByUsername(username: string) {
    return this.userRepository.findOne({ where: { username } })
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
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
