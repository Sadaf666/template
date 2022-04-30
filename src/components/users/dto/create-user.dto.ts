// external libraries
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({
        description: 'User name of the user.',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    userName: string;

    @ApiProperty({
        description: 'Email for the user.',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Password of the user.',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    password: string;
}
