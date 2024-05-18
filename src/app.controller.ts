import * as Sentry from '@sentry/node';
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

type Response = { version: string };

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  success(): Response {
    return this.appService.success();
  }

  @Get('manual')
  manual(): Response {
    return Sentry.startSpan<Response>({ name: 'manual-transaction' }, () =>
      this.appService.success(),
    );
  }

  @Get('manual-async')
  manualAsync(): Promise<Response> {
    return Sentry.startSpan<Promise<Response>>(
      { name: 'manual-transaction' },
      () => this.appService.successAsync(),
    );
  }

  @Get('throw')
  throwError(): void {
    this.appService.throwError();
  }
}
