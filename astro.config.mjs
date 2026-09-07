import { defineConfig } from "astro/config";

const isVercel = process.env.VERCEL === "1";

export default defineConfig({
  output: "static",
  outDir: "./astro-dist",
  site: isVercel ? "https://upravlyayushchiy-sovet.vercel.app" : "https://vladimirstega.github.io",
  base: isVercel ? "/" : "/upravlyayushchiy-sovet",
  build: {
    format: "directory"
  }
});
