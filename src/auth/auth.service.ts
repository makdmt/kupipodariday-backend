import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
    constructor() {}
    auth(user: User) {
        
    }
}
