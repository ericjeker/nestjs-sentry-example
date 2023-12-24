import * as Sentry from '@sentry/node';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    // Start the Sentry transaction
    const transaction = Sentry.startTransaction({
      op: 'http.server',
      name: `${method} ${url}`,
    });

    // Set the transaction to the current scope
    Sentry.getCurrentHub().getScope().setSpan(transaction);
    // Sentry.getCurrentHub().configureScope((scope) => {
    //   scope.setSpan(transaction);
    // });

    // Start a child span for the request handler
    const span = transaction.startChild({
      op: 'http.handler',
      description: `${context.getClass().name}.${context.getHandler().name}`,
    });

    return next.handle().pipe(
      tap(() => {
        // Finish the span and transaction
        span.finish();

        // Set the transaction to finished
        transaction.finish();
      }),
    );
  }
}
