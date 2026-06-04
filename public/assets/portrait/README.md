# Portrait Asset

Place Jonathan's website headshot here:

```text
application-demo-site/public/assets/portrait/jonathan-yu-headshot.jpg
```

Recommended source image:

- Square or vertical crop
- At least 900px wide
- Natural light, direct eye contact, clean background
- Keep the face centered because the site crops the image into a square frame

If the file is missing, the site shows a polished `JY` initials fallback instead.

The site gallery is generated from image files in this folder:

```powershell
npm.cmd run sync:portrait
```

The caption workbook is generated here:

```text
application-demo-site/public/assets/portrait/Jonathan_Yu_Portrait_Caption_Workbook.docx
```

Regenerate it with:

```powershell
npm.cmd run portrait:captions
```
