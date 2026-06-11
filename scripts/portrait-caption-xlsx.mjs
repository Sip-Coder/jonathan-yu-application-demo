import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

export const captionWorkbookFilename = "Jonathan_Yu_Portrait_Captions.xlsx";
export const imagePattern = /\.(jpe?g|png|webp|gif)$/i;

const headerOnlyFile = "jonathan-yu-headshot.jpg";
const originalHeaderFile = "received_408407423126180.jpeg";

const columns = [
  { key: "order", label: "Photo #", width: 10 },
  { key: "filename", label: "Filename", width: 34 },
  { key: "currentTitle", label: "Current Gallery Label", width: 30 },
  { key: "displayTitle", label: "Display Title - replaces filename", width: 42 },
  { key: "captionContext", label: "Caption / Context - can replace filename if title is blank", width: 58 },
  { key: "notes", label: "Private Notes", width: 34 }
];

export function titleFromName(name) {
  const base = path.basename(name, path.extname(name));
  if (name === headerOnlyFile) return "Jonathan Yu headshot";
  if (name === originalHeaderFile) return "Original profile photo";

  return base
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function sortedPortraitFilenames(portraitDir) {
  return fs
    .readdirSync(portraitDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && imagePattern.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => {
      if (a === headerOnlyFile) return -1;
      if (b === headerOnlyFile) return 1;
      if (a === originalHeaderFile) return -1;
      if (b === originalHeaderFile) return 1;
      return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
    });
}

function cleanText(value) {
  return String(value || "")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "")
    .trim();
}

function escapeXml(value) {
  return cleanText(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function decodeXml(value) {
  return String(value || "")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function columnName(index) {
  let value = index + 1;
  let name = "";
  while (value > 0) {
    const remainder = (value - 1) % 26;
    name = String.fromCharCode(65 + remainder) + name;
    value = Math.floor((value - 1) / 26);
  }
  return name;
}

function columnIndex(cellRef) {
  const letters = String(cellRef || "").match(/^[A-Z]+/u)?.[0] || "";
  return [...letters].reduce((total, letter) => total * 26 + letter.charCodeAt(0) - 64, 0) - 1;
}

function cellXml(value, rowIndex, columnIndexValue, style = 0) {
  const ref = `${columnName(columnIndexValue)}${rowIndex}`;
  const text = escapeXml(value);
  return `<c r="${ref}" t="inlineStr" s="${style}"><is><t>${text}</t></is></c>`;
}

function rowXml(values, rowIndex, style = 0) {
  return `<row r="${rowIndex}">${values.map((value, index) => cellXml(value, rowIndex, index, style)).join("")}</row>`;
}

function worksheetXml(rows) {
  const header = rowXml(columns.map((column) => column.label), 1, 1);
  const body = rows
    .map((row, rowOffset) => rowXml(columns.map((column) => row[column.key] || ""), rowOffset + 2))
    .join("");
  const colXml = columns
    .map((column, index) => `<col min="${index + 1}" max="${index + 1}" width="${column.width}" customWidth="1"/>`)
    .join("");

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheetViews>
    <sheetView workbookViewId="0">
      <pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/>
      <selection pane="bottomLeft" activeCell="D2" sqref="D2"/>
    </sheetView>
  </sheetViews>
  <cols>${colXml}</cols>
  <sheetData>${header}${body}</sheetData>
  <autoFilter ref="A1:F${Math.max(rows.length + 1, 2)}"/>
</worksheet>`;
}

function workbookXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="Portrait Captions" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>`;
}

function stylesXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="2">
    <font><sz val="11"/><name val="Aptos"/></font>
    <font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Aptos"/></font>
  </fonts>
  <fills count="3">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF185552"/><bgColor indexed="64"/></patternFill></fill>
  </fills>
  <borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>
  <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs count="2">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
    <xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/>
  </cellXfs>
  <cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`;
}

function contentTypesXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>`;
}

function packageRelsXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;
}

function workbookRelsXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
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

  const localFiles = Buffer.concat(localParts);
  const centralDirectory = Buffer.concat(centralParts);
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

export function writeCaptionWorkbook(workbookPath, rows) {
  const entries = [
    { name: "[Content_Types].xml", data: contentTypesXml() },
    { name: "_rels/.rels", data: packageRelsXml() },
    { name: "xl/workbook.xml", data: workbookXml() },
    { name: "xl/_rels/workbook.xml.rels", data: workbookRelsXml() },
    { name: "xl/styles.xml", data: stylesXml() },
    { name: "xl/worksheets/sheet1.xml", data: worksheetXml(rows) }
  ];

  fs.writeFileSync(workbookPath, createZip(entries));
}

function findEndOfCentralDirectory(buffer) {
  for (let index = buffer.length - 22; index >= 0; index -= 1) {
    if (buffer.readUInt32LE(index) === 0x06054b50) return index;
  }
  return -1;
}

function readZipEntries(zipPath) {
  if (!fs.existsSync(zipPath)) return new Map();
  const buffer = fs.readFileSync(zipPath);
  const endOffset = findEndOfCentralDirectory(buffer);
  if (endOffset < 0) return new Map();

  const entryCount = buffer.readUInt16LE(endOffset + 10);
  let centralOffset = buffer.readUInt32LE(endOffset + 16);
  const entries = new Map();

  for (let index = 0; index < entryCount; index += 1) {
    if (buffer.readUInt32LE(centralOffset) !== 0x02014b50) break;
    const method = buffer.readUInt16LE(centralOffset + 10);
    const compressedSize = buffer.readUInt32LE(centralOffset + 20);
    const filenameLength = buffer.readUInt16LE(centralOffset + 28);
    const extraLength = buffer.readUInt16LE(centralOffset + 30);
    const commentLength = buffer.readUInt16LE(centralOffset + 32);
    const localOffset = buffer.readUInt32LE(centralOffset + 42);
    const filename = buffer.toString("utf8", centralOffset + 46, centralOffset + 46 + filenameLength);

    const localFilenameLength = buffer.readUInt16LE(localOffset + 26);
    const localExtraLength = buffer.readUInt16LE(localOffset + 28);
    const dataStart = localOffset + 30 + localFilenameLength + localExtraLength;
    const compressed = buffer.subarray(dataStart, dataStart + compressedSize);
    let data = compressed;
    if (method === 8) data = zlib.inflateRawSync(compressed);
    if (method === 0 || method === 8) entries.set(filename, data.toString("utf8"));

    centralOffset += 46 + filenameLength + extraLength + commentLength;
  }

  return entries;
}

function textNodes(xml) {
  return [...String(xml || "").matchAll(/<t[^>]*>([\s\S]*?)<\/t>/gu)]
    .map((match) => decodeXml(match[1]))
    .join("");
}

function readSharedStrings(entries) {
  const xml = entries.get("xl/sharedStrings.xml");
  if (!xml) return [];
  return [...xml.matchAll(/<si[^>]*>([\s\S]*?)<\/si>/gu)].map((match) => textNodes(match[1]));
}

function readWorksheetRows(entries) {
  const sheet = entries.get("xl/worksheets/sheet1.xml");
  if (!sheet) return [];
  const sharedStrings = readSharedStrings(entries);

  return [...sheet.matchAll(/<row\b[^>]*>([\s\S]*?)<\/row>/gu)].map((rowMatch) => {
    const cells = [];
    for (const cellMatch of rowMatch[1].matchAll(/<c\b([^>]*)>([\s\S]*?)<\/c>/gu)) {
      const attrs = cellMatch[1];
      const body = cellMatch[2];
      const ref = attrs.match(/\br="([^"]+)"/u)?.[1] || "";
      const type = attrs.match(/\bt="([^"]+)"/u)?.[1] || "";
      const index = Math.max(0, columnIndex(ref));
      let value = "";

      if (type === "inlineStr") {
        value = textNodes(body);
      } else {
        const raw = decodeXml(body.match(/<v[^>]*>([\s\S]*?)<\/v>/u)?.[1] || "");
        value = type === "s" ? sharedStrings[Number(raw)] || "" : raw;
      }

      cells[index] = cleanText(value);
    }
    return cells;
  });
}

export function readCaptionRows(workbookPath) {
  const rows = readWorksheetRows(readZipEntries(workbookPath));
  return rows.slice(1).flatMap((row) => {
    const filename = cleanText(row[1]);
    if (!filename) return [];
    return [
      {
        order: cleanText(row[0]),
        filename,
        currentTitle: cleanText(row[2]),
        displayTitle: cleanText(row[3]),
        captionContext: cleanText(row[4]),
        notes: cleanText(row[5])
      }
    ];
  });
}

export function readCaptionMap(workbookPath) {
  return new Map(readCaptionRows(workbookPath).map((row) => [row.filename, row]));
}

export function buildCaptionRows(portraitDir, workbookPath) {
  const existingRows = readCaptionMap(workbookPath);
  return sortedPortraitFilenames(portraitDir).map((filename, index) => {
    const existing = existingRows.get(filename) || {};
    return {
      order: String(index + 1),
      filename,
      currentTitle: titleFromName(filename),
      displayTitle: existing.displayTitle || "",
      captionContext: existing.captionContext || "",
      notes: existing.notes || ""
    };
  });
}
