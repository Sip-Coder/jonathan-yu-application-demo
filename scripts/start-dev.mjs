import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = fs.openSync(path.join(root, "vite-dev.log"), "a");
const err = fs.openSync(path.join(root, "vite-dev.err.log"), "a");

const serverScript = path.join(root, "scripts", "serve.mjs");
const child = spawn(process.execPath, [serverScript], {
  cwd: root,
  detached: true,
  windowsHide: true,
  stdio: ["ignore", out, err]
});

child.unref();

console.log(JSON.stringify({ pid: child.pid, url: "http://127.0.0.1:5198/" }, null, 2));
