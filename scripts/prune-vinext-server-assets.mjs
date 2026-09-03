import { access, readdir, rm, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const publicDir = join(root, "public");
const clientDir = join(root, "dist", "client");
const serverDir = join(root, "dist", "server");

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
