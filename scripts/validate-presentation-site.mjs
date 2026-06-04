import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = path.resolve(root, "..");
const actualRoot = "C:\\codebase\\sip_studies\\actual";

const mainPath = path.join(root, "src", "main.js");
const stylesPath = path.join(root, "src", "styles.css");
const readmePath = path.join(root, "README.md");
const packagePath = path.join(root, "package.json");
const distPath = path.join(root, "dist");
const documentsRoot = path.join(root, "public", "documents");
const dataPath = path.join(root, "src", "master-resume-data.js");
const portraitPath = path.join(root, "src", "portrait-gallery.js");
const workbookPath = path.join(workspaceRoot, "Raw Data", "Jonathan_Yu_Resume_Master_Edit.xlsx");
const deploySnapshot = !fs.existsSync(workbookPath);

const masterData = (await import(pathToFileURL(dataPath))).default;
const portraitGallery = (await import(pathToFileURL(portraitPath))).default;

const main = fs.readFileSync(mainPath, "utf8");
const styles = fs.readFileSync(stylesPath, "utf8");
const readme = fs.readFileSync(readmePath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

function fileExists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function collectObjectKeys(value, needleKeys, trail = "masterData", hits = []) {
  if (!value || typeof value !== "object") return hits;
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectObjectKeys(item, needleKeys, `${trail}[${index}]`, hits));
    return hits;
  }

  Object.entries(value).forEach(([key, child]) => {
    const childTrail = `${trail}.${key}`;
    if (needleKeys.includes(key)) hits.push(childTrail);
    collectObjectKeys(child, needleKeys, childTrail, hits);
  });

  return hits;
}

function collectStringPhrases(value, phrases, trail = "masterData", hits = []) {
  if (typeof value === "string") {
    phrases.forEach((phrase) => {
      if (value.toLowerCase().includes(phrase.toLowerCase())) hits.push(`${trail}: ${phrase}`);
    });
    return hits;
  }

  if (!value || typeof value !== "object") return hits;
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectStringPhrases(item, phrases, `${trail}[${index}]`, hits));
    return hits;
  }

  Object.entries(value).forEach(([key, child]) => collectStringPhrases(child, phrases, `${trail}.${key}`, hits));
  return hits;
}

function indexOfText(haystack, needle) {
  const index = haystack.indexOf(needle);
  check(index >= 0, `Missing required text: ${needle}`);
  return index;
}

function latestAsset(ext) {
  const assetsDir = path.join(distPath, "assets");
  if (!fs.existsSync(assetsDir)) return "";
  return fs
    .readdirSync(assetsDir)
    .filter((name) => name.endsWith(ext))
    .map((name) => path.join(assetsDir, name))
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0] || "";
}

const expectedModes = [
  "01 Full Resume",
  "02 Codex Projects",
  "03 Podcast + Video",
  "04 Application Proof",
  "05 Hiring Close"
];

let previousModeIndex = -1;
expectedModes.forEach((mode) => {
  const modeIndex = indexOfText(main, mode);
  check(modeIndex > previousModeIndex, `Walkthrough mode order is wrong near ${mode}`);
  previousModeIndex = modeIndex;
});

if (!deploySnapshot) check(fs.existsSync(workbookPath), `Missing source workbook: ${workbookPath}`);
check(masterData.source === "Raw Data/Jonathan_Yu_Resume_Master_Edit.xlsx", "Generated data is not sourced from the Master_Edit workbook path.");
check(masterData.resume?.name === "Jonathan Yu", "Generated resume identity is not Jonathan Yu.");
check(Array.isArray(masterData.resume?.experience) && masterData.resume.experience.length >= 7, "Generated resume does not include the expected full chronology.");
check(Array.isArray(masterData.roles) && masterData.roles.length === 6, "Generated site data should expose six role targets.");
check(Array.isArray(masterData.metrics) && masterData.metrics.length >= 4, "Generated site data should expose proof metrics.");

const forbiddenSiteKeys = ["location", "compensation", "sourceTitle", "url", "priority", "team"];
const forbiddenKeyHits = collectObjectKeys(masterData, forbiddenSiteKeys);
check(forbiddenKeyHits.length === 0, `Generated public site data exposes posting metadata keys: ${forbiddenKeyHits.join(", ")}`);

const stalePresentationPhrases = [
  "this console",
  "the console",
  "live pivot console",
  "live role switcher",
  "campus adoption console",
  "demo library",
  "technical demos",
  "positioning system",
  "terminology system",
  "terminology systems",
  "education systems",
  "platform systems",
  "working systems",
  "reusable systems",
  "visual systems"
];
const stalePhraseHits = collectStringPhrases(masterData, stalePresentationPhrases);
check(stalePhraseHits.length === 0, `Generated data still contains tool/system phrasing: ${stalePhraseHits.join(", ")}`);

check(main.includes("function renderFullResume()"), "Missing Full Resume renderer.");
check(main.includes("Presenter lens"), "Full Resume tab is missing the presenter lens.");
check(main.includes("resume-role-bridge"), "Full Resume tab is missing role-specific timeline bridges.");
check(main.includes("function renderProjects()"), "Missing Codex Projects renderer.");
check(main.includes("Full project scope from C:\\\\codebase\\\\sip_studies\\\\actual"), "Projects tab does not name the full Codex portfolio scope.");
check(main.includes("function renderEducationMedia()"), "Missing podcast/video education renderer.");
check(main.includes("youtubeEmbedUrl"), "Podcast/video tab is missing YouTube embed support.");
check(main.includes("open.spotify.com/embed/show"), "Podcast/video tab is missing Spotify embed support.");
check(main.includes("const aarpWineWalkVideos"), "Podcast/video tab is missing AARP Wine Walk Wednesdays data.");
check(main.includes("const instagramVideos"), "Podcast/video tab is missing Sip Studies Instagram reel data.");
check(main.includes('frame: "instagram"'), "Sip Studies Instagram reels are missing the vertical Instagram frame marker.");
check(main.includes('scrolling="no"'), "Sip Studies Instagram embeds are missing scrollbar suppression.");
check(main.includes("episode-grid--instagram"), "Sip Studies Instagram reels are missing the desktop two-column grid hook.");
check(!main.includes("https://www.instagram.com/sip.studies/reel/DGwT3fXvRxt/embed"), "Instagram data still includes the browser-blocked Pinot Grigio/Syrah username-qualified embed URL.");
check(!main.includes("https://www.instagram.com/sip.studies/reel/DGO8bRFRpj2/embed"), "Instagram data still includes the browser-blocked Sip and Describe username-qualified embed URL.");
check(main.includes("const flavorBlogCollections"), "Podcast/video tab is missing Flavor Blog article collections.");
["Aromatic Treasures", "Summertime Wines", "Classic Burgundy", "Everything Sparkling"].forEach((title) => {
  check(main.includes(title), `AARP Wine Walk Wednesdays section is missing ${title}.`);
});
["DGcYlnWxP7M", "DFuLhCVRDIU", "DFisS-QyRzE", "DFdKYo7RMBC"].forEach((shortcode) => {
  check(main.includes(`https://www.instagram.com/reel/${shortcode}/embed`), `Sip Studies Instagram reel section is missing working embed ${shortcode}.`);
});
["SipStudies.com Blog", "Sip Studies Substack", "Daily Sip"].forEach((title) => {
  check(main.includes(title), `Flavor Blog collections are missing ${title}.`);
});
["https://i.ytimg.com/vi/", "media.bio.site/sites", "images.squarespace-cdn.com", "substackcdn.com", "https://sipopedia.com/daily-sip/"].forEach((host) => {
  check(main.includes(host), `Media/article collections are missing thumbnail source ${host}.`);
});
check(main.includes("function renderApplicationProof()"), "Missing application proof renderer.");
check(main.includes("function renderRoleFit()"), "Missing hiring close renderer.");
check(main.includes("applyHashState"), "Shareable hash state is missing.");
check(main.includes("hashchange"), "Hash navigation listener is missing.");
check(main.includes("updateUrlState"), "Role/tab hash update is missing.");

[
  "Sip-Studies",
  "Rose-Quartz",
  "Work-Efficient",
  "FinTech",
  "Armandos-Challenge",
  "Ai-Edu",
  "Biz-Bookkeeper",
  "Coffee-Index",
  "Sip-Studies-Tasting-Journal",
  "Tax-File-Prep_Excel"
].forEach((folder) => {
  check(main.includes(folder), `Codex Projects index is missing ${folder}.`);
  if (!deploySnapshot) {
    check(fs.existsSync(path.join(actualRoot, folder)), `Referenced Codex project folder does not exist: ${path.join(actualRoot, folder)}`);
  }
});

check(styles.includes("Sipopedia color system"), "Styles are missing the Sipopedia color-system override.");
[
  "--sip-bg",
  "--sip-heading",
  "--sip-cyan",
  ".resume-lens-panel",
  ".episode-player",
  ".episode-grid--instagram",
  ".episode-player--instagram",
  "clamp(420px, 36vw, 620px)",
  "aspect-ratio: 9 / 13.85",
  ".article-card"
].forEach((selector) => {
  check(styles.includes(selector), `Styles are missing ${selector}.`);
});

check(packageJson.scripts?.["sync:portrait"], "package.json is missing sync:portrait.");
check(packageJson.scripts?.build, "package.json is missing build.");

check(Array.isArray(portraitGallery) && portraitGallery.length >= 1, "Portrait gallery did not generate any images.");
check(portraitGallery[0]?.filename === "jonathan-yu-headshot.jpg", "Primary headshot should be the first portrait gallery item.");

const roleDocKinds = ["Resume", "Cover_Letter", "30_60_90_Plan"];
const roleDocFormats = ["pdf", "docx", "md"];
masterData.roles.forEach((role) => {
  roleDocKinds.forEach((kind) => {
    roleDocFormats.forEach((format) => {
      const file = `${role.prefix}_${kind}.${format}`;
      const relativePath = path.join("public", "documents", "openai-2026-06-02", role.folder, file);
      check(fileExists(relativePath), `Missing role document: ${relativePath}`);
    });
  });
});

[
  "JONATHAN_YU_SIP_STUDIES_COMBINED_RESUME_V4_CRITICAL_ON_HAND_2026-06-02.pdf",
  "JONATHAN_YU_SIP_STUDIES_COMBINED_RESUME_V4_CRITICAL_ON_HAND_2026-06-02.docx",
  "JONATHAN_YU_SIP_STUDIES_COMBINED_RESUME_V4_CRITICAL_ON_HAND_2026-06-02.md"
].forEach((file) => {
  check(fileExists(path.join("public", "documents", "resume", file)), `Missing master resume artifact: ${file}`);
});

check(readme.includes("#resume/codex-deployment"), "README does not document shareable walkthrough hashes.");
check(readme.includes("start with the traditional resume"), "README does not document the intended presentation sequence.");

check(fs.existsSync(path.join(distPath, "index.html")), "Build output is missing dist/index.html.");
const latestJs = latestAsset(".js");
const latestCss = latestAsset(".css");
check(Boolean(latestJs), "Build output is missing a JS asset.");
check(Boolean(latestCss), "Build output is missing a CSS asset.");

if (latestJs) {
  const builtJs = fs.readFileSync(latestJs, "utf8");
  [
    "Presenter lens",
    "Codex Projects",
    "Podcast and video education",
    "AARP Wine Walk Wednesdays",
    "Sip Studies Instagram",
    "SipStudies.com Blog",
    "Sip Studies Substack",
    "Daily Sip",
    "Application proof packet",
    "Hiring-team close"
  ].forEach((text) => {
    check(builtJs.includes(text), `Built JS is missing presentation text: ${text}`);
  });
  const builtForbiddenKeys = forbiddenSiteKeys.filter((key) => {
    const quotedKey = new RegExp(`["']${key}["']\\s*[:=]`, "u");
    const bareKey = new RegExp(`(?:^|[,{])\\s*${key}\\s*:`, "u");
    return quotedKey.test(builtJs) || bareKey.test(builtJs);
  });
  check(builtForbiddenKeys.length === 0, `Built JS appears to expose posting metadata keys: ${builtForbiddenKeys.join(", ")}`);
}

if (latestCss) {
  const builtCss = fs.readFileSync(latestCss, "utf8");
  [
    "--sip-bg",
    ".resume-lens-panel",
    ".episode-player",
    ".episode-grid--instagram",
    ".episode-player--instagram",
    "clamp(420px,36vw,620px)",
    "aspect-ratio:9 / 13.85",
    ".article-card"
  ].forEach((text) => {
    check(builtCss.includes(text), `Built CSS is missing ${text}.`);
  });
}

if (failures.length) {
  console.error("Presentation validation failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Presentation validation passed.");
console.log(`Source workbook: ${masterData.source}`);
console.log(`Resume jobs: ${masterData.resume.experience.length}; roles: ${masterData.roles.length}; portraits: ${portraitGallery.length}`);
console.log(`Build assets: ${path.basename(latestJs)} / ${path.basename(latestCss)}`);
