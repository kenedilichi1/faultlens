import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { RequestWithContext } from '../types/request-with-context.type';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: RequestWithContext, res: Response, next: NextFunction): void {
    const requestId = `req_${uuid()}`;
    req.requestId = requestId;

    res.setHeader('x-request-id', requestId);
    next();
  }
}
