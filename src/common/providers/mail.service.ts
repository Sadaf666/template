// external libraries
import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
    constructor(
        private readonly mailService: MailerService,
        private readonly configService: ConfigService
    ) {}

    async welcomeEmail(to: string) {
        try {
            const link: string = `${this.configService.get<string>(
                'WELCOME_LINK'
            )}`;

            const content: string = `You are now signed up as template.<br/><br/>
            <a href="${link}">Click here to verify email.</a>`;

            const mail: any = await this.mailService.sendMail({
                to: to,
                from: `"template" ${this.configService.get<string>(
                    'MAIL_FROM'
                )}`,
                subject: 'Hello, Welcome to template.',
                html: content
            });

            console.log({
                accepted: mail.accepted,
                rejected: mail.rejected,
                response: mail.response,
                messageId: mail.messageId
            });

            return mail;
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

    async resendOtp(to: string, otp: string) {
        try {
            const link: string = `${this.configService.get<string>(
                'VERIFICATION_LINK'
            )}`;

            const content: string = `We want to make sure it's really you,<br/><br/>
            in order to further verify your identity,<br/><br/>
            enter the verification code ${otp} or <a href="${link}">Click here to verify email.</a>`;

            const mail: any = await this.mailService.sendMail({
                to: to,
                from: `"template" ${this.configService.get<string>(
                    'MAIL_FROM'
                )}`,
                subject: 'Forgot password request.',
                html: content
            });

            console.log({
                accepted: mail.accepted,
                rejected: mail.rejected,
                response: mail.response,
                messageId: mail.messageId
            });
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

    async passwordResetOtp(to: string, otp: number) {
        try {
            const mail: any = await this.mailService.sendMail({
                to: to,
                from: `"template" ${this.configService.get<string>(
                    'MAIL_FROM'
                )}`,
                subject: 'Password reset request.',
                text: `Your code for template password reset is ${otp}.`
            });

            console.log({
                accepted: mail.accepted,
                rejected: mail.rejected,
                response: mail.response,
                messageId: mail.messageId
            });
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
