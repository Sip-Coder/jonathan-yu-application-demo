import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const actualRootCandidates = [
  path.resolve(root, "..", "..", "actual"),
  path.resolve(root, "..", "..", "..", "actual")
];
const actualRoot = actualRootCandidates.find((candidate) => fs.existsSync(candidate));
const outputRoot = path.join(root, "public", "repo-previews");

if (!actualRoot) {
  throw new Error(`Could not find actual repo root. Tried: ${actualRootCandidates.join(", ")}`);
}

const previews = [
  {
    slug: "rose-quartz",
    source: path.join(actualRoot, "Rose-Quartz", "dist")
  },
  {
    slug: "coffee-index",
    source: path.join(actualRoot, "Coffee-Index", "dist")
  },
  {
    slug: "tasting-journal",
    source: path.join(actualRoot, "Sip-Studies-Tasting-Journal", "dist", "public")
  }
];

const textExtensions = new Set([".css", ".html", ".js", ".json", ".svg", ".txt", ".webmanifest", ".xml"]);

function ensureDirectory(directory) {
  fs.mkdirSync(directory, { recursive: true });
}

function copyDirectory(source, destination) {
  ensureDirectory(destination);
  fs.readdirSync(source, { withFileTypes: true }).forEach((entry) => {
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(sourcePath, destinationPath);
      return;
    }

    fs.copyFileSync(sourcePath, destinationPath);
  });
}

function rewritePreviewPaths(filePath) {
  if (!textExtensions.has(path.extname(filePath))) return;

  const original = fs.readFileSync(filePath, "utf8");
  const rewritten = original
    .replace(/\r\n?/gu, "\n")
    .replace(/\b(href|src|content|srcset)=(["'])\/(?!\/)/gu, "$1=$2./")
    .replace(/url\((["']?)\/(?!\/)/gu, "url($1./")
    .replace(/(["'`])\/assets\//gu, "$1./assets/")
    .replace(/(["'`])\/(world-[^"'`]+)/gu, "$1./$2")
    .replace(/ +\t/gu, "\t")
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/u, ""))
    .join("\n");

  if (rewritten !== original) {
    fs.writeFileSync(filePath, rewritten);
  }
}

function rewriteDirectory(directory) {
  fs.readdirSync(directory, { withFileTypes: true }).forEach((entry) => {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      rewriteDirectory(filePath);
      return;
    }

    rewritePreviewPaths(filePath);
  });
}

function writeReadme() {
  const readme = [
    "# Repo Website Previews",
    "",
    "Generated static previews for GitHub-backed project websites used by the Portfolio screen-in-screen section.",
    "",
    "Regenerate from local built project outputs with:",
    "",
    "```powershell",
    "npm.cmd run sync:repo-previews",
    "```",
    "",
    "Source build folders:",
    "- `C:\\codebase\\sip_studies\\actual\\Rose-Quartz\\dist`",
    "- `C:\\codebase\\sip_studies\\actual\\Coffee-Index\\dist`",
    "- `C:\\codebase\\sip_studies\\actual\\Sip-Studies-Tasting-Journal\\dist\\public`",
    "",
    "The sync rewrites root-relative asset paths so the snapshots can run from `/repo-previews/<slug>/` inside iframes."
  ].join("\n");

  fs.writeFileSync(path.join(outputRoot, "README.md"), `${readme}\n`);
}

fs.rmSync(outputRoot, { recursive: true, force: true });
ensureDirectory(outputRoot);

previews.forEach((preview) => {
  if (!fs.existsSync(path.join(preview.source, "index.html"))) {
    throw new Error(`Missing preview source index.html: ${preview.source}`);
  }

  const destination = path.join(outputRoot, preview.slug);
  copyDirectory(preview.source, destination);
  rewriteDirectory(destination);
  console.log(`Synced ${preview.slug} from ${preview.source}`);
});

writeReadme();
console.log(`Wrote ${outputRoot}`);
