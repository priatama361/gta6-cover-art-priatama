// Sunset Strip Studio — a GTA-style multi-panel cover maker.
// Turns your photos into a poster: a big central hero close-up ringed by six
// character panels, a huge gradient title, a press quote bar, a tagline and a
// credits block. Layouts: Cast Mosaic (default), Diagonal Strips, Six Grid,
// Masthead. Exports PNG in 1:1, 4:5 and 16:9. Fully offline: every font and
// photo is a file under app/ (or a photo you add yourself).

const LIBRARY = [
  { src: 'samples/neon-street.jpg', name: 'Neon Street', role: 'THE DRIVER', faceY: 0.22 },
  { src: 'samples/cast-boss.jpg', name: 'The Boss', role: 'THE BOSS', faceY: 0.22 },
  { src: 'samples/cast-mechanic.jpg', name: 'The Mechanic', role: 'THE MECHANIC', faceY: 0.3 },
  { src: 'samples/cast-captain.jpg', name: 'The Captain', role: 'THE CAPTAIN', faceY: 0.29 },
  { src: 'samples/cast-rider.jpg', name: 'The Rider', role: 'THE RIDER', faceY: 0.27 },
  { src: 'samples/pier.jpg', name: 'The Fixer', role: 'THE FIXER', faceY: 0.2 },
  { src: 'samples/boulevard.jpg', name: 'The Lookout', role: 'THE LOOKOUT', faceY: 0.28 },
  { src: 'samples/cast-courier.jpg', name: 'The Courier', role: 'THE COURIER', faceY: 0.27 },
];

const SIZES = {
  square: { w: 1080, h: 1080, label: '1:1 1080x1080' },
  portrait: { w: 1080, h: 1350, label: '4:5 1080x1350' },
  wide: { w: 1920, h: 1080, label: '16:9 1920x1080' },
};

const GRADES = {
  'sunset-gold': {
    bgTop: '#3a1408', bgBottom: '#12040a',
    accent: '#ff7a18', accent2: '#ffd76a',
    title: ['#fff3b0', '#ffb347', '#ff4d2e'],
    quoteBg: '#1f0d05', quoteText: '#ffd76a',
    panelBorder: '#ffe9c9', creditText: '#e8cdb4', ribbonBg: '#ff4d2e',
    halftone: 0.05, sky: '#160a12', sun: '#ffb347',
  },
  'neon-night': {
    bgTop: '#1d0b33', bgBottom: '#05030a',
    accent: '#ff2e88', accent2: '#22d3ee',
    title: ['#ffd76a', '#ff7a18', '#ff2e88'],
    quoteBg: '#12081f', quoteText: '#ffd76a',
    panelBorder: '#f5f0ff', creditText: '#cfc2e8', ribbonBg: '#ff2e88',
    halftone: 0.05, sky: '#0a0616', sun: '#ff2e88',
  },
  'tropic-teal': {
    bgTop: '#04282a', bgBottom: '#03120f',
    accent: '#2ee6c8', accent2: '#ffd76a',
    title: ['#fff8dc', '#ffd76a', '#2ee6c8'],
    quoteBg: '#03201f', quoteText: '#a7f3ea',
    panelBorder: '#d8fff4', creditText: '#bfe8df', ribbonBg: '#0ea5a0',
    halftone: 0.05, sky: '#031816', sun: '#ffd76a',
  },
  ultraviolet: {
    bgTop: '#2a0a4a', bgBottom: '#0d0218',
    accent: '#c026d3', accent2: '#e879f9',
    title: ['#f5d0fe', '#c026d3', '#7e22ce'],
    quoteBg: '#1c0533', quoteText: '#f5d0fe',
    panelBorder: '#e9d5ff', creditText: '#d8b4fe', ribbonBg: '#a21caf',
    halftone: 0.05, sky: '#12042a', sun: '#e879f9',
  },
  'retro-print': {
    bgTop: '#5c4a33', bgBottom: '#1f150c',
    accent: '#b45309', accent2: '#d6a05a',
    title: ['#fef3c7', '#d97706', '#92400e'],
    quoteBg: '#4a3820', quoteText: '#fef3c7',
    panelBorder: '#fef3c7', creditText: '#e7d3b3', ribbonBg: '#92400e',
    halftone: 0.14, sky: '#241a10', sun: '#d97706',
  },
};

function defaultPanels() {
  return [
    { photo: 'samples/neon-street.jpg', role: 'THE DRIVER', zoom: 1.9, ox: -0.15, oy: -0.2, flip: false },
    { photo: 'samples/cast-boss.jpg', role: 'THE BOSS', zoom: 1.05, ox: 0, oy: -0.04, flip: false },
    { photo: 'samples/cast-mechanic.jpg', role: 'THE MECHANIC', zoom: 1.05, ox: 0, oy: -0.04, flip: false },
    { photo: 'samples/cast-captain.jpg', role: 'THE CAPTAIN', zoom: 1.05, ox: 0, oy: -0.04, flip: false },
    { photo: 'samples/cast-rider.jpg', role: 'THE RIDER', zoom: 1.05, ox: 0, oy: -0.02, flip: false },
    { photo: 'samples/pier.jpg', role: 'THE FIXER', zoom: 1.1, ox: 0, oy: 0, flip: false },
    { photo: 'samples/boulevard.jpg', role: 'THE LOOKOUT', zoom: 1.1, ox: 0, oy: 0, flip: false },
  ];
}

const DEFAULT_BILLING = [
  'A SUNSET STRIP STUDIO PRODUCTION',
  'MUSIC BY NEON COAST',
  'EDITED BY THE FIXER',
  'WRITTEN & DIRECTED BY THE DRIVER',
];

const state = {
  layout: 'mosaic',
  size: 'square',
  grade: 'sunset-gold',
  titleFont: 'anton',
  scriptFont: 'yellowtail',
  kicker: 'ONE LAST RIDE',
  title: 'MIDNIGHT DRIVE',
  subtitle: 'A Cover in Neon',
  tagline: 'EVERY SUNSET HAS A PRICE',
  quote: 'THE DEFINITIVE NEON THRILLER',
  publication: 'SUNSET STRIP DAILY',
  billing: [...DEFAULT_BILLING],
  seal: 'BEST CAST',
  sealRing: 'SUNSET STRIP STUDIO • EST. 2026 •',
  release: 'COMING SOON',
  edition: 'VOL. 1',
  nameTagsAuto: true,
  panels: defaultPanels(),
  selected: 0,
};

// A fixed barcode pattern (deterministic — the same poster every time).
const BAR_PATTERN = [2, 1, 3, 1, 1, 2, 4, 1, 2, 2, 1, 3, 1, 1, 2, 1, 4, 2, 1, 1, 3, 2, 1, 2, 1, 1, 3, 1, 2, 2];

// A fixed skyline silhouette (deterministic building widths/heights).
const SKYLINE = [
  [46, 0.55], [30, 0.8], [58, 0.42], [36, 0.95], [52, 0.6], [28, 0.75],
  [64, 0.5], [34, 0.88], [48, 0.62], [30, 0.7], [56, 0.45], [40, 0.92],
  [32, 0.66], [60, 0.52], [38, 0.85], [50, 0.58], [28, 0.78], [44, 0.48],
];

// ---------------------------------------------------------------- images

const imageCache = new Map();
const userPhotos = [];

function loadImage(src) {
  if (imageCache.has(src)) return imageCache.get(src);
  const p = new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
  imageCache.set(src, p);
  return p;
}

async function ensureAssets() {
  try {
    await Promise.all([
      document.fonts.load('80px Anton'),
      document.fonts.load('900 80px "Saira Condensed"'),
      document.fonts.load('40px "Bebas Neue"'),
      document.fonts.load('40px Pacifico'),
      document.fonts.load('40px Yellowtail'),
      document.fonts.ready,
    ]);
  } catch (e) { /* fonts fall back to sans; the poster still draws */ }
  await Promise.all(LIBRARY.map((s) => loadImage(s.src)));
}

function photoRole(src) {
  const lib = LIBRARY.find((l) => l.src === src);
  if (lib) return lib.role;
  if (userPhotos.some((p) => p.src === src)) return 'GUEST';
  return null;
}

function faceYFor(src) {
  const lib = LIBRARY.find((l) => l.src === src);
  return lib ? lib.faceY : undefined;
}

function getRole(panel) {
  if (state.nameTagsAuto) return photoRole(panel.photo) || panel.role;
  return panel.role;
}

function allPhotoSrcs() {
  return [...LIBRARY.map((l) => l.src), ...userPhotos.map((p) => p.src)];
}

// ---------------------------------------------------------------- history

const undoStack = [];
const redoStack = [];

function snapshot() {
  return JSON.stringify(state);
}

function pushHistory() {
  undoStack.push(snapshot());
  if (undoStack.length > 50) undoStack.shift();
  redoStack.length = 0;
  updateHistoryButtons();
}

function applySnapshot(json) {
  const s = JSON.parse(json);
  Object.keys(state).forEach((k) => { state[k] = s[k]; });
  syncAllControls();
  renderPreview();
}

function undo() {
  if (!undoStack.length) return;
  redoStack.push(snapshot());
  applySnapshot(undoStack.pop());
  updateHistoryButtons();
}

function redo() {
  if (!redoStack.length) return;
  undoStack.push(snapshot());
  applySnapshot(redoStack.pop());
  updateHistoryButtons();
}

function updateHistoryButtons() {
  const u = document.getElementById('undoBtn');
  const r = document.getElementById('redoBtn');
  if (u) u.disabled = undoStack.length === 0;
  if (r) r.disabled = redoStack.length === 0;
}

// ---------------------------------------------------------------- helpers

function splitTitle(title) {
  const words = title.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 1) return words;
  let best = 1;
  let bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(' ').length;
    const b = words.slice(i).join(' ').length;
    const d = Math.abs(a - b);
    if (d < bestDiff) { bestDiff = d; best = i; }
  }
  return [words.slice(0, best).join(' '), words.slice(best).join(' ')];
}

function titleFontString(size) {
  if (state.titleFont === 'saira') return `900 ${size}px "Saira Condensed", sans-serif`;
  return `${size}px Anton, sans-serif`;
}

function scriptFontFamily() {
  return state.scriptFont === 'pacifico' ? 'Pacifico' : 'Yellowtail';
}

function fitFontSize(ctx, text, maxWidth, startSize, fontFn) {
  let size = startSize;
  ctx.font = fontFn(size);
  while (size > 10 && ctx.measureText(text).width > maxWidth) {
    size -= 2;
    ctx.font = fontFn(size);
  }
  return size;
}

// Draw a photo into a rect, cover-fit, with the panel's zoom/offset/flip.
// ox/oy are fractions of the visible source size; the crop stays in bounds.
// For wide panels, faceY (0..1) centres the slice on the face instead of
// using oy, so a face is never sliced away in a short strip or grid row.
function drawPhoto(ctx, img, x, y, w, h, zoom, ox, oy, flip, faceY) {
  if (!img) {
    ctx.fillStyle = '#241a33';
    ctx.fillRect(x, y, w, h);
    return;
  }
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  const base = Math.max(w / iw, h / ih);
  const s = base * zoom;
  const sw = w / s;
  const sh = h / s;
  let sx = (iw - sw) / 2 + ox * sw;
  let sy = (ih - sh) / 2 + oy * sh;
  if (faceY !== undefined && faceY !== null && w > h) {
    sy = faceY * ih - sh / 2;
  }
  sx = Math.max(0, Math.min(iw - sw, sx));
  sy = Math.max(0, Math.min(ih - sh, sy));
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  if (flip) {
    ctx.translate(x + w, y);
    ctx.scale(-1, 1);
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
  } else {
    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  }
  ctx.restore();
}

// Movie-billing small caps: lowercase letters print as smaller capitals.
function drawSmallCaps(ctx, text, x, baselineY, size, family) {
  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  let cx = x;
  for (const ch of text) {
    const isLower = ch >= 'a' && ch <= 'z';
    const fs = isLower ? size * 0.72 : size;
    ctx.font = `${fs}px ${family}`;
    ctx.fillText(ch.toUpperCase(), cx, baselineY);
    cx += ctx.measureText(ch.toUpperCase()).width;
  }
  ctx.restore();
}

// Characters placed along the top arc of a circle (for the seal ring).
function drawCircularText(ctx, text, cx, cy, radius, fontSize, family, color) {
  const chars = [...text];
  if (!chars.length) return;
  const totalAngle = Math.PI * 0.75;
  const startAngle = -Math.PI / 2 - totalAngle / 2;
  const step = totalAngle / Math.max(1, chars.length - 1);
  ctx.save();
  ctx.font = `${fontSize}px ${family}`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  chars.forEach((ch, i) => {
    const a = startAngle + i * step;
    const x = cx + Math.cos(a) * radius;
    const y = cy + Math.sin(a) * radius;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(a + Math.PI / 2);
    ctx.fillText(ch, 0, 0);
    ctx.restore();
  });
  ctx.restore();
}

function drawHalftone(ctx, W, H, u, alpha) {
  ctx.save();
  ctx.fillStyle = `rgba(255,255,255,${alpha})`;
  const step = 22 * u;
  for (let yy = step / 2; yy < H; yy += step) {
    for (let xx = step / 2; xx < W; xx += step) {
      ctx.beginPath();
      ctx.arc(xx, yy, 1.4 * u, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

function drawBarcode(ctx, x, y, w, h) {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#111111';
  let cx = x + 4;
  const unit = Math.max(1, Math.floor(w / 64));
  for (let i = 0; i < BAR_PATTERN.length && cx < x + w - 4; i++) {
    const bw = BAR_PATTERN[i] * unit;
    if (i % 2 === 0) ctx.fillRect(cx, y + 3, bw, h - 6);
    cx += bw + unit;
  }
}

function drawSeal(ctx, cx, cy, r, grade, u) {
  ctx.save();
  // Ring text around the seal.
  drawCircularText(ctx, state.sealRing, cx, cy, r + 9 * u, Math.max(8, 10 * u), '"Bebas Neue", sans-serif', grade.accent2);
  ctx.translate(cx, cy);
  ctx.fillStyle = '#e8b64c';
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#7a5200';
  ctx.lineWidth = Math.max(2, 2 * u);
  ctx.beginPath();
  ctx.arc(0, 0, r - 3 * u, 0, Math.PI * 2);
  ctx.stroke();
  const lines = splitTitle(state.seal);
  ctx.fillStyle = '#3a2503';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const fs = Math.round(r * 0.4);
  ctx.font = `${fs}px Anton, sans-serif`;
  lines.forEach((line, i) => {
    ctx.fillText(line, 0, (i - (lines.length - 1) / 2) * fs * 1.05);
  });
  ctx.restore();
}

function drawSkyline(ctx, x, y, w, h, grade, u) {
  ctx.save();
  // Warm horizon glow so the dark buildings read as silhouettes.
  const glow = ctx.createLinearGradient(0, y, 0, y + h);
  glow.addColorStop(0, grade.sun);
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.globalAlpha = 0.45;
  ctx.fillStyle = glow;
  ctx.fillRect(x, y, w, h);
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#060409';
  let cx = x;
  const totalW = SKYLINE.reduce((a, b) => a + b[0], 0);
  const scale = w / totalW;
  for (const [bw, bh] of SKYLINE) {
    const wpx = bw * scale;
    const hpx = bh * h;
    ctx.fillRect(cx, y + h - hpx, wpx, hpx);
    cx += wpx;
  }
  // Lit windows (deterministic grid).
  ctx.fillStyle = grade.accent2;
  const step = 14 * u;
  for (let wy = y + 8 * u; wy < y + h - 6 * u; wy += step) {
    for (let wx = x + 6 * u; wx < x + w - 6 * u; wx += step) {
      const on = ((Math.floor(wx / step) * 7 + Math.floor(wy / step) * 13) % 5) < 2;
      if (on) ctx.fillRect(wx, wy, 3 * u, 4 * u);
    }
  }
  ctx.restore();
}

// Small angled role ribbon at the bottom-left of a panel.
function drawRoleRibbon(ctx, p, grade, u) {
  const text = getRole(state.panels[p.idx]);
  const fs = Math.max(13, 22 * u);
  ctx.font = `${fs}px "Bebas Neue", sans-serif`;
  const tw = ctx.measureText(text).width;
  const pad = 10 * u;
  const bw = tw + pad * 2;
  const bh = fs * 1.7;
  const bx = p.x + 6 * u;
  const by = p.y + p.h - bh - 6 * u;
  ctx.save();
  ctx.translate(bx, by);
  ctx.transform(1, 0, -0.12, 1, 0, 0);
  ctx.fillStyle = 'rgba(8, 4, 16, 0.88)';
  ctx.fillRect(0, 0, bw, bh);
  ctx.fillStyle = grade.accent;
  ctx.fillRect(0, bh - 3 * u, bw, 3 * u);
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, pad, bh / 2 + 1);
  ctx.restore();
}

// Number badge at a panel's top-left (editor only, never in exports).
function drawBadge(ctx, p, u) {
  const r = Math.max(11, 15 * u);
  const bx = p.x + r + 5 * u;
  const by = p.y + r + 5 * u;
  ctx.save();
  ctx.fillStyle = 'rgba(8, 4, 16, 0.85)';
  ctx.beginPath();
  ctx.arc(bx, by, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#22d3ee';
  ctx.lineWidth = Math.max(1.5, 2 * u);
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.font = `${Math.round(r * 1.1)}px "Bebas Neue", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(p.idx + 1), bx, by + 1);
  ctx.restore();
  p.badge = { x: bx - r, y: by - r, w: r * 2, h: r * 2 };
}

async function drawPanelPhoto(ctx, p, grade, u, badges) {
  const panel = state.panels[p.idx];
  const img = await loadImage(panel.photo);
  drawPhoto(ctx, img, p.x, p.y, p.w, p.h, panel.zoom, panel.ox, panel.oy, panel.flip, faceYFor(panel.photo));
  ctx.strokeStyle = grade.panelBorder;
  ctx.lineWidth = Math.max(2, 2.5 * u);
  ctx.strokeRect(p.x, p.y, p.w, p.h);
  if (p.showRole !== false) drawRoleRibbon(ctx, p, grade, u);
  if (badges) drawBadge(ctx, p, u);
}

function drawBackground(ctx, W, H, grade, u) {
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, grade.bgTop);
  bg.addColorStop(1, grade.bgBottom);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  drawHalftone(ctx, W, H, u, grade.halftone);
}

function drawOuterBorder(ctx, W, H, m, grade, u) {
  ctx.strokeStyle = grade.panelBorder;
  ctx.lineWidth = Math.max(2, 3 * u);
  ctx.strokeRect(m / 2, m / 2, W - m, H - m);
}

function drawQuoteBar(ctx, W, m, qh, grade, u) {
  ctx.fillStyle = grade.quoteBg;
  ctx.fillRect(m, m, W - 2 * m, qh);
  ctx.strokeStyle = grade.accent;
  ctx.lineWidth = Math.max(1, 1.5 * u);
  ctx.strokeRect(m, m, W - 2 * m, qh);
  const qfs = Math.max(12, 21 * u);
  ctx.font = `${qfs}px "Bebas Neue", sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = grade.accent2;
  ctx.fillText('★★★★★', m + 14 * u, m + qh / 2 + 1);
  const starsW = ctx.measureText('★★★★★').width;
  ctx.fillStyle = grade.quoteText;
  ctx.fillText(`"${state.quote}"`, m + 20 * u + starsW, m + qh / 2 + 1);
  ctx.fillStyle = grade.creditText;
  ctx.textAlign = 'right';
  ctx.fillText(state.publication, W - m - 90 * u, m + qh / 2 + 1);
  const volW = 74 * u;
  ctx.fillStyle = grade.accent;
  ctx.fillRect(W - m - volW, m, volW, qh);
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.font = `${Math.max(12, 20 * u)}px Anton, sans-serif`;
  ctx.fillText(state.edition, W - m - volW / 2, m + qh / 2 + 1);
}

// Kicker ribbon + big gradient title + script subtitle + tagline,
// the whole stack centred on (cx, centreY). opts.scale shrinks the title;
// opts.availH caps the title so the whole stack fits that height;
// opts.bandH sizes everything to fit inside a band of that height.
function drawTitleBlock(ctx, W, cx, centreY, maxW, grade, u, opts = {}) {
  const scale = opts.scale || 1;
  const bandH = opts.bandH || 0;
  const availH = opts.availH || 0;
  const lines = splitTitle(state.title);
  const longest = lines.reduce((a, b) => (a.length >= b.length ? a : b));
  let kfs, kh, kickerGap, subSize, subGap, tagSize, tagGap;
  if (bandH > 0) {
    kfs = Math.max(11, Math.round(bandH * 0.07));
    kh = kfs * 1.7;
    kickerGap = Math.round(bandH * 0.04);
    subSize = Math.max(12, Math.round(bandH * 0.12));
    subGap = Math.round(bandH * 0.05);
    tagSize = Math.max(10, Math.round(bandH * 0.08));
    tagGap = Math.round(bandH * 0.06);
  } else {
    kfs = Math.max(13, 26 * u);
    kh = kfs * 1.9;
    kickerGap = 14 * u;
    subSize = Math.max(16, 52 * u);
    subGap = 34 * u;
    tagSize = Math.max(12, 22 * u);
    tagGap = 44 * u;
  }
  const overhead = kh + kickerGap + subGap + subSize + tagGap + tagSize;
  let titleSize = fitFontSize(ctx, longest, maxW, Math.round(0.21 * W * scale), titleFontString);
  if (availH > 0) {
    const heightFit = Math.floor((availH - overhead) / lines.length);
    if (heightFit > 10) titleSize = Math.min(titleSize, heightFit);
  }
  if (bandH > 0) {
    titleSize = Math.min(titleSize, Math.floor((bandH * 0.52) / lines.length));
  }
  const lineH = titleSize * 1.0;
  const blockH = lines.length * lineH;
  const totalH = kh + kickerGap + blockH + subGap + subSize + tagGap + tagSize;
  const top = centreY - totalH / 2;

  // Kicker ribbon.
  ctx.font = `${kfs}px "Bebas Neue", sans-serif`;
  const kw = ctx.measureText(state.kicker).width + 36 * u;
  ctx.save();
  ctx.translate(cx, top + kh / 2);
  ctx.rotate(-0.02);
  ctx.fillStyle = grade.ribbonBg;
  ctx.fillRect(-kw / 2, -kh / 2, kw, kh);
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(state.kicker, 0, 1);
  ctx.restore();

  // Title with gradient fill, dark outline and shadow.
  const titleTop = top + kh + kickerGap;
  const grad = ctx.createLinearGradient(0, titleTop, 0, titleTop + blockH);
  grad.addColorStop(0, grade.title[0]);
  grad.addColorStop(0.55, grade.title[1]);
  grad.addColorStop(1, grade.title[2]);
  ctx.save();
  ctx.translate(cx, titleTop + blockH / 2);
  ctx.rotate(-0.02);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = titleFontString(titleSize);
  ctx.shadowColor = 'rgba(0,0,0,0.65)';
  ctx.shadowBlur = 18 * u;
  ctx.shadowOffsetY = 6 * u;
  ctx.lineJoin = 'round';
  ctx.strokeStyle = 'rgba(10,4,20,0.9)';
  ctx.lineWidth = Math.max(3, titleSize * 0.055);
  lines.forEach((line, i) => {
    const ly = (i - (lines.length - 1) / 2) * lineH;
    ctx.strokeText(line, 0, ly);
  });
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = grad;
  lines.forEach((line, i) => {
    const ly = (i - (lines.length - 1) / 2) * lineH;
    ctx.fillText(line, 0, ly);
  });
  ctx.restore();

  // Script subtitle under the title.
  const subY = titleTop + blockH + subGap + subSize / 2;
  ctx.save();
  ctx.font = `${subSize}px ${scriptFontFamily()}, cursive`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = grade.accent;
  ctx.shadowBlur = 16 * u;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(state.subtitle, cx, subY);
  ctx.restore();

  // Tagline under the subtitle.
  const tagY = subY + subSize / 2 + tagGap + tagSize / 2;
  ctx.font = `${tagSize}px "Bebas Neue", sans-serif`;
  ctx.fillStyle = grade.accent2;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`— ${state.tagline} —`, cx, tagY);
}

// Billing + release line + seal + barcode inside a band (y..y+h).
function drawCreditsBand(ctx, W, m, y, h, grade, u) {
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(m, y, W - 2 * m, h);
  const leftX = m + 16 * u;
  const cfs = Math.max(11, 17 * u);
  ctx.fillStyle = grade.creditText;
  state.billing.forEach((line, i) => {
    drawSmallCaps(ctx, line, leftX, y + h * (0.24 + i * 0.2), cfs, '"Bebas Neue", sans-serif');
  });
  ctx.font = `${Math.max(14, 30 * u)}px Anton, sans-serif`;
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(state.release, W / 2, y + h * 0.5);
  const sealR = Math.min(h * 0.34, 34 * u);
  drawSeal(ctx, W - m - 178 * u, y + h * 0.46, sealR, grade, u);
  drawBarcode(ctx, W - m - 118 * u, y + h * 0.16, 104 * u, h * 0.68);
}

// ------------------------------------------------------------- CAST MOSAIC

function mosaicRects(W, H) {
  const u = Math.min(W, H) / 1080;
  const m = 0.033 * Math.min(W, H);
  const gap = 10 * u;
  const qh = 0.048 * H;
  const ch = 0.125 * H;
  const gridTop = m + qh + gap;
  const gridBottom = H - m - ch - gap;
  const gridH = gridBottom - gridTop;
  const sw = 0.222 * W;
  const cw = W - 2 * m - 2 * sw - 2 * gap;
  const lx = m;
  const cx = m + sw + gap;
  const rx = m + sw + gap + cw + gap;
  const rowH = (gridH - 2 * gap) / 3;
  const rows = [0, 1, 2].map((i) => gridTop + i * (rowH + gap));
  const panels = [
    { x: cx, y: gridTop, w: cw, h: gridH, idx: 0 },
    { x: lx, y: rows[0], w: sw, h: rowH, idx: 1 },
    { x: lx, y: rows[1], w: sw, h: rowH, idx: 2 },
    { x: lx, y: rows[2], w: sw, h: rowH, idx: 3 },
    { x: rx, y: rows[0], w: sw, h: rowH, idx: 4 },
    { x: rx, y: rows[1], w: sw, h: rowH, idx: 5 },
    { x: rx, y: rows[2], w: sw, h: rowH, idx: 6 },
  ];
  return { u, m, gap, qh, ch, gridTop, gridBottom, gridH, panels };
}

async function drawMosaicCover(ctx, W, H, badges) {
  const grade = GRADES[state.grade];
  const R = mosaicRects(W, H);
  const u = R.u;
  drawBackground(ctx, W, H, grade, u);
  drawOuterBorder(ctx, W, H, R.m, grade, u);
  drawQuoteBar(ctx, W, R.m, R.qh, grade, u);
  for (const p of R.panels) await drawPanelPhoto(ctx, p, grade, u, badges);
  const gridMid = R.gridTop + R.gridH * 0.6;
  drawTitleBlock(ctx, W, W / 2, gridMid, W * 0.96, grade, u, { availH: R.gridH * 0.78 });
  drawCreditsBand(ctx, W, R.m, H - R.m - R.ch, R.ch, grade, u);
  return R.panels;
}

// ---------------------------------------------------------- DIAGONAL STRIPS

async function drawStripsCover(ctx, W, H, badges) {
  const grade = GRADES[state.grade];
  const u = Math.min(W, H) / 1080;
  const m = 0.033 * Math.min(W, H);
  const gap = 10 * u;
  const qh = 0.048 * H;
  const ch = 0.125 * H;
  drawBackground(ctx, W, H, grade, u);
  drawOuterBorder(ctx, W, H, m, grade, u);
  drawQuoteBar(ctx, W, m, qh, grade, u);

  // Sun disc behind the strips.
  const sunR = Math.min(W, H) * 0.22;
  const sunGrad = ctx.createRadialGradient(W * 0.72, H * 0.3, 0, W * 0.72, H * 0.3, sunR);
  sunGrad.addColorStop(0, grade.sun);
  sunGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(W * 0.72, H * 0.3, sunR, 0, Math.PI * 2);
  ctx.fill();

  const stripTop = m + qh + gap;
  const stripBottom = H * 0.62;
  const stripH = (stripBottom - stripTop - 5 * gap) / 6;
  const slant = 100 * u;
  const rects = [];
  for (let i = 0; i < 6; i++) {
    const yTop = stripTop + i * (stripH + gap);
    const p = { x: m, y: yTop, w: W - 2 * m, h: stripH + slant, idx: i };
    const panel = state.panels[i];
    const img = await loadImage(panel.photo);
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(m, yTop + slant);
    ctx.lineTo(W - m, yTop);
    ctx.lineTo(W - m, yTop + stripH);
    ctx.lineTo(m, yTop + stripH + slant);
    ctx.closePath();
    ctx.clip();
    drawPhoto(ctx, img, m, yTop, W - 2 * m, stripH + slant, panel.zoom, panel.ox, panel.oy, panel.flip, faceYFor(panel.photo));
    ctx.restore();
    ctx.strokeStyle = grade.panelBorder;
    ctx.lineWidth = Math.max(2, 2.5 * u);
    ctx.beginPath();
    ctx.moveTo(m, yTop + slant);
    ctx.lineTo(W - m, yTop);
    ctx.lineTo(W - m, yTop + stripH);
    ctx.lineTo(m, yTop + stripH + slant);
    ctx.closePath();
    ctx.stroke();
    // Role ribbon at the strip's bottom-left.
    const ribbonP = { x: m + 10 * u, y: yTop + stripH - 8 * u, w: W - 2 * m, h: 0, idx: i };
    drawRoleRibbon(ctx, ribbonP, grade, u);
    if (badges) {
      const badgeP = { x: m, y: yTop, w: W - 2 * m, h: stripH + slant, idx: i };
      drawBadge(ctx, badgeP, u);
      p.badge = badgeP.badge;
    }
    rects.push(p);
  }

  const stripsMid = stripTop + (stripBottom - stripTop) / 2;
  drawTitleBlock(ctx, W, W / 2, stripsMid, W * 0.9, grade, u, { scale: 0.7, availH: stripBottom - stripTop });

  // Credits band below the lowest (slanted) strip edge, then the skyline.
  const creditsY = stripBottom + slant + gap;
  drawCreditsBand(ctx, W, m, creditsY, ch, grade, u);
  const skyY = creditsY + ch + gap;
  drawSkyline(ctx, m, skyY, W - 2 * m, H - m - skyY, grade, u);
  return rects;
}

// ---------------------------------------------------------------- SIX GRID

async function drawSixGridCover(ctx, W, H, badges) {
  const grade = GRADES[state.grade];
  const u = Math.min(W, H) / 1080;
  const m = 0.033 * Math.min(W, H);
  const gap = 10 * u;
  const qh = 0.048 * H;
  const ch = 0.125 * H;
  drawBackground(ctx, W, H, grade, u);
  drawOuterBorder(ctx, W, H, m, grade, u);
  drawQuoteBar(ctx, W, m, qh, grade, u);

  const areaTop = m + qh + gap;
  const areaBottom = H - m - ch - gap;
  const areaH = areaBottom - areaTop;
  const titleBandH = 0.30 * H;
  const rowH = (areaH - titleBandH - 2 * gap) / 2;
  const colW = (W - 2 * m - 2 * gap) / 3;
  const xs = [0, 1, 2].map((i) => m + i * (colW + gap));
  const row1Y = areaTop;
  const bandY = areaTop + rowH + gap;
  const row2Y = bandY + titleBandH + gap;

  const rects = [];
  for (let i = 0; i < 3; i++) {
    const p = { x: xs[i], y: row1Y, w: colW, h: rowH, idx: i };
    await drawPanelPhoto(ctx, p, grade, u, badges);
    rects.push(p);
  }
  for (let i = 0; i < 3; i++) {
    const p = { x: xs[i], y: row2Y, w: colW, h: rowH, idx: 3 + i };
    await drawPanelPhoto(ctx, p, grade, u, badges);
    rects.push(p);
  }
  drawTitleBlock(ctx, W, W / 2, bandY + titleBandH / 2, W * 0.94, grade, u, { bandH: titleBandH, availH: titleBandH });
  drawCreditsBand(ctx, W, m, H - m - ch, ch, grade, u);
  return rects;
}

// --------------------------------------------------------------- MASTHEAD

async function drawMastheadCover(ctx, W, H, badges) {
  const grade = GRADES[state.grade];
  const u = Math.min(W, H) / 1080;
  const m = 0.033 * Math.min(W, H);
  const gap = 10 * u;
  drawBackground(ctx, W, H, grade, u);
  ctx.strokeStyle = grade.accent2;
  ctx.lineWidth = Math.max(2, 3 * u);
  ctx.strokeRect(m / 2, m / 2, W - m, H - m);

  const bandH = 0.26 * H;
  const heroH = 0.51 * H;
  const stripH = H - m - bandH - heroH - 2 * gap;
  const bandY = m;
  const heroY = m + bandH + gap;
  const stripY = heroY + heroH + gap;

  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.fillRect(m, bandY, W - 2 * m, bandH);
  const cx = W / 2;
  const kfs = Math.max(13, 26 * u);
  ctx.font = `${kfs}px "Bebas Neue", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = grade.accent2;
  ctx.fillText(state.kicker, cx, bandY + bandH * 0.12);
  const lines = splitTitle(state.title);
  const titleSize = Math.min(
    fitFontSize(ctx, lines.reduce((a, b) => (a.length >= b.length ? a : b)), W * 0.92, Math.round(0.13 * H), titleFontString),
    Math.floor(bandH * 0.3)
  );
  const grad = ctx.createLinearGradient(0, bandY, 0, bandY + bandH);
  grad.addColorStop(0, grade.title[0]);
  grad.addColorStop(0.55, grade.title[1]);
  grad.addColorStop(1, grade.title[2]);
  ctx.font = titleFontString(titleSize);
  ctx.lineJoin = 'round';
  ctx.strokeStyle = 'rgba(10,4,20,0.9)';
  ctx.lineWidth = Math.max(3, titleSize * 0.05);
  const lineH = titleSize * 1.0;
  lines.forEach((line, i) => {
    const ly = bandY + bandH * 0.52 + (i - (lines.length - 1) / 2) * lineH;
    ctx.strokeText(line, cx, ly);
  });
  ctx.fillStyle = grad;
  lines.forEach((line, i) => {
    const ly = bandY + bandH * 0.52 + (i - (lines.length - 1) / 2) * lineH;
    ctx.fillText(line, cx, ly);
  });
  ctx.strokeStyle = grade.accent;
  ctx.lineWidth = Math.max(2, 3 * u);
  ctx.beginPath();
  ctx.moveTo(W * 0.2, bandY + bandH * 0.88);
  ctx.lineTo(W * 0.8, bandY + bandH * 0.88);
  ctx.stroke();

  const hero = state.panels[0];
  const heroImg = await loadImage(hero.photo);
  drawPhoto(ctx, heroImg, m, heroY, W - 2 * m, heroH, hero.zoom, hero.ox, hero.oy, hero.flip, faceYFor(hero.photo));
  ctx.strokeStyle = grade.panelBorder;
  ctx.lineWidth = Math.max(2, 2.5 * u);
  ctx.strokeRect(m, heroY, W - 2 * m, heroH);
  ctx.strokeStyle = grade.accent2;
  ctx.lineWidth = Math.max(2, 3 * u);
  const tick = 22 * u;
  [[m, heroY], [W - m, heroY], [m, heroY + heroH], [W - m, heroY + heroH]].forEach(([tx, ty]) => {
    const sx = tx === m ? 1 : -1;
    const sy = ty === heroY ? 1 : -1;
    ctx.beginPath();
    ctx.moveTo(tx + sx * tick, ty);
    ctx.lineTo(tx, ty);
    ctx.lineTo(tx, ty + sy * tick);
    ctx.stroke();
  });

  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.fillRect(m, stripY, W - 2 * m, stripH);
  const subSize = Math.max(16, 44 * u);
  ctx.font = `${subSize}px ${scriptFontFamily()}, cursive`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = grade.accent;
  ctx.shadowBlur = 14 * u;
  ctx.fillText(state.subtitle, m + 18 * u, stripY + stripH * 0.32);
  ctx.shadowColor = 'transparent';
  const tagSize = Math.max(11, 19 * u);
  ctx.font = `${tagSize}px "Bebas Neue", sans-serif`;
  ctx.fillStyle = grade.accent2;
  ctx.fillText(state.tagline, m + 18 * u, stripY + stripH * 0.68);

  const pw = (W - 2 * m - W * 0.42 - 3 * gap) / 3;
  const px0 = m + W * 0.42;
  const rects = [{ x: m, y: heroY, w: W - 2 * m, h: heroH, idx: 0 }];
  for (let i = 0; i < 3; i++) {
    const panel = state.panels[1 + i];
    const px = px0 + i * (pw + gap);
    const py = stripY + stripH * 0.08;
    const ph = stripH * 0.84;
    const img = await loadImage(panel.photo);
    drawPhoto(ctx, img, px, py, pw, ph, panel.zoom, panel.ox, panel.oy, panel.flip, faceYFor(panel.photo));
    ctx.strokeStyle = grade.panelBorder;
    ctx.lineWidth = Math.max(1, 2 * u);
    ctx.strokeRect(px, py, pw, ph);
    const p = { x: px, y: py, w: pw, h: ph, idx: 1 + i, showRole: false };
    if (badges) drawBadge(ctx, p, u);
    rects.push(p);
  }
  if (badges) drawBadge(ctx, rects[0], u);
  return rects;
}

// ------------------------------------------------------------------- render

let lastRects = [];
let drawToken = 0;

async function drawCover(ctx, W, H, opts = {}) {
  const token = ++drawToken;
  await ensureAssets();
  if (token !== drawToken) return;
  const badges = !!opts.badges;
  let rects;
  if (state.layout === 'strips') rects = await drawStripsCover(ctx, W, H, badges);
  else if (state.layout === 'sixgrid') rects = await drawSixGridCover(ctx, W, H, badges);
  else if (state.layout === 'masthead') rects = await drawMastheadCover(ctx, W, H, badges);
  else rects = await drawMosaicCover(ctx, W, H, badges);
  if (token !== drawToken) return;
  lastRects = rects;
}

const canvas = document.getElementById('cover');

async function renderPreview() {
  const s = SIZES[state.size];
  canvas.width = s.w;
  canvas.height = s.h;
  const ctx = canvas.getContext('2d');
  await drawCover(ctx, s.w, s.h, { badges: true });
}

// ------------------------------------------------------------------- export

function downloadBlob(blob, filename) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 3000);
}

async function exportSize(sizeKey, filename) {
  const s = SIZES[sizeKey];
  const c = document.createElement('canvas');
  c.width = s.w;
  c.height = s.h;
  const ctx = c.getContext('2d');
  await drawCover(ctx, s.w, s.h, { badges: false });
  await new Promise((resolve) => {
    c.toBlob((blob) => {
      if (blob) downloadBlob(blob, filename);
      resolve();
    }, 'image/png');
  });
}

// ------------------------------------------------------------------ editor

const $ = (id) => document.getElementById(id);
const PANEL_NAMES = ['Hero', 'Panel 1', 'Panel 2', 'Panel 3', 'Panel 4', 'Panel 5', 'Panel 6'];

function buildPanelList() {
  const list = $('panelList');
  list.innerHTML = '';
  state.panels.forEach((p, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.draggable = true;
    b.dataset.idx = String(i);
    b.textContent = `${i + 1} · ${PANEL_NAMES[i]} · ${getRole(p)}`;
    if (i === state.selected) b.classList.add('sel');
    b.addEventListener('click', () => selectPanel(i));
    b.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/panel', String(i));
      e.dataTransfer.effectAllowed = 'move';
      b.classList.add('dragging');
    });
    b.addEventListener('dragend', () => b.classList.remove('dragging'));
    b.addEventListener('dragover', (e) => {
      e.preventDefault();
      b.classList.add('drop-target');
    });
    b.addEventListener('dragleave', () => b.classList.remove('drop-target'));
    b.addEventListener('drop', (e) => {
      e.preventDefault();
      b.classList.remove('drop-target');
      const from = parseInt(e.dataTransfer.getData('text/panel'), 10);
      if (!Number.isNaN(from) && from !== i) swapPanels(from, i);
    });
    list.appendChild(b);
  });
}

function buildThumbs() {
  const box = $('thumbs');
  box.innerHTML = '';
  const all = [...LIBRARY, ...userPhotos];
  all.forEach((ph) => {
    const img = document.createElement('img');
    img.src = ph.src;
    img.alt = ph.name;
    img.title = ph.name;
    img.draggable = true;
    const cur = state.panels[state.selected].photo;
    if (ph.src === cur) img.classList.add('sel');
    img.addEventListener('click', () => {
      assignPhoto(state.selected, ph.src);
    });
    img.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/photo', ph.src);
      e.dataTransfer.effectAllowed = 'copy';
    });
    box.appendChild(img);
  });
}

function assignPhoto(idx, src) {
  const p = state.panels[idx];
  p.photo = src;
  if (state.nameTagsAuto) {
    const role = photoRole(src);
    if (role) p.role = role;
  }
  buildThumbs();
  syncPanelControls();
  renderPreview();
}

function syncPanelControls() {
  const p = state.panels[state.selected];
  $('inRole').value = getRole(p);
  $('inRole').disabled = state.nameTagsAuto;
  $('inZoom').value = String(p.zoom);
  $('inOx').value = String(p.ox);
  $('inOy').value = String(p.oy);
  $('zoomVal').textContent = `${p.zoom.toFixed(2)}×`;
  $('oxVal').textContent = p.ox.toFixed(2);
  $('oyVal').textContent = p.oy.toFixed(2);
  buildPanelList();
  buildThumbs();
}

function syncAllControls() {
  $('inKicker').value = state.kicker;
  $('inTitle').value = state.title;
  $('inTitleFont').value = state.titleFont;
  $('inSubtitle').value = state.subtitle;
  $('inScriptFont').value = state.scriptFont;
  $('inTagline').value = state.tagline;
  $('inQuote').value = state.quote;
  $('inPublication').value = state.publication;
  $('inBilling').value = state.billing.join('\n');
  $('inSeal').value = state.seal;
  $('inSealRing').value = state.sealRing;
  $('inRelease').value = state.release;
  $('inEdition').value = state.edition;
  $('inNameTagsAuto').checked = state.nameTagsAuto;
  document.querySelectorAll('#layoutSeg button').forEach((b) => {
    b.classList.toggle('active', b.dataset.layout === state.layout);
  });
  document.querySelectorAll('#sizeSeg button').forEach((b) => {
    b.classList.toggle('active', b.dataset.size === state.size);
  });
  document.querySelectorAll('#gradeSeg button').forEach((b) => {
    b.classList.toggle('active', b.dataset.grade === state.grade);
  });
  syncPanelControls();
}

function selectPanel(i) {
  state.selected = i;
  syncPanelControls();
}

function swapPanels(a, b) {
  const tmp = state.panels[a];
  state.panels[a] = state.panels[b];
  state.panels[b] = tmp;
  state.selected = b;
  pushHistory();
  syncPanelControls();
  renderPreview();
}

function cyclePhoto(dir) {
  const lib = allPhotoSrcs();
  const cur = state.panels[state.selected].photo;
  let i = lib.indexOf(cur);
  if (i < 0) i = 0;
  const next = lib[(i + dir + lib.length) % lib.length];
  assignPhoto(state.selected, next);
  pushHistory();
}

function autoFill() {
  for (let i = 0; i < state.panels.length; i++) {
    const d = defaultPanels()[i];
    const lib = LIBRARY[i];
    state.panels[i].photo = lib.src;
    state.panels[i].role = lib.role;
    state.panels[i].zoom = d.zoom;
    state.panels[i].ox = d.ox;
    state.panels[i].oy = d.oy;
    state.panels[i].flip = false;
  }
  syncPanelControls();
  renderPreview();
}

function trySamples() {
  state.nameTagsAuto = true;
  $('inNameTagsAuto').checked = true;
  autoFill();
  pushHistory();
}

function bindSeg(id, key, onChange) {
  const seg = $(id);
  seg.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    seg.querySelectorAll('button').forEach((x) => x.classList.remove('active'));
    b.classList.add('active');
    state[key] = b.dataset[key];
    pushHistory();
    onChange();
  });
}

function canvasPoint(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((e.clientX - rect.left) / rect.width) * canvas.width,
    y: ((e.clientY - rect.top) / rect.height) * canvas.height,
  };
}

function hitPanel(x, y) {
  return lastRects.find((r) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) || null;
}

function hitBadge(x, y) {
  return lastRects.find((r) => r.badge && x >= r.badge.x && x <= r.badge.x + r.badge.w && y >= r.badge.y && y <= r.badge.y + r.badge.h) || null;
}

let drag = null;
let wheelTimer = null;

function bindCanvas() {
  canvas.addEventListener('pointerdown', (e) => {
    const pt = canvasPoint(e);
    const badge = hitBadge(pt.x, pt.y);
    const panel = hitPanel(pt.x, pt.y);
    if (badge) {
      drag = { kind: 'swap', from: badge.idx, startX: pt.x, startY: pt.y, moved: false };
    } else if (panel) {
      const p = state.panels[panel.idx];
      drag = {
        kind: 'pan', idx: panel.idx, startX: pt.x, startY: pt.y,
        startOx: p.ox, startOy: p.oy, w: panel.w, h: panel.h, moved: false,
      };
    } else {
      drag = null;
      return;
    }
    canvas.setPointerCapture(e.pointerId);
    canvas.classList.add('dragging');
  });

  canvas.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const pt = canvasPoint(e);
    const dx = pt.x - drag.startX;
    const dy = pt.y - drag.startY;
    if (Math.abs(dx) + Math.abs(dy) > 4) drag.moved = true;
    if (drag.kind === 'pan' && drag.moved) {
      const p = state.panels[drag.idx];
      p.ox = Math.max(-0.5, Math.min(0.5, drag.startOx - dx / drag.w));
      p.oy = Math.max(-0.5, Math.min(0.5, drag.startOy - dy / drag.h));
      $('inOx').value = String(p.ox);
      $('inOy').value = String(p.oy);
      $('oxVal').textContent = p.ox.toFixed(2);
      $('oyVal').textContent = p.oy.toFixed(2);
      renderPreview();
    }
  });

  canvas.addEventListener('pointerup', (e) => {
    if (!drag) return;
    const pt = canvasPoint(e);
    if (!drag.moved) {
      const panel = hitPanel(pt.x, pt.y);
      if (panel) selectPanel(panel.idx);
    } else if (drag.kind === 'swap') {
      const target = hitPanel(pt.x, pt.y);
      if (target && target.idx !== drag.from) swapPanels(drag.from, target.idx);
    } else if (drag.kind === 'pan') {
      pushHistory();
    }
    drag = null;
    canvas.classList.remove('dragging');
  });

  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const pt = canvasPoint(e);
    const panel = hitPanel(pt.x, pt.y);
    if (!panel) return;
    const p = state.panels[panel.idx];
    p.zoom = Math.max(0.8, Math.min(2.5, p.zoom * (e.deltaY < 0 ? 1.12 : 1 / 1.12)));
    if (panel.idx === state.selected) {
      $('inZoom').value = String(p.zoom);
      $('zoomVal').textContent = `${p.zoom.toFixed(2)}×`;
    }
    renderPreview();
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(() => pushHistory(), 400);
  }, { passive: false });

  canvas.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  });

  canvas.addEventListener('drop', (e) => {
    e.preventDefault();
    const pt = canvasPoint(e);
    const panel = hitPanel(pt.x, pt.y);
    if (!panel) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const src = String(reader.result);
        userPhotos.push({ src, name: file.name });
        assignPhoto(panel.idx, src);
        pushHistory();
      };
      reader.readAsDataURL(file);
      return;
    }
    const src = e.dataTransfer.getData('text/photo');
    if (src) {
      selectPanel(panel.idx);
      assignPhoto(panel.idx, src);
      pushHistory();
    }
  });
}

function bindEditor() {
  bindSeg('layoutSeg', 'layout', () => renderPreview());
  bindSeg('sizeSeg', 'size', () => renderPreview());
  bindSeg('gradeSeg', 'grade', () => renderPreview());

  const textBindings = [
    ['inKicker', 'kicker'], ['inTitle', 'title'], ['inSubtitle', 'subtitle'],
    ['inTagline', 'tagline'], ['inQuote', 'quote'], ['inPublication', 'publication'],
    ['inSeal', 'seal'], ['inSealRing', 'sealRing'], ['inRelease', 'release'],
    ['inEdition', 'edition'],
  ];
  for (const [id, key] of textBindings) {
    $(id).addEventListener('input', (e) => {
      state[key] = e.target.value;
      renderPreview();
    });
    $(id).addEventListener('change', () => pushHistory());
  }

  $('inTitleFont').addEventListener('change', (e) => {
    state.titleFont = e.target.value;
    pushHistory();
    renderPreview();
  });
  $('inScriptFont').addEventListener('change', (e) => {
    state.scriptFont = e.target.value;
    pushHistory();
    renderPreview();
  });
  $('inBilling').addEventListener('input', (e) => {
    state.billing = e.target.value.split('\n');
    renderPreview();
  });
  $('inBilling').addEventListener('change', () => pushHistory());

  $('inNameTagsAuto').addEventListener('change', (e) => {
    state.nameTagsAuto = e.target.checked;
    if (state.nameTagsAuto) {
      state.panels.forEach((p) => {
        const role = photoRole(p.photo);
        if (role) p.role = role;
      });
    }
    pushHistory();
    syncPanelControls();
    renderPreview();
  });
  $('inRole').addEventListener('input', (e) => {
    state.panels[state.selected].role = e.target.value.toUpperCase();
    buildPanelList();
    renderPreview();
  });
  $('inRole').addEventListener('change', () => pushHistory());

  $('inZoom').addEventListener('input', (e) => {
    state.panels[state.selected].zoom = parseFloat(e.target.value);
    syncPanelControls();
    renderPreview();
  });
  $('inZoom').addEventListener('change', () => pushHistory());
  $('inOx').addEventListener('input', (e) => {
    state.panels[state.selected].ox = parseFloat(e.target.value);
    syncPanelControls();
    renderPreview();
  });
  $('inOx').addEventListener('change', () => pushHistory());
  $('inOy').addEventListener('input', (e) => {
    state.panels[state.selected].oy = parseFloat(e.target.value);
    syncPanelControls();
    renderPreview();
  });
  $('inOy').addEventListener('change', () => pushHistory());

  $('prevPhotoBtn').addEventListener('click', () => cyclePhoto(-1));
  $('nextPhotoBtn').addEventListener('click', () => cyclePhoto(1));
  $('flipBtn').addEventListener('click', () => {
    const p = state.panels[state.selected];
    p.flip = !p.flip;
    pushHistory();
    renderPreview();
  });
  $('faceBtn').addEventListener('click', () => {
    const p = state.panels[state.selected];
    p.zoom = 1.9;
    p.oy = -0.15;
    p.ox = 0;
    pushHistory();
    syncPanelControls();
    renderPreview();
  });
  $('resetPanelBtn').addEventListener('click', () => {
    state.panels[state.selected] = defaultPanels()[state.selected];
    pushHistory();
    syncPanelControls();
    renderPreview();
  });
  $('autoFillBtn').addEventListener('click', () => {
    autoFill();
    pushHistory();
  });
  $('trySamplesBtn').addEventListener('click', () => trySamples());

  $('uploadInput').addEventListener('change', (e) => {
    const files = [...e.target.files];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const src = String(reader.result);
        userPhotos.push({ src, name: file.name });
        assignPhoto(state.selected, src);
        pushHistory();
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  });

  $('undoBtn').addEventListener('click', undo);
  $('redoBtn').addEventListener('click', redo);

  document.querySelectorAll('.step').forEach((b) => {
    b.addEventListener('click', () => {
      const step = b.dataset.step;
      if (step === '1') $('panelsGroup').scrollIntoView({ behavior: 'smooth', block: 'start' });
      else if (step === '2') $('captionGroup').scrollIntoView({ behavior: 'smooth', block: 'start' });
      else if (step === '3') exportSize(state.size, `sunset-strip-studio-${state.size}.png`);
    });
  });

  $('exportBtn').addEventListener('click', () => {
    exportSize(state.size, `sunset-strip-studio-${state.size}.png`);
  });
  $('exportAllBtn').addEventListener('click', async () => {
    for (const key of ['square', 'portrait', 'wide']) {
      await exportSize(key, `sunset-strip-studio-${key}.png`);
      await new Promise((r) => setTimeout(r, 400));
    }
  });

  bindCanvas();
}

// --------------------------------------------------------------- shot modes

function shotMode() {
  const params = new URLSearchParams(window.location.search);
  return params.get('shot');
}

async function init() {
  const params = new URLSearchParams(window.location.search);
  const shot = shotMode();
  if (shot) {
    document.body.classList.add('shot');
    if (shot === 'wide' || shot === 'cover') state.size = 'wide';
    else if (shot === 'portrait') state.size = 'portrait';
    else if (shot === 'square') state.size = 'square';
    const layoutParam = params.get('layout');
    if (layoutParam && ['mosaic', 'strips', 'sixgrid', 'masthead'].includes(layoutParam)) {
      state.layout = layoutParam;
    }
    const gradeParam = params.get('grade');
    if (gradeParam && GRADES[gradeParam]) state.grade = gradeParam;
    const s = SIZES[state.size];
    canvas.width = s.w;
    canvas.height = s.h;
    const fit = () => {
      const scale = Math.min(window.innerWidth / s.w, window.innerHeight / s.h);
      canvas.style.width = `${Math.floor(s.w * scale)}px`;
      canvas.style.height = `${Math.floor(s.h * scale)}px`;
    };
    window.addEventListener('resize', fit);
    fit();
    const ctx = canvas.getContext('2d');
    await drawCover(ctx, s.w, s.h, { badges: false });
    document.title = 'shot-ready';
    return;
  }
  bindEditor();
  buildPanelList();
  buildThumbs();
  syncAllControls();
  updateHistoryButtons();
  await renderPreview();
}

init();
