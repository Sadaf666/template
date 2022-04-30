// external libraries
import * as base58 from 'bs58';
import * as nacl from 'tweetnacl';
import { uniqBy } from 'lodash';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// models
import { UserDocument } from './schema/users.schema';

// classes
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HelpersService } from 'src/common/helpers/helpers/helpers.service';
import { UsersRepository } from './repository/users-repository';
import { FilterUserDto } from './dto/filter-user.dto';
import { AuthService } from '../auth/auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { MailService } from 'src/common/providers/mail.service';
import { ForgotPasswordUserDto } from './dto/forgot-password';
import { PasswordResetUserDto } from './dto/password-reset-user.dto';
import { VerifyEmailUserDto } from './dto/verify-email.dto';

@Injectable()
export class UsersService {
    constructor(
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService,
        private readonly usersRepo: UsersRepository,
        private readonly helperService: HelpersService,
        private readonly mailService: MailService,
        private readonly configService: ConfigService
    ) {}

    authSplit: string = this.configService.get<string>('AUTH_SPLIT');

    // creates or signup of user
    async create(createUserDto: CreateUserDto) {
        const { email, password, userName } = createUserDto;

        let hash: string = this.helperService.hashPassword(password);

        const object: object = {
            email,
            userName,
            password: hash
        };

        let users: UserDocument = await this.usersRepo.getOneBy({
            email: email.toLowerCase(),
            isActive: true
        });

        // check for unique email
        if (users) {
            throw new HttpException(
                {
                    success: false,
                    error: 'Account with this email already exists.'
                },
                HttpStatus.BAD_REQUEST
            );
        }

        users = await this.usersRepo.getOneBy({
            userName,
            isActive: true
        });

        // check for unique user name
        if (users) {
            throw new HttpException(
                {
                    success: false,
                    error: 'Account with this user name already exists.'
                },
                HttpStatus.BAD_REQUEST
            );
        }

        // inserting a user in database
        users = await this.usersRepo.insert(object);

        // sending a welcome email
        await this.mailService.welcomeEmail(email);

        users = await this.usersRepo.getOneById(users._id);

        let payload: object = { _id: users._id, email: users.email };

        let token: string = await this.authService.generateToken(payload);

        return { users, token };
    }

    // login in for user
    async login(loginUserDto: LoginUserDto) {
        const { authorization } = loginUserDto;

        let credentials: any = authorization.split(this.authSplit);

        credentials = credentials[1];

        credentials = Buffer.from(credentials, 'base64').toString('binary');

        if (!credentials) {
            throw new HttpException(
                {
                    success: false,
                    error: 'No credentials found. Please enter email and password.'
                },
                HttpStatus.BAD_REQUEST
            );
        }

        credentials = credentials.split(':');

        let email: string = credentials[0].toLowerCase(),
            password: string = credentials[1];

        // fetching document with email
        let users: UserDocument = await this.usersRepo.checkPassword({
            email,
            isActive: true
        });

        // check for password
        if (
            users &&
            (await this.helperService.matchPassword(password, users.password))
        ) {
            let payload: object = { _id: users._id, email: users.email };

            let token: string = await this.authService.generateToken(payload);

            return { users, token };
        } else {
            throw new HttpException(
                {
                    success: false,
                    error: `Invalid credentials - Please check your email/password.`
                },
                HttpStatus.UNAUTHORIZED
            );
        }
    }

    // find all users with pagination and filter
    async findAll(filterUserDto: FilterUserDto) {
        const { page, limit, fullName, email, userName } = filterUserDto;

        let limits: number = limit ? +limit : 20,
            pages: number = page ? +page : 1,
            skip: number = pages > 1 ? (pages - 1) * limits : 0;

        let condition: object = JSON.parse(
            JSON.stringify({
                fullName: fullName
                    ? { $regex: `^${fullName}$`, $options: 'i' }
                    : undefined,
                userName: userName
                    ? { $regex: `^${userName}$`, $options: 'i' }
                    : undefined,
                email: email,
                isActive: true
            })
        );

        console.log({ condition });

        // fetching data from database
        let users: Array<UserDocument> = await this.usersRepo.getAll(
            condition,
            skip,
            limits
        );

        // count of total documents
        const totalResults: number = await this.usersRepo.count(condition);

        // number of pages
        pages = Math.ceil(totalResults / limits);

        return { users, totalResults, pages };
    }

    // find one user with _id
    async findOne(id: string) {
        // fetching user from database by _id
        let users: UserDocument = await this.usersRepo.getOneById(id);

        return { users };
    }

    // update a user with _id
    async update(id: string, updateUserDto: UpdateUserDto) {
        const {
            fullName,
            profilePicUrl,
            facebook,
            instagram,
            linkedIn,
            twitter
        } = updateUserDto;

        let wallets: any = [];

        let users: UserDocument = await this.usersRepo.getOneById(id);

        if (users) {
        }

        const object: object = {
            fullName,
            profilePicUrl,

            'social.facebook': facebook,
            'social.instagram': instagram,
            'social.linkedIn': linkedIn,
            'social.twitter': twitter,

            wallets: wallets.length ? wallets : undefined
        };

        // updating user in database by _id
        users = await this.usersRepo.update(id, object);

        return { users };
    }

    // forgot password otp
    async forgotPasswordOtp(forgotPasswordUserDto: ForgotPasswordUserDto) {
        const { email } = forgotPasswordUserDto;

        let users: UserDocument = await this.usersRepo.getOneBy({
            email: email.toLowerCase(),
            isActive: true
        });

        if (users) {
            let otp: number = await this.helperService.generateOtp();

            await this.mailService.resendOtp(users.email, otp.toString());

            users = await this.usersRepo.update(users._id, { otp });

            let payload: object = { _id: users._id, email: users.email };

            let token: string = await this.authService.generateToken(payload);

            return { users, token };
        }

        throw new HttpException(
            {
                success: false,
                error: 'No account found with this email.'
            },
            HttpStatus.BAD_REQUEST
        );
    }

    // verify email
    async verifyEmail(verifyEmailUserDto: VerifyEmailUserDto) {
        const { email, otp } = verifyEmailUserDto;

        let users: UserDocument = await this.usersRepo.VerifyOtpBy({
            email: email.toLowerCase(),
            isActive: true
        });

        if (users) {
            if (+otp === users.otp) {
                users = await this.usersRepo.update(users._id, { otp: null });

                return { users };
            } else {
                throw new HttpException(
                    {
                        success: false,
                        error: 'Email not verified. Please enter a valid OTP.'
                    },
                    HttpStatus.BAD_REQUEST
                );
            }
        }

        throw new HttpException(
            {
                success: false,
                error: 'No account found with this email.'
            },
            HttpStatus.BAD_REQUEST
        );
    }

    // reset password
    async resetPassword(passwordResetUserDto: PasswordResetUserDto) {
        const { password, email } = passwordResetUserDto;

        let hash: string = this.helperService.hashPassword(password);

        let users: UserDocument = await this.usersRepo.getOneBy({
            email: email.toLowerCase(),
            isActive: true
        });

        if (users) {
            users = await this.usersRepo.update(users._id, { password: hash });

            return { users };
        }

        throw new HttpException(
            {
                success: false,
                error: 'No account found with this email.'
            },
            HttpStatus.BAD_REQUEST
        );
    }

    // validate wallet signature
    async validateSignature(
        message: string,
        signature: any,
        publicAddress: any
    ) {
        try {
            // encode message and publicAddress to Uint8
            const msg: any = new TextEncoder().encode(message),
                publicKey: any = base58.decode(publicAddress);

            // verify signature
            const data: any = nacl.sign.detached.verify(
                msg,
                Uint8Array.from(signature),
                publicKey
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

    // remove(id: number) {
    //     return `This action removes a #${id} user`;
    // }
}
