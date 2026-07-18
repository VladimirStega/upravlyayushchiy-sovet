import { createServer } from "node:http";
import { existsSync, createReadStream, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { exec } from "node:child_process";
import { fileURLToPath } from "node:url";

const port = 4321;
const rootUrl = existsSync(new URL("./astro-dist/", import.meta.url))
  ? new URL("./astro-dist/", import.meta.url)
  : new URL("./dist/", import.meta.url);
const root = fileURLToPath(rootUrl);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".pdf": "application/pdf"
};

const server = createServer((request, response) => {
  const basePath = "/upravlyayushchiy-sovet";
  const pathname = decodeURIComponent((request.url ?? "/").split("?")[0]);
  const requested = pathname === basePath
    ? "/"
    : pathname.startsWith(`${basePath}/`)
      ? pathname.slice(basePath.length)
      : pathname;
  const relative = normalize(requested).replace(/^([/\\])+/, "");
  let target = join(root, relative);

  if (requested.endsWith("/") || (existsSync(target) && statSync(target).isDirectory())) {
    target = join(target, "index.html");
  }

  if (!existsSync(target)) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Page not found");
    return;
  }

  response.writeHead(200, {
    "Content-Type": contentTypes[extname(target).toLowerCase()] ?? "application/octet-stream"
  });
  createReadStream(target).pipe(response);
});

server.listen(port, "127.0.0.1", () => {
  const url = `http://127.0.0.1:${port}/`;
  console.log(`Website is running: ${url}`);
  console.log("Close this window or press Ctrl+C to stop the server.");
  if (process.env.NO_OPEN !== "1") exec(`start "" "${url}"`);
});
