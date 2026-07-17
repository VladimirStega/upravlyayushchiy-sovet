import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  site: "https://sovet-v-deystvii.example.org",
  build: {
    format: "directory"
  }
});
