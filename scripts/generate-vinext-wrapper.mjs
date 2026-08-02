import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const astroDir = join(root, "astro-dist");
const publicDir = join(root, "public");
const generatedDir = join(root, "src", "generated");

const extractBody = (html) => {
  const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!match) throw new Error("Не удалось извлечь содержимое body из сборки Astro.");
  return match[1];
};

const findCss = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const target = join(directory, entry.name);
    if (entry.isDirectory()) {
      const nested = await findCss(target);
      if (nested) return nested;
    } else if (entry.name.endsWith(".css")) {
      return target;
    }
  }
  return null;
};

const collectPages = async (directory, relative = "") => {
  const entries = await readdir(directory, { withFileTypes: true });
  const pages = {};
  for (const entry of entries) {
    const target = join(directory, entry.name);
    const targetRelative = join(relative, entry.name);
    if (entry.isDirectory()) {
      Object.assign(pages, await collectPages(target, targetRelative));
    } else if (entry.name === "index.html") {
      const routeDirectory = dirname(targetRelative).replaceAll("\\", "/");
      const route = routeDirectory === "." ? "/" : `/${routeDirectory}/`;
      const html = await readFile(target, "utf8");
      pages[route] = extractBody(html).replaceAll("/upravlyayushchiy-sovet", "");
    }
  }
  return pages;
};

const pages = await collectPages(astroDir);

await rm(join(publicDir, "_astro"), { recursive: true, force: true });
await cp(join(astroDir, "_astro"), join(publicDir, "_astro"), { recursive: true });

const cssFile = await findCss(join(astroDir, "_astro"));
if (!cssFile) throw new Error("В сборке Astro не найден CSS-файл.");
await cp(cssFile, join(publicDir, "site.css"));

await mkdir(generatedDir, { recursive: true });
await writeFile(
  join(generatedDir, "site-pages.js"),
  `export const sitePages = ${JSON.stringify(pages)};\n` +
    `export const homeBody = sitePages["/"];\n` +
    `export const checklistBody = sitePages["/komplektator/"];\n`,
  "utf8"
);

console.log("Vinext wrapper assets generated.");
