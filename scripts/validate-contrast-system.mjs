import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const stylesPath = path.join(root, "src", "styles.css");
const styles = fs.readFileSync(stylesPath, "utf8");
const marker = "Sipopedia color system";
const darkStart = styles.indexOf(marker);
const darkCss = darkStart >= 0 ? styles.slice(darkStart) : "";
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

function srgbToLinear(value) {
  const channel = value / 255;
  return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const value = clean.length === 3 ? clean.split("").map((part) => part + part).join("") : clean;
  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16)
  };
}

function blend(foreground, background, alpha = 1) {
  return {
    r: Math.round(foreground.r * alpha + background.r * (1 - alpha)),
    g: Math.round(foreground.g * alpha + background.g * (1 - alpha)),
    b: Math.round(foreground.b * alpha + background.b * (1 - alpha))
  };
}

function luminance(color) {
  const r = srgbToLinear(color.r);
  const g = srgbToLinear(color.g);
  const b = srgbToLinear(color.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(foreground, background) {
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

function checkContrast(name, foreground, background, minimum = 4.5) {
  const ratio = contrastRatio(foreground, background);
  check(ratio >= minimum, `${name} contrast ${ratio.toFixed(2)} is below ${minimum}.`);
}

function selectorsForDeclaration(declaration) {
  const declarationIndex = styles.indexOf(declaration);
  if (declarationIndex < 0) return [];
  const blockStart = styles.lastIndexOf("}", declarationIndex) + 1;
  const selectorEnd = styles.indexOf("{", blockStart);
  return styles
    .slice(blockStart, selectorEnd)
    .split(",")
    .map((selector) => selector.trim())
    .filter(Boolean);
}

const panelBg = hexToRgb("#061f2c");
const strongPanelBg = hexToRgb("#031420");
const selectedText = hexToRgb("#071822");
const sipCopy = hexToRgb("#f7edd3");
const sipMuted = blend(sipCopy, panelBg, 0.76);
const sipHeading = hexToRgb("#fff3cc");
const sipCyan = hexToRgb("#9fdaf5");

check(darkStart >= 0, "Missing Sipopedia dark color-system override.");

selectorsForDeclaration("background: rgba(255, 250, 240, 0.92);").forEach((selector) => {
  check(darkCss.includes(selector), `Dark panel override is missing light-card selector ${selector}.`);
});

[
  ".source-check-panel",
  ".packet-pdf-rail",
  ".resume-details-deck",
  ".resume-detail-card",
  ".portfolio-media-proof"
].forEach((selector) => {
  check(darkCss.includes(selector), `Dark panel override is missing ${selector}.`);
});

[
  ".source-facts-grid span",
  ".source-facts-list",
  ".source-facts-list em"
].forEach((selector) => {
  check(darkCss.includes(selector), `Dark nested-surface override is missing ${selector}.`);
});

[
  ".source-check-panel p",
  ".packet-pdf-rail p",
  ".resume-details-head p",
  ".portfolio-media-proof p",
  ".resume-detail-card p",
  ".resume-detail-card li",
  ".source-facts-list li"
].forEach((selector) => {
  check(darkCss.includes(selector), `Dark muted-text override is missing ${selector}.`);
});

checkContrast("Primary copy on panel", sipCopy, panelBg);
checkContrast("Muted copy on panel", sipMuted, panelBg);
checkContrast("Heading on strong panel", sipHeading, strongPanelBg);
checkContrast("Cyan label on panel", sipCyan, panelBg);
checkContrast("Selected text on heading highlight", selectedText, sipHeading);
checkContrast("Selected text on cyan highlight", selectedText, sipCyan);

if (failures.length) {
  console.error("Contrast-system validation failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Contrast-system validation passed.");
console.log("Checked dark panel coverage and WCAG text/background token ratios.");
