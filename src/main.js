import "./styles.css";
import masterData from "./master-resume-data.js";
import portraitGallery from "./portrait-gallery.js";

const base = "/documents/openai-2026-06-02";
const resumeBase = "/documents/resume";
const logoBase = "/assets/logos";
const heroImages = {
  resume: "/assets/academy-realm.jpg",
  projects: "/assets/header/codex-projects-hero.png",
  education: "/assets/header/podcast-video-hero.png",
  application: "/assets/header/resume-still-life.png",
  fit: "/assets/header/hiring-close-hero.png"
};

const { roles, resume, proofPillars, evidenceChain } = masterData;
const resumeSource = masterData.source;

const modes = [
  {
    id: "resume",
    label: "01 Full Resume",
    summary: "Start with the conventional resume, then let the proof layers make the story specific."
  },
  {
    id: "projects",
    label: "02 Codex Projects",
    summary: "Shipped projects, repo evidence, and AI-assisted product work turn the resume into a body of work."
  },
  {
    id: "education",
    label: "03 Podcast + Video",
    summary: "Public teaching, media, GPT guides, and community links show communication beyond the document."
  },
  {
    id: "application",
    label: "04 Application Proof",
    summary: "Role-specific packets connect the master resume to tailored cover letters and 30-60-90 plans."
  },
  {
    id: "fit",
    label: "05 Hiring Close",
    summary: "Close with the role narrative, the proof to emphasize, and the questions to answer directly."
  }
];

const publicLinks = [
  { label: "Bio Site", handle: "SipStudies link tree", href: "https://bio.site/SipStudies" },
  { label: "Website", handle: "sipstudies.com", href: "https://sipstudies.com" },
  { label: "YouTube", handle: "@sipstudies", href: "https://youtube.com/@sipstudies" },
  { label: "Education YouTube", handle: "@jonyu836", href: "https://www.youtube.com/@jonyu836" },
  { label: "Instagram", handle: "@sip.studies", href: "https://www.instagram.com/sip.studies" },
  { label: "Facebook", handle: "SipStudies", href: "https://www.facebook.com/SipStudies" },
  { label: "Threads", handle: "@sip.studies", href: "https://www.threads.net/@sip.studies" },
  { label: "Substack", handle: "sipstudies", href: "https://sipstudies.substack.com" },
  { label: "Spotify", handle: "AI Winecast", href: "https://open.spotify.com/user/AiWinecast" }
];

const mediaLinks = [
  { label: "Sippy GPT", handle: "custom AI guide", href: "https://chat.openai.com/g/g-OI6jzBEag-sippy" },
  { label: "Pocket Sommelier", handle: "ChatGPT guide", href: "https://chatgpt.com/g/g-HV3CbKpoK-sippy-pocket-sommelier" },
  { label: "Tasting Group", handle: "WhatsApp community", href: "https://chat.whatsapp.com/BiHrIKzTYmm2O2ql7jk2DT" },
  { label: "Sip Studies Reels", handle: "Instagram video proof", href: "https://www.instagram.com/sip.studies/reel/DGwT3fXvRxt/" },
  { label: "2Knivez Reel", handle: "personal media proof", href: "https://www.instagram.com/2knivez/reel/DGw69y4RWGv/" }
];

const signalGrades = [
  {
    label: "Resume pivot clarity",
    value: "Clear",
    detail: "Each selected position gets the same core resume translated into a clear role narrative for the hiring team."
  },
  {
    label: "Proof depth",
    value: "Strong",
    detail: "Role packets, public channels, Codex Projects, product artifacts, and quantified field outcomes point to the same qualification story."
  },
  {
    label: "AI builder credibility",
    value: "Visible",
    detail: "Strong self-built AI and product work today; formal security, Python, and TypeScript proof should keep compounding."
  },
  {
    label: "Education leverage",
    value: "High",
    detail: "AARP teaching, credential stack, Sipopedia, curriculum writing, and adoption storytelling are the strongest bridge."
  }
];

const presentationMoves = [
  {
    title: "Resume first",
    body: "Start with the traditional resume so the viewer understands the person, chronology, credentials, and scope before seeing the extra proof."
  },
  {
    title: "Projects second",
    body: "Move from work history into Codex Projects: production platforms, client sites, prototypes, automation, and data tools built with Codex and Replit support."
  },
  {
    title: "Media third",
    body: "Use podcast, YouTube, public channels, and GPT guides to show education, communication, and audience-facing credibility."
  },
  {
    title: "Application close",
    body: "End with the role-specific packet, interview proof sequence, and objections already framed for the exact position being discussed."
  }
];

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
    control: "Make the sequence explicit: traditional resume evidence first, then Codex Projects, media, packet proof, and the selected role narrative."
  },
  {
    risk: "Is the founder scope focused enough?",
    control: "Show disciplined prioritization: artifact, evidence, verification, next decision. Keep the conversation anchored to the selected role."
  }
];

const credentialBadges = [
  { label: "MIT AI Strategy", img: `${logoBase}/mit-logo-red-cropped.png` },
  { label: "SWE Certified Wine Educator", img: `${logoBase}/swe-cwe.png`, href: "https://societyofwineeducators.org/education-certifications/" },
  { label: "SWE Certified Specialist of Spirits", img: `${logoBase}/swe-css.png`, href: "https://societyofwineeducators.org/education-certifications/" },
  { label: "WSET Level 3 Wine", img: `${logoBase}/wset-level-3-wine.png`, href: "https://www.wsetglobal.com" },
  { label: "WSET Level 2 Spirits", img: `${logoBase}/wset-level-2-spirits.png`, href: "https://www.wsetglobal.com" },
  { label: "WSET Level 2 Sake", initials: "WSET", href: "https://www.wsetglobal.com" },
  { label: "CMS Certified Sommelier L2", img: `${logoBase}/cms-level-2.png`, href: "https://www.mastersommeliers.org" }
];

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
    title: "Work Efficient",
    type: "Codex Project | Sales operations intake and ETL",
    path: "C:\\codebase\\sip_studies\\actual\\Work-Efficient",
    body: "Local upload website for rebuilding sales and inventory reports from source files, including Critical On Hand, Gap Analysis, incentive PowerPoints, account/item opportunity outputs, and confidence tiers.",
    proof: ["Drag-and-drop source-file intake", "PPTX incentive parsing", "Account/item opportunity exports"],
    bridge: "Shows workflow discovery and business value: turn messy field data into account actions, reports, and repeatable operating decisions."
  },
  {
    title: "FinTech Local Analyzer",
    type: "Codex Project | Local-first finance tool",
    path: "C:\\codebase\\sip_studies\\actual\\FinTech",
    body: "Streamlit finance app for personal and Sip Studies LLC analysis with KPI views, data ingestion, books, statements, AP/AR, finance coach, local SQLite storage, passcode lock, and encrypted sensitive fields.",
    proof: ["CSV/XLSX/PDF/DOCX/TXT/MD intake", "P&L, balance sheet, and cash-flow exports", "Passcode-derived encryption at rest"],
    bridge: "Shows practical care with private data, local-first workflows, financial reasoning, and analytical products that users can operate directly."
  },
  {
    title: "Magic Academy Platform",
    type: "Codex Project | Full-stack course prototype",
    path: "C:\\codebase\\sip_studies\\actual\\Armandos-Challenge",
    body: "Vite React frontend plus Express backend for course publishing, JWT login, role-based access, admin course creation, lesson uploads, video/PDF delivery, and a mock premium subscription path.",
    proof: ["Admin and student sample accounts", "Mock paywall ready for Stripe/webhooks", "Uploaded lesson-file handling"],
    bridge: "Shows education-product range beyond beverage: roles, publishing, access control, premium lessons, and learner content delivery."
  },
  {
    title: "Supporting prototypes",
    type: "Codex Project | Portfolio breadth",
    path: "C:\\codebase\\sip_studies\\actual",
    body: "Additional repos show breadth across AI education, bookkeeping workspaces, coffee indexing, tasting-journal experiments, massage concepts, pet assets, tax prep, and workflow utilities.",
    proof: ["Ai-Edu safe AI router", "Biz-Bookkeeper TypeScript workspace", "Coffee-Index and Tasting-Journal prototypes"],
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
    title: "Work Efficient",
    folder: "Work-Efficient",
    category: "Sales operations workflow",
    evidence: "Drag-and-drop intake, duplicate-safe file storage, PPTX incentive parsing, ETL analysis, confidence tiers, account/item opportunity exports.",
    roleValue: "Transforms messy field data into repeatable operating decisions and measurable account actions."
  },
  {
    title: "FinTech Local Analyzer",
    folder: "FinTech",
    category: "Local-first finance app",
    evidence: "Streamlit app with finance views, ingestion, books, statements, AP/AR, finance coach, SQLite, passcode lock, and encrypted sensitive fields.",
    roleValue: "Shows privacy-aware analytics, local data products, and practical financial workflow reasoning."
  },
  {
    title: "Magic Academy Platform",
    folder: "Armandos-Challenge",
    category: "Full-stack course prototype",
    evidence: "Vite React frontend, Express backend, JWT auth, role-based access, admin course creation, uploads, video/PDF delivery, mock subscription.",
    roleValue: "Shows education-product range across access control, publishing, premium lessons, and learner content delivery."
  },
  {
    title: "AI Edu",
    folder: "Ai-Edu",
    category: "Safe AI education prototype",
    evidence: "Supabase Edge Function ai-router for OpenAI, Anthropic, and Google, frontend-safe keys, terminology page, admin workflow, and citation guidance.",
    roleValue: "Shows secure AI integration, provider abstraction, and educational data operations."
  },
  {
    title: "Biz Bookkeeper",
    folder: "Biz-Bookkeeper",
    category: "TypeScript finance workspace",
    evidence: "pnpm monorepo with Express 5, PostgreSQL, Drizzle ORM, Zod validation, OpenAPI spec, Orval codegen, and generated React Query client.",
    roleValue: "Shows API contracts, typed data layers, generated clients, and multi-package architecture."
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
  },
  {
    title: "Tax File Prep Excel",
    folder: "Tax-File-Prep_Excel",
    category: "Document automation",
    evidence: "PowerShell-generated OpenXML workbook with statement checklist, property papers, money summary, LLC helper, formulas, and plain-language guidance.",
    roleValue: "Shows practical automation for professional handoff, structured records, and nontechnical user clarity."
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
    title: "Sip Studies Reel - DGcYlnWxP7M",
    label: "Sip Studies Instagram",
    episodeLabel: "Instagram Reel",
    theme: "Short-form education",
    publishedAt: "Latest embeddable reel",
    duration: "Reel",
    frame: "instagram",
    embedUrl: "https://www.instagram.com/reel/DGcYlnWxP7M/embed",
    href: "https://www.instagram.com/sip.studies/reel/DGcYlnWxP7M/",
    linkLabel: "Open on Instagram",
    linkKind: "REEL",
    thumbnail:
      "https://media.bio.site/sites/0a155d48-b34b-4842-8d27-a6fc05f88d84/wkZTS43CMvdqGwVvyTVq9o.jpg",
    summary: "A public @sip.studies reel from the Bio Site social grid, presented as a native Instagram video embed."
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
    summary: "A short-form tasting clip centered on Albarino and Alvarinho as approachable wine-study material."
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
    summary: "A public event reel that shows Sip Studies connected to live beverage community moments."
  },
  {
    title: "Blind Tastings",
    label: "Sip Studies Instagram",
    episodeLabel: "Instagram Reel",
    theme: "Tasting practice",
    publishedAt: "Latest embeddable reel",
    duration: "Reel",
    frame: "instagram",
    embedUrl: "https://www.instagram.com/reel/DFdKYo7RMBC/embed",
    href: "https://www.instagram.com/sip.studies/reel/DFdKYo7RMBC/",
    linkLabel: "Open on Instagram",
    linkKind: "REEL",
    thumbnail:
      "https://media.bio.site/sites/0a155d48-b34b-4842-8d27-a6fc05f88d84/dNfmzhhspeKvHxBnf87pkk.jpg",
    summary: "A blind-tasting reel that keeps the Sip Studies education proof focused on practical tasting reps."
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
        thumbnail: "https://image.thum.io/get/width/1200/crop/675/noanimate/https%3A%2F%2Fsipstudies.substack.com%2Fp%2Faustria"
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

const applicationItems = [
  {
    title: "Role-specific resume",
    body: "Uses the Master_Edit workbook as the durable source, then frames the same facts around the selected position."
  },
  {
    title: "Cover letter",
    body: "Carries the client-facing narrative: why this role, why this proof, and why the transition makes sense."
  },
  {
    title: "30-60-90 plan",
    body: "Turns the resume into first-quarter action: discovery, artifact delivery, stakeholder trust, and measurable outcomes."
  },
  {
    title: "Resume pivot notes",
    body: "Keeps the selected role narrative, proof sequence, and interview strategy in one reviewable artifact."
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

function heroMetricsFor(modeId, role = selectedRole) {
  const docKinds = Object.keys(docsFor(role)).length;
  const outputFormats = Object.values(docsFor(role)).reduce((total, doc) => total + Object.keys(doc).length, 0);

  const metricSets = {
    resume: [
      proofMetric("Career range", "10+", "Years across beverage sales, account analytics, education, live events, and AI-enabled product building.", 82),
      proofMetric("Commercial lift", "$2.291M", "Wine revenue increase at Lee's Liquor alongside 3,500+ expanded placements.", 88),
      proofMetric("Founder platform", "20,000", "Sipopedia terminology pipeline rows with citation and review metadata.", 80),
      proofMetric("Credential stack", `${resume.certs.length}`, "AI strategy, wine, spirits, sake, beer, and sommelier credentials represented in the resume.", 72)
    ],
    projects: [
      proofMetric("Project index", `${codexProjectIndex.length}`, "Portfolio projects across education platforms, client sites, sales ops, finance tools, and prototypes.", 82),
      proofMetric("Platform build", "69 + 5", "Supabase migrations plus Edge Functions in the Sip Studies production-platform proof.", 74),
      proofMetric("Terminology data", "20,000", "Sipopedia candidate rows supporting structured education, review, and source-backed terminology.", 80),
      proofMetric("Product lanes", "3", "Learn, Taste, and Connect surfaces across the Sip Studies workspace.", 70)
    ],
    education: [
      proofMetric("Playable media", `${mediaEpisodes.length + aarpWineWalkVideos.length}`, "Embedded AI Winecast, tasting, and AARP videos can be watched directly in this tab.", 80),
      proofMetric("Adult learners", "50+", "AARP Wine Walk Wednesdays served 50+ active adults through live and recorded sessions.", 76),
      proofMetric("Education reach", "All 50", "AARP education was predominantly viewed in Colorado and spanned all 50 states.", 72),
      proofMetric("Publishing lanes", `${flavorBlogCollections.length}`, "SipStudies.com Blog, Substack, and Daily Sip carry written proof alongside video and audio.", 68)
    ],
    application: [
      proofMetric("Target roles", `${roles.length}`, "OpenAI role packets built from the same Master_Edit resume source.", 76),
      proofMetric("Packet docs", `${docKinds}`, "Resume, cover letter, and 30-60-90 plan tuned to the selected position.", 70),
      proofMetric("Output formats", `${outputFormats}`, "Each selected packet can be opened as PDF, Word, or Markdown.", 72),
      proofMetric("Role proof", `${role.proof.length}`, "Selected-role proof bullets available in the interview packet.", 80)
    ],
    fit: [
      proofMetric("Selected rank", `0${role.rank}`, "Position-focus rank for the current OpenAI target role.", 78),
      proofMetric("Strengths", `${role.strengths.length}`, "Role-aligned strengths ready for the hiring conversation.", 80),
      proofMetric("Skill lens", `${Math.min(role.skills.length, 8)}`, "Skills surfaced in the selected role translation panel.", 72),
      proofMetric("Proof points", `${role.proof.length}`, "Resume-backed examples to use when closing the interview story.", 82)
    ]
  };

  return metricSets[modeId] || metricSets.resume;
}

const app = document.querySelector("#app");
let selectedRole = roles[0];
let selectedDoc = "Resume";
let selectedMode = "resume";
applyHashState();
const originalHeaderPortraitFilename = "received_408407423126180.jpeg";
let activePortraitIndex = originalPortraitIndex();
let galleryTimer = null;
let galleryOpen = false;

const portraitRotationMs = 2000;

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

function applyHashState() {
  const [modeId, roleId] = hashParts();
  if (modes.some((mode) => mode.id === modeId)) selectedMode = modeId;
  if (roleId) selectedRole = roles.find((role) => role.id === roleId) || selectedRole;
}

function updateUrlState() {
  const nextHash = `#${selectedMode}/${selectedRole.id}`;
  if (window.location.hash === nextHash) return;
  window.history.replaceState(null, "", nextHash);
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
  return `<button class="mode-button ${selectedMode === mode.id ? "is-active" : ""}" data-mode="${mode.id}" type="button">${mode.label}</button>`;
}

function roleButton(role) {
  const active = role.id === selectedRole.id ? "is-active" : "";
  return `
    <button class="role-button ${active}" data-role="${role.id}" type="button">
      <span class="role-rank">0${role.rank}</span>
      <span>
        <strong>${role.title}</strong>
        <small>${presentationText(role.headline)}</small>
      </span>
    </button>
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

function gradeCard(grade) {
  return `
    <article class="grade-card">
      <span>${presentationText(grade.label)}</span>
      <strong>${grade.value}</strong>
      <p>${presentationText(grade.detail)}</p>
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

function youtubeEmbedUrl(videoId) {
  return `https://www.youtube.com/embed/${videoId}`;
}

function episodeEmbedUrl(episode) {
  return episode.embedUrl || youtubeEmbedUrl(episode.youtubeId);
}

function mediaEpisodeCard(episode) {
  const linkLabel = episode.linkLabel || "Open on YouTube";
  const linkKind = episode.linkKind || "VIDEO";
  const href = episode.href || episode.youtubeUrl;
  const frame = episode.frame || "video";

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
        <p>${episode.summary}</p>
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
        <p>This panel keeps the Full Resume tab from becoming a static archive. It tells the viewer what to notice first, where the pivot is strongest, and how to move from chronology into proof.</p>
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

function companyMark(job) {
  if (job.logo) {
    const toneClass = job.logoTone === "dark" ? " is-dark" : "";
    return `<img class="job-logo${toneClass}" src="${job.logo}" alt="${job.company} logo" />`;
  }

  const initials = job.company
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("");

  return `<span class="company-emblem" aria-hidden="true">${initials}</span>`;
}

function jobLinks(job) {
  if (!job.links?.length) return "";
  return `<div class="job-links">${job.links.map(linkCard).join("")}</div>`;
}

function renderHero(title, subtitle, image = heroImages.resume, metricItems = heroMetricsFor(selectedMode, selectedRole)) {
  return `
    <section class="parallax-hero" style="--hero-image:url('${image}')">
      <div class="hero-image" data-parallax-depth="-0.08"></div>
      <div class="hero-copy" data-parallax-depth="0.04">
        <p class="eyebrow">Jonathan Yu resume walkthrough</p>
        <h2>${title}</h2>
        <p>${subtitle}</p>
      </div>
      <div class="hero-metrics" data-parallax-depth="0.02">
        ${metricItems.map(metricCard).join("")}
      </div>
    </section>
  `;
}

function renderRoleContext() {
  return `
    <section class="role-context">
      <div>
        <p class="eyebrow">Resume pivot focus</p>
        <h3>${selectedRole.title}</h3>
        <p>${presentationText(selectedRole.coverFocus || selectedRole.resumeSummary || selectedRole.fit)}</p>
      </div>
      <div class="role-context-meta">
        <span><b>Pivot</b>${presentationText(selectedRole.headline)}</span>
        <span><b>Proof</b>${presentationText(selectedRole.strengths?.[0] || selectedRole.fit)}</span>
        <span><b>Interview lens</b>${presentationText(selectedRole.planTheme || selectedRole.talkTrack)}</span>
      </div>
    </section>
  `;
}

function renderRoleFit() {
  return `
    ${renderHero("Hiring-team close", "Close the walkthrough with the selected role narrative, the strongest proof, the direct questions to answer, and the documents to open in the conversation.", heroImages.fit)}
    ${renderRoleContext()}
    <section class="brief-layout">
      <article class="signal-panel identity-signal">
        <p class="eyebrow">Selected role narrative</p>
        <h3>${presentationText(selectedRole.headline)}</h3>
        <p>${presentationText(selectedRole.resumeSummary)}</p>
        <div class="signal-actions">
          ${artifactButton("Role Resume", docsFor(selectedRole).Resume.pdf)}
          ${artifactButton("Cover Letter", docsFor(selectedRole)["Cover Letter"].pdf)}
          ${artifactButton("30-60-90 Plan", docsFor(selectedRole)["30-60-90"].pdf)}
        </div>
      </article>
      <div class="readiness-grid">
        ${signalGrades.map(gradeCard).join("")}
      </div>
    </section>

    <section class="executive-grid">
      <article class="evidence-chain">
        <p class="eyebrow">Strongest proof</p>
        <h3>What to emphasize in the conversation</h3>
        <div>
          ${selectedRole.strengths
            .slice(0, 5)
            .map(
              (item, index) => `
                <span>
                  <b>Point 0${index + 1}</b>
                  <strong>${presentationText(item)}</strong>
                  <em>Role-specific proof</em>
                </span>
              `
            )
            .join("")}
        </div>
      </article>
      <article class="risk-register">
        <p class="eyebrow">Interview questions</p>
        <h3>How to answer the likely questions</h3>
        <div class="risk-grid">
          ${riskControls
            .map(
              (item) => `
                <span>
                  <b>${item.risk}</b>
                  <small>${item.control}</small>
                </span>
              `
            )
            .join("")}
        </div>
      </article>
    </section>
  `;
}

function renderApplicationProof() {
  const docs = docsFor(selectedRole);
  const activeDoc = docs[selectedDoc];
  return `
    ${renderHero("Application proof packet", "The walkthrough closes with the selected role packet: resume, cover letter, 30-60-90 plan, resume pivot, and the exact interview proof sequence.", heroImages.application)}
    ${renderRoleContext()}
    <section class="role-panel">
      <div class="role-summary">
        <div class="priority">Resume pivot</div>
        <h3>${presentationText(selectedRole.headline)}</h3>
        <p>${presentationText(selectedRole.coverFocus || selectedRole.resumeSummary)}</p>
        <div class="meta-grid">
          <span><b>Core proof</b>${presentationText(selectedRole.strengths?.[0] || selectedRole.proof?.[0])}</span>
          <span><b>Portfolio proof</b>${presentationText(selectedRole.proof?.[0] || selectedRole.fit)}</span>
          <span><b>Presentation move</b>${presentationText(selectedRole.demoMove)}</span>
        </div>
      </div>
      <div class="talk-card">
        <span>Hiring-manager talk track</span>
        <p>${presentationText(selectedRole.talkTrack)}</p>
      </div>
    </section>

    <section class="document-strip">
      <div class="doc-tabs" role="tablist" aria-label="Document preview">
        ${Object.keys(docs)
          .map((name) => `<button class="doc-tab ${name === selectedDoc ? "is-active" : ""}" data-doc="${name}" type="button">${name}</button>`)
          .join("")}
      </div>
      <div class="doc-actions">
        ${artifactButton("Open PDF", activeDoc.pdf, "PDF")}
        ${artifactButton("Open Word", activeDoc.docx, "DOCX")}
        ${artifactButton("Open Markdown", activeDoc.md, "MD")}
      </div>
    </section>

    <section class="preview-grid">
      <div class="preview-frame">
        <iframe title="${selectedDoc} preview for ${selectedRole.title}" src="${activeDoc.pdf}"></iframe>
      </div>
      <div class="proof-stack">
        <h3>Why the packet qualifies him</h3>
        <ul>${selectedRole.proof.map((item) => `<li>${presentationText(item)}</li>`).join("")}</ul>
        <div class="demo-note">
          <b>Interview proof sequence</b>
          <p>Traditional resume, project artifact, public education proof, role packet, measurable outcome, next decision.</p>
        </div>
      </div>
    </section>

    <section class="principle-board">
      ${applicationItems
        .map(
          (item, index) => `
            <article class="principle-item">
              <span>0${index + 1}</span>
              <h3>${item.title}</h3>
              <p>${item.body}</p>
            </article>
          `
        )
        .join("")}
    </section>
  `;
}

function renderFullResume() {
  return `
    ${renderHero("Full resume presentation", "Begin with the conventional resume: full chronology, credentials, outcomes, public links, and source-backed experience before moving into portfolio proof.", heroImages.resume)}
    ${renderRoleContext()}
    <section class="resume-head">
      <div>
        <p class="eyebrow">Traditional resume source view</p>
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
    ${renderResumeLensPanel()}

    <section class="principle-board">
      ${presentationMoves
        .map(
          (move, index) => `
            <article class="principle-item">
              <span>0${index + 1}</span>
              <h3>${move.title}</h3>
              <p>${move.body}</p>
            </article>
          `
        )
        .join("")}
    </section>

    <section class="resume-grid">
      <aside class="resume-sidebar">
        <h3>Profile</h3>
        ${resume.profile.map((item) => `<p>${presentationText(item)}</p>`).join("")}
        <h3>Public Channels</h3>
        <div class="link-grid compact">${publicLinks.map(linkCard).join("")}</div>
        <h3>Credentials</h3>
        <div class="credential-grid">${credentialBadges.map(credentialBadge).join("")}</div>
        <ul>${resume.certs.map((item) => `<li>${item}</li>`).join("")}</ul>
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
    ${renderHero("Codex Projects", "After the traditional resume, walk through the Codex and Replit-assisted body of work: products, client sites, data tools, prototypes, and launch artifacts.", heroImages.projects)}
    ${renderRoleContext()}
    <section class="codex-projects-intro">
      <div>
        <p class="eyebrow">Portfolio section</p>
        <h3>Codex Projects is the proof layer between resume history and application fit.</h3>
        <p>Each project is treated as a client-facing artifact: what was built, what evidence exists, and why the work matters for the selected position.</p>
      </div>
      <div class="codex-projects-tags">
        <span>Codex-assisted builds</span>
        <span>Replit lineage</span>
        <span>Client websites</span>
        <span>Data workflows</span>
        <span>Education products</span>
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

    <section class="proof-grid expanded" aria-label="Workbook proof pillars">
      ${proofPillars
        .map(
          (pillar) => `
            <article class="proof-card">
              <span>${presentationText(pillar.metric)}</span>
              <h3>${presentationText(pillar.title)}</h3>
              <p>${presentationText(pillar.body)}</p>
              <div>${pillar.tags.map((tag) => `<em>${presentationText(tag)}</em>`).join("")}</div>
            </article>
          `
        )
        .join("")}
    </section>

    <section class="asset-band">
      <img src="/assets/sippy-guide.jpg" alt="Sippy guide character" />
      <img src="/assets/roma-guide.jpg" alt="Roma guide character" />
      <img src="/assets/hummin-coffee-02.jpg" alt="Hummin guide character" />
      <div>
        <h3>What Codex Projects is meant to prove</h3>
        <p>The point is not that Jonathan has a generic personal site. The point is that he can turn messy domains into usable products, documents, workflows, media, and client-facing artifacts.</p>
      </div>
    </section>
  `;
}

function renderEducationMedia() {
  return `
    ${renderHero("Podcast and video education", "The third step shows the public teaching layer as playable media: podcast videos, YouTube lessons, GPT guides, writing, communities, and proof that complex topics can be explained clearly.", heroImages.education)}
    ${renderRoleContext()}
    <section class="media-showcase">
      <div>
        <p class="eyebrow">Playable episode library</p>
        <h3>Podcast and YouTube episodes can be watched directly here.</h3>
        <p>These cards use embedded YouTube players, so a client or hiring team can press play, pause, scrub, control volume, and fullscreen without leaving the resume walkthrough.</p>
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
        <p class="eyebrow">Selected role translation</p>
        <h3>${selectedRole.title}</h3>
        <p>${presentationText(selectedRole.talkTrack)}</p>
        <div class="tag-cloud">${selectedRole.skills.slice(0, 8).map((skill) => `<span>${presentationText(skill)}</span>`).join("")}</div>
      </article>
    </section>
  `;
}

function renderWorkspace() {
  if (selectedMode === "resume") return renderFullResume();
  if (selectedMode === "projects") return renderProjects();
  if (selectedMode === "education") return renderEducationMedia();
  if (selectedMode === "application") return renderApplicationProof();
  if (selectedMode === "fit") return renderRoleFit();
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

  app.innerHTML = `
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
            <p>Resume Walkthrough</p>
            <h1>Jonathan Yu</h1>
            <span>Founder-builder translating ambiguous domains into AI-enabled products, learning experiences, and client-ready proof.</span>
          </div>
          <div class="identity-thread" aria-label="Core proof themes">
            <span>Products</span>
            <span>Teaching</span>
            <span>Adoption</span>
          </div>
        </section>
        <nav class="mode-list" aria-label="Resume walkthrough sections">
          ${modes.map(navButton).join("")}
        </nav>
        <p class="rail-label">Position focus</p>
        <nav class="role-list" aria-label="Application targets">
          ${roles.map(roleButton).join("")}
        </nav>
      </aside>
      <section class="workspace">
        <header class="topbar">
          <div>
            <p class="eyebrow">Client-facing resume presentation</p>
            <h2>${activeMode.label}</h2>
            <p class="topbar-summary">${activeMode.summary}</p>
          </div>
          <div class="top-actions">
            ${artifactButton("Master Resume", `${resumeBase}/JONATHAN_YU_SIP_STUDIES_COMBINED_RESUME_V4_CRITICAL_ON_HAND_2026-06-02.pdf`)}
            ${artifactButton("Role Resume", docsFor(selectedRole).Resume.pdf)}
            ${artifactButton("Role Cover Letter", docsFor(selectedRole)["Cover Letter"].pdf)}
          </div>
        </header>
        ${renderWorkspace()}
      </section>
    </main>
    ${renderPortraitModal()}
  `;

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

  document.querySelectorAll("[data-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedMode = button.dataset.mode;
      updateUrlState();
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  document.querySelectorAll("[data-role]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedRole = roles.find((role) => role.id === button.dataset.role);
      selectedDoc = "Resume";
      updateUrlState();
      render();
    });
  });

  document.querySelectorAll("[data-doc]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedDoc = button.dataset.doc;
      render();
    });
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
  startPortraitRotation();
}

function openPortraitGallery(index = activePortraitIndex) {
  if (!portraitGallery.length) return;
  galleryOpen = true;
  setPortraitIndex(index);
  startPortraitRotation();
}

function closePortraitGallery() {
  galleryOpen = false;
  stopPortraitRotation();
  updatePortraitModal();
}

function updateParallax() {
  const scroll = window.scrollY || 0;
  document.querySelectorAll("[data-parallax-depth]").forEach((node) => {
    const depth = Number(node.dataset.parallaxDepth || 0);
    node.style.transform = `translate3d(0, ${scroll * depth}px, 0)`;
  });
}

window.addEventListener("scroll", updateParallax, { passive: true });
window.addEventListener("hashchange", () => {
  applyHashState();
  selectedDoc = "Resume";
  render();
});
document.addEventListener("keydown", (event) => {
  if (!galleryOpen) return;

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
});

render();
