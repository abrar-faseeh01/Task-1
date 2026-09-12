import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';
    let errors: string[] = [];

    if (exception instanceof HttpException) {
      const body = exception.getResponse();
      if (typeof body === 'string') {
        message = body;
      } else if (typeof body === 'object' && body !== null) {
        const b = body as { message?: string | string[] };
        if (Array.isArray(b.message)) {
          errors = b.message; // e.g. class-validator's list of field errors
          message = 'Validation failed';
        } else {
          message = b.message ?? exception.message;
        }
      }
    }

    res
      .status(statusCode)
      .json({ success: false, statusCode, message, errors });
  }
}
