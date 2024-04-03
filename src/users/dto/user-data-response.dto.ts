import { PickType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';

export class UserDataResponseDto extends PickType(
    User, ['id', 'username', 'about', 'avatar', 'email', 'createdAt', 'updatedAt'] as const) { }
