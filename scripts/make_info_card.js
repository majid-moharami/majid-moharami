import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUT_PATH = path.join(__dirname, '..', 'info-card.svg');

const WIDTH = 490;
const HEIGHT = 490;
const PAD_X = 24;
const TITLEBAR_H = 34;

const BG = "#0a0e14";
const BG_CARD = "#0d1117";
const BORDER_COLOR = "#30363d";
const KEY_COLOR = "#79c0ff";
const VAL_COLOR = "#e6edf3";
const MUTED = "#7d8590";
const ACCENT_GREEN = "#39d353";
const ACCENT_PURPLE = "#d2a8ff";
const ACCENT_GOLD = "#e3b341";
const ACCENT_CYAN = "#58a6ff";

const INFO_ROWS = [
  { type: "header", text: "majid@android-station" },
  { type: "divider" },
  { key: "OS", val: "Android Platform & Linux x86_64", color: VAL_COLOR },
  { key: "Role", val: "Senior Android Developer", color: ACCENT_GREEN },
  { key: "Company", val: "Myket (20M+ MAU)", color: ACCENT_GOLD },
  { key: "Languages", val: "Kotlin, Java, SQL", color: VAL_COLOR },
  { key: "Frameworks", val: "Jetpack Compose, Coroutines, Flow", color: ACCENT_CYAN },
  { key: "Architecture", val: "Clean Arch, MVVM, MVI, Multi-Module", color: VAL_COLOR },
  { key: "Libraries", val: "Hilt / Koin, Retrofit, Room, Coil", color: VAL_COLOR },
  { key: "Testing & DevOps", val: "JUnit, Mockk, CI/CD Actions, Gradle", color: VAL_COLOR },
  { key: "Experience", val: "High-scale consumer apps, UI/UX performance", color: ACCENT_PURPLE },
  { key: "Location", val: "Iran", color: MUTED },
  { key: "Contact", val: "Majid.moharami79@gmail.com", color: ACCENT_CYAN },
  { key: "LinkedIn", val: "linkedin.com/in/majid-moharami", color: KEY_COLOR },
  { type: "divider" },
  { type: "palette" }
];

function buildInfoCardSvg() {
  let contentNodes = '';
  let startY = TITLEBAR_H + 28;
  const lineSpacing = 24;

  INFO_ROWS.forEach((row, i) => {
    const delay = (0.08 + i * 0.055).toFixed(3);
    const y = startY + i * lineSpacing;

    if (row.type === "header") {
      contentNodes += `    <g class="fade-row" style="animation-delay:${delay}s">
      <text x="${PAD_X}" y="${y}" class="user-header">majid<tspan fill="${MUTED}">@</tspan><tspan fill="${ACCENT_CYAN}">android-station</tspan></text>
    </g>\n`;
    } else if (row.type === "divider") {
      contentNodes += `    <g class="fade-row" style="animation-delay:${delay}s">
      <text x="${PAD_X}" y="${y}" class="divider-line">----------------------------------------------</text>
    </g>\n`;
    } else if (row.type === "palette") {
      const colors = ["#ff5555", "#50fa7b", "#f1fa8c", "#bd93f9", "#ff79c6", "#8be9fd", "#f8f8f2", "#6272a4"];
      let blocks = '';
      colors.forEach((c, idx) => {
        blocks += `<rect x="${PAD_X + idx * 24}" y="${y - 12}" width="16" height="14" rx="3" fill="${c}" />`;
      });
      contentNodes += `    <g class="fade-row" style="animation-delay:${delay}s">
      ${blocks}
    </g>\n`;
    } else {
      contentNodes += `    <g class="fade-row" style="animation-delay:${delay}s">
      <text x="${PAD_X}" y="${y}" class="row-key">${row.key}:</text>
      <text x="${PAD_X + 116}" y="${y}" class="row-val" fill="${row.color || VAL_COLOR}">${row.val}</text>
    </g>\n`;
    }
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="100%" height="100%">
  <defs>
    <style>
      @keyframes rowSlideIn {
        0% { opacity: 0; transform: translateX(-8px); }
        100% { opacity: 1; transform: translateX(0); }
      }
      .bg { fill: ${BG}; stroke: ${BORDER_COLOR}; stroke-width: 1; rx: 10px; }
      .titlebar { fill: ${BG_CARD}; }
      .title-text { fill: #e6edf3; font-size: 11px; font-weight: 600; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
      .fade-row { animation: rowSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }
      .user-header { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 13px; font-weight: 700; fill: ${ACCENT_GREEN}; }
      .divider-line { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 11px; fill: ${MUTED}; }
      .row-key { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 11.5px; font-weight: 600; fill: ${KEY_COLOR}; }
      .row-val { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 11.5px; }
    </style>
  </defs>

  <!-- Background Card -->
  <rect width="${WIDTH}" height="${HEIGHT}" class="bg" />

  <!-- Terminal Header -->
  <path d="M 0 10 Q 0 0 10 0 L ${WIDTH - 10} 0 Q ${WIDTH} 0 ${WIDTH} 10 L ${WIDTH} ${TITLEBAR_H} L 0 ${TITLEBAR_H} Z" class="titlebar" />
  <line x1="0" y1="${TITLEBAR_H}" x2="${WIDTH}" y2="${TITLEBAR_H}" stroke="${BORDER_COLOR}" stroke-width="1" />

  <!-- Window Dots -->
  <circle cx="${PAD_X}" cy="${TITLEBAR_H / 2}" r="5" fill="#ff5f56" />
  <circle cx="${PAD_X + 14}" cy="${TITLEBAR_H / 2}" r="5" fill="#ffbd2e" />
  <circle cx="${PAD_X + 28}" cy="${TITLEBAR_H / 2}" r="5" fill="#27c93f" />

  <!-- Terminal Title -->
  <text x="${WIDTH / 2 + 10}" y="${TITLEBAR_H / 2 + 4}" text-anchor="middle" class="title-text">💻 neofetch --system</text>

  <!-- System Info Lines -->
  <g>
${contentNodes}
  </g>
</svg>`;
}

function main() {
  const svg = buildInfoCardSvg();
  fs.writeFileSync(OUT_PATH, svg, 'utf-8');
  console.log(`Generated ${OUT_PATH} (${WIDTH}x${HEIGHT})`);
}

main();
