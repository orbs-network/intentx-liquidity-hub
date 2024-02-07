/* eslint-disable @typescript-eslint/no-var-requires */
const execSync = require('child_process').execSync

function getCurrentCommit() {
  if (process.env.VERCEL_GIT_COMMIT_SHA) {
    console.log('Git commit:', process.env.VERCEL_GIT_COMMIT_SHA)
    return process.env.VERCEL_GIT_COMMIT_SHA.substring(0, 7)
  }

  if (process.env.NEXT_PUBLIC_SHA) {
    console.log('Git commit:', process.env.NEXT_PUBLIC_SHA)
    return process.env.NEXT_PUBLIC_SHA.substring(0, 7)
  }

  try {
    let version = execSync('git rev-parse HEAD').toString().trim().substring(0, 7)
    console.log('Git commit:', version)
    return version
  } catch (e) {
    console.error('Failed to get git commit', e.message)
    return '-.-.-'
  }
}

const SHA_VERSION = getCurrentCommit()

const config = {
  env: {
    NEXT_PUBLIC_SHA_VERSION: SHA_VERSION,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  swcMinify: false,
  images: {
    loaderFile: 'src/utils/ImageLoader.ts',
    // unoptimized: true,
  },
  compiler: {
    styledComponents: true,
  },
  transpilePackages: ['@0xsquid/widget'],
  async redirects() {
    return [
      {
        source: '/',
        destination: '/trade/BTCUSDT',
        permanent: false,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/referrals/:path*',
        destination: process.env.NEXT_PUBLIC_REFERRALS_BACKEND
          ? process.env.NEXT_PUBLIC_REFERRALS_BACKEND + '/:path*'
          : 'https://referrals.intentx.io/:path*',
      },
      {
        source: '/api/markets/:path*',
        destination: process.env.NEXT_PUBLIC_MARKETS_BACKEND
          ? process.env.NEXT_PUBLIC_MARKETS_BACKEND + '/:path*'
          : 'https://markets.intentx.io/:path*',
      },
      {
        source: '/trade/:symbol*',
        destination: '/trade/[symbol]?symbol=:symbol*',
      },
      {
        source: '/quote/:quoteId*',
        destination: '/quote/[quoteId]?quoteId=:quoteId*',
      },
    ]
  },
}

// Open /public/manifest.json and add the following:
// "homepage_url": "https://intentx.io",
// "provided_by": {
//   "name": "IntentX",
//   "url": "https://intentx.io"
// }

const { withSentryConfig } = require('@sentry/nextjs')
const withPWA = require('next-pwa')({
  dest: 'public',
  fallbacks: {
    document: '/_offline',
  },
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})

module.exports = withSentryConfig(
  withPWA(config),
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    org: 'intentx',
    project: 'intentx-main-platform',
    authToken: process.env.SENTRY_AUTH_TOKEN,
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: '/monitoring',

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,
  }
)
