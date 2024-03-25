import { PickType } from "@nestjs/mapped-types";
import { User } from "src/users/entities/user.entity";

export class SignInDto extends PickType(User, ['username', 'password'] as const) { }