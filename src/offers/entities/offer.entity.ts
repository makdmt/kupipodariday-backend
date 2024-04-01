import { IsBoolean, IsOptional, Min } from "class-validator";
import { User } from "src/users/entities/user.entity";
import { Wish } from "src/wishes/entities/wish.entity";
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, Column, JoinColumn } from "typeorm";

@Entity()
export class Offer {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.offers)
    @JoinColumn()
    user: User;

    @ManyToOne(() => Wish, (wish) => wish.offers)
    @JoinColumn()
    item: Wish;

    @Min(0.01)
    @Column({
        type: 'decimal',
        precision: 9,
        scale: 2
    })
    amount: number;

    @IsOptional()
    @IsBoolean()
    @Column('boolean', { default: false })
    hidden: boolean;

}
