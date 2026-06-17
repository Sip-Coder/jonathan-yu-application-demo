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
const wsgCswsLogoPath = path.join(root, "public", "assets", "logos", "wsg-lustau-csws.png");
const ciceroneBeerServerLogoPath = path.join(root, "public", "assets", "logos", "cicerone-certified-beer-server.jpg");
const architectureDraftingLogoPath = path.join(root, "public", "assets", "logos", "architecture-design-drafting.svg");
const commercialExecutionProofPath = path.join(root, "public", "assets", "openai-fit", "commercial-execution-seagrams-display.jpg");
const sanitizedUfcReferencePdfPath = path.join(documentsRoot, "references", "ufc-324-customer-satisfaction-public-summary.pdf");
const sanitizedUfcReferenceHtmlPath = path.join(documentsRoot, "references", "ufc-324-customer-satisfaction-public-summary.html");
const workbookPath = path.join(workspaceRoot, "Raw Data", "Jonathan_Yu_Resume_Master_Edit.xlsx");

const masterData = (await import(pathToFileURL(dataPath))).default;
const portraitGallery = (await import(pathToFileURL(portraitPath))).default;

const main = fs.readFileSync(mainPath, "utf8");
const styles = fs.readFileSync(stylesPath, "utf8");
const readme = fs.readFileSync(readmePath, "utf8");
const indexHtml = fs.readFileSync(indexPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const mediaEpisodeCardSource = main.match(/function mediaEpisodeCard[\s\S]*?function articleCard/u)?.[0] || "";

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
  "03 OpenAI Fit",
  "04 References"
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
  "Agentic harnessing",
  "Workflow prototyping",
  "Customer workflow translation",
  "Codex project detail",
  "Role bridge for",
  "problem, process, output, validation, limitations, and role relevance",
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
check(main.includes("Four proof surfaces make the fit inspectable."), "OpenAI Fit is missing the visual proof-path section.");
check(main.includes("Open the work behind the claim"), "OpenAI Fit proof path should explain why the section exists.");
[
  "renderPresentationCommandCenter",
  "renderRoleContext",
  "renderAiBuildOwnership",
  "renderInterviewerLensPanel",
  "renderInterviewAnswerBoard",
  "presentationMoves",
  "proofArcItems",
  "renderTimeboxedRead",
  "timeboxCards"
].forEach((text) => {
  check(!main.includes(text), `Redundant walkthrough helper should be removed: ${text}`);
});
[
  ".presentation-command",
  ".role-context",
  ".interviewer-lens-panel",
  ".answer-board",
  ".principle-board",
  ".asset-band",
  ".proof-grid"
].forEach((selector) => {
  check(!styles.includes(selector), `Dead layout selector should be removed: ${selector}`);
});
check(main.includes("const referenceArtifacts = ["), "References tab is missing the source artifact list.");
check(main.includes("function renderReferences()"), "References tab is missing the renderer.");
check(main.includes("function renderReferenceCard("), "References tab is missing artifact cards.");
check(main.includes('if (selectedMode === "references") return renderReferences();'), "References mode is not wired into the workspace renderer.");
check(main.includes("function referenceArtifactFullscreenAction("), "References tab is missing fullscreen action rendering.");
check(main.includes("function referenceArtifactDownloadAction("), "References tab is missing download action rendering.");
check(main.includes("function referenceArtifactPreviewToolbar("), "References tab is missing the first-party PDF preview toolbar.");
check(main.includes('import * as pdfjsLib from "pdfjs-dist";'), "References PDF preview should use PDF.js rendering.");
check(main.includes('pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.mjs?url"'), "References PDF preview is missing the PDF.js worker.");
check(main.includes("data-reference-pdf-viewer"), "References PDF preview is missing the first-party rendered viewer.");
check(main.includes("data-reference-pages"), "References PDF preview is missing the rendered page container.");
check(main.includes("function renderReferencePdfViewer("), "References PDF preview is missing rendered page behavior.");
check(main.includes("function setReferenceLayout("), "References PDF preview is missing layout behavior.");
check(main.includes('currentLayout === targetLayout ? "single" : targetLayout'), "References two-page control should toggle back to single-page layout.");
check(main.includes("Two page view"), "References PDF toolbar should keep the two-page view control visible.");
check(main.includes("data-reference-zoom"), "References PDF toolbar is missing zoom controls.");
check(main.includes("function updateReferenceZoom("), "References PDF toolbar is missing zoom behavior.");
check(main.includes("Download <span>PDF</span>"), "References PDF toolbar is missing the download control.");
check(main.includes("data-reference-fullscreen"), "References PDF cards are missing fullscreen buttons.");
check(main.includes("function toggleReferenceFullscreen("), "References tab is missing fullscreen behavior.");
check(main.includes("function updateReferenceFullscreenControls("), "References tab is missing fullscreen control state updates.");
check(main.includes("References available on request"), "References tab should state that references are available on request.");
check(main.includes("Permissioned proof only"), "References tab should avoid unfinished placeholder reference claims.");
check(!main.includes("Keep third-party proof source-backed and permissioned."), "References tab should not render the removed explanatory intro headline.");
check(!main.includes("This tab stays quiet until"), "References tab should not render the removed explanatory intro copy.");
check(!main.includes("Source standard"), "References tab should not render the removed source-standard callout.");
check(main.includes("UFC 324 customer satisfaction proof"), "References tab is missing the sanitized UFC 324 customer satisfaction proof.");
check(main.includes("Sanitized public summary"), "References tab should identify the customer satisfaction proof as a sanitized public summary.");
check(main.includes("Customer name, email, phone, full headers, and original message text are withheld."), "References tab should explain customer privacy handling.");
check(fs.existsSync(sanitizedUfcReferencePdfPath), "Sanitized UFC 324 customer satisfaction PDF is missing.");
check(fs.existsSync(sanitizedUfcReferenceHtmlPath), "Sanitized UFC 324 customer satisfaction HTML source is missing.");
[
  "Fw_ Positive Feedback on UFC 324 _Rising Star_ Package and Suggestions.msg",
  "Screenshot - UFC 324 Customer Letter of Recommendation.png",
  "Resume References.lnk"
].forEach((file) => {
  check(!fs.existsSync(path.join(documentsRoot, "references", file)), `Public references folder should not expose raw/private artifact: ${file}`);
});
check(!main.includes("Reference PDF slot"), "References tab should not expose an empty PDF placeholder slot.");
check(!main.includes("Email reference slot"), "References tab should not expose an empty email placeholder slot.");
check(!main.includes("Awaiting source artifact"), "References tab should not expose awaiting-source placeholder copy.");
check(!main.includes("Awaiting approved excerpt"), "References tab should not expose awaiting-excerpt placeholder copy.");
check(styles.includes(".references-board"), "References tab styling is missing the board.");
check(styles.includes(".reference-preview"), "References tab styling is missing preview support.");
check(styles.includes(".reference-preview-wrap:fullscreen"), "References tab styling is missing fullscreen preview support.");
check(styles.includes(".reference-preview-toolbar"), "References tab styling is missing the PDF preview toolbar.");
check(styles.includes(".reference-preview-controls"), "References tab styling is missing first-party PDF toolbar controls.");
check(styles.includes(".reference-toolbar-button"), "References tab styling is missing first-party PDF toolbar buttons.");
check(styles.includes(".reference-zoom-controls"), "References tab styling is missing zoom controls.");
check(styles.includes(".reference-render-pages"), "References tab styling is missing rendered PDF page layout.");
check(styles.includes(".reference-pdf-page"), "References tab styling is missing rendered PDF page styling.");
check(styles.includes(".reference-render-status"), "References tab styling is missing rendered PDF loading state.");
check(styles.includes(".reference-download-action"), "References tab styling is missing the download action.");
check(styles.includes(".reference-actions"), "References tab styling is missing the reference action row.");
check(main.includes("function renderFullResume()"), "Missing Resume renderer.");
check(main.includes("Resume evidence"), "Resume tab is missing the source-view framing.");
check(main.includes("function renderResumeDetailsDeck()"), "Resume tab is missing the requested resume details deck.");
check(fs.existsSync(commercialExecutionProofPath), "OpenAI Fit commercial execution proof photo asset is missing.");
[
  "function renderCommercialExecutionProof()",
  "/assets/openai-fit/commercial-execution-seagrams-display.jpg",
  "Commercial execution proof",
  "350 cases, field execution, customer context.",
  "350-case Seagram's vodka display",
  "350-case vodka display",
  "350 cases",
  "Retail execution",
  "Display strategy",
  "Supplier coordination",
  "Market scale"
].forEach((text) => {
  check(main.includes(text), `OpenAI Fit commercial execution proof is missing ${text}.`);
});
check(/\.commercial-execution-frame img\s*\{[\s\S]*?object-fit:\s*contain;/.test(styles), "Commercial execution photo should use object-fit: contain so the full photo remains visible.");
check(
  main.indexOf("${renderProofMatrix()}") > -1 &&
    main.indexOf("${renderProofMatrix()}") < main.indexOf("${renderCommercialExecutionProof()}") &&
    main.indexOf("${renderCommercialExecutionProof()}") < main.indexOf('class="document-strip document-strip--fit"'),
  "OpenAI Fit commercial execution proof should render after the proof path and before packet document tabs."
);
[
  "function resumeProofMetrics()",
  "function renderResumeProofDetails()",
  "Resume proof detail",
  "The headline metrics, with the evidence kept below the fold.",
  "resume-proof-details",
  "resume-proof-detail-card"
].forEach((text) => {
  check(main.includes(text) || styles.includes(text), `Resume proof details section is missing ${text}.`);
});
check(
  main.indexOf("${renderResumeDetailsDeck()}") > -1 &&
    main.indexOf("${renderResumeDetailsDeck()}") < main.indexOf("${renderResumeProofDetails()}") &&
    main.indexOf("${renderResumeProofDetails()}") < main.indexOf("${renderResumeLensPanel()}"),
  "Resume proof details should move the expanded hero copy below Resume Details and before the presenter lens."
);
check(!main.includes("metric-bullet-list"), "Hero metric cards should not render bullet lists.");
check(!main.includes("metric-timeline-list"), "Hero metric cards should not render the AI usage timeline.");
check(!styles.includes("metric-bullet-list"), "Metric bullet-list styling should be removed from the hero.");
check(!styles.includes("metric-timeline-list"), "Metric timeline styling should be removed from the hero.");
check(main.includes('if (modeId !== "resume") return [];'), "Hero proof metrics should only render on the Resume tab.");
check(main.includes('const heroClass = metricItems.length ? "parallax-hero has-metrics" : "parallax-hero";'), "Hero should distinguish metric and non-metric layouts.");
[
  "Years across beverage sales, account analytics, education, and live events.",
  "Years Of AI Usage",
  "WamboArt.ai in 2021",
  "ChatGPT 3.5 in December 2022",
  "Artificial Intelligence Implications For Business Strategy",
  "Established Sip Studies on January 15th, 2024",
  "Replit and then Codex revolutionized working abilities in 2026",
  "resume-proof-detail-grid",
  "Sales Consultant Excellence Award in 2018 and 2026",
  "Expanded 3,500+ placements",
  "Increased wine revenue by $2,291,000 in 2018",
  "95,000 points of distribution in 2025 including Reno, Wendover, and Mesquite",
  "Built an integrated LMS platform for wine, beer, spirits, coffee, tea, and all other beverages",
  "Built a video game simulation for beverage lifecycles beginning to end",
  "Built a professional-friendly, mobile beverage resource map for navigating versatile beverage solutions"
].forEach((text) => {
  check(main.includes(text) || styles.includes(text), `Career Range AI usage block is missing ${text}.`);
});
const careerMetricIndex = main.indexOf('"Career range"');
const aiUsageMetricIndex = main.indexOf('"Years Of AI Usage"', careerMetricIndex);
const commercialLiftMetricIndex = main.indexOf('"Commercial lift"');
check(
  careerMetricIndex > -1 && aiUsageMetricIndex > careerMetricIndex && commercialLiftMetricIndex > aiUsageMetricIndex,
  "Years Of AI Usage should remain between Career Range and Commercial Lift in the resume proof metrics."
);
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
  "https://www.cicerone.org/us-en/certifications/certified-beer-server",
  "wsg-lustau-csws.png",
  "cicerone-certified-beer-server.jpg",
  "The House of Lustau CSWS Online",
  "Cicerone Program Certified Beer Server"
].forEach((text) => {
  check(main.includes(text), `Credential proof links are missing ${text}.`);
});
check(styles.includes(".credential-text-link"), "Credential proof text link styling is missing.");
check(fs.existsSync(sakeLogoPath), "WSET Level 2 Sake logo asset is missing.");
check(fs.existsSync(wsgCswsLogoPath), "WSG/Lustau CSWS logo asset is missing.");
check(fs.existsSync(ciceroneBeerServerLogoPath), "Cicerone Certified Beer Server logo asset is missing.");
check(fs.existsSync(architectureDraftingLogoPath), "Architecture/design/drafting logo asset is missing.");
check(main.includes("const customCompanyLogos = new Map"), "Custom company logo mapping is missing.");
check(main.includes("Architecture, Design & Drafting Foundation"), "Architecture/design/drafting job logo mapping is missing.");
check(main.includes("architecture-design-drafting.svg"), "Architecture/design/drafting logo is not wired into the resume timeline.");
check(
  /\.education-card img\s*\{[\s\S]*?filter:\s*brightness\(0\)\s*invert\(1\);/.test(styles),
  "Wentworth education logo should render as a light mark on the dark education card."
);
check(main.includes("Presenter lens"), "Resume tab is missing the presenter lens.");
check(main.includes("resume-role-bridge"), "Resume tab is missing role-specific timeline bridges.");
check(main.includes("function renderProjects()"), "Missing Codex Projects renderer.");
check(main.includes("const repoWebsitePreviews = ["), "Portfolio tab is missing GitHub repo website preview data.");
check(main.includes("function renderRepoWebsitePreviews()"), "Portfolio tab is missing the GitHub repo website preview renderer.");
check(main.includes("Codex Projects"), "Portfolio tab is missing the renamed Codex Projects section.");
check(!main.includes("Flagship case studies"), "Portfolio tab still renders the removed Flagship case studies section.");
check(!main.includes("Full project scope from"), "Portfolio tab still renders the removed Full project scope section.");
check(!main.includes("aria-label=\"Codex Projects portfolio\""), "Portfolio tab still renders the old standalone Codex Projects grid.");
check(main.includes("function repoWebsiteProjectDetail"), "Portfolio website previews are missing embedded Codex project details.");
check(main.includes("https://sipopedia.com/#app/starter"), "Portfolio website previews should open Sipopedia on the Launch Pad preview.");
[
  "/repo-previews/rose-quartz/index.html",
  "/repo-previews/coffee-index/index.html",
  "/repo-previews/zen-noise/index.html"
].forEach((previewPath) => {
  check(main.includes(previewPath), `Portfolio website previews are missing snapshot path: ${previewPath}`);
  check(fileExists(path.join("public", previewPath.replace(/^\//u, ""))), `Missing repo website preview snapshot: ${previewPath}`);
});
[
  "https://tasting-journal.replit.app/"
].forEach((previewUrl) => {
  check(main.includes(previewUrl), `Portfolio website previews are missing live preview URL: ${previewUrl}`);
});
check(main.includes("https://zen-noise.replit.app/"), "Portfolio website previews should keep the live Zen Noise app launch link.");
check(main.includes("same-origin preview uses the latest Zen Noise production build"), "Zen Noise preview should explain why it uses a same-origin snapshot.");
check(main.includes("Zen Noise"), "Portfolio website previews are missing Zen Noise.");
check(main.includes("Codex Project | Replit soundscape app"), "Portfolio website previews are missing the Zen Noise Codex project detail.");
check(main.includes("Reviewed against the live Replit deploy on June 14, 2026"), "Zen Noise preview should record the current live-review date.");
check(main.includes("brown noise"), "Zen Noise portfolio proof should mention brown noise.");
check(main.includes("recorded ambient layers"), "Zen Noise portfolio proof should mention recorded ambient layers.");
check(main.includes("layer modulation"), "Zen Noise portfolio proof should mention layer modulation.");
check(main.includes("focus timer"), "Zen Noise portfolio proof should mention the focus timer.");
check(main.includes("shareable mix links"), "Zen Noise portfolio proof should mention shareable mix links.");
check(main.includes("saved local mixes"), "Zen Noise portfolio proof should mention saved local mixes.");
check(main.includes("no-data-collection footer"), "Zen Noise portfolio proof should mention the no-data-collection footer.");
const zenNoisePreviewRoot = path.join(root, "public", "repo-previews", "zen-noise");
const zenNoisePreviewHtmlPath = path.join(zenNoisePreviewRoot, "index.html");
const zenNoisePreviewAssetsRoot = path.join(zenNoisePreviewRoot, "assets");
const zenNoisePreviewHtml = fs.existsSync(zenNoisePreviewHtmlPath) ? fs.readFileSync(zenNoisePreviewHtmlPath, "utf8") : "";
const zenNoisePreviewScriptPath = fs.existsSync(zenNoisePreviewAssetsRoot)
  ? fs.readdirSync(zenNoisePreviewAssetsRoot).find((file) => /^index-.*\.js$/u.test(file))
  : "";
const zenNoisePreviewScript = zenNoisePreviewScriptPath
  ? fs.readFileSync(path.join(zenNoisePreviewAssetsRoot, zenNoisePreviewScriptPath), "utf8")
  : "";
check(zenNoisePreviewHtml.includes("index-ChwhL1yJ.js"), "Zen Noise preview should reference the June 14, 2026 live JavaScript asset.");
check(zenNoisePreviewHtml.includes("index-tHp4M5Vz.css"), "Zen Noise preview should reference the June 14, 2026 live CSS asset.");
check(zenNoisePreviewHtml.includes("zen-noise-preview-service-worker-disabled"), "Zen Noise preview should disable copied service worker registration.");
check(!zenNoisePreviewHtml.includes("navigator.serviceWorker.register('/sw.js')"), "Zen Noise preview should not register the parent site's service worker path.");
check(zenNoisePreviewScript.includes("zen-noise-preview-route-patch"), "Zen Noise preview should patch the client router so embedded subpaths do not render 404.");
check(zenNoisePreviewScript.includes("Brown Noise"), "Zen Noise preview script should include the redeployed Brown Noise control.");
check(zenNoisePreviewScript.includes("Ambient Layers"), "Zen Noise preview script should include the redeployed Ambient Layers control.");
check(zenNoisePreviewScript.includes("layer-modulation-panel"), "Zen Noise preview script should include the redeployed layer modulation panel.");
check(zenNoisePreviewScript.includes("Generated locally"), "Zen Noise preview script should include the local-generation footer.");
check(zenNoisePreviewScript.includes("No data collection"), "Zen Noise preview script should include the privacy footer.");
check(main.includes("Role bridge for ${selectedRole.title}"), "Portfolio website previews are missing project role bridges.");
check(main.includes("Live Replit iframe"), "Portfolio website previews are missing live Replit framing.");
check(main.includes("data-preview-fullscreen"), "Portfolio website previews are missing fullscreen controls.");
check(main.includes("requestFullscreen"), "Portfolio website previews are missing Fullscreen API support.");
check(main.includes('const iframeLoading = site.previewHref.startsWith("/") ? "eager" : "lazy";'), "Same-origin repo preview iframes should load eagerly so they are not blank when scrolled into view.");
check(main.includes('loading="${iframeLoading}"'), "Repo website preview iframes should use the computed loading strategy.");
check(main.includes("function renderPortfolioMediaProof()"), "Portfolio tab is missing ChatGPT/Dall-e media proof.");
check(main.includes("ChatGPT & Dall-e Projects"), "Portfolio tab is missing the renamed ChatGPT & Dall-e Projects block.");
check(main.includes("function renderSoraProjects()"), "Portfolio tab is missing the Sora Projects renderer.");
check(main.includes("const soraProjectVideos = ["), "Portfolio tab is missing the Sora project media scaffold.");
check(main.includes("function renderEducationMediaSections()"), "Portfolio tab is missing the reusable media section renderer.");
check(!main.includes("Public proof beyond the PDF"), "Portfolio tab still renders the removed public-proof-beyond-PDF block.");
check(!main.includes("Open these when the conversation shifts from resume to audience trust"), "Portfolio tab still renders the removed audience-trust link block.");
check(!styles.includes(".media-panel"), "Styles still include the removed public-proof-beyond-PDF media panel.");
const projectsRendererIndex = main.indexOf("function renderProjects()");
const repoWebsitePreviewIndex = main.indexOf("${renderRepoWebsitePreviews()}", projectsRendererIndex);
const soraProjectsIndex = main.indexOf("${renderSoraProjects()}", projectsRendererIndex);
const chatGptMediaProofIndex = main.indexOf("${renderPortfolioMediaProof()}", projectsRendererIndex);
const portfolioMediaArchiveIndex = main.indexOf("${renderEducationMediaSections()}", projectsRendererIndex);
check(repoWebsitePreviewIndex > projectsRendererIndex, "Portfolio tab should render the repo website previews.");
check(repoWebsitePreviewIndex < soraProjectsIndex, "Portfolio website previews should appear before Sora Projects.");
check(soraProjectsIndex < chatGptMediaProofIndex, "Sora Projects should appear before ChatGPT & Dall-e Projects.");
check(chatGptMediaProofIndex < portfolioMediaArchiveIndex, "ChatGPT & Dall-e Projects should introduce the media sections.");
check(portfolioMediaArchiveIndex > projectsRendererIndex, "Portfolio tab should render the media sections.");
check(!main.includes("Full video and reference archive"), "Portfolio tab still renders the removed full video/reference archive copy block.");
check(!main.includes("All video outlets and earlier public references live inside Portfolio."), "Portfolio tab still renders the removed full video/reference archive framing.");
[
  "C:\\\\codebase\\\\sip_studies\\\\actual\\\\Sip-Studies",
  "C:\\\\codebase\\\\sip_studies\\\\actual\\\\Rose-Quartz",
  "C:\\\\codebase\\\\sip_studies\\\\actual\\\\Coffee-Index",
  "C:\\\\codebase\\\\sip_studies\\\\actual\\\\Sip-Studies-Tasting-Journal",
  "Zen-Noise.Replit.app"
].forEach((projectPath) => {
  check(main.includes(projectPath), `Embedded Codex project detail is missing ${projectPath}.`);
});
check(main.includes("youtubeEmbedUrl"), "Podcast/video tab is missing YouTube embed support.");
check(main.includes("open.spotify.com/embed/show/1p8kpZbP02yeEx5bM2xg1e"), "Podcast/video tab is missing the Sippy's Beverage Blog Spotify show embed.");
check(main.includes("https://open.spotify.com/show/1p8kpZbP02yeEx5bM2xg1e"), "Podcast/video tab is missing the Sippy's Beverage Blog Spotify show link.");
check(!main.includes("open.spotify.com/embed/episode/5f9GpwIY7hC5IzZVYFc0Pt"), "Podcast/video tab still embeds the old AI Winecast launch episode.");
check(main.includes("const aarpWineWalkVideos"), "Podcast/video tab is missing AARP Wine Walk Wednesdays data.");
check(main.includes("const sipStudiesInstagramVideos"), "Podcast/video tab is missing Sip Studies Instagram reel data.");
check(main.includes("const sommSupportInstagramVideos"), "Podcast/video tab is missing Somm Support Instagram reel data.");
check(main.includes("Portfolio takeaway"), "Sip Studies Instagram reels are missing the portfolio-side takeaway copy.");
check(!main.includes("instagramCaption"), "Sip Studies Instagram reels should not keep source Instagram description fields.");
check(!main.includes("Instagram description"), "Sip Studies Instagram reels should not render Instagram description labels.");
check(main.includes("function loadEpisodeEmbed"), "Video cards should create embeds only after the viewer asks to load them.");
check(mediaEpisodeCardSource.includes("data-episode-load"), "Video cards should render a load control instead of immediate iframes.");
check(!mediaEpisodeCardSource.includes("<iframe"), "Video cards should not pre-render YouTube or Instagram iframes during scroll.");
check(mediaEpisodeCardSource.includes("const thumbStyle = episode.thumbnail"), "Video cards should omit missing thumbnail URLs.");
check(mediaEpisodeCardSource.includes("episode-preview-video"), "Local Sora videos should show a first-frame preview before loading controls.");
check(main.includes('button.dataset.episodeFrame === "video-file"'), "Sora upload scaffold should support local video files.");
check(styles.includes(".episode-player video"), "Loaded local video files should share the episode-player sizing rules.");
check(styles.includes("video:not([data-episode-preview])"), "Loaded videos should be styled separately from local preview thumbnails.");
check(styles.includes(".episode-preview-video"), "Local video thumbnails should use a dedicated preview video layer.");
check(styles.includes("bottom: 10px"), "Video load controls should sit over thumbnails without covering the full preview.");
check(styles.includes(".episode-player--video-file"), "Sora local video files should use the vertical reel-style frame.");
check(styles.includes("var(--episode-thumb, linear-gradient"), "Episode cards should provide a thumbnail fallback for local videos.");
check(main.includes('frame: "instagram"'), "Sip Studies Instagram reels are missing the vertical Instagram frame marker.");
check(main.includes('setAttribute("scrolling", "no")'), "Sip Studies Instagram embeds are missing scrollbar suppression.");
check(main.includes("episode-grid--instagram"), "Sip Studies Instagram reels are missing the Instagram grid hook.");
check(main.includes("episode-grid--video-row"), "Vertical video sections are missing the compact four-across row hook.");
check(/\.episode-grid--video-row\s*\{[\s\S]*?grid-template-columns:\s*repeat\(4, minmax\(0, 1fr\)\)/u.test(styles), "Vertical Instagram and Sora video sections should use one compact four-card row on desktop.");
check(!main.includes("/media/?size=l"), "Instagram reel thumbnails still use the broken Instagram media endpoint.");
[
  "sip-studies-01.jpg",
  "sip-studies-02.jpg",
  "sip-studies-03.jpg",
  "sip-studies-04.jpg",
  "somm-support-01.jpg",
  "somm-support-02.jpg",
  "somm-support-03.jpg",
  "somm-support-04.jpg"
].forEach((poster) => {
  check(main.includes(`/media/instagram-posters/${poster}`), `Instagram reel data is missing local poster ${poster}.`);
  check(fileExists(`public/media/instagram-posters/${poster}`), `Missing Instagram poster asset: ${poster}`);
});
check(!main.includes("https://www.instagram.com/sip.studies/reel/DGwT3fXvRxt/embed"), "Instagram data still includes the browser-blocked Pinot Grigio/Syrah username-qualified embed URL.");
check(!main.includes("https://www.instagram.com/sip.studies/reel/DGO8bRFRpj2/embed"), "Instagram data still includes the browser-blocked Sip and Describe username-qualified embed URL.");
check(main.includes("const flavorBlogCollections"), "Podcast/video tab is missing Flavor Blog article collections.");
check(!main.includes("image.thum.io"), "Flavor Blog article thumbnails should not use the broken thum.io screenshot proxy.");
["Ai Winecast - J Lohr Vineyards & Wines", "Ai Winecast - 002 Cabernet Sauvignon", "Tasting Winecast - 005", "Ai Winecast - Episode 003"].forEach((title) => {
  check(main.includes(title), `AI Winecast video section is missing ${title}.`);
});
check(main.includes("Sippy's Beverage Blog - By Sip Studies"), "Spotify podcast section is missing the Sippy's Beverage Blog show title.");
check(styles.includes("min-height: 352px"), "Spotify show embed should use the normal-height show player.");
["22.08.46", "22.08.48", "22.08.50", "22.08.53"].forEach((stamp, index) => {
  const videoPath = `public/media/sora-projects/WhatsApp Video 2026-06-12 at ${stamp}.mp4`;
  check(main.includes(`WhatsApp%20Video%202026-06-12%20at%20${stamp}.mp4`), `Sora Projects section is missing video ${index + 1}.`);
  check(fileExists(videoPath), `Missing Sora video asset: ${videoPath}`);
});
["Aromatic Treasures", "Summertime Wines", "Classic Burgundy", "Everything Sparkling"].forEach((title) => {
  check(main.includes(title), `AARP Wine Walk Wednesdays section is missing ${title}.`);
});
["DOFDY98Dtrg", "DHUh3JlS7Ko", "DGw69y4RWGv", "DGO8bRFRpj2"].forEach((shortcode) => {
  check(main.includes(`https://www.instagram.com/reel/${shortcode}/embed`), `Sip Studies Instagram reel section is missing working embed ${shortcode}.`);
});
["DFuLhCVRDIU", "DFisS-QyRzE", "DE8OCR7SgZE", "DEyt0Ioxmw4"].forEach((shortcode) => {
  check(main.includes(`https://www.instagram.com/reel/${shortcode}/embed`), `Somm Support Instagram reel section is missing working embed ${shortcode}.`);
});
["SipStudies.com Blog", "Sip Studies Substack", "Daily Sip"].forEach((title) => {
  check(main.includes(title), `Flavor Blog collections are missing ${title}.`);
});
["https://i.ytimg.com/vi/", "https://www.instagram.com/reel/", "images.squarespace-cdn.com", "substackcdn.com", "https://sipopedia.com/daily-sip/"].forEach((host) => {
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
check(main.includes("Proof path"), "OpenAI Fit tab is missing the proof path section.");
check(main.includes("Four proof surfaces make the fit inspectable."), "OpenAI Fit proof path should explain the section purpose.");
[
  "/assets/header/codex-projects-hero.png",
  "/repo-previews/rose-quartz/assets/rose-sanctuary-hero-C4LbQw8N.jpg",
  "/assets/header/resume-still-life.png",
  "/assets/header/hiring-close-hero.png",
  'href="${row.href}"',
  'class="proof-card-image"',
  "proof-card-tags"
].forEach((text) => {
  check(main.includes(text), `OpenAI Fit proof path is missing visual/action support: ${text}`);
});
check(!main.includes("matrix-reference"), "OpenAI Fit proof path should not render a non-clickable matrix reference label.");
check(main.includes("const docSlugByName"), "OpenAI Fit tab is missing packet document hash slugs.");
check(main.includes('docNameBySlug[docSlug] || "Resume"'), "OpenAI Fit tab is missing packet document hash parsing.");
check(main.includes('selectedDoc !== "Resume"'), "OpenAI Fit tab is missing optional document hash updates.");
check(main.includes("function renderSelectedDocumentPanel("), "OpenAI Fit tab is missing the selected-document action panel.");
check(main.includes("Active packet artifact"), "OpenAI Fit tab is missing active packet artifact panel copy.");
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
check(!main.includes('aria-label="Recruiter proof arc"'), "Redundant global recruiter proof arc should stay removed.");
[
  "Career record, credentials, and market-scale evidence.",
  "Inspectable products, media, and shipped work.",
  "Role source facts, proof path, and packet close.",
  "Permissioned third-party proof, staged only when requested."
].forEach((text) => {
  check(main.includes(text), `Lighter tab summary is missing: ${text}`);
});
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
check(main.includes("function railPacketButtons("), "OpenAI Fit is missing the packet PDF button row renderer.");
check(main.includes("rail-pdf-actions"), "OpenAI Fit is missing the packet PDF action row.");
check(main.includes('artifactButton("30-60-90", docs["30-60-90"].pdf, "PDF")'), "OpenAI Fit packet actions are missing the 30-60-90 plan PDF link.");
check(main.includes('selectedMode === "fit" ? railPacketButtons(selectedRole) : ""'), "Packet PDF rail should render only on OpenAI Fit.");
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
  "Coffee-Index",
  "Sip-Studies-Tasting-Journal"
].forEach((folder) => {
  check(main.includes(folder), `Embedded Codex project detail is missing local project folder ${folder}.`);
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
  ".episode-grid--video-row",
  ".episode-player--instagram",
  ".episode-preview-video",
  ".episode-load-button",
  ".episode-takeaway",
  "contain: paint",
  "clamp(420px, 36vw, 620px)",
  "aspect-ratio: 9 / 13.85",
  ".article-card",
  ".skip-link",
  ".rail-pdf-actions",
  ".is-focus-mode .rail",
  ".commercial-execution-proof",
  ".fit-packet-grid",
  ".gallery-pause",
  ".selected-document-panel",
  ".selected-document-panel:focus-visible",
  ".proof-matrix",
  ".website-preview-board",
  ".website-preview-screen",
  ".website-preview-screen:fullscreen",
  ".website-screen-button",
  "@media (prefers-reduced-motion: reduce)",
  "[data-parallax-depth]"
].forEach((selector) => {
  check(styles.includes(selector), `Styles are missing ${selector}.`);
});

check(!styles.includes(".presentation-command"), "Presentation command center styling should stay removed.");
check(!main.includes("presentationStepItem"), "Presentation command center should not render duplicate section-step cards.");
check(!main.includes("presentation-progress"), "Presentation command center should not render a duplicate progress-card row.");
check(!styles.includes(".presentation-step"), "Styles should not keep duplicate section-step card styling.");
check(!styles.includes(".presentation-progress"), "Styles should not keep duplicate progress-row styling.");
check(!styles.includes(".top-actions"), "Styles should not keep a retired topbar action row.");
check(!styles.includes(".screen-focus-link"), "Styles should not keep visible focus-button styling.");
check(
  /\.mode-list\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1fr\);/.test(styles),
  "Section navigation should use full-width rows instead of shared columns."
);
check(
  /\.rail-pdf-actions\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1fr\);/.test(styles),
  "Fit packet PDFs should use full-width rows instead of shared columns."
);
check(
  /\.packet-pdf-rail \.doc-actions\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1fr\);/.test(styles),
  "In-page packet PDF rail should use full-width rows instead of shared columns."
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
  /\.resume-details-grid\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1fr\);/.test(styles),
  "Resume detail cards should stack as full-width rows instead of narrow columns."
);
check(
  /\.resume-detail-card\s*\{[\s\S]*?min-height:\s*0;/.test(styles),
  "Resume detail cards should not reserve column-height spacing after switching to stacked rows."
);
check(
  /\.hero-metrics\s*\{[\s\S]*?grid-template-rows:\s*repeat\(5,\s*auto\);[\s\S]*?align-content:\s*start;/.test(styles),
  "Resume hero metrics should stack five content-sized proof cards without stretching short cards."
);
check(
  /\.parallax-hero:not\(\.has-metrics\)\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1fr\);/.test(styles),
  "Non-resume heroes should collapse to a single-column layout without metric cards."
);
check(
  /@media\s*\(max-width:\s*760px\)[\s\S]*?\.parallax-hero\.has-metrics\s*\{[\s\S]*?min-height:\s*690px;[\s\S]*?\.parallax-hero:not\(\.has-metrics\)\s*\{[\s\S]*?min-height:\s*360px;/.test(styles),
  "Mobile Resume hero should reserve compact spacing for scan-level metrics."
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
check(packageJson.scripts?.["sync:repo-previews"], "package.json is missing sync:repo-previews.");
check(fs.existsSync(path.join(root, "scripts", "validate-contrast-system.mjs")), "Missing contrast-system validator.");
check(fs.existsSync(path.join(root, "scripts", "sync-repo-website-previews.mjs")), "Missing repo website preview sync helper.");

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
check(fileExists("public/documents/references/README.md"), "Missing references artifact index.");

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
check(readme.includes("#references/ai-success"), "README does not document the References shareable hash.");
check(readme.includes("public/documents/references/"), "README does not document the References artifact folder.");
check(readme.includes("#fit/ai-success/cover-letter"), "README does not document cover letter packet hashes.");
check(readme.includes("#fit/ai-success/30-60-90"), "README does not document 30-60-90 packet hashes.");
check(readme.includes("older `#application/...` links are normalized"), "README does not document legacy Application Proof hash normalization.");
check(readme.includes("Dynamic browser titles and descriptions"), "README does not document dynamic browser metadata.");
check(readme.includes("Resume, Portfolio, OpenAI Fit, and References"), "README does not document the four-step AI Success deck.");
check(readme.includes("human-owned build process"), "README does not document the human-owned build process.");
check(readme.includes("Parameter Golf-inspired review pattern"), "README does not document the Parameter Golf review pattern.");
check(readme.includes("recruiter-facing proof arc"), "README does not document the recruiter-facing proof arc.");
check(readme.includes("left rail is the only section navigation"), "README does not document the single-source section navigation rule.");
check(!readme.includes("copyable role brief"), "README still documents removed copyable role brief UI.");
check(!readme.includes("Copy confirmations"), "README still documents removed copy confirmation UI.");
check(readme.includes("Fit-only packet links"), "README does not document strategic packet links.");
check(readme.includes("screen-share focus mode"), "README does not document focus mode.");
check(readme.includes("`F` key"), "README does not document the focus mode keyboard shortcut.");
check(readme.includes("?focus=1"), "README does not document the focus mode query parameter.");
check(readme.includes("Codex Projects section"), "README does not document Portfolio Codex Projects previews.");
check(readme.includes("visual proof path"), "README does not document the OpenAI Fit proof path.");
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
    "Open the work behind the claim",
    "Fact-checked role source",
    "AI-assisted product building",
    "Agentic harnessing",
    "Workflow prototyping",
    "Customer workflow translation",
    "OpenAI-style review pattern",
    "Make projects reviewable like constrained OpenAI submissions.",
    "Codex project detail",
    "Role bridge for",
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
    "Resume proof detail",
    "The headline metrics, with the evidence kept below the fold.",
    "Commercial execution proof",
    "350 cases, field execution, customer context.",
    "350-case vodka display",
    "/assets/openai-fit/commercial-execution-seagrams-display.jpg",
    "Proof path",
    "Four proof surfaces make the fit inspectable.",
    "cover-letter",
    "Active packet artifact",
    "Application focus:",
    "Active packet document:",
    "Career record, credentials, and market-scale evidence.",
    "Inspectable products, media, and shipped work.",
    "Role source facts, proof path, and packet close.",
    "Permissioned third-party proof, staged only when requested.",
    "Focus",
    "Resume evidence",
    "References available on request",
    "Permissioned proof only",
    "data-reference-fullscreen",
    "WSET Level 2 Sake",
    "Wine Scholar Guild / Lustau",
    "Cicerone - Certified Beer Server L1",
    "Codex Projects",
    "Codex Project | Replit soundscape app",
    "brown noise",
    "recorded ambient layers",
    "layer modulation",
    "focus timer",
    "shareable mix links",
    "saved local mixes",
    "no-data-collection footer",
    "Role bridge for",
    "Live product website",
    "https://sipopedia.com/#app/starter",
    "Launch Pad preview entry",
    "/repo-previews/rose-quartz/index.html",
    "/repo-previews/coffee-index/index.html",
    "/repo-previews/zen-noise/index.html",
    "https://tasting-journal.replit.app/",
    "https://zen-noise.replit.app/",
    "Zen Noise",
    "Latest Replit build snapshot",
    "Reviewed against the live Replit deploy on June 14, 2026",
    "same-origin preview uses the latest Zen Noise production build",
    "https://github.com/Sip-Coder/Sipopedia",
    "Full screen",
    "https://www.wsetglobal.com/qualifications/wset-level-2-award-in-sake/",
    "wsg-lustau-csws.png",
    "cicerone-certified-beer-server.jpg",
    "The House of Lustau CSWS Online",
    "Cicerone Program Certified Beer Server",
    "architecture-design-drafting.svg",
    "credential-text-link",
    "Skip to presentation content",
    "presentation-content"
  ].forEach((text) => {
    check(builtJs.includes(text), `Built JS is missing presentation text: ${text}`);
  });
  [
    "Application Proof",
    "Application proof packet",
    "Hiring-team close",
    "OpenAI interview panel lens",
    "AI-assisted product building with human-owned judgment.",
    "Review path",
    "Proof arc",
    "Resume evidence / portfolio proof / OpenAI fit / references.",
    "Live interview answer board",
    "Keep the conversation anchored to the right proof.",
    "What a busy OpenAI panel should remember after the walkthrough.",
    "Open the next artifact only when it helps the hiring decision.",
    "The selected role defines the claim",
    "Evidence to cite",
    "Use these when the interviewer",
    "Use this when the interviewer",
    "Why the selected role makes sense",
    "matrix-reference"
  ].forEach((text) => {
    check(!builtJs.includes(text), `Built JS still contains retired presentation text: ${text}`);
  });
  const builtForbiddenKeys = forbiddenSiteKeys.filter((key) => key !== "url").filter((key) => {
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
    ".episode-grid--video-row",
    ".episode-player--instagram",
    ".episode-preview-video",
    ".episode-load-button",
    "contain:paint",
    "clamp(420px,36vw,620px)",
    "aspect-ratio:9 / 13.85",
    ".article-card",
    ".rail-pdf-actions",
    ".is-focus-mode .rail",
    ".resume-proof-details",
    ".resume-proof-detail-card",
    ".commercial-execution-proof",
    ".fit-packet-grid",
    ".gallery-pause",
    ".selected-document-panel",
    ".selected-document-panel:focus-visible",
    ".references-board",
    ".reference-grid",
    ".reference-card",
    ".reference-preview",
    ".reference-preview-wrap:fullscreen",
    ".reference-preview-toolbar",
    ".reference-actions",
    ".credential-text-link",
    ".proof-matrix",
    ".proof-card-image",
    ".proof-card-tags",
    ".website-preview-board",
    ".website-preview-screen",
    ".website-screen-button",
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
