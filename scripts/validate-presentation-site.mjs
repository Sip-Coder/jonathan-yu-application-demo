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
const indexPath = path.join(root, "index.html");
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
const indexHtml = fs.readFileSync(indexPath, "utf8");
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
check(main.includes("instagramCaption"), "Sip Studies Instagram reels are missing source description text.");
check(main.includes("Portfolio takeaway"), "Sip Studies Instagram reels are missing the portfolio-side takeaway copy.");
check(main.includes('frame: "instagram"'), "Sip Studies Instagram reels are missing the vertical Instagram frame marker.");
check(main.includes('scrolling="no"'), "Sip Studies Instagram embeds are missing scrollbar suppression.");
check(main.includes("episode-grid--instagram"), "Sip Studies Instagram reels are missing the desktop two-column grid hook.");
check(!main.includes("https://www.instagram.com/sip.studies/reel/DGwT3fXvRxt/embed"), "Instagram data still includes the browser-blocked Pinot Grigio/Syrah username-qualified embed URL.");
check(!main.includes("https://www.instagram.com/sip.studies/reel/DGO8bRFRpj2/embed"), "Instagram data still includes the browser-blocked Sip and Describe username-qualified embed URL.");
["Neutral Whites & Bonus Wines Blind Tasting", "Albariño/Alvarinho Tasting!!!", "Lee's Beer and Tequila 2023", "Charity Drive at Madhouse Coffee"].forEach((caption) => {
  check(main.includes(caption), `Sip Studies Instagram reel source descriptions are missing ${caption}.`);
});
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
check(main.includes("function renderProofMatrix()"), "Application Proof tab is missing the role proof matrix renderer.");
check(main.includes("Role proof matrix"), "Application Proof tab is missing the role proof matrix section.");
check(main.includes("const docSlugByName"), "Application Proof tab is missing packet document hash slugs.");
check(main.includes('docNameBySlug[docSlug] || "Resume"'), "Application Proof tab is missing packet document hash parsing.");
check(main.includes('selectedDoc !== "Resume"'), "Application Proof tab is missing optional document hash updates.");
check(main.includes("function renderSelectedDocumentPanel("), "Application Proof tab is missing the selected-document action panel.");
check(main.includes("Selected packet document"), "Application Proof tab is missing selected-document panel copy.");
check(main.includes("function docTabId("), "Application Proof document tabs are missing stable tab IDs.");
check(main.includes('data-doc-tab'), "Application Proof document tabs are missing the keyboard-navigation hook.");
check(main.includes('role="tab"'), "Application Proof document buttons are missing tab semantics.");
check(main.includes('role="tabpanel"'), "Application Proof selected document panel is missing tabpanel semantics.");
check(main.includes('aria-selected="${isActive ? "true" : "false"}"'), "Application Proof document tabs are missing active-state aria-selected semantics.");
check(main.includes('aria-controls="${selectedDocumentPanelId}"'), "Application Proof document tabs are missing aria-controls.");
check(main.includes('aria-labelledby="${docTabId(name)}"'), "Application Proof selected document panel is missing aria-labelledby.");
check(main.includes("function selectDocument("), "Application Proof document tab selection is missing the shared state helper.");
check(main.includes("function documentAtOffset("), "Application Proof document tabs are missing arrow-key document navigation.");
check(main.includes('event.key === "Home" || event.key === "End"'), "Application Proof document tabs are missing Home/End keyboard navigation.");
check(!main.includes("preview for ${selectedRole.title}"), "Application Proof tab still embeds a brittle PDF preview iframe.");
check(main.includes("function roleBriefText("), "Presentation command center is missing the copyable role brief text generator.");
check(main.includes("data-copy-brief"), "Presentation command center is missing the copy role brief button.");
check(main.includes("Copyable role brief"), "Presentation command center is missing the role brief cue.");
check(main.includes("function showCopyStatus("), "Copy actions are missing a shared status helper.");
check(main.includes("data-copy-status"), "Copy actions are missing the live status region.");
check(main.includes('aria-live="polite"'), "Copy status region is missing polite live announcement.");
check(main.includes("View link copied."), "Copy view action is missing status text.");
check(main.includes("Role brief copied."), "Copy role brief action is missing status text.");
check(main.includes("Copy command failed."), "Copy fallback should throw when the fallback copy command fails.");
check(main.includes('artifactButton("Role 30-60-90"'), "Top actions are missing the role 30-60-90 plan link.");
check(main.includes("function focusModeButton()"), "Top actions are missing the focus mode button renderer.");
check(main.includes("function initialFocusMode()"), "Focus mode is missing query-string initialization.");
check(main.includes('get("focus") === "1"'), "Focus mode is missing ?focus=1 support.");
check(main.includes("data-focus-mode"), "Focus mode button hook is missing.");
check(main.includes("is-focus-mode"), "Focus mode body class toggle is missing.");
check(main.includes('event.key.toLowerCase() === "f"'), "Focus mode keyboard shortcut is missing.");
check(main.includes("function renderRoleFit()"), "Missing hiring close renderer.");
check(main.includes("applyHashState"), "Shareable hash state is missing.");
check(main.includes("hashchange"), "Hash navigation listener is missing.");
check(main.includes("updateUrlState"), "Role/tab hash update is missing.");
check(main.includes("url.hash = nextHash"), "Role/tab hash updates should preserve the current query string.");
check(/document\.querySelectorAll\("\[data-doc\]"\)[\s\S]*?selectDocument\(button\.dataset\.doc\);/.test(main), "Document tab clicks should update the shareable URL.");
check(main.includes("function updateDocumentMetadata("), "Dynamic document metadata updater is missing.");
check(main.includes("document.title = title"), "Dynamic document title update is missing.");
check(main.includes('meta[property="og:title"]'), "Dynamic Open Graph title update is missing.");
check(main.includes("Selected role:"), "Dynamic metadata should describe the selected role.");

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
  ".episode-caption",
  ".episode-takeaway",
  "white-space: pre-line",
  "clamp(420px, 36vw, 620px)",
  "aspect-ratio: 9 / 13.85",
  ".article-card",
  ".skip-link",
  ".presentation-brief",
  ".brief-copy-button",
  ".copy-status",
  ".screen-focus-link",
  ".is-focus-mode .rail",
  ".selected-document-panel",
  ".selected-document-panel:focus-visible",
  ".proof-matrix",
  "@media (prefers-reduced-motion: reduce)",
  "[data-parallax-depth]"
].forEach((selector) => {
  check(styles.includes(selector), `Styles are missing ${selector}.`);
});

check(
  /@media\s*\(max-width:\s*760px\)[\s\S]*?\.preview-frame\s*\{[\s\S]*?display:\s*none;/.test(styles),
  "Mobile styles should hide the embedded PDF preview frame."
);
check(
  /\.presentation-command\s*\{[\s\S]*?background:\s*transparent;[\s\S]*?box-shadow:\s*none;/.test(styles),
  "Presentation command center should stay unframed around its individual panels."
);
check(
  /@media\s*\(max-width:\s*760px\)[\s\S]*?\.top-actions\s*\{[\s\S]*?flex:\s*0 1 auto;[\s\S]*?\.topbar > div:first-child\s*\{[\s\S]*?flex:\s*0 1 auto;/.test(styles),
  "Mobile topbar should reset desktop flex sizing."
);

[
  "Skip to presentation content",
  'id="presentation-content"',
  'tabindex="-1"',
  "prefers-reduced-motion: reduce"
].forEach((text) => {
  check(main.includes(text), `main.js is missing accessibility text: ${text}`);
});

if (!deploySnapshot) check(packageJson.scripts?.["sync:resume"], "package.json is missing sync:resume.");
check(packageJson.scripts?.["sync:portrait"], "package.json is missing sync:portrait.");
check(packageJson.scripts?.build, "package.json is missing build.");

[
  "Jonathan Yu | AI Product Builder Portfolio",
  "name=\"author\" content=\"Jonathan Yu\"",
  "name=\"theme-color\" content=\"#041824\"",
  "property=\"og:title\"",
  "property=\"og:image\" content=\"/assets/header/codex-projects-hero.png\"",
  "name=\"twitter:card\" content=\"summary_large_image\"",
  "rel=\"icon\" href=\"/favicon.svg\"",
  "rel=\"manifest\" href=\"/site.webmanifest\""
].forEach((text) => {
  check(indexHtml.includes(text), `index.html is missing metadata: ${text}`);
});

check(fileExists("public/favicon.svg"), "Missing public favicon.svg.");
check(fileExists("public/site.webmanifest"), "Missing public site.webmanifest.");
check(fileExists("public/robots.txt"), "Missing public robots.txt.");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "public", "site.webmanifest"), "utf8"));
check(manifest.name === "Jonathan Yu AI Product Builder Portfolio", "Web manifest has the wrong name.");
check(manifest.icons?.some((icon) => icon.src === "/favicon.svg"), "Web manifest does not reference favicon.svg.");

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
check(readme.includes("#application/codex-deployment/cover-letter"), "README does not document cover letter packet hashes.");
check(readme.includes("#application/codex-deployment/30-60-90"), "README does not document 30-60-90 packet hashes.");
check(readme.includes("Dynamic browser titles and descriptions"), "README does not document dynamic browser metadata.");
check(readme.includes("start with the traditional resume"), "README does not document the intended presentation sequence.");
check(readme.includes("copyable role brief"), "README does not document the copyable role brief.");
check(readme.includes("Copy confirmations use an unobtrusive live status layer"), "README does not document copy confirmations.");
check(readme.includes("Persistent top-bar links"), "README does not document persistent packet links.");
check(readme.includes("screen-share focus mode"), "README does not document focus mode.");
check(readme.includes("`F` key"), "README does not document the focus mode keyboard shortcut.");
check(readme.includes("?focus=1"), "README does not document the focus mode query parameter.");
check(readme.includes("proof matrix"), "README does not document the application proof matrix.");
check(readme.includes("selected-document panel"), "README does not document the selected-document panel.");

check(fs.existsSync(path.join(distPath, "index.html")), "Build output is missing dist/index.html.");
if (fs.existsSync(path.join(distPath, "index.html"))) {
  const builtIndex = fs.readFileSync(path.join(distPath, "index.html"), "utf8");
  [
    "Jonathan Yu | AI Product Builder Portfolio",
    "property=\"og:image\" content=\"/assets/header/codex-projects-hero.png\"",
    "rel=\"icon\" href=\"/favicon.svg\"",
    "rel=\"manifest\" href=\"/site.webmanifest\""
  ].forEach((text) => {
    check(builtIndex.includes(text), `Built index.html is missing metadata: ${text}`);
  });
}
check(fileExists("dist/favicon.svg"), "Build output is missing favicon.svg.");
check(fileExists("dist/site.webmanifest"), "Build output is missing site.webmanifest.");
check(fileExists("dist/robots.txt"), "Build output is missing robots.txt.");
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
    "Role proof matrix",
    "Map each hiring question to the artifact that answers it.",
    "cover-letter",
    "Selected packet document",
    "Selected role:",
    "Active packet document:",
    "View link copied.",
    "Role brief copied.",
    "Copyable role brief",
    "Role 30-60-90",
    "Focus",
    "screen-share focus mode",
    "Suggested sequence",
    "Hiring-team close",
    "Live interview answer board",
    "Keep the conversation anchored to the right proof.",
    "Skip to presentation content",
    "presentation-content"
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
    ".article-card",
    ".answer-board",
    ".presentation-brief",
    ".brief-copy-button",
    ".copy-status",
    ".screen-focus-link",
    ".is-focus-mode .rail",
    ".selected-document-panel",
    ".selected-document-panel:focus-visible",
    ".proof-matrix",
    ".skip-link",
    "@media(prefers-reduced-motion:reduce)",
    ".preview-frame{display:none}"
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
