// external libraries
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
// services
import { AppService } from './app.service';

@ApiTags('app')
@Controller('v1')
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }
}
