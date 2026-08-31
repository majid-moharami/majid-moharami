import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUT_PATH = path.join(__dirname, '..', 'developer-card.svg');

const WIDTH = 420;
const HEIGHT = 470;
const PAD_X = 20;
const TITLEBAR_H = 36;

const BG_CARD = "#0d1117";
const BORDER_COLOR = "#30363d";
const MUTED = "#7d8590";
const TEXT = "#f0f6fc";
const ACCENT_GREEN = "#3fb950";
const ACCENT_CYAN = "#38bdf8";
const ACCENT_PURPLE = "#bc8cff";
const ACCENT_GOLD = "#d29922";

function buildDeveloperSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif">
  <defs>
    <linearGradient id="devBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0e14" />
      <stop offset="100%" stop-color="#0d1117" />
    </linearGradient>
    <style>
      @keyframes fadeUp {
        0% { opacity: 0; transform: translateY(6px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      .bg { fill: url(#devBg); stroke: ${BORDER_COLOR}; stroke-width: 1; rx: 10px; }
      .titlebar { fill: ${BG_CARD}; }
      .title-text { fill: #8b949e; font-size: 11px; font-weight: 500; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
      .tag-role { fill: ${ACCENT_PURPLE}; font-size: 9px; font-weight: 700; font-family: ui-monospace, monospace; }
      .sec-title { fill: #8b949e; font-size: 9.5px; font-weight: 700; letter-spacing: 0.8px; font-family: ui-monospace, SFMono-Regular, monospace; }
      .dev-name { fill: ${TEXT}; font-size: 17px; font-weight: 700; font-family: ui-monospace, SFMono-Regular, monospace; }
      .dev-title { fill: ${ACCENT_GREEN}; font-size: 12px; font-weight: 600; font-family: ui-monospace, SFMono-Regular, monospace; }
      .dev-company { fill: ${ACCENT_GOLD}; font-size: 11px; font-weight: 500; }
      .bio-text { fill: #c9d1d9; font-size: 11px; font-weight: 400; line-height: 1.5; }
      .badge-chip { fill: #161b22; stroke: #30363d; stroke-width: 1; rx: 4px; }
      .badge-txt { fill: #e6edf3; font-size: 10px; font-weight: 600; font-family: ui-monospace, SFMono-Regular, monospace; }
      .contact-box { fill: #161b22; stroke: #30363d; stroke-width: 1; rx: 6px; }
      .contact-lbl { fill: #8b949e; font-size: 10px; font-weight: 600; font-family: ui-monospace, SFMono-Regular, monospace; }
      .contact-val { fill: ${ACCENT_CYAN}; font-size: 10.5px; font-weight: 600; font-family: ui-monospace, SFMono-Regular, monospace; }
      .anim-row { animation: fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }
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
  <text x="${WIDTH / 2}" y="${TITLEBAR_H / 2 + 4}" text-anchor="middle" class="title-text">👤 majid.profile // executive</text>
  <text x="${WIDTH - 18}" y="${TITLEBAR_H / 2 + 4}" text-anchor="end" class="tag-role">[ ANDROID ]</text>

  <!-- SECTION 1: HEADER & IDENTITY -->
  <g class="anim-row" style="animation-delay: 0.05s">
    <text x="${PAD_X}" y="${TITLEBAR_H + 26}" class="dev-name">Majid Moharami</text>
    <text x="${PAD_X}" y="${TITLEBAR_H + 46}" class="dev-title">Senior Android Developer • Mobile Architect</text>
    <text x="${PAD_X}" y="${TITLEBAR_H + 64}" class="dev-company">🏢 Myket — Top Android Marketplace (20M+ MAU)</text>
    <text x="${PAD_X}" y="${TITLEBAR_H + 82}" class="bio-text">Specialized in building high-concurrency, reactive Android</text>
    <text x="${PAD_X}" y="${TITLEBAR_H + 98}" class="bio-text">architectures with 99.8%+ crash-free reliability at scale.</text>
  </g>

  <!-- Divider Line -->
  <line x1="${PAD_X}" y1="${TITLEBAR_H + 112}" x2="${WIDTH - PAD_X}" y2="${TITLEBAR_H + 112}" stroke="${BORDER_COLOR}" stroke-width="1" stroke-dasharray="3,3" />

  <!-- SECTION 2: TECH ARSENAL CHIPS -->
  <g class="anim-row" style="animation-delay: 0.15s">
    <text x="${PAD_X}" y="${TITLEBAR_H + 132}" class="sec-title">TECH ARSENAL &amp; ECOSYSTEM</text>

    <!-- Row 1 Badges -->
    <rect x="${PAD_X}" y="${TITLEBAR_H + 142}" width="68" height="24" class="badge-chip" />
    <text x="${PAD_X + 34}" y="${TITLEBAR_H + 158}" text-anchor="middle" class="badge-txt" fill="${ACCENT_PURPLE}">Kotlin</text>

    <rect x="${PAD_X + 74}" y="${TITLEBAR_H + 142}" width="124" height="24" class="badge-chip" />
    <text x="${PAD_X + 136}" y="${TITLEBAR_H + 158}" text-anchor="middle" class="badge-txt" fill="${ACCENT_CYAN}">Jetpack Compose</text>

    <rect x="${PAD_X + 204}" y="${TITLEBAR_H + 142}" width="90" height="24" class="badge-chip" />
    <text x="${PAD_X + 249}" y="${TITLEBAR_H + 158}" text-anchor="middle" class="badge-txt" fill="${ACCENT_PURPLE}">Coroutines</text>

    <rect x="${PAD_X + 300}" y="${TITLEBAR_H + 142}" width="80" height="24" class="badge-chip" />
    <text x="${PAD_X + 340}" y="${TITLEBAR_H + 158}" text-anchor="middle" class="badge-txt" fill="${ACCENT_GREEN}">Flow / MVI</text>

    <!-- Row 2 Badges -->
    <rect x="${PAD_X}" y="${TITLEBAR_H + 172}" width="92" height="24" class="badge-chip" />
    <text x="${PAD_X + 46}" y="${TITLEBAR_H + 188}" text-anchor="middle" class="badge-txt" fill="${ACCENT_CYAN}">Clean Arch</text>

    <rect x="${PAD_X + 98}" y="${TITLEBAR_H + 172}" width="90" height="24" class="badge-chip" />
    <text x="${PAD_X + 143}" y="${TITLEBAR_H + 188}" text-anchor="middle" class="badge-txt" fill="${ACCENT_PURPLE}">Hilt / Koin</text>

    <rect x="${PAD_X + 194}" y="${TITLEBAR_H + 172}" width="86" height="24" class="badge-chip" />
    <text x="${PAD_X + 237}" y="${TITLEBAR_H + 188}" text-anchor="middle" class="badge-txt" fill="${ACCENT_GOLD}">Room DB</text>

    <rect x="${PAD_X + 286}" y="${TITLEBAR_H + 172}" width="94" height="24" class="badge-chip" />
    <text x="${PAD_X + 333}" y="${TITLEBAR_H + 188}" text-anchor="middle" class="badge-txt" fill="${ACCENT_CYAN}">Retrofit / REST</text>

    <!-- Row 3 Badges -->
    <rect x="${PAD_X}" y="${TITLEBAR_H + 202}" width="104" height="24" class="badge-chip" />
    <text x="${PAD_X + 52}" y="${TITLEBAR_H + 218}" text-anchor="middle" class="badge-txt" fill="${ACCENT_GOLD}">Multi-Module</text>

    <rect x="${PAD_X + 110}" y="${TITLEBAR_H + 202}" width="116" height="24" class="badge-chip" />
    <text x="${PAD_X + 168}" y="${TITLEBAR_H + 218}" text-anchor="middle" class="badge-txt" fill="${ACCENT_GREEN}">CI/CD Pipelines</text>

    <rect x="${PAD_X + 232}" y="${TITLEBAR_H + 202}" width="148" height="24" class="badge-chip" />
    <text x="${PAD_X + 306}" y="${TITLEBAR_H + 218}" text-anchor="middle" class="badge-txt" fill="${ACCENT_PURPLE}">JUnit • Mockk • Tests</text>
  </g>

  <!-- Divider Line -->
  <line x1="${PAD_X}" y1="${TITLEBAR_H + 238}" x2="${WIDTH - PAD_X}" y2="${TITLEBAR_H + 238}" stroke="${BORDER_COLOR}" stroke-width="1" stroke-dasharray="3,3" />

  <!-- SECTION 3: DIRECT RECRUITER CONTACT -->
  <g class="anim-row" style="animation-delay: 0.25s">
    <text x="${PAD_X}" y="${TITLEBAR_H + 258}" class="sec-title">DIRECT RECRUITER CONTACT</text>

    <!-- Email Chip -->
    <rect x="${PAD_X}" y="${TITLEBAR_H + 268}" width="380" height="34" class="contact-box" />
    <text x="${PAD_X + 12}" y="${TITLEBAR_H + 289}" class="contact-lbl">EMAIL:</text>
    <text x="${PAD_X + 70}" y="${TITLEBAR_H + 289}" class="contact-val">Majid.moharami79@gmail.com</text>

    <!-- LinkedIn Chip -->
    <rect x="${PAD_X}" y="${TITLEBAR_H + 308}" width="380" height="34" class="contact-box" />
    <text x="${PAD_X + 12}" y="${TITLEBAR_H + 329}" class="contact-lbl">LINKEDIN:</text>
    <text x="${PAD_X + 70}" y="${TITLEBAR_H + 329}" class="contact-val">linkedin.com/in/majid-moharami</text>

    <!-- Palette dots at bottom -->
    <g>
      <circle cx="${PAD_X + 10}" cy="${HEIGHT - 24}" r="5.5" fill="#ef4444" />
      <circle cx="${PAD_X + 32}" cy="${HEIGHT - 24}" r="5.5" fill="#f97316" />
      <circle cx="${PAD_X + 54}" cy="${HEIGHT - 24}" r="5.5" fill="#eab308" />
      <circle cx="${PAD_X + 76}" cy="${HEIGHT - 24}" r="5.5" fill="#22c55e" />
      <circle cx="${PAD_X + 98}" cy="${HEIGHT - 24}" r="5.5" fill="#06b6d4" />
      <circle cx="${PAD_X + 120}" cy="${HEIGHT - 24}" r="5.5" fill="#3b82f6" />
      <circle cx="${PAD_X + 142}" cy="${HEIGHT - 24}" r="5.5" fill="#a855f7" />
      <circle cx="${PAD_X + 164}" cy="${HEIGHT - 24}" r="5.5" fill="#ec4899" />
    </g>
    <text x="${WIDTH - PAD_X}" y="${HEIGHT - 20}" text-anchor="end" fill="${ACCENT_GREEN}" font-size="10px" font-weight="700" font-family="ui-monospace, monospace">&#x25CF; Open to Opportunities</text>
  </g>
</svg>`;
}

function main() {
  const svg = buildDeveloperSvg();
  fs.writeFileSync(OUT_PATH, svg, 'utf-8');
  console.log(`Generated ${OUT_PATH} (${WIDTH}x${HEIGHT})`);
}

main();
