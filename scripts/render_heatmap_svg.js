import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IN_PATH = path.join(__dirname, '..', 'data', 'contributions.json');
const OUT_PATH = path.join(__dirname, '..', 'contrib-heatmap.svg');

// GitHub green ramp: 0 (empty) to 5 (bright neon top)
const PALETTE = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353", "#69f0a0"];

const CELL = 12;
const GAP = 3;
const STEP = CELL + GAP;
const PAD = 17;
const LEFT_LABEL_W = 31;
const TOP_LABEL_H = 20;
const TITLEBAR_H = 34;

const BG = "#0a0e14";
const BG_CARD = "#0d1117";
const BORDER_COLOR = "#30363d";
const MUTED = "#7d8590";
const TEXT = "#e6edf3";
const ACCENT = "#58a6ff";
const GREEN = "#39d353";
const GOLD = "#f2cc60";

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
  const username = data.username || 'majid-moharami';

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

  const canvasW = PAD + LEFT_LABEL_W + artW + PAD;
  const statsH = 74;
  const canvasH = TITLEBAR_H + TOP_LABEL_H + artH + statsH + PAD;

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
      const delay = (ci * 0.014 + ri * 0.035).toFixed(3);

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

  const legendX = canvasW - PAD - 5 * (10 + 3) - 34;
  const legendY = TITLEBAR_H + TOP_LABEL_H + artH + 16;

  let legendBoxes = '';
  PALETTE.forEach((color, i) => {
    const lx = legendX + 28 + i * 13;
    legendBoxes += `<rect x="${lx}" y="${legendY - 8}" width="10" height="10" rx="2" fill="${color}" />`;
  });

  const statsY = TITLEBAR_H + TOP_LABEL_H + artH + 42;

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvasW} ${canvasH}" width="100%" height="100%">
  <defs>
    <style>
      @keyframes cellFade {
        0% { opacity: 0; transform: translateY(-4px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      @keyframes barFade {
        0% { opacity: 0; }
        100% { opacity: 1; }
      }
      .bg { fill: ${BG}; stroke: ${BORDER_COLOR}; stroke-width: 1; rx: 10px; }
      .titlebar { fill: ${BG_CARD}; }
      .c { animation: cellFade 0.35s cubic-bezier(0.16, 1, 0.3, 1) both; }
      .label-month { fill: ${MUTED}; font-size: 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace; }
      .label-day { fill: ${MUTED}; font-size: 9px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace; }
      .title-text { fill: ${TEXT}; font-size: 12px; font-weight: 600; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
      .legend-text { fill: ${MUTED}; font-size: 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace; }
      .stat-val { fill: ${TEXT}; font-size: 14px; font-weight: 700; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
      .stat-lbl { fill: ${MUTED}; font-size: 11px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
      .accent-green { fill: ${GREEN}; font-weight: bold; }
      .accent-gold { fill: ${GOLD}; font-weight: bold; }
      .accent-blue { fill: ${ACCENT}; font-weight: bold; }
    </style>
  </defs>

  <!-- Background Card -->
  <rect width="${canvasW}" height="${canvasH}" class="bg" />

  <!-- Terminal Header -->
  <path d="M 0 10 Q 0 0 10 0 L ${canvasW - 10} 0 Q ${canvasW} 0 ${canvasW} 10 L ${canvasW} ${TITLEBAR_H} L 0 ${TITLEBAR_H} Z" class="titlebar" />
  <line x1="0" y1="${TITLEBAR_H}" x2="${canvasW}" y2="${TITLEBAR_H}" stroke="${BORDER_COLOR}" stroke-width="1" />

  <!-- Window Dots -->
  <circle cx="${PAD}" cy="${TITLEBAR_H / 2}" r="5" fill="#ff5f56" />
  <circle cx="${PAD + 15}" cy="${TITLEBAR_H / 2}" r="5" fill="#ffbd2e" />
  <circle cx="${PAD + 30}" cy="${TITLEBAR_H / 2}" r="5" fill="#27c93f" />

  <!-- Terminal Title -->
  <text x="${canvasW / 2}" y="${TITLEBAR_H / 2 + 4}" text-anchor="middle" class="title-text">⚡ ${username} / contributions (${yearRange})</text>

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
    <text x="${legendX + 28 + PALETTE.length * 13 + 4}" y="${legendY}" class="legend-text">More</text>
  </g>

  <!-- Divider Line -->
  <line x1="${PAD}" y1="${TITLEBAR_H + TOP_LABEL_H + artH + 28}" x2="${canvasW - PAD}" y2="${TITLEBAR_H + TOP_LABEL_H + artH + 28}" stroke="${BORDER_COLOR}" stroke-width="1" stroke-dasharray="4,4" />

  <!-- Stats Footer -->
  <g>
    <!-- Total Contributions -->
    <text x="${PAD + 10}" y="${statsY}" class="stat-lbl">Year Total</text>
    <text x="${PAD + 10}" y="${statsY + 18}" class="stat-val"><tspan class="accent-green">${stats.total.toLocaleString()}</tspan> commits</text>

    <!-- Current Streak -->
    <text x="${PAD + 260}" y="${statsY}" class="stat-lbl">Current Streak</text>
    <text x="${PAD + 260}" y="${statsY + 18}" class="stat-val"><tspan class="accent-gold">${stats.currentStreak}</tspan> days</text>

    <!-- Longest Streak -->
    <text x="${PAD + 500}" y="${statsY}" class="stat-lbl">Longest Streak</text>
    <text x="${PAD + 500}" y="${statsY + 18}" class="stat-val"><tspan class="accent-blue">${stats.longestStreak}</tspan> days</text>
  </g>
</svg>`;

  fs.writeFileSync(OUT_PATH, svg, 'utf-8');
  console.log(`Generated ${OUT_PATH} (${canvasW}x${canvasH})`);
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
