// external libraries
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

// models
import { Social } from './users-social.schema';
import { Wallets } from 'src/common/constants/enums';

@Schema({ collection: 'users', timestamps: true })
export class User {
    @ApiProperty({ description: 'Full name for the user.', required: false })
    @Prop({ default: null, lowercase: true, trim: true })
    fullName: string;

    @ApiProperty({ description: 'Email for the user.', required: false })
    @Prop({ default: null, lowercase: true, trim: true })
    email: string;

    @ApiProperty({ description: 'User name for the user.', required: false })
    @Prop({ default: null, trim: true })
    userName: string;

    @ApiProperty({ description: 'Password for the user.', required: false })
    @Prop({ default: null })
    password: string;

    @ApiProperty({ description: 'Otp for user verification.', required: false })
    @Prop({ default: null })
    otp: number;

    @ApiProperty({
        description: 'Profile picture of the user.',
        required: false
    })
    @Prop({ default: null, trim: true })
    profilePicUrl: string;

    @ApiProperty({
        type: Social,
        description: 'Social media links of the user.',
        required: false
    })
    @Prop({ type: Social, default: new Social() })
    social: Social;

    @ApiProperty({ description: 'Active status of the document.' })
    @Prop({ default: true, index: true })
    isActive: boolean;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
