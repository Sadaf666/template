// external libraries
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';

// middleware
import { LoggerMiddleware } from './common/middlewares/logger.middleware';

// classes
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './components/users/users.module';
import { UsersController } from './components/users/users.controller';

@Module({
    imports: [
        ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
        MongooseModule.forRootAsync({
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('MONGO_URI'),
                useNewUrlParser: true,
                useUnifiedTopology: true
            }),
            inject: [ConfigService]
        }),

        MailerModule.forRootAsync({
            useFactory: async (configService: ConfigService) => ({
                transport: {
                    host: configService.get<string>('MAIL_HOST'),
                    port: +configService.get<string>('MAIL_PORT'),
                    secure:
                        configService.get<string>('MAIL_STATE') === 'true'
                            ? true
                            : false,
                    auth: {
                        user: configService.get<string>('MAIL_ID'),
                        pass: configService.get<string>('MAIL_PASS')
                    }
                }
            }),
            inject: [ConfigService]
        }),

        UsersModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LoggerMiddleware)
            .forRoutes(AppController, UsersController);
    }
}
