import { defineConfig } from 'cypress'
import { setupHardhatEvents } from 'cypress-hardhat'

export default defineConfig({
  projectId: '76aqki',

  // 2x average block time
  defaultCommandTimeout: 24000,

  chromeWebSecurity: false,

  // better memory management, see https://github.com/cypress-io/cypress/pull/25462
  experimentalMemoryManagement: true,

  retries: {
    runMode: process.env.CYPRESS_RETRIES ? +process.env.CYPRESS_RETRIES : 2,
  },

  // video: false, // GH provides 2 CPUs, and cypress video eats one up, see https://github.com/cypress-io/cypress/issues/20468#issuecomment-1307608025
  e2e: {
    async setupNodeEvents(on, config) {
      await setupHardhatEvents(on, config)
      return config
    },
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/{e2e,staging}/**/*.test.ts',
  },

  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
})
