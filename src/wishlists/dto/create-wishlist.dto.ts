import { PickType } from "@nestjs/swagger";
import { Wishlist } from "../entities/wishlist.entity";
import { WishId } from "src/shared/shared.types";
import { ArrayMaxSize, IsArray, IsNumber } from "class-validator";
import { Transform } from "class-transformer";
import { removeDuplicatesTransformer } from "src/shared/entity.transformers";

export class CreateWishlistDto extends PickType(Wishlist, ['name', 'image'] as const) {
    @IsArray()
    @ArrayMaxSize(10)
    @Transform(removeDuplicatesTransformer)
    @IsNumber({
        allowNaN: false,
        allowInfinity: false,
        maxDecimalPlaces: 7
    },
        { each: true }
    )
    itemsId: WishId[]
}
