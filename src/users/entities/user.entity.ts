import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"
import { IsEmail, IsNotEmpty, IsOptional, IsUrl, Length } from "class-validator";
import { Wish } from "src/wishes/entities/wish.entity";
import { Offer } from "src/offers/entities/offer.entity";
import { Wishlist } from "src/wishlists/entities/wishlist.entity";
import { Transform } from "class-transformer";
import { toLowerCaseTransformer } from "src/shared/entity.transformers";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Length(2, 30)
    @Transform(toLowerCaseTransformer)
    @Column({
        type: 'varchar',
        length: 30,
        unique: true,
    })
    username: string;

    @IsOptional()
    @Length(2, 200)
    @Column({
        type: 'varchar',
        length: 200,
        default: 'Пока ничего не рассказал о себе',
        nullable: true
    })
    about: string;

    @IsOptional()
    @IsUrl()
    @Column({
        type: 'varchar',
        default: 'https://i.pravatar.cc/300',
        nullable: true
    })
    avatar: string;

    @IsEmail()
    @Transform(toLowerCaseTransformer)
    @Column({
        type: 'varchar',
        unique: true,
        select: false
    })
    email: string;

    @IsNotEmpty()
    @Column({ select: false })
    password: string;

    @OneToMany(() => Wish, (wish) => wish.owner)
    wishes: Wish[];

    @OneToMany(() => Offer, (offer) => offer.user)
    offers: Offer[];

    @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
    wishlists: Wishlist;

}
