import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = path.resolve(root, "..");
const actualRoot = "C:\\codebase\\sip_studies\\actual";
const isDeploySnapshot = root.split(path.sep).includes("_deploy");

const mainPath = path.join(root, "src", "main.js");
const stylesPath = path.join(root, "src", "styles.css");
const readmePath = path.join(root, "README.md");
const packagePath = path.join(root, "package.json");
const indexPath = path.join(root, "index.html");
const distPath = path.join(root, "dist");
const documentsRoot = path.join(root, "public", "documents");
const dataPath = path.join(root, "src", "master-resume-data.js");
const portraitPath = path.join(root, "src", "portrait-gallery.js");
const portraitCaptionWorkbook = path.join(root, "public", "assets", "portrait", "Jonathan_Yu_Portrait_Captions.xlsx");
const sakeLogoPath = path.join(root, "public", "assets", "logos", "wset-level-2-sake.png");
const workbookPath = path.join(workspaceRoot, "Raw Data", "Jonathan_Yu_Resume_Master_Edit.xlsx");

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

function pdfLooksValid(relativePath) {
  const filePath = path.join(root, relativePath);
  if (!fs.existsSync(filePath)) return false;
  const buffer = fs.readFileSync(filePath);
  const text = buffer.toString("latin1");
  return buffer.subarray(0, 4).toString("latin1") === "%PDF" && /%%EOF\s*$/u.test(text);
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
  "01 Resume",
  "02 Portfolio",
  "03 OpenAI Fit"
];

let previousModeIndex = -1;
expectedModes.forEach((mode) => {
  const modeIndex = indexOfText(main, mode);
  check(modeIndex > previousModeIndex, `Walkthrough mode order is wrong near ${mode}`);
  previousModeIndex = modeIndex;
});

check(isDeploySnapshot || fs.existsSync(workbookPath), `Missing source workbook: ${workbookPath}`);
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

const requiredPositioningPhrases = [
  "AI-assisted product building",
  "agentic harnessing",
  "workflow prototyping",
  "customer workflow translation",
  "human-owned build process",
  "what AI did",
  "What Jonathan decided",
  "problem, process, output, validation, limitations, role relevance",
  "Parameter Golf",
  "OpenAI-style review pattern"
];

requiredPositioningPhrases.forEach((phrase) => {
  check(main.includes(phrase), `Missing required AI Success positioning phrase: ${phrase}`);
});

const forbiddenEmployerPhrases = [
  "I am a vibe coder",
  "vibe coder",
  "AI lets me build without needing engineers",
  "I can learn anything",
  "I made this with AI, so technical gaps are not a problem",
  "I am nontechnical, but"
];
const publicPositioningPayload = `${main}\n${JSON.stringify(masterData)}`;
const forbiddenEmployerHits = forbiddenEmployerPhrases.filter((phrase) =>
  publicPositioningPayload.toLowerCase().includes(phrase.toLowerCase())
);
check(
  forbiddenEmployerHits.length === 0,
  `Public site still contains forbidden employer-facing phrase(s): ${forbiddenEmployerHits.join(", ")}`
);

check(main.includes('const primaryRoleId = "ai-success"'), "Default role should be AI Success Engineer.");
check(main.includes("let selectedRole = primaryRole"), "Default selected role should use the primary AI Success role.");
check(main.includes('let selectedMode = "resume"'), "Default walkthrough should start on Resume.");
check(main.includes("function normalizeModeId("), "Shareable hashes should normalize old application links into the Fit view.");
check(main.includes('application: "fit"'), "Old Application Proof hashes should map to OpenAI Fit.");
check(main.includes('education: "projects"'), "Old Teaching Proof hashes should map to Portfolio.");
check(main.includes('portfolio: "projects"'), "Portfolio alias should map to the Portfolio route.");
check(main.includes('if (modeId === "application") window.requestAnimationFrame(updateUrlState);'), "Legacy application hashes should be rewritten to Fit hashes after parsing.");
check(main.includes("What a busy OpenAI panel should remember after the walkthrough."), "OpenAI Fit is missing the 90-second closing thesis.");
check(main.includes("${renderPresentationCommandCenter(activeMode)}"), "Every deck step should render the presentation command center.");
check(main.includes("function renderTimeboxedRead("), "OpenAI Fit tab is missing the timeboxed read renderer.");
check(main.includes("function renderInterviewerLensPanel("), "OpenAI Fit tab is missing interviewer lenses.");
check(main.includes("Hiring manager"), "OpenAI Fit tab is missing the hiring manager lens.");
check(main.includes("Team member"), "OpenAI Fit tab is missing the team member lens.");
check(main.includes("HR screen"), "OpenAI Fit tab is missing the HR lens.");
check(main.includes("Supervisor"), "OpenAI Fit tab is missing the supervisor lens.");
check(main.includes("function renderFullResume()"), "Missing Resume renderer.");
check(main.includes("Resume reference"), "Resume tab is missing the source-view framing.");
check(main.includes("function renderResumeDetailsDeck()"), "Resume tab is missing the requested resume details deck.");
["Profile", "Experience", "Certifications", "Skills", "Highlights", "Market Scale", "Focus + Edu"].forEach((label) => {
  check(main.includes(label), `Resume details deck is missing ${label}.`);
});
[
  "const certificationLinks = new Map",
  "function credentialListItem(",
  "wset-level-2-sake.png",
  "https://www.wsetglobal.com/qualifications/wset-level-3-award-in-wines/",
  "https://www.wsetglobal.com/qualifications/wset-level-2-award-in-spirits/",
  "https://www.wsetglobal.com/qualifications/wset-level-2-award-in-sake/",
  "https://www.winescholarguild.com/certifications/specialty-courses/certified-sherry-wine-specialist",
  "https://www.cicerone.org/us-en/certifications/certified-beer-server"
].forEach((text) => {
  check(main.includes(text), `Credential proof links are missing ${text}.`);
});
check(styles.includes(".credential-text-link"), "Credential proof text link styling is missing.");
check(fs.existsSync(sakeLogoPath), "WSET Level 2 Sake logo asset is missing.");
check(main.includes("Presenter lens"), "Resume tab is missing the presenter lens.");
check(main.includes("resume-role-bridge"), "Resume tab is missing role-specific timeline bridges.");
check(main.includes("function renderProjects()"), "Missing Codex Projects renderer.");
check(main.includes("Full project scope from C:\\\\codebase\\\\sip_studies\\\\actual"), "Projects tab does not name the full Codex portfolio scope.");
check(main.includes("function renderPortfolioMediaProof()"), "Portfolio tab is missing public teaching/media proof.");
check(main.includes("function renderEducationMediaSections()"), "Portfolio tab is missing the reusable full video/reference archive renderer.");
const projectsRendererIndex = main.indexOf("function renderProjects()");
const portfolioMediaArchiveIndex = main.indexOf("${renderEducationMediaSections()}", projectsRendererIndex);
check(portfolioMediaArchiveIndex > projectsRendererIndex, "Portfolio tab should render the full video outlet and reference archive.");
check(main.includes("All video outlets and earlier public references live inside Portfolio."), "Portfolio tab is missing the full video/reference archive framing.");
["Sip-Studies", "Rose-Quartz", "Ai-Edu", "Coffee-Index", "Sip-Studies-Tasting-Journal"].forEach((folder) => {
  check(main.includes(`folder: "${folder}"`), `Projects tab is missing Codex project index folder ${folder}.`);
});
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
check(!main.includes("image.thum.io"), "Flavor Blog article thumbnails should not use the broken thum.io screenshot proxy.");
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
check(!main.includes("function renderApplicationProof()"), "Standalone Application Proof renderer should be retired.");
check(!main.includes("Application proof packet"), "OpenAI Fit should not render the old Application Proof packet hero.");
check(!main.includes('nextMode: "application"'), "Interview answer cards should not point to the retired application tab.");
check(main.includes("function renderAiSuccessSourceCheck()"), "OpenAI Fit is missing the role source fact-check panel.");
check(main.includes("AI Success Engineer - US Remote"), "OpenAI Fit should name the current AI Success Engineer posting.");
check(main.includes("$234K-$260K + equity"), "OpenAI Fit should include the verified compensation range.");
check(main.includes("roleTeam"), "Role source facts should avoid generic posting metadata keys.");
check(main.includes("roleLocation"), "Role source facts should avoid generic posting metadata keys.");
check(main.includes("payRange"), "Role source facts should avoid generic posting metadata keys.");
check(main.includes("function renderPacketPdfRail("), "Application packet PDF rail is missing.");
[
  'artifactButton("Resume", docs.Resume.pdf, "PDF")',
  'artifactButton("Cover Letter", docs["Cover Letter"].pdf, "PDF")',
  'artifactButton("30-60-90", docs["30-60-90"].pdf, "PDF")'
].forEach((call) => {
  check(main.includes(call), `Required packet button call is missing: ${call}`);
});
check(main.includes("function renderProofMatrix()"), "OpenAI Fit tab is missing the role proof map renderer.");
check(main.includes("Role proof map"), "OpenAI Fit tab is missing the role proof map section.");
check(main.includes("const docSlugByName"), "OpenAI Fit tab is missing packet document hash slugs.");
check(main.includes('docNameBySlug[docSlug] || "Resume"'), "OpenAI Fit tab is missing packet document hash parsing.");
check(main.includes('selectedDoc !== "Resume"'), "OpenAI Fit tab is missing optional document hash updates.");
check(main.includes("function renderSelectedDocumentPanel("), "OpenAI Fit tab is missing the selected-document action panel.");
check(main.includes("Selected packet document"), "OpenAI Fit tab is missing selected-document panel copy.");
check(main.includes("function docTabId("), "OpenAI Fit document tabs are missing stable tab IDs.");
check(main.includes('data-doc-tab'), "OpenAI Fit document tabs are missing the keyboard-navigation hook.");
check(main.includes('role="tab"'), "OpenAI Fit document buttons are missing tab semantics.");
check(main.includes('role="tabpanel"'), "OpenAI Fit selected document panel is missing tabpanel semantics.");
check(main.includes('aria-selected="${isActive ? "true" : "false"}"'), "OpenAI Fit document tabs are missing active-state aria-selected semantics.");
check(main.includes('aria-controls="${selectedDocumentPanelId}"'), "OpenAI Fit document tabs are missing aria-controls.");
check(main.includes('aria-labelledby="${docTabId(name)}"'), "OpenAI Fit selected document panel is missing aria-labelledby.");
check(main.includes("function selectDocument("), "OpenAI Fit document tab selection is missing the shared state helper.");
check(main.includes("function documentAtOffset("), "OpenAI Fit document tabs are missing arrow-key document navigation.");
check(main.includes('event.key === "Home" || event.key === "End"'), "OpenAI Fit document tabs are missing Home/End keyboard navigation.");
check(!main.includes("preview for ${selectedRole.title}"), "OpenAI Fit tab still embeds a brittle PDF preview iframe.");
check(main.includes("function proofArcItems("), "Presentation command center is missing the recruiter proof arc data.");
check(main.includes('aria-label="Recruiter proof arc"'), "Presentation command center is missing the recruiter proof arc.");
check(!main.includes("showFitProofArc"), "Presentation command center should not switch layouts by active tab.");
check(!main.includes("presentation-command--fit"), "Presentation command center should not use an OpenAI Fit-only layout modifier.");
check(!main.includes("presentation-command--linear"), "Presentation command center should not use a separate non-fit layout modifier.");
check(!styles.includes(".presentation-command--fit"), "Styles should not keep an OpenAI Fit-only command layout.");
check(!styles.includes(".presentation-command--linear"), "Styles should not keep a separate non-fit command layout.");
check(main.includes("Review path"), "Presentation command center should frame the sequence as a recruiter review path.");
check(main.includes("Resume evidence / portfolio proof / OpenAI fit."), "Presentation command center is missing the concise proof journey.");
[
  "Copy View",
  "Copyable role brief",
  "Copy role brief",
  "View link copied.",
  "Role brief copied.",
  "Copy failed.",
  "data-copy-view",
  "data-copy-brief",
  "data-copy-status"
].forEach((text) => {
  check(!main.includes(text), `Recruiter-facing UI still contains copy tooling: ${text}`);
});
check(main.includes("function railPacketButtons("), "Left rail is missing the packet PDF button row renderer.");
check(main.includes("rail-pdf-actions"), "Left rail is missing the packet PDF action row.");
check(main.includes('artifactButton("30-60-90", docs["30-60-90"].pdf, "PDF")'), "Left rail packet actions are missing the 30-60-90 plan PDF link.");
check(!main.includes("top-actions"), "Topbar should not render a separate packet action row.");
check(!main.includes("function focusModeButton()"), "Topbar should not render a visible focus mode button.");
check(main.includes("function initialFocusMode()"), "Focus mode is missing query-string initialization.");
check(main.includes('get("focus") === "1"'), "Focus mode is missing ?focus=1 support.");
check(!main.includes("data-focus-mode"), "Visible focus mode button hook should be removed.");
check(main.includes("is-focus-mode"), "Focus mode body class toggle is missing.");
check(main.includes('event.key.toLowerCase() === "f"'), "Focus mode keyboard shortcut is missing.");
check(main.includes("function renderRoleFit()"), "Missing OpenAI Fit renderer.");
check(main.includes("const portraitRotationMs = 5000"), "Portrait gallery should auto-rotate every 5 seconds.");
check(main.includes("data-gallery-pause"), "Portrait gallery is missing the pause/resume button hook.");
check(main.includes("function setPortraitRotationPaused("), "Portrait gallery is missing pause/resume state handling.");
check(main.includes("applyHashState"), "Shareable hash state is missing.");
check(main.includes("hashchange"), "Hash navigation listener is missing.");
check(main.includes("updateUrlState"), "Role/tab hash update is missing.");
check(main.includes("url.hash = nextHash"), "Role/tab hash updates should preserve the current query string.");
check((main.match(/data-mode=/g) || []).length === 1, "Only the left rail mode buttons should drive section navigation.");
check(!main.includes("data-step-prev"), "Presentation command center should not expose duplicate previous-section controls.");
check(!main.includes("data-step-next"), "Presentation command center should not expose duplicate next-section controls.");
check(!main.includes("answer-jump"), "Interview answer cards should not expose duplicate section-jump buttons.");
check(!main.includes("data-role"), "Single-role AI Success presentation should not render a stale role switcher.");
check(!main.includes("Selected OpenAI role"), "Left rail should not render a selected OpenAI role card.");
check(!main.includes("selected-role-card"), "Left rail should not render a selected role card.");
check(!main.includes("function selectedRoleCard"), "Selected role card renderer should be removed.");
check(!main.includes("rail-label"), "Left rail should not include a selected-role label.");
check(!styles.includes(".selected-role-card"), "Styles should not keep selected role card styling.");
check(!styles.includes(".rail-label"), "Styles should not keep selected role label styling.");
check(!styles.includes(".role-rank"), "Styles should not keep selected role rank styling.");
check(!main.includes("const numericShortcut"), "Global number-key shortcuts should not switch left-rail sections.");
check(!main.includes("goToMode(modeAtOffset"), "Global arrow keys should not switch left-rail sections.");
check(/document\.querySelectorAll\("\[data-doc\]"\)[\s\S]*?selectDocument\(button\.dataset\.doc\);/.test(main), "Document tab clicks should update the shareable URL.");
check(main.includes("function updateDocumentMetadata("), "Dynamic document metadata updater is missing.");
check(main.includes("document.title = title"), "Dynamic document title update is missing.");
check(main.includes('meta[property="og:title"]'), "Dynamic Open Graph title update is missing.");
check(main.includes("Application focus:"), "Dynamic metadata should describe the application focus.");

[
  "Sip-Studies",
  "Rose-Quartz",
  "Ai-Edu",
  "Coffee-Index",
  "Sip-Studies-Tasting-Journal"
].forEach((folder) => {
  check(main.includes(folder), `Codex Projects index is missing ${folder}.`);
  check(fs.existsSync(path.join(actualRoot, folder)), `Referenced Codex project folder does not exist: ${path.join(actualRoot, folder)}`);
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
  ".proof-arc",
  ".proof-arc-grid",
  ".rail-pdf-actions",
  ".is-focus-mode .rail",
  ".timebox-read",
  ".interviewer-lens-panel",
  ".fit-packet-grid",
  "hiring-close-hero.png",
  ".gallery-pause",
  ".selected-document-panel",
  ".selected-document-panel:focus-visible",
  ".proof-matrix",
  "@media (prefers-reduced-motion: reduce)",
  "[data-parallax-depth]"
].forEach((selector) => {
  check(styles.includes(selector), `Styles are missing ${selector}.`);
});

check(
  /\.presentation-command\s*\{[\s\S]*?background:\s*transparent;[\s\S]*?box-shadow:\s*none;/.test(styles),
  "Presentation command center should stay unframed around its individual panels."
);
check(
  /\.presentation-command\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1\.15fr\)\s*minmax\(300px,\s*0\.85fr\);[\s\S]*?max-width:\s*none;/.test(styles),
  "Presentation command center should use one stable two-column desktop layout across all tabs."
);
check(!main.includes("presentationStepItem"), "Presentation command center should not render duplicate section-step cards.");
check(!main.includes("presentation-progress"), "Presentation command center should not render a duplicate progress-card row.");
check(!styles.includes(".presentation-step"), "Styles should not keep duplicate section-step card styling.");
check(!styles.includes(".presentation-progress"), "Styles should not keep duplicate progress-row styling.");
check(!styles.includes(".top-actions"), "Styles should not keep a retired topbar action row.");
check(!styles.includes(".screen-focus-link"), "Styles should not keep visible focus-button styling.");
check(
  /\.mode-list\s*\{[\s\S]*?grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\);/.test(styles),
  "Section navigation should use one even 3-column row."
);
check(
  /\.rail-pdf-actions\s*\{[\s\S]*?grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\);/.test(styles),
  "Rail packet PDFs should use one even 3-column row."
);
check(
  /\.packet-pdf-rail \.doc-actions\s*\{[\s\S]*?grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\);/.test(styles),
  "In-page packet PDF rail should use one even 3-column row."
);
check(
  /\.topbar\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1fr\);/.test(styles),
  "Topbar should be a single text column after moving packet actions to the rail."
);
check(
  /\.workspace > \*\s*\{[\s\S]*?min-width:\s*0;[\s\S]*?max-width:\s*100%;/.test(styles),
  "Workspace children should be allowed to shrink instead of widening the active tab."
);
check(
  /html,\s*body\s*\{[\s\S]*?max-width:\s*100%;[\s\S]*?overflow-x:\s*hidden;/.test(styles),
  "The page should suppress accidental horizontal document scrolling."
);
check(
  /\.resume-details-grid\s*\{[\s\S]*?grid-template-columns:\s*repeat\(auto-fit,\s*minmax\(180px,\s*1fr\)\);/.test(styles),
  "Resume detail cards should wrap inside the workspace instead of forcing a fixed seven-column row."
);
check(
  /\.hero-metrics\s*\{[\s\S]*?grid-template-rows:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\);/.test(styles),
  "Hero metric cards should reserve four stable rows across tabs."
);
check(
  /@media\s*\(max-width:\s*760px\)[\s\S]*?\.parallax-hero\s*\{[\s\S]*?min-height:\s*845px;[\s\S]*?\.hero-copy\s*\{[\s\S]*?min-height:\s*210px;/.test(styles),
  "Mobile hero should pin the copy area so metric cards start consistently across tabs."
);
[
  "Skip to presentation content",
  'id="presentation-content"',
  'tabindex="-1"',
  "prefers-reduced-motion: reduce"
].forEach((text) => {
  check(main.includes(text), `main.js is missing accessibility text: ${text}`);
});

check(isDeploySnapshot || packageJson.scripts?.["sync:resume"], "package.json is missing sync:resume.");
check(packageJson.scripts?.["sync:portrait"], "package.json is missing sync:portrait.");
check(packageJson.scripts?.["portrait:captions"], "package.json is missing portrait:captions.");
check(packageJson.scripts?.build, "package.json is missing build.");
check(packageJson.scripts?.["validate:contrast"], "package.json is missing validate:contrast.");
check(fs.existsSync(path.join(root, "scripts", "validate-contrast-system.mjs")), "Missing contrast-system validator.");

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
check(fs.existsSync(path.join(root, "scripts", "portrait-caption-xlsx.mjs")), "Missing portrait caption XLSX helper.");
check(fs.existsSync(portraitCaptionWorkbook), "Missing portrait caption Excel workbook.");
check(readme.includes("Jonathan_Yu_Portrait_Captions.xlsx"), "README does not document the portrait caption Excel workbook.");
check(readme.includes("Display Title - replaces filename"), "README does not document the portrait caption display-title column.");

const roleDocKinds = ["Resume", "Cover_Letter", "30_60_90_Plan"];
const roleDocFormats = ["pdf", "docx", "md"];
masterData.roles.forEach((role) => {
  roleDocKinds.forEach((kind) => {
    roleDocFormats.forEach((format) => {
      const file = `${role.prefix}_${kind}.${format}`;
      const relativePath = path.join("public", "documents", "openai-2026-06-02", role.folder, file);
      check(fileExists(relativePath), `Missing role document: ${relativePath}`);
      if (format === "pdf") {
        check(pdfLooksValid(relativePath), `Role PDF is not a valid-looking PDF with EOF marker: ${relativePath}`);
      }
    });
  });
});

const aiSuccessRole = masterData.roles.find((role) => role.id === "ai-success");
if (aiSuccessRole) {
  const aiSuccessMarkdownPayload = roleDocKinds
    .map((kind) => {
      const file = `${aiSuccessRole.prefix}_${kind}.md`;
      const relativePath = path.join("public", "documents", "openai-2026-06-02", aiSuccessRole.folder, file);
      return fs.existsSync(path.join(root, relativePath)) ? fs.readFileSync(path.join(root, relativePath), "utf8") : "";
    })
    .join("\n");
  [
    "AI-assisted product building",
    "human-owned build process",
    "what AI did",
    "what Jonathan decided",
    "problem, process, output, validation, limitations, and role relevance",
    "Codex-style workflows"
  ].forEach((phrase) => {
    check(aiSuccessMarkdownPayload.includes(phrase), `AI Success packet markdown is missing ${phrase}.`);
  });
  const forbiddenDocHits = forbiddenEmployerPhrases.filter((phrase) =>
    aiSuccessMarkdownPayload.toLowerCase().includes(phrase.toLowerCase())
  );
  check(forbiddenDocHits.length === 0, `AI Success packet contains forbidden phrase(s): ${forbiddenDocHits.join(", ")}`);
}

[
  "JONATHAN_YU_SIP_STUDIES_COMBINED_RESUME_V4_CRITICAL_ON_HAND_2026-06-02.pdf",
  "JONATHAN_YU_SIP_STUDIES_COMBINED_RESUME_V4_CRITICAL_ON_HAND_2026-06-02.docx",
  "JONATHAN_YU_SIP_STUDIES_COMBINED_RESUME_V4_CRITICAL_ON_HAND_2026-06-02.md"
].forEach((file) => {
  check(fileExists(path.join("public", "documents", "resume", file)), `Missing resume artifact: ${file}`);
});

check(readme.includes("#fit/ai-success"), "README does not document the OpenAI Fit shareable hash.");
check(readme.includes("#resume/ai-success"), "README does not document the Resume shareable hash.");
check(readme.includes("#fit/ai-success/cover-letter"), "README does not document cover letter packet hashes.");
check(readme.includes("#fit/ai-success/30-60-90"), "README does not document 30-60-90 packet hashes.");
check(readme.includes("older `#application/...` links are normalized"), "README does not document legacy Application Proof hash normalization.");
check(readme.includes("Dynamic browser titles and descriptions"), "README does not document dynamic browser metadata.");
check(readme.includes("Resume, Portfolio, and OpenAI Fit"), "README does not document the three-step AI Success deck.");
check(readme.includes("human-owned build process"), "README does not document the human-owned build process.");
check(readme.includes("Parameter Golf-inspired review pattern"), "README does not document the Parameter Golf review pattern.");
check(readme.includes("recruiter-facing proof arc"), "README does not document the recruiter-facing proof arc.");
check(readme.includes("left rail is the only section navigation"), "README does not document the single-source section navigation rule.");
check(!readme.includes("copyable role brief"), "README still documents removed copyable role brief UI.");
check(!readme.includes("Copy confirmations"), "README still documents removed copy confirmation UI.");
check(readme.includes("Persistent top-bar links"), "README does not document persistent packet links.");
check(readme.includes("screen-share focus mode"), "README does not document focus mode.");
check(readme.includes("`F` key"), "README does not document the focus mode keyboard shortcut.");
check(readme.includes("?focus=1"), "README does not document the focus mode query parameter.");
check(readme.includes("90-second closer"), "README does not document the OpenAI Fit section.");
check(readme.includes("role-proof map"), "README does not document the OpenAI Fit proof map.");
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
    "Portfolio proof",
    "Resume details",
    "What a busy OpenAI panel should remember after the walkthrough.",
    "Ninety second OpenAI resume read",
    "OpenAI interview panel lens",
    "Fact-checked role source",
    "AI-assisted product building with human-owned judgment.",
    "OpenAI-style review pattern",
    "Make projects reviewable like constrained OpenAI submissions.",
    "What AI did",
    "What Jonathan decided",
    "human-owned build process",
    "AI Success Engineer - US Remote",
    "$234K-$260K + equity",
    "Resume",
    "Cover Letter",
    "30-60-90",
    "PDF",
    "AARP Wine Walk Wednesdays",
    "Sip Studies Instagram",
    "SipStudies.com Blog",
    "Sip Studies Substack",
    "Daily Sip",
    "Role proof map",
    "Open the next artifact only when it helps the hiring decision.",
    "cover-letter",
    "Selected packet document",
    "Application focus:",
    "Active packet document:",
    "Review path",
    "Proof arc",
    "Resume evidence / portfolio proof / OpenAI fit.",
    "Focus",
    "Resume reference",
    "WSET Level 2 Sake",
    "Wine Scholar Guild / Lustau",
    "Cicerone - Certified Beer Server L1",
    "https://www.wsetglobal.com/qualifications/wset-level-2-award-in-sake/",
    "credential-text-link",
    "Live interview answer board",
    "Keep the conversation anchored to the right proof.",
    "Skip to presentation content",
    "presentation-content"
  ].forEach((text) => {
    check(builtJs.includes(text), `Built JS is missing presentation text: ${text}`);
  });
  ["Application Proof", "Application proof packet", "Hiring-team close"].forEach((text) => {
    check(!builtJs.includes(text), `Built JS still contains retired presentation text: ${text}`);
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
    ".proof-arc",
    ".proof-arc-grid",
    ".rail-pdf-actions",
    ".is-focus-mode .rail",
    ".timebox-read",
    ".interviewer-lens-panel",
    ".fit-packet-grid",
    "hiring-close-hero.png",
    ".gallery-pause",
    ".selected-document-panel",
    ".selected-document-panel:focus-visible",
    ".credential-text-link",
    ".proof-matrix",
    ".skip-link",
    "@media(prefers-reduced-motion:reduce)"
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
