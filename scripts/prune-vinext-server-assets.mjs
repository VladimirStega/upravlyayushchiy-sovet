import { access, readdir, rename, rm, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const publicDir = join(root, "public");
const clientDir = join(root, "dist", "client");
const serverDir = join(root, "dist", "server");
const workerEntry = join(serverDir, "index.js");
const vinextEntry = join(serverDir, "vinext-handler.js");

const exists = async (path) => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

const sizeOf = async (path) => {
  const metadata = await stat(path);
  if (metadata.isFile()) return metadata.size;

  const entries = await readdir(path, { withFileTypes: true });
  let size = 0;
  for (const entry of entries) {
    size += await sizeOf(join(path, entry.name));
  }
  return size;
};

const publicEntries = await readdir(publicDir, { withFileTypes: true });
let removedBytes = 0;

for (const entry of publicEntries) {
  const clientAsset = join(clientDir, entry.name);
  const serverAsset = join(serverDir, entry.name);

  if (!(await exists(serverAsset))) continue;
  if (!(await exists(clientAsset))) {
    throw new Error(`Cannot prune ${entry.name}: the client asset copy is missing.`);
  }

  removedBytes += await sizeOf(serverAsset);
  await rm(serverAsset, { recursive: true, force: true });
}

console.log(`Removed ${(removedBytes / 1024 / 1024).toFixed(2)} MiB of duplicated public assets from the Worker bundle.`);

if (!(await exists(vinextEntry))) {
  if (!(await exists(workerEntry))) {
    throw new Error("Cannot create the Worker wrapper: dist/server/index.js is missing.");
  }

  await rename(workerEntry, vinextEntry);
  await writeFile(
    workerEntry,
    `import vinextHandler from "./vinext-handler.js";\n` +
      `export * from "./vinext-handler.js";\n\n` +
      `export default {\n` +
      `  fetch(request, env, context) {\n` +
      `    return vinextHandler(request, env, context);\n` +
      `  }\n` +
      `};\n`,
    "utf8"
  );
}

console.log("Wrapped the Vinext request handler in a Worker-compatible fetch export.");
