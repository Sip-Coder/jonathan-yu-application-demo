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

The modal rotates through profile photos every 5 seconds and includes a Pause/Resume button.

The caption workbooks are generated here:

```text
application-demo-site/public/assets/portrait/Jonathan_Yu_Portrait_Caption_Workbook.docx
application-demo-site/public/assets/portrait/Jonathan_Yu_Portrait_Captions.xlsx
```

Regenerate it with:

```powershell
npm.cmd run portrait:captions
```

Use the Excel workbook to control the text shown under each modal photo:

- `Display Title - replaces filename`: shown as the bold gallery title.
- `Caption / Context - can replace filename if title is blank`: if Display Title is blank, this text becomes the bold title; if Display Title is filled, this text appears beneath it.
- Run `npm.cmd run sync:portrait` after editing the Excel workbook.
