# Jonathan Yu Resume Walkthrough Site

Vite presentation site for walking a client or hiring team through Jonathan Yu's resume, Codex Projects portfolio, education media, and role-specific application proof.

## Deploy Snapshot

This repository is a self-contained deploy snapshot for Replit. The generated files in `src/master-resume-data.js` and `src/portrait-gallery.js` are already committed, so Replit does not need the local `Raw Data` workbook or the parent-folder generator scripts to build the site.

For source-of-truth edits, update the local `Raw Data/Jonathan_Yu_Resume_Master_Edit.xlsx` workflow first, regenerate the site data locally, then refresh this deploy snapshot.

Replit static deployment settings:

- Build command: `npm run build`
- Public directory: `dist`
- Run command for preview: `npm run dev`

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
```

## What It Contains

- Five walkthrough steps: Full Resume, Codex Projects, Podcast + Video, Application Proof, and Hiring Close.
- Shareable section hashes for direct walkthrough links, such as `#resume/codex-deployment`, `#projects/codex-deployment`, and `#education/codex-deployment`.
- Shareable packet-document hashes on Application Proof, such as `#application/codex-deployment/cover-letter` and `#application/codex-deployment/30-60-90`.
- Dynamic browser titles and descriptions for shareable views, so copied links identify the active walkthrough step, selected role, packet document, and focus-mode state.
- A copyable role brief in the interview command center that packages the selected role pivot, fit summary, talk track, proof points, strengths, skills, document links, and suggested walkthrough sequence.
- Copy confirmations use an unobtrusive live status layer, so copied links and role briefs are confirmed without disrupting the presentation.
- Persistent top-bar links for the master resume plus the selected role resume, cover letter, and 30-60-90 plan, so the full packet is reachable from any walkthrough step.
- A screen-share focus mode, available from the top bar, the `F` key, or `?focus=1`, that hides the left rail while keeping the walkthrough controls and packet links visible.
- Six OpenAI application targets as a position-focus selector, with each step reframed for the selected role.
- A full, unabridged resume tab generated from the local `Raw Data/Jonathan_Yu_Resume_Master_Edit.xlsx` source workflow.
- A presenter-lens panel inside Full Resume that tells the viewer what to notice for the selected position before moving into the rest of the portfolio.
- Role-specific relevance notes inside each Full Resume timeline entry, so the same resume reads differently for the selected position without changing the workbook facts.
- A `Codex Projects` portfolio section grounded in `C:\codebase\sip_studies\actual`, with featured case studies plus a compact full project index for Sip Studies, Rose Quartz, Work Efficient, FinTech, Magic Academy, AI Edu, Biz Bookkeeper, Coffee Index, Tasting Journal, and Tax File Prep Excel.
- A podcast/video education tab with embedded AI Winecast players, the latest four AARP Wine Walk Wednesdays videos, the latest four Sip Studies Instagram reels, thumbnails, playback controls, Substack, GPT guides, public channels, and community links.
- Latest four article cards from each Sipopedia Flavor Blog tab: SipStudies.com Blog, Sip Studies Substack, and Daily Sip, with thumbnails for every card.
- A role-specific application proof tab with local resume, cover letter, 30-60-90 plan links, and a proof matrix that maps hiring questions to the artifact that answers them.
- A selected-document panel on Application Proof that keeps the active packet file actionable even when browser PDF previews are unavailable.
- Accessible Application Proof document tabs with selected-state semantics and arrow/Home/End keyboard movement across Resume, Cover Letter, and 30-60-90.
- A hiring-team close that frames the selected role narrative, strongest proof, and likely interview questions.
- An avant-garde parallax hero presentation for client and hiring-team walkthroughs.
- A signature-forward identity header with a portrait-ready frame and cream transparent Jonathan Yu signature mark.
- Headshot upload convention: place the file at `public/assets/portrait/jonathan-yu-headshot.jpg`.
- Clicking the header portrait opens a rotating portrait gallery generated from `public/assets/portrait` via `npm.cmd run sync:portrait`.
- Caption workbook command: `npm.cmd run portrait:captions`, which writes `public/assets/portrait/Jonathan_Yu_Portrait_Caption_Workbook.docx`.
- A generated editorial resume still-life support image at `public/assets/header/resume-still-life.png`.
- Contextual Sip Studies logo placement inside the Sip Studies resume entry instead of the global header.
- Sip Studies palette alignment using the product repo's defined colors: `#d8e6da`, `#185552`, `#edd4a8`, `#817985`, `#8b4513`, and `#9fdaf5`.
- Local certification logo assets from the old resume page for MIT, SWE, WSET, and CMS credentials.
- Public channel/social links from the old resume page and Bio Site, including YouTube, Instagram, Facebook, Threads, Substack, Spotify, GPTs, and tasting-group links.
- Local PDF/DOCX/Markdown links for each role resume, cover letter, and 30-60-90 plan.
- Local V4 master resume files.
- Proof pillars for Sip Studies, Sipopedia, Critical On Hand, teaching, commercial outcomes, and generated application packets.
- A local `validate:presentation` check for source workbook, tab sequence, generated role data, project scope, playable media support, Flavor Blog article sections, required documents, and built assets.

All static documents live under `public/documents/`, so the folder can be deployed as a standalone static site after `npm.cmd run build`.

## Presentation Research Notes

The latest presentation pass is based on a simple standard: start with the traditional resume, read it through the selected role lens, then reveal the extra proof in order. `Codex Projects` is the named portfolio layer for Codex and Replit-assisted builds. Jonathan Yu is the applicant identity, and every company, product, credential, metric, public channel, and project appears only where it helps explain qualification for the selected role.
