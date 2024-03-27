import { IsString, Length } from "class-validator";

export class FindUsersDto {
    @IsString()
    @Length(0, 50)
    query: string;
}