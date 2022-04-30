// external libraries
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
    constructor(private readonly configService: ConfigService) {}

    PORT: string = this.configService.get<string>('PORT');

    env: string = this.configService.get<string>('NODE_ENV');

    getHello(): string {
        return `Template listening on port - ${this.PORT} in ${this.env} mode.`;
    }
}
