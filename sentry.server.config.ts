// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: 'https://a3af9cefec0fd5c05a18b6dc43085791@o4505994260054016.ingest.sentry.io/4505994260774912',

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,
  
  environment: process.env.NODE_ENV,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
})
