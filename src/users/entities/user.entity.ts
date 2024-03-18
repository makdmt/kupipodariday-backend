import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Generated } from "typeorm"
import { IsEmail } from "class-validator";
import { Wish } from "src/wishes/entities/wish.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({
        type: 'varchar',
        length: 30,
        unique: true,
    })
    username: string;

    @Column({
        type: 'varchar',
        length: 200,
        default: 'Пока ничего не рассказал о себе',
    })
    about: string;

 
    @Column({
        nullable: true
    })
    @IsEmail()
    email: string;

    @Column({
        nullable: true
    })
    password: string;

    @OneToMany(() => Wish, (wish) => wish.owner)
    wishes: Wish[];
    
}
