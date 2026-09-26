/* ============================================================================
   view/vec_fx.js — рисованные эффекты боя: заклинания, снаряды, удары, гибель отряда.

   Устройство:
   • Рисунки-детали (стрела, болт, копьё, топор, валун, кость, череп, шестерня,
     осколок льда, лист…) описаны через V.def и рисуются тем же конвейером, что
     и существа: объём, блик, контур. Имя — «существо.деталь» («archer.arrow»):
     деталь принадлежит настоящему спрайту, как колесо мельницы.
   • Свечение, дым, кольца, руны, следы — заранее нарисованные на маленьких
     холстах текстуры (радиальные градиенты), в кадре они только масштабируются
     и кладутся drawImage; светящееся — одним проходом в режиме 'lighter'.
   • Сцена эффектов H3.VFx.scene(fx) живёт рядом со старой сценой H3.Fx (тряску
     и вспышку экрана берёт у неё). Элементов на экране — десятки, не тысячи:
     на телефоне кадр не проседает даже в «Армагеддоне».
   • Каталог: VFx.spell / shot / melee / death / heal / aura / ability — бой
     передаёт только геометрию (прямоугольники отрядов, центры гексов, руку героя).
   Выключить и вернуть старые частицы — ?fx=0.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3, V = H3 && H3.Vec, K = H3 && H3.VK; if (!V || !K) return;

  const TAU = Math.PI * 2;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const eOut = t => 1 - (1 - t) * (1 - t);
  const eOut3 = t => 1 - Math.pow(1 - t, 3);
  const eIn = t => t * t;
  const c01 = v => v < 0 ? 0 : v > 1 ? 1 : v;

  /* ======================= рисунки-детали (V.def) ======================= */
  function prop(name, w, h, anchor, shapes) { V.def(name, { w, h, anchor, parts: [{ kind: 'prop', pivot: anchor, shapes }] }); }
  // снаряды — смотрят вправо, якорь в центре
  prop('archer.arrow', 160, 24, [80, 12], [
    { p: K.tube([[16, 12, 3.2], [140, 12, 3.2]], { flat1: true }), c: '#a8784a', m: 'wood', line: 0.5 },
    { p: [[6, 12], [16, 3], [40, 5], [44, 12, 1]], c: '#c8332a', m: 'cloth', line: 0.5 },
    { p: [[6, 12, 1], [44, 12, 1], [40, 19], [16, 21]], c: '#efe6d2', m: 'cloth', line: 0.5 },
    { p: [[134, 4], [158, 12, 1], [134, 20], [140, 12, 1]], c: '#c9ccd4', m: 'steel', line: 0.6 },
  ]);
  prop('marksman.bolt', 120, 26, [60, 13], [
    { p: K.tube([[14, 13, 5.5], [102, 13, 5.5]], { flat1: true }), c: '#7a5634', m: 'wood', line: 0.6 },
    { p: [[8, 13], [14, 3], [34, 7], [36, 13, 1]], c: '#6a4a2a', m: 'leather', line: 0.5 },
    { p: [[8, 13, 1], [36, 13, 1], [34, 19], [14, 23]], c: '#6a4a2a', m: 'leather', line: 0.5 },
    { p: [[96, 5], [118, 13, 1], [96, 21], [101, 13, 1]], c: '#b8bcc6', m: 'steel', line: 0.6 },
  ]);
  prop('lizardman.spear', 220, 26, [110, 13], [
    { p: K.tube([[8, 13, 4.5], [182, 13, 4.5]], { flat1: true }), c: '#8a6038', m: 'wood', line: 0.5 },
    { p: [[176, 13], [190, 5], [218, 13, 1], [190, 21]], c: '#c4c8ce', m: 'steel', line: 0.6 },
    { e: [180, 13, 5, 5], c: '#5a3a24', m: 'leather', line: 0.4 },
    { p: [[8, 13], [4, 6], [16, 10], [14, 13, 1]], c: '#3f7a3a', m: 'cloth', line: 0.4 },
  ]);
  prop('orc.axe', 90, 90, [45, 45], [
    { p: K.tube([[18, 80, 7], [64, 18, 7]]), c: '#7a5230', m: 'wood', line: 0.6 },
    { p: [[50, 16], [70, 2], [88, 22], [84, 44, 1], [64, 36, 1], [58, 26]], c: '#b9bdc4', m: 'steel', line: 0.7 },
  ]);
  prop('cyclops.rock', 80, 70, [40, 35], [
    { p: [[8, 38], [16, 14], [40, 5], [66, 12], [75, 34], [64, 60], [36, 67], [14, 57]], c: '#8f8577', m: 'leather', belly: 0.5, line: 0.7,
      lines: [{ p: [[30, 18], [38, 32], [33, 48]], w: 2 }, { p: [[52, 28], [62, 40]], w: 1.6 }], glint: [[28, 20, 5]] },
  ]);
  prop('stone_golem.rock', 50, 44, [25, 22], [
    { p: [[4, 24], [12, 6], [30, 3], [46, 14, 1], [44, 34], [24, 41], [8, 36]], c: '#9a8f80', m: 'leather', belly: 0.5, line: 0.6, lines: [{ p: [[20, 12], [26, 26]], w: 1.6 }] },
  ]);
  prop('earth_elemental.rock', 44, 40, [22, 20], [
    { p: [[3, 18, 1], [16, 3], [36, 6], [42, 22, 1], [30, 37], [10, 34]], c: '#7a6a58', m: 'leather', belly: 0.5, line: 0.6 },
  ]);
  prop('magma_elemental.rock', 44, 40, [22, 20], [
    { p: [[3, 20], [14, 4], [34, 5], [42, 20, 1], [32, 36], [10, 35]], c: '#3e302b', m: 'leather', line: 0.6,
      lines: [{ p: [[12, 12], [22, 20], [18, 32]], w: 2.4, c: '#ff8a2a' }, { p: [[22, 20], [34, 16]], w: 1.8, c: '#ffb04a' }] },
  ]);
  prop('halfling_grenadier.bomb', 50, 50, [25, 28], [
    { e: [25, 29, 16, 16], c: '#3a3d46', m: 'steel' },
    { p: [[20, 8], [30, 8], [30, 15], [20, 15]], c: '#b08d4a', m: 'gold', line: 0.5 },
  ]);
  prop('ice_elemental.shard', 90, 30, [45, 15], [
    { p: [[3, 15, 1], [28, 5, 1], [70, 7, 1], [88, 15, 1], [70, 23, 1], [28, 25, 1]], c: '#bfe6ff', m: 'gem', line: 0.5, lc: '#5a8ab8',
      lines: [{ p: [[8, 15], [84, 15]], w: 1.4, light: true }] },
  ]);
  // обломки гибели
  prop('skeleton.bone', 70, 22, [35, 11], [
    { e: [10, 7, 6, 5], c: '#e6dcc2', m: 'horn', line: 0.5 }, { e: [10, 15, 6, 5], c: '#e6dcc2', m: 'horn', line: 0.5 },
    { e: [60, 7, 6, 5], c: '#e6dcc2', m: 'horn', line: 0.5 }, { e: [60, 15, 6, 5], c: '#e6dcc2', m: 'horn', line: 0.5 },
    { p: K.tube([[11, 11, 6.5], [59, 11, 6.5]], { flat0: true, flat1: true }), c: '#e6dcc2', m: 'horn', line: 0.5 },
  ]);
  prop('skeleton.skull', 44, 44, [22, 22], [
    { p: [[13, 30], [31, 30], [29, 40], [15, 40]], c: '#d6caae', m: 'horn', line: 0.5 },
    { e: [22, 19, 16, 15], c: '#ece2c8', m: 'horn', line: 0.6, sub: [{ e: [15, 22, 4.5, 5], c: '#2a2220', m: 'flat' }, { e: [29, 22, 4.5, 5], c: '#2a2220', m: 'flat' }] },
  ]);
  const gear = []; for (let i = 0; i < 40; i++) { const a = i / 40 * TAU, r = (i % 4 < 2) ? 27 : 20; gear.push([30 + Math.cos(a + 0.04) * r, 30 + Math.sin(a + 0.04) * r, 1]); }
  prop('automaton.gear', 60, 60, [30, 30], [{ p: gear, c: '#b58d48', m: 'gold', line: 0.6, sub: [{ e: [30, 30, 7, 7], c: '#2a2420', m: 'flat' }] }]);
  prop('iron_golem.gear', 60, 60, [30, 30], [{ p: gear, c: '#9aa2ac', m: 'steel', line: 0.6, sub: [{ e: [30, 30, 8, 8], c: '#22252a', m: 'flat' }] }]);
  prop('iron_golem.plate', 50, 36, [25, 18], [{ p: [[4, 10, 1], [30, 3, 1], [47, 14, 1], [40, 32, 1], [10, 30, 1]], c: '#8e959e', m: 'steel', line: 0.6 }]);
  prop('ballista.plank', 80, 18, [40, 9], [{ p: [[3, 3, 1], [76, 5, 1], [78, 14, 1], [5, 15, 1]], c: '#9a6a3a', m: 'wood', line: 0.6, flow: 0 }]);
  const lf = K.leaf([4, 12], 0, 34, 16);
  prop('dendroid_guard.leaf', 40, 24, [20, 12], [{ p: lf.body, c: '#5a9a3a', m: 'cloth', line: 0.5, lines: [{ p: lf.shaft, w: 1.2 }] }]);

  /* ======================= текстуры ======================= */
  const TEX = new Map(), SPR = new Map();
  const Q = () => Math.min(3, Math.max(2, (root.devicePixelRatio || 1)));
  function mk(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  function tex(key, w, h, paint) { let c = TEX.get(key); if (!c) { c = mk(w, h); paint(c.getContext('2d'), w, h); TEX.set(key, c); } return c; }
  function rgbOf(c) {
    if (c[0] === '#') { let h = c.slice(1); if (h.length === 3) h = h.replace(/./g, x => x + x); const n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
    const m = c.match(/[\d.]+/g); return [+m[0], +m[1], +m[2]];
  }
  const rgba = (c, a) => { const [r, g, b] = rgbOf(c); return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')'; };
  const mix = (c, d, k) => { const a = rgbOf(c), b = rgbOf(d); return '#' + a.map((v, i) => Math.round(v + (b[i] - v) * k).toString(16).padStart(2, '0')).join(''); };
  function seeded(s) { let a = s >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const hash = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };

  /** Свечение: мягкое пятно цвета; hard — с белым раскалённым ядром. */
  const glowTex = (col, hard) => tex('glow|' + col + (hard ? '|h' : ''), 64, 64, c => {
    const g = c.createRadialGradient(32, 32, 0, 32, 32, 32);
    if (hard) { g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.22, rgba(col, 0.9)); g.addColorStop(0.55, rgba(col, 0.28)); g.addColorStop(1, rgba(col, 0)); }
    else { g.addColorStop(0, rgba(col, 0.85)); g.addColorStop(0.3, rgba(col, 0.48)); g.addColorStop(0.65, rgba(col, 0.13)); g.addColorStop(1, rgba(col, 0)); }
    c.fillStyle = g; c.fillRect(0, 0, 64, 64);
  });
  /** Клуб дыма: несколько мягких комков, светлее сверху. Три варианта на цвет. */
  const smokeTex = (col, v) => tex('smoke|' + col + '|' + v, 64, 64, c => {
    const r = seeded(hash(col) + v * 977), lite = mix(col, '#ffffff', 0.18);
    for (let i = 0; i < 7; i++) {
      const a = r() * TAU, d = r() * 9, x = 32 + Math.cos(a) * d, y = 33 + Math.sin(a) * d * 0.8, rr = 11 + r() * 9;
      const g = c.createRadialGradient(x, y - rr * 0.3, 0, x, y, rr);
      g.addColorStop(0, rgba(lite, 0.5)); g.addColorStop(0.55, rgba(col, 0.3)); g.addColorStop(1, rgba(col, 0));
      c.fillStyle = g; c.fillRect(0, 0, 64, 64);
    }
  });
  /** Ударная волна: светлый ободок, пустая середина. */
  const ringTex = col => tex('ring|' + col, 128, 128, c => {
    const g = c.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, rgba(col, 0)); g.addColorStop(0.56, rgba(col, 0)); g.addColorStop(0.78, rgba(col, 0.5));
    g.addColorStop(0.89, rgba(mix(col, '#ffffff', 0.6), 0.95)); g.addColorStop(0.95, rgba(col, 0.35)); g.addColorStop(1, rgba(col, 0));
    c.fillStyle = g; c.fillRect(0, 0, 128, 128);
  });
  /** Столб света: поперёк — светлое ядро, вдоль — тает кверху. */
  const pillarTex = col => tex('pillar|' + col, 64, 128, c => {
    const g = c.createLinearGradient(0, 0, 64, 0);
    g.addColorStop(0, rgba(col, 0)); g.addColorStop(0.3, rgba(col, 0.45)); g.addColorStop(0.5, 'rgba(255,255,245,0.95)'); g.addColorStop(0.7, rgba(col, 0.45)); g.addColorStop(1, rgba(col, 0));
    c.fillStyle = g; c.fillRect(0, 0, 64, 128);
    const v = c.createLinearGradient(0, 0, 0, 128); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(0.45, 'rgba(0,0,0,0.7)'); v.addColorStop(1, 'rgba(0,0,0,1)');
    c.globalCompositeOperation = 'destination-in'; c.fillStyle = v; c.fillRect(0, 0, 64, 128);
  });
  /** Следы на земле: копоть, воронка, иней, кислота, лужа, трещины. */
  const decalTex = kind => tex('decal|' + kind, 128, 128, c => {
    const r = seeded(hash(kind)), rad = (stops) => { const g = c.createRadialGradient(64, 64, 0, 64, 64, 64); for (const [k, col] of stops) g.addColorStop(k, col); c.fillStyle = g; c.fillRect(0, 0, 128, 128); };
    const rays = (n, col, w, l0, l1) => { c.strokeStyle = col; c.lineCap = 'round'; for (let i = 0; i < n; i++) { const a = r() * TAU, L = l0 + r() * (l1 - l0); c.lineWidth = w * (0.5 + r()); c.beginPath(); c.moveTo(64 + Math.cos(a) * 10, 64 + Math.sin(a) * 10); c.lineTo(64 + Math.cos(a + (r() - 0.5) * 0.2) * L, 64 + Math.sin(a) * L); c.stroke(); } };
    if (kind === 'scorch') { rad([[0, 'rgba(18,12,8,0.8)'], [0.4, 'rgba(28,18,10,0.55)'], [0.75, 'rgba(40,26,14,0.18)'], [1, 'rgba(40,26,14,0)']]); rays(16, 'rgba(20,12,6,0.35)', 3, 30, 60); }
    else if (kind === 'crater') {
      rad([[0, 'rgba(20,14,10,0.8)'], [0.38, 'rgba(34,24,16,0.6)'], [0.52, 'rgba(150,120,90,0.55)'], [0.64, 'rgba(60,44,30,0.4)'], [1, 'rgba(60,44,30,0)']]);
      c.fillStyle = 'rgba(70,52,36,0.5)'; for (let i = 0; i < 26; i++) { const a = r() * TAU, d = 38 + r() * 22; c.beginPath(); c.arc(64 + Math.cos(a) * d, 64 + Math.sin(a) * d, 1 + r() * 2.5, 0, TAU); c.fill(); }
    } else if (kind === 'frost') {
      rad([[0, 'rgba(235,248,255,0.8)'], [0.45, 'rgba(190,225,255,0.5)'], [1, 'rgba(190,225,255,0)']]);
      c.strokeStyle = 'rgba(255,255,255,0.75)'; c.lineCap = 'round';
      for (let i = 0; i < 9; i++) { const a = r() * TAU, L = 30 + r() * 30; c.lineWidth = 2; c.beginPath(); c.moveTo(64, 64); const ex = 64 + Math.cos(a) * L, ey = 64 + Math.sin(a) * L; c.lineTo(ex, ey); c.stroke();
        c.lineWidth = 1.2; for (let j = 1; j < 3; j++) { const k = j / 3, bx = 64 + Math.cos(a) * L * k, by = 64 + Math.sin(a) * L * k; for (const s of [-1, 1]) { c.beginPath(); c.moveTo(bx, by); c.lineTo(bx + Math.cos(a + s * 0.7) * 9, by + Math.sin(a + s * 0.7) * 9); c.stroke(); } } }
    } else if (kind === 'acid') {
      for (let i = 0; i < 6; i++) { const x = 64 + (r() - 0.5) * 40, y = 64 + (r() - 0.5) * 40, rr = 16 + r() * 18; const g = c.createRadialGradient(x, y, 0, x, y, rr); g.addColorStop(0, 'rgba(150,220,40,0.6)'); g.addColorStop(0.7, 'rgba(90,160,20,0.35)'); g.addColorStop(1, 'rgba(90,160,20,0)'); c.fillStyle = g; c.fillRect(0, 0, 128, 128); }
    } else if (kind === 'puddle') {
      rad([[0, 'rgba(70,130,210,0.55)'], [0.6, 'rgba(60,110,190,0.4)'], [0.85, 'rgba(150,200,255,0.35)'], [1, 'rgba(60,110,190,0)']]);
      c.fillStyle = 'rgba(230,245,255,0.45)'; c.beginPath(); c.ellipse(50, 48, 18, 6, -0.3, 0, TAU); c.fill();
    } else if (kind === 'cracks') {
      rad([[0, 'rgba(30,20,12,0.5)'], [0.5, 'rgba(30,20,12,0.15)'], [1, 'rgba(30,20,12,0)']]);
      c.strokeStyle = 'rgba(25,16,10,0.75)'; c.lineCap = 'round';
      for (let i = 0; i < 8; i++) { let x = 64, y = 64, a = i / 8 * TAU + r() * 0.5; c.lineWidth = 3; c.beginPath(); c.moveTo(x, y); for (let j = 0; j < 5; j++) { a += (r() - 0.5) * 0.9; x += Math.cos(a) * 11; y += Math.sin(a) * 11; c.lineTo(x, y); c.lineWidth = 3 - j * 0.5; } c.stroke(); }
    } else if (kind === 'dark') { rad([[0, 'rgba(40,10,60,0.6)'], [0.6, 'rgba(30,10,50,0.3)'], [1, 'rgba(30,10,50,0)']]); }
  });

  /* ---------- руны ---------- */
  function glyphPath(c, g) {
    const L = pts => { c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); };
    const O = (x, y, r) => { c.beginPath(); c.arc(x, y, r, 0, TAU); c.stroke(); };
    switch (g) {
      case 'sun': O(0, 0, 11); for (let i = 0; i < 8; i++) { const a = i * TAU / 8; L([[Math.cos(a) * 17, Math.sin(a) * 17], [Math.cos(a) * 29, Math.sin(a) * 29]]); } break;
      case 'wing': L([[-28, -15], [-10, 0], [-28, 15]]); L([[-12, -15], [6, 0], [-12, 15]]); L([[4, -15], [22, 0], [4, 15]]); break;
      case 'hourglass': L([[-15, -24], [15, -24], [-15, 24], [15, 24], [-15, -24]]); L([[-20, -24], [20, -24]]); L([[-20, 24], [20, 24]]); break;
      case 'shield': c.beginPath(); c.moveTo(-18, -22); c.lineTo(18, -22); c.lineTo(18, -2); c.quadraticCurveTo(16, 18, 0, 27); c.quadraticCurveTo(-16, 18, -18, -2); c.closePath(); c.stroke(); L([[0, -22], [0, 27]]); L([[-18, -4], [18, -4]]); break;
      case 'stone': { const h = []; for (let i = 0; i <= 6; i++) { const a = i * TAU / 6 + 0.5; h.push([Math.cos(a) * 23, Math.sin(a) * 23]); } L(h); L([[-9, -12], [2, 0], [-5, 13]]); L([[2, 0], [15, -5]]); break; }
      case 'drop': c.beginPath(); c.moveTo(0, -27); c.bezierCurveTo(10, -10, 18, 0, 17, 10); c.arc(0, 10, 17, 0, Math.PI); c.bezierCurveTo(-18, 0, -10, -10, 0, -27); c.stroke(); L([[-7, 8], [0, 16], [7, 8]]); break;
      case 'target': O(0, 0, 21); O(0, 0, 9); L([[0, -30], [0, -13]]); L([[0, 13], [0, 30]]); L([[-30, 0], [-13, 0]]); L([[13, 0], [30, 0]]); break;
      case 'clover': for (let i = 0; i < 4; i++) { const a = i * TAU / 4 + TAU / 8; O(Math.cos(a) * 11, Math.sin(a) * 11, 9); } L([[0, 12], [6, 28]]); break;
      case 'swirl': c.beginPath(); for (let i = 0; i <= 40; i++) { const a = i / 40 * TAU * 1.7, r = 3 + i * 0.65; const x = Math.cos(a) * r, y = Math.sin(a) * r; i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); break;
      case 'cross': L([[0, -24], [0, 24]]); L([[-24, 0], [24, 0]]); O(0, 0, 8); break;
      case 'down': L([[0, -26], [0, 20]]); L([[-14, 6], [0, 20], [14, 6]]); L([[-18, 28], [18, 28]]); break;
      case 'skull': O(0, -6, 17); O(-7, -6, 4); O(7, -6, 4); L([[-9, 11], [-9, 20], [9, 20], [9, 11]]); L([[-3, 12], [-3, 20]]); L([[3, 12], [3, 20]]); break;
      case 'eye': case 'eyeX': c.beginPath(); c.moveTo(-28, 0); c.quadraticCurveTo(0, -24, 28, 0); c.quadraticCurveTo(0, 24, -28, 0); c.stroke(); O(0, 0, 7); if (g === 'eyeX') L([[-24, -20], [24, 20]]); break;
      case 'rage': for (const dx of [-14, 0, 14]) L([[dx - 4, -26], [dx + 4, -10], [dx - 4, 4], [dx + 4, 22]]); break;
      case 'break': O(0, 0, 22); L([[-4, -30], [4, -10], [-6, 4], [5, 18], [-2, 30]]); break;
      case 'ray': for (let i = 0; i < 6; i++) { const a = i * TAU / 6; L([[Math.cos(a) * 6, Math.sin(a) * 6], [Math.cos(a) * 28, Math.sin(a) * 28]]); } O(0, 0, 4); break;
      case 'ankh': c.beginPath(); c.ellipse(0, -14, 9, 12, 0, 0, TAU); c.stroke(); L([[0, -2], [0, 28]]); L([[-16, 6], [16, 6]]); break;
      case 'star': { const p = []; for (let i = 0; i <= 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 11 : 27; p.push([Math.cos(a) * r, Math.sin(a) * r]); } L(p); break; }
      default: O(0, 0, 18);
    }
  }
  /** Круг-печать на земле: двойное кольцо, бегущие знаки, символ в центре. */
  const runeTex = (glyph, col) => tex('rune|' + glyph + '|' + col, 128, 128, c => {
    c.translate(64, 64); c.shadowColor = col; c.shadowBlur = 9; c.strokeStyle = mix(col, '#ffffff', 0.55); c.lineCap = 'round'; c.lineJoin = 'round';
    c.lineWidth = 3.2; c.beginPath(); c.arc(0, 0, 55, 0, TAU); c.stroke();
    c.lineWidth = 1.6; c.beginPath(); c.arc(0, 0, 44, 0, TAU); c.stroke();
    c.lineWidth = 1.8;
    for (let i = 0; i < 16; i++) {
      c.save(); c.rotate(i * TAU / 16); c.translate(0, -49.5); c.beginPath();
      if (i % 4 === 0) { c.moveTo(0, -3); c.lineTo(0, 3); } else if (i % 4 === 1) { c.moveTo(-3, -3); c.lineTo(0, 3); c.lineTo(3, -3); } else if (i % 4 === 2) { c.moveTo(-3, -3); c.lineTo(3, 3); c.moveTo(3, -3); c.lineTo(-3, 3); } else c.arc(0, 0, 2.2, 0, TAU);
      c.stroke(); c.restore();
    }
    c.lineWidth = 3.4; c.scale(1.05, 1.05); glyphPath(c, glyph);
  });
  const glyphTex = (glyph, col) => tex('glyph|' + glyph + '|' + col, 96, 96, c => {
    c.translate(48, 48); c.lineCap = 'round'; c.lineJoin = 'round';
    c.shadowColor = col; c.shadowBlur = 10; c.strokeStyle = col; c.lineWidth = 8; glyphPath(c, glyph);
    c.shadowBlur = 0; c.strokeStyle = mix(col, '#ffffff', 0.7); c.lineWidth = 3.6; glyphPath(c, glyph);
  });

  /** Естественный размер детали (множитель к «10 единиц = 1 точка»): при s = 1 кость ≈ 10 точек, стрела ≈ 16. */
  const SZ = { 'skeleton.bone': 2, 'skeleton.skull': 2.6, 'cyclops.rock': 1, 'stone_golem.rock': 1.8, 'earth_elemental.rock': 2, 'magma_elemental.rock': 1.6,
    'automaton.gear': 1.5, 'iron_golem.gear': 1.5, 'iron_golem.plate': 1.4, 'ballista.plank': 1.5, 'dendroid_guard.leaf': 1.8, 'ice_elemental.shard': 0.9, 'orc.axe': 1.3, 'halfling_grenadier.bomb': 1.4 };
  /** Рисунок-деталь в нужном масштабе (кэш по квантованной плотности). */
  function sprite(name, sc) {
    // плотность — ступенями по √2 с запасом вверх: обломки разного размера берут одну картинку, а не рисуют каждый свою
    const b = SZ[name] || 1, S = Math.max(0.5, Math.pow(2, Math.ceil(Math.log2(sc * b * Q()) * 2) / 2)), key = name + '|' + S;
    let r = SPR.get(key);
    if (!r) { const cv = V.render(name, S); r = cv ? { cv, S, b, ax: cv._anchor[0] * S, ay: cv._anchor[1] * S } : null; SPR.set(key, r); }
    return r;
  }
  function drawSprite(ctx, spr, x, y, rot, sc, sy) {
    if (!spr) return;
    const k = sc * spr.b / spr.S;
    ctx.translate(x, y); if (rot) ctx.rotate(rot); ctx.scale(k, k * (sy || 1));
    ctx.drawImage(spr.cv, -spr.ax, -spr.ay);
    ctx.setTransform(ctx._vfxBase);
  }

  /* ======================= сцена ======================= */
  function scene(fx) {
    const S = { under: [], over: [], t: 0, rate: 1, waits: [], bounds: { w: 2000, h: 1200 }, size: 26 };
    const ws = () => S.size / 26;
    function push(it) {
      it.t = -(it.delay || 0);
      (it.under ? S.under : S.over).push(it);
      return it;
    }
    function update(dt) {
      dt *= S.rate; S.t += dt;
      const s = dt / 1000;
      for (const L of [S.under, S.over]) for (let i = L.length - 1; i >= 0; i--) {
        const it = L[i]; it.t += dt;
        if (it.t < 0) continue;
        if (it.step) it.step(s, it);
        if (it.t >= it.ttl) { L.splice(i, 1); if (it.end) it.end(it); }
      }
      for (let i = S.waits.length - 1; i >= 0; i--) if (S.t >= S.waits[i].at) { const w = S.waits[i]; S.waits.splice(i, 1); w.res(); }
    }
    function drawList(ctx, L) {
      if (!L.length) return;
      ctx.save(); ctx.imageSmoothingEnabled = true; ctx._vfxBase = ctx.getTransform();
      for (const it of L) if (!it.add && it.t >= 0) it.draw(ctx, Math.min(1, it.t / it.ttl), it);
      ctx.globalCompositeOperation = 'lighter';
      for (const it of L) if (it.add && it.t >= 0) it.draw(ctx, Math.min(1, it.t / it.ttl), it);
      ctx.restore(); ctx.globalAlpha = 1;
    }
    function after(ms) {
      return new Promise(res => { S.waits.push({ at: S.t + ms, res }); setTimeout(res, ms / S.rate * 2 + 1200); });
    }
    function clear() {
      for (const L of [S.under, S.over]) { const all = L.splice(0); for (const it of all) if (it.end) it.end(it); }
      for (const w of S.waits.splice(0)) w.res();
    }
    const sc = {
      S, ws, push, update, after, clear,
      busy: () => S.under.length + S.over.length > 0,
      drawUnder: ctx => drawList(ctx, S.under),
      drawOver: ctx => drawList(ctx, S.over),
      shake: (a, ms) => { if (fx) fx.shake(a * Math.min(1.4, ws()), ms / S.rate); },
      flash: (col, a, ms) => { if (fx) fx.flash({ color: col, alpha: a, ttl: ms / S.rate }); },
    };
    /* ---------- примитивы ---------- */
    const fade = (k, mode) => mode === 'inout' ? Math.sin(k * Math.PI) : mode === 'hold' ? (k < 0.55 ? c01(k / 0.08) : 1 - (k - 0.55) / 0.45) : Math.pow(1 - k, 1.4);
    /** Свечение (аддитивное пятно). */
    sc.glow = (x, y, o) => push({ x, y, ttl: o.ttl || 300, delay: o.delay, under: !!o.under, add: true, r0: o.r, r1: o.r1 === undefined ? o.r : o.r1, a: o.a === undefined ? 1 : o.a, sq: o.sq || 1, tx: glowTex(o.col, o.hard), mode: o.mode, vx: o.vx || 0, vy: o.vy || 0, drag: o.drag || 0, fl: o.flicker,
      step: (o.vx || o.vy) ? (s, it) => { it.x += it.vx * s; it.y += it.vy * s; if (it.drag) { it.vx *= 1 - it.drag * s; it.vy *= 1 - it.drag * s; } } : null,
      draw(ctx, k, it) { const r = it.r0 + (it.r1 - it.r0) * eOut(k); ctx.globalAlpha = c01(it.a * fade(k, it.mode) * (it.fl ? 0.8 + 0.2 * Math.sin(it.t / 27 + it.x) : 1)); ctx.drawImage(it.tx, it.x - r, it.y - r * it.sq, r * 2, r * 2 * it.sq); } });
    /** Кольцо-волна. */
    sc.ring = (x, y, o) => push({ x, y, ttl: o.ttl || 400, delay: o.delay, under: o.under !== false, add: true, r0: o.r0, r1: o.r1, sq: o.sq === undefined ? 0.42 : o.sq, a: o.a === undefined ? 1 : o.a, tx: ringTex(o.col), inward: o.r1 < o.r0,
      draw(ctx, k, it) { const r = it.r0 + (it.r1 - it.r0) * (it.inward ? eIn(k) : eOut3(k)); ctx.globalAlpha = c01(it.a * (it.inward ? Math.min(1, k * 4) : Math.pow(1 - k, 1.2))); ctx.drawImage(it.tx, it.x - r, it.y - r * it.sq, r * 2, r * 2 * it.sq); } });
    /** Дым/пыль/туман: мягкие клубы, растут и тают. */
    sc.smoke = (x, y, o) => {
      const w = ws();
      for (let i = 0; i < (o.n || 4); i++) {
        const a = rnd(0, TAU), d = rnd(0, o.spread || 6 * w);
        push({ x: x + Math.cos(a) * d, y: y + Math.sin(a) * d * 0.5, vx: (o.vx || 0) + Math.cos(a) * (o.out || 10) * w, vy: (o.vy === undefined ? -18 * w : o.vy) * rnd(0.6, 1.3) + Math.sin(a) * (o.out || 10) * w * 0.4,
          ttl: (o.ttl || 1000) * rnd(0.75, 1.25), delay: (o.delay || 0) + rnd(0, o.jitter || 0), under: !!o.under, add: !!o.add, size: (o.size || 8 * w) * rnd(0.75, 1.25), grow: o.grow === undefined ? 1.2 : o.grow,
          tx: o.add ? glowTex(o.col) : smokeTex(o.col, i % 3), a: o.a === undefined ? 0.8 : o.a, swirl: o.swirl ? { cx: x, cy: y, ang: a, r: d + (o.swirlR || 0), w: o.swirl * (Math.random() < 0.5 ? 1 : -1) } : null,
          step(s, it) {
            if (it.swirl) { const q = it.swirl; q.ang += q.w * s; q.r += 6 * w * s; q.cy += it.vy * s * 0.4; it.x = q.cx + Math.cos(q.ang) * q.r; it.y = q.cy + Math.sin(q.ang) * q.r * 0.4; return; }
            it.x += it.vx * s; it.y += it.vy * s; it.vx *= 1 - 1.2 * s; it.vy *= 1 - 0.5 * s;
          },
          draw(ctx, k, it) { const r = it.size * (1 + it.grow * eOut(k)); ctx.globalAlpha = c01(it.a * (k < 0.12 ? k / 0.12 : Math.pow((1 - k) / 0.88, 1.3))); ctx.drawImage(it.tx, it.x - r, it.y - r, r * 2, r * 2); } });
      }
    };
    /** Искры: раскалённые штрихи вдоль скорости, с тяжестью. */
    sc.sparks = (x, y, o) => {
      const w = ws(), a0 = o.angle === undefined ? -Math.PI / 2 : o.angle, spread = o.spread === undefined ? TAU : o.spread;
      for (let i = 0; i < (o.n || 8); i++) {
        const a = a0 + rnd(-spread / 2, spread / 2), v = (o.speed || 120) * w * rnd(0.4, 1);
        push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, ttl: (o.ttl || 400) * rnd(0.6, 1.2), delay: o.delay, under: false, add: true, col: pick([].concat(o.col || '#ffd070')), wd: (o.w || 1.4) * w, len: (o.len || 5) * w, g: (o.grav === undefined ? 300 : o.grav) * w, drag: o.drag || 1.2,
          step(s, it) { it.vy += it.g * s; it.vx *= 1 - it.drag * s; it.vy *= 1 - it.drag * s * 0.5; it.x += it.vx * s; it.y += it.vy * s; },
          draw(ctx, k, it) { const sp = Math.hypot(it.vx, it.vy) || 1, L = Math.min(it.len * 3, it.len * sp / (90 * w)) + 1; const ex = it.x - it.vx / sp * L, ey = it.y - it.vy / sp * L;
            ctx.globalAlpha = c01(1 - k); ctx.strokeStyle = it.col; ctx.lineCap = 'round'; ctx.lineWidth = it.wd * 2.2; ctx.globalAlpha *= 0.45; ctx.beginPath(); ctx.moveTo(it.x, it.y); ctx.lineTo(ex, ey); ctx.stroke();
            ctx.globalAlpha = c01(1 - k); ctx.strokeStyle = '#fffbe8'; ctx.lineWidth = it.wd * 0.8; ctx.beginPath(); ctx.moveTo(it.x, it.y); ctx.lineTo(ex, ey); ctx.stroke(); } });
      }
    };
    /** Угольки/искорки: светящиеся точки, всплывают с покачиванием. */
    sc.embers = (x, y, o) => {
      const w = ws();
      for (let i = 0; i < (o.n || 6); i++) push({ x: x + rnd(-1, 1) * (o.spread || 10) * w, y: y + rnd(-1, 0.3) * (o.spreadY || o.spread || 10) * w, vx: rnd(-10, 10) * w, vy: (o.vy === undefined ? -rnd(20, 50) : o.vy * rnd(0.6, 1.3)) * w, ph: rnd(0, TAU),
        ttl: (o.ttl || 900) * rnd(0.6, 1.3), delay: (o.delay || 0) + rnd(0, o.jitter || 0), add: true, under: !!o.under, r: (o.r || 2.2) * w * rnd(0.7, 1.3), tx: glowTex(pick([].concat(o.col || '#ffb04a')), true), g: (o.grav || 0) * w,
        step(s, it) { it.vy += it.g * s; it.x += (it.vx + Math.sin(it.t / 160 + it.ph) * 14 * w) * s; it.y += it.vy * s; },
        draw(ctx, k, it) { const r = it.r * (1.6 - k * 0.8); ctx.globalAlpha = c01((k < 0.1 ? k / 0.1 : 1 - k) * (0.75 + 0.25 * Math.sin(it.t / 40 + it.ph))); ctx.drawImage(it.tx, it.x - r * 2, it.y - r * 2, r * 4, r * 4); } });
    };
    /** Обломки-рисунки: разлёт, вращение, отскок от земли. */
    sc.debris = (x, y, o) => {
      const w = ws(), names = [].concat(o.names), a0 = o.angle === undefined ? -Math.PI / 2 : o.angle, spread = o.spread === undefined ? Math.PI * 1.4 : o.spread;
      for (let i = 0; i < (o.n || 5); i++) {
        const a = a0 + rnd(-spread / 2, spread / 2), v = (o.speed || 110) * w * rnd(0.45, 1), s = (o.s || 1) * w * rnd(0.7, 1.15);
        push({ x: x + rnd(-4, 4) * w, y: y + rnd(-4, 4) * w, vx: Math.cos(a) * v, vy: Math.sin(a) * v, rot: rnd(0, TAU), vr: rnd(-1, 1) * (o.spin || 9), ttl: (o.ttl || 1100) * rnd(0.8, 1.2), delay: o.delay, add: false,
          ground: (o.ground === undefined ? y + 12 * w : o.ground) + rnd(-3, 5) * w, g: (o.grav === undefined ? 420 : o.grav) * w, spr: sprite(names[i % names.length], s), s, hop: 0, a: o.a || 1,
          step(s2, it) { it.vy += it.g * s2; it.x += it.vx * s2; it.y += it.vy * s2; it.rot += it.vr * s2;
            if (it.g > 0 && it.y > it.ground) { it.y = it.ground; if (it.hop++ < 2) { it.vy *= -0.32; it.vx *= 0.55; it.vr *= 0.5; } else { it.vy = 0; it.vx *= 0.8; it.vr = 0; } } },
          draw(ctx, k, it) { ctx.globalAlpha = c01(it.a * (k < 0.7 ? 1 : (1 - k) / 0.3)); drawSprite(ctx, it.spr, it.x, it.y, it.rot, it.s); } });
      }
    };
    /** Стягивание: детали/огоньки летят с окружности в точку. */
    sc.converge = (x, y, o) => {
      const w = ws();
      for (let i = 0; i < (o.n || 6); i++) {
        const a = i / (o.n || 6) * TAU + rnd(-0.3, 0.3), R = (o.R || 30) * w * rnd(0.8, 1.2), glowC = o.glow;
        push({ x, y, a, R, ttl: (o.ttl || 450) * rnd(0.85, 1.1), delay: (o.delay || 0) + rnd(0, o.jitter || 60), add: !!glowC, rot: rnd(0, TAU), sq: o.sq || 0.6,
          spr: o.names ? sprite(pick(o.names), (o.s || 1) * w) : null, tx: glowC ? glowTex(glowC, true) : null, r: (o.r || 3) * w, s: (o.s || 1) * w,
          draw(ctx, k, it) { const q = eIn(k), px = it.x + Math.cos(it.a + q * 1.2) * it.R * (1 - q), py = it.y + Math.sin(it.a + q * 1.2) * it.R * (1 - q) * it.sq - (1 - q) * 8 * w;
            ctx.globalAlpha = c01(Math.min(1, k * 5) * (k > 0.9 ? (1 - k) / 0.1 : 1));
            if (it.tx) ctx.drawImage(it.tx, px - it.r * 2, py - it.r * 2, it.r * 4, it.r * 4); else drawSprite(ctx, it.spr, px, py, it.rot + q * 5, it.s); } });
      }
    };
    /** Капли жидкости: летят, падают на землю плоскими брызгами. */
    sc.drops = (x, y, o) => {
      const w = ws(), a0 = o.angle === undefined ? -Math.PI / 2 : o.angle, spread = o.spread === undefined ? Math.PI * 1.3 : o.spread;
      for (let i = 0; i < (o.n || 8); i++) {
        const a = a0 + rnd(-spread / 2, spread / 2), v = (o.speed || 90) * w * rnd(0.4, 1);
        push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, ttl: (o.ttl || 800) * rnd(0.8, 1.2), delay: o.delay, add: false, col: o.col || '#b0201a', hi: mix(o.col || '#b0201a', '#ffffff', 0.5), r: (o.r || 1.6) * w * rnd(0.6, 1.3),
          ground: (o.ground === undefined ? y + 14 * w : o.ground) + rnd(-3, 4) * w, landed: 0, g: 380 * w,
          step(s, it) { if (it.landed) return; it.vy += it.g * s; it.x += it.vx * s; it.y += it.vy * s; if (it.y >= it.ground) { it.y = it.ground; it.landed = it.t; } },
          draw(ctx, k, it) { ctx.globalAlpha = c01(0.9 * (k < 0.65 ? 1 : (1 - k) / 0.35)); ctx.fillStyle = it.col; ctx.beginPath();
            if (it.landed) ctx.ellipse(it.x, it.y, it.r * 1.9, it.r * 0.6, 0, 0, TAU);
            else { const sp = Math.hypot(it.vx, it.vy) || 1, st = Math.min(2.2, 1 + sp / (220 * w)); ctx.ellipse(it.x, it.y, it.r * st, it.r, Math.atan2(it.vy, it.vx), 0, TAU); }
            ctx.fill(); if (!it.landed) { ctx.fillStyle = it.hi; ctx.beginPath(); ctx.arc(it.x - it.r * 0.3, it.y - it.r * 0.35, it.r * 0.35, 0, TAU); ctx.fill(); } } });
      }
    };
    /** Молния: ломаная с ветвями, вспышка — провал — повторный разряд — остаточное свечение. */
    function jag(x1, y1, x2, y2, amp, depth) {
      let pts = [[x1, y1], [x2, y2]];
      for (let d = 0; d < depth; d++) {
        const out = [pts[0]];
        for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, nx = -(b[1] - a[1]), ny = b[0] - a[0], l = Math.hypot(nx, ny) || 1, off = rnd(-amp, amp); out.push([mx + nx / l * off, my + ny / l * off], b); }
        pts = out; amp *= 0.55;
      }
      return pts;
    }
    sc.bolt = (x1, y1, x2, y2, o) => {
      o = o || {};
      const w = ws(), len = Math.hypot(x2 - x1, y2 - y1), amp = (o.amp || 0.16) * len;
      const main = jag(x1, y1, x2, y2, amp, o.depth || 5), br = [];
      for (let i = 0; i < (o.branches === undefined ? 3 : o.branches); i++) {
        const p = main[Math.floor(rnd(0.15, 0.8) * main.length)], a = Math.atan2(y2 - y1, x2 - x1) + rnd(-0.9, 0.9), L = len * rnd(0.12, 0.3);
        br.push(jag(p[0], p[1], p[0] + Math.cos(a) * L, p[1] + Math.sin(a) * L, L * 0.2, 3));
      }
      const alt = o.restrike === false ? null : jag(x1, y1, x2, y2, amp * 0.8, o.depth || 5);
      return push({ ttl: o.ttl || 420, delay: o.delay, add: true, main, br, alt, wd: (o.w || 2) * w, col: o.col || '#7fc8ff',
        draw(ctx, k, it) {
          const t = it.t, a = t < 70 ? 1 : t < 115 ? 0.2 : t < 170 ? 0.95 : Math.pow(1 - (t - 170) / Math.max(1, it.ttl - 170), 1.6) * 0.8;
          const pts = t >= 115 && it.alt ? it.alt : it.main;
          const line = (P, lw, col, al) => { ctx.globalAlpha = c01(al * a); ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath(); P.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); };
          ctx.lineCap = 'round'; ctx.lineJoin = 'round';
          line(pts, it.wd * 6, it.col, 0.14); line(pts, it.wd * 2.6, it.col, 0.5);
          if (t < 170) for (const b of it.br) { line(b, it.wd * 2.2, it.col, 0.4); line(b, it.wd * 0.7, '#ffffff', 0.9); }
          line(pts, it.wd, '#ffffff', 1);
        } });
    };
    /** Луч: прямой пульсирующий поток между точками. */
    sc.beam = (x1, y1, x2, y2, o) => push({ ttl: o.ttl || 450, delay: o.delay, add: true, x1, y1, x2, y2, col: o.col, wd: (o.w || 3) * ws(),
      draw(ctx, k, it) { const a = fade(k, 'inout'), puls = 1 + 0.3 * Math.sin(it.t / 25);
        const grow = Math.min(1, k * 5), ex = it.x1 + (it.x2 - it.x1) * grow, ey = it.y1 + (it.y2 - it.y1) * grow;
        ctx.lineCap = 'round'; ctx.strokeStyle = it.col;
        ctx.globalAlpha = 0.18 * a; ctx.lineWidth = it.wd * 5 * puls; ctx.beginPath(); ctx.moveTo(it.x1, it.y1); ctx.lineTo(ex, ey); ctx.stroke();
        ctx.globalAlpha = 0.55 * a; ctx.lineWidth = it.wd * 2 * puls; ctx.stroke();
        ctx.globalAlpha = a; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = it.wd * 0.7; ctx.stroke(); } });
    /** След на земле (копоть, воронка, иней, лужа…): медленно тает. */
    sc.decal = (x, y, o) => push({ x, y, ttl: o.ttl || 2600, delay: o.delay, under: true, add: false, r: o.r, sq: o.sq || 0.42, tx: decalTex(o.kind), a: o.a === undefined ? 1 : o.a,
      draw(ctx, k, it) { const r = it.r * (k < 0.06 ? 0.6 + 0.4 * k / 0.06 : 1); ctx.globalAlpha = c01(it.a * (k < 0.06 ? k / 0.06 : k > 0.6 ? (1 - k) / 0.4 : 1)); ctx.drawImage(it.tx, it.x - r, it.y - r * it.sq, r * 2, r * 2 * it.sq); } });
    /** Дуга удара: след лезвия проносится и тает. claws — три параллельных следа. */
    sc.slash = (x, y, o) => push({ x, y, ttl: o.ttl || 260, add: true, dir: o.dir || 1, R: o.R, col: o.col || '#9fd0ff', core: o.core || '#ffffff', wd: (o.w || 3) * ws(), claws: o.claws || 0, tilt: o.tilt === undefined ? rnd(-0.35, 0.2) : o.tilt,
      draw(ctx, k, it) {
        const head = eOut(Math.min(1, k / 0.42)), fadeA = k < 0.42 ? 1 : 1 - (k - 0.42) / 0.58;
        ctx.save(); ctx.translate(it.x, it.y); ctx.scale(it.dir, 1); ctx.rotate(it.tilt); ctx.lineCap = 'round';
        const lanes = it.claws ? [-1, 0, 1] : [0];
        for (const ln of lanes) {
          const R = it.R * (1 + ln * 0.2), a0 = -1.25, a1 = 1.05, ah = a0 + (a1 - a0) * head, at = Math.max(a0, ah - 1.5), N = 9;
          const cx = -it.R * 0.55 + ln * it.R * 0.1;
          for (let i = 0; i < N; i++) {
            const f0 = i / N, f1 = (i + 1) / N, b0 = at + (ah - at) * f0, b1 = at + (ah - at) * f1, wmul = (it.claws ? 0.55 : 1) * (0.25 + 0.75 * f1);
            ctx.globalAlpha = c01(fadeA * f1 * 0.5); ctx.strokeStyle = it.col; ctx.lineWidth = it.wd * 2.6 * wmul;
            ctx.beginPath(); ctx.arc(cx, 0, R, b0, b1 + 0.02); ctx.stroke();
            ctx.globalAlpha = c01(fadeA * f1); ctx.strokeStyle = it.core; ctx.lineWidth = it.wd * wmul;
            ctx.beginPath(); ctx.arc(cx, 0, R, b0, b1 + 0.02); ctx.stroke();
          }
        }
        ctx.restore();
      } });
    /** Вспышка попадания: четырёхлучевая звезда + пятно. */
    sc.star = (x, y, o) => { const w = ws(); sc.glow(x, y, { col: o.col || '#fff0c0', hard: true, r: (o.r || 10) * w * 0.6, r1: (o.r || 10) * w * 1.2, ttl: o.ttl || 200, delay: o.delay });
      return push({ x, y, ttl: o.ttl || 180, delay: o.delay, add: true, r: (o.r || 10) * w, rot: rnd(0, 0.8), col: o.col || '#fff0c0',
        draw(ctx, k, it) { const r = it.r * (0.5 + eOut(k) * 0.9), t = r * 0.13; ctx.globalAlpha = c01(1 - k); ctx.fillStyle = it.col;
          ctx.save(); ctx.translate(it.x, it.y); ctx.rotate(it.rot);
          for (let j = 0; j < 2; j++) { ctx.beginPath(); ctx.moveTo(-r, 0); ctx.lineTo(0, -t); ctx.lineTo(r, 0); ctx.lineTo(0, t); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(0, -r * 0.7); ctx.lineTo(t, 0); ctx.lineTo(0, r * 0.7); ctx.lineTo(-t, 0); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#ffffff'; ctx.scale(0.55, 0.55); }
          ctx.restore(); } }); };
    /** Столб света с неба (или из земли). */
    sc.pillar = (x, gy, o) => push({ x, gy, ttl: o.ttl || 800, delay: o.delay, add: true, wd: (o.w || 22) * ws(), h: o.h || 300 * ws(), tx: pillarTex(o.col), a: o.a || 1,
      draw(ctx, k, it) { const a = fade(k, 'hold') * it.a, w = it.wd * (0.6 + 0.4 * Math.sin(Math.min(1, k * 3) * Math.PI / 2)) * (1 + 0.06 * Math.sin(it.t / 40)); ctx.globalAlpha = c01(a); ctx.drawImage(it.tx, it.x - w / 2, it.gy - it.h, w, it.h); } });
    /** Круг-печать на земле под отрядом: раскрывается, медленно вращается, тает. */
    sc.rune = (x, gy, o) => push({ x, gy, ttl: o.ttl || 900, delay: o.delay, under: true, add: true, r: o.r, tx: runeTex(o.glyph, o.col), spin: o.spin === undefined ? 0.9 : o.spin, sq: 0.4, a: o.a || 0.95, grow: o.grow || 0,
      draw(ctx, k, it) { const r = it.r * (k < 0.18 ? 0.55 + 0.45 * eOut(k / 0.18) : 1 + it.grow * (k - 0.18)); ctx.globalAlpha = c01(it.a * fade(k, 'hold'));
        ctx.translate(it.x, it.gy); ctx.scale(1, it.sq); ctx.rotate(it.t / 1000 * it.spin); ctx.drawImage(it.tx, -r, -r, r * 2, r * 2); ctx.setTransform(ctx._vfxBase); } });
    /** Символ над головой: светлый поднимается (польза), тёмный опускается (вред). */
    sc.glyph = (x, y, o) => push({ x, y, ttl: o.ttl || 900, delay: o.delay, add: !o.dark, sz: (o.size || 22) * ws(), tx: glyphTex(o.glyph, o.col), dy: (o.good === false ? 1 : -1) * 12 * ws(),
      draw(ctx, k, it) { const s = it.sz * (k < 0.15 ? 0.6 + 0.4 * eOut(k / 0.15) : 1), yy = it.y + it.dy * eOut(k) - (it.dy > 0 ? it.dy : 0);
        ctx.globalAlpha = c01(fade(k, 'hold')); ctx.drawImage(it.tx, it.x - s / 2, yy - s / 2, s, s); } });
    /** Вихрь: дуги ветра бегут вокруг отряда. */
    sc.wind = (x, gy, o) => push({ x, gy, ttl: o.ttl || 800, delay: o.delay, add: true, rx: o.rx, h: o.h, col: o.col || '#cff4ff', n: o.n || 3, ph: rnd(0, TAU), exp: o.expand || 0, wd: (o.w || 1.6) * ws(),
      draw(ctx, k, it) { const a = fade(k, 'hold'); ctx.lineCap = 'round';
        for (let i = 0; i < it.n; i++) { const f = (i + 0.5) / it.n, yy = it.gy - it.h * f, rx = it.rx * (0.8 + 0.3 * Math.sin(f * 3)) * (1 + it.exp * k), s0 = it.ph + it.t / 1000 * 7 * (i % 2 ? 1 : 1.25) + i * 2.1;
          ctx.strokeStyle = it.col; ctx.globalAlpha = c01(a * 0.35); ctx.lineWidth = it.wd * 3; ctx.beginPath(); ctx.ellipse(it.x, yy, rx, rx * 0.32, 0, s0, s0 + 1.9); ctx.stroke();
          ctx.globalAlpha = c01(a * 0.9); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = it.wd; ctx.beginPath(); ctx.ellipse(it.x, yy, rx, rx * 0.32, 0, s0 + 0.5, s0 + 1.9); ctx.stroke(); } } });
    /** Купол-щит вокруг отряда. */
    sc.dome = (x, cy, o) => push({ x, cy, ttl: o.ttl || 800, delay: o.delay, add: true, rx: o.rx, ry: o.ry, col: o.col,
      draw(ctx, k, it) { const s = k < 0.2 ? 0.7 + 0.3 * eOut(k / 0.2) : 1, a = fade(k, 'hold'), rx = it.rx * s, ry = it.ry * s;
        const g = ctx.createRadialGradient(it.x, it.cy, Math.min(rx, ry) * 0.4, it.x, it.cy, Math.max(rx, ry));
        g.addColorStop(0, rgba(it.col, 0.05)); g.addColorStop(0.7, rgba(it.col, 0.28)); g.addColorStop(0.95, rgba(it.col, 0.85)); g.addColorStop(1, rgba(it.col, 0));
        ctx.globalAlpha = c01(a); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(it.x, it.cy, rx, ry, 0, 0, TAU); ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 1.6 * ws(); ctx.lineCap = 'round'; ctx.beginPath(); ctx.ellipse(it.x, it.cy, rx * 0.86, ry * 0.86, 0, Math.PI * 1.1, Math.PI * 1.45); ctx.stroke();
        const sa = it.t / 180; ctx.globalAlpha = c01(a * 0.9); const gt = glowTex(it.col, true), sr = 5 * ws(); ctx.drawImage(gt, it.x + Math.cos(sa) * rx - sr, it.cy + Math.sin(sa) * ry - sr, sr * 2, sr * 2); } });
    /** Ледяные шипы: растут из земли, стоят, раскалываются на осколки. */
    sc.spikes = (x, gy, o) => {
      const w = ws(), cr = [];
      for (let i = 0; i < (o.n || 4); i++) cr.push({ dx: rnd(-1, 1) * 10 * w, ang: rnd(-0.45, 0.45), len: rnd(0.6, 1) * (o.h || 26) * w, wd: rnd(4, 7) * w });
      cr.sort((a, b) => a.dx - b.dx);
      return push({ x, gy, ttl: o.ttl || 520, delay: o.delay, add: false, cr,
        draw(ctx, k, it) { const g = eOut3(Math.min(1, it.t / 110)), a = k < 0.85 ? 1 : (1 - k) / 0.15;
          ctx.globalAlpha = c01(a);
          for (const c of it.cr) { const L = c.len * g, bx = it.x + c.dx, tx = bx + Math.sin(c.ang) * L, ty = it.gy - Math.cos(c.ang) * L;
            const grd = ctx.createLinearGradient(bx, it.gy, tx, ty); grd.addColorStop(0, 'rgba(120,180,235,0.85)'); grd.addColorStop(0.6, 'rgba(200,235,255,0.92)'); grd.addColorStop(1, 'rgba(255,255,255,0.98)');
            ctx.fillStyle = grd; ctx.beginPath(); ctx.moveTo(bx - c.wd, it.gy); ctx.lineTo(bx - c.wd * 0.35 + Math.sin(c.ang) * L * 0.7, it.gy - Math.cos(c.ang) * L * 0.7); ctx.lineTo(tx, ty); ctx.lineTo(bx + c.wd, it.gy); ctx.closePath(); ctx.fill();
            ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 0.9 * w; ctx.beginPath(); ctx.moveTo(bx, it.gy); ctx.lineTo(tx, ty); ctx.stroke(); } },
        end: o.shatter === false ? null : it => { if (!sc.alive) return; sc.debris(it.x, it.gy - 10 * w, { names: 'ice_elemental.shard', n: 4, s: 1.25, speed: 120, ground: it.gy + 2 * w, ttl: 700 }); sc.embers(it.x, it.gy - 8 * w, { n: 3, col: '#e8f8ff', vy: -20, ttl: 600, spread: 10 }); } });
    };
    /** Затемнение/окраска всего поля (армагеддон, волна смерти). */
    sc.tint = (col, a, ttl, o) => push({ ttl, add: false, col, a, delay: o && o.delay,
      draw(ctx, k, it) { ctx.globalAlpha = c01(it.a * (k < 0.15 ? k / 0.15 : k > 0.7 ? (1 - k) / 0.3 : 1)); ctx.fillStyle = it.col; ctx.fillRect(-50, -50, S.bounds.w + 100, S.bounds.h + 100); } });
    /** Снаряд → Promise по прибытии. */
    sc.projectile = (kind, x1, y1, x2, y2, o) => new Promise(res => {
      o = o || {};
      const w = ws();
      push({ kind, x1, y1, x2, y2, x: x1, y: y1, ang: Math.atan2(y2 - y1, x2 - x1), ttl: o.ttl || 300, delay: o.delay, arc: (o.arc === undefined ? 20 : o.arc) * w, spin: rnd(0, TAU), s: (o.s || 1) * w, hist: [], add: false, next: 0, col: o.col,
        step(s, it) { const k = Math.min(1, it.t / it.ttl), px = it.x, py = it.y; it.x = it.x1 + (it.x2 - it.x1) * k; it.y = it.y1 + (it.y2 - it.y1) * k - Math.sin(k * Math.PI) * it.arc;
          if (it.x !== px || it.y !== py) it.ang = Math.atan2(it.y - py, it.x - px); it.spin += s * (o.spinRate || 14);
          it.hist.unshift([it.x, it.y]); if (it.hist.length > (o.trailN || 9)) it.hist.pop();
          const tr = TRAIL[it.kind]; if (tr && it.t >= it.next) { it.next = it.t + tr.every; tr.f(sc, it, w); } },
        draw: drawProjectile, end: () => res() });
    });
    /** Шлейф: не длиннее maxLen, сужается к хвосту, хвост темнее и прозрачнее. */
    function ribbon(ctx, h, w0, cHead, cTail, a, maxLen) {
      ctx.lineCap = 'round';
      let n = 1, L = 0; for (; n < h.length; n++) { L += Math.hypot(h[n][0] - h[n - 1][0], h[n][1] - h[n - 1][1]); if (L > maxLen) break; }
      n = Math.min(n, h.length - 1);
      for (let i = n; i > 0; i--) { const f = 1 - (i - 1) / n; ctx.globalAlpha = c01(a * f * f); ctx.strokeStyle = f > 0.6 ? cHead : cTail; ctx.lineWidth = w0 * (0.2 + 0.8 * f); ctx.beginPath(); ctx.moveTo(h[i][0], h[i][1]); ctx.lineTo(h[i - 1][0], h[i - 1][1]); ctx.stroke(); }
    }
    function streak(ctx, it, col, wd, a) { const h = it.hist; if (h.length < 2) return; const e = h[Math.min(h.length - 1, 3)]; ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = wd; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(e[0], e[1]); ctx.lineTo(it.x, it.y); ctx.stroke(); ctx.globalCompositeOperation = 'source-over'; }
    const G = (ctx, col, x, y, r, a, hard) => { ctx.globalAlpha = c01(a); ctx.drawImage(glowTex(col, hard), x - r, y - r, r * 2, r * 2); };
    function drawProjectile(ctx, k, it) {
      const s = it.s, x = it.x, y = it.y;
      switch (it.kind) {
        case 'arrow': case 'bolt': case 'ballista': case 'spear': {
          streak(ctx, it, '#ffffff', 1.4 * s, 0.22);
          const nm = it.kind === 'arrow' ? 'archer.arrow' : it.kind === 'spear' ? 'lizardman.spear' : 'marksman.bolt';
          const sz = it.kind === 'ballista' ? 1.9 : it.kind === 'spear' ? 0.95 : 1;
          ctx.globalAlpha = 1; drawSprite(ctx, sprite(nm, s * sz), x, y, it.ang, s * sz); break;
        }
        case 'axe': case 'rock': case 'pebble': case 'bomb': case 'meteor': {
          if (it.kind === 'meteor') { ctx.globalCompositeOperation = 'lighter'; ribbon(ctx, it.hist, 9 * s, '#ffb03a', '#c8401a', 0.6, 46 * s); G(ctx, '#ff7a2a', x, y, 13 * s, 0.8); ctx.globalCompositeOperation = 'source-over'; }
          else streak(ctx, it, '#ffffff', 2 * s, 0.12);
          const nm = { axe: 'orc.axe', rock: 'cyclops.rock', pebble: 'stone_golem.rock', bomb: 'halfling_grenadier.bomb', meteor: 'magma_elemental.rock' }[it.kind];
          const sz = { axe: 1.1, rock: 2, pebble: 0.5, bomb: 1, meteor: 2.2 }[it.kind];
          ctx.globalAlpha = 1; drawSprite(ctx, sprite(nm, s * sz), x, y, it.spin, s * sz);
          if (it.kind === 'meteor') { ctx.globalCompositeOperation = 'lighter'; G(ctx, '#ff8a2a', x + Math.cos(it.ang) * 3 * s, y + Math.sin(it.ang) * 3 * s, 9 * s, 0.55, true); ctx.globalCompositeOperation = 'source-over'; }
          if (it.kind === 'bomb') { const fx2 = x + Math.cos(it.spin - 1.9) * 5 * s, fy2 = y + Math.sin(it.spin - 1.9) * 5 * s; ctx.globalCompositeOperation = 'lighter'; G(ctx, '#ffb04a', fx2, fy2, 5 * s, 0.9, true); ctx.globalCompositeOperation = 'source-over'; }
          break;
        }
        case 'fire': {
          ctx.globalCompositeOperation = 'lighter';
          const f = 1 + 0.12 * Math.sin(it.t / 28), big = it.col === 'big' ? 1.4 : 1;
          ribbon(ctx, it.hist, 9 * s * big, '#ff9a2a', '#b83010', 0.55, 34 * s * big);
          // языки пламени отстают от шара и треплются
          const bx = Math.cos(it.ang), by = Math.sin(it.ang);
          for (let i = 0; i < 3; i++) { const d = (4 + i * 4) * s * big, wob = Math.sin(it.t / 35 + i * 2) * 2.5 * s; G(ctx, i ? '#ff5a1f' : '#ff8a2a', x - bx * d - by * wob, y - by * d + bx * wob, (9 - i * 2) * s * big, 0.7); }
          G(ctx, '#ff6a1f', x, y, 14 * s * f * big, 0.8); G(ctx, '#ffd070', x, y, 7 * s * f * big, 1, true);
          ctx.globalCompositeOperation = 'source-over'; break;
        }
        case 'orb': case 'holy': case 'wave': case 'spark': case 'arcane': case 'skull': case 'acid': case 'ice': case 'dark': {
          const P = { orb: ['#6ab8ff', '#dff0ff'], holy: ['#ffd66a', '#fffbe0'], wave: ['#3ad0c8', '#e0fffb'], spark: ['#7fd9ff', '#ffffff'], arcane: ['#c060ff', '#f4e0ff'], skull: ['#5ae070', '#e0ffe0'], acid: ['#8ad02a', '#f0ffb0'], ice: ['#8ad0ff', '#ffffff'], dark: ['#8040c0', '#e0c0ff'] }[it.kind];
          ctx.globalCompositeOperation = 'lighter';
          ribbon(ctx, it.hist, (it.kind === 'arcane' ? 7 : 5) * s, P[1], P[0], it.kind === 'acid' ? 0.3 : 0.6, (it.kind === 'arcane' ? 40 : 28) * s);
          const f = 1 + 0.15 * Math.sin(it.t / 22);
          G(ctx, P[0], x, y, 11 * s * f, 0.85); G(ctx, P[1], x, y, 5 * s, 1, true);
          if (it.kind === 'holy' || it.kind === 'arcane') { ctx.strokeStyle = P[1]; ctx.lineWidth = 1.2 * s; ctx.globalAlpha = 0.8; for (let i = 0; i < 4; i++) { const a = it.t / 90 + i * TAU / 4; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * 4 * s, y + Math.sin(a) * 4 * s); ctx.lineTo(x + Math.cos(a) * 11 * s, y + Math.sin(a) * 11 * s); ctx.stroke(); } }
          if (it.kind === 'spark') for (let i = 0; i < 3; i++) { const a = it.t / 30 + i * 2.1; G(ctx, '#ffffff', x + Math.cos(a) * 6 * s, y + Math.sin(a) * 6 * s, 2.5 * s, 0.9, true); }
          ctx.globalCompositeOperation = 'source-over';
          if (it.kind === 'acid') { ctx.globalAlpha = 0.95; ctx.fillStyle = '#9ad83a'; ctx.beginPath(); ctx.ellipse(x, y, 5.5 * s, 3.8 * s, it.ang, 0, TAU); ctx.fill(); ctx.fillStyle = '#e8ffb0'; ctx.beginPath(); ctx.arc(x - 1.5 * s, y - 1.3 * s, 1.4 * s, 0, TAU); ctx.fill(); }
          if (it.kind === 'skull') { ctx.globalAlpha = 0.9; ctx.fillStyle = '#e8f0d8'; ctx.beginPath(); ctx.arc(x, y - 0.5 * s, 3.6 * s, 0, TAU); ctx.fill(); ctx.fillRect(x - 2 * s, y + 1.5 * s, 4 * s, 2.4 * s); ctx.fillStyle = '#123018'; ctx.beginPath(); ctx.arc(x - 1.4 * s, y - 0.6 * s, 1 * s, 0, TAU); ctx.arc(x + 1.4 * s, y - 0.6 * s, 1 * s, 0, TAU); ctx.fill(); }
          if (it.kind === 'ice') { ctx.globalAlpha = 1; drawSprite(ctx, sprite('ice_elemental.shard', s * 1.6), x, y, it.ang, s * 1.6); }
          break;
        }
        case 'ball': {
          streak(ctx, it, '#ffffff', 2 * s, 0.12);
          const r = 3.2 * s, g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r);
          g.addColorStop(0, '#c8ccd4'); g.addColorStop(0.45, '#5a5e68'); g.addColorStop(1, '#1e2026');
          ctx.globalAlpha = 1; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); break;
        }
        case 'bullet': {
          ctx.globalCompositeOperation = 'lighter';
          const h = it.hist, t = h[Math.min(h.length - 1, 4)] || [x, y];
          ctx.lineCap = 'round'; ctx.strokeStyle = '#ffd070'; ctx.globalAlpha = 0.5; ctx.lineWidth = 3 * s; ctx.beginPath(); ctx.moveTo(t[0], t[1]); ctx.lineTo(x, y); ctx.stroke();
          ctx.strokeStyle = '#ffffff'; ctx.globalAlpha = 1; ctx.lineWidth = 1.2 * s; ctx.stroke();
          ctx.globalCompositeOperation = 'source-over'; break;
        }
      }
      ctx.globalAlpha = 1;
    }
    // шлейфы снарядов: что оставляют в полёте
    const TRAIL = {
      fire: { every: 55, f: (sc2, it, w) => { sc2.smoke(it.x, it.y, { n: 1, col: '#3a2c24', size: 4 * w, ttl: 600, vy: -14 * w, a: 0.5, grow: 1.4 }); sc2.embers(it.x, it.y, { n: 1, col: ['#ffb04a', '#ff6a1f'], ttl: 450, spread: 3, vy: -20 }); } },
      meteor: { every: 65, f: (sc2, it, w) => { sc2.smoke(it.x, it.y, { n: 1, col: '#3a2c24', size: 5 * w, ttl: 700, vy: -10 * w, a: 0.55, grow: 1.6 }); sc2.embers(it.x, it.y, { n: 1, col: ['#ffb04a', '#ff6a1f'], ttl: 450, spread: 4 }); } },
      skull: { every: 50, f: (sc2, it, w) => sc2.smoke(it.x, it.y, { n: 1, col: '#2a6a34', size: 4 * w, ttl: 500, vy: -8 * w, a: 0.45 }) },
      acid: { every: 55, f: (sc2, it, w) => sc2.drops(it.x, it.y, { n: 1, col: '#8ac82a', speed: 20, ttl: 400, r: 1.1, ground: it.y + 30 * w }) },
      ice: { every: 35, f: (sc2, it, w) => sc2.embers(it.x, it.y, { n: 1, col: '#e8f8ff', ttl: 380, spread: 3, vy: 6, r: 1.5 }) },
      holy: { every: 40, f: (sc2, it, w) => sc2.embers(it.x, it.y, { n: 1, col: '#ffe08a', ttl: 380, spread: 3, vy: 8, r: 1.6 }) },
      arcane: { every: 35, f: (sc2, it, w) => sc2.embers(it.x, it.y, { n: 1, col: '#d890ff', ttl: 360, spread: 4, vy: 0, r: 1.6 }) },
      bomb: { every: 30, f: (sc2, it, w) => sc2.embers(it.x, it.y - 5 * w, { n: 1, col: '#ffd070', ttl: 250, spread: 2, vy: 10, r: 1.2 }) },
      spark: { every: 45, f: (sc2, it, w) => sc2.sparks(it.x, it.y, { n: 1, col: '#9fe0ff', speed: 40, ttl: 220, len: 3, w: 1, grav: 0 }) },
    };
    sc.alive = true;
    const baseClear = sc.clear; sc.clear = () => { sc.alive = false; baseClear(); sc.alive = true; };
    return sc;
  }

  /* ======================= каталог: кто чем стреляет, как гибнет ======================= */
  const SHOT = [
    ['bolt', /^marksman$/], ['ballista', /^ballista$/], ['spear', /^(ranger|master_ranger)$/], ['axe', /^orc/], ['rock', /^cyclops/],
    ['pebble', /^halfling$/], ['bomb', /^halfling_grenadier$/], ['bullet', /^(gunslinger|bounty_hunter|pirate|corsair)$/], ['fire', /^(gog|magog)$/],
    ['orb', /^(mage|arch_mage)$/], ['holy', /^(monk|zealot)$/], ['wave', /^(sea_witch|sorceress)$/], ['ball', /gremlin/], ['skull', /lich/],
    ['acid', /spitter/], ['ice', /^ice_elemental$/], ['zap', /^storm_elemental$/], ['lightning', /^titan$/], ['ray', /^(beholder|evil_eye)$/],
  ];
  function shotKind(cid) { for (const [k, re] of SHOT) if (re.test(cid)) return k; return 'arrow'; }
  const DEATH = [
    ['spirit', /^(wight|wraith|ghost_dragon)$/], ['ash', /^vampire/], ['bones', /^(skeleton|skeleton_warrior|walking_dead|zombie|lich|power_lich|bone_dragon|black_knight|dread_knight)$/],
    ['fire', /^(fire_elemental|energy_elemental|firebird|phoenix|efreet|efreet_sultan)$/], ['water', /^water_elemental$/], ['ice', /^ice_elemental$/],
    ['air', /^(air_elemental|storm_elemental)$/], ['magic', /^(psychic_elemental|magic_elemental|genie|master_genie|pixie|sprite)$/],
    ['rock', /^(earth_elemental|magma_elemental|stone_gargoyle|obsidian_gargoyle|stone_golem)$/], ['metal', /^(iron_golem|automaton|sentinel_automaton|ballista|catapult)$/],
    ['wood', /^(ammo_cart|first_aid_tent)$/], ['plant', /^dendroid/],
  ];
  function deathKind(cid) {
    for (const [k, re] of DEATH) if (re.test(cid)) return k;
    const C = H3.Creatures, c = C && C.get(cid);
    if (c && C.isUndead(c)) return 'bones';
    if (c && C.hasAb(c, 'nonliving')) return 'rock';
    if (c && c.faction === 'inferno') return 'demon';
    return 'living';
  }
  const MELEE = [
    ['fire', /^(fire_elemental|energy_elemental|firebird|phoenix|efreet|efreet_sultan|hell_hound|cerberus|magma_elemental|red_dragon)$/],
    ['frost', /^(ice_elemental)$/], ['shock', /^(air_elemental|storm_elemental|thunderbird|roc|psychic_elemental|magic_elemental)$/],
    ['ghost', /^(wight|wraith|ghost_dragon|bone_dragon|vampire|vampire_lord|black_knight|dread_knight)$/],
    ['blunt', /^(stone_golem|iron_golem|earth_elemental|stone_gargoyle|obsidian_gargoyle|giant|titan|ogre|ogre_mage|cyclops|cyclops_king|dendroid_guard|dendroid_soldier|troll|ram_beetle|fortress_beetle|automaton|sentinel_automaton|armadillo|bellwether_armadillo|gnoll|gnoll_marauder|dwarf|battle_dwarf|zombie|walking_dead)$/],
    ['claw', /(wolf|hound|griffin|behemoth|dragon|hydra|basilisk|gorgon|wyvern|manticore|scorpicore|harpy|cat|lynx|bear|boar|tusker|wolverine|stag|serpent|sandworm|olgoi|mantis|wasp|larva|worker|queen|beetle|unicorn|pegasus|nix|haspid|couatl|roc|troglodyte|lizard|rider|raider|centaur|stormbird|ayssid)/],
  ];
  function meleeKind(cid) { for (const [k, re] of MELEE) if (re.test(cid)) return k; return 'blade'; }
  const GREEN_BLOOD = /(larva|worker|builder|spitter|wasp|mantis|beetle|queen|lizard|basilisk|gorgon|wyvern|hydra|serpent_fly|dragon_fly|troglodyte|haspid|sandworm|olgoi)/;

  /* ======================= эффекты по поводу ======================= */
  const dustCol = terrain => ({ snow: '#e8eef4', sand: '#d8c090', lava: '#5a3a2a', swamp: '#6a7a5a', subter: '#6a6068', rough: '#9a8a70', dirt: '#8a7458' }[terrain] || '#8a7a60');

  /** Попадание по отряду: «кровь» по природе существа. R: {x, y (земля), w, h}. */
  function bleed(sc, cid, x, y, gy, n) {
    const w = sc.ws(), k = deathKind(cid);
    if (k === 'living' || k === 'demon') sc.drops(x, y, { n: n || 5, col: GREEN_BLOOD.test(cid) ? '#6aa02a' : '#a01e18', speed: 80, ground: gy, ttl: 700, r: 1.4 });
    else if (k === 'plant') sc.debris(x, y, { names: 'dendroid_guard.leaf', n: 2, s: 1, speed: 70, ground: gy, ttl: 700 });
    else if (k === 'bones') { sc.smoke(x, y, { n: 2, col: '#b8b0a0', size: 4 * w, ttl: 600, vy: -6 * w, a: 0.6 }); sc.debris(x, y, { names: 'skeleton.bone', n: 1, s: 0.79, speed: 70, ground: gy, ttl: 800 }); }
    else if (k === 'spirit' || k === 'magic') sc.embers(x, y, { n: 4, col: k === 'spirit' ? '#b8a0ff' : '#e0a0ff', ttl: 500, spread: 6, vy: -25 });
    else if (k === 'fire') sc.embers(x, y, { n: 5, col: ['#ffb04a', '#ff6a1f'], ttl: 500, spread: 6 });
    else if (k === 'water') sc.drops(x, y, { n: 5, col: '#4a8ad8', speed: 80, ground: gy, ttl: 600 });
    else if (k === 'ice') sc.debris(x, y, { names: 'ice_elemental.shard', n: 2, s: 0.79, speed: 80, ground: gy, ttl: 600 });
    else if (k === 'air') sc.sparks(x, y, { n: 4, col: '#cff4ff', speed: 80, ttl: 260, grav: 0 });
    else if (k === 'rock') { sc.debris(x, y, { names: ['stone_golem.rock', 'earth_elemental.rock'], n: 2, s: 0.64, speed: 80, ground: gy, ttl: 700 }); sc.smoke(x, y, { n: 1, col: '#9a8a78', size: 4 * w, ttl: 500, a: 0.6 }); }
    else if (k === 'metal' || k === 'wood') sc.sparks(x, y, { n: 6, col: ['#ffd070', '#ff9a3a'], speed: 140, ttl: 300, len: 4 });
  }

  /** Удар в ближнем бою: дуга удара, вспышка, «кровь», у крупных — пыль. */
  function melee(sc, acid, tcid, A, T, o) {
    o = o || {};
    const w = sc.ws(), dir = T.x >= A.x ? 1 : -1, kind = meleeKind(acid), big = !!o.big;
    const hx = T.x - dir * T.w * 0.18, hy = T.y - T.h * 0.52, R = Math.max(T.h * (big ? 0.55 : 0.45), 14 * w);
    const PAL = { blade: ['#8fc8ff', '#ffffff'], fire: ['#ff6a1f', '#ffe0a0'], frost: ['#7fc8ff', '#f0faff'], shock: ['#6ad8ff', '#f4feff'], ghost: ['#7ae0b0', '#e8fff4'], claw: ['#ff8a6a', '#fff4ec'], blunt: ['#ffd070', '#ffffff'] }[kind];
    if (kind !== 'blunt') sc.slash(hx - dir * 3 * w, hy, { R, dir, col: PAL[0], core: PAL[1], w: big ? 4.2 : 3.2, claws: kind === 'claw', ttl: 280 });
    sc.star(hx + dir * 2 * w, hy + 2 * w, { r: kind === 'blunt' ? 17 : 11, col: kind === 'blunt' ? '#fff4d0' : PAL[1], delay: 60, ttl: 200 });
    if (kind === 'blunt') { sc.ring(hx, hy, { col: '#fff0d0', r0: 3 * w, r1: 20 * w, sq: 1, ttl: 220, under: false, a: 0.6, delay: 50 }); sc.sparks(hx, hy, { n: 6, col: '#ffe8b0', speed: 150, ttl: 260, grav: 250, delay: 50 }); }
    if (kind === 'fire') sc.embers(hx, hy, { n: 6, col: ['#ffb04a', '#ff6a1f'], ttl: 600, spread: 8, delay: 60 });
    if (kind === 'shock') sc.sparks(hx, hy, { n: 6, col: '#aee8ff', speed: 160, ttl: 260, grav: 0, delay: 60 });
    if (kind === 'frost') sc.debris(hx, hy, { names: 'ice_elemental.shard', n: 3, s: 0.71, speed: 90, ground: T.y, ttl: 600, delay: 60 });
    if (kind === 'ghost') sc.smoke(hx, hy, { n: 2, col: '#4a7a6a', size: 5 * w, ttl: 600, a: 0.5, delay: 60 });
    bleed(sc, tcid, hx, hy, T.y, big ? 8 : 5);
    if (big || kind === 'blunt') { const d = dustCol(o.terrain); sc.smoke(T.x, T.y - 2 * w, { n: big ? 5 : 3, col: d, size: 7 * w, ttl: 900, vy: -8 * w, out: 30, spread: T.w * 0.4, under: true, a: 0.7, delay: 60, grow: 1.4 }); if (big) sc.ring(T.x, T.y, { col: d, r0: 6 * w, r1: T.w * 0.9, ttl: 380, a: 0.35, delay: 60 }); }
  }

  /** Гибель отряда. Возвращает, за сколько мс растворить сам рисунок. */
  function death(sc, cid, R, o) {
    o = o || {};
    const w = sc.ws(), k = deathKind(cid), cx = R.x, cy = R.y - R.h * 0.45, gy = R.y, big = !!o.big, m = big ? 1.5 : 1, dust = dustCol(o.terrain);
    const groundDust = (n, a) => sc.smoke(cx, gy - 2 * w, { n, col: dust, size: 7 * w * m, ttl: 1100, vy: -6 * w, out: 26, spread: R.w * 0.45, under: true, a: a || 0.7, grow: 1.5, jitter: 80 });
    switch (k) {
      case 'bones':
        sc.debris(cx, cy, { names: ['skeleton.bone', 'skeleton.bone', 'skeleton.skull', 'skeleton.bone'], n: Math.round(6 * m), s: 0.93 * m, speed: 120, ground: gy, ttl: 1300, spin: 8 });
        sc.smoke(cx, cy, { n: Math.round(5 * m), col: '#9a948a', size: 7 * w * m, ttl: 1200, vy: -16 * w, spread: R.w * 0.3, a: 0.7 });
        sc.embers(cx, cy, { n: 4, col: '#c8ffd0', ttl: 700, spread: 10, r: 1.4 });
        return 180;
      case 'spirit':
        sc.glow(cx, cy, { col: cid === 'ghost_dragon' ? '#7af0c0' : '#a890ff', r: 16 * w * m, r1: 6 * w, ttl: 800, vy: -70 * w, a: 0.9 });
        sc.smoke(cx, cy, { n: Math.round(6 * m), col: cid === 'ghost_dragon' ? '#4a8a78' : '#5a4a7a', size: 7 * w * m, ttl: 1100, vy: -40 * w, spread: R.w * 0.3, a: 0.6, swirl: 2.5, swirlR: 4 * w });
        sc.embers(cx, cy, { n: 8, col: ['#d8c8ff', '#9ff0d0'], ttl: 900, spread: 12, vy: -50 });
        return 650;
      case 'ash':
        sc.smoke(cx, cy, { n: 7, col: '#3a3438', size: 7 * w, ttl: 1300, vy: -24 * w, spread: R.w * 0.3, a: 0.8, jitter: 120 });
        sc.embers(cx, cy, { n: 10, col: ['#ff5a2a', '#c8201a'], ttl: 900, spread: 12, jitter: 150 });
        sc.decal(cx, gy, { kind: 'scorch', r: 14 * w, ttl: 2200, a: 0.6 });
        return 320;
      case 'fire':
        sc.glow(cx, cy, { col: '#ff7a2a', r: 18 * w * m, r1: 28 * w * m, ttl: 420 });
        for (let i = 0; i < 6; i++) { const a = rnd(0, TAU); sc.glow(cx, cy, { col: pick(['#ff9a3a', '#ff6a1f', '#ffc04a']), hard: true, r: 9 * w * m, r1: 2 * w, ttl: rnd(350, 550), vx: Math.cos(a) * 70 * w, vy: Math.sin(a) * 40 * w - 50 * w }); }
        sc.embers(cx, cy, { n: 12, col: ['#ffb04a', '#ff6a1f', '#ffe08a'], ttl: 1100, spread: 14, jitter: 150 });
        sc.smoke(cx, cy - 6 * w, { n: 4, col: '#2e2622', size: 7 * w * m, ttl: 1300, vy: -24 * w, a: 0.6, delay: 150 });
        sc.decal(cx, gy, { kind: 'scorch', r: 16 * w * m, ttl: 2200 });
        return 200;
      case 'water':
        sc.drops(cx, cy, { n: Math.round(14 * m), col: '#4a8ad8', speed: 130, ground: gy, ttl: 900, r: 2, spread: Math.PI * 1.6 });
        sc.ring(cx, gy, { col: '#a0d0ff', r0: 4 * w, r1: R.w * 0.9, ttl: 450 });
        sc.decal(cx, gy, { kind: 'puddle', r: R.w * 0.55, ttl: 2400 });
        sc.smoke(cx, cy, { n: 3, col: '#c8e0f4', size: 7 * w, ttl: 900, vy: -12 * w, a: 0.5 });
        return 170;
      case 'ice':
        sc.debris(cx, cy, { names: 'ice_elemental.shard', n: 9, s: 1.21, speed: 140, ground: gy, ttl: 1100, spin: 10 });
        sc.glow(cx, cy, { col: '#bfe8ff', hard: true, r: 10 * w, r1: 24 * w, ttl: 260 });
        sc.decal(cx, gy, { kind: 'frost', r: R.w * 0.7, ttl: 2400 });
        sc.smoke(cx, cy, { n: 4, col: '#e0f0ff', size: 7 * w, ttl: 1000, vy: -8 * w, a: 0.6 });
        sc.embers(cx, cy, { n: 6, col: '#ffffff', ttl: 700, spread: 14, r: 1.4 });
        return 170;
      case 'air':
        sc.wind(cx, gy, { rx: R.w * 0.45, h: R.h, n: 4, ttl: 700, expand: 1.4, w: 1.4 });
        sc.smoke(cx, cy, { n: 4, col: '#d8ecf4', size: 6 * w, ttl: 800, vy: -10 * w, out: 50, a: 0.45 });
        if (cid === 'storm_elemental') sc.sparks(cx, cy, { n: 10, col: '#aee8ff', speed: 160, ttl: 320, grav: 0 });
        return 260;
      case 'magic':
        sc.glow(cx, cy, { col: '#d080ff', r: 26 * w, r1: 3 * w, ttl: 420 });
        sc.ring(cx, cy, { col: '#e0a0ff', r0: 4 * w, r1: 30 * w, sq: 1, under: false, ttl: 360, delay: 300 });
        sc.sparks(cx, cy, { n: 12, col: ['#f0c0ff', '#a0e0ff'], speed: 150, ttl: 420, grav: 0, delay: 300 });
        return 380;
      case 'rock':
        sc.debris(cx, cy, { names: cid === 'magma_elemental' ? ['magma_elemental.rock', 'earth_elemental.rock'] : ['stone_golem.rock', 'earth_elemental.rock', 'cyclops.rock'], n: Math.round(7 * m), s: 1.07 * m, speed: 120, ground: gy, ttl: 1300, spin: 6 });
        sc.smoke(cx, cy, { n: 5, col: '#8a7e70', size: 8 * w * m, ttl: 1300, vy: -10 * w, out: 30, spread: R.w * 0.35, a: 0.75 });
        groundDust(3);
        if (cid === 'magma_elemental') sc.embers(cx, cy, { n: 10, col: ['#ffb04a', '#ff6a1f'], ttl: 1000, spread: 12 });
        sc.shake(2, 160);
        return 170;
      case 'metal':
        sc.debris(cx, cy, { names: [cid === 'automaton' || cid === 'sentinel_automaton' ? 'automaton.gear' : 'iron_golem.gear', 'iron_golem.plate', 'automaton.gear'], n: 7, s: 1.07 * m, speed: 150, ground: gy, ttl: 1300, spin: 12 });
        sc.sparks(cx, cy, { n: 16, col: ['#ffd070', '#ff9a3a', '#ffffff'], speed: 190, ttl: 520, len: 5 });
        sc.glow(cx, cy, { col: '#ffb04a', hard: true, r: 8 * w, r1: 22 * w, ttl: 240 });
        sc.smoke(cx, cy - 4 * w, { n: 5, col: '#2e2c2c', size: 7 * w * m, ttl: 1300, vy: -20 * w, a: 0.7, delay: 80 });
        return 190;
      case 'wood': case 'plant': {
        const leaves = k === 'plant';
        sc.debris(cx, cy, { names: leaves ? ['dendroid_guard.leaf', 'dendroid_guard.leaf', 'ballista.plank'] : ['ballista.plank', 'automaton.gear'], n: 8, s: leaves ? 0.35 : 0.3, speed: 130, ground: gy, ttl: 1400, spin: 7 });
        if (leaves) sc.debris(cx, cy - R.h * 0.3, { names: 'dendroid_guard.leaf', n: 5, s: 1.07, speed: 40, grav: 30, ttl: 1500, spin: 3 });
        groundDust(4);
        return 200;
      }
      default: {   // живые: оседают и выцветают (сам рисунок), по земле — пыль
        groundDust(big ? 6 : 4, 0.75);
        if (big) { sc.ring(cx, gy, { col: dust, r0: 8 * w, r1: R.w * 0.9, ttl: 450, a: 0.4, delay: 250 }); sc.shake(2.5, 180); }
        if (k === 'demon') { sc.smoke(cx, cy, { n: 4, col: '#6a5a2a', size: 7 * w, ttl: 1200, vy: -20 * w, a: 0.55, delay: 200 }); sc.embers(cx, cy, { n: 8, col: ['#ff6a1f', '#ffb04a'], ttl: 900, spread: 12, delay: 150, jitter: 200 }); }
        return 540;
      }
    }
  }

  /** Попадание снарядом: по виду снаряда. */
  function impact(sc, kind, x, y, gy, o) {
    const w = sc.ws();
    switch (kind) {
      case 'arrow': case 'bolt': case 'spear': sc.star(x, y, { r: 7, col: '#fff4e0', ttl: 150 }); break;
      case 'ballista': sc.star(x, y, { r: 13 }); sc.sparks(x, y, { n: 6, speed: 140, ttl: 300 }); break;
      case 'axe': sc.star(x, y, { r: 10 }); sc.sparks(x, y, { n: 4, col: '#ffe8c0', speed: 120, ttl: 260 }); break;
      case 'rock': sc.star(x, y, { r: 14, col: '#fff0d0' }); sc.debris(x, y, { names: ['stone_golem.rock', 'earth_elemental.rock'], n: 5, s: 0.71, speed: 110, ground: gy, ttl: 900 }); sc.smoke(x, gy - 3 * w, { n: 4, col: dustCol(o && o.terrain), size: 7 * w, ttl: 1000, out: 40, a: 0.7, under: true }); sc.shake(3, 160); break;
      case 'pebble': case 'ball': sc.star(x, y, { r: 7 }); sc.debris(x, y, { names: 'stone_golem.rock', n: 2, s: 0.29, speed: 70, ground: gy, ttl: 600 }); break;
      case 'bomb': explode(sc, x, y, gy, 11 * w, { lite: true, noDecal: false }); sc.shake(2, 140); break;
      case 'bullet': sc.star(x, y, { r: 7, col: '#fff0c0', ttl: 120 }); sc.sparks(x, y, { n: 5, col: '#ffd070', speed: 130, ttl: 240, len: 3 }); sc.smoke(x, y, { n: 1, col: '#c8c0b8', size: 3 * w, ttl: 500, a: 0.5 }); break;
      case 'fire': explode(sc, x, y, gy, (o && o.big ? 16 : 10) * w, { lite: !(o && o.big) }); break;
      case 'orb': case 'holy': case 'wave': case 'arcane': case 'spark': case 'dark': {
        const P = { orb: ['#6ab8ff', '#dff0ff'], holy: ['#ffd66a', '#fffbe0'], wave: ['#3ad0c8', '#e0fffb'], arcane: ['#c060ff', '#f4e0ff'], spark: ['#7fd9ff', '#ffffff'], dark: ['#8040c0', '#e0c0ff'] }[kind];
        sc.glow(x, y, { col: P[0], r: 8 * w, r1: 22 * w, ttl: 320 }); sc.star(x, y, { r: 12, col: P[1] });
        sc.ring(x, y, { col: P[0], r0: 3 * w, r1: 20 * w, sq: 1, under: false, ttl: 280, a: 0.7 });
        sc.sparks(x, y, { n: 8, col: [P[0], P[1]], speed: 120, ttl: 340, grav: 60, len: 4 });
        if (kind === 'holy') sc.embers(x, y, { n: 6, col: '#ffe08a', ttl: 700, spread: 8 });
        if (kind === 'wave') sc.drops(x, y, { n: 6, col: '#3aa0c8', speed: 90, ground: gy, ttl: 600 });
        break;
      }
      case 'skull': sc.glow(x, y, { col: '#5ae070', r: 10 * w, r1: 22 * w, ttl: 360 }); sc.smoke(x, y, { n: 5, col: '#2a5a30', size: 7 * w, ttl: 900, out: 30, a: 0.65 }); sc.embers(x, y, { n: 6, col: '#a0ffb0', ttl: 700, spread: 8 }); break;
      case 'acid': sc.drops(x, y, { n: 9, col: '#8ac82a', speed: 100, ground: gy, ttl: 800, r: 1.6 }); sc.decal(x, gy, { kind: 'acid', r: 12 * w, ttl: 2000 }); sc.smoke(x, y, { n: 3, col: '#b8e070', size: 5 * w, ttl: 800, vy: -20 * w, a: 0.45, delay: 80 }); break;
      case 'ice': sc.debris(x, y, { names: 'ice_elemental.shard', n: 5, s: 0.71, speed: 110, ground: gy, ttl: 800 }); sc.glow(x, y, { col: '#bfe8ff', hard: true, r: 6 * w, r1: 16 * w, ttl: 240 }); sc.smoke(x, y, { n: 2, col: '#e0f0ff', size: 5 * w, ttl: 700, a: 0.5 }); break;
    }
  }

  /** Взрыв: вспышка, огненный шар, ударная волна по земле, языки, дым, искры, копоть. */
  function explode(sc, x, y, gy, R, o) {
    o = o || {};
    const w = sc.ws(), lite = !!o.lite;
    sc.glow(x, y, { col: '#ffe8b0', hard: true, r: R * 0.25, r1: R * 0.6, ttl: 160 });
    sc.glow(x, y, { col: '#ff8a2a', r: R * 0.6, r1: R * 1.35, ttl: 500, a: 0.9 });
    sc.glow(x, gy, { col: '#ff6a1f', r: R * 1.1, r1: R * 1.6, sq: 0.45, ttl: 650, a: 0.55, under: true });
    sc.ring(x, gy, { col: '#ffb060', r0: R * 0.3, r1: R * 1.8, ttl: 450, a: 0.6 });
    if (!lite) sc.ring(x, y, { col: '#fff0d0', r0: R * 0.25, r1: R * 1.4, sq: 0.85, ttl: 260, under: false, a: 0.55 });
    for (let i = 0; i < (lite ? 4 : 9); i++) { const a = rnd(0, TAU), sp = rnd(0.6, 1) * R * 2.4; sc.glow(x, y, { col: pick(['#ff9a3a', '#ff6a1f', '#ffc04a']), hard: true, r: R * rnd(0.3, 0.45), r1: R * 0.08, ttl: rnd(380, 580), vx: Math.cos(a) * sp, vy: Math.sin(a) * sp * 0.6 - R * 1.4, drag: 2 }); }
    sc.smoke(x, y - R * 0.2, { n: lite ? 3 : 7, col: '#2e2622', size: R * 0.5, grow: 1.5, ttl: 1500, vy: -R * 1.1, spread: R * 0.5, delay: 110, a: 0.72, out: R * 0.8 });
    sc.sparks(x, y, { n: lite ? 6 : 14, col: ['#ffcf6a', '#ffa040'], speed: R * 7 / w, ttl: 520, grav: 380, len: 5 });
    sc.embers(x, y, { n: lite ? 3 : 7, col: ['#ffb04a', '#ff6a1f'], spread: R / w, ttl: 1400, jitter: 200 });
    if (!o.noDecal) sc.decal(x, gy, { kind: 'scorch', r: R * 1.2, ttl: 2600 });
  }

  /** Аура заклинания над отрядом: руна на земле + символ над головой + «почерк» школы. */
  function aura(sc, R, o) {
    const w = sc.ws(), gy = R.y, top = R.y - R.h - 4 * w, cx = R.x, cy = R.y - R.h * 0.5, good = o.good !== false, col = o.col, dl = o.delay || 0;
    sc.rune(cx, gy, { glyph: o.glyph, col, r: Math.max(R.w * 0.78, 22 * w), ttl: 1000, delay: dl });
    sc.glyph(cx, good ? top - 6 * w : top - 20 * w, { glyph: o.glyph, col, size: 30, good, ttl: 950, delay: dl + 60 });
    if (good) sc.pillar(cx, gy, { col, w: R.w * 0.9, h: R.h * 1.5, ttl: 600, a: 0.45, delay: dl });
    else { sc.smoke(cx, top, { n: 3, col: '#281c30', size: 6 * w, ttl: 900, vy: 10 * w, a: 0.55, delay: dl }); }
    switch (o.school) {
      case 'fire': sc.embers(cx, gy - 4 * w, { n: 8, col: good ? ['#ffb04a', '#ff6a1f'] : ['#c02030', '#6a1020'], ttl: 900, spread: R.w / w * 0.4, vy: -50, delay: dl, jitter: 200 }); break;
      case 'air': sc.wind(cx, gy, { rx: R.w * 0.55, h: R.h, n: 3, ttl: 850, col: col, delay: dl }); break;
      case 'water': sc.embers(cx, good ? gy : top, { n: 9, col: [col, '#ffffff'], ttl: 900, spread: R.w / w * 0.45, spreadY: 4, vy: good ? -40 : 30, r: 1.7, delay: dl, jitter: 200 }); break;
      case 'earth': sc.embers(cx, gy - 2 * w, { n: 7, col: ['#e0c080', '#b08850'], ttl: 900, spread: R.w / w * 0.45, vy: good ? -30 : 20, r: 1.8, delay: dl, jitter: 200 }); break;
      default: sc.embers(cx, cy, { n: 7, col: [col, '#ffffff'], ttl: 800, spread: 14, delay: dl });
    }
  }

  /** Лечение: светлые капли поднимаются, мягкое кольцо. */
  function heal(sc, R, o) {
    const w = sc.ws(), col = (o && o.col) || '#8ff0b0';
    sc.ring(R.x, R.y, { col, r0: 4 * w, r1: R.w * 0.8, ttl: 500 });
    sc.glow(R.x, R.y - R.h * 0.5, { col, r: R.w * 0.3, r1: R.w * 0.6, ttl: 600, mode: 'inout', a: 0.6 });
    sc.embers(R.x, R.y - 2 * w, { n: 12, col: [col, '#ffffff', '#d0ffa0'], ttl: 950, spread: R.w / w * 0.45, spreadY: 4, vy: -45, r: 1.9, jitter: 250 });
    sc.glyph(R.x, R.y - R.h - 4 * w, { glyph: 'cross', col, size: 18, ttl: 850, delay: 80 });
  }

  /** Воскрешение: столб света с неба, золотые искры, кольцо. green — «Поднять мёртвых» (зелёный туман). */
  function raise(sc, R, o) {
    const w = sc.ws(), green = o && o.green, col = green ? '#6ae08a' : '#ffe08a';
    if (green) {
      sc.smoke(R.x, R.y - 3 * w, { n: 7, col: '#2a5a34', size: 8 * w, ttl: 1400, vy: -8 * w, a: 0.65, swirl: 2.2, swirlR: R.w * 0.3, under: true });
      sc.converge(R.x, R.y - R.h * 0.45, { names: ['skeleton.bone', 'skeleton.skull'], n: 6, s: 0.79, R: 34, ttl: 600, jitter: 200 });
      sc.embers(R.x, R.y, { n: 10, col: ['#8affa0', '#d0ffd8'], ttl: 1100, spread: R.w / w * 0.45, vy: -45, jitter: 300 });
      sc.rune(R.x, R.y, { glyph: 'skull', col, r: Math.max(R.w * 0.62, 18 * w), ttl: 1200 });
    } else {
      sc.pillar(R.x, R.y, { col, w: R.w * 1.3, h: 420 * w, ttl: 1100 });
      sc.glow(R.x, R.y, { col, r: R.w * 0.6, r1: R.w, sq: 0.45, ttl: 1000, mode: 'inout', under: true });
      sc.embers(R.x, R.y - R.h * 0.2, { n: 14, col: ['#fff4c0', '#ffe08a', '#ffffff'], ttl: 1200, spread: R.w / w * 0.5, spreadY: R.h / w * 0.6, vy: -35, jitter: 300 });
      sc.ring(R.x, R.y, { col, r0: R.w, r1: 4 * w, ttl: 500 });
      sc.rune(R.x, R.y, { glyph: 'ankh', col, r: Math.max(R.w * 0.62, 18 * w), ttl: 1200 });
      sc.flash(col, 0.12, 300);
    }
  }

  /* ---------- заклинания ---------- */
  const AURA = {
    haste: ['wing', '#8ae8ff'], slow: ['hourglass', '#d0a868', 0], bless: ['sun', '#ffe08a'], curse: ['skull', '#c03858', 0], shield: ['shield', '#f0d080'],
    stone_skin: ['stone', '#c8c0b0'], bloodlust: ['drop', '#ff4030'], precision: ['target', '#bff0ff'], weakness: ['down', '#7c98d0', 0], disrupting_ray: ['ray', '#d0a0ff', 0],
    fortune: ['clover', '#a8f070'], air_shield: ['swirl', '#bff0ff'], prayer: ['sun', '#ffe8a0'], blind: ['eyeX', '#fff0c0', 0], berserk: ['rage', '#ff3020', 0], dispel: ['break', '#bfe8ff'],
  };
  const SCHOOL = { air: '#8ae8ff', earth: '#d0a868', fire: '#ff7a2f', water: '#6aa8ff', all: '#c060ff' };

  /**
   * Заклинание. g: { size, src:[x,y] рука героя, hex:[x,y] центр гекса-цели, rects:[{x,y,w,h,cid}],
   *   hexes:[[x,y]…] центры задетых гексов, field:{x0,y0,w,h}, terrain }. → Promise (можно показывать урон).
   */
  async function spell(sc, sp, g) {
    const w = sc.ws(), id = sp.id, rects = g.rects || [], r0 = rects[0], wait = ms => sc.after(ms);
    const body = r => [r.x, r.y - r.h * 0.5];
    const hexG = g.hex ? [g.hex[0], g.hex[1] + g.size * 0.45] : r0 ? [r0.x, r0.y] : [g.field.x0 + g.field.w / 2, g.field.y0 + g.field.h / 2];
    switch (id) {
      case 'magic_arrow': {
        if (!r0) return; const [x, y] = body(r0);
        await sc.projectile('arcane', g.src[0], g.src[1], x, y, { ttl: 300, arc: 14, trailN: 12 });
        impact(sc, 'arcane', x, y, r0.y); await wait(120); return;
      }
      case 'ice_bolt': {
        if (!r0) return; const [x, y] = body(r0);
        await sc.projectile('ice', g.src[0], g.src[1], x, y, { ttl: 320, arc: 12, s: 1.3, trailN: 10 });
        sc.debris(x, y, { names: 'ice_elemental.shard', n: 8, s: 1.07, speed: 140, ground: r0.y, ttl: 1000 });
        sc.glow(x, y, { col: '#bfe8ff', hard: true, r: 8 * w, r1: 26 * w, ttl: 300 });
        sc.ring(x, y, { col: '#a0d8ff', r0: 4 * w, r1: 26 * w, sq: 1, under: false, ttl: 300, a: 0.7 });
        sc.decal(r0.x, r0.y, { kind: 'frost', r: r0.w * 0.8, ttl: 2600 });
        sc.smoke(x, y, { n: 4, col: '#e0f0ff', size: 7 * w, ttl: 1100, vy: -6 * w, out: 30, a: 0.6 });
        sc.spikes(r0.x, r0.y + 2 * w, { n: 3, h: 16, ttl: 420 });
        await wait(160); return;
      }
      case 'lightning_bolt': case 'titans_bolt': {
        if (!r0) return; const [x, y] = body(r0), titan = id === 'titans_bolt';
        sc.flash('#dff0ff', titan ? 0.5 : 0.3, 200);
        for (let i = 0; i < (titan ? 3 : 1); i++) sc.bolt(x + rnd(-70, 70) * w, Math.max(-20, r0.y - 460 * w), x + (i ? rnd(-6, 6) * w : 0), y, { w: titan ? 3.2 : 2.2, branches: titan ? 5 : 3, ttl: titan ? 560 : 440 });
        sc.glow(x, y, { col: '#9fd8ff', hard: true, r: 14 * w, r1: 30 * w, ttl: 380 });
        sc.glow(x, r0.y, { col: '#7fc8ff', r: r0.w * 0.8, r1: r0.w * 1.2, sq: 0.45, ttl: 700, under: true, a: 0.7 });
        sc.ring(r0.x, r0.y, { col: '#cfe8ff', r0: 6 * w, r1: (titan ? 60 : 36) * w, ttl: 420 });
        sc.sparks(x, y, { n: titan ? 22 : 14, col: ['#dff4ff', '#7fd9ea'], speed: 190, ttl: 420, grav: 200, len: 5 });
        sc.decal(r0.x, r0.y, { kind: 'scorch', r: r0.w * 0.7, ttl: 2400 });
        sc.smoke(x, y, { n: 3, col: '#5a6070', size: 6 * w, ttl: 1000, vy: -18 * w, delay: 150, a: 0.55 });
        if (titan) sc.shake(7, 300); else sc.shake(3, 160);
        await wait(titan ? 320 : 240); return;
      }
      case 'chain_lightning': {
        let prev = null;
        sc.flash('#dff0ff', 0.28, 200);
        for (const r of rects) {
          const [x, y] = body(r);
          if (prev) sc.bolt(prev[0], prev[1], x, y, { w: 1.8, branches: 2, ttl: 420, amp: 0.2 });
          else sc.bolt(x + rnd(-60, 60) * w, Math.max(-20, r.y - 460 * w), x, y, { w: 2.4, branches: 3, ttl: 460 });
          sc.glow(x, y, { col: '#9fd8ff', hard: true, r: 12 * w, r1: 24 * w, ttl: 360 });
          sc.sparks(x, y, { n: 10, col: ['#dff4ff', '#7fd9ea'], speed: 170, ttl: 380, grav: 200, len: 4 });
          sc.ring(r.x, r.y, { col: '#cfe8ff', r0: 4 * w, r1: 30 * w, ttl: 360 });
          sc.decal(r.x, r.y, { kind: 'scorch', r: r.w * 0.55, ttl: 2000, a: 0.8 });
          prev = [x, y];
          await wait(130);
        }
        await wait(200); return;
      }
      case 'fireball': case 'inferno': {
        const big = id === 'inferno', [hx, hy] = [hexG[0], hexG[1] - g.size * 0.6];
        await sc.projectile('fire', g.src[0], g.src[1], hx, hy, { ttl: 380, arc: 30, s: big ? 1.5 : 1.2, col: big ? 'big' : null, trailN: 11 });
        sc.flash('#ff9a3a', big ? 0.3 : 0.2, 220);
        explode(sc, hx, hy, hexG[1], (big ? 3.4 : 2.1) * g.size);
        if (big) (g.hexes || []).forEach((h, i) => { if (i % 2) return; const gx = h[0] + rnd(-4, 4) * w, gyy = h[1] + g.size * 0.45; sc.projectile('fire', hx, hy, gx, gyy - g.size * 0.5, { ttl: 160, arc: 18, s: 0.7 }).then(() => explode(sc, gx, gyy - g.size * 0.5, gyy, g.size * 1.1, { lite: true })); });
        for (const r of rects) sc.embers(r.x, r.y - r.h * 0.4, { n: 3, col: ['#ffb04a', '#ff6a1f'], ttl: 800, spread: 8 });
        sc.shake(big ? 7 : 5, 260);
        await wait(big ? 380 : 260); return;
      }
      case 'meteor_shower': {
        const hs = (g.hexes && g.hexes.length ? g.hexes : [g.hex]).map(h => [h[0], h[1] + g.size * 0.45]);
        const side = g.src[0] < hexG[0] ? -1 : 1;
        const jobs = hs.map((h, i) => (async () => {
          await wait(i * 85 + rnd(0, 30));
          const x = h[0] + rnd(-5, 5) * w, gy = h[1] + rnd(-3, 3) * w;
          await sc.projectile('meteor', x + side * 170 * w, gy - 380 * w, x, gy - 4 * w, { ttl: 340, arc: 0, s: 1.2, spinRate: 6, trailN: 10 });
          sc.glow(x, gy - 6 * w, { col: '#ffb04a', hard: true, r: 10 * w, r1: 26 * w, ttl: 260 });
          sc.ring(x, gy, { col: '#d8a060', r0: 5 * w, r1: g.size * 1.6, ttl: 420 });
          sc.decal(x, gy, { kind: 'crater', r: g.size * 0.95, ttl: 2800 });
          sc.debris(x, gy - 4 * w, { names: ['earth_elemental.rock', 'magma_elemental.rock', 'stone_golem.rock'], n: 4, s: 0.71, speed: 150, ground: gy + 4 * w, ttl: 900 });
          sc.smoke(x, gy - 4 * w, { n: 3, col: dustCol(g.terrain), size: 9 * w, ttl: 1300, vy: -14 * w, out: 40, a: 0.8, grow: 1.6 });
          sc.embers(x, gy, { n: 3, col: ['#ffb04a', '#ff6a1f'], ttl: 900, spread: 8 });
          sc.shake(4, 170);
        })());
        await Promise.all(jobs); await wait(140); return;
      }
      case 'frost_ring': {
        const c = hexG, hs = (g.hexes && g.hexes.length ? g.hexes : []).map(h => [h[0], h[1] + g.size * 0.45]);
        sc.glow(c[0], c[1] - g.size * 0.4, { col: '#9ad0ff', hard: true, r: 10 * w, r1: 22 * w, ttl: 300 });
        sc.ring(c[0], c[1], { col: '#bfe8ff', r0: g.size * 0.6, r1: g.size * 2.6, ttl: 520 });
        sc.decal(c[0], c[1], { kind: 'frost', r: g.size * 2.4, ttl: 3000 });
        hs.forEach((h, i) => sc.spikes(h[0], h[1], { n: 4, h: 30, ttl: 560, delay: 40 + i * 30 }));
        sc.smoke(c[0], c[1], { n: 8, col: '#e4f2ff', size: 9 * w, ttl: 1400, vy: -4 * w, out: 60, spread: g.size * 1.4, a: 0.55, under: true });
        for (const r of rects) sc.embers(r.x, r.y - r.h * 0.5, { n: 4, col: '#ffffff', ttl: 700, spread: 10, r: 1.4 });
        await wait(420); return;
      }
      case 'implosion': {
        if (!r0) return; const [x, y] = body(r0);
        sc.decal(r0.x, r0.y, { kind: 'cracks', r: r0.w * 1.3, ttl: 2800 });
        sc.ring(r0.x, r0.y, { col: '#d0a060', r0: 70 * w, r1: 6 * w, ttl: 380 });
        sc.ring(x, y, { col: '#e0b870', r0: 50 * w, r1: 4 * w, ttl: 380, sq: 0.9, under: false });
        sc.converge(x, y, { names: ['earth_elemental.rock', 'stone_golem.rock', 'magma_elemental.rock'], n: 9, s: 0.93, R: 60, ttl: 380, jitter: 40, sq: 0.8 });
        sc.glow(x, y, { col: '#402010', r: 30 * w, r1: 10 * w, ttl: 380, a: 0.6 });
        await wait(390);
        sc.glow(x, y, { col: '#ffe0a0', hard: true, r: 10 * w, r1: 36 * w, ttl: 260 });
        sc.debris(x, y, { names: ['earth_elemental.rock', 'stone_golem.rock', 'cyclops.rock'], n: 10, s: 0.86, speed: 200, ground: r0.y, ttl: 1100, spread: TAU });
        sc.smoke(x, y, { n: 6, col: '#8a7a64', size: 9 * w, ttl: 1300, out: 70, vy: -10 * w, a: 0.75 });
        sc.ring(r0.x, r0.y, { col: '#e0b870', r0: 6 * w, r1: 70 * w, ttl: 420 });
        sc.flash('#ffe0a0', 0.2, 180);
        sc.shake(8, 300); await wait(200); return;
      }
      case 'armageddon': {
        const F = g.field;
        sc.tint('#3a0800', 0.38, 2300);
        sc.flash('#ff3a1f', 0.35, 400);
        const N = 16, jobs = [];
        for (let i = 0; i < N; i++) jobs.push((async () => {
          await wait(120 + i * 95 + rnd(0, 40));
          const x = F.x0 + rnd(0.04, 0.96) * F.w, gy = F.y0 + rnd(0.15, 0.95) * F.h;
          await sc.projectile('meteor', x - 150 * w, gy - 420 * w, x, gy - 4 * w, { ttl: 320, arc: 0, s: 1.1, spinRate: 6, trailN: 8 });
          explode(sc, x, gy - 8 * w, gy, g.size * 1.25, { lite: true });
          sc.shake(3, 150);
        })());
        for (const r of rects) sc.embers(r.x, r.y - r.h * 0.4, { n: 2, col: ['#ffb04a', '#ff6a1f'], ttl: 900, spread: 8, delay: rnd(300, 1500) });
        await Promise.all(jobs); sc.shake(8, 300); await wait(200); return;
      }
      case 'death_ripple': case 'destroy_undead': {
        const dark = id === 'death_ripple', F = g.field, cx = F.x0 + F.w / 2, cy = F.y0 + F.h / 2, col = dark ? '#8a40d0' : '#ffe8a0';
        if (dark) sc.tint('#1a0828', 0.3, 1100);
        sc.ring(cx, cy, { col, r0: 20 * w, r1: F.w * 0.75, ttl: 800, sq: 0.55 });
        sc.ring(cx, cy, { col, r0: 10 * w, r1: F.w * 0.6, ttl: 800, sq: 0.55, delay: 160, a: 0.6 });
        sc.flash(dark ? '#2a1040' : '#fff6d0', 0.25, 300);
        for (const r of rects) {
          const d = Math.hypot(r.x - cx, (r.y - cy) / 0.55) / (F.w * 0.75) * 800;
          if (dark) { sc.smoke(r.x, r.y - r.h * 0.4, { n: 3, col: '#3a1a50', size: 6 * w, ttl: 900, vy: -26 * w, a: 0.7, delay: d }); sc.embers(r.x, r.y - r.h * 0.5, { n: 4, col: '#c080ff', ttl: 700, spread: 10, delay: d }); }
          else { sc.pillar(r.x, r.y, { col, w: r.w * 0.9, h: 300 * w, ttl: 700, delay: d }); sc.embers(r.x, r.y - r.h * 0.3, { n: 6, col: ['#fff4c0', '#ffffff'], ttl: 800, spread: 10, delay: d }); }
        }
        await wait(620); return;
      }
      case 'resurrection': case 'animate_dead': { for (const r of rects) raise(sc, r, { green: id === 'animate_dead' }); await wait(520); return; }
      case 'cure': { rects.forEach((r, i) => heal(sc, r, { col: '#8ff0c8' })); await wait(420); return; }
    }
    // чары над отрядами: руна + символ + почерк школы, плюс особые штрихи
    const A = AURA[id];
    if (A || sp.kind === 'buff' || sp.kind === 'debuff' || sp.kind === 'special') {
      const glyph = A ? A[0] : (sp.kind === 'debuff' ? 'down' : 'star'), col = A ? A[1] : SCHOOL[sp.school] || '#c060ff', good = A ? A[2] !== 0 : sp.kind !== 'debuff';
      rects.forEach((r, i) => {
        const dl = Math.min(i, 8) * 45, [x, y] = body(r);
        aura(sc, r, { glyph, col, good, school: sp.school, delay: dl });
        if (id === 'haste') sc.sparks(r.x - r.w * 0.6, y, { n: 5, col: '#cff4ff', speed: 160, angle: Math.PI, spread: 0.25, grav: 0, ttl: 380, len: 6, delay: dl });
        if (id === 'shield') sc.dome(r.x, y + r.h * 0.05, { rx: r.w * 0.62, ry: r.h * 0.62, col: '#f0d080', ttl: 900, delay: dl });
        if (id === 'air_shield') { sc.dome(r.x, y + r.h * 0.05, { rx: r.w * 0.62, ry: r.h * 0.62, col: '#9fe8ff', ttl: 900, delay: dl }); sc.wind(r.x, r.y, { rx: r.w * 0.62, h: r.h, n: 4, ttl: 900, delay: dl }); }
        if (id === 'stone_skin') { sc.converge(x, y, { names: ['stone_golem.rock', 'earth_elemental.rock'], n: 7, s: 0.5, R: 30, ttl: 420, delay: dl }); sc.glow(x, y, { col: '#c8c0b0', r: r.w * 0.4, r1: r.w * 0.6, ttl: 500, delay: dl + 380, mode: 'inout', a: 0.6 }); }
        if (id === 'bless' || id === 'prayer') { sc.pillar(r.x, r.y, { col: '#ffe8a0', w: r.w * (id === 'prayer' ? 1.2 : 0.8), h: 360 * w, ttl: 800, delay: dl }); if (id === 'prayer') sc.ring(r.x, r.y, { col: '#ffe8a0', r0: 6 * w, r1: r.w * 1.1, ttl: 600, delay: dl }); }
        if (id === 'bloodlust' || id === 'berserk') { sc.glow(x, y, { col: '#ff3020', r: r.w * 0.45, r1: r.w * 0.7, ttl: 700, mode: 'inout', a: 0.55, delay: dl }); if (id === 'berserk') sc.smoke(x, r.y - r.h, { n: 3, col: '#e8d8d0', size: 5 * w, ttl: 800, vy: -20 * w, a: 0.45, delay: dl + 100 }); }
        if (id === 'blind') { sc.star(x, r.y - r.h * 0.8, { r: 22, col: '#fffbe8', ttl: 320, delay: dl }); sc.glow(x, r.y - r.h * 0.8, { col: '#fff4d0', hard: true, r: 10 * w, r1: 30 * w, ttl: 420, delay: dl }); }
        if (id === 'disrupting_ray') { sc.beam(x + 60 * w, r.y - 320 * w, x, y, { col: '#c080ff', w: 3, ttl: 500, delay: dl }); sc.sparks(x, y, { n: 8, col: ['#e0c0ff', '#c0c8d0'], speed: 120, ttl: 400, delay: dl + 150 }); }
        if (id === 'precision') sc.ring(x, y, { col: '#bff0ff', r0: 36 * w, r1: 6 * w, sq: 1, under: false, ttl: 420, delay: dl });
        if (id === 'fortune') sc.embers(x, y, { n: 8, col: ['#ffe08a', '#a8f070'], ttl: 900, spread: 14, vy: -30, delay: dl, jitter: 200 });
        if (id === 'dispel') { sc.ring(r.x, r.y, { col: '#bfe8ff', r0: r.w * 0.5, r1: r.w * 1.4, ttl: 500, delay: dl + 250 }); sc.sparks(x, r.y - 4 * w, { n: 10, col: ['#ffffff', '#bfe8ff'], speed: 120, ttl: 420, grav: 60, delay: dl + 250 }); }
        if (id === 'curse' || id === 'weakness' || id === 'slow') sc.glow(x, y, { col: id === 'curse' ? '#601020' : id === 'slow' ? '#403018' : '#203050', r: r.w * 0.5, ttl: 700, mode: 'inout', a: 0.5, delay: dl });
      });
      await wait(420); return;
    }
    if (sp.kind === 'heal') { rects.forEach(r => heal(sc, r)); await wait(400); return; }
    if (sp.kind === 'resurrect') { rects.forEach(r => raise(sc, r)); await wait(500); return; }
    // прочие уроны — «почерк» школы
    for (const r of rects) { const [x, y] = body(r); impact(sc, { fire: 'fire', air: 'spark', water: 'ice', earth: 'rock', all: 'arcane' }[sp.school] || 'arcane', x, y, r.y, g); }
    await wait(350);
  }

  /** Выстрел стрелка: → Promise по попаданию. A, T: прямоугольники стрелка и цели. */
  async function shot(sc, cid, A, T, o) {
    o = o || {};
    const w = sc.ws(), kind = shotKind(cid), dir = T.x >= A.x ? 1 : -1;
    const x1 = A.x + dir * A.w * 0.3, y1 = A.y - A.h * 0.6, x2 = T.x - dir * T.w * 0.12, y2 = T.y - T.h * 0.5;
    const dist = Math.hypot(x2 - x1, y2 - y1) / w;
    if (kind === 'lightning' || kind === 'zap') {
      sc.bolt(x1, y1 - 8 * w, x2, y2, { w: kind === 'zap' ? 1 : 1.9, branches: kind === 'zap' ? 1 : 3, ttl: 380, amp: 0.1 });
      sc.glow(x1, y1 - 8 * w, { col: '#9fd8ff', hard: true, r: 6 * w, r1: 12 * w, ttl: 260 });
      await sc.after(90);
      sc.glow(x2, y2, { col: '#9fd8ff', hard: true, r: 10 * w, r1: 22 * w, ttl: 320 }); sc.sparks(x2, y2, { n: 10, col: ['#dff4ff', '#7fd9ea'], speed: 160, ttl: 340, grav: 150, len: 4 });
      if (kind === 'lightning') sc.flash('#dff0ff', 0.15, 150);
      return;
    }
    if (kind === 'ray') {
      const col = cid === 'evil_eye' ? '#e070ff' : '#c060ff';
      sc.glow(x1, y1, { col, hard: true, r: 6 * w, r1: 10 * w, ttl: 380 });
      sc.beam(x1, y1, x2, y2, { col, w: 2.2, ttl: 380 });
      await sc.after(110);
      impact(sc, 'dark', x2, y2, T.y); return;
    }
    const ms = Math.max(200, Math.min(520, dist * ({ rock: 1.1, axe: 0.9, bomb: 1, acid: 1, fire: 0.9, pebble: 0.85, bullet: 0.35 }[kind] || 0.65)));
    const arc = { ball: 0.14, arrow: 0.12, bolt: 0.05, ballista: 0.04, spear: 0.14, axe: 0.12, rock: 0.25, pebble: 0.14, bomb: 0.24, bullet: 0, acid: 0.16, fire: 0.08 }[kind];
    if (kind === 'bullet') { sc.glow(x1 + dir * 5 * w, y1, { col: '#ffc060', hard: true, r: 5 * w, r1: 10 * w, ttl: 140 }); sc.smoke(x1 + dir * 7 * w, y1, { n: 3, col: '#d0ccc4', size: 4 * w, ttl: 900, vy: -8 * w, vx: dir * 20 * w, a: 0.6 }); }
    if (kind === 'fire' || kind === 'orb' || kind === 'holy' || kind === 'wave' || kind === 'skull' || kind === 'spark') sc.glow(x1, y1, { col: { fire: '#ff7a2a', orb: '#6ab8ff', holy: '#ffd66a', wave: '#3ad0c8', skull: '#5ae070', spark: '#7fd9ff' }[kind], r: 5 * w, r1: 12 * w, ttl: 260 });
    await sc.projectile(kind, x1, y1, x2, y2, { ttl: ms, arc: arc === undefined ? 0.06 * dist : arc * dist, s: kind === 'fire' && /magog/.test(cid) ? 1.1 : kind === 'fire' ? 0.85 : 1, spinRate: kind === 'axe' ? 16 : kind === 'bomb' ? 8 : 5, trailN: kind === 'bullet' ? 6 : 9 });
    impact(sc, kind, x2, y2, T.y, { big: /magog/.test(cid), terrain: o.terrain });
  }

  /** Способности существ (взгляд смерти, огненный щит, молния, поднятие демонов). */
  function ability(sc, ab, R, o) {
    const w = sc.ws(), x = R.x, y = R.y - R.h * 0.5;
    if (ab === 'lightning') { sc.bolt(x + rnd(-40, 40) * w, Math.max(-20, R.y - 360 * w), x, y, { w: 1.8, branches: 2, ttl: 380 }); sc.sparks(x, y, { n: 10, col: ['#dff4ff', '#7fd9ea'], speed: 160, ttl: 340, grav: 150 }); sc.glow(x, y, { col: '#9fd8ff', hard: true, r: 8 * w, r1: 20 * w, ttl: 300 }); }
    else if (ab === 'fireShield') { sc.glow(x, y, { col: '#ff7a2a', r: R.w * 0.4, r1: R.w * 0.8, ttl: 500, mode: 'inout', a: 0.8 }); sc.embers(x, y, { n: 10, col: ['#ffb04a', '#ff6a1f'], ttl: 700, spread: 14 }); sc.smoke(x, y, { n: 2, col: '#2e2622', size: 6 * w, ttl: 900, a: 0.5 }); }
    else if (ab === 'deathStare') { sc.glyph(x, R.y - R.h - 6 * w, { glyph: 'eye', col: '#b060ff', size: 22, good: false, ttl: 800 }); sc.ring(x, y, { col: '#a04fd0', r0: 40 * w, r1: 4 * w, sq: 1, under: false, ttl: 380 }); sc.smoke(x, y, { n: 4, col: '#3a1a50', size: 6 * w, ttl: 900, vy: -20 * w, a: 0.7 }); }
    else if (ab === 'raiseDemons') { sc.pillar(x, R.y, { col: '#ff5a1f', w: R.w, h: 160 * w, ttl: 700 }); sc.smoke(x, R.y, { n: 6, col: '#3a2418', size: 8 * w, ttl: 1200, vy: -20 * w, a: 0.7 }); sc.embers(x, R.y, { n: 12, col: ['#ff6a1f', '#ffb04a'], ttl: 900, spread: 16 }); sc.ring(x, R.y, { col: '#ff5a1f', r0: 4 * w, r1: R.w * 1.2, ttl: 450 }); sc.decal(x, R.y, { kind: 'scorch', r: R.w * 0.7 }); }
    else if (ab === 'resurrect') raise(sc, R);
    else if (ab === 'cast') aura(sc, R, { glyph: 'star', col: (o && o.col) || '#9ad0ff', good: true, school: 'air' });
  }

  /** Прогрев: текстуры и рисунки-детали заранее, чтобы первый выстрел не дёрнул кадр. */
  function warm(size) {
    const sc = size / 26;
    try {
      for (const n of ['archer.arrow', 'marksman.bolt', 'lizardman.spear', 'orc.axe', 'skeleton.bone', 'skeleton.skull', 'stone_golem.rock', 'earth_elemental.rock', 'magma_elemental.rock', 'ice_elemental.shard', 'automaton.gear', 'iron_golem.gear', 'iron_golem.plate']) sprite(n, sc);
      sprite('cyclops.rock', sc * 2); sprite('magma_elemental.rock', sc * 2.2);
      for (const c of ['#ff8a2a', '#ff6a1f', '#ffb04a', '#fff4d0', '#9fd8ff']) { glowTex(c); glowTex(c, true); }
      for (let v = 0; v < 3; v++) smokeTex('#2e2622', v);
      ringTex('#ffc070'); decalTex('scorch');
    } catch (e) { /* без DOM (тесты) — нечего греть */ }
  }

  H3.VFx = { scene, spell, shot, melee, death, heal, raise, aura, ability, impact, explode, warm, shotKind, deathKind, meleeKind };
})(typeof window !== 'undefined' ? window : globalThis);
