import { PickType } from '@nestjs/swagger'
import { User } from "src/users/entities/user.entity";

export class SignUpDto extends PickType(User,
    ['username', 'email', 'password', 'avatar', 'about'] as const) { }