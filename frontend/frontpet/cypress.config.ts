import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL ?? "http://localhost:3000",
    viewportWidth: 1400,
    viewportHeight: 900,
    defaultCommandTimeout: 15_000,
    requestTimeout: 20_000,
    responseTimeout: 20_000,
    video: false,
    screenshotOnRunFailure: true,
    setupNodeEvents() {
      // extend with reporters / tasks later
    },
    env: {
      apiUrl: process.env.CYPRESS_API_URL ?? "http://localhost:5003",
      ownerEmail: "seed-owner-0@petconnect.test",
      ownerPassword: "SeedPass123!",
      providerEmail: "seed-provider-0@petconnect.test",
      providerPassword: "SeedPass123!",
    },
  },
});
