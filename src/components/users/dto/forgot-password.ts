// external libraries
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordUserDto {
    @ApiProperty({
        description: 'Email of the user to verify.',
        required: true
    })
    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email: string = undefined;
}
