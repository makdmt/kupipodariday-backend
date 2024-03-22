import { User as UserEntity } from "src/users/entities/user.entity";

declare global {
  namespace Express {
    interface Request {
      user: UserEntity
    }
  }
}