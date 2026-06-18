import "./styles.css";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.mjs?url";
import masterData from "./master-resume-data.js";
import portraitGallery from "./portrait-gallery.js";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const base = "/documents/openai-2026-06-02";
const referencesBase = "/documents/references";
const logoBase = "/assets/logos";
const heroImages = {
  resume: "/assets/academy-realm.jpg",
  projects: "/assets/header/codex-projects-hero.png",
  education: "/assets/header/podcast-video-hero.png",
  fit: "/assets/header/codex-projects-hero.png",
  references: "/assets/header/hiring-close-hero.png"
};

const { roles, resume } = masterData;
const primaryRoleId = "ai-success";
const primaryRole = roles.find((role) => role.id === primaryRoleId) || roles[0];
const referencePdfDocuments = new Map();

const aiSuccessPostingFacts = {
  title: "AI Success Engineer - US Remote",
  roleTeam: "AI Success",
  roleLocation: "Remote - US",
  payRange: "$234K-$260K + equity",
  sourceUrl: "https://openai.com/careers/ai-success-engineer-us-remote-remote-us/",
  verifiedDate: "2026-06-11",
  roleFacts: [
    "Primary post-sales point of contact for important customers.",
    "Owns account health, adoption velocity, technical deployment, KPI baselines, and measurable value.",
    "Maps workflows, validates use cases, leads configuration, and turns customer objectives into adoption roadmaps.",
    "Needs OpenAI API, agentic platform, Codex, ChatGPT Enterprise, and integration-pattern fluency.",
    "Partners with Sales, Solutions Architecture, Product, Engineering, and Research.",
    "Facilitates workshops, champion building, internal enablement, post-deployment reporting, and expansion discovery."
  ],
  successSignals: [
    "Technical readiness",
    "Adoption roadmap",
    "KPI baselines",
    "Value realization",
    "Field feedback"
  ]
};

const modes = [
  {
    id: "resume",
    label: "01 Resume",
    summary: "Career record, credentials, and market-scale evidence."
  },
  {
    id: "projects",
    label: "02 Portfolio",
    summary: "Inspectable products, media, and shipped work."
  },
  {
    id: "fit",
    label: "03 OpenAI Fit",
    summary: "Role source facts, proof path, and packet close."
  },
  {
    id: "references",
    label: "04 References",
    summary: "Permissioned third-party proof, staged only when requested."
  }
];

const modeEyebrows = {
  resume: "Resume evidence",
  projects: "Portfolio evidence",
  fit: "OpenAI Fit argument",
  references: "Permissioned references"
};

const publicLinks = [
  { label: "Bio Site", handle: "SipStudies link tree", href: "https://bio.site/SipStudies" },
  { label: "Website", handle: "sipstudies.com", href: "https://sipstudies.com" },
  { label: "YouTube", handle: "@sipstudies", href: "https://youtube.com/@sipstudies" },
  { label: "Education YouTube", handle: "@jonyu836", href: "https://www.youtube.com/@jonyu836" },
  { label: "Instagram", handle: "@sip.studies", href: "https://www.instagram.com/sip.studies" },
  { label: "Threads", handle: "@sip.studies", href: "https://www.threads.net/@sip.studies" },
  { label: "Substack", handle: "sipstudies", href: "https://sipstudies.substack.com" },
  { label: "Spotify", handle: "Sippy's Beverage Blog", href: "https://open.spotify.com/show/1p8kpZbP02yeEx5bM2xg1e" }
];

const mediaLinks = [
  { label: "Sippy GPT", handle: "custom AI guide", href: "https://chat.openai.com/g/g-OI6jzBEag-sippy" },
  { label: "Pocket Sommelier", handle: "ChatGPT guide", href: "https://chatgpt.com/g/g-HV3CbKpoK-sippy-pocket-sommelier" },
  { label: "Tasting Group", handle: "WhatsApp community", href: "https://chat.whatsapp.com/BiHrIKzTYmm2O2ql7jk2DT" },
  { label: "Sip Studies Reels", handle: "Instagram video proof", href: "https://www.instagram.com/sip.studies/reel/DGwT3fXvRxt/" },
  { label: "2Knivez Reel", handle: "personal media proof", href: "https://www.instagram.com/2knivez/reel/DGw69y4RWGv/" }
];

const referenceArtifacts = [
  {
    id: "ufc-324-customer-satisfaction",
    type: "PDF",
    title: "UFC 324 customer satisfaction proof",
    source: `${referencesBase}/ufc-324-customer-satisfaction-public-summary.pdf`,
    status: "Sanitized public summary",
    summary: "A privacy-safe customer satisfaction summary from the UFC 324 Rising Star package, focused on premium guest service, responsiveness, hospitality, and event execution.",
    href: `${referencesBase}/ufc-324-customer-satisfaction-public-summary.pdf`,
    body: "Customer name, email, phone, full headers, and original message text are withheld. The private source email remains in Raw Data/Resume References.",
    evidence: ["Customer satisfaction", "Premium guest service", "Service recovery", "Live-event execution"]
  },
  {
    id: "references-available-on-request",
    type: "Reference",
    title: "References available on request",
    source: "Application references",
    status: "Permissioned proof only",
    summary: "No placeholder recommendations are shown on the public application page. Reference PDFs or email excerpts should appear here only after the source and permission status are clear.",
    body: "References are available after direct request so every excerpt remains permissioned, source-backed, and current for the AI Success Engineer application.",
    evidence: ["Permissioned source only", "Role-specific context", "No placeholder claims"]
  },
  {
    id: "reference-index",
    type: "Index",
    title: "Reference source index",
    source: `${referencesBase}/README.md`,
    status: "Ready for artifact drops",
    summary: "A local source folder keeps PDFs, email exports, and display metadata together for review.",
    href: `${referencesBase}/README.md`,
    evidence: ["PDF drops", "Email exports", "Display notes"]
  }
];

const docSlugByName = {
  Resume: "resume",
  "Cover Letter": "cover-letter",
  "30-60-90": "30-60-90"
};

const docNameBySlug = Object.fromEntries(Object.entries(docSlugByName).map(([name, slug]) => [slug, name]));
const selectedDocumentPanelId = "selected-packet-document-panel";

function docTabId(name) {
  return `packet-doc-tab-${docSlugByName[name] || "resume"}`;
}

const riskControls = [
  {
    risk: "Why AI without a formal AI degree?",
    control: "Lead with shipped AI-enabled products, deployment-style artifacts, customer education, technical success language, and ongoing security, Python, and TypeScript proof."
  },
  {
    risk: "How does beverage work translate?",
    control: "Translate category complexity into AI adoption work: messy workflows, customer education, sales data, stakeholder trust, and learning-product design."
  },
  {
    risk: "Where does the role-specific pivot land?",
    control: "Make the sequence explicit: resume first, portfolio proof second, then OpenAI Fit with packet links and measured adoption language."
  },
  {
    risk: "Is the founder scope focused enough?",
    control: "Show disciplined prioritization: artifact, evidence, verification, next decision. Keep the conversation anchored to the selected role."
  }
];

const reviewableProjectStandard = [
  "Discuss the problem, process, output, validation, limitations, and role relevance.",
  "Show the prototype plus the reasoning, constraints, testing, and customer story.",
  "Use Codex-style workflows to prototype, inspect, refactor, test, and document product changes.",
  "Own the product judgment, prompts, review, testing, documentation, and final behavior."
];

const parameterGolfReviewPattern = {
  title: "OpenAI-style review pattern",
  sourceUrl: "https://github.com/openai/parameter-golf",
  articleUrl: "https://openai.com/index/what-parameter-golf-taught-us/",
  body:
    "Parameter Golf makes a portable hiring pattern visible: fork a public problem, improve under constraints, submit reviewable work, include logs or scores, and make the reasoning inspectable. This portfolio applies that same pattern to customer workflow and adoption work.",
  steps: [
    "Fork or frame the real problem.",
    "Improve the workflow under constraints.",
    "Submit an artifact with evidence.",
    "Include validation, limitations, and the decision log.",
    "Make the work easy for technical and customer-facing reviewers to challenge."
  ]
};

const wineScholarGuildCswsUrl = "https://www.winescholarguild.com/certifications/specialty-courses/certified-sherry-wine-specialist";
const ciceroneCertifiedBeerServerUrl = "https://www.cicerone.org/us-en/certifications/certified-beer-server";
const wsetLevel3WineUrl = "https://www.wsetglobal.com/qualifications/wset-level-3-award-in-wines/";
const wsetLevel2SpiritsUrl = "https://www.wsetglobal.com/qualifications/wset-level-2-award-in-spirits/";
const wsetLevel2SakeUrl = "https://www.wsetglobal.com/qualifications/wset-level-2-award-in-sake/";

const certificationLinks = new Map([
  ["WSET - Level 3 Wine", wsetLevel3WineUrl],
  ["WSET - Level 2 Spirits", wsetLevel2SpiritsUrl],
  ["WSET - Level 2 Sake", wsetLevel2SakeUrl],
  ["Wine Scholar Guild / Lustau - CSWS", wineScholarGuildCswsUrl],
  ["Cicerone - Certified Beer Server L1", ciceroneCertifiedBeerServerUrl]
]);

const credentialBadges = [
  { label: "MIT AI Strategy", img: `${logoBase}/mit-logo-red-cropped.png` },
  { label: "SWE Certified Wine Educator", img: `${logoBase}/swe-cwe.png`, href: "https://societyofwineeducators.org/education-certifications/" },
  { label: "SWE Certified Specialist of Spirits", img: `${logoBase}/swe-css.png`, href: "https://societyofwineeducators.org/education-certifications/" },
  { label: "WSET Level 3 Wine", img: `${logoBase}/wset-level-3-wine.png`, href: wsetLevel3WineUrl },
  { label: "WSET Level 2 Spirits", img: `${logoBase}/wset-level-2-spirits.png`, href: wsetLevel2SpiritsUrl },
  { label: "WSET Level 2 Sake", img: `${logoBase}/wset-level-2-sake.png`, href: wsetLevel2SakeUrl },
  { label: "CMS Certified Sommelier L2", img: `${logoBase}/cms-level-2.png`, href: "https://www.mastersommeliers.org" },
  { label: "The House of Lustau CSWS Online", img: `${logoBase}/wsg-lustau-csws.png`, href: wineScholarGuildCswsUrl },
  { label: "Cicerone Program Certified Beer Server", img: `${logoBase}/cicerone-certified-beer-server.jpg`, href: ciceroneCertifiedBeerServerUrl }
];

const customCompanyLogos = new Map([
  [
    "Architecture, Design & Drafting Foundation",
    {
      src: `${logoBase}/architecture-design-drafting.svg`
    }
  ]
]);

const codexProjects = [
  {
    title: "Sip Studies / Sipopedia",
    type: "Codex Project | Production education platform",
    path: "C:\\codebase\\sip_studies\\actual\\Sip-Studies",
    body: "React, TypeScript, Vite, Supabase, Stripe, Edge Functions, AI/news routing, terminology automation, tasting tools, maps, quizzes, events, and paid access across Learn, Taste, and Connect.",
    proof: ["69 Supabase migrations + 5 Edge Functions", "20,000 Sipopedia candidate rows", "Archived Replit lineage preserved under archive/replit-site-2026-03-01"],
    bridge: "Shows the strongest end-to-end product proof: customer education, AI workflow, data operations, paid access, and technical implementation."
  },
  {
    title: "Rose Quartz Massage",
    type: "Codex Project | Client website and launch package",
    path: "C:\\codebase\\sip_studies\\actual\\Rose-Quartz",
    body: "Static Vite client site with generated imagery, specialist service menu, interactive session-map intake, booking request flow, care standards, privacy content, journal library, SEO, sitemap tooling, and launch-readiness checks.",
    proof: ["36-article journal library", "Launch SEO and readiness docs", "Three.js dependency for richer experience work"],
    bridge: "Shows client-facing judgment: convert a service business into a clear web experience with intake, trust, launch, and content operations."
  },
  {
    title: "AI Edu / Safe Router",
    type: "Codex Project | Safe AI education prototype",
    path: "C:\\codebase\\sip_studies\\actual\\Ai-Edu",
    body: "Supabase Edge Function router pattern for OpenAI, Anthropic, and Google providers with frontend-safe keys, terminology surfaces, admin workflow, and citation guidance.",
    proof: ["ai-router Edge Function", "OpenAI / Anthropic / Google provider paths", "Citation guidance and admin workflow"],
    bridge: "Shows AI integration literacy, safe configuration instincts, provider abstraction, and educational data operations."
  },
  {
    title: "Coffee Index",
    type: "Codex Project | Market index story",
    path: "C:\\codebase\\sip_studies\\actual\\Coffee-Index",
    body: "Vite analytical page modeling solo espresso costs by city, rankings, regional averages, baseline index, and methodology narrative.",
    proof: ["City-by-city cost modeling", "Regional averages", "Methodology narrative"],
    bridge: "Shows fast data storytelling, methodology transparency, and public-facing analytical presentation."
  },
  {
    title: "Sip Studies Tasting Journal",
    type: "Codex Project | Replit tasting app",
    path: "C:\\codebase\\sip_studies\\actual\\Sip-Studies-Tasting-Journal",
    body: "Multi-beverage tasting templates, blind testing, analytics, study recommendations, Replit OIDC auth, PostgreSQL, Drizzle, and shadcn/Radix UI.",
    proof: ["Authenticated tasting workflows", "Blind-testing and analytics", "PostgreSQL / Drizzle lineage"],
    bridge: "Shows practical learner workflow design, authenticated product surfaces, and beverage-domain form architecture."
  },
  {
    title: "Zen Noise",
    type: "Codex Project | Replit soundscape app",
    path: "Zen-Noise.Replit.app",
    body: "Replit-origin ambient focus app with brown noise, recorded ambient layers, Web Audio playback, layer modulation, a focus timer, preset shuffle workflows, shareable mix links, and saved local mixes that persist on-device.",
    proof: ["Brown-noise and recorded ambient-layer controls", "Preset shuffle, share links, and focus timer", "Saved local mixes with no-data-collection footer"],
    bridge: "Shows product iteration beyond a prototype: Jonathan turned a focus-noise idea into a durable, user-controlled workflow with local persistence, linkable states, and inspectable production behavior."
  },
  {
    title: "Supporting prototypes",
    type: "Codex Project | Portfolio breadth",
    path: "C:\\codebase\\sip_studies\\actual",
    body: "Additional local folders show breadth across AI education, market-index storytelling, tasting-journal experiments, game/interactive prototypes, and client-service launches.",
    proof: ["Ai-Edu safe AI router", "Coffee-Index market story", "Sip-Studies-Tasting-Journal prototype"],
    bridge: "Shows range: Jonathan can explore a problem space quickly, preserve the learning, and carry useful patterns into the next build."
  }
];

const repoWebsitePreviews = [
  {
    title: "Sipopedia.com",
    label: "Live product website",
    repo: "Sipopedia.com",
    projectTitle: "Sip Studies / Sipopedia",
    repoHref: "https://github.com/Sip-Coder/Sipopedia",
    siteHref: "https://sipopedia.com/#app/starter",
    previewHref: "https://sipopedia.com/#app/starter",
    status: "Live iframe",
    summary: "The live learning platform now opens on the Launch Pad preview, giving recruiters a front-door view into the product surfaces that normally sit behind auth.",
    proof: ["Launch Pad preview entry", "Learn / Taste / Connect product lanes", "GitHub-backed source repo"]
  },
  {
    title: "Tasting Journal",
    label: "Live Replit app",
    repo: "Tasting-Journal.replit.app",
    projectTitle: "Sip Studies Tasting Journal",
    repoHref: "https://github.com/Sip-Coder/Sip-Studies-Tasting-Journal",
    siteHref: "https://tasting-journal.replit.app/",
    previewHref: "https://tasting-journal.replit.app/",
    status: "Live Replit iframe",
    summary: "The beverage tasting app appears at the same scale as Sipopedia, with the live Replit surface available for journal workflows and authenticated product review.",
    proof: ["Live Replit app surface", "Authenticated tasting workflows", "Blind testing and analytics lineage"]
  },
  {
    title: "Rose Quartz Massage",
    label: "GitHub repo website",
    repo: "Rose-Quartz",
    projectTitle: "Rose Quartz Massage",
    repoHref: "https://github.com/Sip-Coder/Rose-Quartz",
    siteHref: "/repo-previews/rose-quartz/index.html",
    previewHref: "/repo-previews/rose-quartz/index.html",
    status: "Static preview snapshot",
    summary: "Client launch website source is on GitHub, with a same-origin snapshot here so recruiters can inspect the site even before a production domain is attached.",
    proof: ["Responsive Vite site", "Booking and intake flow", "Launch-readiness package"]
  },
  {
    title: "Coffee Index",
    label: "GitHub repo website",
    repo: "Coffee-Index",
    projectTitle: "Coffee Index",
    repoHref: "https://github.com/Sip-Coder/Coffee-Index",
    siteHref: "/repo-previews/coffee-index/index.html",
    previewHref: "/repo-previews/coffee-index/index.html",
    status: "Static preview snapshot",
    summary: "Market-index website source is on GitHub, with the built Vite output embedded as a quick interactive data-story preview.",
    proof: ["City-by-city cost model", "Methodology page", "Data-storytelling surface"]
  },
  {
    title: "Zen Noise",
    label: "Live Replit app",
    repo: "Zen-Noise.Replit.app",
    projectTitle: "Zen Noise",
    repoHref: "https://github.com/Sip-Coder/Zen-Noise",
    siteHref: "https://zen-noise.replit.app/",
    previewHref: "/repo-previews/zen-noise/index.html",
    status: "Latest Replit build snapshot",
    summary: "Reviewed against the live Replit deploy on June 14, 2026. The same-origin preview uses the latest Zen Noise production build so the soundscape workflow shows reliably here, while the direct button still opens the live Replit app.",
    proof: ["Brown noise plus recorded ambient layers", "Preset shuffle, shareable links, and focus timer", "Saved local mixes and no-data-collection footer"]
  }
];

const projectCaseStudies = [
  {
    title: "Sip Studies / Sipopedia",
    signal: "Flagship AI education platform",
    problem: "A deep beverage domain needed to become a usable learning product instead of scattered expertise, posts, spreadsheets, and one-off lessons.",
    build: [
      "Built React, TypeScript, Vite, Supabase, Stripe, and Edge Function surfaces across Learn, Taste, and Connect.",
      "Created terminology workflows, tasting tools, maps, quizzes, paid access, and AI/news routing around repeatable learning.",
      "Turned domain knowledge into visible product surfaces that a hiring team can inspect, question, and connect to customer enablement."
    ],
    evidence: ["69 migrations + 5 Edge Functions", "20,000 Sipopedia candidate rows", "Learn / Taste / Connect product lanes"],
    process: "Framed the learning problem, used AI-assisted implementation to explore product paths, reviewed generated changes in the repo, then validated data, routes, documents, and user-facing behavior.",
    output: "A reviewable education platform with Learn, Taste, and Connect surfaces, terminology operations, paid-access architecture, public media, and customer-facing learning artifacts.",
    validation: "Builds, migration history, import-ready terminology structure, source metadata, public links, and validation scripts make the work inspectable.",
    limitations: "The platform still needs deeper enterprise security review, production analytics hardening, and more formal user research before claiming large-scale deployment maturity.",
    roleRelevance: "Mirrors AI Success work: workflow discovery, adoption design, technical enablement, product feedback, and measurable customer education.",
    aiDid: "Helped draft implementation paths, refactors, content operations, image/media variants, validation scripts, and documentation options.",
    jonathanDecided: "Set the product scope, learning model, source standards, validation threshold, customer story, and final behavior to keep the build accountable.",
    interviewUse: "Use this as the main builder proof for Codex, AI Success, product deployment, and customer education roles."
  },
  {
    title: "Work Efficient / Critical On Hand",
    signal: "Field workflow and data translation",
    problem: "Sales, inventory, incentive, and account data were useful only if they could be converted into weekly account actions.",
    build: [
      "Created local intake and analysis workflows for Critical On Hand, Gap Analysis, incentive decks, account opportunities, and item opportunities.",
      "Framed messy source files into confidence tiers, exports, and operating decisions that support real field execution.",
      "Connected the technical artifact to the way teams actually prioritize placements, displays, supplier conversations, and account support."
    ],
    evidence: ["45,542-row inventory reference file", "95,000 distribution points analyzed", "Weekly Critical On Hand workflow"],
    process: "Translated sales, inventory, incentive, and account ambiguity into a repeatable workbook workflow with filters, confidence tiers, and action-ready exports.",
    output: "Weekly execution priorities for placements, displays, supplier conversations, education, and account support.",
    validation: "Business use, file checks, distribution-point scale, recurring weekly operation, and the $2.291M Lee's Liquor revenue lift anchor the claim.",
    limitations: "The workflow is local and field-operations specific; it should be productized carefully before treating it like a scalable SaaS workflow.",
    roleRelevance: "Direct AI Success bridge for KPI baselines, account health, workflow mapping, stakeholder alignment, and value-realization reporting.",
    aiDid: "Helped inspect workbook logic, structure automation options, summarize data patterns, and draft handoff documentation.",
    jonathanDecided: "Owned the field context, account prioritization logic, customer interpretation, and what counted as a useful weekly action.",
    interviewUse: "Use this when the conversation turns to adoption, KPI baselines, customer value, and practical enablement."
  },
  {
    title: "Rose Quartz Massage",
    signal: "Client launch and trust-sensitive UX",
    problem: "A service business needed more than a pretty page: it needed service clarity, intake trust, launch readiness, and visible care standards.",
    build: [
      "Built a responsive Vite site with generated imagery, service menu, body-map intake, booking request flow, privacy content, and care standards.",
      "Added journal content, SEO, sitemap tooling, and launch-readiness documentation so the client could operate the site after handoff.",
      "Balanced visual polish with practical conversion, trust, and maintenance needs."
    ],
    evidence: ["36-article journal library", "Interactive session-map intake", "SEO and launch-readiness docs"],
    process: "Converted a local-service business need into a client-facing site, intake flow, care language, generated assets, and launch-readiness checks.",
    output: "A polished public site with booking request flow, service clarity, body-map intake, privacy content, journal library, SEO, sitemap, and handoff docs.",
    validation: "Launch checks, responsive testing, journal inventory, sitemap generation, and client-operability documentation support the handoff.",
    limitations: "The strongest proof is launch readiness and client UX; deeper booking automation and production analytics would be the next maturity step.",
    roleRelevance: "Shows customer empathy, workflow simplification, trust-sensitive UX, launch execution, and post-handoff enablement.",
    aiDid: "Helped generate imagery, draft journal content, inspect site structure, and accelerate implementation revisions.",
    jonathanDecided: "Owned the client promise, service language, intake boundaries, visual direction, and launch-readiness definition.",
    interviewUse: "Use this to show client-facing judgment, implementation taste, and the ability to ship polished business experiences."
  },
  {
    title: "AI Edu / Safe Router",
    signal: "AI integration and guardrail thinking",
    problem: "Education-facing AI work needed provider flexibility, safer frontend key handling, and clearer terminology workflows.",
    build: [
      "Built a Supabase Edge Function router pattern for OpenAI, Anthropic, and Google providers.",
      "Kept provider logic server-side while supporting education content, admin workflow, and citation guidance.",
      "Used the prototype to practice the same deployment and enablement questions that AI customers face."
    ],
    evidence: ["Supabase Edge Function ai-router", "OpenAI / Anthropic / Google provider path", "Citation guidance and admin workflow"],
    process: "Started from education safety needs, moved provider logic server-side, and used the prototype to reason about citations, admin controls, and customer trust.",
    output: "A provider-router prototype with OpenAI, Anthropic, and Google paths, safer frontend key handling, terminology/admin surfaces, and citation guidance.",
    validation: "Supabase Edge Function structure, provider separation, frontend-safe key pattern, and documented citation/admin behavior make the prototype reviewable.",
    limitations: "It is a safety-oriented prototype, not a complete enterprise AI governance platform; policy, audit, and monitoring depth would need expansion.",
    roleRelevance: "Supports AI Success conversations about APIs, integration patterns, safe configuration, technical tradeoffs, and customer enablement.",
    aiDid: "Helped compare provider routing options, draft guardrail language, and inspect implementation paths.",
    jonathanDecided: "Owned the safe-router boundary, education use case, citation posture, and what needed to stay server-side.",
    interviewUse: "Use this when the role needs AI deployment literacy, security awareness, and practical implementation reasoning."
  }
];

const educationSignals = [
  {
    title: "AARP Wine Walk Wednesdays",
    body: "Live and recorded adult education for 50+ active adults, predominantly viewed in Colorado and spanning all 50 states.",
    link: publicLinks.find((link) => link.label === "Education YouTube")
  },
  {
    title: "Sip Studies YouTube",
    body: "Public-facing education channel connected to beverage learning, product storytelling, and proof that complex topics can be taught visually.",
    link: publicLinks.find((link) => link.label === "YouTube")
  },
  {
    title: "Sippy's Beverage Blog",
    body: "Podcast/audio channel that turns the Flavor Blog and Sippy voice into repeatable beverage education, audience engagement, and AI-assisted storytelling.",
    link: publicLinks.find((link) => link.label === "Spotify")
  },
  {
    title: "Writing and community",
    body: "Substack, social posts, reels, Bio Site, GPT guides, and tasting-group links give interviewers public proof beyond a PDF.",
    link: publicLinks.find((link) => link.label === "Substack")
  }
];

const mediaEpisodes = [
  {
    title: "Ai Winecast - J Lohr Vineyards & Wines",
    label: "AI Winecast video episode",
    episodeLabel: "Winery feature",
    theme: "J Lohr Vineyards",
    publishedAt: "2025",
    youtubeId: "zm2ECFtViXA",
    youtubeUrl: "https://youtu.be/zm2ECFtViXA",
    thumbnail: "https://i.ytimg.com/vi/zm2ECFtViXA/hqdefault.jpg",
    summary:
      "A winery-profile episode translating J. Lohr's vineyard and wine story into accessible AI-assisted beverage education."
  },
  {
    title: "Ai Winecast - 002 Cabernet Sauvignon",
    label: "AI Winecast video episode",
    episodeLabel: "Episode 002",
    theme: "Cabernet Sauvignon",
    publishedAt: "Jul 21, 2025",
    youtubeId: "yVHuAHuAAVE",
    youtubeUrl: "https://youtu.be/yVHuAHuAAVE",
    thumbnail:
      "https://images.squarespace-cdn.com/content/v1/60ebc279dcf3287a46adfe4e/12ed137e-e2bf-4948-b028-766aeac72ab4/Ai+Winecast+-+001.1+Cabernet.png",
    summary:
      "Cabernet Sauvignon's origin, viticulture, thick skins, tannin structure, and classic Bordeaux expression."
  },
  {
    title: "Tasting Winecast - 005",
    label: "YouTube education episode",
    episodeLabel: "Episode 005",
    theme: "Tasting Method",
    publishedAt: "Jul 16, 2025",
    youtubeId: "ruR8eUMe1wI",
    youtubeUrl: "https://youtu.be/ruR8eUMe1wI",
    thumbnail:
      "https://images.squarespace-cdn.com/content/v1/60ebc279dcf3287a46adfe4e/456cfa94-5391-4f0a-a6ae-f2e3ce4ecafb/005+Tasting.png",
    summary:
      "A tasting-focused bridge between visual wine education and structured sensory practice."
  },
  {
    title: "Ai Winecast - Episode 003",
    label: "AI Winecast video episode",
    episodeLabel: "Episode 003",
    theme: "AI Wine Education",
    publishedAt: "Jul 12, 2025",
    youtubeId: "ljqiSmosaEo",
    youtubeUrl: "https://youtu.be/ljqiSmosaEo",
    thumbnail:
      "https://images.squarespace-cdn.com/content/v1/60ebc279dcf3287a46adfe4e/7a2518fe-4db7-46cc-a859-f25c2ac2969f/003+Ai.png",
    summary:
      "An early AI Winecast entry focused on building AI-assisted beverage education into a repeatable learning format."
  }
];

const soraProjectVideos = [
  {
    title: "Sora Project 01",
    label: "Sora Projects",
    episodeLabel: "Local video",
    theme: "AI video generation",
    publishedAt: "Sora upload",
    duration: "Video",
    frame: "video-file",
    videoSrc: "/media/sora-projects/WhatsApp%20Video%202026-06-12%20at%2022.08.46.mp4",
    summary: "A reviewable AI-generated motion sample staged as public visual proof inside the portfolio.",
    linkLabel: "Open video file",
    linkKind: "MP4"
  },
  {
    title: "Sora Project 02",
    label: "Sora Projects",
    episodeLabel: "Local video",
    theme: "AI video generation",
    publishedAt: "Sora upload",
    duration: "Video",
    frame: "video-file",
    videoSrc: "/media/sora-projects/WhatsApp%20Video%202026-06-12%20at%2022.08.48.mp4",
    summary: "A second Sora video card using the same click-to-load presentation pattern as the reel sections.",
    linkLabel: "Open video file",
    linkKind: "MP4"
  },
  {
    title: "Sora Project 03",
    label: "Sora Projects",
    episodeLabel: "Local video",
    theme: "AI video generation",
    publishedAt: "Sora upload",
    duration: "Video",
    frame: "video-file",
    videoSrc: "/media/sora-projects/WhatsApp%20Video%202026-06-12%20at%2022.08.50.mp4",
    summary: "A compact visual-generation proof point that can be opened directly or played inline on demand.",
    linkLabel: "Open video file",
    linkKind: "MP4"
  },
  {
    title: "Sora Project 04",
    label: "Sora Projects",
    episodeLabel: "Local video",
    theme: "AI video generation",
    publishedAt: "Sora upload",
    duration: "Video",
    frame: "video-file",
    videoSrc: "/media/sora-projects/WhatsApp%20Video%202026-06-12%20at%2022.08.53.mp4",
    summary: "The fourth Sora upload completes the section as a four-card visual proof set.",
    linkLabel: "Open video file",
    linkKind: "MP4"
  }
];

const aarpWineWalkVideos = [
  {
    title: "Aromatic Treasures",
    label: "AARP Wine Walk Wednesdays",
    episodeLabel: "Latest channel video",
    theme: "Aroma language",
    publishedAt: "4 years ago",
    duration: "1:03:38",
    youtubeId: "3G9iA4FlszI",
    youtubeUrl: "https://youtu.be/3G9iA4FlszI",
    thumbnail: "https://i.ytimg.com/vi/3G9iA4FlszI/hqdefault.jpg",
    summary: "Recorded Wine Walk Wednesday session showing adult education pacing, sensory vocabulary, and live beverage teaching."
  },
  {
    title: "Summertime Wines",
    label: "AARP Wine Walk Wednesdays",
    episodeLabel: "Latest channel video",
    theme: "Seasonal wine",
    publishedAt: "4 years ago",
    duration: "1:01:10",
    youtubeId: "Ht46bIUm1h4",
    youtubeUrl: "https://youtu.be/Ht46bIUm1h4",
    thumbnail: "https://i.ytimg.com/vi/Ht46bIUm1h4/hqdefault.jpg",
    summary: "A long-form public teaching session built around seasonal selection, approachable language, and audience-friendly wine context."
  },
  {
    title: "Classic Burgundy",
    label: "AARP Wine Walk Wednesdays",
    episodeLabel: "Latest channel video",
    theme: "Burgundy",
    publishedAt: "4 years ago",
    duration: "1:00:18",
    youtubeId: "F2A4wbxC6LA",
    youtubeUrl: "https://youtu.be/F2A4wbxC6LA",
    thumbnail: "https://i.ytimg.com/vi/F2A4wbxC6LA/hqdefault.jpg",
    summary: "A recorded regional lesson translating Burgundy into an accessible, hour-long learning experience for a broad audience."
  },
  {
    title: "Everything Sparkling",
    label: "AARP Wine Walk Wednesdays",
    episodeLabel: "Latest channel video",
    theme: "Sparkling wine",
    publishedAt: "4 years ago",
    duration: "1:01:49",
    youtubeId: "kQKxxUzQmuM",
    youtubeUrl: "https://youtu.be/kQKxxUzQmuM",
    thumbnail: "https://i.ytimg.com/vi/kQKxxUzQmuM/hqdefault.jpg",
    summary: "A sparkling-wine lesson that shows Jonathan making technical beverage topics usable in a live education format."
  }
];

const sipStudiesInstagramVideos = [
  {
    title: "Sip Studies Instagram Reel 01",
    label: "Sip Studies Instagram",
    episodeLabel: "Instagram Reel",
    theme: "Short-form education",
    publishedAt: "Instagram reel",
    duration: "Reel",
    frame: "instagram",
    embedUrl: "https://www.instagram.com/reel/DOFDY98Dtrg/embed",
    href: "https://www.instagram.com/reel/DOFDY98Dtrg/?igsh=MWZ2eTJoNGY4NGZseQ==",
    linkLabel: "Open on Instagram",
    linkKind: "REEL",
    thumbnail: "/media/instagram-posters/sip-studies-01.jpg",
    summary: "Shows Sip Studies using short-form social video as public, reviewable beverage education."
  },
  {
    title: "Sip Studies Instagram Reel 02",
    label: "Sip Studies Instagram",
    episodeLabel: "Instagram Reel",
    theme: "Short-form education",
    publishedAt: "Instagram reel",
    duration: "Reel",
    frame: "instagram",
    embedUrl: "https://www.instagram.com/reel/DHUh3JlS7Ko/embed",
    href: "https://www.instagram.com/reel/DHUh3JlS7Ko/?igsh=ZmgybWx6cXR4Mzk1",
    linkLabel: "Open on Instagram",
    linkKind: "REEL",
    thumbnail: "/media/instagram-posters/sip-studies-02.jpg",
    summary: "Connects Sip Studies audience-building to concise public teaching and repeatable learning prompts."
  },
  {
    title: "Sip Studies Instagram Reel 03",
    label: "Sip Studies Instagram",
    episodeLabel: "Instagram Reel",
    theme: "Short-form education",
    publishedAt: "Instagram reel",
    duration: "Reel",
    frame: "instagram",
    embedUrl: "https://www.instagram.com/reel/DGw69y4RWGv/embed",
    href: "https://www.instagram.com/reel/DGw69y4RWGv/?igsh=MXc5M2wwNDJhZjkxeQ==",
    linkLabel: "Open on Instagram",
    linkKind: "REEL",
    thumbnail: "/media/instagram-posters/sip-studies-03.jpg",
    summary: "Extends the portfolio beyond static documents into a visible cadence of public social content."
  },
  {
    title: "Sip Studies Instagram Reel 04",
    label: "Sip Studies Instagram",
    episodeLabel: "Instagram Reel",
    theme: "Short-form education",
    publishedAt: "Instagram reel",
    duration: "Reel",
    frame: "instagram",
    embedUrl: "https://www.instagram.com/reel/DGO8bRFRpj2/embed",
    href: "https://www.instagram.com/reel/DGO8bRFRpj2/?igsh=emg2ZXBtbXdlODQz",
    linkLabel: "Open on Instagram",
    linkKind: "REEL",
    thumbnail: "/media/instagram-posters/sip-studies-04.jpg",
    summary: "Turns beverage education into a lightweight, shareable proof point for public audience engagement."
  }
];

const sommSupportInstagramVideos = [
  {
    title: "Somm Support Instagram Reel 01",
    label: "Somm Support Instagram",
    episodeLabel: "Instagram Reel",
    theme: "Somm support media",
    publishedAt: "Instagram reel",
    duration: "Reel",
    frame: "instagram",
    embedUrl: "https://www.instagram.com/reel/DFuLhCVRDIU/embed",
    href: "https://www.instagram.com/reel/DFuLhCVRDIU/?igsh=MTNtbnBsMHFqMGEyaA==",
    linkLabel: "Open on Instagram",
    linkKind: "REEL",
    thumbnail: "/media/instagram-posters/somm-support-01.jpg",
    summary: "Shows short-form support content as a practical companion to beverage study and certification work."
  },
  {
    title: "Somm Support Instagram Reel 02",
    label: "Somm Support Instagram",
    episodeLabel: "Instagram Reel",
    theme: "Somm support media",
    publishedAt: "Instagram reel",
    duration: "Reel",
    frame: "instagram",
    embedUrl: "https://www.instagram.com/reel/DFisS-QyRzE/embed",
    href: "https://www.instagram.com/reel/DFisS-QyRzE/?igsh=MW1sZXVvcGg0cTlo",
    linkLabel: "Open on Instagram",
    linkKind: "REEL",
    thumbnail: "/media/instagram-posters/somm-support-02.jpg",
    summary: "Adds social proof that beverage-learning support can be presented in concise, reviewable formats."
  },
  {
    title: "Somm Support Instagram Reel 03",
    label: "Somm Support Instagram",
    episodeLabel: "Instagram Reel",
    theme: "Somm support media",
    publishedAt: "Instagram reel",
    duration: "Reel",
    frame: "instagram",
    embedUrl: "https://www.instagram.com/reel/DE8OCR7SgZE/embed",
    href: "https://www.instagram.com/reel/DE8OCR7SgZE/?igsh=MXJudm11b3BlZ2l4aQ==",
    linkLabel: "Open on Instagram",
    linkKind: "REEL",
    thumbnail: "/media/instagram-posters/somm-support-03.jpg",
    summary: "Keeps the support brand visible as public-facing learning evidence instead of private-only work."
  },
  {
    title: "Somm Support Instagram Reel 04",
    label: "Somm Support Instagram",
    episodeLabel: "Instagram Reel",
    theme: "Somm support media",
    publishedAt: "Instagram reel",
    duration: "Reel",
    frame: "instagram",
    embedUrl: "https://www.instagram.com/reel/DEyt0Ioxmw4/embed",
    href: "https://www.instagram.com/reel/DEyt0Ioxmw4/?igsh=NTNjM3VtY3ByZ2N0",
    linkLabel: "Open on Instagram",
    linkKind: "REEL",
    thumbnail: "/media/instagram-posters/somm-support-04.jpg",
    summary: "Rounds out the support media set with a fourth reel in the same playable portfolio card format."
  }
];

const podcastAudio = {
  title: "Sippy's Beverage Blog - By Sip Studies",
  embedUrl: "https://open.spotify.com/embed/show/1p8kpZbP02yeEx5bM2xg1e?utm_source=generator",
  href: "https://open.spotify.com/show/1p8kpZbP02yeEx5bM2xg1e",
  body:
    "The current Spotify podcast home for Sippy's Beverage Blog, connecting the written Flavor Blog to a playable audio feed under the Sip Studies account."
};

const flavorBlogCollections = [
  {
    title: "SipStudies.com Blog",
    sourceId: "sipstudies-site",
    href: "https://www.sipstudies.com/blog",
    sourceNote: "Latest four from the live Squarespace RSS feed.",
    items: [
      {
        title: "More Success with Students!",
        href: "https://www.sipstudies.com/blog/taylor",
        publishedAt: "Aug 30, 2025",
        summary: "Latest student-success article from the SipStudies.com blog, tied to certification growth and the tasting community.",
        thumbnail:
          "https://images.squarespace-cdn.com/content/v1/60ebc279dcf3287a46adfe4e/fd3e42fa-48fe-4af4-9dbb-6d52a5aace83/Taylor+09.png?format=1000w"
      },
      {
        title: "A Day of Celebration, Certification & Community",
        href: "https://www.sipstudies.com/blog/luis",
        publishedAt: "Jul 31, 2025",
        summary: "Community and certification story showing the human side of beverage education, mentorship, and exam preparation.",
        thumbnail:
          "https://images.squarespace-cdn.com/content/v1/60ebc279dcf3287a46adfe4e/af4590f2-fcf4-40b2-897f-f4a671362418/IMG_20250509_174239.jpg?format=1000w"
      },
      {
        title: "Losing A Dear Friend",
        href: "https://www.sipstudies.com/blog/annie",
        publishedAt: "Jul 29, 2025",
        summary: "Memorial post for Annie and the community presence behind Wine Blog With A Dog and Bark & Barrels.",
        thumbnail:
          "https://images.squarespace-cdn.com/content/v1/60ebc279dcf3287a46adfe4e/fc857d85-86af-475c-a85c-bbbbea6a90a6/IMG-20250320-WA0002.jpg?format=1000w"
      },
      {
        title: "New AI podcast",
        href: "https://www.sipstudies.com/blog/new-ai-podcast",
        publishedAt: "Jul 27, 2025",
        summary: "Behind-the-scenes post on the AI Winecast idea and the work behind a futuristic wine-education format.",
        thumbnail:
          "https://images.squarespace-cdn.com/content/v1/60ebc279dcf3287a46adfe4e/8c7e2475-cc14-4d09-b392-f2298ef5bf58/Sip+Studies+-+Ai+Winecast.png?format=1000w"
      }
    ]
  },
  {
    title: "Sip Studies Substack",
    sourceId: "sipstudies-substack",
    href: "https://sipstudies.substack.com/",
    sourceNote: "Latest four from the live Substack RSS feed.",
    items: [
      {
        title: "What a Biosignature on Mars Teaches Us About Water, Life, and Sipping",
        href: "https://sipstudies.substack.com/p/what-a-biosignature-on-mars-teaches",
        publishedAt: "Sep 14, 2025",
        summary: "by Sippy, your fellow Martian",
        thumbnail:
          "https://substackcdn.com/image/fetch/$s_!zBRg!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fecb41e32-f9be-4922-97c2-148eed6a5b0b_1536x1024.png"
      },
      {
        title: "Flavor Is Not a Tongue Thing, It's a Brain Thing",
        href: "https://sipstudies.substack.com/p/flavor-is-not-a-tongue-thing-its",
        publishedAt: "Sep 13, 2025",
        summary: "by Sippy, your Brain-Thing Assistant",
        thumbnail:
          "https://substackcdn.com/image/fetch/$s_!gobp!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff0f133e9-8e2d-4284-9d7b-ccbf490ed324_1536x1024.png"
      },
      {
        title: "Mentoring Through Tasting: Teaching Without Pretense",
        href: "https://sipstudies.substack.com/p/mentoring-through-tasting-teaching",
        publishedAt: "Sep 7, 2025",
        summary: "by Sippy, your Beverage Storyteller",
        thumbnail:
          "https://substackcdn.com/image/fetch/$s_!0mb4!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fb4980b7f-082d-4405-a162-f6741049d73e_1536x1024.png"
      },
      {
        title: "Austria",
        href: "https://sipstudies.substack.com/p/austria",
        publishedAt: "Sep 6, 2025",
        summary: "by Sippy, your Vineyard Travel Guide",
        thumbnail:
          "https://substackcdn.com/image/fetch/$s_!iWlT!,w_1200,h_600,c_fill,f_jpg,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-video.s3.amazonaws.com%2Fvideo_upload%2Fpost%2F172541156%2F594996a6-659c-4c15-8a4e-572f1e627ea0%2Ftranscoded-1756785783.png"
      }
    ]
  },
  {
    title: "Daily Sip",
    sourceId: "daily-sip",
    href: "https://sipopedia.com/#app/flavor-blog?source=daily-sip",
    sourceNote: "Latest four generated reports from the Sipopedia Daily Sip data source.",
    items: [
      {
        title: "Daily Sip: Beverage Market Briefing for May 27, 2026",
        href: "https://sipopedia.com/#app/flavor-blog?source=daily-sip&entry=daily-sip-2026-05-27",
        publishedAt: "May 27, 2026",
        summary: "Daily Sip scanned 13 beverage sources and selected 20 stories with clear source attribution, concrete trade relevance, and limited hype.",
        thumbnail: "https://sipopedia.com/daily-sip/daily-sip-2026-05-27-header.png"
      },
      {
        title: "Daily Sip: Beverage Market Briefing for May 26, 2026",
        href: "https://sipopedia.com/#app/flavor-blog?source=daily-sip&entry=daily-sip-2026-05-26",
        publishedAt: "May 26, 2026",
        summary: "Daily Sip scanned 13 beverage sources and selected 20 stories with clear source attribution, concrete trade relevance, and limited hype.",
        thumbnail: "https://sipopedia.com/daily-sip/daily-sip-2026-05-26-header.png"
      },
      {
        title: "Daily Sip: Beverage Market Briefing for May 25, 2026",
        href: "https://sipopedia.com/#app/flavor-blog?source=daily-sip&entry=daily-sip-2026-05-25",
        publishedAt: "May 25, 2026",
        summary: "Daily Sip scanned 13 beverage sources and selected 20 stories with clear source attribution, concrete trade relevance, and limited hype.",
        thumbnail: "https://sipopedia.com/daily-sip/daily-sip-2026-05-25-header.png"
      },
      {
        title: "Daily Sip: Beverage Market Briefing for May 24, 2026",
        href: "https://sipopedia.com/#app/flavor-blog?source=daily-sip&entry=daily-sip-2026-05-24",
        publishedAt: "May 24, 2026",
        summary: "Daily Sip scanned 13 beverage sources and selected 20 stories with clear source attribution, concrete trade relevance, and limited hype.",
        thumbnail: "https://sipopedia.com/daily-sip/daily-sip-2026-05-24-header.png"
      }
    ]
  }
];

function proofMetric(label, value, detail, scale = 76, items = []) {
  return {
    label,
    value,
    detail,
    scale,
    items,
    max: 100
  };
}

function resumeProofMetrics() {
  return [
    proofMetric(
      "Career range",
      "10+",
      "Beverage sales, account analytics, education, and live events.",
      82,
      ["Years across beverage sales, account analytics, education, and live events."]
    ),
    proofMetric(
      "Years Of AI Usage",
      "2021+",
      "From early generative tools to Codex-driven product and workflow builds.",
      76,
      [
      "Started using WamboArt.ai in 2021.",
      "Then ChatGPT 3.5 in December 2022.",
      'Enrolled in "Artificial Intelligence Implications For Business Strategy" online with MIT in August 2023.',
      "Established Sip Studies on January 15th, 2024.",
      "Replit and then Codex revolutionized working abilities in 2026."
      ]
    ),
    proofMetric(
      "Commercial lift",
      "$2.291M",
      "Wine revenue lift, 3,500+ expanded placements, and field execution scale.",
      88,
      [
        "Sales Consultant Excellence Award in 2018 and 2026.",
        "Expanded 3,500+ placements.",
        "Increased wine revenue by $2,291,000 in 2018.",
        "Grew and supported the team by monitoring 3,800 SKUs, with over 95,000 points of distribution in 2025 including Reno, Wendover, and Mesquite."
      ]
    ),
    proofMetric(
      "Founder platform",
      "20,000",
      "Sipopedia terminology rows with citation and review metadata.",
      80,
      [
        "Built an integrated LMS platform for wine, beer, spirits, coffee, tea, and all other beverages.",
        "Built a video game simulation for beverage lifecycles beginning to end.",
        "Built a professional-friendly, mobile beverage resource map for navigating versatile beverage solutions."
      ]
    ),
    proofMetric(
      "Credential stack",
      `${resume.certs.length}`,
      "AI strategy, wine, spirits, sake, beer, and sommelier credentials.",
      72,
      ["AI strategy, wine, spirits, sake, beer, and sommelier credentials represented in the resume."]
    )
  ];
}

function heroMetricsFor(modeId) {
  if (modeId !== "resume") return [];
  return resumeProofMetrics().map(({ label, value, detail, scale, max }) => proofMetric(label, value, detail, scale, [], max));
}

const app = document.querySelector("#app");
let selectedRole = primaryRole;
let selectedDoc = "Resume";
let selectedMode = "resume";
let focusMode = initialFocusMode();
applyHashState();
const originalHeaderPortraitFilename = "received_408407423126180.jpeg";
let activePortraitIndex = originalPortraitIndex();
let galleryTimer = null;
let galleryOpen = false;
let galleryPaused = false;

const portraitRotationMs = 5000;

function originalPortraitIndex() {
  return Math.max(
    0,
    portraitGallery.findIndex((photo) => photo.filename === originalHeaderPortraitFilename)
  );
}

function primaryPortrait() {
  return {
    filename: "jonathan-yu-headshot.jpg",
    title: "Jonathan Yu",
    src: "/assets/portrait/jonathan-yu-headshot.jpg",
    alt: "Jonathan Yu portrait",
    caption: ""
  };
}

function portraitAt(index) {
  if (!portraitGallery.length) return primaryPortrait();
  const wrappedIndex = (index + portraitGallery.length) % portraitGallery.length;
  return portraitGallery[wrappedIndex];
}

function galleryCountText() {
  if (!portraitGallery.length) return "0 / 0";
  return `${activePortraitIndex + 1} / ${portraitGallery.length}`;
}

function hashParts() {
  return window.location.hash.replace(/^#\/?/u, "").split("/").filter(Boolean);
}

function isPacketMode() {
  return selectedMode === "fit";
}

function normalizeModeId(modeId) {
  const legacyModes = {
    application: "fit",
    education: "projects",
    portfolio: "projects"
  };
  return legacyModes[modeId] || modeId;
}

function initialFocusMode() {
  return new URLSearchParams(window.location.search).get("focus") === "1";
}

function applyHashState() {
  const [modeId, roleId, docSlug] = hashParts();
  const normalizedModeId = normalizeModeId(modeId);
  if (modes.some((mode) => mode.id === normalizedModeId)) selectedMode = normalizedModeId;
  if (roleId) selectedRole = roles.find((role) => role.id === roleId) || selectedRole;
  selectedDoc = isPacketMode() ? docNameBySlug[docSlug] || "Resume" : "Resume";
  if (modeId === "application") window.requestAnimationFrame(updateUrlState);
}

function updateUrlState() {
  const docPart = isPacketMode() && selectedDoc !== "Resume" ? `/${docSlugByName[selectedDoc]}` : "";
  const nextHash = `#${selectedMode}/${selectedRole.id}${docPart}`;
  if (window.location.hash === nextHash) return;
  const url = new URL(window.location.href);
  url.hash = nextHash;
  window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
}

function docsFor(role) {
  const root = `${base}/${role.folder}/${role.prefix}`;
  return {
    Resume: {
      pdf: `${root}_Resume.pdf`,
      docx: `${root}_Resume.docx`,
      md: `${root}_Resume.md`
    },
    "Cover Letter": {
      pdf: `${root}_Cover_Letter.pdf`,
      docx: `${root}_Cover_Letter.docx`,
      md: `${root}_Cover_Letter.md`
    },
    "30-60-90": {
      pdf: `${root}_30_60_90_Plan.pdf`,
      docx: `${root}_30_60_90_Plan.docx`,
      md: `${root}_30_60_90_Plan.md`
    }
  };
}

function artifactButton(label, href, kind = "PDF") {
  return `<a class="artifact-link" href="${href}" target="_blank" rel="noreferrer">${label} <span>${kind}</span></a>`;
}

function navButton(mode) {
  const active = selectedMode === mode.id;
  return `<button class="mode-button ${active ? "is-active" : ""}" data-mode="${mode.id}" type="button" ${active ? 'aria-current="step"' : ""}>${mode.label}</button>`;
}

function railPacketButtons(role = selectedRole) {
  const docs = docsFor(role);
  return `
    <div class="rail-pdf-actions" aria-label="OpenAI Fit packet PDFs">
      ${artifactButton("Resume", docs.Resume.pdf, "PDF")}
      ${artifactButton("Cover Letter", docs["Cover Letter"].pdf, "PDF")}
      ${artifactButton("30-60-90", docs["30-60-90"].pdf, "PDF")}
    </div>
  `;
}

function metricCard(metric) {
  return `
    <article class="metric-card">
      <div>
        <span>${presentationText(metric.label)}</span>
        <strong>${metric.value}</strong>
      </div>
      <p>${presentationText(metric.detail)}</p>
      <div class="bar"><i style="width:${Math.min(100, (metric.scale / metric.max) * 100)}%"></i></div>
    </article>
  `;
}

function linkCard(link) {
  return `
    <a class="link-card" href="${link.href}" target="_blank" rel="noreferrer">
      <span>${presentationText(link.label)}</span>
      <strong>${presentationText(link.handle)}</strong>
    </a>
  `;
}

function modeShortLabel(label) {
  return label.replace(/^\d+\s*/u, "");
}

function goToMode(modeId, scroll = true) {
  if (!modes.some((mode) => mode.id === modeId)) return;
  selectedMode = modeId;
  updateUrlState();
  render();
  if (scroll) window.scrollTo({ top: 0, behavior: "smooth" });
}

function documentNamesForSelectedRole() {
  return Object.keys(docsFor(selectedRole));
}

function documentAtOffset(offset) {
  const names = documentNamesForSelectedRole();
  const index = Math.max(0, names.indexOf(selectedDoc));
  return names[(index + offset + names.length) % names.length];
}

function focusDocumentTab(name) {
  window.requestAnimationFrame(() => {
    const nextTab = Array.from(document.querySelectorAll("[data-doc-tab]")).find((button) => button.dataset.doc === name);
    nextTab?.focus();
  });
}

function selectDocument(name, focusTab = false) {
  if (!documentNamesForSelectedRole().includes(name)) return;
  selectedDoc = name;
  updateUrlState();
  render();
  if (focusTab) focusDocumentTab(name);
}

function setFocusMode(nextFocusMode) {
  focusMode = Boolean(nextFocusMode);
  updateFocusModeUrl();
  render();
}

function updateFocusModeUrl() {
  const url = new URL(window.location.href);
  if (focusMode) {
    url.searchParams.set("focus", "1");
  } else {
    url.searchParams.delete("focus");
  }
  window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
}

function setMetaContent(selector, content) {
  const node = document.querySelector(selector);
  if (node) node.setAttribute("content", content);
}

function currentViewTitle(activeMode) {
  const parts = [modeShortLabel(activeMode.label)];
  if (isPacketMode()) parts.push(selectedDoc);
  parts.push(selectedRole.title);
  if (focusMode) parts.push("Focus");
  parts.push("Jonathan Yu");
  return parts.join(" | ");
}

function currentViewDescription(activeMode) {
  const docContext = isPacketMode() ? ` Active packet document: ${selectedDoc}.` : "";
  const focusContext = focusMode ? " Screen-share focus mode is active." : "";
  return `${activeMode.summary} Application focus: ${selectedRole.title}.${docContext}${focusContext}`;
}

function updateDocumentMetadata(activeMode) {
  const title = currentViewTitle(activeMode);
  const description = currentViewDescription(activeMode);
  document.title = title;
  setMetaContent('meta[name="description"]', description);
  setMetaContent('meta[property="og:title"]', title);
  setMetaContent('meta[property="og:description"]', description);
  setMetaContent('meta[name="twitter:title"]', title);
  setMetaContent('meta[name="twitter:description"]', description);
}

function credentialBadge(badge) {
  const content = `
    ${
      badge.img
        ? `<img src="${badge.img}" alt="${badge.label}" />`
        : `<span class="credential-mark" aria-hidden="true">${badge.initials}</span>`
    }
    <span>${badge.label}</span>
  `;

  if (badge.href) {
    return `<a class="credential-badge" href="${badge.href}" target="_blank" rel="noreferrer">${content}</a>`;
  }

  return `<div class="credential-badge">${content}</div>`;
}

function credentialListItem(item) {
  const label = presentationText(item);
  const href = certificationLinks.get(item);

  if (!href) {
    return `<li>${label}</li>`;
  }

  return `<li><a class="credential-text-link" href="${href}" target="_blank" rel="noreferrer">${label}</a></li>`;
}

function youtubeEmbedUrl(videoId) {
  return `https://www.youtube.com/embed/${videoId}`;
}

function episodeEmbedUrl(episode) {
  if (episode.videoSrc) return episode.videoSrc;
  return episode.embedUrl || youtubeEmbedUrl(episode.youtubeId);
}

function projectCaseStudyCard(study, index) {
  const reviewRows = [
    { label: "Process", value: study.process },
    { label: "Output", value: study.output },
    { label: "Validation", value: study.validation },
    { label: "Limitations", value: study.limitations },
    { label: "Role relevance", value: study.roleRelevance }
  ].filter((row) => row.value);

  return `
    <article class="case-study-card">
      <div class="case-study-number">${String(index + 1).padStart(2, "0")}</div>
      <div class="case-study-main">
        <span>${presentationText(study.signal)}</span>
        <h4>${study.title}</h4>
        <p>${presentationText(study.problem)}</p>
        <div class="case-study-columns">
          <div>
            <b>Build</b>
            <ul>${study.build.map((item) => `<li>${presentationText(item)}</li>`).join("")}</ul>
          </div>
          <div>
            <b>Evidence</b>
            <div class="case-study-evidence">${study.evidence.map((item) => `<em>${presentationText(item)}</em>`).join("")}</div>
          </div>
        </div>
        <div class="case-study-review">
          ${reviewRows
            .map(
              (row) => `
                <div>
                  <b>${presentationText(row.label)}</b>
                  <p>${presentationText(row.value)}</p>
                </div>
              `
            )
            .join("")}
        </div>
        <div class="case-study-ownership">
          <div>
            <b>What AI did</b>
            <p>${presentationText(study.aiDid)}</p>
          </div>
          <div>
            <b>What Jonathan decided</b>
            <p>${presentationText(study.jonathanDecided)}</p>
          </div>
        </div>
        <footer>
          <b>Interview use</b>
          <p>${presentationText(study.interviewUse)}</p>
        </footer>
      </div>
    </article>
  `;
}

function proofMatrixRows(role) {
  const docs = docsFor(role);
  return [
    {
      label: "Adoption platform",
      artifact: "Sipopedia / Codex Projects",
      image: "/assets/header/codex-projects-hero.png",
      focus: "Inspectable product surfaces for learning, terminology, workflow design, paid access, and customer education.",
      proof: ["AI-assisted product building", "Workflow translation", "Source-backed project detail"],
      href: "#projects/ai-success",
      action: "View Portfolio",
      kind: "PORTFOLIO"
    },
    {
      label: "Client implementation",
      artifact: "Rose Quartz Massage",
      image: "/repo-previews/rose-quartz/assets/rose-sanctuary-hero-C4LbQw8N.jpg",
      focus: "A client-ready website with booking, intake, service positioning, launch documentation, and trust-building UX.",
      proof: ["Client experience", "Booking workflow", "Launch readiness"],
      href: "/repo-previews/rose-quartz/index.html",
      action: "Open Preview",
      kind: "SITE"
    },
    {
      label: "Operating proof",
      artifact: "Critical On Hand",
      image: "/assets/header/resume-still-life.png",
      focus: "Account workflows, inventory gaps, incentives, KPI baselines, and weekly decisions translated into action.",
      proof: ["Customer workflow mapping", "KPI framing", "Value evidence"],
      href: docs.Resume.pdf,
      action: "Open Resume",
      kind: "PDF"
    },
    {
      label: "First-quarter plan",
      artifact: "30-60-90 Adoption Plan",
      image: "/assets/header/hiring-close-hero.png",
      focus: "A concrete path from discovery to workflow maps, enablement assets, readiness reviews, and value reporting.",
      proof: ["Discovery", "Technical readiness", "Value realization"],
      href: docs["30-60-90"].pdf,
      action: "Open Plan",
      kind: "PDF"
    }
  ];
}

function proofMatrixCard(row, index) {
  return `
    <article class="proof-matrix-card">
      <a class="proof-card-image" href="${row.href}" ${row.href.startsWith("#") ? "" : 'target="_blank" rel="noreferrer"'} aria-label="${attributeText(row.action)}: ${attributeText(row.artifact)}">
        <img src="${row.image}" alt="${attributeText(row.artifact)} preview" loading="lazy" />
      </a>
      <div class="proof-card-body">
        <span>${String(index + 1).padStart(2, "0")} ${presentationText(row.label)}</span>
        <h4>${presentationText(row.artifact)}</h4>
        <p>${presentationText(row.focus)}</p>
        <div class="proof-card-tags">${row.proof.map((item) => `<em>${presentationText(item)}</em>`).join("")}</div>
        <a class="matrix-action" href="${row.href}" ${row.href.startsWith("#") ? "" : 'target="_blank" rel="noreferrer"'}>${presentationText(row.action)} <small>${row.kind}</small></a>
      </div>
    </article>
  `;
}

function renderProofMatrix() {
  const rows = proofMatrixRows(selectedRole);

  return `
    <section class="proof-matrix" aria-label="Evidence map">
      <div class="proof-matrix-head">
        <div>
          <p class="eyebrow">Proof path</p>
          <h3>Four proof surfaces make the fit inspectable.</h3>
        </div>
        <p>Open the work behind the claim: product systems, client implementation, operating evidence, and a first-quarter adoption plan.</p>
      </div>
      <div class="proof-matrix-grid">
        ${rows.map(proofMatrixCard).join("")}
      </div>
    </section>
  `;
}

function selectedDocumentSummary(name) {
  const summaries = {
    Resume: "The concise application resume: source-backed experience, credentials, adoption metrics, and project evidence.",
    "Cover Letter": "The transition story: why customer adoption, product fluency, and education make this role coherent.",
    "30-60-90": "A first-quarter operating plan for discovery, workflow mapping, readiness reviews, and value reporting."
  };

  return summaries[name] || summaries.Resume;
}

function renderSelectedDocumentPanel(name, doc) {
  return `
    <article
      class="selected-document-panel"
      id="${selectedDocumentPanelId}"
      role="tabpanel"
      aria-labelledby="${docTabId(name)}"
      tabindex="0"
    >
      <p class="eyebrow">Active packet artifact</p>
      <h3>${presentationText(name)}</h3>
      <p>${presentationText(selectedDocumentSummary(name))}</p>
      <div>
        ${artifactButton("Open PDF", doc.pdf, "PDF")}
        ${artifactButton("Open Word", doc.docx, "DOCX")}
        ${artifactButton("Open Markdown", doc.md, "MD")}
      </div>
    </article>
  `;
}

function mediaEpisodeCard(episode) {
  const linkLabel = episode.linkLabel || (episode.videoSrc ? "Open video file" : "Open on YouTube");
  const linkKind = episode.linkKind || (episode.videoSrc ? "VIDEO FILE" : "VIDEO");
  const href = episode.href || episode.videoSrc || episode.youtubeUrl;
  const frame = episode.frame || "video";
  const embedSrc = episodeEmbedUrl(episode);
  const loadLabel = frame === "instagram" ? "Load reel" : "Load video";
  const thumbStyle = episode.thumbnail ? ` style="--episode-thumb:url('${episode.thumbnail}')"` : "";
  const previewMedia = frame === "video-file"
    ? `<video class="episode-preview-video" data-episode-preview src="${attributeText(embedSrc)}#t=0.1" muted preload="metadata" playsinline aria-hidden="true" tabindex="-1"></video>`
    : "";
  const bodyCopy = frame === "instagram" || frame === "video-file"
    ? `
        <div class="episode-takeaway">
          <span>Portfolio takeaway</span>
          <p>${episode.summary}</p>
        </div>
      `
    : `<p>${episode.summary}</p>`;

  return `
    <article class="episode-card episode-card--${frame}">
      <div class="episode-player episode-player--${frame}"${thumbStyle} data-episode-player>
        ${previewMedia}
        <button
          class="episode-load-button"
          data-episode-load
          data-episode-src="${attributeText(embedSrc)}"
          data-episode-title="${attributeText(episode.title)}"
          data-episode-frame="${frame}"
          type="button"
          aria-label="${loadLabel} for ${attributeText(episode.title)}"
        >
          <span>${loadLabel}</span>
        </button>
      </div>
      <div class="episode-body">
        <div class="episode-kicker">
          <span>${episode.label}</span>
          <em>${episode.publishedAt}</em>
        </div>
        <h3>${episode.title}</h3>
        ${bodyCopy}
        <div class="episode-meta">
          <span>${episode.episodeLabel}</span>
          <span>${episode.theme}</span>
          ${episode.duration ? `<span>${episode.duration}</span>` : ""}
        </div>
        <a class="artifact-link" href="${href}" target="_blank" rel="noreferrer">${linkLabel} <span>${linkKind}</span></a>
      </div>
    </article>
  `;
}

function articleCard(article, sourceTitle) {
  return `
    <article class="article-card">
      <a class="article-thumb" href="${article.href}" target="_blank" rel="noreferrer" aria-label="Open ${article.title}">
        <img src="${article.thumbnail}" alt="${article.title}" loading="lazy" referrerpolicy="no-referrer" />
      </a>
      <div class="article-body">
        <div class="episode-kicker">
          <span>${sourceTitle}</span>
          <em>${article.publishedAt}</em>
        </div>
        <h4>${article.title}</h4>
        <p>${article.summary}</p>
        <a class="artifact-link" href="${article.href}" target="_blank" rel="noreferrer">Read article <span>POST</span></a>
      </div>
    </article>
  `;
}

function articleCollection(collection) {
  return `
    <section class="article-collection" aria-label="${collection.title} latest articles">
      <div class="article-collection-head">
        <div>
          <p class="eyebrow">Flavor Blog tab</p>
          <h3>${collection.title}</h3>
          <p>${collection.sourceNote}</p>
        </div>
        <a class="artifact-link" href="${collection.href}" target="_blank" rel="noreferrer">Open source <span>${collection.items.length} POSTS</span></a>
      </div>
      <div class="article-grid">
        ${collection.items.map((item) => articleCard(item, collection.title)).join("")}
      </div>
    </section>
  `;
}

function repoWebsiteActions(site) {
  const repoLink = site.repoHref ? artifactButton(site.repoActionLabel || "Open GitHub repo", site.repoHref, site.repoKind || "GITHUB") : "";
  return `
    <div class="website-preview-actions">
      ${site.siteHref ? artifactButton("Open site", site.siteHref, "SITE") : ""}
      ${repoLink}
    </div>
  `;
}

function repoWebsiteProjectDetail(site) {
  const project = codexProjects.find((item) => item.title === site.projectTitle);
  if (!project) return "";

  return `
    <div class="website-project-detail">
      <span>${presentationText(project.type)}</span>
      <p>${presentationText(project.body)}</p>
      <ul>${project.proof.map((item) => `<li>${presentationText(item)}</li>`).join("")}</ul>
      <div class="project-bridge">
        <b>Role bridge for ${selectedRole.title}</b>
        <p>${presentationText(project.bridge)}</p>
      </div>
      <footer>${presentationText(project.path)}</footer>
    </div>
  `;
}

function repoWebsiteFrame(site) {
  if (!site.previewHref) {
    return `
      <div class="website-preview-screen website-preview-screen--linked">
        <div class="website-browser-bar" aria-hidden="true">
          <i></i><i></i><i></i>
          <strong>${presentationText(site.repo)}</strong>
        </div>
        <div class="website-preview-placeholder">
          <span>${presentationText(site.status)}</span>
          <p>${presentationText(site.summary)}</p>
        </div>
      </div>
    `;
  }

  const iframeLoading = site.previewHref.startsWith("/") ? "eager" : "lazy";

  return `
    <div class="website-preview-screen" data-website-preview>
      <div class="website-browser-bar">
        <i aria-hidden="true"></i><i aria-hidden="true"></i><i aria-hidden="true"></i>
        <strong>${presentationText(site.siteHref)}</strong>
        <button
          class="website-screen-button"
          data-preview-fullscreen
          data-preview-href="${site.siteHref}"
          type="button"
          aria-pressed="false"
          aria-label="View ${presentationText(site.title)} preview full screen"
        >Full screen</button>
      </div>
      <iframe
        title="${presentationText(site.title)} interactive website preview"
        src="${site.previewHref}"
        loading="${iframeLoading}"
        referrerpolicy="no-referrer-when-downgrade"
        allow="clipboard-write; fullscreen; web-share"
        allowfullscreen
      ></iframe>
    </div>
  `;
}

function repoWebsitePreviewCard(site) {
  return `
    <article class="website-preview-card">
      ${repoWebsiteFrame(site)}
      <div class="website-preview-body">
        <span>${presentationText(site.label)}</span>
        <h4>${presentationText(site.title)}</h4>
        <p>${presentationText(site.summary)}</p>
        <div class="website-preview-status">${presentationText(site.status)}</div>
        <ul>${site.proof.map((item) => `<li>${presentationText(item)}</li>`).join("")}</ul>
        ${repoWebsiteProjectDetail(site)}
        ${repoWebsiteActions(site)}
      </div>
    </article>
  `;
}

function renderRepoWebsitePreviews() {
  return `
    <section class="website-preview-board" aria-label="Codex project website previews">
      <div class="website-preview-head">
        <div>
          <p class="eyebrow">Codex Projects</p>
          <h3>Let recruiters interact with shipped web surfaces and read the build proof in one place.</h3>
          <p>Each project keeps the Sipopedia-style screen-in-screen layout, then folds in the Codex project detail, role bridge, proof points, fullscreen control, and direct launch links.</p>
        </div>
        <a class="artifact-link" href="https://github.com/Sip-Coder" target="_blank" rel="noreferrer">Open GitHub profile <span>REPOS</span></a>
      </div>
      <div class="website-preview-grid">
        ${repoWebsitePreviews.map(repoWebsitePreviewCard).join("")}
      </div>
    </section>
  `;
}

function presentationText(value = "") {
  return value
    .replace(/\bthis demo\b/gi, "this walkthrough")
    .replace(/\bthe demo\b/gi, "the walkthrough")
    .replace(/\bthis console\b/gi, "this walkthrough")
    .replace(/\bthe console\b/gi, "the walkthrough")
    .replace(/\blive pivot console\b/gi, "live role walkthrough")
    .replace(/\bcampus adoption console\b/gi, "campus adoption presentation")
    .replace(/\blive role switcher\b/gi, "position-focus selector")
    .replace(/\bdemo library\b/gi, "example library")
    .replace(/\btechnical demos\b/gi, "technical walkthroughs")
    .replace(/\bdemos\b/gi, "working examples")
    .replace(/\bDemo move\b/g, "Presentation move")
    .replace(/\bdemo move\b/g, "presentation move")
    .replace(/\bconsole\b/gi, "walkthrough")
    .replace(/\bpositioning system\b/gi, "positioning story")
    .replace(/\bteach the system\b/gi, "teach the workflow")
    .replace(/\bterminology system\b/gi, "terminology library")
    .replace(/\bterminology systems\b/gi, "terminology workflows")
    .replace(/\blearning systems\b/gi, "learning experiences")
    .replace(/\beducation systems\b/gi, "learning products")
    .replace(/\bplatform systems\b/gi, "platform work")
    .replace(/\btechnical product systems\b/gi, "technical product work")
    .replace(/\btechnical systems\b/gi, "technical material")
    .replace(/\bAI beverage\/content systems\b/gi, "AI beverage/content products")
    .replace(/\bcontent systems\b/gi, "content products")
    .replace(/\bproduct systems\b/gi, "product work")
    .replace(/\bworking systems\b/gi, "working products")
    .replace(/\breusable systems\b/gi, "reusable playbooks")
    .replace(/\bbrand systems\b/gi, "brand language")
    .replace(/\bvisual systems\b/gi, "visual language")
    .replace(/\bsystems-thinking\b/gi, "structured-thinking")
    .replace(/\bdemo\b/g, "presentation")
    .replace(/\bDemo\b/g, "Presentation");
}

function attributeText(value = "") {
  return presentationText(String(value))
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function resumeRoleBridge(job) {
  const company = `${job.company} ${job.role}`.toLowerCase();
  const roleName = selectedRole.title;

  if (company.includes("sip studies")) {
    return {
      label: "Product-builder proof",
      body: `For ${roleName}, this is the central proof: Jonathan turned a domain he knows deeply into an AI-enabled product, public learning surface, terminology workflow, media engine, and paid-access platform.`
    };
  }

  if (company.includes("breakthru")) {
    return {
      label: "Business workflow proof",
      body: `For ${roleName}, Breakthru shows the operational side: account discovery, messy data, sales movement, incentive priorities, stakeholder conversations, and measurable field execution.`
    };
  }

  if (company.includes("aarp")) {
    return {
      label: "Teaching proof",
      body: `For ${roleName}, AARP shows live education range: Jonathan can explain complex material clearly, hold audience trust, and turn expertise into repeatable learning sessions.`
    };
  }

  if (company.includes("on location")) {
    return {
      label: "Client trust proof",
      body: `For ${roleName}, On Location shows composure with premium guests, live expectations, changing conditions, and high-touch service moments where clarity matters.`
    };
  }

  if (company.includes("video tech")) {
    return {
      label: "Execution proof",
      body: `For ${roleName}, live production shows technical coordination under pressure, room awareness, setup discipline, and the ability to support teams during visible events.`
    };
  }

  if (company.includes("total wine")) {
    return {
      label: "Customer education proof",
      body: `For ${roleName}, Total Wine shows the early bridge between premium sales, curriculum writing, staff training, customer advising, and practical learning design.`
    };
  }

  if (company.includes("architecture") || company.includes("autocad")) {
    return {
      label: "Design documentation proof",
      body: `For ${roleName}, the architecture foundation explains the visual, spatial, documentation, and structured-thinking habits behind the portfolio work.`
    };
  }

  return {
    label: "Transferable proof",
    body: `For ${roleName}, this experience adds another angle to the same story: translate a real environment, serve the audience, and produce useful artifacts.`
  };
}

function resumeLensCards() {
  return [
    {
      label: "Read for",
      title: "The pivot",
      body: selectedRole.headline
    },
    {
      label: "Pause on",
      title: "The strongest proof",
      body: selectedRole.strengths?.[0] || selectedRole.fit
    },
    {
      label: "Connect to",
      title: "Portfolio evidence",
      body: selectedRole.proof?.[0] || selectedRole.fit
    },
    {
      label: "Ask next",
      title: "Interview handoff",
      body: selectedRole.talkTrack || selectedRole.planTheme
    }
  ];
}

function renderResumeLensPanel() {
  return `
    <section class="resume-lens-panel" aria-label="Role-specific resume reading guide">
      <div>
        <p class="eyebrow">Presenter lens</p>
        <h3>Read the resume through the ${selectedRole.title} conversation.</h3>
        <p>This panel keeps the resume from becoming a static archive. It tells the viewer what to notice before moving into the portfolio and OpenAI Fit.</p>
      </div>
      <div class="resume-lens-grid">
        ${resumeLensCards()
          .map(
            (card) => `
              <article class="resume-lens-card">
                <span>${card.label}</span>
                <strong>${card.title}</strong>
                <p>${presentationText(card.body)}</p>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderCommercialExecutionProof() {
  return `
    <section class="commercial-execution-proof" aria-label="Commercial execution proof photo">
      <figure class="commercial-execution-frame">
        <img src="/assets/openai-fit/commercial-execution-seagrams-display.jpg" alt="Jonathan Yu on a large Seagram's vodka retail display in a beverage store" loading="lazy" />
        <figcaption>350-case Seagram's vodka display, retail execution proof from beverage sales work.</figcaption>
      </figure>
      <div class="commercial-execution-copy">
        <p class="eyebrow">Commercial execution proof</p>
        <h3>350 cases, field execution, customer context.</h3>
        <p>A 350-case vodka display shows the account-side work behind adoption: coordinating supplier priorities, retail execution, field teams, and measurable market movement.</p>
        <div class="commercial-execution-tags" aria-label="Commercial execution context">
          <span>350 cases</span>
          <span>Retail execution</span>
          <span>Display strategy</span>
          <span>Supplier coordination</span>
          <span>Market scale</span>
        </div>
      </div>
    </section>
  `;
}

function renderResumeProofDetails() {
  return `
    <section class="resume-proof-details" aria-label="Resume proof details">
      <div class="resume-proof-details-head">
        <p class="eyebrow">Resume proof detail</p>
        <h3>The headline metrics, with the evidence kept below the fold.</h3>
        <p>The hero keeps the quick scan. These cards preserve the fuller context for reviewers who want to inspect the commercial lift, AI adoption timeline, platform build, and credential base.</p>
      </div>
      <div class="resume-proof-detail-grid">
        ${resumeProofMetrics()
          .map(
            (metric) => `
              <article class="resume-proof-detail-card">
                <div>
                  <span>${presentationText(metric.label)}</span>
                  <strong>${metric.value}</strong>
                </div>
                <p>${presentationText(metric.detail)}</p>
                <ul>
                  ${metric.items.map((item) => `<li>${presentationText(item)}</li>`).join("")}
                </ul>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function resumeDetailCards() {
  const experienceHighlights = resume.experience
    .map((job) => job.bullets?.[0])
    .filter(Boolean)
    .slice(0, 4);
  const marketScale = [
    "$2.291M wine revenue lift within Lee's Liquor",
    "3,500+ placements expanded through Breakthru Beverage work",
    "20,000 Sipopedia candidate rows with review/source metadata",
    "69 Supabase migrations + 5 Edge Functions in the Sip Studies platform"
  ];

  return [
    {
      title: "Profile",
      body: selectedRole.resumeSummary,
      items: selectedRole.strengths?.slice(0, 3) || []
    },
    {
      title: "Experience",
      body: "Experience is framed around customer adoption, technical enablement, account analytics, education, and product implementation.",
      items: experienceHighlights
    },
    {
      title: "Certifications",
      body: "The credential stack shows repeated yearly growth, disciplined study, and credibility in a complex knowledge domain.",
      items: resume.certs
    },
    {
      title: "Skills",
      body: "Skills are selected for AI Success work: workflow mapping, use-case validation, KPI baselines, technical enablement, and stakeholder communication.",
      items: selectedRole.skills?.slice(0, 6) || resume.skills.slice(0, 6)
    },
    {
      title: "Highlights",
      body: "Top proof points connect each role to OpenAI's customer adoption, technical readiness, and value-realization needs.",
      items: selectedRole.proof?.slice(0, 4) || []
    },
    {
      title: "Market Scale",
      body: "Scale points show that the work has moved real audiences, data, revenue, learning assets, and production-minded systems.",
      items: marketScale
    },
    {
      title: "Focus + Edu",
      body: "The market advantage is the combination of AI product fluency, adult education, formal beverage credentials, architecture/design training, and customer-facing execution.",
      items: [
        resume.education,
        "MIT AI Strategy plus wine, spirits, sake, beer, and sommelier credentials",
        "AARP Wine Walk Wednesdays taught 50+ active adults through live and recorded sessions across all 50 states"
      ]
    }
  ];
}

function renderResumeDetailsDeck() {
  return `
    <section class="resume-details-deck" aria-label="AI Success resume format details">
      <div class="resume-details-head">
        <p class="eyebrow">Resume details</p>
        <h3>Format the resume around the AI Success hiring question.</h3>
        <p>These cards translate the source resume into the exact review pattern for this application: profile, experience, certifications, skills, highlights, market scale, and focus plus education.</p>
      </div>
      <div class="resume-details-grid">
        ${resumeDetailCards()
          .map(
            (card) => `
              <article class="resume-detail-card">
                <span>${presentationText(card.title)}</span>
                <p>${presentationText(card.body)}</p>
                <ul>${card.items.map(credentialListItem).join("")}</ul>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function companyMark(job) {
  const initials = job.company
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("");
  const logo = job.logo ? { src: job.logo, tone: job.logoTone } : customCompanyLogos.get(job.company);

  if (logo?.src) {
    const toneClass = logo.tone === "dark" ? " is-dark" : "";
    return `
      <span class="job-logo-wrap">
        <img class="job-logo${toneClass}" src="${logo.src}" alt="${job.company} logo" onerror="this.hidden=true;this.nextElementSibling.hidden=false" />
        <span class="company-emblem job-logo-fallback" hidden aria-hidden="true">${initials}</span>
      </span>
    `;
  }

  return `<span class="company-emblem" aria-hidden="true">${initials}</span>`;
}

function jobLinks(job) {
  if (!job.links?.length) return "";
  return `<div class="job-links">${job.links.map(linkCard).join("")}</div>`;
}

function renderHero(title, subtitle, image = heroImages.resume, metricItems = heroMetricsFor(selectedMode)) {
  const heroClass = metricItems.length ? "parallax-hero has-metrics" : "parallax-hero";
  const metricsMarkup = metricItems.length
    ? `
      <div class="hero-metrics" data-parallax-depth="0.02">
        ${metricItems.map(metricCard).join("")}
      </div>
    `
    : "";

  return `
    <section class="${heroClass}" style="--hero-image:url('${image}')">
      <div class="hero-image" data-parallax-depth="-0.08"></div>
      <div class="hero-copy" data-parallax-depth="0.04">
        <p class="eyebrow">${modeEyebrows[selectedMode] || "Application proof"}</p>
        <h2>${title}</h2>
        <p>${subtitle}</p>
      </div>
      ${metricsMarkup}
    </section>
  `;
}

function renderAiSuccessSourceCheck() {
  return `
    <section class="source-check-panel" aria-label="AI Success Engineer source facts">
      <div>
        <p class="eyebrow">Fact-checked role source</p>
        <h3>${aiSuccessPostingFacts.title}</h3>
        <p>Verified against the live OpenAI careers page on ${aiSuccessPostingFacts.verifiedDate}. The ask is post-sales ownership, workflow mapping, technical readiness, adoption velocity, KPIs, and measurable customer value.</p>
        <a class="artifact-link" href="${aiSuccessPostingFacts.sourceUrl}" target="_blank" rel="noreferrer">Open posting <span>OPENAI</span></a>
      </div>
      <div class="source-facts-grid">
        <span><b>Team</b>${aiSuccessPostingFacts.roleTeam}</span>
        <span><b>Location</b>${aiSuccessPostingFacts.roleLocation}</span>
        <span><b>Compensation</b>${aiSuccessPostingFacts.payRange}</span>
      </div>
      <div class="source-facts-list">
        <b>What the posting asks to see</b>
        <ul>${aiSuccessPostingFacts.successSignals.map((item) => `<li>${presentationText(item)}</li>`).join("")}</ul>
        <div>${["Post-sales ownership", "Workflow mapping", "Technical readiness", "KPI/value proof"].map((item) => `<em>${presentationText(item)}</em>`).join("")}</div>
      </div>
    </section>
  `;
}

function renderParameterGolfPattern() {
  return `
    <section class="source-check-panel parameter-golf-panel" aria-label="OpenAI-style reviewable project pattern">
      <div>
        <p class="eyebrow">${parameterGolfReviewPattern.title}</p>
        <h3>Make projects reviewable like constrained OpenAI submissions.</h3>
        <p>${presentationText(parameterGolfReviewPattern.body)}</p>
        <a class="artifact-link" href="${parameterGolfReviewPattern.sourceUrl}" target="_blank" rel="noreferrer">Open Parameter Golf repo <span>GITHUB</span></a>
        <a class="artifact-link" href="${parameterGolfReviewPattern.articleUrl}" target="_blank" rel="noreferrer">OpenAI writeup <span>OPENAI</span></a>
      </div>
      <div class="source-facts-list">
        <b>Portable review pattern</b>
        <ul>${parameterGolfReviewPattern.steps.map((item) => `<li>${presentationText(item)}</li>`).join("")}</ul>
        <div>${reviewableProjectStandard.map((item) => `<em>${presentationText(item)}</em>`).join("")}</div>
      </div>
    </section>
  `;
}

function renderPacketPdfRail(role = selectedRole) {
  const docs = docsFor(role);
  return `
    <section class="packet-pdf-rail" aria-label="Downloadable application packet PDFs">
      <div>
        <p class="eyebrow">OpenAI Fit packet</p>
        <h3>Three documents stay together here.</h3>
        <p>The resume, cover letter, and first-quarter plan belong in the Fit view because they close the role-specific argument instead of repeating across every tab.</p>
      </div>
      <div class="doc-actions">
        ${artifactButton("Resume", docs.Resume.pdf, "PDF")}
        ${artifactButton("Cover Letter", docs["Cover Letter"].pdf, "PDF")}
        ${artifactButton("30-60-90", docs["30-60-90"].pdf, "PDF")}
      </div>
    </section>
  `;
}

function renderPortfolioMediaProof() {
  const teachingLinks = [
    { label: "AARP Wine Walk Wednesdays", handle: "adult education proof", href: "https://www.youtube.com/@jonyu836/videos" },
    { label: "Sippy's Beverage Blog", handle: "podcast/audio proof", href: "https://open.spotify.com/show/1p8kpZbP02yeEx5bM2xg1e" },
    { label: "Sip Studies Instagram", handle: "public media proof", href: "https://www.instagram.com/sip.studies/" },
    { label: "Flavor Blog", handle: "writing/publishing proof", href: "https://sipopedia.com/#app/flavor-blog" }
  ];

  return `
    <section class="portfolio-media-proof" aria-label="ChatGPT and Dall-e portfolio proof">
      <div>
        <p class="eyebrow">ChatGPT & Dall-e Projects</p>
        <h3>Public media proof for AI-assisted education, storytelling, and adoption work.</h3>
        <p>These channels show the same operating pattern from the product work: turn ambiguous material into useful, reviewable outputs that an audience can understand quickly.</p>
      </div>
      <div class="link-grid">${teachingLinks.map(linkCard).join("")}</div>
    </section>
  `;
}

function renderSoraProjects() {
  return `
    <section class="media-showcase media-showcase--sora" aria-label="Sora Projects">
      <div>
        <p class="eyebrow">Sora Projects</p>
        <h3>Visual-generation projects sit between Codex builds and ChatGPT/Dall-e media proof.</h3>
        <p>Four Sora project videos are reserved here as a focused visual proof set, using the same playable card pattern as the reel sections once the media is ready.</p>
      </div>
    </section>
    ${
      soraProjectVideos.length
        ? `<section class="episode-grid episode-grid--instagram episode-grid--video-row" aria-label="Sora project videos">
            ${soraProjectVideos.map(mediaEpisodeCard).join("")}
          </section>`
        : ""
    }
  `;
}

function referenceArtifactAction(artifact) {
  if (!artifact.href) {
    return `<span class="reference-state">${presentationText(artifact.status)}</span>`;
  }

  const actionLabel = artifact.type === "Index" ? "Open source index" : "Open reference";
  return `<a class="artifact-link reference-artifact-action" href="${artifact.href}" target="_blank" rel="noreferrer">${actionLabel} <span>${presentationText(artifact.type)}</span></a>`;
}

function referenceArtifactFullscreenAction(artifact) {
  if (!artifact.href || artifact.type !== "PDF") return "";

  return `
    <button class="reference-toolbar-button reference-fullscreen-action" type="button" data-reference-fullscreen data-reference-href="${artifact.href}" aria-pressed="false">
      Full screen <span>PDF</span>
    </button>
  `;
}

function referenceArtifactDownloadAction(artifact) {
  if (!artifact.href || artifact.type !== "PDF") return "";

  return `
    <a class="reference-toolbar-button reference-download-action" href="${artifact.href}" download target="_blank" rel="noreferrer">
      Download <span>PDF</span>
    </a>
  `;
}

function referenceArtifactPreviewToolbar(artifact) {
  return `
    <div class="reference-preview-toolbar" aria-label="PDF preview controls">
      <div class="reference-preview-status">
        <span class="reference-page-indicator" data-reference-page-indicator>1-2 / 2</span>
      </div>
      <div class="reference-preview-controls">
        <button class="reference-toolbar-button reference-preview-mode" type="button" data-reference-layout="two" aria-pressed="true">Two page view</button>
        <div class="reference-zoom-controls" aria-label="PDF zoom controls">
          <button class="reference-toolbar-button reference-zoom-button" type="button" data-reference-zoom="out" data-reference-href="${artifact.href}" aria-label="Zoom out">-</button>
          <span class="reference-toolbar-button reference-zoom-level" data-reference-zoom-label>100%</span>
          <button class="reference-toolbar-button reference-zoom-button" type="button" data-reference-zoom="in" data-reference-href="${artifact.href}" aria-label="Zoom in">+</button>
        </div>
        ${referenceArtifactDownloadAction(artifact)}
        ${referenceArtifactFullscreenAction(artifact)}
      </div>
    </div>
  `;
}

function referenceArtifactPreview(artifact) {
  if (artifact.href && artifact.type === "PDF") {
    return `
      ${referenceArtifactPreviewToolbar(artifact)}
      <div class="reference-preview" data-reference-pdf-viewer data-reference-pdf-src="${attributeText(artifact.href)}" data-reference-zoom-level="100" data-reference-layout="two" role="region" aria-label="${attributeText(`${artifact.title} preview`)}">
        <div class="reference-render-status" data-reference-render-status>Loading PDF preview...</div>
        <div class="reference-render-pages" data-reference-pages></div>
      </div>
    `;
  }

  if (artifact.body) {
    return `<blockquote class="reference-email">${presentationText(artifact.body)}</blockquote>`;
  }

  return `<div class="reference-empty">${presentationText(artifact.status)}</div>`;
}

function renderReferenceCard(artifact) {
  return `
    <article class="reference-card">
      <div class="reference-card-head">
        <span>${presentationText(artifact.type)}</span>
        <strong>${presentationText(artifact.status)}</strong>
      </div>
      <h3>${presentationText(artifact.title)}</h3>
      <p>${presentationText(artifact.summary)}</p>
      <div class="reference-preview-wrap" ${artifact.href && artifact.type === "PDF" ? 'data-reference-preview' : ""}>
        ${referenceArtifactPreview(artifact)}
      </div>
      <div class="reference-evidence">
        ${artifact.evidence.map((item) => `<em>${presentationText(item)}</em>`).join("")}
      </div>
      <footer>
        <b>${presentationText(artifact.source)}</b>
        <div class="reference-actions">
          ${referenceArtifactAction(artifact)}
        </div>
      </footer>
    </article>
  `;
}

function renderReferences() {
  return `
    ${renderHero("References", "A controlled place for PDFs, emails, and source notes when reviewers ask for third-party confirmation.", heroImages.references)}
    <section class="references-board" aria-label="Reference artifacts">
      <div class="reference-grid">
        ${referenceArtifacts.map(renderReferenceCard).join("")}
      </div>
    </section>
  `;
}

function renderRoleFit() {
  const docs = docsFor(selectedRole);
  const activeDoc = docs[selectedDoc];

  return `
    ${renderHero("OpenAI Fit", "A reviewer-facing case for AI Success: source facts, inspectable work, commercial execution, and the packet close.", heroImages.fit)}
    ${renderAiSuccessSourceCheck()}
    ${renderPacketPdfRail(selectedRole)}
    ${renderProofMatrix()}
    ${renderCommercialExecutionProof()}
    <section class="document-strip document-strip--fit" aria-label="Role packet documents">
      <div class="doc-tabs" role="tablist" aria-label="Role packet documents">
        ${Object.keys(docs)
          .map((name) => {
            const isActive = name === selectedDoc;
            return `
              <button
                class="doc-tab ${isActive ? "is-active" : ""}"
                id="${docTabId(name)}"
                data-doc="${name}"
                data-doc-tab
                type="button"
                role="tab"
                aria-selected="${isActive ? "true" : "false"}"
                aria-controls="${selectedDocumentPanelId}"
                tabindex="${isActive ? "0" : "-1"}"
              >
                ${name}
              </button>
            `;
          })
          .join("")}
      </div>
      <div class="doc-actions">
        ${artifactButton("Open PDF", activeDoc.pdf, "PDF")}
        ${artifactButton("Open Word", activeDoc.docx, "DOCX")}
        ${artifactButton("Open Markdown", activeDoc.md, "MD")}
      </div>
    </section>
    <section class="fit-packet-grid">
      ${renderSelectedDocumentPanel(selectedDoc, activeDoc)}
      <div class="proof-stack">
        <h3>Fit evidence at a glance</h3>
        <ul>${selectedRole.proof.map((item) => `<li>${presentationText(item)}</li>`).join("")}</ul>
      </div>
    </section>
  `;
}

function renderFullResume() {
  return `
    ${renderHero("Resume evidence", "The career record behind the application: commercial lift, credentials, customer work, and the source-backed chronology.", heroImages.resume)}
    <section class="resume-head">
      <div>
        <p class="eyebrow">Resume record</p>
        <h2>${resume.name}</h2>
        <strong>${resume.headline}</strong>
        <p>${resume.contact}</p>
      </div>
    </section>
    ${renderResumeDetailsDeck()}
    ${renderResumeProofDetails()}
    ${renderResumeLensPanel()}
    <section class="resume-grid">
      <aside class="resume-sidebar">
        <h3>Profile</h3>
        ${resume.profile.map((item) => `<p>${presentationText(item)}</p>`).join("")}
        <h3>Public Channels</h3>
        <div class="link-grid compact">${publicLinks.map(linkCard).join("")}</div>
        <h3>Credentials</h3>
        <div class="credential-grid">${credentialBadges.map(credentialBadge).join("")}</div>
        <ul>${resume.certs.map(credentialListItem).join("")}</ul>
        <h3>Skills</h3>
        <div class="tag-cloud">${resume.skills.map((item) => `<span>${presentationText(item)}</span>`).join("")}</div>
      </aside>
      <section class="resume-story">
        ${resume.experience
          .map(
            (job, index) => `
              <article class="timeline-item" style="--delay:${index}">
                <div class="timeline-marker">${String(index + 1).padStart(2, "0")}</div>
                <div>
                  <div class="job-head">
                    ${companyMark(job)}
                    <div>
                      <span>${job.dates}</span>
                      <h3>${job.company}</h3>
                    </div>
                  </div>
                  <strong>${presentationText(job.role)}</strong>
                  ${jobLinks(job)}
                  <ul>${job.bullets.map((bullet) => `<li>${presentationText(bullet)}</li>`).join("")}</ul>
                  ${(() => {
                    const bridge = resumeRoleBridge(job);
                    return `
                      <div class="resume-role-bridge">
                        <span>${bridge.label}</span>
                        <p>${presentationText(bridge.body)}</p>
                      </div>
                    `;
                  })()}
                </div>
              </article>
            `
          )
          .join("")}
        <article class="education-card">
          <img src="${resume.educationLogo}" alt="Wentworth Institute of Technology logo" />
          <div>
            <span>Education</span>
            <h3>${resume.education}</h3>
          </div>
        </article>
      </section>
    </section>
  `;
}

function renderProjects() {
  return `
    ${renderHero("Portfolio proof", "Inspectable products, client sites, media, and public teaching that show how the work behaves outside a resume.", heroImages.projects)}
    <section class="codex-projects-intro">
      <div>
        <p class="eyebrow">Portfolio lane</p>
        <h3>Open the work, then judge the claim.</h3>
        <p>Each project is treated as a client-facing artifact: what was built, what evidence exists, and how the output turns ambiguity into a usable workflow.</p>
      </div>
      <div class="codex-projects-tags">
        <span>Codex-assisted builds</span>
        <span>AI-assisted product building</span>
        <span>Agentic harnessing</span>
        <span>Workflow prototyping</span>
        <span>Customer workflow translation</span>
        <span>Replit lineage</span>
        <span>Client websites</span>
        <span>Data workflows</span>
        <span>Education products</span>
      </div>
    </section>
    ${renderParameterGolfPattern()}
    ${renderRepoWebsitePreviews()}
    ${renderSoraProjects()}
    ${renderPortfolioMediaProof()}
    ${renderEducationMediaSections()}
  `;
}

function renderEducationMediaSections() {
  return `
    <section class="media-showcase">
      <div>
        <p class="eyebrow">AI Winecast</p>
        <h3>Four video episodes show AI-assisted beverage education in public.</h3>
        <p>These videos keep the portfolio focused on finished, watchable proof: winery storytelling, Cabernet Sauvignon education, tasting practice, and the early AI Winecast format.</p>
      </div>
      <a class="artifact-link" href="https://www.youtube.com/@sipstudies" target="_blank" rel="noreferrer">Open Sip Studies YouTube <span>VIDEO</span></a>
    </section>
    <section class="episode-grid" aria-label="Playable podcast and YouTube episodes">
      ${mediaEpisodes.map(mediaEpisodeCard).join("")}
    </section>
    <section class="podcast-audio-panel">
      <div>
        <p class="eyebrow">Podcast audio player</p>
        <h3>${podcastAudio.title}</h3>
        <p>${podcastAudio.body}</p>
        <a class="artifact-link" href="${podcastAudio.href}" target="_blank" rel="noreferrer">Open on Spotify <span>AUDIO</span></a>
      </div>
      <iframe
        title="${podcastAudio.title} Spotify player"
        src="${podcastAudio.embedUrl}"
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      ></iframe>
    </section>
    <section class="media-showcase">
      <div>
        <p class="eyebrow">AARP Wine Walk Wednesdays</p>
        <h3>Latest four recorded adult-education videos from the AARP channel.</h3>
        <p>These use the same playable YouTube treatment as AI Winecast: visible thumbnails, embedded controls, and direct YouTube links for the long-form teaching sessions.</p>
      </div>
      <a class="artifact-link" href="https://www.youtube.com/@jonyu836/videos" target="_blank" rel="noreferrer">Open AARP playlist <span>VIDEO</span></a>
    </section>
    <section class="episode-grid" aria-label="Latest AARP Wine Walk Wednesdays videos">
      ${aarpWineWalkVideos.map(mediaEpisodeCard).join("")}
    </section>
    <section class="media-showcase">
      <div>
        <p class="eyebrow">Sip Studies Instagram</p>
        <h3>Four Sip Studies reels can be played in the same card format.</h3>
        <p>These use Instagram embeds with the same thumbnail-backed episode cards as the YouTube sections, so the viewer can play, pause, control, and open each reel from one education tab.</p>
      </div>
      <a class="artifact-link" href="https://www.instagram.com/sip.studies/" target="_blank" rel="noreferrer">Open @sip.studies <span>REELS</span></a>
    </section>
    <section class="episode-grid episode-grid--instagram episode-grid--video-row" aria-label="Latest Sip Studies Instagram reels">
      ${sipStudiesInstagramVideos.map(mediaEpisodeCard).join("")}
    </section>
    <section class="media-showcase">
      <div>
        <p class="eyebrow">Somm Support Instagram</p>
        <h3>Four Somm Support reels extend the public education proof.</h3>
        <p>These cards separate the support-brand reels from Sip Studies, while keeping the same playable media treatment and portfolio takeaway format.</p>
      </div>
      <a class="artifact-link" href="https://www.instagram.com/somm.support/" target="_blank" rel="noreferrer">Open Somm Support <span>REELS</span></a>
    </section>
    <section class="episode-grid episode-grid--instagram episode-grid--video-row" aria-label="Somm Support Instagram reels">
      ${sommSupportInstagramVideos.map(mediaEpisodeCard).join("")}
    </section>
    <section class="media-showcase">
      <div>
        <p class="eyebrow">Flavor Blog article library</p>
        <h3>Latest four articles from each Sipopedia Flavor Blog tab.</h3>
        <p>The blog cards mirror the Sipopedia tabs: SipStudies.com Blog, Sip Studies Substack, and Daily Sip. Every card carries a thumbnail so the writing surface reads like a media library, not a plain link list.</p>
      </div>
      <a class="artifact-link" href="https://sipopedia.com/#app/flavor-blog" target="_blank" rel="noreferrer">Open Flavor Blog <span>SIPOPEDIA</span></a>
    </section>
    ${flavorBlogCollections.map(articleCollection).join("")}
    <section class="education-grid">
      ${educationSignals
        .map(
          (signal) => `
            <article class="portfolio-card">
              <span>Education channel link</span>
              <h3>${signal.title}</h3>
              <p>${signal.body}</p>
              ${signal.link ? `<a class="artifact-link" href="${signal.link.href}" target="_blank" rel="noreferrer">${signal.link.label} <span>${signal.link.handle}</span></a>` : ""}
            </article>
          `
        )
        .join("")}
    </section>

    <section class="systems-map">
      <article>
        <p class="eyebrow">Education stack</p>
        <h3>How the media supports the role story</h3>
        <div class="stack-lanes">
          <span>Live and recorded adult education</span>
          <span>Podcast/audio storytelling through Sippy's Beverage Blog</span>
          <span>YouTube channels for public teaching proof</span>
          <span>Substack, social posts, and reels for publishing cadence</span>
          <span>Custom GPT guides for interactive learning support</span>
        </div>
      </article>
      <article>
        <p class="eyebrow">Portfolio takeaway</p>
        <h3>Public work that can be inspected, played, or opened.</h3>
        <p>These media surfaces matter because they show audience-facing translation: technical ideas become lessons, tools, demos, and public artifacts.</p>
        <div class="tag-cloud">
          <span>Inspectable artifacts</span>
          <span>Audience translation</span>
          <span>Learning products</span>
          <span>Public proof</span>
          <span>Workflow storytelling</span>
          <span>Media cadence</span>
        </div>
      </article>
    </section>
  `;
}

function renderWorkspace() {
  if (selectedMode === "fit") return renderRoleFit();
  if (selectedMode === "resume") return renderFullResume();
  if (selectedMode === "projects") return renderProjects();
  if (selectedMode === "references") return renderReferences();
  return renderFullResume();
}

function renderPortraitModal() {
  if (!portraitGallery.length) return "";
  const photo = portraitAt(activePortraitIndex);

  return `
    <div class="portrait-modal" data-gallery-modal hidden>
      <button class="portrait-modal-backdrop" data-gallery-close type="button" aria-label="Close portrait gallery"></button>
      <section class="portrait-modal-panel" role="dialog" aria-modal="true" aria-label="Portrait gallery">
        <button class="gallery-close" data-gallery-close type="button" aria-label="Close portrait gallery">×</button>
        <button class="gallery-nav gallery-nav-prev" data-gallery-prev type="button" aria-label="Previous portrait">‹</button>
        <figure class="gallery-stage">
          <img data-gallery-image src="${photo.src}" alt="${photo.alt}" />
          <figcaption>
            <strong data-gallery-title>${photo.title}</strong>
            <span data-gallery-count>${galleryCountText()}</span>
            <p data-gallery-caption ${photo.caption ? "" : "hidden"}>${photo.caption}</p>
            <button class="gallery-pause" data-gallery-pause type="button" aria-pressed="${galleryPaused ? "true" : "false"}" aria-label="${galleryPaused ? "Resume portrait rotation" : "Pause portrait rotation"}">
              ${galleryPaused ? "Resume" : "Pause"}
            </button>
          </figcaption>
        </figure>
        <button class="gallery-nav gallery-nav-next" data-gallery-next type="button" aria-label="Next portrait">›</button>
      </section>
    </div>
  `;
}

function render() {
  const activeMode = modes.find((mode) => mode.id === selectedMode);
  const headerPortrait = primaryPortrait();
  updateDocumentMetadata(activeMode);

  app.innerHTML = `
    <a class="skip-link" href="#presentation-content">Skip to presentation content</a>
    <main class="shell">
      <aside class="rail">
        <section class="identity-card" aria-label="Jonathan Yu profile">
          <div class="identity-media">
            <img class="resume-still-life" src="/assets/header/resume-still-life.png" alt="" />
            <button class="portrait-wrap portrait-trigger" data-gallery-open type="button" aria-label="Open portrait gallery">
              <span class="portrait-fallback" aria-hidden="true">JY</span>
              <img
                class="portrait-photo"
                src="${headerPortrait.src}"
                alt="${headerPortrait.alt}"
                onerror="this.parentElement.classList.add('is-empty'); this.remove();"
              />
            </button>
          </div>
          <div class="signature-slot">
            <img class="signature-mark" src="/assets/signature-jonathan-yu-cream.png" alt="Jonathan Yu signature" />
          </div>
          <div class="identity-block">
            <p>Jonathan Yu application portfolio</p>
            <h1>Jonathan Yu</h1>
            <span>AI Success Engineer candidate proof: adoption, workflow mapping, technical enablement, and measurable customer value.</span>
          </div>
          <div class="identity-thread" aria-label="Core proof themes">
            <span>Products</span>
            <span>Teaching</span>
            <span>Adoption</span>
          </div>
        </section>
        <nav class="mode-list" aria-label="AI Success application proof sections">
          ${modes.map(navButton).join("")}
        </nav>
        ${railPacketButtons(selectedRole)}
      </aside>
      <section class="workspace" id="presentation-content" tabindex="-1">
        <header class="topbar">
          <div>
            <p class="eyebrow">${modeEyebrows[selectedMode] || "Application proof"}</p>
            <h2>${activeMode.label}</h2>
            <p class="topbar-summary">${activeMode.summary}</p>
          </div>
        </header>
        ${renderWorkspace()}
      </section>
    </main>
    ${renderPortraitModal()}
  `;

  document.body.classList.toggle("is-focus-mode", focusMode);
  bindEvents();
  initializeReferencePdfPreviews();
  updateParallax();
  updatePortraitModal();
}

function bindEvents() {
  document.querySelector("[data-gallery-open]")?.addEventListener("click", () => {
    openPortraitGallery(originalPortraitIndex());
  });

  document.querySelectorAll("[data-gallery-close]").forEach((button) => {
    button.addEventListener("click", closePortraitGallery);
  });

  document.querySelector("[data-gallery-prev]")?.addEventListener("click", () => {
    setPortraitIndex(activePortraitIndex - 1);
    restartPortraitRotation();
  });

  document.querySelector("[data-gallery-next]")?.addEventListener("click", () => {
    setPortraitIndex(activePortraitIndex + 1);
    restartPortraitRotation();
  });

  document.querySelector("[data-gallery-pause]")?.addEventListener("click", () => {
    setPortraitRotationPaused(!galleryPaused);
  });

  document.querySelectorAll("[data-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      goToMode(button.dataset.mode);
    });
  });

  document.querySelectorAll("[data-doc]").forEach((button) => {
    button.addEventListener("click", () => {
      selectDocument(button.dataset.doc);
    });
  });

  document.querySelectorAll("[data-doc-tab]").forEach((button) => {
    button.addEventListener("keydown", (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;

      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        event.stopPropagation();
        selectDocument(documentAtOffset(event.key === "ArrowLeft" ? -1 : 1), true);
      }

      if (event.key === "Home" || event.key === "End") {
        event.preventDefault();
        event.stopPropagation();
        const names = documentNamesForSelectedRole();
        selectDocument(event.key === "Home" ? names[0] : names[names.length - 1], true);
      }
    });
  });

  document.querySelectorAll("[data-preview-fullscreen]").forEach((button) => {
    button.addEventListener("click", () => {
      toggleWebsitePreviewFullscreen(button);
    });
  });

  document.querySelectorAll("[data-reference-fullscreen]").forEach((button) => {
    button.addEventListener("click", () => {
      toggleReferenceFullscreen(button);
    });
  });

  document.querySelectorAll("[data-reference-zoom]").forEach((button) => {
    button.addEventListener("click", () => {
      updateReferenceZoom(button);
    });
  });

  document.querySelectorAll("[data-reference-layout]").forEach((button) => {
    button.addEventListener("click", () => {
      setReferenceLayout(button);
    });
  });

  document.querySelectorAll("[data-episode-load]").forEach((button) => {
    button.addEventListener("click", () => {
      loadEpisodeEmbed(button);
    });
  });

}

function loadEpisodeEmbed(button) {
  const player = button.closest("[data-episode-player]");
  if (!player || player.querySelector("iframe, video:not([data-episode-preview])")) return;

  if (button.dataset.episodeFrame === "video-file") {
    const video = document.createElement("video");
    video.src = button.dataset.episodeSrc || "";
    video.title = button.dataset.episodeTitle || "Media player";
    video.controls = true;
    video.preload = "metadata";
    video.playsInline = true;
    player.classList.add("is-loaded");
    player.querySelector("[data-episode-preview]")?.remove();
    player.appendChild(video);
    button.remove();
    return;
  }

  const iframe = document.createElement("iframe");
  iframe.title = button.dataset.episodeTitle || "Media player";
  iframe.src = button.dataset.episodeSrc || "";
  iframe.loading = "eager";
  iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture; web-share";
  iframe.allowFullscreen = true;

  if (button.dataset.episodeFrame === "instagram") {
    iframe.setAttribute("scrolling", "no");
  }

  player.classList.add("is-loaded");
  player.querySelector("[data-episode-preview]")?.remove();
  player.appendChild(iframe);
  button.remove();
}

async function toggleWebsitePreviewFullscreen(button) {
  const preview = button.closest("[data-website-preview]");
  if (!preview) return;

  try {
    if (document.fullscreenElement === preview) {
      await document.exitFullscreen();
      return;
    }

    if (preview.requestFullscreen) {
      await preview.requestFullscreen();
      return;
    }
  } catch {
    // Fall back to the live site when browser fullscreen is unavailable.
  }

  if (button.dataset.previewHref) {
    window.open(button.dataset.previewHref, "_blank", "noopener,noreferrer");
  }
}

async function toggleReferenceFullscreen(button) {
  const card = button.closest(".reference-card");
  const preview = card?.querySelector("[data-reference-preview]");
  if (!preview) return;

  try {
    if (document.fullscreenElement === preview) {
      await document.exitFullscreen();
      return;
    }

    if (preview.requestFullscreen) {
      await preview.requestFullscreen();
      return;
    }
  } catch {
    // Fall back to the PDF tab when embedded fullscreen is unavailable.
  }

  if (button.dataset.referenceHref) {
    window.open(button.dataset.referenceHref, "_blank", "noopener,noreferrer");
  }
}

function referencePdfDocument(src) {
  if (!referencePdfDocuments.has(src)) {
    referencePdfDocuments.set(src, pdfjsLib.getDocument(src).promise);
  }
  return referencePdfDocuments.get(src);
}

function referenceViewerForControl(control) {
  const preview = control.closest("[data-reference-preview]");
  return preview?.querySelector("[data-reference-pdf-viewer]");
}

function referencePageNumbers(pdf, layout) {
  if (layout === "two") {
    return [1, 2].filter((pageNumber) => pageNumber <= pdf.numPages);
  }
  return [1];
}

function updateReferencePageIndicator(viewer, pageNumbers, totalPages) {
  const preview = viewer.closest("[data-reference-preview]");
  const indicator = preview?.querySelector("[data-reference-page-indicator]");
  if (!indicator) return;

  indicator.textContent =
    pageNumbers.length > 1
      ? `${pageNumbers[0]}-${pageNumbers[pageNumbers.length - 1]} / ${totalPages}`
      : `${pageNumbers[0]} / ${totalPages}`;
}

async function renderReferencePdfViewer(viewer) {
  const src = viewer.dataset.referencePdfSrc;
  const pages = viewer.querySelector("[data-reference-pages]");
  const status = viewer.querySelector("[data-reference-render-status]");
  if (!src || !pages) return;

  const renderToken = `${Date.now()}-${Math.random()}`;
  viewer.dataset.referenceRenderToken = renderToken;
  viewer.classList.add("is-loading");
  if (status) {
    status.hidden = false;
    status.textContent = "Loading PDF preview...";
  }

  try {
    const pdf = await referencePdfDocument(src);
    if (viewer.dataset.referenceRenderToken !== renderToken) return;

    const zoom = Number.parseInt(viewer.dataset.referenceZoomLevel || "100", 10) / 100;
    const layout = viewer.dataset.referenceLayout || "two";
    const pageNumbers = referencePageNumbers(pdf, layout);
    const firstPage = await pdf.getPage(pageNumbers[0]);
    const baseViewport = firstPage.getViewport({ scale: 1 });
    const gap = 14;
    const availableWidth = Math.max(260, pages.clientWidth || viewer.clientWidth || 320);
    const fitScale = Math.max(
      0.28,
      Math.min(1.25, (availableWidth - gap * (pageNumbers.length - 1) - 24) / (baseViewport.width * pageNumbers.length))
    );
    const renderScale = fitScale * zoom;
    const outputScale = Math.min(window.devicePixelRatio || 1, 2);

    pages.innerHTML = "";
    pages.classList.toggle("is-two-page", pageNumbers.length > 1);

    for (const pageNumber of pageNumbers) {
      if (viewer.dataset.referenceRenderToken !== renderToken) return;
      const page = pageNumber === pageNumbers[0] ? firstPage : await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: renderScale });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas rendering is unavailable.");
      canvas.className = "reference-pdf-page";
      canvas.dataset.referencePage = String(pageNumber);
      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;
      context.setTransform(outputScale, 0, 0, outputScale, 0, 0);
      pages.appendChild(canvas);
      await page.render({ canvasContext: context, viewport }).promise;
      if (viewer.dataset.referenceRenderToken !== renderToken) return;
    }

    if (viewer.dataset.referenceRenderToken !== renderToken) return;
    updateReferencePageIndicator(viewer, pageNumbers, pdf.numPages);
    if (status) status.hidden = true;
    viewer.classList.remove("is-loading");
  } catch (error) {
    if (viewer.dataset.referenceRenderToken !== renderToken) return;
    pages.innerHTML = "";
    viewer.classList.remove("is-loading");
    if (status) {
      status.hidden = false;
      status.textContent = "PDF preview unavailable. Use Download PDF or Open reference.";
    }
    console.warn("Reference PDF preview failed", error);
  }
}

function initializeReferencePdfPreviews() {
  document.querySelectorAll("[data-reference-pdf-viewer]").forEach((viewer) => {
    renderReferencePdfViewer(viewer);
  });
}

function setReferenceLayout(button) {
  const viewer = referenceViewerForControl(button);
  if (!viewer) return;

  const targetLayout = button.dataset.referenceLayout || "two";
  const currentLayout = viewer.dataset.referenceLayout || "single";
  const nextLayout = currentLayout === targetLayout ? "single" : targetLayout;
  viewer.dataset.referenceLayout = nextLayout;
  const preview = button.closest("[data-reference-preview]");
  preview?.querySelectorAll("[data-reference-layout]").forEach((layoutButton) => {
    const active = layoutButton.dataset.referenceLayout === nextLayout;
    layoutButton.setAttribute("aria-pressed", active ? "true" : "false");
  });
  renderReferencePdfViewer(viewer);
}

function updateReferenceZoom(button) {
  const preview = button.closest("[data-reference-preview]");
  const viewer = referenceViewerForControl(button);
  if (!preview || !viewer) return;

  const currentZoom = Number.parseInt(viewer.dataset.referenceZoomLevel || "100", 10);
  const direction = button.dataset.referenceZoom === "in" ? 1 : -1;
  const nextZoom = Math.min(200, Math.max(50, currentZoom + direction * 25));
  viewer.dataset.referenceZoomLevel = String(nextZoom);
  preview.querySelectorAll("[data-reference-zoom-label]").forEach((label) => {
    label.textContent = `${nextZoom}%`;
  });
  renderReferencePdfViewer(viewer);
}

function updateWebsiteFullscreenControls() {
  const activePreview = document.fullscreenElement;
  document.querySelectorAll("[data-preview-fullscreen]").forEach((button) => {
    const preview = button.closest("[data-website-preview]");
    const active = Boolean(preview && activePreview === preview);
    button.textContent = active ? "Exit full screen" : "Full screen";
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

function updateReferenceFullscreenControls() {
  const activePreview = document.fullscreenElement;
  document.querySelectorAll("[data-reference-fullscreen]").forEach((button) => {
    const card = button.closest(".reference-card");
    const preview = card?.querySelector("[data-reference-preview]");
    const active = Boolean(preview && activePreview === preview);
    button.innerHTML = `${active ? "Exit full screen" : "Full screen"} <span>PDF</span>`;
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

function updatePortraitModal() {
  const modal = document.querySelector("[data-gallery-modal]");
  if (!modal) return;

  const photo = portraitAt(activePortraitIndex);
  const image = modal.querySelector("[data-gallery-image]");
  const title = modal.querySelector("[data-gallery-title]");
  const count = modal.querySelector("[data-gallery-count]");
  const caption = modal.querySelector("[data-gallery-caption]");
  const pauseButton = modal.querySelector("[data-gallery-pause]");

  if (image) {
    image.src = photo.src;
    image.alt = photo.alt;
  }

  if (title) title.textContent = photo.title;
  if (count) count.textContent = galleryCountText();

  if (caption) {
    caption.textContent = photo.caption;
    caption.hidden = !photo.caption;
  }

  if (pauseButton) {
    pauseButton.textContent = galleryPaused ? "Resume" : "Pause";
    pauseButton.setAttribute("aria-pressed", galleryPaused ? "true" : "false");
    pauseButton.setAttribute("aria-label", galleryPaused ? "Resume portrait rotation" : "Pause portrait rotation");
  }

  modal.hidden = !galleryOpen;
  document.body.classList.toggle("has-portrait-modal", galleryOpen);
}

function setPortraitIndex(index) {
  if (!portraitGallery.length) return;
  activePortraitIndex = (index + portraitGallery.length) % portraitGallery.length;
  updatePortraitModal();
}

function startPortraitRotation() {
  if (galleryTimer || portraitGallery.length < 2) return;
  galleryTimer = window.setInterval(() => {
    setPortraitIndex(activePortraitIndex + 1);
  }, portraitRotationMs);
}

function stopPortraitRotation() {
  if (!galleryTimer) return;
  window.clearInterval(galleryTimer);
  galleryTimer = null;
}

function restartPortraitRotation() {
  stopPortraitRotation();
  if (!galleryPaused) startPortraitRotation();
}

function setPortraitRotationPaused(nextPaused) {
  galleryPaused = Boolean(nextPaused);
  if (galleryPaused) {
    stopPortraitRotation();
  } else {
    startPortraitRotation();
  }
  updatePortraitModal();
}

function openPortraitGallery(index = activePortraitIndex) {
  if (!portraitGallery.length) return;
  galleryOpen = true;
  galleryPaused = false;
  setPortraitIndex(index);
  startPortraitRotation();
}

function closePortraitGallery() {
  galleryOpen = false;
  stopPortraitRotation();
  updatePortraitModal();
}

function updateParallax() {
  const parallaxNodes = document.querySelectorAll("[data-parallax-depth]");
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) {
    parallaxNodes.forEach((node) => {
      node.style.transform = "none";
    });
    return;
  }

  const scroll = window.scrollY || 0;
  parallaxNodes.forEach((node) => {
    const depth = Number(node.dataset.parallaxDepth || 0);
    node.style.transform = `translate3d(0, ${scroll * depth}px, 0)`;
  });
}

window.addEventListener("scroll", updateParallax, { passive: true });
window.addEventListener("hashchange", () => {
  applyHashState();
  render();
});
document.addEventListener("fullscreenchange", () => {
  updateWebsiteFullscreenControls();
  updateReferenceFullscreenControls();
  window.setTimeout(initializeReferencePdfPreviews, 50);
});
document.addEventListener("keydown", (event) => {
  if (galleryOpen) {
    if (event.key === "Escape") {
      closePortraitGallery();
    }

    if (event.key === "ArrowLeft") {
      setPortraitIndex(activePortraitIndex - 1);
      restartPortraitRotation();
    }

    if (event.key === "ArrowRight") {
      setPortraitIndex(activePortraitIndex + 1);
      restartPortraitRotation();
    }

    return;
  }

  if (event.altKey || event.ctrlKey || event.metaKey) return;

  if (event.key.toLowerCase() === "f") {
    event.preventDefault();
    setFocusMode(!focusMode);
  }
});

render();
