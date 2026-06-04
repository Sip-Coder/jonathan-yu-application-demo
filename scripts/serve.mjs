import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const logPath = path.join(root, "vite-dev.log");

await import("./sync-portrait-gallery.mjs");

const server = await createServer({
  root,
  clearScreen: false,
  server: {
    host: "127.0.0.1",
    port: 5198,
    strictPort: true
  }
});

await server.listen();
const message = `Vite demo server ready at http://127.0.0.1:5198/ pid=${process.pid}\n`;
fs.appendFileSync(logPath, message);
console.log(message.trim());

setInterval(() => {
  fs.appendFileSync(logPath, `heartbeat ${new Date().toISOString()} pid=${process.pid}\n`);
}, 60_000);
