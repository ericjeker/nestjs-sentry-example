## Description

Simple Sentry setup on [Nest](https://github.com/nestjs/nest) framework.
Just explore the code for more details, especially the files in the `sentry`
folder.

## Installation

To run this simple example, clone this repository and install the dependencies. Then copy `.env.sample` to `.env` and
insert your own Sentry DNS.

You can find DNS for your project on Sentry.io in Project Setting / Client Keys.

Then run Nest using the usual command:

```bash
npm run start:debug
```

## Testing and Sample Error

Once the Nest.js server is running you can go to http://localhost:3000/throw, it will create a sample error in your
Sentry project.

Or you can run the E2E test:

```bash
npm run test:e2e
```

In the `test/load` directory you will find two [Artillery](https://www.artillery.io/) scripts to test the performance of
your application. You can
run them using the following commands:

```bash
npx artillery run smoke-test.yml
```

Be careful not to eat all your quota on Sentry.

## Step by step

Below are some explanations on how to do a clean setup from scratch in your existing project.

### Dependencies

Create a new Nest app using the CLI

```bash
nest new sentry-setup
```

Install Sentry

```bash
npm i --save @sentry/node @sentry/profiling-node
```

### Create the needed elements

Create Sentry module, service and interceptor

```bash
nest g module sentry
nest g interceptor sentry
nest g filter sentry/sentry-exception --flat
```

### SentryModule

Create
the `SentryModule.forRoot()` [method](https://github.com/ericjeker/nestjs-sentry-example/blob/master/src/sentry/sentry.module.ts#L13)
and add the `Sentry.init(options)` in it.

Call the `SentryModule.forRoot({...})` in the `AppModule`.

Add the call to the Express
requestHandler [middleware](https://github.com/ericjeker/nestjs-sentry-example/blob/963afe70b87155cf0b3771673328ef072e9a9ff7/src/app.module.ts#L25)
in the `AppModule`.

```typescript
  configure(consumer
:
MiddlewareConsumer
):
void {
  consumer.apply(Sentry.Handlers.requestHandler()).forRoutes({
    path: '*',
    method: RequestMethod.ALL,
  });
}
```

It is important to use that middleware otherwise the current Hub will be global, and
you will run into conflicts as Sentry create a Hub by thread and Node.js is not multi-thread.

### SentryInterceptor

The `SentryInterceptor` will start the transaction, and finish it after the route was handled.

```typescript
@Injectable()
export class SentryInterceptor implements NestInterceptor {
  constructor(private sentryService: SentryService) {
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    // Start the Sentry transaction
    const transaction = Sentry.startTransaction({
      op: 'http.server',
      name: `${method} ${url}`,
    });

    // ... etc ...
  }
}
```

As an example I added a span. This is not necessary, but it will make the trace
nicer in the performance tab of Sentry.

You can add more span anywhere in your application simply by using `Sentry.getCurrentHub()`.

### SentryExceptionFilter

This is where the exception are caught and sent to Sentry.
