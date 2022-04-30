//external libraries
import { Post, Patch, Get, Delete, Res, Headers, Header } from '@nestjs/common';
import { Body, Param, Query } from '@nestjs/common';
import { Controller, HttpStatus, HttpException } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiHeader,
    ApiHeaders,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiQuery
} from '@nestjs/swagger';
import { ApiBody, ApiParam } from '@nestjs/swagger';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

// classes
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { JwtAuthGuard } from '../auth/jwt.gaurd';
import { LoginUserDto } from './dto/login-user.dto';
import { ForgotPasswordUserDto } from './dto/forgot-password';
import { PasswordResetUserDto } from './dto/password-reset-user.dto';
import { VerifyEmailUserDto } from './dto/verify-email.dto';

@ApiTags('user')
@Controller('v1/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiOkResponse({
        status: HttpStatus.OK,
        description: 'Logins in a user.'
    })
    @ApiInternalServerErrorResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error.'
    })
    @Post('login')
    async login(@Res() res: any, @Body() loginUserDto: LoginUserDto) {
        const data: any = await this.usersService.login(loginUserDto);

        return res.status(HttpStatus.OK).json({
            success: true,
            data: data,
            request: {
                body: { loginUserDto }
            },
            message: `User Has been logged in.`
        });
    }

    @ApiCreatedResponse({
        status: HttpStatus.CREATED,
        description: 'Creates new user.'
    })
    @ApiBadRequestResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Something went wrong.'
    })
    @ApiInternalServerErrorResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error.'
    })
    @ApiBody({
        type: CreateUserDto,
        description: 'Dto to create a user.'
    })
    @Post()
    async create(@Res() res: any, @Body() createUserDto: CreateUserDto) {
        const data: any = await this.usersService.create(createUserDto);

        if (data.users) {
            return res.status(HttpStatus.CREATED).json({
                success: true,
                data: data,
                request: {
                    body: { createUserDto }
                },
                message: 'User has been created.'
            });
        }

        return res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            data: null,
            request: {
                body: { createUserDto }
            },
            message: 'Something went wrong.'
        });
    }

    @ApiOkResponse({
        status: HttpStatus.OK,
        description: 'Finds all users.'
    })
    @ApiInternalServerErrorResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error.'
    })
    @ApiQuery({
        type: FilterUserDto,
        description: 'Dto for filter and pagination.'
    })
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(@Res() res: any, @Query() filterUserDto: FilterUserDto) {
        const data: any = await this.usersService.findAll(filterUserDto);

        return res.status(HttpStatus.OK).json({
            success: true,
            data: data,
            request: {
                query: { filterUserDto }
            },
            message: `List of users.`
        });
    }

    @ApiOkResponse({
        status: HttpStatus.OK,
        description: 'Find user contact by _id.'
    })
    @ApiInternalServerErrorResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error.'
    })
    @ApiParam({
        name: 'id',
        description: '_id of the user document.',
        required: true
    })
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOne(@Res() res: any, @Param('id') id: string) {
        const data: any = await this.usersService.findOne(id);

        if (data.users) {
            return res.status(HttpStatus.OK).json({
                success: true,
                data: data,
                request: { params: { id } },
                message: 'Found a user.'
            });
        }

        return res.status(HttpStatus.OK).json({
            success: false,
            data: null,
            request: { params: { id } },
            message: 'No user found.'
        });
    }

    @ApiOkResponse({
        status: HttpStatus.OK,
        description: 'Verify email through otp.'
    })
    @ApiOkResponse({
        status: HttpStatus.OK,
        description: 'No account verified.'
    })
    @ApiInternalServerErrorResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error.'
    })
    @ApiBody({
        type: ForgotPasswordUserDto,
        description: 'Dto to use for forgot password or resend OTP to email.'
    })
    @Patch('forgot-password-otp')
    async forgotPasswordOtp(
        @Res() res: any,
        @Body() forgotPasswordUserDto: ForgotPasswordUserDto
    ) {
        const data: any = await this.usersService.forgotPasswordOtp(
            forgotPasswordUserDto
        );

        if (data.users) {
            return res.status(HttpStatus.OK).json({
                success: true,
                data: data,
                request: { body: forgotPasswordUserDto },
                message: 'OTP sent to user email.'
            });
        }

        return res.status(HttpStatus.OK).json({
            success: false,
            data: null,
            request: { body: forgotPasswordUserDto },
            message: 'OTP not sent to user email.'
        });
    }

    @ApiOkResponse({
        status: HttpStatus.OK,
        description: 'Verify email through otp.'
    })
    @ApiOkResponse({
        status: HttpStatus.OK,
        description: 'No email verified.'
    })
    @ApiInternalServerErrorResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error.'
    })
    @ApiBody({
        type: VerifyEmailUserDto,
        description: 'Dto to verify email of the user.'
    })
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard)
    @Patch('verify-email')
    async verifyEmail(
        @Res() res: any,
        @Body() verifyEmailUserDto: VerifyEmailUserDto
    ) {
        const data: any = await this.usersService.verifyEmail(
            verifyEmailUserDto
        );

        if (data.users) {
            return res.status(HttpStatus.OK).json({
                success: true,
                data: data,
                request: { body: verifyEmailUserDto },
                message: 'Email has been verified.'
            });
        }

        return res.status(HttpStatus.OK).json({
            success: false,
            data: null,
            request: { body: verifyEmailUserDto },
            message: 'Email has not been verified.'
        });
    }

    @ApiOkResponse({
        status: HttpStatus.OK,
        description: 'Reset password for user.'
    })
    @ApiOkResponse({
        status: HttpStatus.OK,
        description: 'No password reset for the user.'
    })
    @ApiInternalServerErrorResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error.'
    })
    @ApiBody({
        type: PasswordResetUserDto,
        description: 'Dto to reset password of the user.'
    })
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard)
    @Patch('reset-password')
    async resetPassword(
        @Res() res: any,
        @Body() passwordResetUserDto: PasswordResetUserDto
    ) {
        const data: any = await this.usersService.resetPassword(
            passwordResetUserDto
        );

        if (data.users) {
            return res.status(HttpStatus.OK).json({
                success: true,
                data: data,
                request: { body: passwordResetUserDto },
                message: 'Password has been reset for the user.'
            });
        }

        return res.status(HttpStatus.OK).json({
            success: false,
            data: null,
            request: { body: passwordResetUserDto },
            message: 'Password has not been reset.'
        });
    }

    @ApiOkResponse({
        status: HttpStatus.OK,
        description: 'Update user contact by _id.'
    })
    @ApiOkResponse({
        status: HttpStatus.OK,
        description: 'No user contact updated.'
    })
    @ApiInternalServerErrorResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error.'
    })
    @ApiParam({ name: 'id', required: true })
    @ApiBody({ type: UpdateUserDto, description: 'Dto to update user.' })
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async update(
        @Res() res: any,
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto
    ) {
        const data: any = await this.usersService.update(id, updateUserDto);

        if (data.users) {
            return res.status(HttpStatus.OK).json({
                success: true,
                data: data,
                request: { param: { id }, body: updateUserDto },
                message: 'User contact has been updated.'
            });
        }

        return res.status(HttpStatus.OK).json({
            success: false,
            data: null,
            request: { param: { id }, body: updateUserDto },
            message: 'No user contact updated.'
        });
    }

    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //     return this.usersService.remove(+id);
    // }
}
