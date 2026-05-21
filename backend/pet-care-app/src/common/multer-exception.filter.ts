import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { Response } from 'express';
import { MulterError } from 'multer';

export const PET_PHOTO_ERROR_PREFIX = 'PET_PHOTO:';

@Catch(MulterError, BadRequestException)
export class MulterExceptionFilter implements ExceptionFilter {
  catch(exception: MulterError | BadRequestException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();

    if (exception instanceof BadRequestException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      res.status(status).json(
        typeof body === 'string' ? { message: body, statusCode: status } : body,
      );
      return;
    }

    const message =
      exception.code === 'LIMIT_FILE_SIZE'
        ? 'Image must be 5 MB or smaller.'
        : exception.message || 'File upload failed.';

    res.status(400).json({
      statusCode: 400,
      message,
      error: 'Bad Request',
    });
  }
}
