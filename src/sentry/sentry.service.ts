import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { Span, SpanContext } from '@sentry/types';

@Injectable()
export class SentryService {
  /**
   * Return the current span defined in the current Hub and Scope
   */
  get span(): Span {
    return Sentry.getCurrentHub().getScope().getSpan();
  }

  public getRequestSpan(request: Request, spanContext: SpanContext) {
    const { method, headers, url } = request;

    const transaction = Sentry.startTransaction({
      name: `Route: ${method} ${url}`,
      op: 'transaction',
    });

    Sentry.getCurrentHub().configureScope((scope) => {
      scope.setSpan(transaction);

      scope.setContext('http', {
        method,
        url,
        headers,
      });
    });

    const span = Sentry.getCurrentHub().getScope().getSpan();

    span.startChild(spanContext);

    return span;
  }

  /**
   * This will simply start a new child span in the current span
   *
   * @param spanContext
   */
  startChild(spanContext: SpanContext) {
    return this.span.startChild(spanContext);
  }
}
