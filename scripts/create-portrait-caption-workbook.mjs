import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildCaptionRows,
  captionWorkbookFilename,
  writeCaptionWorkbook
} from "./portrait-caption-xlsx.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const portraitDir = path.join(root, "public", "assets", "portrait");
const outPath = path.join(portraitDir, "Jonathan_Yu_Portrait_Caption_Workbook.docx");
const xlsxOutPath = path.join(portraitDir, captionWorkbookFilename);
const imagePattern = /\.(jpe?g|png)$/i;
const emuPerInch = 914400;
const maxWidthEmu = 6.35 * emuPerInch;
const maxHeightEmu = 4.25 * emuPerInch;

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function titleFromName(name) {
  const base = path.basename(name, path.extname(name));
  if (base === "jonathan-yu-headshot") return "Selected header portrait";

  return base
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function jpegSize(buffer) {
  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) break;
    const marker = buffer[offset + 1];
    const length = buffer.readUInt16BE(offset + 2);
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return {
        width: buffer.readUInt16BE(offset + 7),
        height: buffer.readUInt16BE(offset + 5)
      };
    }
    offset += 2 + length;
  }

  return { width: 1200, height: 900 };
}

function pngSize(buffer) {
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20)
  };
}

function imageSize(buffer, ext) {
  if (/\.png$/i.test(ext)) return pngSize(buffer);
  return jpegSize(buffer);
}

function displaySize(width, height) {
  const ratio = Math.min(maxWidthEmu / width, maxHeightEmu / height);
  return {
    cx: Math.round(width * ratio),
    cy: Math.round(height * ratio)
  };
}

function textRun(text, options = {}) {
  const bold = options.bold ? "<w:b/>" : "";
  const size = options.size ? `<w:sz w:val="${options.size}"/>` : "";
  const color = options.color ? `<w:color w:val="${options.color}"/>` : "";
  const runProps = bold || size || color ? `<w:rPr>${bold}${size}${color}</w:rPr>` : "";
  return `<w:r>${runProps}<w:t>${escapeXml(text)}</w:t></w:r>`;
}

function paragraph(content, options = {}) {
  const style = options.style ? `<w:pStyle w:val="${options.style}"/>` : "";
  const align = options.align ? `<w:jc w:val="${options.align}"/>` : "";
  const spacing = options.spacing ? `<w:spacing ${options.spacing}/>` : "";
  const pageBreak = options.pageBreakBefore ? "<w:pageBreakBefore/>" : "";
  const props = style || align || spacing || pageBreak ? `<w:pPr>${style}${align}${spacing}${pageBreak}</w:pPr>` : "";
  return `<w:p>${props}${content}</w:p>`;
}

function captionLine() {
  return `
    <w:p>
      <w:pPr>
        <w:pBdr><w:bottom w:val="single" w:sz="4" w:space="1" w:color="B9A16A"/></w:pBdr>
        <w:spacing w:before="120" w:after="300"/>
      </w:pPr>
      <w:r><w:t xml:space="preserve"> </w:t></w:r>
    </w:p>
  `;
}

function imageParagraph(photo, index) {
  return `
    <w:p>
      <w:pPr><w:jc w:val="center"/></w:pPr>
      <w:r>
        <w:drawing>
          <wp:inline distT="0" distB="0" distL="0" distR="0">
            <wp:extent cx="${photo.cx}" cy="${photo.cy}"/>
            <wp:effectExtent l="0" t="0" r="0" b="0"/>
            <wp:docPr id="${index + 1}" name="${escapeXml(photo.title)}"/>
            <wp:cNvGraphicFramePr>
              <a:graphicFrameLocks noChangeAspect="1"/>
            </wp:cNvGraphicFramePr>
            <a:graphic>
              <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
                <pic:pic>
                  <pic:nvPicPr>
                    <pic:cNvPr id="${index + 1}" name="${escapeXml(photo.filename)}"/>
                    <pic:cNvPicPr/>
                  </pic:nvPicPr>
                  <pic:blipFill>
                    <a:blip r:embed="rId${index + 1}"/>
                    <a:stretch><a:fillRect/></a:stretch>
                  </pic:blipFill>
                  <pic:spPr>
                    <a:xfrm>
                      <a:off x="0" y="0"/>
                      <a:ext cx="${photo.cx}" cy="${photo.cy}"/>
                    </a:xfrm>
                    <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
                  </pic:spPr>
                </pic:pic>
              </a:graphicData>
            </a:graphic>
          </wp:inline>
        </w:drawing>
      </w:r>
    </w:p>
  `;
}

function documentXml(photos) {
  const body = [
    paragraph(textRun("Jonathan Yu Portrait Caption Workbook", { bold: true, size: 34, color: "185552" }), {
      align: "center",
      spacing: 'w:after="120"'
    }),
    paragraph(textRun("Write the context, story, event, or caption beneath each photo.", { size: 22, color: "35524E" }), {
      align: "center",
      spacing: 'w:after="360"'
    }),
    ...photos.flatMap((photo, index) => [
      paragraph(textRun(`${index + 1}. ${photo.title}`, { bold: true, size: 26, color: "185552" }), {
        pageBreakBefore: index > 0,
        spacing: 'w:after="80"'
      }),
      paragraph(textRun(photo.filename, { size: 18, color: "817985" }), {
        spacing: 'w:after="180"'
      }),
      imageParagraph(photo, index),
      paragraph(textRun("Caption / context", { bold: true, size: 22, color: "8B4513" }), {
        spacing: 'w:before="220" w:after="80"'
      }),
      captionLine(),
      captionLine(),
      captionLine(),
      captionLine()
    ])
  ].join("");

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document
  xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
  xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
  xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
  xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
  <w:body>
    ${body}
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="720" w:right="720" w:bottom="720" w:left="720" w:header="360" w:footer="360" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>`;
}

function contentTypesXml(photos) {
  const defaults = new Set(photos.map((photo) => photo.contentType));
  const imageDefaults = [...defaults]
    .flatMap((type) => {
      if (type === "image/png") {
        return [`<Default Extension="png" ContentType="${type}"/>`];
      }

      return [
        `<Default Extension="jpg" ContentType="${type}"/>`,
        `<Default Extension="jpeg" ContentType="${type}"/>`
      ];
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  ${imageDefaults}
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;
}

function packageRelsXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;
}

function documentRelsXml(photos) {
  const rels = photos
    .map(
      (photo, index) =>
        `<Relationship Id="rId${index + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/${photo.mediaName}"/>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  ${rels}
</Relationships>`;
}

function crc32(buffer) {
  const table =
    crc32.table ||
    (crc32.table = Array.from({ length: 256 }, (_, index) => {
      let value = index;
      for (let bit = 0; bit < 8; bit += 1) {
        value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
      }
      return value >>> 0;
    }));

  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc = table[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function dosDateTime(date = new Date()) {
  const year = Math.max(date.getFullYear(), 1980);
  return {
    time: (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2),
    date: ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate()
  };
}

function createZip(entries) {
  const localParts = [];
  const centralParts = [];
  let offset = 0;
  const { time, date } = dosDateTime();

  entries.forEach((entry) => {
    const nameBuffer = Buffer.from(entry.name, "utf8");
    const data = Buffer.isBuffer(entry.data) ? entry.data : Buffer.from(entry.data);
    const crc = crc32(data);
    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0, 6);
    localHeader.writeUInt16LE(0, 8);
    localHeader.writeUInt16LE(time, 10);
    localHeader.writeUInt16LE(date, 12);
    localHeader.writeUInt32LE(crc, 14);
    localHeader.writeUInt32LE(data.length, 18);
    localHeader.writeUInt32LE(data.length, 22);
    localHeader.writeUInt16LE(nameBuffer.length, 26);
    localHeader.writeUInt16LE(0, 28);

    localParts.push(localHeader, nameBuffer, data);

    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0, 8);
    centralHeader.writeUInt16LE(0, 10);
    centralHeader.writeUInt16LE(time, 12);
    centralHeader.writeUInt16LE(date, 14);
    centralHeader.writeUInt32LE(crc, 16);
    centralHeader.writeUInt32LE(data.length, 20);
    centralHeader.writeUInt32LE(data.length, 24);
    centralHeader.writeUInt16LE(nameBuffer.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(offset, 42);
    centralParts.push(centralHeader, nameBuffer);

    offset += localHeader.length + nameBuffer.length + data.length;
  });

  const centralDirectory = Buffer.concat(centralParts);
  const localFiles = Buffer.concat(localParts);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralDirectory.length, 12);
  end.writeUInt32LE(localFiles.length, 16);
  end.writeUInt16LE(0, 20);

  return Buffer.concat([localFiles, centralDirectory, end]);
}

const photos = fs
  .readdirSync(portraitDir, { withFileTypes: true })
  .filter((entry) => entry.isFile() && imagePattern.test(entry.name))
  .map((entry, index) => {
    const filename = entry.name;
    const ext = path.extname(filename).toLowerCase();
    const data = fs.readFileSync(path.join(portraitDir, filename));
    const { width, height } = imageSize(data, ext);
    const { cx, cy } = displaySize(width, height);
    const mediaExt = ext === ".png" ? ".png" : ".jpg";

    return {
      filename,
      title: titleFromName(filename),
      data,
      cx,
      cy,
      mediaName: `portrait-${String(index + 1).padStart(2, "0")}${mediaExt}`,
      contentType: ext === ".png" ? "image/png" : "image/jpeg"
    };
  })
  .sort((a, b) => {
    if (a.filename === "jonathan-yu-headshot.jpg") return -1;
    if (b.filename === "jonathan-yu-headshot.jpg") return 1;
    return a.filename.localeCompare(b.filename, undefined, { numeric: true, sensitivity: "base" });
  });

const entries = [
  { name: "[Content_Types].xml", data: contentTypesXml(photos) },
  { name: "_rels/.rels", data: packageRelsXml() },
  { name: "word/document.xml", data: documentXml(photos) },
  { name: "word/_rels/document.xml.rels", data: documentRelsXml(photos) },
  ...photos.map((photo) => ({
    name: `word/media/${photo.mediaName}`,
    data: photo.data
  }))
];

fs.writeFileSync(outPath, createZip(entries));
console.log(`Wrote ${outPath}`);
console.log(`Portrait photos included: ${photos.length}`);

const captionRows = buildCaptionRows(portraitDir, xlsxOutPath);
writeCaptionWorkbook(xlsxOutPath, captionRows);
console.log(`Wrote ${xlsxOutPath}`);
console.log(`Portrait caption rows: ${captionRows.length}`);
