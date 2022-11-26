## Description

Simple Sentry setup on [Nest](https://github.com/nestjs/nest) framework. 
Just explore the code for more details, especially the files in the `sentry` 
folder.


## Installation

To run this simple example, clone this repository and install the dependencies. Then copy `.env.sample` to `.env` and insert your own Sentry DNS.

You can find DNS for your project on Sentry.io in Project Setting / Client Keys.

Then run Nest using the usual command:

```bash
$ npm run start:debug
```


## Testing and Sample Error

Once the Nest.js server is running you can go to http://localhost:3000/throw and it will create a sample error in your Sentry project.

Or you can run the E2E test:

```bash
$ npm run test:e2e
```


## Step by step

Below are some explanations on how to do a clean setup from scratch in your existing project.

### Dependencies

Create a new Nest app using the CLI

```bash
$ nest new sentry-setup
```

Install Sentry

```bash
$ npm install --save @sentry/node @sentry/tracing
```

### Create the needed elements

Create Sentry module, service and interceptor

```bash
$ nest g module sentry
$ nest g service sentry
$ nest g interceptor sentry/sentry
```

### SentryModule

Create the `SentryModule.forRoot()` method and add the `Sentry.init(options)` in it.

Call the `Sentry.Module.forRoot({...})` in the `AppModule`.

Add the call to the Express requestHandler middleware in the `AppModule`.

```javascript
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(Sentry.Handlers.requestHandler()).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
```

It is important to use that middleware otherwise the current Hub will be global and
you will run into conflict as Sentry create a Hub by thread and Node.js is not multi-thread.

### SentryService

We want to initialize the transaction in the constructor of the service. You can
customize your main transaction there.

Note that because I inject the Express request, the service must be request scoped. You
can read more about that [here](https://docs.nestjs.com/fundamentals/injection-scopes#request-provider).

```javascript
@Injectable({ scope: Scope.REQUEST })
export class SentryService {
  constructor(@Inject(REQUEST) private request: Request) {
    // ... etc ...
  }
}
```

### SentryInterceptor

The `SentryInterceptor` will capture the exception and finish the transaction. Please also
note that it must be request scoped as we inject the `SentryService`:

```javascript
@Injectable({ scope: Scope.REQUEST })
export class SentryInterceptor implements NestInterceptor {
  constructor(private sentryService: SentryService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // ... etc ...
  }
}
```

As an example I added a span. This is not necessary, but it will just make the trace 
nicer in the performance tab of Sentry.

You can add more span anywhere in your application simply by injecting the `SentryService`.
