import * as Sentry from '@sentry/node';
import { Observable, tap } from 'rxjs';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    return Sentry.startSpanManual(
      {
        op: 'http.server',
        name: `${method} ${url}`,
      },
      (span) => {
        return next.handle().pipe(
          tap(() => {
            span.end();
          }),
        );
      },
    );
  }
}
