// external libraries
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterUserDto {
    @ApiPropertyOptional({
        description: 'Full name of the user.',
        required: false
    })
    @IsOptional()
    @IsString()
    fullName: string = undefined;

    @ApiPropertyOptional({
        description: 'User name of the user.',
        required: false
    })
    @IsOptional()
    @IsString()
    userName: string = undefined;

    @ApiPropertyOptional({
        description: 'Email for the user.',
        required: false
    })
    @IsOptional()
    @IsString()
    @IsEmail()
    email: string = undefined;

    @ApiPropertyOptional({
        description: 'Page number for the data.',
        required: false
    })
    @IsOptional()
    @IsString()
    page: string = '1';

    @ApiPropertyOptional({
        description: 'Limit of the documents to get from a query.',
        required: false
    })
    @IsOptional()
    @IsString()
    limit: string = '20';
}
