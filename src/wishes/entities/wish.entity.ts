import { Transform } from "class-transformer";
import { IsUrl, Length, Min } from "class-validator";
import { Offer } from "src/offers/entities/offer.entity";
import { decimalEntityColumnTransformer, floatRounderTransformer } from "src/shared/entity.transformers";
import { User } from "src/users/entities/user.entity";
import { Wishlist } from "src/wishlists/entities/wishlist.entity";
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, Column, JoinColumn, OneToMany, ManyToMany } from "typeorm";

@Entity()
export class Wish {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Length(1, 250)
    @Column({
        type: 'varchar',
        length: 250,
    })
    name: string;

    @IsUrl()
    @Column()
    link: string;

    @IsUrl()
    @Column()
    image: string;

    @Min(0)
    @Transform(floatRounderTransformer)
    @Column({
        type: 'decimal',
        precision: 9,
        scale: 2,
        transformer: decimalEntityColumnTransformer
    })
    price: number;

    @Min(0)
    @Transform(floatRounderTransformer)
    @Column({
        type: 'decimal',
        precision: 9,
        scale: 2,
        default: 0,
        transformer: decimalEntityColumnTransformer
    })
    raised: number;

    @ManyToOne(() => User, (user) => user.wishes)
    @JoinColumn()
    owner: User;

    @Length(1, 1024)
    @Column({
        type: 'varchar',
        length: 1024,
    })
    description: string;

    @OneToMany(() => Offer, (offer) => offer.item)
    offers: Offer[];

    @Min(0)
    @Column({
        type: 'int',
        default: 0
    })
    copied: number;

    @ManyToMany(() => Wishlist, (wishlist) => wishlist.items)
    wishlists: Wishlist[];

}
