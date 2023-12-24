import * as Sentry from '@sentry/node';
import { Controller, Get, HttpException } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<string> {
    // Start a child span for the request handler
    const span = Sentry.getCurrentHub().getScope().getTransaction().startChild({
      op: 'http.hello',
      description: `AppController.getHello()`,
    });

    // Call the service or process the request
    const response = await this.appService.getHello();

    // Finish the span
    span.finish();

    // Return the response
    return response;
  }

  @Get('throw')
  throwError(): string {
    throw new HttpException({ message: 'Sample Error' }, 500);
  }
}
