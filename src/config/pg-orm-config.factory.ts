import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { join } from "path";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class PostgresORMConfigFactory implements TypeOrmOptionsFactory {
    constructor(private configService: ConfigService) {}
    createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
        return {
            type: 'postgres',
            host: this.configService.get<string>('database.host'),
            port: this.configService.get<number>('database.port'),
            username: this.configService.get<string>('database.user'),
            password: this.configService.get<string>('database.password'),
            database: this.configService.get<string>('database.name'),
            // entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
            entities: [User],
            synchronize: true,
        }
    }

}