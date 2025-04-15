import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as crypto from 'crypto';

@Injectable()
export class ETagInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      tap((data) => {
        const body = JSON.stringify(data);
        const etag = crypto.createHash('md5').update(body).digest('hex');

        response.setHeader('ETag', etag);
        response.setHeader('Cache-Control', 'public, max-age=60');

        const clientETag = request.headers['if-none-match'];
        if (clientETag === etag) {
          throw new HttpException('Not Modified', 304);
        }
      }),
    );
  }
}
