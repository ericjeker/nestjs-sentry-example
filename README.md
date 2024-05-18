## Description

Example of a Sentry setup for [Nest.js](https://github.com/nestjs/nest) framework.

Just read this doc and explore the code for more details. If you want a more basic example or add Sentry in an existing
project just follow the Step by Step below.

Sentry provides their own Nest.js example [here](https://github.com/getsentry/sentry-javascript-examples/tree/main/apps/nestjs) and
you can read their documentation [here](https://docs.sentry.io/platforms/javascript/guides/nestjs/).

Below I mark a few differences between their example and mine:

- I use the `nest new <project>` command to create the project and didn't remove any file, so it will look 1:1 to what you should have starting a "real" Nest.js project.
- I use Fastify instead of Express. The reason I use Fastify is that it is faster than Express. You can read more about it [here](https://docs.nestjs.com/techniques/performance) and there is pretty much no difference in the code. If for some reason you prefer Express, don't worry, it will work the same.
- My `instrument.ts` file is more complete with an explanation on standard options that you might want to use in a real project.

## Migration from v2.0 to v3.0

The previous version of this example was using Sentry SDK v7.x. The new version uses Sentry SDK v8.0. In v8.0, the SDK
is doing pretty much everything for you, so it's more a matter of configuration than coding.

We removed the `SentryInterceptor`, `SentryService`, `SentryModule` classes and added a `instrument.ts` file. The `main.ts` 
file has changed and include the `Sentry.init(...)` call through the `instrument.ts` file and the `Sentry.setupNestErrorHandler()` call.

## Installation

To run this example, clone this repository and install the dependencies. Then copy `.env.sample` to `.env` and
insert your own Sentry DSN. You can find the DSN for your project on Sentry.io in Project Setting / Client Keys.

Then run Nest using the usual command:

```bash
npm run start:debug
```

## Sample Error

**Note: by default the error and tracing are disabled in DEVELOPMENT environment. You can change this in the `instrument.ts`**

Once the Nest.js server is running you can go to http://localhost:3000/throw, it will create a sample error in your
Sentry project.

## Testing

You can run the E2E test like so:

```bash
npm run test:e2e
```

In the `test/load` directory you will find two [Artillery](https://www.artillery.io/) scripts to test the performance of
your application. You can run them using the following commands:

```bash
npx artillery run test/load/smoke-test.yml
```

Be careful not to eat up your quota on Sentry.

## Step by step

Below are some explanations on how to do a clean setup from scratch or in an existing project.

### Installation

If you start from scratch, create a new Nest app using the CLI

```bash
nest new sentry-setup
cd sentry-setup
```

Then install `dotenv` and Sentry Node.js SDK

```bash
npm i --save dotenv @sentry/node
```

Add the `SENTRY_DSN` to your `.env` file.

Create the `instrument.ts` file and call `Sentry.setupNestErrorHandler()` in the `main.ts` file. This will automatically
catch all errors in your application and send them to Sentry.

Below is a very basic example of the `instrument.ts` file:

```typescript
import * as Sentry from '@sentry/node';
import 'dotenv/config';

// Ensure to call this before importing any other modules!
Sentry.init({
  dsn: process.env.SENTRY_DSN, 

  // Add Performance Monitoring by setting tracesSampleRate
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});
```
