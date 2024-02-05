import * as Sentry from '@sentry/node';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SentryModule } from './sentry/sentry.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    // Refer to the documentation for more information: https://docs.sentry.io/platforms/node/configuration/options/
    SentryModule.forRoot({
      dsn: process.env.SENTRY_DNS,
      // Transaction with profiling cost 1.3 instead of 1.0,
      // you can add more profiling here for example Prisma or postgresql
      integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
      ],
      // Performance Monitoring
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      // Set sampling rate for profiling - this is relative to tracesSampleRate
      profilesSampleRate: 1.0,

      // Set the environment & release version
      environment: process.env.NODE_ENV,
      release: `${process.env.npm_package_name}@${process.env.npm_package_version}`,

      // Disable transport in development, transaction are still captured in debug mode
      enabled: true, //process.env.NODE_ENV !== 'development',
      enableTracing: true, //process.env.NODE_ENV !== 'development',

      // Enable debug mode to log event submission
      debug: process.env.NODE_ENV === 'development',

      // Called for message and error events
      beforeSend(event) {
        // Modify or drop the event here
        // process.env.NODE_ENV === 'development' && console.log(event);
        return event;
      },

      // Called for transaction events, you can further debug your transactions here
      beforeSendTransaction(event) {
        // Modify or drop the event here
        // process.env.NODE_ENV === 'development' && console.log(event);
        return event;
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(Sentry.Handlers.requestHandler()).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
