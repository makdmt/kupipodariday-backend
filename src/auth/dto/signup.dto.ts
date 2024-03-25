import { PickType } from "@nestjs/mapped-types";
import { User } from "src/users/entities/user.entity";

export class SignUpDto extends PickType(User, ['username', 'password', 'email', 'about'] as const) { }