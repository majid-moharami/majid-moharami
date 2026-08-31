import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUT_PATH = path.join(__dirname, '..', 'info-card.svg');

const WIDTH = 420;
const HEIGHT = 470;
const PAD_X = 20;
const TITLEBAR_H = 36;

const BG_CARD = "#0d1117";
const BORDER_COLOR = "#30363d";
const MUTED = "#64748b";

const ROWS = [
  { type: "prompt", user: "majid", host: "workstation", path: "~", cmd: "fastfetch --profile" },
  { type: "divider" },
  { key: "User", val: "Majid Moharami", color: "#f8fafc", bold: true },
  { key: "Role", val: "Senior Android Developer", color: "#4ade80", bold: true },
  { key: "Company", val: "Myket (20M+ MAU)", color: "#fbbf24" },
  { key: "Experience", val: "6+ Years Mobile Eng", color: "#38bdf8" },
  { key: "Languages", val: "Kotlin, Java, SQL", color: "#f1f5f9" },
  { key: "Frameworks", val: "Compose, Coroutines, Flow", color: "#c084fc" },
  { key: "Architecture", val: "Clean Arch, MVVM, MVI", color: "#22d3ee" },
  { key: "Libraries", val: "Hilt, Retrofit, Room, Coil", color: "#e2e8f0" },
  { key: "Tooling", val: "Android Studio, Gradle, CI/CD", color: "#fb923c" },
  { key: "Testing", val: "JUnit, Mockk, UI Automation", color: "#f43f5e" },
  { key: "Location", val: "Iran", color: "#94a3b8" },
  { key: "Contact", val: "Majid.moharami79@gmail.com", color: "#38bdf8" },
  { key: "LinkedIn", val: "in/majid-moharami", color: "#60a5fa" },
  { type: "divider" },
  { type: "palette" }
];

function buildInfoCardSvg() {
  let contentNodes = '';
  const startY = TITLEBAR_H + 24;
  const lineSpacing = 22;

  ROWS.forEach((row, i) => {
    const delay = (0.04 + i * 0.035).toFixed(3);
    const y = startY + i * lineSpacing;

    if (row.type === "prompt") {
      contentNodes += `    <g class="fade-row" style="animation-delay:${delay}s">
      <text x="${PAD_X}" y="${y}" class="prompt-text">
        <tspan fill="#4ade80" font-weight="700">${row.user}</tspan><tspan fill="${MUTED}">@</tspan><tspan fill="#38bdf8" font-weight="700">${row.host}</tspan><tspan fill="${MUTED}">:</tspan><tspan fill="#fbbf24">${row.path}</tspan><tspan fill="#f8fafc"> $ </tspan><tspan fill="#f1f5f9">${row.cmd}</tspan>
      </text>
    </g>\n`;
    } else if (row.type === "divider") {
      contentNodes += `    <g class="fade-row" style="animation-delay:${delay}s">
      <line x1="${PAD_X}" y1="${y - 4}" x2="${WIDTH - PAD_X}" y2="${y - 4}" stroke="${BORDER_COLOR}" stroke-width="1" stroke-dasharray="3,3" />
    </g>\n`;
    } else if (row.type === "palette") {
      const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#a855f7", "#ec4899"];
      let dots = '';
      colors.forEach((c, idx) => {
        dots += `<circle cx="${PAD_X + 10 + idx * 24}" cy="${y - 4}" r="6.5" fill="${c}" />`;
      });
      contentNodes += `    <g class="fade-row" style="animation-delay:${delay}s">
      ${dots}
    </g>\n`;
    } else {
      const boldStyle = row.bold ? 'font-weight: 700;' : 'font-weight: 500;';
      contentNodes += `    <g class="fade-row" style="animation-delay:${delay}s">
      <text x="${PAD_X}" y="${y}" class="row-key">${row.key}:</text>
      <text x="${PAD_X + 104}" y="${y}" class="row-val" fill="${row.color}" style="${boldStyle}">${row.val}</text>
    </g>\n`;
    }
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="100%" height="100%">
  <defs>
    <linearGradient id="cardBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0e14" />
      <stop offset="100%" stop-color="#0d1117" />
    </linearGradient>
    <style>
      @keyframes rowSlideIn {
        0% { opacity: 0; transform: translateX(-8px); }
        100% { opacity: 1; transform: translateX(0); }
      }
      .bg { fill: url(#cardBg); stroke: ${BORDER_COLOR}; stroke-width: 1; rx: 10px; }
      .titlebar { fill: ${BG_CARD}; }
      .title-text { fill: #8b949e; font-size: 11px; font-weight: 500; font-family: ui-monospace, "SF Mono", Menlo, monospace; }
      .badge-sys { fill: #a855f7; font-size: 9px; font-weight: 700; font-family: ui-monospace, monospace; }
      .fade-row { animation: rowSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both; }
      .prompt-text { font-family: ui-monospace, "SF Mono", "Cascadia Code", Menlo, monospace; font-size: 11.5px; }
      .row-key { font-family: ui-monospace, "SF Mono", "Cascadia Code", Menlo, monospace; font-size: 11px; font-weight: 600; fill: #7dd3fc; }
      .row-val { font-family: ui-monospace, "SF Mono", "Cascadia Code", Menlo, monospace; font-size: 11px; }
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

  <!-- Title & Status -->
  <text x="${WIDTH / 2}" y="${TITLEBAR_H / 2 + 4}" text-anchor="middle" class="title-text">Terminal • fastfetch</text>
  <text x="${WIDTH - 18}" y="${TITLEBAR_H / 2 + 4}" text-anchor="end" class="badge-sys">[ ANDROID ]</text>

  <!-- Content -->
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
