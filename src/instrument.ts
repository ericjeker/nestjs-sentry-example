import * as Sentry from '@sentry/node';
import 'dotenv/config';

// Read more about the available options here: https://docs.sentry.io/platforms/javascript/guides/nestjs/configuration/options/
Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Transaction with profiling cost 1.3 instead of 1.0,
  // you can add more profiling here for example Prisma or postgresql
  integrations: [],

  // Add Performance Monitoring by setting tracesSampleRate
  // The value is automatically adjusted depending on the environment
  // Learn more about sampling here: https://docs.sentry.io/platforms/javascript/guides/nestjs/configuration/sampling/
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,

  // Set the environment & release version
  environment: process.env.NODE_ENV,
  release: `${process.env.npm_package_name}@${process.env.npm_package_version}`,

  // Disable transport in development, transaction are still captured in debug mode, check the console
  enabled: process.env.NODE_ENV !== 'development',
  enableTracing: process.env.NODE_ENV !== 'development',

  // Enable debug mode to log event submission
  debug: process.env.NODE_ENV === 'development',

  // Advanced, optional: Called for message and error events
  beforeSend(event) {
    // Modify or drop the event here
    return event;
  },

  // Advanced, optional: Called for transaction events, you can further debug your transactions here
  beforeSendTransaction(event) {
    // Modify or drop the event here
    return event;
  },
});
