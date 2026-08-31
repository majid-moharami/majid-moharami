import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUT_PATH = path.join(__dirname, '..', 'code-window.svg');

const WIDTH = 420;
const HEIGHT = 470;
const TITLEBAR_H = 36;
const TAB_H = 28;

const BG = "#0a0e14";
const BG_CARD = "#0d1117";
const BG_EDITOR = "#0d1117";
const BORDER_COLOR = "#30363d";
const LINE_NUM_COLOR = "#484f58";

// Kotlin IntelliJ Syntax colors
const KW = "#ff7b72";      // package, import, fun, val (Red/Pink)
const ANNO = "#d2a8ff";    // @Composable (Purple)
const TYPE = "#79c0ff";    // Developer, Architecture (Light Blue)
const STR = "#a5d6ff";     // "Majid Moharami" (Cyan/Blue)
const PROP = "#e6edf3";    // name, role (White)
const CALL = "#d2a8ff";    // listOf, RenderExcellence (Purple)
const CMT = "#8b949e";     // // 20M+ MAU (Gray)
const PUNCT = "#e6edf3";

const CODE_LINES = [
  `<tspan fill="${KW}">package</tspan> dev.majid.profile`,
  ``,
  `<tspan fill="${KW}">import</tspan> androidx.compose.runtime.*`,
  ``,
  `<tspan fill="${ANNO}">@Composable</tspan>`,
  `<tspan fill="${KW}">fun</tspan> <tspan fill="${CALL}">MajidMoharami</tspan>() {`,
  `  <tspan fill="${KW}">val</tspan> engineer = <tspan fill="${TYPE}">Developer</tspan>(`,
  `    name = <tspan fill="${STR}">"Majid Moharami"</tspan>,`,
  `    role = <tspan fill="${STR}">"Senior Android Dev"</tspan>,`,
  `    company = <tspan fill="${STR}">"Myket"</tspan>, <tspan fill="${CMT}">// 20M+ MAU</tspan>`,
  `    stack = <tspan fill="${CALL}">listOf</tspan>(`,
  `      <tspan fill="${STR}">"Kotlin"</tspan>, <tspan fill="${STR}">"Compose"</tspan>,`,
  `      <tspan fill="${STR}">"Coroutines"</tspan>, <tspan fill="${STR}">"Hilt"</tspan>`,
  `    ),`,
  `    focus = <tspan fill="${STR}">"High Performance"</tspan>`,
  `  )`,
  `  <tspan fill="${CALL}">BuildGreatApps</tspan>(engineer)`,
  `}`
];

function buildCodeSvg() {
  const lineH = 19.5;
  const startY = TITLEBAR_H + TAB_H + 18;

  let codeTspans = '';
  let lineNumbers = '';

  CODE_LINES.forEach((line, i) => {
    const y = startY + i * lineH;
    const delay = (0.04 + i * 0.035).toFixed(3);
    const lineNum = (i + 1).toString().padStart(2, ' ');

    lineNumbers += `<text x="24" y="${y}" class="line-num">${lineNum}</text>\n`;

    codeTspans += `    <g class="code-row" style="animation-delay:${delay}s">
      <text x="46" y="${y}" class="code-text">${line}</text>
    </g>\n`;
  });

  const cursorY = startY + (CODE_LINES.length - 1) * lineH;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="100%" height="100%">
  <defs>
    <linearGradient id="codeBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0e14" />
      <stop offset="100%" stop-color="#0d1117" />
    </linearGradient>
    <style>
      @keyframes rowFadeIn {
        0% { opacity: 0; transform: translateY(-4px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
      .bg { fill: url(#codeBg); stroke: ${BORDER_COLOR}; stroke-width: 1; rx: 10px; }
      .titlebar { fill: ${BG_CARD}; }
      .tab-active { fill: #161b22; stroke: ${BORDER_COLOR}; stroke-width: 1; }
      .tab-inactive { fill: transparent; }
      .title-text { fill: #8b949e; font-size: 11px; font-weight: 500; font-family: ui-monospace, "SF Mono", Menlo, monospace; }
      .tab-text { fill: #f0f6fc; font-size: 11px; font-weight: 600; font-family: ui-monospace, "SF Mono", Menlo, monospace; }
      .tab-text-inactive { fill: #8b949e; font-size: 11px; font-family: ui-monospace, "SF Mono", Menlo, monospace; }
      .line-num { fill: ${LINE_NUM_COLOR}; font-size: 11px; font-family: ui-monospace, "SF Mono", Menlo, monospace; }
      .code-row { animation: rowFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both; }
      .code-text { font-family: ui-monospace, "SF Mono", "Fira Code", "Cascadia Code", Menlo, monospace; font-size: 11.5px; fill: #e6edf3; }
      .cursor { fill: #58a6ff; animation: blink 1s step-end infinite; }
      .tag-android { fill: #3ddc84; font-size: 9px; font-weight: 700; font-family: ui-monospace, monospace; }
    </style>
  </defs>

  <!-- Background Card -->
  <rect width="${WIDTH}" height="${HEIGHT}" class="bg" />

  <!-- Titlebar -->
  <path d="M 0 10 Q 0 0 10 0 L ${WIDTH - 10} 0 Q ${WIDTH} 0 ${WIDTH} 10 L ${WIDTH} ${TITLEBAR_H} L 0 ${TITLEBAR_H} Z" class="titlebar" />
  <line x1="0" y1="${TITLEBAR_H}" x2="${WIDTH}" y2="${TITLEBAR_H}" stroke="${BORDER_COLOR}" stroke-width="1" />

  <!-- Window Controls -->
  <circle cx="18" cy="${TITLEBAR_H / 2}" r="5" fill="#ff5f56" />
  <circle cx="32" cy="${TITLEBAR_H / 2}" r="5" fill="#ffbd2e" />
  <circle cx="46" cy="${TITLEBAR_H / 2}" r="5" fill="#27c93f" />

  <!-- Title -->
  <text x="${WIDTH / 2}" y="${TITLEBAR_H / 2 + 4}" text-anchor="middle" class="title-text">Android Studio &bull; MainActivity.kt</text>
  <text x="${WIDTH - 18}" y="${TITLEBAR_H / 2 + 4}" text-anchor="end" class="tag-android">[ KOTLIN ]</text>

  <!-- Tabs Bar -->
  <rect x="0" y="${TITLEBAR_H}" width="${WIDTH}" height="${TAB_H}" fill="#0d1117" />
  <line x1="0" y1="${TITLEBAR_H + TAB_H}" x2="${WIDTH}" y2="${TITLEBAR_H + TAB_H}" stroke="${BORDER_COLOR}" stroke-width="1" />

  <!-- Tab 1 Active -->
  <rect x="14" y="${TITLEBAR_H + 4}" width="125" height="${TAB_H - 4}" rx="4" class="tab-active" />
  <text x="24" y="${TITLEBAR_H + 19}" class="tab-text">MainActivity.kt</text>
  <text x="126" y="${TITLEBAR_H + 18}" fill="#8b949e" font-size="10px" font-family="sans-serif">&times;</text>

  <!-- Tab 2 Inactive -->
  <text x="155" y="${TITLEBAR_H + 19}" class="tab-text-inactive">Architecture.kt</text>

  <!-- Editor Gutter Divider -->
  <line x1="40" y1="${TITLEBAR_H + TAB_H}" x2="40" y2="${HEIGHT - 10}" stroke="#21262d" stroke-width="1" />

  <!-- Line Numbers -->
  <g>
${lineNumbers}
  </g>

  <!-- Code Content -->
  <g>
${codeTspans}
  </g>

  <!-- Blinking Cursor -->
  <rect x="58" y="${cursorY - 11}" width="7" height="13" class="cursor" />
</svg>`;
}

function main() {
  const svg = buildCodeSvg();
  fs.writeFileSync(OUT_PATH, svg, 'utf-8');
  console.log(`Generated ${OUT_PATH} (${WIDTH}x${HEIGHT})`);
}

main();
