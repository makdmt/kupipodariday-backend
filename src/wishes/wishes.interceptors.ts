import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map } from "rxjs";
import { Wish } from "./entities/wish.entity";


@Injectable()
export class RemoveHiddenOffersInterceptor implements NestInterceptor {


    intercept(context: ExecutionContext, next: CallHandler<Wish>) {

        const removeHiddenOffers = (wish: Wish) => {
            if ('offers' in wish) {
                wish.offers = wish.offers.filter(offer => !offer.hidden)
            }
            return wish;
        }


        return next.handle()
            .pipe(
                map(wishData => {
                    if (Array.isArray(wishData)) {
                        return wishData.map(wish => removeHiddenOffers(wish))
                    }
                    return removeHiddenOffers(wishData);
                })
            )
    }
}
