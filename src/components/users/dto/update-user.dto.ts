// external libraries
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    IsOptional,
    IsEnum
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiPropertyOptional({
        description: 'Full name of the user.',
        required: false
    })
    @IsOptional()
    @IsString()
    fullName: string = undefined;

    @ApiPropertyOptional({
        description: 'Profile picture of the user.',
        required: false
    })
    @IsOptional()
    @IsString()
    profilePicUrl: string = undefined;

    @ApiPropertyOptional({
        description: 'Facebook reference for user contact.',
        required: false
    })
    @IsOptional()
    @IsString()
    facebook: string = undefined;

    @ApiPropertyOptional({
        description: 'Instagram reference for user contact.',
        required: false
    })
    @IsOptional()
    @IsString()
    instagram: string = undefined;

    @ApiPropertyOptional({
        description: 'LinkedIn reference for user contact.',
        required: false
    })
    @IsOptional()
    @IsString()
    linkedIn: string = undefined;

    @ApiPropertyOptional({
        description: 'Twitter reference for user contact.',
        required: false
    })
    @IsOptional()
    @IsString()
    twitter: string = undefined;
}
