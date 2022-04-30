// external libraries
import { Injectable } from '@nestjs/common';

import { HttpException, HttpStatus } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { User, UserDocument } from '../schema/users.schema';

@Injectable()
export class UsersRepository {
    constructor(
        @InjectModel(User.name) private readonly Users: Model<UserDocument>
    ) {}

    projectUser = {
        fullName: 1,
        displayName: 1,
        email: 1,
        userName: 1,
        profilePicUrl: 1,
        publicAddress: 1,
        social: 1,
        isVerified: 1,
        wallets: 1
    };

    // insertOne
    async insert(object: any): Promise<UserDocument> {
        try {
            const data: UserDocument = await this.Users.create(
                JSON.parse(JSON.stringify(object))
            );

            return data;
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    error: error.message,
                    message: 'Something went wrong.'
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // findOneId
    async getOneById(id: string): Promise<UserDocument> {
        try {
            const data: UserDocument = await this.Users.findOne(
                {
                    isActive: true,
                    _id: id
                },
                this.projectUser
            ).lean();

            return data;
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    error: error.message,
                    message: 'Something went wrong.'
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // findOneBy
    async getOneBy(object: any): Promise<UserDocument> {
        try {
            const data: UserDocument = await this.Users.findOne(
                object,
                this.projectUser
            ).lean();

            return data;
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    error: error.message,
                    message: 'Something went wrong.'
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // findAllBy
    async getAll(
        condition: any,
        skip: number,
        limit: number
    ): Promise<Array<UserDocument>> {
        try {
            const data: Array<UserDocument> = await this.Users.find(
                condition,
                this.projectUser
            )
                .skip(skip)
                .limit(limit)
                .lean();

            return data;
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    error: error.message,
                    message: 'Something went wrong.'
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // updateById
    async update(id: string, object: any): Promise<UserDocument> {
        try {
            const data: UserDocument = await this.Users.findOneAndUpdate(
                {
                    isActive: true,
                    _id: id
                },
                { $set: JSON.parse(JSON.stringify(object)) },
                { new: true, projection: this.projectUser }
            ).lean();

            return data;
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    error: error.message,
                    message: 'Something went wrong.'
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // removeById
    async remove(id: string): Promise<UserDocument> {
        try {
            const data: UserDocument = await this.Users.findOneAndUpdate(
                { isActive: true, _id: id },
                { $set: { isActive: false } },
                { new: true }
            ).lean();

            return data;
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    error: error.message,
                    message: 'Something went wrong.'
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // countBy
    async count(condition: any): Promise<number> {
        try {
            const data: number = await this.Users.countDocuments(
                condition
            ).lean();

            return data;
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    error: error.message,
                    message: 'Something went wrong.'
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // verifyOtpBy
    async VerifyOtpBy(object: any): Promise<UserDocument> {
        try {
            const data: UserDocument = await this.Users.findOne(object, {
                otp: 1
            }).lean();

            return data;
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    error: error.message,
                    message: 'Something went wrong.'
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // matchPassword
    async checkPassword(object: any): Promise<UserDocument> {
        try {
            const data: UserDocument = await this.Users.findOne(object, {
                email: 1,
                userName: 1,
                password: 1
            }).lean();

            return data;
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    error: error.message,
                    message: 'Something went wrong.'
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
