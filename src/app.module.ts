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
import { PostgresORMConfigFactory } from './config/pg-orm-config.factory';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { Offerf } from './offers/entities/offer.entity';
import { Wish } from './wishes/entities/wish.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', './src/config/.env.development'],
      isGlobal: true,
      load: [configuration]
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: 'student',
      password: 'student',
      database: 'kupipodariday',
      entities: [User, Offerf],
      synchronize: true,
    }),
    // TypeOrmModule.forRootAsync({
    //   useClass: PostgresORMConfigFactory
    // }),
    UsersModule,
    // WishesModule,
    // WishlistsModule,
    OffersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
