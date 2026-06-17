import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createHash } from "node:crypto";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = path.resolve(root, "..");

const mainPath = path.join(root, "src", "main.js");
const readmePath = path.join(root, "README.md");
const indexPath = path.join(root, "index.html");
const packagePath = path.join(root, "package.json");
const dataPath = path.join(root, "src", "master-resume-data.js");
const publicDocsRoot = path.join(root, "public", "documents", "openai-2026-06-02");
const packetReadmePath = path.join(publicDocsRoot, "README.md");
const referencesReadmePath = path.join(root, "public", "documents", "references", "README.md");
const resumeDocsRoot = path.join(root, "public", "documents", "resume");
const applicationPacketRoot = path.join(workspaceRoot, "applications", "openai-2026-06-02");

const masterData = (await import(pathToFileURL(dataPath))).default;
const main = fs.readFileSync(mainPath, "utf8");
const readme = fs.readFileSync(readmePath, "utf8");
const indexHtml = fs.readFileSync(indexPath, "utf8");
const packetReadme = fs.readFileSync(packetReadmePath, "utf8");
const referencesReadme = fs.readFileSync(referencesReadmePath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function sha256(filePath) {
  return createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function validPdf(filePath) {
  if (!fileExists(filePath)) return false;
  const buffer = fs.readFileSync(filePath);
  const text = buffer.toString("latin1");
  return buffer.length > 1000 && buffer.subarray(0, 4).toString("latin1") === "%PDF" && /%%EOF\s*$/u.test(text);
}

function validDocx(filePath) {
  if (!fileExists(filePath)) return false;
  const buffer = fs.readFileSync(filePath);
  return buffer.length > 1000 && buffer.subarray(0, 2).toString("latin1") === "PK";
}

function expectedDocPaths(role) {
  const folder = path.join(publicDocsRoot, role.folder);
  const rootName = path.join(folder, role.prefix);
  return {
    resume: {
      pdf: `${rootName}_Resume.pdf`,
      docx: `${rootName}_Resume.docx`,
      md: `${rootName}_Resume.md`
    },
    coverLetter: {
      pdf: `${rootName}_Cover_Letter.pdf`,
      docx: `${rootName}_Cover_Letter.docx`,
      md: `${rootName}_Cover_Letter.md`
    },
    plan: {
      pdf: `${rootName}_30_60_90_Plan.pdf`,
      docx: `${rootName}_30_60_90_Plan.docx`,
      md: `${rootName}_30_60_90_Plan.md`
    }
  };
}

const aiSuccessRole = masterData.roles.find((role) => role.id === "ai-success");
check(Boolean(aiSuccessRole), "Generated role data is missing ai-success.");
check(masterData.resume?.name === "Jonathan Yu", "Generated resume identity is not Jonathan Yu.");
check(main.includes('const primaryRoleId = "ai-success"'), "Site should default to the AI Success Engineer role.");
check(main.includes("AI Success Engineer - US Remote"), "Site should visibly name AI Success Engineer - US Remote.");
check(main.includes("https://openai.com/careers/ai-success-engineer-us-remote-remote-us/"), "Site should link to the current OpenAI AI Success posting.");
check(main.includes('verifiedDate: "2026-06-11"'), "Site role facts should record the 2026-06-11 verification date.");
check(main.includes('$234K-$260K + equity'), "Site should expose the verified AI Success compensation range.");

[
  "post-sales ownership",
  "workflow mapping",
  "technical readiness",
  "adoption velocity",
  "KPIs",
  "measurable customer value",
  "OpenAI API",
  "agentic platform",
  "Codex",
  "ChatGPT Enterprise"
].forEach((phrase) => {
  check(main.includes(phrase), `Site AI Success source facts are missing: ${phrase}`);
});

[
  "Jonathan Yu application portfolio",
  "AI Success Engineer candidate proof",
  "Years across beverage sales, account analytics, education, and live events.",
  "Years Of AI Usage",
  "WamboArt.ai in 2021",
  "ChatGPT 3.5 in December 2022",
  "Established Sip Studies on January 15th, 2024",
  "Replit and then Codex revolutionized working abilities in 2026",
  "References available on request",
  "Permissioned proof only",
  "UFC 324 customer satisfaction proof",
  "Sanitized public summary"
].forEach((phrase) => {
  check(main.includes(phrase), `Submission page is missing application-ready text: ${phrase}`);
});

const staleUiPhrases = [
  "Reference PDF slot",
  "Email reference slot",
  "Awaiting source artifact",
  "Awaiting approved excerpt",
  "Awaiting hosted URL",
  "Client-facing resume presentation",
  "Resume Walkthrough",
  "resume walkthrough",
  "client-facing resume walkthrough"
];
const publicUiPayload = `${main}\n${indexHtml}`;
const publicUiPayloadLower = publicUiPayload.toLowerCase();
staleUiPhrases.forEach((phrase) => {
  check(!publicUiPayloadLower.includes(phrase.toLowerCase()), `Submission page still contains stale placeholder/general copy: ${phrase}`);
});

check(readme.includes("Jonathan Yu OpenAI AI Success Application Proof Site"), "README should describe the AI Success proof site.");
check(readme.includes("AI Success Engineer - US Remote application"), "README should name the active application.");
check(indexHtml.includes("OpenAI AI Success Engineer application proof page"), "index.html metadata should describe the AI Success application proof page.");
check(packetReadme.includes("Current Submission Focus"), "Packet README should name the current submission focus.");
check(packetReadme.includes("AI Success Engineer - US Remote is the active application target"), "Packet README should put AI Success first.");
check(!packetReadme.includes("## Submit First"), "Packet README should not keep stale Submit First ordering.");
check(referencesReadme.includes("Do not put raw `.msg` files"), "References index should prohibit raw private email artifacts.");
check(referencesReadme.includes("Keep originals in `Raw Data/Resume References/`"), "References index should preserve private source archive guidance.");
check(referencesReadme.includes("neutral privacy-safe summary"), "References index should preserve source-backed privacy-safe summary rules.");

if (aiSuccessRole) {
  const docs = expectedDocPaths(aiSuccessRole);
  const groups = Object.entries(docs);
  groups.forEach(([kind, formats]) => {
    check(validPdf(formats.pdf), `AI Success ${kind} PDF is missing or invalid: ${formats.pdf}`);
    check(validDocx(formats.docx), `AI Success ${kind} DOCX is missing or invalid: ${formats.docx}`);
    check(fileExists(formats.md), `AI Success ${kind} Markdown is missing: ${formats.md}`);
  });

  const packetMarkdown = groups.map(([, formats]) => readText(formats.md)).join("\n\n");
  [
    "Target Role: AI Success Engineer",
    "AI Success Engineer role",
    "AI-assisted product building",
    "human-owned build process",
    "workflow",
    "adoption",
    "KPI",
    "value"
  ].forEach((phrase) => {
    check(packetMarkdown.includes(phrase), `AI Success packet Markdown is missing: ${phrase}`);
  });

  [
    "I am applying for the AI Deployment Engineer",
    "I am applying for the Product Marketing Manager",
    "I am applying for the Customer Education",
    "I am applying for the Deployed Product Manager"
  ].forEach((phrase) => {
    check(!packetMarkdown.includes(phrase), `AI Success packet Markdown contains a wrong-role application phrase: ${phrase}`);
  });

  if (fs.existsSync(applicationPacketRoot)) {
    groups.forEach(([, formats]) => {
      Object.values(formats).forEach((publicPath) => {
        const relative = path.relative(publicDocsRoot, publicPath);
        const applicationPath = path.join(applicationPacketRoot, relative);
        check(fileExists(applicationPath), `Canonical application packet is missing: ${applicationPath}`);
        if (fileExists(applicationPath)) {
          check(sha256(publicPath) === sha256(applicationPath), `Public packet copy differs from canonical application file: ${relative}`);
        }
      });
    });
  }
}

[
  "JONATHAN_YU_SIP_STUDIES_COMBINED_RESUME_V4_CRITICAL_ON_HAND_2026-06-02.pdf",
  "JONATHAN_YU_SIP_STUDIES_COMBINED_RESUME_V4_CRITICAL_ON_HAND_2026-06-02.docx",
  "JONATHAN_YU_SIP_STUDIES_COMBINED_RESUME_V4_CRITICAL_ON_HAND_2026-06-02.md"
].forEach((file) => {
  const filePath = path.join(resumeDocsRoot, file);
  check(fileExists(filePath), `Full resume artifact is missing: ${filePath}`);
  if (file.endsWith(".pdf")) check(validPdf(filePath), `Full resume PDF is invalid: ${filePath}`);
  if (file.endsWith(".docx")) check(validDocx(filePath), `Full resume DOCX is invalid: ${filePath}`);
});

check(packageJson.scripts?.build, "package.json is missing build.");
check(packageJson.scripts?.["validate:presentation"], "package.json is missing validate:presentation.");
check(packageJson.scripts?.["validate:contrast"], "package.json is missing validate:contrast.");
check(packageJson.scripts?.["validate:ai-success"], "package.json is missing validate:ai-success.");

if (failures.length) {
  console.error("AI Success submission validation failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("AI Success submission validation passed.");
console.log(`Role: ${aiSuccessRole.title}`);
console.log(`Packet folder: ${aiSuccessRole.folder}`);
console.log("Checked site copy, role facts, references state, packet documents, PDFs, DOCX files, Markdown alignment, and canonical packet parity.");
