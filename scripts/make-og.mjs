// Builds public/og.png (1200x630): the top-left quadrant of a range-grid
// screen capture at large scale, a dark gradient for legibility, the
// homepage H1 and the wordmark. Run: node scripts/make-og.mjs
//
// SOURCE is a single named constant so a future capture can replace it
// with a one-line change. S2 (BTN vs BB 3-bet) shipped in the showcase
// recapture pass and passes spec 11.3, matching spec 9.10's preference.
import sharp from 'sharp';

const SOURCE = 'src/assets/screens/S2.png';
const OUT = 'public/og.png';
const W = 1200;
const H = 630;
const H1_LINE_1 = 'GTO study that stays';
const H1_LINE_2 = 'on your machine.';
const WORDMARK = 'Poker Assistant';

// S2 is a 2560x1680 capture of the Study screen; the Study layout puts the
// 13x13 range grid at the same position regardless of spot, starting at
// roughly (128, 269) and running about 1348px square (~103.7px per cell) --
// re-measured against S2 and unchanged from S1's geometry. Crop its
// top-left quadrant -- the pairs and broadway column, the densest,
// most colourful part of the grid, all-in reds against calling blues for
// this BTN-vs-3-bet spot -- and let `cover` scale it up to fill the full
// 1200x630 frame behind the text.
const gridLeft = 128;
const gridTop = 269;
const cellSize = 103.7;
const quadrantCells = 7; // ~half of 13, rounded up
const quadrant = Math.round(cellSize * quadrantCells);

const grid = await sharp(SOURCE)
  .extract({ left: gridLeft, top: gridTop, width: quadrant, height: quadrant })
  .resize(W, H, { fit: 'cover', position: 'left top' })
  .toBuffer();

const overlay = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#15110c" stop-opacity="0.62"/>
      <stop offset="0.5" stop-color="#15110c" stop-opacity="0.74"/>
      <stop offset="1" stop-color="#15110c" stop-opacity="0.97"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <rect x="0" y="0" width="${W}" height="110" fill="#15110c" opacity="0.35"/>
  <text x="60" y="70" fill="#f6f1e8" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700" letter-spacing="0.5">${WORDMARK}</text>
  <text x="120" y="486" fill="#f6f1e8" font-family="Georgia, 'Liberation Serif', serif" font-size="66" font-weight="700">${H1_LINE_1}</text>
  <text x="120" y="566" fill="#f6f1e8" font-family="Georgia, 'Liberation Serif', serif" font-size="66" font-weight="700">${H1_LINE_2}</text>
</svg>`);

await sharp(grid)
  .composite([{ input: overlay }])
  .png({ compressionLevel: 9 })
  .toFile(OUT);

const out = await sharp(OUT).metadata();
console.log(`${OUT} ${out.width}x${out.height}`);
