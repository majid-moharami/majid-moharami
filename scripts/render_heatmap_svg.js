import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IN_PATH = path.join(__dirname, '..', 'data', 'contributions.json');
const OUT_PATH = path.join(__dirname, '..', 'contrib-heatmap.svg');

// High-contrast vibrant GitHub dark palette
const PALETTE = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353", "#56ff95"];

const CELL = 12;
const GAP = 3;
const STEP = CELL + GAP; // 15
const PAD = 20;
const LEFT_LABEL_W = 32;
const TOP_LABEL_H = 22;
const TITLEBAR_H = 36;

const WIDTH = 860;
const HEIGHT = 246;

const BG_CARD = "#0d1117";
const BORDER_COLOR = "#30363d";
const MUTED = "#7d8590";
const TEXT = "#f0f6fc";
const ACCENT_GREEN = "#3fb950";
const ACCENT_GOLD = "#d29922";
const ACCENT_BLUE = "#58a6ff";

function levelFor(count) {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 10) return 3;
  if (count <= 18) return 4;
  return 5;
}

function buildGrid(days) {
  if (!days.length) return [];
  const firstDate = new Date(days[0].date + 'T00:00:00Z');
  const leadPad = firstDate.getUTCDay(); // Sunday = 0

  const grid = [];
  let col = new Array(leadPad).fill(null);

  for (const d of days) {
    const curDate = new Date(d.date + 'T00:00:00Z');
    const weekday = curDate.getUTCDay();

    while (col.length < weekday) {
      col.push(null);
    }
    col.push({
      date: d.date,
      count: d.count,
      level: levelFor(d.count)
    });

    if (col.length === 7) {
      grid.push(col);
      col = [];
    }
  }

  if (col.length > 0) {
    while (col.length < 7) {
      col.push(null);
    }
    grid.push(col);
  }

  return grid;
}

function renderSvg(data) {
  const days = data.days || [];
  const stats = data.stats || { total: 0, currentStreak: 0, longestStreak: 0 };

  const grid = buildGrid(days);
  const nCols = grid.length;
  const artW = nCols * STEP;
  const artH = 7 * STEP;

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthLabels = [];
  const seenMonths = new Set();

  grid.forEach((column, ci) => {
    for (const cell of column) {
      if (!cell) continue;
      const d = new Date(cell.date + 'T00:00:00Z');
      const key = `${d.getUTCFullYear()}-${d.getUTCMonth()}`;
      if (!seenMonths.has(key) && d.getUTCDate() <= 7) {
        seenMonths.add(key);
        monthLabels.push({ colIndex: ci, name: monthNames[d.getUTCMonth()] });
      }
      break;
    }
  });

  const startYear = days.length ? new Date(days[0].date).getUTCFullYear() : new Date().getUTCFullYear();
  const endYear = days.length ? new Date(days[days.length - 1].date).getUTCFullYear() : new Date().getUTCFullYear();
  const yearRange = startYear === endYear ? `${startYear}` : `${startYear} - ${endYear}`;

  let cellRects = '';
  grid.forEach((col, ci) => {
    col.forEach((cell, ri) => {
      if (!cell) return;
      const x = PAD + LEFT_LABEL_W + ci * STEP;
      const y = TITLEBAR_H + TOP_LABEL_H + ri * STEP;
      const color = PALETTE[cell.level];
      const delay = (ci * 0.012 + ri * 0.03).toFixed(3);

      cellRects += `      <rect class="c" x="${x}" y="${y}" width="${CELL}" height="${CELL}" rx="2.5" fill="${color}" style="animation-delay:${delay}s">
        <title>${cell.date}: ${cell.count} contribution${cell.count === 1 ? '' : 's'}</title>
      </rect>\n`;
    });
  });

  let monthTexts = '';
  monthLabels.forEach(({ colIndex, name }) => {
    const x = PAD + LEFT_LABEL_W + colIndex * STEP;
    const y = TITLEBAR_H + TOP_LABEL_H - 6;
    monthTexts += `      <text x="${x}" y="${y}" class="label-month">${name}</text>\n`;
  });

  const dayLabels = [
    { row: 1, name: "Mon" },
    { row: 3, name: "Wed" },
    { row: 5, name: "Fri" }
  ];
  let dayTexts = '';
  dayLabels.forEach(({ row, name }) => {
    const x = PAD + LEFT_LABEL_W - 8;
    const y = TITLEBAR_H + TOP_LABEL_H + row * STEP + 9;
    dayTexts += `      <text x="${x}" y="${y}" text-anchor="end" class="label-day">${name}</text>\n`;
  });

  const legendRight = WIDTH - PAD;
  const legendTotalW = 28 + PALETTE.length * 14 + 32;
  const legendX = legendRight - legendTotalW;
  const legendY = TITLEBAR_H + TOP_LABEL_H + artH + 16;

  let legendBoxes = '';
  PALETTE.forEach((color, i) => {
    const lx = legendX + 30 + i * 14;
    legendBoxes += `<rect x="${lx}" y="${legendY - 8}" width="10" height="10" rx="2" fill="${color}" />`;
  });

  const statsY = TITLEBAR_H + TOP_LABEL_H + artH + 30;
  const cardW = 260;
  const cardH = 40;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif">
  <defs>
    <linearGradient id="heatBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0e14" />
      <stop offset="100%" stop-color="#0d1117" />
    </linearGradient>
    <style>
      @keyframes cellFade {
        0% { opacity: 0; transform: translateY(-4px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      .bg { fill: url(#heatBg); stroke: ${BORDER_COLOR}; stroke-width: 1; rx: 10px; }
      .titlebar { fill: ${BG_CARD}; }
      .chip-bg { fill: #161b22; stroke: #30363d; stroke-width: 1; rx: 6px; }
      .c { animation: cellFade 0.35s cubic-bezier(0.16, 1, 0.3, 1) both; }
      .label-month { fill: ${MUTED}; font-size: 10px; font-weight: 500; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace; }
      .label-day { fill: ${MUTED}; font-size: 9px; font-weight: 500; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace; }
      .title-text { fill: ${TEXT}; font-size: 11.5px; font-weight: 600; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
      .badge-stats { fill: #3fb950; font-size: 9px; font-weight: 700; font-family: ui-monospace, SFMono-Regular, monospace; }
      .legend-text { fill: ${MUTED}; font-size: 10px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace; }
      .chip-title { fill: ${MUTED}; font-size: 9.5px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; letter-spacing: 0.5px; }
      .chip-val { fill: ${TEXT}; font-size: 13px; font-weight: 700; font-family: ui-monospace, SFMono-Regular, monospace; }
      .accent-green { fill: ${ACCENT_GREEN}; }
      .accent-gold { fill: ${ACCENT_GOLD}; }
      .accent-blue { fill: ${ACCENT_BLUE}; }
    </style>
  </defs>

  <!-- Background Card -->
  <rect width="${WIDTH}" height="${HEIGHT}" class="bg" />

  <!-- Terminal Titlebar -->
  <path d="M 0 10 Q 0 0 10 0 L ${WIDTH - 10} 0 Q ${WIDTH} 0 ${WIDTH} 10 L ${WIDTH} ${TITLEBAR_H} L 0 ${TITLEBAR_H} Z" class="titlebar" />
  <line x1="0" y1="${TITLEBAR_H}" x2="${WIDTH}" y2="${TITLEBAR_H}" stroke="${BORDER_COLOR}" stroke-width="1" />

  <!-- Terminal Window Controls -->
  <circle cx="18" cy="${TITLEBAR_H / 2}" r="5" fill="#ff5f56" />
  <circle cx="32" cy="${TITLEBAR_H / 2}" r="5" fill="#ffbd2e" />
  <circle cx="46" cy="${TITLEBAR_H / 2}" r="5" fill="#27c93f" />

  <!-- Terminal Title & Status -->
  <text x="${WIDTH / 2}" y="${TITLEBAR_H / 2 + 4}" text-anchor="middle" class="title-text">⚡ contributions.sh • ${yearRange}</text>
  <text x="${WIDTH - 20}" y="${TITLEBAR_H / 2 + 4}" text-anchor="end" class="badge-stats">[ ${stats.total} COMMITS ]</text>

  <!-- Month & Day Labels -->
  <g>
${monthTexts}
${dayTexts}
  </g>

  <!-- Contribution Heatmap Grid -->
  <g>
${cellRects}
  </g>

  <!-- Legend -->
  <g>
    <text x="${legendX}" y="${legendY}" class="legend-text">Less</text>
    ${legendBoxes}
    <text x="${legendX + 30 + PALETTE.length * 14 + 6}" y="${legendY}" class="legend-text">More</text>
  </g>

  <!-- Bottom Metric Cards -->
  <g>
    <!-- Total Contributions Chip -->
    <rect x="${PAD}" y="${statsY}" width="${cardW}" height="${cardH}" class="chip-bg" />
    <text x="${PAD + 12}" y="${statsY + 15}" class="chip-title">YEAR CONTRIBUTIONS</text>
    <text x="${PAD + 12}" y="${statsY + 31}" class="chip-val"><tspan class="accent-green">${stats.total.toLocaleString()}</tspan> Total Commits</text>

    <!-- Current Streak Chip -->
    <rect x="${PAD + 280}" y="${statsY}" width="${cardW}" height="${cardH}" class="chip-bg" />
    <text x="${PAD + 292}" y="${statsY + 15}" class="chip-title">CURRENT STREAK</text>
    <text x="${PAD + 292}" y="${statsY + 31}" class="chip-val"><tspan class="accent-gold">${stats.currentStreak}</tspan> Days Active</text>

    <!-- Longest Streak Chip -->
    <rect x="${PAD + 560}" y="${statsY}" width="${cardW}" height="${cardH}" class="chip-bg" />
    <text x="${PAD + 572}" y="${statsY + 15}" class="chip-title">LONGEST STREAK</text>
    <text x="${PAD + 572}" y="${statsY + 31}" class="chip-val"><tspan class="accent-blue">${stats.longestStreak}</tspan> Days Consistent</text>
  </g>
</svg>`;

  fs.writeFileSync(OUT_PATH, svg, 'utf-8');
  console.log(`Generated ${OUT_PATH} (${WIDTH}x${HEIGHT})`);
}

function main() {
  if (!fs.existsSync(IN_PATH)) {
    console.error(`Input file not found: ${IN_PATH}. Run fetch_contributions.js first.`);
    process.exit(1);
  }
  const raw = fs.readFileSync(IN_PATH, 'utf-8');
  const data = JSON.parse(raw);
  renderSvg(data);
}

main();
