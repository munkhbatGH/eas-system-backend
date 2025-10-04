import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'InternalError';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const responseObj = res as Record<string, any>;
        message = responseObj.message || message;
        error = responseObj.error || error;
      }
    }
    console.log('---message---', message)
    console.log('---error---', error)
    console.log('---request.url---', request.url)

    response.status(status).json({
      // success: false,
      statusCode: status,
      // timestamp: new Date().toISOString(),
      // path: request.url,
      message,
      error,
    });
  }
}
  