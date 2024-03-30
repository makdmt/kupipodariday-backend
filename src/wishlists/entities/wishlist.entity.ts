import { IsOptional, IsUrl, Length } from "class-validator";
import { User } from "src/users/entities/user.entity";
import { Wish } from "src/wishes/entities/wish.entity";
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, ManyToOne, JoinTable, ManyToMany, JoinColumn } from "typeorm";

@Entity()
export class Wishlist {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Length(1, 250)
    @Column({
        type: 'varchar',
        length: 250
    })
    name: string;

    @IsOptional()
    @Column('varchar',
        { length: 1500, nullable: true })
    description: string;

    @IsOptional()
    @IsUrl()
    @Column('varchar')
    image: string;

    @ManyToOne(() => User, (user) => user.wishlists)
    @JoinColumn()
    owner: User;

    @ManyToMany(() => Wish, (wish) => wish.wishlists)
    @JoinTable()
    items: Wish[];

}
