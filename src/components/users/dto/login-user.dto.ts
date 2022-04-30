// external libraries
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginUserDto {
    @ApiProperty({
        description:
            'base64 string with prefix of base64 streetfighter. format of base64 encode - "email:password"',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    authorization: string = undefined;
}
