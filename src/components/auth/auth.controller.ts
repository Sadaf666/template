// external libraries
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

// classes
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('v1/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
}
