import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { User } from "src/users/entities/user.entity";

export const AuthUserId = createParamDecorator(
    (decoratorParam: never, ctx: ExecutionContext): User => ctx.switchToHttp().getRequest().user.id
)

export const AuthUser = createParamDecorator(
    (decoratorParam: never, ctx: ExecutionContext): User => ctx.switchToHttp().getRequest().user
)