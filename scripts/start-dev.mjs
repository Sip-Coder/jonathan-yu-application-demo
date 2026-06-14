import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const url = "http://127.0.0.1:5198/";
const outPath = path.join(root, "vite-dev.log");
const errPath = path.join(root, "vite-dev.err.log");
const out = fs.openSync(outPath, "a");
const err = fs.openSync(errPath, "a");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function isServerReady() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1_500);
  try {
    const response = await fetch(url, { signal: controller.signal, cache: "no-store" });
    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

if (await isServerReady()) {
  console.log(JSON.stringify({ status: "already-running", url, log: outPath, errorLog: errPath }, null, 2));
  process.exit(0);
}

const serverScript = path.join(root, "scripts", "serve.mjs");
const child = spawn(process.execPath, [serverScript], {
  cwd: root,
  detached: true,
  windowsHide: true,
  stdio: ["ignore", out, err]
});

child.unref();

const startedAt = Date.now();
while (Date.now() - startedAt < 20_000) {
  if (await isServerReady()) {
    console.log(JSON.stringify({ status: "started", pid: child.pid, url, log: outPath, errorLog: errPath }, null, 2));
    process.exit(0);
  }
  await sleep(500);
}

console.error(
  JSON.stringify(
    {
      status: "not-ready",
      pid: child.pid,
      url,
      log: outPath,
      errorLog: errPath,
      hint: "Check vite-dev.err.log, then rerun npm.cmd run start:detached or npm.cmd run validate:runtime."
    },
    null,
    2
  )
);
process.exit(1);
