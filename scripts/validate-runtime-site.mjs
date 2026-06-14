import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const baseUrl = normalizeBaseUrl(process.env.SITE_URL || "http://127.0.0.1:5198/");
const spotifyShowId = "1p8kpZbP02yeEx5bM2xg1e";
const oldSpotifyEpisodeId = "5f9GpwIY7hC5IzZVYFc0Pt";
const portfolioPath = "/#portfolio/ai-success";
const zenNoisePath = "/repo-previews/zen-noise/index.html";
const posterPaths = [
  "/media/instagram-posters/sip-studies-01.jpg",
  "/media/instagram-posters/sip-studies-02.jpg",
  "/media/instagram-posters/sip-studies-03.jpg",
  "/media/instagram-posters/sip-studies-04.jpg",
  "/media/instagram-posters/somm-support-01.jpg",
  "/media/instagram-posters/somm-support-02.jpg",
  "/media/instagram-posters/somm-support-03.jpg",
  "/media/instagram-posters/somm-support-04.jpg"
];

const failures = [];

function normalizeBaseUrl(value) {
  return value.endsWith("/") ? value : `${value}/`;
}

function check(condition, message) {
  if (!condition) failures.push(message);
}

function urlFor(pathname) {
  return new URL(pathname, baseUrl).toString();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithTimeout(url, timeoutMs = 8_000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal, cache: "no-store" });
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchText(pathname, label) {
  const targetUrl = urlFor(pathname);
  let response;
  try {
    response = await fetchWithTimeout(targetUrl);
  } catch (error) {
    throw new Error(`${label} is not reachable at ${targetUrl}: ${error.message}`);
  }

  if (!response.ok) {
    throw new Error(`${label} returned HTTP ${response.status} at ${targetUrl}`);
  }

  return response.text();
}

async function checkHttpSurface() {
  try {
    const html = await fetchText("/", "Local demo root");
    check(html.includes("Jonathan Yu"), "Local demo root did not return the application shell.");
  } catch (error) {
    failures.push(
      `${error.message}. Start the site with \`npm.cmd run start:detached\` or \`npm.cmd run dev:5198\`, then rerun \`npm.cmd run validate:runtime\`.`
    );
    return false;
  }

  try {
    const main = await fetchText("/src/main.js", "Vite source module");
    check(main.includes("Sippy's Beverage Blog - By Sip Studies"), "Running source is missing the current Spotify show title.");
    check(main.includes(`open.spotify.com/embed/show/${spotifyShowId}`), "Running source is missing the current Spotify show embed.");
    check(!main.includes(`open.spotify.com/embed/episode/${oldSpotifyEpisodeId}`), "Running source still embeds the old AI Winecast Spotify episode.");
    check(!main.includes("Public proof beyond the PDF"), "Running source still contains the removed public-proof-beyond-PDF section.");
    check(!main.includes("/media/?size=l"), "Running source still uses the broken Instagram media thumbnail endpoint.");
    posterPaths.forEach((posterPath) => {
      check(main.includes(posterPath), `Running source is missing Instagram poster path ${posterPath}.`);
    });
  } catch (error) {
    failures.push(error.message);
  }

  for (const posterPath of posterPaths) {
    try {
      const response = await fetchWithTimeout(urlFor(posterPath));
      check(response.ok, `Instagram poster ${posterPath} returned HTTP ${response.status}.`);
      check((response.headers.get("content-type") || "").startsWith("image/"), `Instagram poster ${posterPath} is not served as an image.`);
    } catch (error) {
      failures.push(`Instagram poster ${posterPath} is not reachable: ${error.message}`);
    }
  }

  try {
    const zenHtml = await fetchText(zenNoisePath, "Zen Noise static preview");
    check(zenHtml.includes("zen-noise-preview-service-worker-disabled"), "Zen Noise preview index is missing the service-worker-disabled marker.");
    const scriptMatch = zenHtml.match(/<script[^>]+src="([^"]*assets\/index-[^"]+\.js)"/u);
    check(Boolean(scriptMatch), "Zen Noise preview index does not reference its bundled JS asset.");
    if (scriptMatch) {
      const scriptUrl = new URL(scriptMatch[1], urlFor(zenNoisePath));
      const scriptResponse = await fetchWithTimeout(scriptUrl.toString());
      check(scriptResponse.ok, `Zen Noise preview JS returned HTTP ${scriptResponse.status}.`);
      if (scriptResponse.ok) {
        const scriptBody = await scriptResponse.text();
        check(scriptBody.includes("zen-noise-preview-route-patch"), "Zen Noise preview JS is missing the router patch marker.");
      }
    }
  } catch (error) {
    failures.push(error.message);
  }

  return true;
}

function chromeCandidates() {
  return [
    process.env.CHROME_PATH,
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, "Google", "Chrome", "Application", "chrome.exe"),
    process.env.PROGRAMFILES && path.join(process.env.PROGRAMFILES, "Google", "Chrome", "Application", "chrome.exe"),
    process.env["PROGRAMFILES(X86)"] && path.join(process.env["PROGRAMFILES(X86)"], "Google", "Chrome", "Application", "chrome.exe")
  ].filter(Boolean);
}

function findChrome() {
  return chromeCandidates().find((candidate) => fs.existsSync(candidate));
}

async function startHeadlessChrome() {
  if (typeof WebSocket !== "function") {
    throw new Error("This runtime check needs a Node.js version with a global WebSocket implementation.");
  }

  const chromePath = findChrome();
  if (!chromePath) {
    throw new Error("Google Chrome was not found. Set CHROME_PATH to chrome.exe or run the HTTP checks without browser validation.");
  }

  const profileDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), "application-demo-runtime-"));
  const child = spawn(
    chromePath,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-first-run",
      "--no-default-browser-check",
      `--user-data-dir=${profileDir}`,
      "--remote-debugging-port=0",
      "--window-size=1280,920",
      "about:blank"
    ],
    {
      stdio: ["ignore", "ignore", "ignore"],
      windowsHide: true
    }
  );

  const portFile = path.join(profileDir, "DevToolsActivePort");
  const startedAt = Date.now();
  while (!fs.existsSync(portFile)) {
    if (child.exitCode !== null) {
      throw new Error(`Chrome exited before opening DevTools, exit code ${child.exitCode}.`);
    }
    if (Date.now() - startedAt > 10_000) {
      child.kill("SIGKILL");
      throw new Error("Chrome did not expose a DevTools port within 10 seconds.");
    }
    await sleep(100);
  }

  const [port] = fs.readFileSync(portFile, "utf8").trim().split(/\r?\n/u);

  return {
    child,
    profileDir,
    endpoint: `http://127.0.0.1:${port}`
  };
}

async function connectCdp(webSocketUrl) {
  const socket = new WebSocket(webSocketUrl);
  const pending = new Map();
  const handlers = new Map();
  let nextId = 1;

  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", () => reject(new Error("Could not connect to Chrome DevTools.")), { once: true });
  });

  socket.addEventListener("message", (event) => {
    const payload = JSON.parse(event.data);
    if (payload.id && pending.has(payload.id)) {
      const { resolve, reject } = pending.get(payload.id);
      pending.delete(payload.id);
      if (payload.error) reject(new Error(payload.error.message));
      else resolve(payload.result || {});
      return;
    }

    const callbacks = handlers.get(payload.method) || [];
    callbacks.forEach((callback) => callback(payload.params || {}));
  });

  return {
    on(method, callback) {
      const callbacks = handlers.get(method) || [];
      callbacks.push(callback);
      handlers.set(method, callbacks);
    },
    send(method, params = {}) {
      const id = nextId;
      nextId += 1;
      socket.send(JSON.stringify({ id, method, params }));
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
      });
    },
    close() {
      socket.close();
    }
  };
}

async function createBrowserPage() {
  const chrome = await startHeadlessChrome();
  const targets = await (await fetchWithTimeout(`${chrome.endpoint}/json/list`)).json();
  const pageTarget = targets.find((target) => target.type === "page") || targets[0];
  if (!pageTarget?.webSocketDebuggerUrl) {
    throw new Error("Chrome did not provide a page DevTools target.");
  }

  const client = await connectCdp(pageTarget.webSocketDebuggerUrl);
  const sameOriginIssues = [];
  const requestUrls = new Map();
  const expectedOrigin = new URL(baseUrl).origin;

  client.on("Network.requestWillBeSent", (params) => {
    if (params.requestId && params.request?.url) {
      requestUrls.set(params.requestId, params.request.url);
    }
  });

  client.on("Network.responseReceived", (params) => {
    const responseUrl = params.response?.url || "";
    const status = params.response?.status || 0;
    if (responseUrl.startsWith(expectedOrigin) && status >= 400) {
      sameOriginIssues.push(`${status} ${responseUrl}`);
    }
  });

  client.on("Network.loadingFailed", (params) => {
    const requestUrl = requestUrls.get(params.requestId) || "";
    if (
      requestUrl.startsWith(expectedOrigin) &&
      !params.blockedReason &&
      params.errorText &&
      params.errorText !== "net::ERR_ABORTED"
    ) {
      sameOriginIssues.push(`${params.errorText} ${requestUrl}`);
    }
  });

  await client.send("Page.enable");
  await client.send("Runtime.enable");
  await client.send("Network.enable");

  return { chrome, client, sameOriginIssues };
}

async function stopHeadlessChrome(chrome) {
  if (chrome.child.exitCode === null) {
    chrome.child.kill("SIGKILL");
    await new Promise((resolve) => {
      chrome.child.once("exit", resolve);
      setTimeout(resolve, 2_000);
    });
  }

  for (let attempt = 1; attempt <= 6; attempt += 1) {
    try {
      await fs.promises.rm(chrome.profileDir, { recursive: true, force: true });
      return;
    } catch (error) {
      if (attempt === 6) {
        console.warn(`Warning: could not remove temporary Chrome profile ${chrome.profileDir}: ${error.message}`);
        return;
      }
      await sleep(250 * attempt);
    }
  }
}

async function evaluateJson(client, expression) {
  const result = await client.send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: false
  });

  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text || "Chrome evaluation failed.");
  }

  return result.result?.value;
}

async function navigateAndWait(client, targetUrl, readyExpression, label) {
  await client.send("Page.navigate", { url: targetUrl });

  const deadline = Date.now() + 10_000;
  while (Date.now() < deadline) {
    const ready = await evaluateJson(client, readyExpression);
    if (ready) return;
    await sleep(250);
  }

  failures.push(`Chrome did not render ${label} within 10 seconds at ${targetUrl}.`);
}

async function checkBrowserSurface() {
  let page;
  try {
    page = await createBrowserPage();
  } catch (error) {
    failures.push(`Browser runtime check could not start: ${error.message}`);
    return;
  }

  try {
    const portfolioUrl = urlFor(portfolioPath);
    await navigateAndWait(
      page.client,
      portfolioUrl,
      `document.body && document.body.innerText.includes("Sippy's Beverage Blog - By Sip Studies")`,
      "Portfolio"
    );

    const portfolio = await evaluateJson(
      page.client,
      `JSON.stringify((() => {
        const html = document.documentElement.innerHTML;
        const body = document.body?.innerText || "";
        const spotifyIframe = document.querySelector(".podcast-audio-panel iframe");
        const instagramPlayers = Array.from(document.querySelectorAll(".episode-player--instagram"));
        const instagramPosterPlayers = instagramPlayers.filter((player) => {
          const style = player.getAttribute("style") || "";
          const cssThumb = getComputedStyle(player).getPropertyValue("--episode-thumb") || "";
          return style.includes("/media/instagram-posters/") || cssThumb.includes("/media/instagram-posters/");
        });
        return {
          title: document.title,
          spotifyTitle: body.includes("Sippy's Beverage Blog - By Sip Studies"),
          oldSpotify: html.includes("${oldSpotifyEpisodeId}") || body.includes("Welcome to Sip Studies | AI Winecast 000"),
          removedPublicProof: !html.includes("Public proof beyond the PDF"),
          mediaPanels: document.querySelectorAll(".media-panel").length,
          spotifyIframeSrc: spotifyIframe?.src || "",
          instagramCards: document.querySelectorAll(".episode-card--instagram").length,
          instagramPlayers: instagramPlayers.length,
          instagramPosterPlayers: instagramPosterPlayers.length,
          legacyInstagramEndpoint: html.includes("/media/?size=l"),
          zenPreviewIframes: Array.from(document.querySelectorAll(".website-preview-screen iframe"))
            .map((iframe) => iframe.getAttribute("src") || iframe.src)
            .filter((src) => src.includes("/repo-previews/zen-noise/")),
          bodyHas404: body.includes("404 Page Not Found") || body.includes("Page Not Found")
        };
      })())`
    );
    const portfolioState = JSON.parse(portfolio);

    check(portfolioState.spotifyTitle, "Chrome-rendered Portfolio is missing the current Spotify show title.");
    check(!portfolioState.oldSpotify, "Chrome-rendered Portfolio still references the old Spotify episode.");
    check(portfolioState.removedPublicProof, "Chrome-rendered Portfolio still contains the removed public-proof-beyond-PDF section.");
    check(portfolioState.mediaPanels === 0, "Chrome-rendered Portfolio still has .media-panel markup.");
    check(
      portfolioState.spotifyIframeSrc.includes(`open.spotify.com/embed/show/${spotifyShowId}`),
      `Chrome-rendered Spotify iframe points at ${portfolioState.spotifyIframeSrc || "nothing"}.`
    );
    check(portfolioState.instagramCards === 8, `Chrome-rendered Portfolio expected 8 Instagram cards, found ${portfolioState.instagramCards}.`);
    check(portfolioState.instagramPlayers === 8, `Chrome-rendered Portfolio expected 8 Instagram players, found ${portfolioState.instagramPlayers}.`);
    check(portfolioState.instagramPosterPlayers === 8, `Chrome-rendered Portfolio expected 8 local Instagram poster thumbnails, found ${portfolioState.instagramPosterPlayers}.`);
    check(!portfolioState.legacyInstagramEndpoint, "Chrome-rendered Portfolio still includes the broken Instagram /media/?size=l endpoint.");
    check(portfolioState.zenPreviewIframes.length === 1, `Chrome-rendered Portfolio expected one Zen Noise preview iframe, found ${portfolioState.zenPreviewIframes.length}.`);
    check(!portfolioState.bodyHas404, "Chrome-rendered Portfolio includes visible 404/Page Not Found text.");

    const zenUrl = urlFor(zenNoisePath);
    await navigateAndWait(
      page.client,
      zenUrl,
      `document.body && (document.body.innerText.includes("Zen Noise") || document.body.innerText.includes("Brown Noise") || document.body.innerText.includes("Rain"))`,
      "Zen Noise preview"
    );
    const zen = await evaluateJson(
      page.client,
      `JSON.stringify((() => {
        const body = document.body?.innerText || "";
        return {
          title: document.title,
          hasZenNoise: body.includes("Zen Noise"),
          hasSoundControl: body.includes("Brown Noise") || body.includes("Rain") || body.includes("Coffee"),
          has404: body.includes("404 Page Not Found") || body.includes("Page Not Found")
        };
      })())`
    );
    const zenState = JSON.parse(zen);
    check(zenState.hasZenNoise, "Chrome-rendered Zen Noise preview is missing the Zen Noise title.");
    check(zenState.hasSoundControl, "Chrome-rendered Zen Noise preview is missing sound controls.");
    check(!zenState.has404, "Chrome-rendered Zen Noise preview shows a 404/Page Not Found state.");

    const sameOriginErrors = page.sameOriginIssues.filter((issue) => !issue.includes("favicon"));
    check(sameOriginErrors.length === 0, `Chrome saw same-origin runtime errors: ${sameOriginErrors.join("; ")}`);
  } catch (error) {
    failures.push(`Browser runtime check failed: ${error.message}`);
  } finally {
    page.client.close();
    await stopHeadlessChrome(page.chrome);
  }
}

function report() {
  if (failures.length) {
    console.error("Runtime validation failed:");
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exit(1);
  }

  console.log("Runtime validation passed.");
  console.log(`Checked URL: ${baseUrl}`);
  console.log(`Portfolio: ${urlFor(portfolioPath)}`);
  console.log(`Zen Noise preview: ${urlFor(zenNoisePath)}`);
}

if (await checkHttpSurface()) {
  await checkBrowserSurface();
}

report();
