// external libraries
import { Module } from '@nestjs/common';

// classes
import { HelpersService } from './helpers.service';

@Module({
    // controllers: [HelpersController],
    providers: [HelpersService]
})
export class HelpersModule {}
