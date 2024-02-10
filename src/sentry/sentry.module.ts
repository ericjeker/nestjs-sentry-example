import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import * as Sentry from '@sentry/node-experimental';
import { SentryExceptionsFilter } from './sentry-exception.filter';

export const SENTRY_OPTIONS = 'SENTRY_OPTIONS';

@Module({})
export class SentryModule {
  static forRoot(options) {
    // initialization of Sentry
    Sentry.init(options);

    return {
      module: SentryModule,
      providers: [
        {
          provide: SENTRY_OPTIONS,
          useValue: options,
        },
        {
          provide: APP_FILTER,
          useClass: SentryExceptionsFilter,
        },
      ],
    };
  }
}
