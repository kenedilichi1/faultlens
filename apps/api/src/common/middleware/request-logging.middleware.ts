import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

import { NextFunction, Response } from 'express';

import { RequestWithContext } from '../types/request-with-context.type';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: RequestWithContext, res: Response, next: NextFunction) {
    const startedAt = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - startedAt;

      this.logger.log({
        requestId: req.requestId,
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        responseTime: `${duration}ms`,
      });
    });

    next();
  }
}
