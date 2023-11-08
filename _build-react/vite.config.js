/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    globals: false,
    environment: "jsdom",
    setupFiles: ["./didact/__test__/setup.mjs"],
    exclude: [
      // our additions
      "**/__test__/e2e/**/*",
      // defaults
      // @see https://vitest.dev/config/#exclude
      "**/node_modules/**",
      "**/dist/**",
      "**/cypress/**",
      "**/.{idea,git,cache,output,temp}/**",
      "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
    ],
  },
});
