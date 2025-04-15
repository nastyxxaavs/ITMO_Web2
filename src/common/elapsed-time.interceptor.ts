import {
  CallHandler, ContextType,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class ElapsedTimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();

    const isHttp = context.getType() === 'http';
    type ExtendedContextType = 'rpc' | 'ws' | 'graphql';

    const isGraphQL = context.getType<ExtendedContextType>() === 'graphql';

    let response: any;
    let request: any;

    if (isHttp) {
      request = context.switchToHttp().getRequest();
      response = context.switchToHttp().getResponse();
    } else if (isGraphQL) {
      const gqlContext = context.getArgByIndex(2);
      response = gqlContext?.res;
      request = gqlContext?.req;
    }

    return next.handle().pipe(
      tap(() => {
        const elapsed = Date.now() - now;

        if (response?.setHeader) {
          response.setHeader('X-Elapsed-Time', `${elapsed}ms`);
        }

        if (response?.locals) {
          response.locals.elapsedTime = `${elapsed}ms`;
        }

        if (request) {
          console.log(`[${request.method}] ${request.url} - ${elapsed}ms`);
        }
      }),
    );
  }

}
