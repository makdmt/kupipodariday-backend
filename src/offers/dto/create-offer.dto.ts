import { PickType } from "@nestjs/mapped-types";
import { Offer } from "../entities/offer.entity";
import { IsNumber, Min } from "class-validator";
import { WishId } from "src/shared/shared.types";

export class CreateOfferDto extends PickType(Offer, ['amount', 'hidden'] as const) {
    @IsNumber()
    @Min(0)
    itemId: WishId;
}
