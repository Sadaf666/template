// external libraries
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private logger = new Logger();

    use(req: Request, res: Response, next: any) {
        const { method, url, ip, headers, body, query, params } = req;

        this.logger.verbose(
            `IP: >${ip}< called route >${
                process.env.BASE_URL
            }${url}< with method >${method}< with body >${JSON.stringify(
                body
            )}< query >${JSON.stringify(query)}< params >${JSON.stringify(
                params
            )}<`
        );

        this.logger.debug(
            JSON.parse(JSON.stringify(`${headers['authorization']}`))
        );

        next();
    }
}
