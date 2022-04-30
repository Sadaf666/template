// external libraries
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HelpersService {
    constructor() {}

    hashPassword(password: string) {
        try {
            const salt: any = bcrypt.genSaltSync(10);

            const hash: string = bcrypt.hashSync(password, salt);

            return hash;
        } catch (error) {
            return error;
        }
    }

    matchPassword(password: string, existingPassword: string) {
        try {
            const match: boolean = bcrypt.compareSync(
                password,
                existingPassword
            );

            return match;
        } catch (error) {
            return error;
        }
    }

    sortBy(sort: string) {
        try {
            let orderBy: object = { createdAt: -1 };

            if (sort) {
                orderBy = sort.includes('-')
                    ? { [sort.substring(1)]: -1 }
                    : { [sort]: 1 };
            }

            return orderBy;
        } catch (error) {
            return error;
        }
    }

    generateOtp() {
        try {
            const otp: number =
                Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;

            // const otp: string = Math.random()
            //     .toString(36)
            //     // .replace(/[^a-z]+/g, '')
            //     .substring(2, 8);

            console.log({ otp });

            return otp;
        } catch (error) {
            return error;
        }
    }
}
