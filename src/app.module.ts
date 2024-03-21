import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { WishesModule } from './wishes/wishes.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { OffersModule } from './offers/offers.module';
import { User } from './users/entities/user.entity';
import { Wish } from './wishes/entities/wish.entity';
import { PostgresORMConfigFactory } from './config/pg-orm-config.factory';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['./src/config/.env.development', '.env',],
      isGlobal: true,
      load: [configuration]
    }),
    TypeOrmModule.forRootAsync({
      useClass: PostgresORMConfigFactory
    }),
  //  TypeOrmModule.forRoot({
  //     type: 'postgres',
  //     host: '127.0.0.1',
  //     port: 5432,
  //     username: 'student',
  //     password: 'student',
  //     database: 'kupipodariday',
  //     entities: [User, Wish],
  //     synchronize: true,
  //   }),
    UsersModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
