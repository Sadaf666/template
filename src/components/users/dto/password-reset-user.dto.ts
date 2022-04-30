// external libraries
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PasswordResetUserDto {
    @ApiProperty({
        description: 'Email of the user to verify.',
        required: true
    })
    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email: string = undefined;

    @ApiProperty({
        description: 'Password to update for user.',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    password: string = undefined;
}
