// Renders public/og/*.png (1200x630 link previews, one per top-level page) and
// the favicons from scripts/og.html and scripts/icon.html, so every generated
// image uses the site's own fonts, colours and copy. Needs Chromium:
//   pnpm exec playwright install chromium && node scripts/brand.mjs
import { mkdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';

// One row per og image. `title` and `strap` are the page's own h1 and a short
// restatement of its lede; `shot` is a screen from src/assets/screens.
const cards = [
  {
    out: 'public/og/home.png',
    title: 'Find your leaks. Build a better game.',
    strap: 'Free forever heads-up GTO. Your hands never leave your device.',
    shot: 'S1.png',
  },
  {
    out: 'public/og/how-it-works.png',
    title: 'From played hand to real improvement',
    strap:
      'Load the game you play, find the decisions that burn EV, and drill them until they stop being leaks.',
    shot: 'A1.png',
  },
  {
    out: 'public/og/solutions.png',
    title: 'Start free. Keep what you buy.',
    strap:
      'Every heads-up solution from 8bb to 200bb is free. Bigger tables are one-time packs.',
    shot: 'P1.png',
  },
  {
    out: 'public/og/accuracy.png',
    title: 'GTO you can trust',
    strap:
      'Every shipped solution is measured: under one big blind per hundred hands of exploitable error.',
    shot: 'R2.png',
  },
  {
    out: 'public/og/faq.png',
    title: 'Straight answers before you start',
    strap:
      'Free means free. Local means local. What Poker Assistant does and does not do.',
    shot: 'S2.png',
  },
  {
    out: 'public/og/learn.png',
    title: 'Learn the app. Learn the poker.',
    strap:
      'Lessons on using Poker Assistant and on the ideas it assumes you know.',
    shot: 'T2.png',
  },
];

const icons = [
  [180, 'public/apple-touch-icon.png'],
  [32, 'public/favicon-32.png'],
];

const url = (name) =>
  pathToFileURL(fileURLToPath(new URL(name, import.meta.url))).href;

await mkdir('public/og', { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  await page.setViewportSize({ width: 1200, height: 630 });
  for (const card of cards) {
    await page.goto(url('og.html'));
    await page.evaluate((data) => {
      document.querySelector('h1').textContent = data.title;
      document.querySelector('.strap').textContent = data.strap;
      document.querySelector('.shot img').src =
        `../src/assets/screens/${data.shot}`;
    }, card);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(
      () => document.querySelector('.shot img').complete,
    );
    await page.screenshot({ path: card.out });
    console.log(`wrote ${card.out}`);
  }
  for (const [size, out] of icons) {
    await page.setViewportSize({ width: size, height: size });
    await page.goto(url('icon.html'));
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: out });
    console.log(`wrote ${out}`);
  }
} finally {
  await browser.close();
}
