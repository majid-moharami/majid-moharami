import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUT_PATH = path.join(__dirname, '..', 'architect-card.svg');

const WIDTH = 420;
const HEIGHT = 470;
const PAD_X = 20;
const TITLEBAR_H = 36;

const BG_CARD = "#0d1117";
const BORDER_COLOR = "#30363d";
const MUTED = "#7d8590";
const TEXT = "#f0f6fc";
const ACCENT_CYAN = "#38bdf8";
const ACCENT_GREEN = "#3fb950";
const ACCENT_GOLD = "#d29922";
const ACCENT_PURPLE = "#bc8cff";

function buildArchitectSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif">
  <defs>
    <linearGradient id="archBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0e14" />
      <stop offset="60%" stop-color="#0d1117" />
      <stop offset="100%" stop-color="#111827" />
    </linearGradient>
    <linearGradient id="barGreen" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#238636" />
      <stop offset="100%" stop-color="#3fb950" />
    </linearGradient>
    <linearGradient id="barCyan" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1f6feb" />
      <stop offset="100%" stop-color="#38bdf8" />
    </linearGradient>
    <linearGradient id="barPurple" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#8957e5" />
      <stop offset="100%" stop-color="#bc8cff" />
    </linearGradient>
    <linearGradient id="barGold" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#9e6a03" />
      <stop offset="100%" stop-color="#d29922" />
    </linearGradient>
    <style>
      @keyframes fadeUp {
        0% { opacity: 0; transform: translateY(6px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      @keyframes growBar {
        0% { transform: scaleX(0); }
        100% { transform: scaleX(1); }
      }
      @keyframes pulseGlow {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.4; transform: scale(0.9); }
      }
      .bg { fill: url(#archBg); stroke: ${BORDER_COLOR}; stroke-width: 1; rx: 10px; }
      .titlebar { fill: ${BG_CARD}; }
      .title-text { fill: #8b949e; font-size: 11px; font-weight: 500; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
      .tag-lead { fill: ${ACCENT_GREEN}; font-size: 9px; font-weight: 700; font-family: ui-monospace, monospace; }
      .metric-box { fill: #161b22; stroke: #30363d; stroke-width: 1; rx: 7px; }
      .sec-title { fill: #8b949e; font-size: 9.5px; font-weight: 700; letter-spacing: 0.8px; font-family: ui-monospace, SFMono-Regular, monospace; }
      .lbl-val { fill: ${TEXT}; font-size: 14.5px; font-weight: 700; font-family: ui-monospace, SFMono-Regular, monospace; }
      .lbl-desc { fill: ${MUTED}; font-size: 9.5px; font-weight: 500; }
      .skill-name { fill: #e6edf3; font-size: 10.5px; font-weight: 600; font-family: ui-monospace, SFMono-Regular, monospace; }
      .skill-pct { fill: #8b949e; font-size: 9.5px; font-weight: 600; font-family: ui-monospace, SFMono-Regular, monospace; }
      .bar-track { fill: #21262d; rx: 3px; }
      .bar-fill { rx: 3px; transform-origin: left center; animation: growBar 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
      .status-pill { fill: #1f6feb; fill-opacity: 0.12; stroke: #38bdf8; stroke-width: 1; stroke-opacity: 0.6; rx: 7px; }
      .status-text { fill: #38bdf8; font-size: 10px; font-weight: 600; font-family: ui-monospace, SFMono-Regular, monospace; }
      .live-dot { fill: ${ACCENT_GREEN}; transform-origin: center; animation: pulseGlow 2s infinite; }
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
  <text x="${WIDTH / 2}" y="${TITLEBAR_H / 2 + 4}" text-anchor="middle" class="title-text">⚡ Engineering Impact &amp; Architecture</text>
  <text x="${WIDTH - 18}" y="${TITLEBAR_H / 2 + 4}" text-anchor="end" class="tag-lead">[ IMPACT ]</text>

  <!-- SECTION 1: PRODUCTION SCALE METRICS -->
  <g class="anim-row" style="animation-delay: 0.05s">
    <text x="${PAD_X}" y="${TITLEBAR_H + 20}" class="sec-title">SCALE &amp; PRODUCTION METRICS</text>

    <!-- Metric Card 1 -->
    <rect x="${PAD_X}" y="${TITLEBAR_H + 28}" width="182" height="52" class="metric-box" />
    <text x="${PAD_X + 12}" y="${TITLEBAR_H + 48}" class="lbl-val"><tspan fill="${ACCENT_GREEN}">20M+</tspan> MAU</text>
    <text x="${PAD_X + 12}" y="${TITLEBAR_H + 66}" class="lbl-desc">High-Scale Active Users</text>

    <!-- Metric Card 2 -->
    <rect x="${PAD_X + 198}" y="${TITLEBAR_H + 28}" width="182" height="52" class="metric-box" />
    <text x="${PAD_X + 210}" y="${TITLEBAR_H + 48}" class="lbl-val"><tspan fill="${ACCENT_CYAN}">99.85%</tspan></text>
    <text x="${PAD_X + 210}" y="${TITLEBAR_H + 66}" class="lbl-desc">Crash-Free Sessions</text>

    <!-- Metric Card 3 -->
    <rect x="${PAD_X}" y="${TITLEBAR_H + 88}" width="182" height="52" class="metric-box" />
    <text x="${PAD_X + 12}" y="${TITLEBAR_H + 108}" class="lbl-val"><tspan fill="${ACCENT_PURPLE}">-40%</tspan> Startup</text>
    <text x="${PAD_X + 12}" y="${TITLEBAR_H + 126}" class="lbl-desc">Cold-Start Performance</text>

    <!-- Metric Card 4 -->
    <rect x="${PAD_X + 198}" y="${TITLEBAR_H + 88}" width="182" height="52" class="metric-box" />
    <text x="${PAD_X + 210}" y="${TITLEBAR_H + 108}" class="lbl-val"><tspan fill="${ACCENT_GOLD}">6+ Years</tspan></text>
    <text x="${PAD_X + 210}" y="${TITLEBAR_H + 126}" class="lbl-desc">Mobile Architecture Lead</text>
  </g>

  <!-- SECTION 2: CORE PROFICIENCY BARS -->
  <g class="anim-row" style="animation-delay: 0.15s">
    <text x="${PAD_X}" y="${TITLEBAR_H + 168}" class="sec-title">CORE PROFICIENCY &amp; SPECIALIZATION</text>

    <!-- Skill 1: Kotlin & Coroutines/Flow -->
    <text x="${PAD_X}" y="${TITLEBAR_H + 190}" class="skill-name">Kotlin • Coroutines • Flow</text>
    <text x="${WIDTH - PAD_X}" y="${TITLEBAR_H + 190}" text-anchor="end" class="skill-pct">98%</text>
    <rect x="${PAD_X}" y="${TITLEBAR_H + 196}" width="380" height="6" class="bar-track" />
    <rect x="${PAD_X}" y="${TITLEBAR_H + 196}" width="372" height="6" fill="url(#barPurple)" class="bar-fill" style="animation-delay: 0.2s" />

    <!-- Skill 2: Jetpack Compose & UI Performance -->
    <text x="${PAD_X}" y="${TITLEBAR_H + 224}" class="skill-name">Jetpack Compose &amp; Fluid UI</text>
    <text x="${WIDTH - PAD_X}" y="${TITLEBAR_H + 224}" text-anchor="end" class="skill-pct">96%</text>
    <rect x="${PAD_X}" y="${TITLEBAR_H + 230}" width="380" height="6" class="bar-track" />
    <rect x="${PAD_X}" y="${TITLEBAR_H + 230}" width="365" height="6" fill="url(#barCyan)" class="bar-fill" style="animation-delay: 0.3s" />

    <!-- Skill 3: Clean Architecture & Multi-Module -->
    <text x="${PAD_X}" y="${TITLEBAR_H + 258}" class="skill-name">Clean Arch • MVVM / MVI • Modular</text>
    <text x="${WIDTH - PAD_X}" y="${TITLEBAR_H + 258}" text-anchor="end" class="skill-pct">95%</text>
    <rect x="${PAD_X}" y="${TITLEBAR_H + 264}" width="380" height="6" class="bar-track" />
    <rect x="${PAD_X}" y="${TITLEBAR_H + 264}" width="360" height="6" fill="url(#barGreen)" class="bar-fill" style="animation-delay: 0.4s" />

    <!-- Skill 4: CI/CD & Test Automation -->
    <text x="${PAD_X}" y="${TITLEBAR_H + 292}" class="skill-name">CI/CD • Gradle • Automated Testing</text>
    <text x="${WIDTH - PAD_X}" y="${TITLEBAR_H + 292}" text-anchor="end" class="skill-pct">92%</text>
    <rect x="${PAD_X}" y="${TITLEBAR_H + 298}" width="380" height="6" class="bar-track" />
    <rect x="${PAD_X}" y="${TITLEBAR_H + 298}" width="350" height="6" fill="url(#barGold)" class="bar-fill" style="animation-delay: 0.5s" />
  </g>

  <!-- SECTION 3: RECRUITER STATUS PILL -->
  <g class="anim-row" style="animation-delay: 0.25s">
    <rect x="${PAD_X}" y="${HEIGHT - 56}" width="380" height="38" class="status-pill" />
    <circle cx="${PAD_X + 18}" cy="${HEIGHT - 37}" r="4.5" class="live-dot" />
    <text x="${PAD_X + 32}" y="${HEIGHT - 33}" class="status-text">Architecting robust Android applications at scale</text>
  </g>
</svg>`;
}

function main() {
  const svg = buildArchitectSvg();
  fs.writeFileSync(OUT_PATH, svg, 'utf-8');
  console.log(`Generated ${OUT_PATH} (${WIDTH}x${HEIGHT})`);
}

main();
