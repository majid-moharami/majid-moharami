import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USERNAME = process.env.GH_PROFILE_USER || 'majid-moharami';
const URL = `https://github.com/users/${USERNAME}/contributions`;
const DATA_DIR = path.join(__dirname, '..', 'data');
const OUT_PATH = path.join(DATA_DIR, 'contributions.json');

async function fetchDays() {
  console.log(`Fetching contributions for @${USERNAME} from ${URL}...`);
  const resp = await fetch(URL, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });

  if (!resp.ok) {
    throw new Error(`Failed to fetch contributions: ${resp.status} ${resp.statusText}`);
  }

  const html = await resp.text();
  const $ = cheerio.load(html);

  const cells = $('td.ContributionCalendar-day');
  if (!cells.length) {
    console.error('No calendar cells found in response HTML.');
    process.exit(1);
  }

  const days = [];
  cells.each((_, el) => {
    const td = $(el);
    const date = td.attr('data-date');
    if (!date) return;

    const tdId = td.attr('id');
    let text = '';
    if (tdId) {
      const tooltip = $(`tool-tip[for="${tdId}"]`);
      text = tooltip.text().trim();
    }

    let count = 0;
    if (text && !/no contributions/i.test(text)) {
      const match = text.match(/(\d+)\s+contribution/i) || text.match(/^(\d+)/);
      if (match) {
        count = parseInt(match[1], 10);
      }
    } else {
      const level = parseInt(td.attr('data-level') || '0', 10);
      if (level > 0 && count === 0) {
        count = level; // Fallback approximation if tooltip text isn't parsed
      }
    }

    days.push({ date, count });
  });

  days.sort((a, b) => a.date.localeCompare(b.date));
  return days;
}

function computeStats(days) {
  let total = 0;
  let maxDay = { date: '', count: 0 };
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  for (const d of days) {
    total += d.count;
    if (d.count > maxDay.count) {
      maxDay = { date: d.date, count: d.count };
    }
    if (d.count > 0) {
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  }

  // Calculate current streak backward from latest day
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) {
      currentStreak++;
    } else if (i === days.length - 1) {
      // If today has 0, check yesterday
      continue;
    } else {
      break;
    }
  }

  return {
    total,
    currentStreak,
    longestStreak,
    maxDay
  };
}

async function main() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  try {
    const days = await fetchDays();
    const stats = computeStats(days);
    const result = {
      username: USERNAME,
      fetchedAt: new Date().toISOString(),
      stats,
      days
    };

    fs.writeFileSync(OUT_PATH, JSON.stringify(result, null, 2), 'utf-8');
    console.log(`Saved ${days.length} days of contributions to ${OUT_PATH}`);
    console.log(`Summary: Total: ${stats.total}, Current Streak: ${stats.currentStreak}d, Longest: ${stats.longestStreak}d`);
  } catch (err) {
    console.error('Error fetching contributions:', err);
    process.exit(1);
  }
}

main();
