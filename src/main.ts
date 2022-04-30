// external libraries
import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {
    NestExpressApplication,
    ExpressAdapter
} from '@nestjs/platform-express';

// classes
import { swaggerSetup } from './swagger';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(
        AppModule,
        new ExpressAdapter(),
        { cors: true }
    );

    app.set('trust proxy');

    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    swaggerSetup(app);

    const PORT: any = process.env.PORT;

    const env: any = process.env.NODE_ENV;

    console.log({ env: env, port: PORT });

    await app.listen(PORT);
}
bootstrap();
