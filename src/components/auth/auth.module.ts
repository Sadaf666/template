// external libraries
import { Module, Global, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

// strategies
import { JwtStrategy } from './jwt.strategy';

// classes
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersRepository } from '../users/repository/users-repository';
import { UsersModule } from '../users/users.module';

@Global()
@Module({
    imports: [
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET_KEY'),
                signOptions: {
                    expiresIn: configService.get<string>('JWT_EXPIRATION_TIME'),
                    algorithm: 'HS256'
                }
            }),
            inject: [ConfigService]
        }),
        forwardRef(() => UsersModule)
    ],
    exports: [JwtModule],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController]
})
export class AuthModule {}
