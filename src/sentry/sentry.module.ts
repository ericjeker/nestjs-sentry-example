import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import * as Sentry from '@sentry/node';
import { SentryInterceptor } from './sentry.interceptor';
import { SentryExceptionsFilter } from './sentry-exception.filter';

export const SENTRY_OPTIONS = 'SENTRY_OPTIONS';

@Module({})
export class SentryModule {
  static forRoot(options: Sentry.NodeOptions) {
    // initialization of Sentry, this is where Sentry will create a Hub
    Sentry.init(options);

    return {
      module: SentryModule,
      providers: [
        {
          provide: SENTRY_OPTIONS,
          useValue: options,
        },
        {
          provide: APP_INTERCEPTOR,
          useClass: SentryInterceptor,
        },
        {
          provide: APP_FILTER,
          useClass: SentryExceptionsFilter,
        },
      ],
    };
  }
}
