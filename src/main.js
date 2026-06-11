import "./styles.css";
import masterData from "./master-resume-data.js";
import portraitGallery from "./portrait-gallery.js";

const base = "/documents/openai-2026-06-02";
const resumeBase = "/documents/resume";
const referencesBase = "/documents/references";
const logoBase = "/assets/logos";
const heroImages = {
  resume: "/assets/academy-realm.jpg",
  projects: "/assets/header/codex-projects-hero.png",
  education: "/assets/header/podcast-video-hero.png",
  fit: "/assets/header/hiring-close-hero.png",
  references: "/assets/header/codex-projects-hero.png"
};

const { roles, resume } = masterData;
const resumeSource = masterData.source;
const primaryRoleId = "ai-success";
const primaryRole = roles.find((role) => role.id === primaryRoleId) || roles[0];

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
    summary: "Source-backed resume facts and credential proof."
  },
  {
    id: "projects",
    label: "02 Portfolio",
    summary: "Inspectable projects, media, and shipped work."
  },
  {
    id: "fit",
    label: "03 OpenAI Fit",
    summary: "Role-specific close, packet files, and interview proof."
  },
  {
    id: "references",
    label: "04 References",
    summary: "Third-party PDFs, emails, and source notes."
  }
];

const publicLinks = [
  { label: "Bio Site", handle: "SipStudies link tree", href: "https://bio.site/SipStudies" },
  { label: "Website", handle: "sipstudies.com", href: "https://sipstudies.com" },
  { label: "YouTube", handle: "@sipstudies", href: "https://youtube.com/@sipstudies" },
  { label: "Education YouTube", handle: "@jonyu836", href: "https://www.youtube.com/@jonyu836" },
  { label: "Instagram", handle: "@sip.studies", href: "https://www.instagram.com/sip.studies" },
  { label: "Threads", handle: "@sip.studies", href: "https://www.threads.net/@sip.studies" },
  { label: "Substack", handle: "sipstudies", href: "https://sipstudies.substack.com" },
  { label: "Spotify", handle: "AI Winecast", href: "https://open.spotify.com/show/2LSWrWDTlPOMgnZkGfUPE1" }
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
    title: "Supporting prototypes",
    type: "Codex Project | Portfolio breadth",
    path: "C:\\codebase\\sip_studies\\actual",
    body: "Additional local folders show breadth across AI education, market-index storytelling, tasting-journal experiments, game/interactive prototypes, and client-service launches.",
    proof: ["Ai-Edu safe AI router", "Coffee-Index market story", "Sip-Studies-Tasting-Journal prototype"],
    bridge: "Shows range: Jonathan can explore a problem space quickly, preserve the learning, and carry useful patterns into the next build."
  }
];

const codexProjectIndex = [
  {
    title: "Sip Studies / Sipopedia",
    folder: "Sip-Studies",
    category: "Production education platform",
    evidence: "React/TypeScript, Supabase auth/content, Stripe checkout, Edge Functions, terminology automation, Learn/Taste/Connect surfaces.",
    roleValue: "End-to-end product ownership, customer education, AI workflow design, and production-minded implementation."
  },
  {
    title: "Rose Quartz Massage",
    folder: "Rose-Quartz",
    category: "Client launch website",
    evidence: "Responsive Vite site, generated imagery, service menu, body-map intake, booking flow, care/privacy standards, journal, SEO, sitemap, launch docs.",
    roleValue: "Client discovery, trust-sensitive UX, launch readiness, and business-facing web delivery."
  },
  {
    title: "AI Edu",
    folder: "Ai-Edu",
    category: "Safe AI education prototype",
    evidence: "Supabase Edge Function ai-router for OpenAI, Anthropic, and Google, frontend-safe keys, terminology page, admin workflow, and citation guidance.",
    roleValue: "Shows secure AI integration, provider abstraction, and educational data operations."
  },
  {
    title: "Coffee Index",
    folder: "Coffee-Index",
    category: "Market index story",
    evidence: "Vite analytical page modeling solo espresso costs by city, rankings, regional averages, baseline index, and methodology narrative.",
    roleValue: "Shows fast data storytelling and public-facing analytical presentation."
  },
  {
    title: "Sip Studies Tasting Journal",
    folder: "Sip-Studies-Tasting-Journal",
    category: "Replit tasting app",
    evidence: "Multi-beverage tasting templates, blind testing, analytics, study recommendations, Replit OIDC auth, PostgreSQL, Drizzle, and shadcn/Radix UI.",
    roleValue: "Shows Replit lineage, authenticated product workflows, and beverage-domain form architecture."
  }
];

const repoWebsitePreviews = [
  {
    title: "Sipopedia / Sip Studies",
    label: "Interactive website preview",
    repo: "Sipopedia",
    repoHref: "https://github.com/Sip-Coder/Sipopedia",
    siteHref: "https://sipopedia.com/",
    previewHref: "https://sipopedia.com/",
    status: "Live iframe",
    summary: "The live learning platform is the highest-signal website preview: recruiters can click through the public product without leaving the portfolio.",
    proof: ["Custom domain verified embeddable", "Learn / Taste / Connect product lanes", "GitHub-backed source repo"]
  },
  {
    title: "Sip Studies public site",
    label: "Linked website fallback",
    repo: "Sipopedia",
    repoHref: "https://github.com/Sip-Coder/Sipopedia",
    siteHref: "https://sipstudies.com",
    status: "Open in new tab",
    summary: "The public brand site is linked beside the app preview. It sends same-origin frame protection, so it should open directly instead of pretending to be interactive here.",
    proof: ["Public education home", "Brand and publishing surface", "Direct site link"]
  },
  {
    title: "Rose Quartz Massage",
    label: "GitHub repo website",
    repo: "Rose-Quartz",
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
    repoHref: "https://github.com/Sip-Coder/Coffee-Index",
    siteHref: "/repo-previews/coffee-index/index.html",
    previewHref: "/repo-previews/coffee-index/index.html",
    status: "Static preview snapshot",
    summary: "Market-index website source is on GitHub, with the built Vite output embedded as a quick interactive data-story preview.",
    proof: ["City-by-city cost model", "Methodology page", "Data-storytelling surface"]
  },
  {
    title: "Sip Studies Tasting Journal",
    label: "GitHub repo app",
    repo: "Sip-Studies-Tasting-Journal",
    repoHref: "https://github.com/Sip-Coder/Sip-Studies-Tasting-Journal",
    siteHref: "/repo-previews/tasting-journal/index.html",
    previewHref: "/repo-previews/tasting-journal/index.html",
    status: "Static app preview",
    summary: "The app source is on GitHub, and the front-end build is embedded here for review. Backend-backed actions still belong in the live app environment.",
    proof: ["Authenticated tasting workflows", "Blind testing and analytics", "Replit lineage preserved"]
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
    title: "AI Winecast",
    body: "Podcast/audio channel that extends the resume into repeatable education, audience engagement, and AI-assisted beverage storytelling.",
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
    title: "Ai Winecast - 002 Cabernet Franc",
    label: "Podcast video episode",
    episodeLabel: "Episode 002",
    theme: "Cabernet Franc",
    publishedAt: "Jul 23, 2025",
    youtubeId: "BobLilSXXgM",
    youtubeUrl: "https://youtu.be/BobLilSXXgM",
    thumbnail:
      "https://images.squarespace-cdn.com/content/v1/60ebc279dcf3287a46adfe4e/c3190f4e-539e-4c22-a84b-8424e088ca46/Ai+Winecast+-+002+Cabernet+Franc.jpg",
    summary:
      "Cabernet Franc as a Bordeaux parent grape, blending partner, and source of lifted red fruit, herbs, and structure."
  },
  {
    title: "Ai Winecast - 001 Cabernet Sauvignon",
    label: "Podcast video episode",
    episodeLabel: "Episode 001",
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
    title: "NEW AI Winecast 000: Our Mission & Philosophy",
    label: "Podcast video episode",
    episodeLabel: "Episode 000",
    theme: "Mission and Philosophy",
    publishedAt: "Jul 19, 2025",
    youtubeId: "Yaps0nSaeO0",
    youtubeUrl: "https://youtu.be/Yaps0nSaeO0",
    thumbnail:
      "https://images.squarespace-cdn.com/content/v1/60ebc279dcf3287a46adfe4e/a1cc2398-4f42-4db5-b82d-5a9e2c7497bf/Ai+Winecast+-+000+Philosophy.png",
    summary:
      "The launch episode introducing Sip Studies, Sippy, AI-assisted wine education, community impact, and the Learn, Engage, Teach model."
  },
  {
    title: "Tasting Winecast - Episode 005",
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
    title: "Tasting Winecast - Episode 004",
    label: "YouTube education episode",
    episodeLabel: "Episode 004",
    theme: "Tasting Drill",
    publishedAt: "Jul 14, 2025",
    youtubeId: "8HAjXibHMEw",
    youtubeUrl: "https://youtu.be/8HAjXibHMEw",
    thumbnail:
      "https://images.squarespace-cdn.com/content/v1/60ebc279dcf3287a46adfe4e/ef942ae4-1e1d-4ac8-a90c-0de814e7c94e/004+Tasting.png",
    summary:
      "A tasting-practice archive for reinforcing structured beverage observation and conclusion-building."
  },
  {
    title: "Ai Winecast - Episode 003",
    label: "Podcast video episode",
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

const instagramVideos = [
  {
    title: "Neutral White Blind Tasting",
    label: "Sip Studies Instagram",
    episodeLabel: "Instagram Reel",
    theme: "Blind tasting",
    publishedAt: "Latest embeddable reel",
    duration: "Reel",
    frame: "instagram",
    embedUrl: "https://www.instagram.com/reel/DGcYlnWxP7M/embed",
    href: "https://www.instagram.com/sip.studies/reel/DGcYlnWxP7M/",
    linkLabel: "Open on Instagram",
    linkKind: "REEL",
    thumbnail:
      "https://media.bio.site/sites/0a155d48-b34b-4842-8d27-a6fc05f88d84/wkZTS43CMvdqGwVvyTVq9o.jpg",
    instagramCaption: [
      "🌿✨ Neutral Whites & Bonus Wines Blind Tasting! 🍷🥂",
      "",
      "This weekend, we explored the refined world of neutral aromatic white wines, diving into classic styles. From the steely minerality of Chablis to the crisp Albariño, and a touch of Alsace Pinot Gris richness, each bottle showcased elegance, structure, and terroir-driven complexity.",
      "",
      "🍇 Tasted Wines:",
      "✅ @maisonpiron Beaujolais Villages (Bonus!) 🍒",
      "✅ Jadot Chablis - Saint Pierre 🏞️",
      "✅ Martín Códax Albariño 🌊",
      "✅ Pine Ridge Chenin Blanc-Viognier 🏖️",
      "✅ Koeler-Kuprecht Kallstadler Riesling (Kabinett Trocken) 🍑",
      "✅ Michele Thomas et Fils Sancerre 🍏",
      "✅ Italo Cescon Pinot Grigio 🍐",
      "✅ Hugel Pinot Gris Alsace 🍯",
      "",
      "👃🏼 Aromas & Tasting Notes: Bright citrus, green apple, crisp minerality, and a touch of floral elegance 🌼. These wines emphasize structure over perfume, making them a fun challenge for all!",
      "",
      "🔥 Big thank you to our Sip Studies Tasting Group! Join us as we refine our palates and prepare for the next level of wine appreciation!",
      "",
      "#SipStudies #BlindTasting #WineEducation #NeutralWhiteWines #WSET #CMS #WineTasting #SommelierTraining #MineralityMatters"
    ].join("\n"),
    summary: "Shows Sip Studies turning a neutral-white lineup into structured blind-tasting practice and public wine education."
  },
  {
    title: "Albarino/Alvarinho Tasting",
    label: "Sip Studies Instagram",
    episodeLabel: "Instagram Reel",
    theme: "Wine tasting",
    publishedAt: "Latest embeddable reel",
    duration: "Reel",
    frame: "instagram",
    embedUrl: "https://www.instagram.com/reel/DFuLhCVRDIU/embed",
    href: "https://www.instagram.com/sip.studies/reel/DFuLhCVRDIU/",
    linkLabel: "Open on Instagram",
    linkKind: "REEL",
    thumbnail:
      "https://media.bio.site/sites/0a155d48-b34b-4842-8d27-a6fc05f88d84/W6ruSetdvEr5nRzmFZDwjc.jpg",
    instagramCaption: [
      "Albariño/Alvarinho Tasting!!!",
      ".",
      ".",
      ".",
      "#wine #winelover #winetastings #winewinewine #winestagram #winelife #wineoclock #win"
    ].join("\n"),
    summary: "Uses a focused varietal reel to make wine study approachable, repeatable, and easy to scan."
  },
  {
    title: "Lee's Beer and Tequila 2023",
    label: "Sip Studies Instagram",
    episodeLabel: "Instagram Reel",
    theme: "Event media",
    publishedAt: "Latest embeddable reel",
    duration: "Reel",
    frame: "instagram",
    embedUrl: "https://www.instagram.com/reel/DFisS-QyRzE/embed",
    href: "https://www.instagram.com/sip.studies/reel/DFisS-QyRzE/",
    linkLabel: "Open on Instagram",
    linkKind: "REEL",
    thumbnail:
      "https://media.bio.site/sites/0a155d48-b34b-4842-8d27-a6fc05f88d84/sN43wbYT5j8SSdcE3grapV.jpg",
    instagramCaption: [
      "Lee's Beer and Tequila 2023 🎉🎶🍻🍹",
      "What an awesome weekend, who's ready for another great weekend?!?",
      ".",
      ".",
      ".",
      "Sip Studies"
    ].join("\n"),
    summary: "Shows the brand extending beyond classroom content into live beverage community moments."
  },
  {
    title: "Madhouse Coffee Charity Drive",
    label: "Sip Studies Instagram",
    episodeLabel: "Instagram Reel",
    theme: "Community support",
    publishedAt: "Latest embeddable reel",
    duration: "Reel",
    frame: "instagram",
    embedUrl: "https://www.instagram.com/reel/DFdKYo7RMBC/embed",
    href: "https://www.instagram.com/sip.studies/reel/DFdKYo7RMBC/",
    linkLabel: "Open on Instagram",
    linkKind: "REEL",
    thumbnail:
      "https://media.bio.site/sites/0a155d48-b34b-4842-8d27-a6fc05f88d84/dNfmzhhspeKvHxBnf87pkk.jpg",
    instagramCaption: [
      "🎁🫂 Charity Drive at Madhouse Coffee ☕🔥",
      "",
      "Join Sip Studies in collecting charity donations for the LA Fire Relief Fund 🚒🔥 at Madhouse Coffee from today until Saturday! Every small act of kindness adds up, and together, we can make a real difference.",
      "",
      "📍 Drop-off Location: Madhouse Coffee ☕",
      "📅 Now - Saturday",
      "🎥 All details in the video!",
      "",
      "Bring your donations and spread the love! Whether it's first aid and hygiene products, essentials, or support - every bit helps. Let's rally together!",
      "",
      "Net proceeds for charity merch will be matched,",
      "Visit our website at:",
      "https://SipStudies.com/shop/charity",
      "",
      "💙 Tag a friend who can help! #GiveBack #CharityDrive #LAFireRelief #SipStudies #CommunityStrong #MadhouseCoffee #HelpUsHelpOthers"
    ].join("\n"),
    summary: "Connects Sip Studies media to community support, local partnerships, and clear calls to action."
  }
];

const podcastAudio = {
  title: "AI Winecast",
  embedUrl: "https://open.spotify.com/embed/show/2LSWrWDTlPOMgnZkGfUPE1?utm_source=generator",
  href: "https://open.spotify.com/show/2LSWrWDTlPOMgnZkGfUPE1",
  body:
    "Audio-side proof that the education work is not just written or visual. The podcast format shows voice, pacing, explanation, and repeatable topic framing."
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

function proofMetric(label, value, detail, scale = 76) {
  return {
    label,
    value,
    detail,
    scale,
    max: 100
  };
}

function heroMetricsFor(modeId) {
  if (modeId !== "resume") return [];

  return [
    proofMetric("Career range", "10+", "Years across beverage sales, account analytics, education, live events, and AI-enabled product building.", 82),
    proofMetric("Commercial lift", "$2.291M", "Wine revenue increase at Lee's Liquor alongside 3,500+ expanded placements.", 88),
    proofMetric("Founder platform", "20,000", "Sipopedia terminology pipeline rows with citation and review metadata.", 80),
    proofMetric("Credential stack", `${resume.certs.length}`, "AI strategy, wine, spirits, sake, beer, and sommelier credentials represented in the resume.", 72)
  ];
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
    <div class="rail-pdf-actions" aria-label="Download packet PDFs">
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

function timeboxCards(role) {
  return [
    {
      mark: "0:00",
      title: "Decision thesis",
      body: role.headline,
      proof: role.fit
    },
    {
      mark: "0:30",
      title: "Portfolio proof",
      body: role.strengths?.[0] || role.proof?.[0] || role.resumeSummary,
      proof: role.proof?.[0] || role.talkTrack
    },
    {
      mark: "1:00",
      title: "Adoption proof",
      body: role.talkTrack,
      proof: role.strengths?.[1] || role.planTheme
    },
    {
      mark: "1:30",
      title: "Packet evidence",
      body: "The role resume, cover letter, and 30-60-90 plan support the same adoption story after the fit is clear.",
      proof: role.planTheme || role.demoMove
    }
  ];
}

function renderTimeboxedRead() {
  return `
    <section class="timebox-read" aria-label="Ninety second OpenAI resume read">
      <div class="timebox-head">
        <p class="eyebrow">90-second closer</p>
        <h3>What a busy OpenAI panel should remember after the walkthrough.</h3>
        <p>The resume and portfolio have already shown the source facts. This closer compresses the hiring argument: why the AI Success pivot makes sense, which proof is strongest, and how the packet supports the decision.</p>
      </div>
      <div class="timebox-grid">
        ${timeboxCards(selectedRole)
          .map(
            (card) => `
              <article class="timebox-card">
                <span>${card.mark}</span>
                <h4>${presentationText(card.title)}</h4>
                <p>${presentationText(card.body)}</p>
                <b>${presentationText(card.proof)}</b>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function proofMatrixRows(role) {
  return [
    {
      label: "Role requirement",
      focus: role.fit,
      proof: role.strengths?.[0] || role.proof?.[0] || role.resumeSummary,
      artifact: "Resume",
      action: "Packet Resume",
      doc: "Resume"
    },
    {
      label: "Narrative fit",
      focus: role.coverFocus || role.resumeSummary,
      proof: role.talkTrack || role.demoMove,
      artifact: "Cover Letter",
      action: "Packet Cover Letter",
      doc: "Cover Letter"
    },
    {
      label: "First-quarter execution",
      focus: role.planTheme || role.fit,
      proof: role.strengths?.[1] || role.proof?.[1] || role.talkTrack,
      artifact: "30-60-90 Plan",
      action: "Packet Plan",
      doc: "30-60-90"
    },
    {
      label: "Portfolio proof",
      focus: "Shipped work that can be inspected and discussed beyond the packet.",
      proof: role.proof?.[0] || role.strengths?.[0] || "Codex Projects, Sip Studies, Sipopedia, and Critical On Hand proof.",
      artifact: "Codex Projects",
      action: "Portfolio proof"
    }
  ];
}

function proofMatrixCard(row, index) {
  const action = row.doc
    ? `<button class="matrix-action" data-doc="${row.doc}" type="button">${presentationText(row.action)}</button>`
    : `<span class="matrix-reference">${presentationText(row.action)}</span>`;

  return `
    <article class="proof-matrix-card">
      <span>${String(index + 1).padStart(2, "0")} ${presentationText(row.label)}</span>
      <h4>${presentationText(row.artifact)}</h4>
      <p>${presentationText(row.focus)}</p>
      <div>
        <b>Evidence to cite</b>
        <p>${presentationText(row.proof)}</p>
      </div>
      ${action}
    </article>
  `;
}

function renderProofMatrix() {
  const rows = proofMatrixRows(selectedRole);

  return `
    <section class="proof-matrix" aria-label="Role proof map">
      <div class="proof-matrix-head">
        <div>
          <p class="eyebrow">Role proof map</p>
          <h3>Open the next artifact only when it helps the hiring decision.</h3>
        </div>
        <p>The selected role defines the claim, the proof to cite, and the next file or tab to open. The packet supports the argument instead of becoming the argument.</p>
      </div>
      <div class="proof-matrix-grid">
        ${rows.map(proofMatrixCard).join("")}
      </div>
    </section>
  `;
}

function selectedDocumentSummary(name) {
  const summaries = {
    Resume: "Use this when the interviewer wants the role-shaped version of the full resume facts.",
    "Cover Letter": "Use this when the conversation turns to motivation, narrative fit, and why this role is the right transition.",
    "30-60-90": "Use this when the interviewer asks how the first quarter would turn into discovery, artifacts, enablement, and measurable outcomes."
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
      <p class="eyebrow">Selected packet document</p>
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
  const linkLabel = episode.linkLabel || "Open on YouTube";
  const linkKind = episode.linkKind || "VIDEO";
  const href = episode.href || episode.youtubeUrl;
  const frame = episode.frame || "video";
  const bodyCopy = episode.instagramCaption
    ? `
        <div class="episode-caption">
          <span>Instagram description</span>
          <p>${episode.instagramCaption}</p>
        </div>
        <div class="episode-takeaway">
          <span>Portfolio takeaway</span>
          <p>${episode.summary}</p>
        </div>
      `
    : `<p>${episode.summary}</p>`;

  return `
    <article class="episode-card episode-card--${frame}">
      <div class="episode-player episode-player--${frame}" style="--episode-thumb:url('${episode.thumbnail}')">
        <iframe
          title="${episode.title}"
          src="${episodeEmbedUrl(episode)}"
          loading="lazy"
          ${frame === "instagram" ? 'scrolling="no"' : ""}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
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
  return `
    <div class="website-preview-actions">
      ${site.siteHref ? artifactButton("Open site", site.siteHref, "SITE") : ""}
      ${artifactButton("Open GitHub repo", site.repoHref, "GITHUB")}
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
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        allow="clipboard-write; fullscreen; web-share"
        allowfullscreen
      ></iframe>
    </div>
  `;
}

function repoWebsitePreviewCard(site, index) {
  const featuredClass = index === 0 ? " is-featured" : "";
  return `
    <article class="website-preview-card${featuredClass}">
      ${repoWebsiteFrame(site)}
      <div class="website-preview-body">
        <span>${presentationText(site.label)}</span>
        <h4>${presentationText(site.title)}</h4>
        <p>${presentationText(site.summary)}</p>
        <div class="website-preview-status">${presentationText(site.status)}</div>
        <ul>${site.proof.map((item) => `<li>${presentationText(item)}</li>`).join("")}</ul>
        ${repoWebsiteActions(site)}
      </div>
    </article>
  `;
}

function renderRepoWebsitePreviews() {
  return `
    <section class="website-preview-board" aria-label="Interactive GitHub repo website previews">
      <div class="website-preview-head">
        <div>
          <p class="eyebrow">Website screen-in-screen</p>
          <h3>Let recruiters interact with the shipped web surfaces without hunting through repos.</h3>
          <p>Sipopedia runs from its public domain. Rose Quartz, Coffee Index, and Tasting Journal use same-origin static snapshots generated from their local build outputs, so every preview opens in a real frame instead of a blank placeholder.</p>
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
        <p class="eyebrow">OpenAI AI Success application proof page</p>
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
        <p>Verified against the live OpenAI careers page on ${aiSuccessPostingFacts.verifiedDate}. The closer should stay anchored to post-sales ownership, workflow mapping, technical readiness, adoption velocity, KPIs, and measurable customer value.</p>
        <a class="artifact-link" href="${aiSuccessPostingFacts.sourceUrl}" target="_blank" rel="noreferrer">Open posting <span>OPENAI</span></a>
      </div>
      <div class="source-facts-grid">
        <span><b>Team</b>${aiSuccessPostingFacts.roleTeam}</span>
        <span><b>Location</b>${aiSuccessPostingFacts.roleLocation}</span>
        <span><b>Compensation</b>${aiSuccessPostingFacts.payRange}</span>
      </div>
      <div class="source-facts-list">
        <b>Role facts to mirror</b>
        <ul>${aiSuccessPostingFacts.roleFacts.map((item) => `<li>${presentationText(item)}</li>`).join("")}</ul>
        <div>${aiSuccessPostingFacts.successSignals.map((item) => `<em>${presentationText(item)}</em>`).join("")}</div>
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
        <p class="eyebrow">Download packet PDFs</p>
        <h3>Resume, Cover Letter, and 30-60-90 Plan.</h3>
        <p>Use these when the interviewer asks for the formal artifact behind the walkthrough.</p>
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
    { label: "AI Winecast", handle: "podcast/audio proof", href: "https://open.spotify.com/show/2LSWrWDTlPOMgnZkGfUPE1" },
    { label: "Sip Studies Instagram", handle: "public media proof", href: "https://www.instagram.com/sip.studies/" },
    { label: "Flavor Blog", handle: "writing/publishing proof", href: "https://sipopedia.com/#app/flavor-blog" }
  ];

  return `
    <section class="portfolio-media-proof" aria-label="Public teaching and media portfolio proof">
      <div>
        <p class="eyebrow">Public teaching proof</p>
        <h3>Education is part of the AI Success portfolio, not a separate detour.</h3>
        <p>AI Success needs people who can explain new technology, pace adoption, build confidence, and turn complex material into useful behavior. These public channels support that claim.</p>
      </div>
      <div class="link-grid">${teachingLinks.map(linkCard).join("")}</div>
    </section>
  `;
}

function referenceArtifactAction(artifact) {
  if (!artifact.href) {
    return `<span class="reference-state">${presentationText(artifact.status)}</span>`;
  }

  const actionLabel = artifact.type === "Index" ? "Open source index" : "Open reference";
  return `<a class="artifact-link reference-artifact-action" href="${artifact.href}" target="_blank" rel="noreferrer">${actionLabel} <span>${presentationText(artifact.type)}</span></a>`;
}

function referenceArtifactPreview(artifact) {
  if (artifact.href && artifact.type === "PDF") {
    return `<iframe class="reference-preview" src="${artifact.href}" title="${presentationText(artifact.title)}"></iframe>`;
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
      <div class="reference-preview-wrap">
        ${referenceArtifactPreview(artifact)}
      </div>
      <div class="reference-evidence">
        ${artifact.evidence.map((item) => `<em>${presentationText(item)}</em>`).join("")}
      </div>
      <footer>
        <b>${presentationText(artifact.source)}</b>
        ${referenceArtifactAction(artifact)}
      </footer>
    </article>
  `;
}

function renderReferences() {
  return `
    ${renderHero("References", "Reference handling for approved third-party proof without unfinished placeholders.", heroImages.references)}
    <section class="references-board" aria-label="Reference artifacts">
      <div class="references-board-head">
        <div>
          <p class="eyebrow">References on request</p>
          <h3>Keep third-party proof source-backed and permissioned.</h3>
          <p>Use this step when the hiring team wants reference letters, source emails, or third-party proof after the AI Success fit conversation.</p>
        </div>
        <div class="reference-custody">
          <b>Source standard</b>
          <p>Every reference artifact should keep a clear source, permission status, and interview use.</p>
        </div>
      </div>
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
    ${renderHero("OpenAI Fit", "Role facts, strongest proof, and the packet files for the final hiring discussion.", heroImages.fit)}
    ${renderAiSuccessSourceCheck()}
    ${renderPacketPdfRail(selectedRole)}
    ${renderTimeboxedRead()}
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
        <h3>Why the selected role makes sense</h3>
        <ul>${selectedRole.proof.map((item) => `<li>${presentationText(item)}</li>`).join("")}</ul>
      </div>
    </section>
    ${renderProofMatrix()}
  `;
}

function renderFullResume() {
  return `
    ${renderHero("Resume reference", "The source-backed chronology, credentials, and downloadable resume files.", heroImages.resume)}
    <section class="resume-head">
      <div>
        <p class="eyebrow">Resume reference view</p>
        <h2>${resume.name}</h2>
        <strong>${resume.headline}</strong>
        <p>${resume.contact}</p>
        <p class="source-note">Sourced from ${resumeSource}. Workbook edits regenerate this presentation data.</p>
      </div>
      <div class="doc-actions">
        ${artifactButton("One-page PDF", `${resumeBase}/JONATHAN_YU_SIP_STUDIES_COMBINED_RESUME_V4_CRITICAL_ON_HAND_2026-06-02.pdf`)}
        ${artifactButton("Word", `${resumeBase}/JONATHAN_YU_SIP_STUDIES_COMBINED_RESUME_V4_CRITICAL_ON_HAND_2026-06-02.docx`, "DOCX")}
        ${artifactButton("Markdown", `${resumeBase}/JONATHAN_YU_SIP_STUDIES_COMBINED_RESUME_V4_CRITICAL_ON_HAND_2026-06-02.md`, "MD")}
      </div>
    </section>
    ${renderResumeDetailsDeck()}
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
    ${renderHero("Portfolio proof", "Inspectable products, project work, public teaching, and media proof.", heroImages.projects)}
    <section class="codex-projects-intro">
      <div>
        <p class="eyebrow">Portfolio lane</p>
        <h3>The portfolio is the proof layer between the resume and OpenAI fit.</h3>
        <p>Each project is treated as a client-facing artifact: what was built, what evidence exists, and why the work matters for AI Success Engineer adoption work.</p>
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
    <section class="case-study-board" aria-label="Flagship Codex project case studies">
      <div class="case-study-head">
        <div>
          <p class="eyebrow">Flagship case studies</p>
          <h3>Lead with four stories a hiring team can actually discuss.</h3>
          <p>These are the highest-signal project examples because each one connects a real problem, process, output, validation, limitations, role relevance, and a specific interview use.</p>
        </div>
        <div class="case-study-selector" aria-label="Case study proof pattern">
          <span>Problem</span>
          <span>Process</span>
          <span>Output</span>
          <span>Validation</span>
          <span>Limitations</span>
          <span>Role relevance</span>
        </div>
      </div>
      <div class="case-study-grid">
        ${projectCaseStudies.map(projectCaseStudyCard).join("")}
      </div>
    </section>
    <section class="portfolio-grid" aria-label="Codex Projects portfolio">
      ${codexProjects
        .map(
          (project) => `
            <article class="portfolio-card">
              <span>${presentationText(project.type)}</span>
              <h3>${project.title}</h3>
              <p>${presentationText(project.body)}</p>
              <ul>${project.proof.map((item) => `<li>${presentationText(item)}</li>`).join("")}</ul>
              <div class="project-bridge">
                <b>Role bridge for ${selectedRole.title}</b>
                <p>${presentationText(project.bridge)}</p>
              </div>
              <footer>${project.path}</footer>
            </article>
          `
        )
        .join("")}
    </section>

    <section class="project-index-panel" aria-label="Full Codex project index">
      <div class="project-index-head">
        <p class="eyebrow">Full project scope from C:\\codebase\\sip_studies\\actual</p>
        <h3>The broader portfolio shows repeated product translation across domains.</h3>
        <p>Featured cards carry the interview narrative. This index gives the hiring team the full breadth behind that narrative without turning the walkthrough into a file browser.</p>
      </div>
      <div class="project-index-grid">
        ${codexProjectIndex
          .map(
            (project) => `
              <article class="project-index-card">
                <div>
                  <span>${presentationText(project.category)}</span>
                  <h4>${project.title}</h4>
                  <p>${presentationText(project.evidence)}</p>
                </div>
                <strong>${presentationText(project.roleValue)}</strong>
                <footer>${project.folder}</footer>
              </article>
            `
          )
          .join("")}
      </div>
    </section>

    ${renderRepoWebsitePreviews()}
    ${renderPortfolioMediaProof()}
    ${renderEducationMediaSections()}
  `;
}

function renderEducationMediaSections() {
  return `
    <section class="media-showcase">
      <div>
        <p class="eyebrow">Full video and reference archive</p>
        <h3>All video outlets and earlier public references live inside Portfolio.</h3>
        <p>Podcast videos, YouTube lessons, Spotify audio, Instagram reels, Flavor Blog articles, GPT guides, and Bio Site links are presented here so the portfolio reads as a complete body of public proof.</p>
      </div>
      <a class="artifact-link" href="https://open.spotify.com/show/2LSWrWDTlPOMgnZkGfUPE1" target="_blank" rel="noreferrer">AI Winecast on Spotify <span>AUDIO</span></a>
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
        <h3>Latest four Sip Studies reels can be played in the same card format.</h3>
        <p>These use Instagram embeds with the same thumbnail-backed episode cards as the YouTube sections, so the viewer can play, pause, control, and open each reel from one education tab.</p>
      </div>
      <a class="artifact-link" href="https://www.instagram.com/sip.studies/" target="_blank" rel="noreferrer">Open @sip.studies <span>REELS</span></a>
    </section>
    <section class="episode-grid episode-grid--instagram" aria-label="Latest Sip Studies Instagram reels">
      ${instagramVideos.map(mediaEpisodeCard).join("")}
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

    <section class="media-panel">
      <div>
        <p class="eyebrow">Public proof beyond the PDF</p>
        <h3>Open these when the conversation shifts from resume to audience trust</h3>
        <p>These links show Jonathan teaching, publishing, experimenting with GPT guides, and building a public education footprint around Sip Studies.</p>
      </div>
      <div class="link-grid">${[...publicLinks, ...mediaLinks].map(linkCard).join("")}</div>
    </section>

    <section class="systems-map">
      <article>
        <p class="eyebrow">Education stack</p>
        <h3>How the media supports the role story</h3>
        <div class="stack-lanes">
          <span>Live and recorded adult education</span>
          <span>Podcast/audio storytelling through AI Winecast</span>
          <span>YouTube channels for public teaching proof</span>
          <span>Substack, social posts, and reels for publishing cadence</span>
          <span>Custom GPT guides for interactive learning support</span>
        </div>
      </article>
      <article>
        <p class="eyebrow">Application translation</p>
        <h3>${selectedRole.title}</h3>
        <p>${presentationText(selectedRole.talkTrack)}</p>
        <div class="tag-cloud">${selectedRole.skills.slice(0, 8).map((skill) => `<span>${presentationText(skill)}</span>`).join("")}</div>
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
            <p>OpenAI AI Success application proof page</p>
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
            <p class="eyebrow">OpenAI AI Success Engineer application proof page</p>
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

function updateWebsiteFullscreenControls() {
  const activePreview = document.fullscreenElement;
  document.querySelectorAll("[data-preview-fullscreen]").forEach((button) => {
    const preview = button.closest("[data-website-preview]");
    const active = Boolean(preview && activePreview === preview);
    button.textContent = active ? "Exit full screen" : "Full screen";
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
document.addEventListener("fullscreenchange", updateWebsiteFullscreenControls);
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
