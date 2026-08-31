import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AVATAR_URL = process.env.AVATAR_URL || 'https://avatars.githubusercontent.com/u/68108673?v=4';
const OUT_PATH = path.join(__dirname, '..', 'ascii-portrait.svg');

// Monospace font sizing & grid dimensions
const FONT_SIZE = 9.6;
const CHAR_W = 5.8;
const LINE_H = 10.2;
const COLS = 56;
const ROWS = 40;

const WIDTH = 370;
const HEIGHT = 490;
const PAD_X = 22;
const PAD_Y = 14;
const TITLEBAR_H = 34;

const BG = "#0a0e14";
const BG_CARD = "#0d1117";
const BORDER_COLOR = "#30363d";
const ACCENT_CYAN = "#38bdf8";
const MUTED = "#7d8590";

async function fetchAvatarBuffer() {
  console.log(`Downloading avatar from ${AVATAR_URL}...`);
  const resp = await fetch(AVATAR_URL);
  if (!resp.ok) {
    throw new Error(`Failed to fetch avatar: ${resp.status}`);
  }
  return Buffer.from(await resp.arrayBuffer());
}

async function generateAsciiLines(imageBuf) {
  // Focus on the person: crop top 85px to 445px, left 60px to 400px
  const { data } = await sharp(imageBuf)
    .extract({ left: 60, top: 85, width: 340, height: 360 })
    .resize(COLS, ROWS, { fit: 'fill' })
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const RAMP = " .:-=+*#%@";
  const lines = [];

  for (let r = 0; r < ROWS; r++) {
    let line = '';
    for (let c = 0; c < COLS; c++) {
      const b = data[r * COLS + c];
      if (b > 225) {
        line += ' '; // Blank out light background
      } else {
        // High-contrast feature mapping: darkest features get dense glyphs
        const norm = (225 - b) / 225;
        const idx = Math.min(RAMP.length - 1, Math.max(1, Math.floor(norm * (RAMP.length - 1))));
        line += RAMP[idx];
      }
    }
    lines.push(line);
  }
  return lines;
}

function escapeXml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildSvg(lines) {
  const contentW = COLS * CHAR_W;
  const rowDuration = 0.055;

  let clipDefs = '';
  let textNodes = '';

  lines.forEach((line, i) => {
    const y = TITLEBAR_H + PAD_Y + i * LINE_H + FONT_SIZE;
    const clipId = `rclip-${i}`;
    const delay = (i * rowDuration).toFixed(3);

    clipDefs += `      <clipPath id="${clipId}">
        <rect x="${PAD_X}" y="${y - FONT_SIZE}" width="0" height="${LINE_H + 1}">
          <animate attributeName="width" from="0" to="${contentW + 8}" dur="0.12s" begin="${delay}s" fill="freeze" calcMode="spline" keySplines="0.25 0.1 0.25 1" />
        </rect>
      </clipPath>\n`;

    const escaped = escapeXml(line);
    textNodes += `    <text x="${PAD_X}" y="${y}" class="ascii-row" clip-path="url(#${clipId})">${escaped}</text>\n`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0e14" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <style>
      .bg { fill: url(#bgGrad); stroke: ${BORDER_COLOR}; stroke-width: 1; rx: 10px; }
      .titlebar { fill: ${BG_CARD}; }
      .title-text { fill: #e6edf3; font-size: 11px; font-weight: 600; font-family: ui-monospace, "SF Mono", "Cascadia Code", Menlo, monospace; }
      .badge-online { fill: #38bdf8; font-size: 9px; font-weight: 700; font-family: ui-monospace, monospace; }
      .ascii-row {
        font-family: ui-monospace, "SF Mono", "Cascadia Code", "Fira Code", monospace;
        font-size: ${FONT_SIZE}px;
        font-weight: 500;
        fill: ${ACCENT_CYAN};
        white-space: pre;
        letter-spacing: 0.1px;
      }
    </style>
${clipDefs}
  </defs>

  <!-- Background Container -->
  <rect width="${WIDTH}" height="${HEIGHT}" class="bg" />

  <!-- Terminal Titlebar -->
  <path d="M 0 10 Q 0 0 10 0 L ${WIDTH - 10} 0 Q ${WIDTH} 0 ${WIDTH} 10 L ${WIDTH} ${TITLEBAR_H} L 0 ${TITLEBAR_H} Z" class="titlebar" />
  <line x1="0" y1="${TITLEBAR_H}" x2="${WIDTH}" y2="${TITLEBAR_H}" stroke="${BORDER_COLOR}" stroke-width="1" />

  <!-- Terminal Window Controls -->
  <circle cx="18" cy="${TITLEBAR_H / 2}" r="5" fill="#ff5f56" />
  <circle cx="32" cy="${TITLEBAR_H / 2}" r="5" fill="#ffbd2e" />
  <circle cx="46" cy="${TITLEBAR_H / 2}" r="5" fill="#27c93f" />

  <!-- Terminal Title & Status -->
  <text x="${WIDTH / 2 - 10}" y="${TITLEBAR_H / 2 + 4}" text-anchor="middle" class="title-text">👤 majid@avatar.asc</text>
  <text x="${WIDTH - 18}" y="${TITLEBAR_H / 2 + 4}" text-anchor="end" class="badge-online">[ LIVE ]</text>

  <!-- ASCII Art Rows -->
  <g>
${textNodes}
  </g>
</svg>`;
}

async function main() {
  try {
    const avatarBuf = await fetchAvatarBuffer();
    const lines = await generateAsciiLines(avatarBuf);
    const svg = buildSvg(lines);
    fs.writeFileSync(OUT_PATH, svg, 'utf-8');
    console.log(`Generated enhanced ${OUT_PATH} (${WIDTH}x${HEIGHT})`);
  } catch (err) {
    console.error('Error generating ASCII portrait:', err);
    process.exit(1);
  }
}

main();
