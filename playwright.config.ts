import { defineConfig } from "@playwright/test";

const accessToken = `<your access token>`;

export default defineConfig({
  use: {
    baseURL: "http://localhost:3001",
    extraHTTPHeaders: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  },
});
