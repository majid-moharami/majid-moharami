import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AVATAR_URL = process.env.AVATAR_URL || 'https://avatars.githubusercontent.com/u/68108673?v=4';
const OUT_PATH = path.join(__dirname, '..', 'ascii-portrait.svg');

// ASCII character ramp from sparse (bright) to dense (dark)
// Monochrome design: bright background becomes spaces, face and contours become characters
const RAMP = "   .:coCO%@#";

// Monospace font sizing
const FONT_SIZE = 9.8;
const CHAR_W = 5.8;
const LINE_H = 10.2;
const COLS = 56;
const ROWS = 41;

const PAD_X = 22;
const PAD_Y = 16;
const TITLEBAR_H = 34;

const BG = "#0a0e14";
const BG_CARD = "#0d1117";
const BORDER_COLOR = "#30363d";
const TEXT_COLOR = "#58a6ff"; // Cyan / Blue terminal tone
const MUTED = "#7d8590";

async function fetchAvatarBuffer() {
  console.log(`Downloading avatar from ${AVATAR_URL}...`);
  const resp = await fetch(AVATAR_URL);
  if (!resp.ok) {
    throw new Error(`Failed to fetch avatar: ${resp.status}`);
  }
  const arrayBuf = await resp.arrayBuffer();
  return Buffer.from(arrayBuf);
}

async function imageToAsciiGrid(imageBuf) {
  // Resize and convert to raw grayscale buffer
  // Aspect ratio compensation: monospace fonts are taller than wide (~2:1)
  const { data, info } = await sharp(imageBuf)
    .resize(COLS, ROWS, { fit: 'cover', position: 'top' })
    .grayscale()
    .normalize() // Boost local contrast
    .raw()
    .toBuffer({ resolveWithObject: true });

  const lines = [];
  for (let r = 0; r < ROWS; r++) {
    let line = '';
    for (let c = 0; c < COLS; c++) {
      const idx = r * COLS + c;
      const brightness = data[idx]; // 0 (dark) - 255 (bright)
      
      // Invert: subject / features (darker) map to denser ASCII characters
      // High brightness maps to blank spaces
      const rampIndex = Math.floor((1 - brightness / 255) * (RAMP.length - 1));
      const char = RAMP[Math.max(0, Math.min(RAMP.length - 1, rampIndex))];
      line += char;
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
  const canvasW = 370;
  const canvasH = 490;
  const contentW = COLS * CHAR_W;

  const rowDuration = 0.07;
  const totalTypingTime = (ROWS * rowDuration).toFixed(2);

  let clipDefs = '';
  let textNodes = '';

  lines.forEach((line, i) => {
    const y = TITLEBAR_H + PAD_Y + i * LINE_H + FONT_SIZE;
    const clipId = `row-clip-${i}`;
    const delay = (i * rowDuration).toFixed(2);

    clipDefs += `      <clipPath id="${clipId}">
        <rect x="${PAD_X}" y="${y - FONT_SIZE}" width="0" height="${LINE_H + 2}">
          <animate attributeName="width" from="0" to="${contentW + 10}" dur="${rowDuration * 1.5}s" begin="${delay}s" fill="freeze" calcMode="linear" />
        </rect>
      </clipPath>\n`;

    const escaped = escapeXml(line);
    textNodes += `    <text x="${PAD_X}" y="${y}" class="ascii-row" clip-path="url(#${clipId})">${escaped}</text>\n`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvasW} ${canvasH}" width="100%" height="100%">
  <defs>
    <style>
      .bg { fill: ${BG}; stroke: ${BORDER_COLOR}; stroke-width: 1; rx: 10px; }
      .titlebar { fill: ${BG_CARD}; }
      .title-text { fill: #e6edf3; font-size: 11px; font-weight: 600; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
      .ascii-row {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: ${FONT_SIZE}px;
        fill: ${TEXT_COLOR};
        white-space: pre;
        letter-spacing: 0px;
      }
    </style>
${clipDefs}
  </defs>

  <!-- Background Card -->
  <rect width="${canvasW}" height="${canvasH}" class="bg" />

  <!-- Terminal Header -->
  <path d="M 0 10 Q 0 0 10 0 L ${canvasW - 10} 0 Q ${canvasW} 0 ${canvasW} 10 L ${canvasW} ${TITLEBAR_H} L 0 ${TITLEBAR_H} Z" class="titlebar" />
  <line x1="0" y1="${TITLEBAR_H}" x2="${canvasW}" y2="${TITLEBAR_H}" stroke="${BORDER_COLOR}" stroke-width="1" />

  <!-- Window Dots -->
  <circle cx="${PAD_X}" cy="${TITLEBAR_H / 2}" r="5" fill="#ff5f56" />
  <circle cx="${PAD_X + 14}" cy="${TITLEBAR_H / 2}" r="5" fill="#ffbd2e" />
  <circle cx="${PAD_X + 28}" cy="${TITLEBAR_H / 2}" r="5" fill="#27c93f" />

  <!-- Terminal Title -->
  <text x="${canvasW / 2 + 10}" y="${TITLEBAR_H / 2 + 4}" text-anchor="middle" class="title-text">👤 avatar.asc</text>

  <!-- Animated ASCII Text Lines -->
  <g>
${textNodes}
  </g>
</svg>`;
}

async function main() {
  try {
    const avatarBuf = await fetchAvatarBuffer();
    const lines = await imageToAsciiGrid(avatarBuf);
    const svg = buildSvg(lines);
    fs.writeFileSync(OUT_PATH, svg, 'utf-8');
    console.log(`Generated ${OUT_PATH}`);
  } catch (err) {
    console.error('Error generating ASCII portrait:', err);
    process.exit(1);
  }
}

main();
