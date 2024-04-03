import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, map } from "rxjs";
import { User } from "./entities/user.entity";


@Injectable()
export class RemoveUserPasswordInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<User>): Observable<Omit<User, 'password' | 'email'>> {
        return next.handle()
            .pipe(
                map(userData => {
                    if ('password' in userData) {
                        const { password, ...res } = userData; // eslint-disable-line
                        return res;
                    }
                    return userData;
                })
            )
    }
}
