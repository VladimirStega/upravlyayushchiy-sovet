import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  outDir: "./astro-dist",
  site: "https://vladimirstega.github.io",
  base: "/upravlyayushchiy-sovet",
  build: {
    format: "directory"
  }
});
