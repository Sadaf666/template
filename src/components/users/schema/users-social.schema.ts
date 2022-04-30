// external libraries
import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';

import { Document, Schema as MongooseSchema } from 'mongoose';

import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Social {
    @ApiProperty({
        description: 'Facebook reference for user contact.',
        required: false
    })
    @Prop({ default: null, trim: true })
    facebook: string;

    @ApiProperty({
        description: 'Instagram reference for user contact.',
        required: false
    })
    @Prop({ default: null, trim: true })
    instagram: string;

    @ApiProperty({
        description: 'LinkedIn reference for user contact.',
        required: false
    })
    @Prop({ default: null, trim: true })
    linkedIn: string;

    @ApiProperty({
        description: 'Twitter reference for user contact.',
        required: false
    })
    @Prop({ default: null, trim: true })
    twitter: string;
}

export type SocialDocument = Social & Document;

export const SocialSchema = SchemaFactory.createForClass(Social);
