# Jonathan Yu OpenAI AI Success Application Proof Site

Vite presentation site for walking an OpenAI hiring team through Jonathan Yu's Resume, Portfolio, OpenAI Fit, and References for the AI Success Engineer - US Remote application.

## Run Locally

```powershell
npm.cmd install
npm.cmd run dev:5198
```

Detached Windows/Codex launcher:

```powershell
npm.cmd run start:detached
```

Open:

```text
http://127.0.0.1:5198/
```

Validate the presentation contract after edits:

```powershell
npm.cmd run build
npm.cmd run validate:presentation
npm.cmd run validate:contrast
```

## What It Contains

- Four walkthrough steps: Resume, Portfolio, OpenAI Fit, and References.
- The left rail is the only section navigation, with each walkthrough and packet block rendered as a full-width row instead of sharing a column row; the command center is context and proof only, not a second row of tab controls.
- Shareable section hashes for direct walkthrough links, such as `#resume/ai-success`, `#projects/ai-success`, `#fit/ai-success`, and `#references/ai-success`; legacy `#education/...` links are normalized into Portfolio.
- Shareable packet-document hashes on OpenAI Fit, such as `#fit/ai-success/cover-letter` and `#fit/ai-success/30-60-90`; older `#application/...` links are normalized into the Fit view.
- Dynamic browser titles and descriptions for shareable views, so direct links identify the active walkthrough step, AI Success application focus, packet document, and focus-mode state.
- A recruiter-facing proof arc in the stable command center, so Resume, Portfolio, OpenAI Fit, and References keep the same review path without duplicate section buttons.
- Persistent top-bar links for the AI Success role resume, cover letter, and 30-60-90 plan PDFs, so the full packet is reachable from any walkthrough step.
- A screen-share focus mode, available from the top bar, the `F` key, or `?focus=1`, that hides the left rail while keeping current-view context and packet links visible.
- A single AI Success Engineer application focus in the recruiter-facing UI; generated data can still carry broader packet history without asking recruiters to switch between resumes.
- A Resume-first tab sourced from `Raw Data/Jonathan_Yu_Resume_Master_Edit.xlsx`, with Profile, Experience, Certifications, Skills, Highlights, Market Scale, and Focus + Edu cards tailored to the AI Success Engineer review.
- A presenter-lens panel inside Resume that tells the viewer what to notice before moving into Portfolio and OpenAI Fit.
- Role-specific relevance notes inside each Resume timeline entry, so the same resume reads differently for the selected position without changing the workbook facts.
- Employer-facing AI positioning that describes AI-assisted product building, agentic harnessing, workflow prototyping, customer workflow translation, technical enablement, and a human-owned build process.
- A Portfolio section grounded in `C:\codebase\sip_studies\actual`, with featured case studies plus a compact local Codex project index for Sip Studies, Rose Quartz, AI Edu, Coffee Index, and Tasting Journal.
- Portfolio case studies are reviewable through problem, process, output, validation, limitations, role relevance, what AI did, and what Jonathan decided.
- A Parameter Golf-inspired review pattern that treats each project like constrained, inspectable OpenAI-style evidence: artifact, score or validation, limitation, and decision record.
- A Portfolio website screen-in-screen section for GitHub-backed repo websites, with an interactive Sipopedia iframe, same-origin static snapshots for Rose Quartz/Coffee Index/Tasting Journal, fullscreen preview controls, and GitHub repo links.
- A full Portfolio media/reference archive for AI Winecast podcast videos, Spotify audio, AARP Wine Walk Wednesdays, Sip Studies YouTube, Sip Studies Instagram reels, Flavor Blog articles, Bio Site/public social links, GPT guides, and tasting-group references.
- Latest four article cards from each Sipopedia Flavor Blog tab: SipStudies.com Blog, Sip Studies Substack, and Daily Sip, with thumbnails for every card.
- An OpenAI Fit section with a 90-second closer, a fact-checked role-source panel for the current AI Success Engineer posting, OpenAI interview lenses for hiring manager/team/HR/supervisor, packet document tabs, role-proof map, and live interview answer board.
- A selected-document panel on OpenAI Fit that keeps the active packet file actionable even when browser PDF previews are unavailable.
- Accessible OpenAI Fit document tabs with selected-state semantics and arrow/Home/End keyboard movement across Resume, Cover Letter, and 30-60-90.
- A References section after OpenAI Fit for permissioned third-party proof, with no public placeholder recommendations; linked PDFs or approved email excerpts should be added only after source and permission status are clear.
- An avant-garde parallax hero presentation for client and hiring-team walkthroughs.
- A signature-forward identity header with a portrait-ready frame and cream transparent Jonathan Yu signature mark.
- Headshot upload convention: place the file at `public/assets/portrait/jonathan-yu-headshot.jpg`.
- Clicking the header portrait opens a rotating portrait gallery generated from `public/assets/portrait` via `npm.cmd run sync:portrait`; the modal rotates every 5 seconds and includes a Pause/Resume control.
- Caption workbook command: `npm.cmd run portrait:captions`, which writes `public/assets/portrait/Jonathan_Yu_Portrait_Caption_Workbook.docx` and `public/assets/portrait/Jonathan_Yu_Portrait_Captions.xlsx`.
- The Excel caption workbook controls the gallery modal text: `Display Title - replaces filename` becomes the bold title, while `Caption / Context - can replace filename if title is blank` can either replace the filename-derived title or appear beneath a display title.
- A generated editorial resume still-life support image at `public/assets/header/resume-still-life.png`.
- Contextual Sip Studies logo placement inside the Sip Studies resume entry instead of the global header.
- Sip Studies palette alignment using the product repo's defined colors: `#d8e6da`, `#185552`, `#edd4a8`, `#817985`, `#8b4513`, and `#9fdaf5`.
- Local certification logo assets from the old resume page for MIT, SWE, WSET, and CMS credentials.
- Public channel/social links from the old resume page and Bio Site, including YouTube, Instagram, Facebook, Threads, Substack, Spotify, GPTs, and tasting-group links.
- Local PDF/DOCX/Markdown links for each role resume, cover letter, and 30-60-90 plan.
- Local V4 resume files.
- Proof pillars for Sip Studies, Sipopedia, Critical On Hand, teaching, commercial outcomes, and generated application packets.
- A local `validate:presentation` check for source workbook, AI Success default role, tab sequence, generated role data, project scope, role-source facts, packet PDF buttons, reference artifacts, playable media support, Flavor Blog article sections, required documents, and built assets.
- A local `validate:contrast` check for dark-theme panel coverage and WCAG text/background token ratios, so newer cards do not regress into cream text on light panels.

All static documents live under `public/documents/`, including reference PDFs and email exports under `public/documents/references/`, so the folder can be deployed as a standalone static site after `npm.cmd run build`.

## Presentation Research Notes

The latest presentation pass is based on a simple standard: start with the source-backed resume, move into inspectable portfolio proof, then close with the hiring decision. A busy OpenAI panel should be able to see the AI Success Engineer fit through customer adoption, workflow mapping, technical readiness, KPI framing, value realization, and field-feedback loops. Jonathan Yu is the applicant identity, and every company, product, credential, metric, public channel, and project appears only where it helps explain qualification for the selected role.
