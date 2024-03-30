import { PickType } from "@nestjs/mapped-types";
import { Wishlist } from "../entities/wishlist.entity";
import { WishId } from "src/shared/shared.types";
import { ArrayMaxSize, IsArray, IsNumber } from "class-validator";

export class CreateWishlistDto extends PickType(Wishlist, ['name', 'image'] as const) {
    @IsArray()
    @ArrayMaxSize(10)
    @IsNumber({
        allowNaN: false,
        allowInfinity: false,
        maxDecimalPlaces: 7
    },
        { each: true }
    )
    itemsId: WishId[]
}
