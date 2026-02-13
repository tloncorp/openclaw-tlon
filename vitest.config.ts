import { defineConfig } from "vitest/config";
import { config } from "dotenv";

// Load .env file
config();

export default defineConfig({
  test: {
    // Increase timeout for integration tests (they hit real services)
    testTimeout: 120_000,
    hookTimeout: 60_000,
  },
});
