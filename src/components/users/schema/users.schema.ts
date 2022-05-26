// external libraries
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

// models
import { Social } from './users-social.schema';
import { Wallets } from 'src/common/constants/enums';

@Schema({ collection: 'users', timestamps: true })
export class User {
    @ApiProperty({ description: '.', required: false })
    @Prop({ default: null, lowercase: true, trim: true })
    key: string;

    @ApiProperty({ description: 'Active status of the document.' })
    @Prop({ default: true, index: true })
    isActive: boolean;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
