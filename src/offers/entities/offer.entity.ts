import { IsBoolean, Min } from "class-validator";
import { User } from "src/users/entities/user.entity";
import { Wish } from "src/wishes/entities/wish.entity";
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from "typeorm";

Entity()
export class Offerf {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // @ManyToOne(() => User, (user) => user.offers)
    // @JoinColumn()
    // user: User;

    // @ManyToOne(() => Wish, (wish) => wish.offers)
    // @JoinColumn()
    // item: Wish;

    // @Min(0)
    // @Column({
    //     type: 'decimal',
    //     precision: 9,
    //     scale: 2
    // })
    // amount: number;

    // @IsBoolean()
    // @Column('boolean', { default: false })
    // hidden: boolean;
}
