// external libraries
import {
    forwardRef,
    HttpException,
    HttpStatus,
    Inject,
    Injectable
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// classes
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    async generateToken(payload: any): Promise<any> {
        try {
            const data: string = this.jwtService.sign(payload);

            return data;
        } catch (error) {
            throw new HttpException(
                { success: false, error: error.message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async verifyToken(token: string): Promise<any> {
        try {
            const data: any = this.jwtService.verify(token);

            return data;
        } catch (error) {
            throw new HttpException(
                { success: false, error: error.message },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
