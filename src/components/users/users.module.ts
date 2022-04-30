// external libraries
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// models
import { User, UserSchema } from './schema/users.schema';

// classes
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './repository/users-repository';
import { HelpersService } from 'src/common/helpers/helpers/helpers.service';
import { HelpersModule } from 'src/common/helpers/helpers/helpers.module';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { MailService } from 'src/common/providers/mail.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        HelpersModule,
        AuthModule
    ],
    controllers: [UsersController],
    providers: [
        UsersService,
        AuthService,
        JwtStrategy,
        UsersRepository,
        HelpersService,
        MailService
    ],
    exports: [UsersService, UsersRepository]
})
export class UsersModule {}
