import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, finalize, Observable, throwError } from 'rxjs';
import { SentryService } from './sentry.service';
import * as Sentry from '@sentry/node';

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  constructor(private sentryService: SentryService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const span = this.sentryService.getRequestSpan(request, {
      op: `Route Handler`,
    });

    return next.handle().pipe(
      catchError((error) => {
        // capture the error, you can filter out some errors here
        Sentry.captureException(error, span.getTraceContext());

        // throw again the error
        return throwError(() => error);
      }),
      finalize(() => {
        span.finish();
      }),
    );
  }
}
