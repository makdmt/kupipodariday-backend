import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService
  ) { 
    console.log(this.configService.get<string>('database.host'));
  }

  create(createUserDto: CreateUserDto): Promise<User> {
    console.log(createUserDto);
    return this.userRepository.save(createUserDto);
  }

  findAll(): Promise<User[]> {
    console.log('service')
    return this.userRepository.find();
  }

  findOne(id: string) {
    console.log(this.configService.get<string>('database.host'));
    console.log(this.configService.get<string>('DB_HOST'));
    return this.userRepository.findOne({ where: { id } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
