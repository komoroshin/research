/* ============================================================================
   view/mappaint.js — рисованная земля карты приключений.

   Карта делится на куски 8×8 клеток; каждый кусок рисуется лениво, с двойной
   плотностью, и живёт в кэше (одним холстом всю карту ×2 телефон не потянет).
   Земля считается по точкам: местность берётся со сдвинутой шумом клетки —
   границы получаются мягкими и неровными, а не сеткой; цвет — пятна света и
   тени по шуму; у воды — отмель и пена, у берега — пляж. Поверх — детали
   (трава пучками, камни, рябь, лужи, трещины), дороги и препятствия.
   Всё детерминировано по координатам клеток — куски сходятся без швов.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});
  const TILE = 32, CH = 8, CPX = CH * TILE;

  /* ---------- шум ---------- */
  function hash(x, y, s) { let h = (x * 374761393 + y * 668265263 + s * 144665) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
  function vnoise(x, y, s) {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const a = hash(xi, yi, s), b = hash(xi + 1, yi, s), c = hash(xi, yi + 1, s), d = hash(xi + 1, yi + 1, s);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  }
  function fbm(x, y, s, oct) { let sum = 0, amp = 0.5, f = 1, n = 0; for (let i = 0; i < oct; i++) { sum += amp * vnoise(x * f, y * f, s + i * 17); n += amp; amp *= 0.5; f *= 2.03; } return sum / n; }
  function rngOf(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const rgb = h => { const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

  /* ---------- палитры: тень, середина, свет; детали ---------- */
  const PAL = {
    grass:  { c: ['#3a7428', '#56963a', '#8abc5c'], blade: ['#2a5a1a', '#3f7a26', '#6aa23c', '#a6d066'], tuft: 14, flowers: ['#f6e27a', '#ffffff', '#ee93b8', '#a8c8ff'] },
    dirt:   { c: ['#6a4e32', '#8a6a44', '#aa8a5e'], blade: ['#5e5a2a', '#7c7640', '#a09858'], tuft: 2, stones: 3, cracks: 1 },
    sand:   { c: ['#c4a262', '#dcc284', '#f2e2ae'], ripple: '#b08a52', stones: 1 },
    snow:   { c: ['#a8bcd2', '#dde7f1', '#ffffff'], sparkle: 1, stones: 1 },
    swamp:  { c: ['#34482a', '#50703e', '#76965a'], blade: ['#223a18', '#3a5626', '#5a7a36', '#86a050'], tuft: 6, puddles: 1, reeds: 1 },
    rough:  { c: ['#76664a', '#968666', '#b8a886'], blade: ['#5e5a30', '#7c7640', '#a09858'], tuft: 1.5, stones: 6, cracks: 1 },
    lava:   { c: ['#221614', '#3a2824', '#56382e'], glow: 1, stones: 2 },
    subter: { c: ['#44383e', '#62545a', '#84747a'], stones: 4, crystals: ['#7fd9ea', '#c07ff0', '#7fe0a8'] },
    water:  { c: ['#1b4a88', '#2a64b2', '#3f86cc'] },
    rock:   { c: ['#18181e', '#2a2a32', '#44444e'], cracks: 2 },
  };
  for (const k in PAL) PAL[k].rgb = PAL[k].c.map(rgb);
  const BEACH = rgb('#e2cc92'), SHALLOW = rgb('#4aa6d6'), FOAM = rgb('#e6f4fb');

  /** Плавная ступенька: 0 при x=e0, 1 при x=e1 (e0 может быть больше e1). */
  const sstep = (e0, e1, x) => { const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };

  /* ---------- времена года (модель — H3.Season, vec_seasons.js) ----------
     Сезон перекрашивает только «живую» землю: траву, грязь, бездорожье, болото. Песок, лава,
     камень, подземелье и тундра живут вне сезонов (на воде зимой — лишь холоднее тон).
     Снег ложится по полю «сугробов»: крупный шум плюс мелкий. Порог выбирается по квантилю
     поля, поэтому доля снега на карте равна season.snow: 0.35 — пятна в низинах, 1 — всё белое;
     весной тот же порог идёт назад — остаются проталины, у кромки снега темнеет мокрая земля. */
  const SPAL = {
    spring:  ['#3a862a', '#5cb03a', '#98d866'].map(rgb),           // свежая трава
    autumn:  ['#6e5a1c', '#a8862c', '#d4b056'].map(rgb),           // жухлая, золотая
    rust:    rgb('#b0582a'),                                       // рыжие пятна палой листвы
    dormant: ['#58523a', '#7c7452', '#a09874'].map(rgb),           // прошлогодняя, бурая
    swampA:  ['#4a4826', '#6e6a38', '#948a54'].map(rgb),           // болото осенью
    swampW:  ['#5a6a66', '#8a9c9a', '#bccccc'].map(rgb),           // болото зимой: иней и лёд
    mud:     rgb('#4a3a2a'),
    winterSea: rgb('#24466e'),
  };
  // травинки по сезону: осенью золотые, после снега бурые, весной свежие
  const BLADES = {
    autumn:  ['#6a5418', '#9a7a26', '#c49c3a', '#e2c464'],
    dormant: ['#4e4a2a', '#6e6640', '#8e8456', '#aaa070'],
    spring:  ['#2e6a1c', '#4a9a2c', '#7cc44a', '#b8e47a'],
  };
  const LEAVES = ['#e0a02a', '#d06a26', '#b8401e', '#ecc444', '#a8741c'];
  const SPRING_FLOWERS = ['#f6e27a', '#ffffff', '#ee93b8', '#a8c8ff', '#f7a8cc', '#c8a0f0', '#fff4b0'];
  // лужи: тень под кромкой, верх и низ воды, блик
  const PUDDLE = { swamp: ['rgba(20,34,28,0.55)', '#5e8e8a', '#2a4a44'], sky: ['rgba(40,32,22,0.5)', '#a8c8e4', '#4e6e8e', 'rgba(255,255,255,0.7)'], ice: ['rgba(50,70,84,0.35)', '#eef8fc', '#a4c8dc', 'rgba(255,255,255,0.95)'] };
  const pal3 = (P3, v) => v < 0.5 ? mix(P3[0], P3[1], v * 2) : mix(P3[1], P3[2], (v - 0.5) * 2);
  const hexMix = (a, b, t) => '#' + mix(rgb(a), rgb(b), t).map(x => Math.round(x).toString(16).padStart(2, '0')).join('');
  /** Поле сугробов, ~0..1: крупные пятна (низины) и мелкая рябь по их краю. */
  const snowField = (x, y, seed) => vnoise(x / 46, y / 46, seed + 61) * 0.6 + vnoise(x / 13, y / 13, seed + 62) * 0.4;
  let SNOWQ = null;
  /** Порог поля, под которым лежит доля c земли (квантиль по выборке; распределение шума от сида не зависит). */
  function snowThr(c) {
    if (c <= 0) return -1; if (c >= 1) return 2;
    if (!SNOWQ) { SNOWQ = new Float32Array(4096); let k = 0; for (let j = 0; j < 64; j++) for (let i = 0; i < 64; i++) SNOWQ[k++] = snowField(i * 53.3 + 7, j * 47.9 + 3, 999); SNOWQ.sort(); }
    return SNOWQ[Math.min(4095, Math.floor(c * 4096))];
  }
  const SEASONAL = { grass: 1, dirt: 1, rough: 1, swamp: 1 };

  /** Художник одного слоя карты. */
  function create(state, z) {
    const map = H3.State.lvl(state, z), T = H3.Rules.TERRAINS, Sp = H3.Sprites, seed = (state.seed || 1) >>> 0;
    const RS = Math.min(2, Math.max(1, Math.round(root.devicePixelRatio || 1)));
    let chunks = new Map(), stale = null;   // stale — куски прежнего сезона: видны, пока не готовы новые
    const order = [], fades = new Map();
    const MAX = 64;   // кусков в памяти (≈1 МБ каждый при ×2)
    const tAt = (tx, ty) => T[map.terrain[Math.max(0, Math.min(map.h - 1, ty)) * map.w + Math.max(0, Math.min(map.w - 1, tx))]];
    const land = t => t !== 'water';

    /* ---------- сезон ---------- */
    const NONE = H3.Season ? H3.Season.NONE : { id: 'none', key: 'none', snow: 0, fall: 0, bare: 0, bloom: 0.2, wet: 0, fresh: 0, dormant: 0, leaves: 0 };
    const seasonNow = () => (!z && H3.Season ? H3.Season.of(state.day) : NONE);
    let SE = seasonNow(), thr = -1, mudThr = -1, blades = {};
    function setSeason(S) {
      SE = S; thr = snowThr(S.snow); mudThr = snowThr(Math.min(1, S.snow + 0.35 * S.wet));
      // травинки: летние, подкрашенные к сезонным
      blades = {};
      for (const tt of ['grass', 'dirt', 'rough', 'swamp']) {
        const B = PAL[tt].blade, g = tt === 'grass' ? 1 : 0.5;
        const tint = (arr, to, k) => k > 0 ? arr.map((c, i) => hexMix(c, to[Math.min(to.length - 1, i)], Math.min(1, k))) : arr;
        let b = tint(B, BLADES.spring, S.fresh * 0.7 * g);
        b = tint(b, BLADES.autumn, S.fall * 0.9 * g);
        b = tint(b, BLADES.dormant, S.dormant * 0.85 * g);
        blades[tt] = b;
      }
    }
    setSeason(SE);
    /** Доля снега в точке карты (0..1): только на «живой» земле, на болоте меньше. */
    function snowAt(x, y) {
      if (SE.snow <= 0) return 0;
      const t = tAt(Math.floor(x / TILE), Math.floor(y / TILE)); if (!SEASONAL[t]) return 0;
      return sstep(thr + 0.025, thr - 0.025, snowField(x, y, seed) + (t === 'swamp' ? 0.06 : 0));
    }
    /** Цвет точки местности tt: пятна света v, мелкая рябь s; f — поле сугробов, aN — пятна осени. */
    function tone(tt, edge, v, s, dLand, dWater, f, aN) {
      const P = PAL[tt] || PAL.grass;
      let c = v < 0.5 ? mix(P.rgb[0], P.rgb[1], v * 2) : mix(P.rgb[1], P.rgb[2], (v - 0.5) * 2);
      c = mix(c, s < 0.5 ? P.rgb[0] : P.rgb[2], Math.abs(s - 0.5) * 0.35);
      const sea = SEASONAL[tt] && SE.id !== 'none';
      if (sea) {
        if (tt === 'swamp') {
          if (SE.fall) c = mix(c, pal3(SPAL.swampA, v), SE.fall * 0.7);
          if (SE.snow) c = mix(c, pal3(SPAL.swampW, v), Math.min(1, SE.snow * 1.4) * 0.75);
        } else {
          const g = tt === 'grass' ? 1 : 0.3;   // сколько в местности травы
          if (SE.fresh) c = mix(c, pal3(SPAL.spring, v), SE.fresh * 0.75 * g);
          if (SE.fall) {
            c = mix(c, pal3(SPAL.autumn, v), Math.min(1, SE.fall * g * (0.5 + 0.7 * aN)));
            if (g === 1) c = mix(c, SPAL.rust, SE.fall * 0.4 * sstep(0.6, 0.78, aN));
          }
          if (SE.dormant) c = mix(c, pal3(SPAL.dormant, v), SE.dormant * 0.85 * g);
        }
        // талая вода: темнеет земля у кромки снега (и в сырых низинах)
        if (SE.wet && f >= 0) c = mix(c, SPAL.mud, 0.55 * Math.min(1, SE.wet * 1.4) * sstep(mudThr + 0.015, mudThr - 0.015, f) * sstep(thr, thr + 0.02, f));
      }
      if (tt === 'water') {
        // глубина: чем ближе суша, тем светлее; у самой кромки — пена
        const dl = edge ? 0 : dLand;
        if (SE.snow) c = mix(c, SPAL.winterSea, 0.35 * SE.snow);
        c = mix(c, SHALLOW, 0.6 * sstep(13, 3, dl) * (1 - 0.3 * SE.snow));
        c = mix(c, FOAM, (0.35 + 0.35 * s) * sstep(5, 0.5, dl));
      } else if (tt !== 'lava' && tt !== 'rock' && tt !== 'snow' && tt !== 'subter') {
        c = mix(c, BEACH, 0.7 * sstep(7, 3, edge ? 0 : dWater));   // пляж у воды
      }
      // снег — последним, поверх пляжа; по краю сугроба — голубая тень
      if (sea && SE.snow && f >= 0) {
        const fs = f + (tt === 'swamp' ? 0.06 : 0), k = sstep(thr + 0.02, thr - 0.02, fs), dust = 0.3 * sstep(thr + 0.07, thr + 0.01, fs) * (1 - k);
        if (k > 0 || dust > 0) {   // сугроб, по краю — голубая тень; вокруг — пороша, сквозь которую видна земля
          const S3 = PAL.snow.rgb; let sc = pal3(S3, v); sc = mix(sc, s < 0.5 ? S3[0] : S3[2], Math.abs(s - 0.5) * 0.35);
          c = mix(mix(c, sc, k + dust * (0.6 + s * 0.8)), S3[0], 1.3 * k * (1 - k));
        }
      }
      return c;
    }

    /** Земля куска: по точке на пиксель карты, затем ×RS со сглаживанием. */
    function paintBase(ctx, cx, cy) {
      const X0 = cx * CPX, Y0 = cy * CPX;
      // основа плавная — считаем через точку (вчетверо быстрее), растягиваем со сглаживанием
      const ST = 2, N = CPX / ST + 1;
      const low = document.createElement('canvas'); low.width = N; low.height = N;
      const lc = low.getContext('2d'), img = lc.createImageData(N, N), d = img.data;
      const W = map.w * TILE, H = map.h * TILE;
      // клетки, у которых все восемь соседей той же местности: для их точек поиск кромки не нужен
      // (точка сдвинута шумом не дальше 20 пикс., поэтому хватает поля в клетку вокруг куска)
      const UX0 = cx * CH - 1, UY0 = cy * CH - 1, UW = CH + 3, uni = new Uint8Array(UW * UW);
      for (let uy = 0; uy < UW; uy++) for (let ux = 0; ux < UW; ux++) {
        const tx = UX0 + ux, ty = UY0 + uy, t = tAt(tx, ty); let same = 1;
        for (let oy = -1; oy <= 1 && same; oy++) for (let ox = -1; ox <= 1; ox++) if (tAt(tx + ox, ty + oy) !== t) { same = 0; break; }
        uni[uy * UW + ux] = same;
      }
      const needF = SE.snow > 0 || SE.wet > 0, needA = SE.fall > 0;
      for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
        const x = X0 + i * ST, y = Y0 + j * ST, k = (j * N + i) * 4;
        if (x >= W || y >= H) { d[k + 3] = 0; continue; }
        // граница местностей: крупная волна ±14 и мелкая ±6 — углы клеток скругляются, сетка не читается
        const n1 = (vnoise(x / 44, y / 44, seed) * 2 - 1) * 14 + (vnoise(x / 13, y / 13, seed + 3) * 2 - 1) * 6;
        const n2 = (vnoise(x / 44 + 40, y / 44, seed + 1) * 2 - 1) * 14 + (vnoise(x / 13 + 9, y / 13, seed + 4) * 2 - 1) * 6;
        const px = x + n1, py = y + n2;
        const tx = Math.floor(px / TILE), ty = Math.floor(py / TILE), t = tAt(tx, ty);
        // расстояния до соседних клеток другой местности и до воды/суши — непрерывные,
        // поэтому кромка не повторяет сетку выборки и при увеличении не идёт лесенкой
        let dOther = 99, tOther = null, dWater = 99, dLand = 99;
        const ux = tx - UX0, uy = ty - UY0;
        if (!(ux >= 0 && uy >= 0 && ux < UW && uy < UW && uni[uy * UW + ux])) for (let oy = -1; oy <= 1; oy++) for (let ox = -1; ox <= 1; ox++) {
          if (!ox && !oy) continue;
          const nt = tAt(tx + ox, ty + oy); if (nt === t) continue;
          const rx0 = (tx + ox) * TILE, ry0 = (ty + oy) * TILE;
          const ddx = Math.max(rx0 - px, 0, px - rx0 - TILE), ddy = Math.max(ry0 - py, 0, py - ry0 - TILE), dd = Math.sqrt(ddx * ddx + ddy * ddy);
          if (dd < dOther) { dOther = dd; tOther = nt; }
          if (nt === 'water') dWater = Math.min(dWater, dd); else dLand = Math.min(dLand, dd);
        }
        const v = fbm(x / 110, y / 110, seed + 7, 3), s = vnoise(x / 8, y / 8, seed + 9);
        const f = needF ? snowField(x, y, seed) : -1, aN = needA ? vnoise(x / 46, y / 46, seed + 63) : 0.5;
        let c = tone(t, false, v, s, dLand, dWater, f, aN);
        // на самой границе обе стороны сходятся к середине: у воды шов ±2.5 точки, между сушей — шире, как мазок
        const BW = t === 'water' || tOther === 'water' ? 2.5 : 7;
        if (dOther < BW) c = mix(c, tone(tOther, true, v, s, dLand, dWater, f, aN), 0.5 * sstep(BW, 0, dOther));
        d[k] = c[0]; d[k + 1] = c[1]; d[k + 2] = c[2]; d[k + 3] = 255;
      }
      lc.putImageData(img, 0, 0);
      ctx.save(); ctx.setTransform(RS * ST, 0, 0, RS * ST, 0, 0); ctx.imageSmoothingEnabled = true; ctx.drawImage(low, -0.5, -0.5); ctx.restore();
    }

    /** Лужа: болотная (тёмная), талая (в ней небо) или замёрзшая (лёд с бликом). */
    function puddle(ctx, x, y, r, kind) {
      const C = PUDDLE[kind];
      ctx.fillStyle = C[0]; ctx.beginPath(); ctx.ellipse(x + 0.6, y + 0.8, r * 1.6 + 1, r * 0.7 + 1, 0, 0, Math.PI * 2); ctx.fill();
      const g = ctx.createLinearGradient(0, y - r, 0, y + r); g.addColorStop(0, C[1]); g.addColorStop(1, C[2]); ctx.fillStyle = g;
      ctx.beginPath(); ctx.ellipse(x, y, r * 1.6, r * 0.7, 0, 0, Math.PI * 2); ctx.fill();
      if (C[3]) { ctx.strokeStyle = C[3]; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(x - r * 0.9, y - r * 0.15); ctx.lineTo(x + r * 0.2, y - r * 0.32); ctx.stroke(); }
    }

    /** Детали по клеткам (с полем в клетку вокруг куска — чтобы на стыке ничего не обрезалось). */
    function paintDetails(ctx, cx, cy) {
      const tx0 = cx * CH - 1, ty0 = cy * CH - 1, tx1 = cx * CH + CH, ty1 = cy * CH + CH;
      const B = {};   // пучки штрихов по цвету — один stroke на цвет
      const path = c => B[c] || (B[c] = new Path2D());
      ctx.lineCap = 'round';
      // сезон: под снегом травы и цветов не видно; весной цветов больше, осенью их сменяет палая листва.
      // Сезонные мелочи берут свой генератор — летние пучки и камни остаются на своих местах в любой сезон
      const sea = SE.id !== 'none', snowy = SE.snow > 0;
      const flowerK = !sea ? 1 : SE.id === 'spring' ? 0.3 + SE.bloom * 1.9 : SE.id === 'summer' ? 1 + SE.bloom : SE.id === 'autumn' ? Math.max(0, 1 - SE.fall * 1.5) : 0;
      const FLW = SE.id === 'spring' ? SPRING_FLOWERS : null;
      const treeAt = (x, y) => x >= 0 && y >= 0 && x < map.w && y < map.h && map.obs[y * map.w + x] === 1;
      for (let ty = ty0; ty <= ty1; ty++) for (let tx = tx0; tx <= tx1; tx++) {
        if (tx < 0 || ty < 0 || tx >= map.w || ty >= map.h) continue;
        const t = tAt(tx, ty), P = PAL[t]; if (!P) continue;
        const rnd = rngOf(hash(tx, ty, seed + 101) * 4294967296);
        const bx = tx * TILE, by = ty * TILE, live = sea && SEASONAL[t], BL = (live && blades[t]) || P.blade;
        if (P.tuft) for (let i = 0; i < P.tuft; i++) {
          const x = bx + rnd() * TILE, y = by + rnd() * TILE, L = fbm(x / 110, y / 110, seed + 7, 3), n = 3 + (rnd() * 3 | 0);
          const hide = live && snowy && snowAt(x, y) > 0.5;
          for (let b = 0; b < n; b++) {
            const h = (1.6 + rnd() * 2.0) * (P.reeds && rnd() < 0.2 ? 2.4 : 1), lean = (rnd() - 0.5) * 1.1, x0 = x + (rnd() - 0.5) * 3;
            const ci = Math.max(0, Math.min(BL.length - 1, Math.floor(L * BL.length * 1.2 + (rnd() - 0.5) * 1.8) - (b === 0 ? 1 : 0)));
            if (hide) continue;
            const p = path(BL[ci]); p.moveTo(x0, y); p.quadraticCurveTo(x0 + lean * h * 0.3, y - h * 0.6, x0 + lean * h, y - h);
          }
        }
        if (P.flowers && rnd() < 0.18 * flowerK) {
          const F = FLW || P.flowers; ctx.fillStyle = F[(rnd() * F.length) | 0]; const x = bx + 4 + rnd() * 24, y = by + 4 + rnd() * 24;
          if (!(snowy && snowAt(x, y) > 0.3)) for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.arc(x + (rnd() - 0.5) * 5, y + (rnd() - 0.5) * 3, 0.9, 0, Math.PI * 2); ctx.fill(); }
        }
        if (live) {
          const r2 = rngOf(hash(tx, ty, seed + 131) * 4294967296);
          // палая листва: пятнышками по траве, гуще у стволов; под снегом её уже не видно
          const lf = SE.fall * (t === 'grass' ? 1 : 0.6) * (SE.id === 'winter' ? 0 : 1);
          if (lf > 0.05) {
            const under = treeAt(tx, ty) || treeAt(tx - 1, ty) || treeAt(tx + 1, ty) || treeAt(tx, ty + 1) || treeAt(tx, ty - 1);
            const n = Math.round(lf * (under ? 10 : 2.5) * (0.5 + r2()));
            for (let i = 0; i < n; i++) {
              const x = bx + r2() * TILE, y = by + r2() * TILE, c = LEAVES[(r2() * LEAVES.length) | 0], a = r2() * Math.PI;
              if (snowy && snowAt(x, y) > 0.4) continue;
              ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, 1.15, 0.65, a, 0, Math.PI * 2); ctx.fill();
            }
          }
          // искры на снегу
          if (snowy) { ctx.fillStyle = 'rgba(255,255,255,0.95)'; for (let i = 0; i < 3; i++) { const x = bx + r2() * TILE, y = by + r2() * TILE; if (snowAt(x, y) > 0.7) ctx.fillRect(x, y, 0.6, 0.6); } }
          // весна: лужи талой воды у кромки снега и в сырых низинах — в них отражается небо
          if (SE.wet > 0.05 && t !== 'swamp' && r2() < 0.6 * SE.wet) {
            const x = bx + 6 + r2() * 20, y = by + 6 + r2() * 20, r = 2 + r2() * 3, f = snowField(x, y, seed);
            if (f > thr + 0.015 && f < mudThr + 0.04) puddle(ctx, x, y, r, 'sky');
          }
        }
        if (P.stones) for (let i = 0; i < P.stones; i++) {
          if (rnd() > 0.45) continue;
          const x = bx + rnd() * TILE, y = by + rnd() * TILE, s = 0.8 + rnd() * 1.8, base = PAL[t].rgb[2];
          if (live && snowy && snowAt(x, y) > 0.55) continue;   // камешки замело
          ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.ellipse(x + s * 0.5, y + s * 0.4, s * 1.3, s * 0.6, 0, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = 'rgb(' + mix(base, [255, 255, 255], 0.15).map(v => v | 0).join(',') + ')'; ctx.beginPath(); ctx.ellipse(x, y - s * 0.2, s * 1.2, s * 0.8, 0, 0, Math.PI * 2); ctx.fill();
        }
        if (P.ripple) { const p = path('rgba(160,120,70,0.35)'); for (let i = 0; i < 3; i++) { const x = bx + rnd() * TILE, y = by + rnd() * TILE, L = 4 + rnd() * 6; p.moveTo(x - L, y); p.quadraticCurveTo(x, y - 1.5, x + L, y + 0.5); } }
        if (P.cracks && rnd() < 0.3 * P.cracks) { const p = path('rgba(30,20,12,0.4)'); let x = bx + rnd() * TILE, y = by + rnd() * TILE; p.moveTo(x, y); for (let k = 0; k < 4; k++) { x += (rnd() - 0.5) * 9; y += (rnd() - 0.3) * 4; p.lineTo(x, y); } }
        if (P.sparkle) { ctx.fillStyle = 'rgba(255,255,255,0.95)'; for (let i = 0; i < 4; i++) ctx.fillRect(bx + rnd() * TILE, by + rnd() * TILE, 0.6, 0.6); }
        if (P.puddles && rnd() < 0.35) {
          const x = bx + 6 + rnd() * 20, y = by + 6 + rnd() * 20, r = 3 + rnd() * 5;
          puddle(ctx, x, y, r, sea && SE.snow > 0.25 ? 'ice' : 'swamp');   // зимой болото подо льдом
        }
        if (P.glow && rnd() < 0.5) {
          let x = bx + rnd() * TILE, y = by + rnd() * TILE; ctx.beginPath(); ctx.moveTo(x, y);
          for (let k = 0; k < 4; k++) { x += (rnd() - 0.5) * 10; y += (rnd() - 0.3) * 5; ctx.lineTo(x, y); }
          ctx.strokeStyle = 'rgba(255,110,30,0.35)'; ctx.lineWidth = 3; ctx.stroke(); ctx.strokeStyle = 'rgba(255,190,90,0.9)'; ctx.lineWidth = 0.9; ctx.stroke();
        }
        if (P.crystals && rnd() < 0.15) { const x = bx + 6 + rnd() * 20, y = by + 8 + rnd() * 20, c = P.crystals[(rnd() * 3) | 0]; ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(x - 2, y); ctx.lineTo(x, y - 6); ctx.lineTo(x + 2, y); ctx.fill(); }
        if (t === 'water' && rnd() < 0.6) { const p = path('rgba(200,230,255,0.35)'); const x = bx + rnd() * TILE, y = by + rnd() * TILE, L = 3 + rnd() * 5; p.moveTo(x - L, y); p.quadraticCurveTo(x, y - 1.5, x + L, y); }
      }
      for (const c in B) { ctx.strokeStyle = c; ctx.lineWidth = c.startsWith('rgba') ? 0.6 : 0.5; ctx.stroke(B[c]); }
    }

    /** Дороги: мягкая колея от центра к центрам соседей. */
    function paintRoads(ctx, cx, cy) {
      const x0 = cx * CH - 1, y0 = cy * CH - 1, x1 = cx * CH + CH, y1 = cy * CH + CH;
      const roadAt = (x, y) => x >= 0 && y >= 0 && x < map.w && y < map.h && map.road[y * map.w + x];
      const P = new Path2D(); let any = false;
      const DIRS = [[1, 0], [0, 1], [1, 1], [1, -1]];
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
        if (!roadAt(x, y)) continue; any = true;
        const cxp = x * TILE + 16, cyp = y * TILE + 16; let links = 0;
        for (const d of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]) if (roadAt(x + d[0], y + d[1]) && !(d[0] && d[1] && (roadAt(x + d[0], y) || roadAt(x, y + d[1])))) links++;
        for (const d of DIRS) {
          if (!roadAt(x + d[0], y + d[1])) continue;
          if (d[0] && d[1] && (roadAt(x + d[0], y) || roadAt(x, y + d[1]))) continue;
          P.moveTo(cxp, cyp); P.lineTo(cxp + d[0] * TILE, cyp + d[1] * TILE);
        }
        if (!links) { P.moveTo(cxp, cyp); P.lineTo(cxp + 0.1, cyp); }
      }
      if (!any) return;
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      for (const [c, w] of [['rgba(60,44,28,0.35)', 16], ['#7a6040', 12], ['#b49a70', 9], ['rgba(230,210,170,0.35)', 3]]) { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.stroke(P); }
      // зимой дорогу заметает, посередине — накатанная колея; весной она раскисает
      if (SE.snow > 0) { ctx.strokeStyle = 'rgba(238,244,250,' + (0.6 * SE.snow).toFixed(2) + ')'; ctx.lineWidth = 13; ctx.stroke(P); ctx.strokeStyle = 'rgba(150,128,96,' + (0.55 * SE.snow).toFixed(2) + ')'; ctx.lineWidth = 4; ctx.stroke(P); }
      if (SE.wet > 0) { ctx.strokeStyle = 'rgba(80,58,36,' + (0.35 * SE.wet).toFixed(2) + ')'; ctx.lineWidth = 8; ctx.stroke(P); }
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
        if (!roadAt(x, y)) continue; const rnd = rngOf(hash(x, y, seed + 303) * 4294967296);
        ctx.fillStyle = 'rgba(110,90,60,0.8)'; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(x * TILE + 11 + rnd() * 10, y * TILE + 11 + rnd() * 10, 0.9, 0, Math.PI * 2); ctx.fill(); }
      }
    }

    /** Препятствия: деревья, горы, скалы — с мягкой тенью у подножия. */
    function paintObstacles(ctx, cx, cy) {
      const x0 = cx * CH - 2, y0 = cy * CH - 1, x1 = cx * CH + CH + 1, y1 = cy * CH + CH + 3;
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
        if (x < 0 || y < 0 || x >= map.w || y >= map.h) continue;
        const obs = map.obs[y * map.w + x]; if (!obs) continue;
        const sp0 = H3.Terrain.obstacleSprite(T[map.terrain[y * map.w + x]], obs, x, y); if (!sp0) continue;
        // дерево по сезону: осенью желтеет и облетает, зимой в снегу, весной цветёт (H3.Season.tree)
        const sp = SE.id !== 'none' && H3.Season ? H3.Season.tree(sp0, SE, x, y, snowAt(x * TILE + 16, y * TILE + 28)) : sp0;
        const px = x * TILE + 16 + ((x * 3 + y) % 3) - 1, py = y * TILE + 31;
        const g = ctx.createRadialGradient(px, py - 2, 1, px, py - 2, obs === 2 ? 22 : 13);
        g.addColorStop(0, 'rgba(10,14,20,0.35)'); g.addColorStop(1, 'rgba(10,14,20,0)');
        ctx.fillStyle = g; ctx.fillRect(px - 24, py - 20, 48, 30);
        ctx.imageSmoothingEnabled = true;
        Sp.draw(ctx, sp, px, py, 1, (x + y) % 2 === 0);
      }
    }

    function build(cx, cy) {
      const cv = document.createElement('canvas'); cv.width = CPX * RS; cv.height = CPX * RS;
      const ctx = cv.getContext('2d');
      paintBase(ctx, cx, cy);
      ctx.setTransform(RS, 0, 0, RS, -cx * CPX * RS, -cy * CPX * RS);
      paintDetails(ctx, cx, cy);
      paintRoads(ctx, cx, cy);
      paintObstacles(ctx, cx, cy);
      if (z) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = '#5b5568'; ctx.fillRect(0, 0, cv.width, cv.height); ctx.globalCompositeOperation = 'source-over'; }
      return cv;
    }
    function get(cx, cy, force) {
      const key = cx + ',' + cy;
      let cv = chunks.get(key);
      if (cv) return cv;
      if (!force) return null;
      cv = build(cx, cy); chunks.set(key, cv); order.push(key);
      if (stale && stale.has(key)) fades.set(key, performance.now());
      while (order.length > MAX) chunks.delete(order.shift());
      return cv;
    }
    /* Смена сезона: ключ меняется раз в неделю (осенью, зимой, весной) и с новым месяцем.
       Куски пересобираются лениво, как при прокрутке; пока новый не готов, виден прежний,
       а готовый проявляется поверх него за FADE мс — снег «ложится», а не щёлкает. */
    const FADE = 700;
    let seasonDay = state.day;
    function checkSeason() {
      if (state.day === seasonDay) return;
      seasonDay = state.day;
      const S = seasonNow(); if (S.key === SE.key) return;
      setSeason(S);
      stale = chunks; chunks = new Map(); order.length = 0; fades.clear(); idleQ = null;
    }
    /** Вывести видимые клетки; недорисованные куски — по два за кадр, остальное — ровным цветом (дорисуется). */
    let idleQ = null;
    /** В паузах дорисовать кольцо кусков вокруг видимой области — прокрутка потом не ждёт. */
    function prefetch(cx0, cy0, cx1, cy1) {
      if (idleQ) return;
      const want = [];
      for (let cy = cy0 - 1; cy <= cy1 + 1; cy++) for (let cx = cx0 - 1; cx <= cx1 + 1; cx++) if (cx >= 0 && cy >= 0 && cx * CH < map.w && cy * CH < map.h && !chunks.has(cx + ',' + cy)) want.push([cx, cy]);
      if (!want.length) return;
      idleQ = want;
      const step = () => { const c = idleQ && idleQ.shift(); if (!c) { idleQ = null; return; } get(c[0], c[1], true); (root.requestIdleCallback || (f => setTimeout(f, 30)))(step); };
      (root.requestIdleCallback || (f => setTimeout(f, 30)))(step);
    }
    function draw(ctx, x0, y0, x1, y1) {
      checkSeason();
      let budget = 1, usedStale = false;
      const prev = ctx.imageSmoothingEnabled; ctx.imageSmoothingEnabled = true;
      for (let cy = Math.floor(y0 / CH); cy <= Math.floor(y1 / CH); cy++) for (let cx = Math.floor(x0 / CH); cx <= Math.floor(x1 / CH); cx++) {
        let cv = get(cx, cy, false);
        if (!cv && budget > 0) { budget--; cv = get(cx, cy, true); }
        const old = stale && stale.get(cx + ',' + cy);
        if (cv) {
          const f0 = old && fades.get(cx + ',' + cy), k = f0 === undefined || !old ? 1 : (performance.now() - f0) / FADE;
          if (k < 1) {   // проявление нового сезона поверх прежнего
            ctx.drawImage(old, cx * CPX, cy * CPX, CPX, CPX);
            ctx.globalAlpha = sstep(0, 1, k); ctx.drawImage(cv, cx * CPX, cy * CPX, CPX, CPX); ctx.globalAlpha = 1;
            painter.pending = true; usedStale = true;
          } else ctx.drawImage(cv, cx * CPX, cy * CPX, CPX, CPX);
        } else if (old) { ctx.drawImage(old, cx * CPX, cy * CPX, CPX, CPX); painter.pending = true; usedStale = true; }
        else { ctx.fillStyle = (PAL[tAt(cx * CH + 4, cy * CH + 4)] || PAL.grass).c[1]; ctx.fillRect(cx * CPX, cy * CPX, CPX, CPX); painter.pending = true; }
      }
      if (stale && !usedStale) { stale = null; fades.clear(); }   // смена сезона на экране закончилась — прежние куски не держим
      ctx.imageSmoothingEnabled = prev;
      prefetch(Math.floor(x0 / CH), Math.floor(y0 / CH), Math.floor(x1 / CH), Math.floor(y1 / CH));
    }
    /* ---------- берег для прибоя ----------
       Кромка воды считается той же функцией, что и земля: точка сдвигается тем же шумом,
       и берётся расстояние до ближайшей клетки «другой стороны» (вода/суша). Нулевая линия
       этого поля и есть нарисованный берег; вдоль неё — пенные гребни с нормалью в сторону моря. */
    /** Знаковое расстояние до берега, пикс. карты: > 0 — в воде, < 0 — на суше (до 20). */
    function sdf(x, y) {
      const n1 = (vnoise(x / 44, y / 44, seed) * 2 - 1) * 14 + (vnoise(x / 13, y / 13, seed + 3) * 2 - 1) * 6;
      const n2 = (vnoise(x / 44 + 40, y / 44, seed + 1) * 2 - 1) * 14 + (vnoise(x / 13 + 9, y / 13, seed + 4) * 2 - 1) * 6;
      const px = x + n1, py = y + n2, tx = Math.floor(px / TILE), ty = Math.floor(py / TILE), w = tAt(tx, ty) === 'water';
      let d = 20;
      for (let oy = -1; oy <= 1; oy++) for (let ox = -1; ox <= 1; ox++) {
        if (!ox && !oy) continue;
        if ((tAt(tx + ox, ty + oy) === 'water') === w) continue;
        const rx0 = (tx + ox) * TILE, ry0 = (ty + oy) * TILE;
        const ddx = Math.max(rx0 - px, 0, px - rx0 - TILE), ddy = Math.max(ry0 - py, 0, py - ry0 - TILE), dd = Math.sqrt(ddx * ddx + ddy * ddy);
        if (dd < d) d = dd;
      }
      return w ? d : -d;
    }
    const shores = new Map();
    /** Гребни прибоя куска: [{ n, a: Float32Array [x, y, nx, ny, фаза]×n, ph }] — считается один раз. */
    function buildShore(cx, cy) {
      // есть ли в куске (с полем в клетку) и вода, и суша
      let wa = 0, la = 0;
      for (let ty = cy * CH - 1; ty <= cy * CH + CH; ty++) for (let tx = cx * CH - 1; tx <= cx * CH + CH; tx++) { if (tAt(tx, ty) === 'water') wa++; else la++; }
      if (!wa || !la) return [];
      const G = 4, N = CPX / G + 1, X0 = cx * CPX, Y0 = cy * CPX, W = map.w * TILE, Hh = map.h * TILE;
      const f = new Float32Array(N * N);
      for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) f[j * N + i] = sdf(X0 + i * G, Y0 + j * G);
      // марширующие квадраты по нулю поля: точки пересечения лежат на рёбрах сетки,
      // ребро — общее у двух ячеек, поэтому отрезки сшиваются в линии по номеру ребра
      const pt = new Map(), adj = new Map();
      const edgePt = (id) => {
        if (pt.has(id)) return;
        const e = id >> 1, i = e % N, j = (e - i) / N, a = f[e], b = (id & 1) ? f[e + N] : f[e + 1], k = a / (a - b);
        pt.set(id, (id & 1) ? [X0 + i * G, Y0 + (j + k) * G] : [X0 + (i + k) * G, Y0 + j * G]);
      };
      const link = (p, q) => { edgePt(p); edgePt(q); (adj.get(p) || adj.set(p, []).get(p)).push(q); (adj.get(q) || adj.set(q, []).get(q)).push(p); };
      for (let j = 0; j < N - 1; j++) for (let i = 0; i < N - 1; i++) {
        const e = j * N + i, a = f[e] > 0, b = f[e + 1] > 0, c = f[e + N + 1] > 0, d = f[e + N] > 0;
        const code = (a ? 8 : 0) | (b ? 4 : 0) | (c ? 2 : 0) | (d ? 1 : 0);
        if (!code || code === 15) continue;
        const T_ = e * 2, B_ = (e + N) * 2, L_ = e * 2 + 1, R_ = (e + 1) * 2 + 1;
        switch (code) {
          case 1: case 14: link(L_, B_); break;
          case 2: case 13: link(B_, R_); break;
          case 3: case 12: link(L_, R_); break;
          case 4: case 11: link(T_, R_); break;
          case 6: case 9: link(T_, B_); break;
          case 7: case 8: link(L_, T_); break;
          case 5: case 10: {   // седло: решает среднее по ячейке
            const mid = (f[e] + f[e + 1] + f[e + N] + f[e + N + 1]) / 4 > 0;
            if ((code === 5) === mid) { link(L_, T_); link(B_, R_); } else { link(L_, B_); link(T_, R_); }
          }
        }
      }
      // обход: сначала открытые концы (обрез куска), затем замкнутые петли
      const used = new Set(), lines = [];
      const walk = start => { const out = [start]; used.add(start); let cur = start; for (;;) { const nx = (adj.get(cur) || []).find(q => !used.has(q)); if (nx === undefined) break; used.add(nx); out.push(nx); cur = nx; } return out.map(id => pt.get(id)); };
      for (const [id, l] of adj) if (l.length === 1 && !used.has(id)) lines.push(walk(id));
      for (const id of adj.keys()) if (!used.has(id)) { const l = walk(id); l.push(l[0]); lines.push(l); }
      const crests = [];
      for (let line of lines) {
        if (line.length < 3) continue;
        // одно сглаживание Чайкина: сетка 4 пикс. не должна читаться уступами при увеличении
        const sm = [line[0]];
        for (let i = 0; i < line.length - 1; i++) { const p = line[i], q = line[i + 1]; sm.push([p[0] * 0.75 + q[0] * 0.25, p[1] * 0.75 + q[1] * 0.25], [p[0] * 0.25 + q[0] * 0.75, p[1] * 0.25 + q[1] * 0.75]); }
        sm.push(line[line.length - 1]); line = sm;
        // режем на гребни там, где шум «пены» выше порога — не весь берег в прибое сразу
        let cur = [];
        const flush = () => {
          if (cur.length >= 4) {
            const a = new Float32Array(cur.length * 5); cur.forEach((q, i) => a.set(q, i * 5));
            const m = cur[cur.length >> 1];
            crests.push({ n: cur.length, a, ph: m[4], x: m[0], y: m[1] });
          }
          cur = [];
        };
        for (const [x, y] of line) {
          const on = x > 1 && y > 1 && x < W - 1 && y < Hh - 1 && vnoise(x / 17, y / 17, seed + 55) > 0.4;
          if (!on) { flush(); continue; }
          const gx = sdf(x + 2, y) - sdf(x - 2, y), gy = sdf(x, y + 2) - sdf(x, y - 2), gl = Math.hypot(gx, gy);
          if (gl < 0.4) { flush(); continue; }
          cur.push([x, y, gx / gl, gy / gl, vnoise(x / 90, y / 90, seed + 56) * 1.6 + vnoise(x / 21, y / 21, seed + 57) * 0.3]);
        }
        flush();
      }
      return crests;
    }
    /** Гребни куска; за кадр досчитывается не больше одного нового (force — считать сразу). */
    let shoreBudget = 0;
    function shore(cx, cy) {
      const key = cx + ',' + cy;
      let s = shores.get(key);
      if (s) return s;
      if (shoreBudget <= 0) return null;
      shoreBudget--;
      s = buildShore(cx, cy); shores.set(key, s);
      if (shores.size > 400) shores.delete(shores.keys().next().value);
      return s;
    }
    const painter = { draw, get, sdf, shore, frame: () => { shoreBudget = 1; }, tAt, clear: () => { chunks.clear(); order.length = 0; shores.clear(); stale = null; fades.clear(); }, pending: false, z, map, seed,
      snowAt, season: () => SE };
    return painter;
  }

  /** Сдвиг точки по шуму (в пикселях карты) — чтобы края тумана и местностей не шли по сетке клеток. */
  function warp(x, y, amp) { return [(vnoise(x / 22, y / 22, 77) * 2 - 1) * amp, (vnoise(x / 22 + 40, y / 22, 78) * 2 - 1) * amp]; }

  /* ============================================================================
     Живая карта: всё, что двигается поверх запечённых кусков земли. Рисуется каждый
     кадр, поэтому только дешёвые штрихи, собранные в несколько Path2D по прозрачности.
       surf  — прибой: пенные гребни набегают на берег и откатываются;
       water — рябь и блики на открытой воде, изредка рыба или спина морского змея;
       trail — след героя: пыль, брызги, следы на снегу, кильватер лодки;
       fog   — неразведанное как старая карта: пергамент (под землёй — тёмный камень).
     ========================================================================== */
  const BK = 6;   // уровней прозрачности в пачке штрихов
  const buckets = () => { const a = []; for (let i = 0; i < BK; i++) a.push(null); return a; };
  const bk = (arr, a) => { const i = Math.max(0, Math.min(BK - 1, Math.round(a * (BK - 1)))); return arr[i] || (arr[i] = new Path2D()); };
  function strokeBuckets(ctx, arr, rgb, amul, lw) {
    ctx.lineWidth = lw;
    for (let i = 1; i < BK; i++) if (arr[i]) { ctx.strokeStyle = 'rgba(' + rgb + ',' + (i / (BK - 1) * amul).toFixed(3) + ')'; ctx.stroke(arr[i]); }
  }
  function fillBuckets(ctx, arr, rgb, amul) {
    for (let i = 1; i < BK; i++) if (arr[i]) { ctx.fillStyle = 'rgba(' + rgb + ',' + (i / (BK - 1) * amul).toFixed(3) + ')'; ctx.fill(arr[i]); }
  }

  /* ---------- прибой ---------- */
  const SURF_T = 5.6;   // период волны, с
  /** Отступ гребня от кромки (пикс., + в море) и его яркость по фазе волны 0..1. */
  function surfAt(p) {
    if (p < 0.62) { const q = Math.max(0, p / 0.62); return [0.8 + 7.5 * Math.pow(1 - q, 1.4), 0.9 * sstep(0, 0.5, q)]; }         // набегает, ускоряясь
    if (p < 0.74) { const q = (p - 0.62) / 0.12; return [0.8 - 2.4 * Math.sin(q * Math.PI / 2), 0.9]; }                              // взбегает на песок
    const q = Math.min(1, (p - 0.74) / 0.26); return [-1.6 + 3.6 * q, 0.9 * (1 - q) * (1 - q)];                                        // откатывается кружевом и тает
  }
  // пунктиры с несоразмерными шагами: наложенные друг на друга, они не читаются как узор
  const DASH_A = [3.1, 1.2, 0.7, 2.1, 1.8, 0.9], DASH_A2 = [0.5, 2.3, 1.2, 1.7, 0.4, 2.9], DASH_B = [0.5, 1.8, 1.1, 2.6, 0.3, 1.4];
  function drawSurf(ctx, P, x0, y0, x1, y1, ts) {
    P.frame();
    const T = ts / 1000 / SURF_T, foam = buckets(), lace = buckets(), body = buckets();
    for (let cy = Math.floor(y0 / CH); cy <= Math.floor(y1 / CH); cy++) for (let cx = Math.floor(x0 / CH); cx <= Math.floor(x1 / CH); cx++) {
      const cr = P.shore(cx, cy); if (!cr) continue;
      for (const c of cr) {
        const a = c.a;
        for (let w = 0; w < 2; w++) {
          let pb = T + c.ph + w * 0.5; pb -= Math.floor(pb);
          const [, al] = surfAt(pb); if (al < 0.05) continue;
          // гребень — рваная пена; после наката она рассыпается «кружевом»
          const pf = pb < 0.66 ? bk(foam, al) : bk(lace, al), pbd = pb < 0.66 ? bk(body, al) : null;
          // через точку: после сглаживания они идут каждые 2 пикс., для волны хватает 4
          for (let i = 0; i < c.n; i = i + 2 < c.n || i === c.n - 1 ? i + 2 : c.n - 1) {
            const k = i * 5, p = pb + (a[k + 4] - c.ph), d = surfAt(Math.max(0, Math.min(0.999, p)))[0];
            const x = a[k] + a[k + 2] * d, y = a[k + 1] + a[k + 3] * d;
            if (i) pf.lineTo(x, y); else pf.moveTo(x, y);
            if (pbd) { const x2 = x + a[k + 2] * 1.1, y2 = y + a[k + 3] * 1.1; if (i) pbd.lineTo(x2, y2); else pbd.moveTo(x2, y2); }
          }
        }
      }
    }
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    strokeBuckets(ctx, body, '200,236,255', 0.2, 2.8);     // светлый вал волны перед пеной
    strokeBuckets(ctx, foam, '236,248,255', 0.42, 1.5);   // сплошная мягкая полоса пены — рваное кружево лежит поверх, а не висит пунктиром
    ctx.setLineDash(DASH_A); strokeBuckets(ctx, foam, '240,250,255', 0.55, 0.6);
    ctx.setLineDash(DASH_A2); ctx.lineDashOffset = 1.3; strokeBuckets(ctx, foam, '240,250,255', 0.35, 0.9);
    ctx.setLineDash(DASH_B); ctx.lineDashOffset = 0; strokeBuckets(ctx, lace, '240,250,255', 0.45, 0.7);
    ctx.restore();
  }

  /* ---------- вода: рябь, блики, редкие гости ---------- */
  const openCache = new WeakMap();
  /** Сколько воды в квадрате 5×5 вокруг клетки (для открытой воды — 25). */
  function openness(m, water) {
    let o = openCache.get(m); if (o) return o;
    o = new Uint8Array(m.w * m.h);
    for (let y = 0; y < m.h; y++) for (let x = 0; x < m.w; x++) {
      if (m.terrain[y * m.w + x] !== water) continue;
      let n = 0;
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= m.w || yy >= m.h || m.terrain[yy * m.w + xx] === water) n++; }
      o[y * m.w + x] = n;
    }
    openCache.set(m, o); return o;
  }
  const SEA = { ev: null, next: 0 };
  function drawWater(ctx, m, vis, water, x0, y0, x1, y1, ts, calm) {
    const op = openness(m, water), T = ts / 1000, rip = buckets(), gl = buckets();
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const i = y * m.w + x; if (m.terrain[i] !== water || !vis[i]) continue;
      const o = op[i]; if (o < 12) continue;
      const nr = o >= 24 ? 3 : o >= 18 ? 2 : 1;
      for (let r = 0; r < nr; r++) {
        const h1 = hash(x, y, 900 + r), h2 = hash(x, y, 950 + r), per = 2.6 + h1 * 2.2;
        let f = T / per + h2; const cyc = Math.floor(f); f -= cyc;
        // рябь каждый цикл встаёт в новом месте клетки — поверхность не мерцает на одних точках
        const hx = hash(x * 7 + cyc, y, 1000 + r), hy = hash(x, y * 7 + cyc, 1100 + r);
        const px = x * TILE + 3 + hx * 26 + f * 3, py = y * TILE + 4 + hy * 24, L = 2.2 + h1 * 2.8;
        const a = Math.pow(Math.sin(f * Math.PI), 2) * (o >= 24 ? 1 : 0.7);
        if (a < 0.08) continue;
        const p = bk(rip, a);
        p.moveTo(px - L, py + 0.4); p.quadraticCurveTo(px - L * 0.3, py - 1.1, px + L * 0.2, py); p.quadraticCurveTo(px + L * 0.6, py + 0.6, px + L, py - 0.2);
      }
      if (calm) continue;
      // блик: короткая вспышка солнца на гребне волны
      const hg = hash(x, y, 1200), k = Math.pow(Math.max(0, Math.sin(T * (0.7 + hg * 0.5) + hg * 40)), 24);
      if (k > 0.1 && o >= 16) {
        const gx = x * TILE + 4 + hash(x, y, 1300) * 24, gy = y * TILE + 4 + hash(x, y, 1400) * 24, L = 1 + 2.2 * k, p = bk(gl, k);
        p.moveTo(gx - L, gy); p.lineTo(gx + L, gy); p.moveTo(gx, gy - L * 0.6); p.lineTo(gx, gy + L * 0.6);
      }
    }
    ctx.save(); ctx.lineCap = 'round';
    strokeBuckets(ctx, rip, '215,236,255', 0.42, 0.7);
    ctx.globalCompositeOperation = 'lighter'; strokeBuckets(ctx, gl, '255,250,225', 0.9, 0.55);
    ctx.restore();
    seaLife(ctx, m, vis, water, op, x0, y0, x1, y1, ts);
  }
  /** Редко (раз в 10–25 с) на глубокой воде в кадре: выпрыгнет рыба или покажется морской змей. */
  function seaLife(ctx, m, vis, water, op, x0, y0, x1, y1, ts) {
    let e = SEA.ev;
    if (e && (e.m !== m || ts > e.t0 + e.dur || ts < e.t0)) e = SEA.ev = null;
    if (!e && ts > SEA.next) {
      SEA.next = ts + 9000 + Math.random() * 15000;
      for (let tries = 0; tries < 24; tries++) {
        const x = x0 + 1 + Math.floor(Math.random() * Math.max(1, x1 - x0 - 1)), y = y0 + 1 + Math.floor(Math.random() * Math.max(1, y1 - y0 - 1)), i = y * m.w + x;
        if (x < 0 || y < 0 || x >= m.w || y >= m.h || m.terrain[i] !== water || op[i] < 25 || vis[i] !== 2) continue;
        const kind = Math.random() < 0.3 ? 'serpent' : 'fish', dir = Math.random() < 0.5 ? -1 : 1;
        e = SEA.ev = { m, kind, dir, x: x * TILE + 16, y: y * TILE + 18, t0: ts, dur: kind === 'fish' ? 1100 : 6500 };
        break;
      }
    }
    if (!e) return;
    const t = (ts - e.t0) / e.dur;
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const ring = (x, y, age, r0) => { if (age < 0 || age > 1) return; ctx.strokeStyle = 'rgba(225,242,255,' + (0.55 * (1 - age)).toFixed(3) + ')'; ctx.lineWidth = 0.7; ctx.beginPath(); ctx.ellipse(x, y, r0 + age * 7, (r0 + age * 7) * 0.4, 0, 0, Math.PI * 2); ctx.stroke(); };
    if (e.kind === 'fish') {
      // прыжок по дуге; всплеск на входе и на выходе
      const air = (t - 0.15) / 0.6, X0 = e.x - e.dir * 7, X1 = e.x + e.dir * 7;
      ring(X0, e.y, t / 0.45, 1.5); ring(X1, e.y, (t - 0.72) / 0.28, 1.5);
      if (air > 0 && air < 1) {
        const x = X0 + (X1 - X0) * air, y = e.y - Math.sin(air * Math.PI) * 11, ang = Math.atan2(-Math.cos(air * Math.PI) * 11 * Math.PI, (X1 - X0));
        ctx.translate(x, y); ctx.rotate(ang + (e.dir < 0 ? Math.PI : 0)); ctx.scale(e.dir < 0 ? -1 : 1, 1);
        const g = ctx.createLinearGradient(0, -1.6, 0, 1.6); g.addColorStop(0, '#6a8aa8'); g.addColorStop(0.5, '#d8e6f0'); g.addColorStop(1, '#f4f8fa');
        ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(3.4, 0); ctx.quadraticCurveTo(1, -1.9, -2.2, -0.4); ctx.lineTo(-4, -1.6); ctx.lineTo(-3.4, 0); ctx.lineTo(-4, 1.6); ctx.lineTo(-2.2, 0.4); ctx.quadraticCurveTo(1, 1.9, 3.4, 0); ctx.fill();
        ctx.strokeStyle = 'rgba(30,50,70,0.6)'; ctx.lineWidth = 0.3; ctx.stroke();
        ctx.fillStyle = '#10202a'; ctx.beginPath(); ctx.arc(2.2, -0.35, 0.35, 0, Math.PI * 2); ctx.fill();
        if (air > 0.1 && air < 0.5) { ctx.fillStyle = 'rgba(230,245,255,0.7)'; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(-4 - i * 1.5, 1 + i * 0.8, 0.35, 0, Math.PI * 2); ctx.fill(); } }
      }
    } else {
      // змей: три горба и хвост встают из воды, медленно проплывают и уходят вглубь
      const up = sstep(0, 0.18, t) * sstep(1, 0.78, t), drift = (t - 0.5) * 14 * e.dir;
      const col = '#2f5a4a', lite = '#6a9a70', belly = '#b8c890';
      const hump = (hx, w, h) => {
        const hh = h * up; if (hh < 0.3) { ring(hx, e.y, 0.3, w * 0.4); return; }
        ctx.fillStyle = 'rgba(10,30,50,0.25)'; ctx.beginPath(); ctx.ellipse(hx, e.y + 0.6, w * 0.62, 1.3, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.moveTo(hx - w / 2, e.y); ctx.bezierCurveTo(hx - w / 2, e.y - hh * 1.3, hx + w / 2, e.y - hh * 1.3, hx + w / 2, e.y); ctx.closePath();
        const g = ctx.createLinearGradient(0, e.y - hh, 0, e.y); g.addColorStop(0, lite); g.addColorStop(0.55, col); g.addColorStop(1, belly);
        ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = 'rgba(12,30,24,0.8)'; ctx.lineWidth = 0.45; ctx.stroke();
        // гребень-плавник по спине
        ctx.fillStyle = '#a84a3a'; ctx.beginPath();
        for (let k = -2; k <= 2; k++) { const sx = hx + k * w * 0.16, sy = e.y - hh * (0.98 - k * k * 0.06); ctx.moveTo(sx - 0.8, sy + 0.4); ctx.lineTo(sx + 0.2 * e.dir, sy - 1.6 * up); ctx.lineTo(sx + 0.9, sy + 0.4); }
        ctx.fill();
        // пена у воды по обе стороны горба
        ctx.strokeStyle = 'rgba(235,248,255,0.8)'; ctx.lineWidth = 0.6;
        ctx.beginPath(); ctx.moveTo(hx - w / 2 - 1.6, e.y + 0.2); ctx.lineTo(hx - w / 2 + 0.8, e.y); ctx.moveTo(hx + w / 2 - 0.8, e.y); ctx.lineTo(hx + w / 2 + 1.6, e.y + 0.2); ctx.stroke();
      };
      const bx = e.x + drift;
      // хвост позади, голова впереди: порядок по направлению
      const tailX = bx - e.dir * 17, headX = bx + e.dir * 15;
      hump(bx - e.dir * 10, 6, 3.4); hump(bx, 7, 4.6); hump(bx + e.dir * 8.5, 5, 2.8);
      // хвост-плавник
      const th = up * 5.5, sw = Math.sin(ts / 260) * 1.2;
      if (th > 0.5) {
        ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(tailX - 1, e.y); ctx.quadraticCurveTo(tailX - e.dir * 1.2, e.y - th * 0.6, tailX - e.dir * (3.2 + sw), e.y - th); ctx.quadraticCurveTo(tailX - e.dir * 0.4, e.y - th * 0.55, tailX + e.dir * (2.6 - sw), e.y - th * 0.9); ctx.quadraticCurveTo(tailX + e.dir * 0.6, e.y - th * 0.3, tailX + 1, e.y); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = 'rgba(12,30,24,0.8)'; ctx.lineWidth = 0.45; ctx.stroke();
      }
      // голова: над водой только глаз и ноздри
      const hh = up * 2.4;
      if (hh > 0.4) {
        ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(headX, e.y - hh * 0.4, 3.2, hh, 0, Math.PI, 0); ctx.fill(); ctx.strokeStyle = 'rgba(12,30,24,0.8)'; ctx.stroke();
        ctx.fillStyle = '#f2d060'; ctx.beginPath(); ctx.arc(headX + e.dir * 0.8, e.y - hh * 0.9, 0.55, 0, Math.PI * 2); ctx.fill();
      }
      ring(bx, e.y + 1, (t * 3) % 1, 6); ring(bx - e.dir * 8, e.y + 1, (t * 3 + 0.5) % 1, 5);
    }
    ctx.restore();
  }

  /* ---------- след героя ---------- */
  const TR = { marks: [], puffs: [], wake: [], last: null };
  /** Скакуны с когтистой лапой оставляют не подковы, а три точки когтей. */
  const CLAW = /^hero_(beastmaster|witch|swarmlord|pheromancer)$/;
  /**
   * Вызывать каждый кадр для движущегося героя: x, y — точка у копыт (пикс. карты).
   * info: { terrain, shore (знаковое расст. до воды), boat, dir: [dx,dy], cls, z }
   */
  function follow(id, x, y, ts, info) {
    const L = TR.last;
    if (!L || L.id !== id || L.z !== info.z || Math.hypot(x - L.x, y - L.y) > 80) { TR.last = { id, x, y, t: ts, z: info.z, dist: 0, n: 0 }; return; }
    const d = Math.hypot(x - L.x, y - L.y); if (d < 0.5) return;
    const dx = (x - L.x) / d, dy = (y - L.y) / d, X0 = L.x, Y0 = L.y, T0 = L.t;
    L.x = x; L.y = y; L.t = ts;
    // точки следа — через равные промежутки пути, даже если кадр был длинным
    const SP = info.boat ? 2.5 : 5;
    let s = SP - L.dist;
    for (; s <= d; s += SP) emit(X0 + dx * s, Y0 + dy * s, T0 + (ts - T0) * (s / d), dx, dy, info, L);
    L.dist = d - (s - SP);
    if (TR.puffs.length > 140) TR.puffs.splice(0, TR.puffs.length - 140);
  }
  function emit(x, y, ts, dx, dy, info, L) {
    if (info.boat) {
      TR.wake.push({ x: x - dx * 9, y: y - dy * 4, nx: -dy, ny: dx, t: ts, z: info.z });
      if (TR.wake.length > 200) TR.wake.shift();
      return;
    }
    L.n++;
    const t = info.terrain, side = L.n % 2 ? 1 : -1, fx = -dx, fy = -dy, px = -dy, py = dx, rnd = Math.random;
    if (t === 'snow') {
      // отпечатки двумя дорожками (левые и правые копыта); держатся долго и медленно тают
      TR.marks.push({ x: x + fx * 6 + px * side * 2.4, y: y + fy * 3 + py * side * 1.5 + 0.5, a: Math.atan2(dy, dx), t: ts, life: 28000, claw: CLAW.test(info.cls), z: info.z });
      if (TR.marks.length > 400) TR.marks.splice(0, TR.marks.length - 400);
      TR.puffs.push({ kind: 'puff', col: '250,252,255', x: x + fx * 7 + (rnd() - 0.5) * 4, y: y - 1, vx: fx * 10 + (rnd() - 0.5) * 8, vy: -8 - rnd() * 6, r: 1.4, g: 1.6, t: ts, life: 650, a: 0.75, z: info.z });
    } else if (t === 'swamp' || info.shore > -8) {
      // брызги: веер капель из-под копыт и короткий круг по воде
      if (L.n % 4 === 0) TR.puffs.push({ kind: 'ring', x: x + fx * 5 + px * side * 2, y: y + 0.5, r: 1.2, t: ts, life: 480, z: info.z });
      for (let k = 0; k < 3; k++) TR.puffs.push({ kind: 'drop', x: x + fx * 5 + (rnd() - 0.5) * 5, y: y - 0.5, vx: fx * 16 + (rnd() - 0.5) * 26, vy: -26 - rnd() * 18, r: 0.5 + rnd() * 0.35, t: ts, life: 420, z: info.z, swamp: t === 'swamp' });
    } else if (t !== 'water' && t !== 'grass') {
      // пыль из-под задних и передних копыт; на траве пыли нет
      // цвет пыли чуть темнее светлой земли и светлее тёмной — иначе клуб сливается с фоном
      const col = { sand: '190,152,92', dirt: '196,168,128', rough: '206,190,156', lava: '70,62,62', subter: '160,150,150' }[t] || '190,165,125';
      const a = t === 'sand' ? 0.62 : 0.66;
      for (const off of [-8, 6]) TR.puffs.push({ kind: 'puff', col, x: x + dx * off + (rnd() - 0.5) * 3, y: y - 1, vx: fx * (6 + rnd() * 6) + (rnd() - 0.5) * 4, vy: -7 - rnd() * 6, r: 2 + rnd() * 1, g: 2.6, t: ts, life: 900 + rnd() * 500, a, z: info.z });
    }
  }
  /** Новая партия: следы и гости прежней карты не нужны. */
  function reset() { TR.marks.length = 0; TR.puffs.length = 0; TR.wake.length = 0; TR.last = null; SEA.ev = null; }
  /** Мягкий клуб: радиальный градиент одного цвета, рисуется один раз на цвет. */
  const puffCache = {};
  function puffSprite(col) {
    let cv = puffCache[col]; if (cv) return cv;
    cv = document.createElement('canvas'); cv.width = cv.height = 32;
    const c = cv.getContext('2d'), g = c.createRadialGradient(16, 16, 0, 16, 16, 16);
    g.addColorStop(0, 'rgba(' + col + ',1)'); g.addColorStop(0.45, 'rgba(' + col + ',0.6)'); g.addColorStop(1, 'rgba(' + col + ',0)');
    c.fillStyle = g; c.fillRect(0, 0, 32, 32);
    return (puffCache[col] = cv);
  }
  /** Следы на земле и кильватер — под объектами. */
  function drawGround(ctx, ts, z, x0, y0, x1, y1) {
    const X0 = x0 * TILE - 20, Y0 = y0 * TILE - 20, X1 = (x1 + 1) * TILE + 20, Y1 = (y1 + 1) * TILE + 20;
    if (TR.marks.length) {
      TR.marks = TR.marks.filter(m => ts - m.t < m.life && ts >= m.t);
      const pr = buckets(), rim = buckets();
      for (const m of TR.marks) {
        if (m.z !== z || m.x < X0 || m.x > X1 || m.y < Y0 || m.y > Y1) continue;
        // тает: сначала бледнеет кромка, затем мельчает и растворяется сама ямка
        const age = (ts - m.t) / m.life, a = 1 - sstep(0.3, 1, age), s = 1 - age * 0.4, p = bk(pr, a), q = bk(rim, a * (1 - age));
        const c = Math.cos(m.a), si = Math.sin(m.a);
        if (m.claw) for (let k = -1; k <= 1; k++) { const ox = c * 1.1 - si * k * 0.9, oy = (si * 1.1 + c * k * 0.9) * 0.6; p.moveTo(m.x + ox + 0.4 * s, m.y + oy); p.ellipse(m.x + ox, m.y + oy, 0.4 * s, 0.3 * s, 0, 0, Math.PI * 2); }
        else {
          // подкова: ямка с тенью у дальнего края и светлым отвалом снега у ближнего
          p.moveTo(m.x + 1.1 * s, m.y); p.ellipse(m.x, m.y, 1.1 * s, 0.75 * s, m.a, 0, Math.PI * 2);
          q.moveTo(m.x + 1.2 * s, m.y + 0.45); q.ellipse(m.x, m.y + 0.45, 1.2 * s, 0.45 * s, m.a, 0, Math.PI);
        }
      }
      ctx.save(); fillBuckets(ctx, pr, '92,118,160', 0.42); fillBuckets(ctx, rim, '255,255,255', 0.7); ctx.restore();
    }
    if (TR.wake.length) {
      TR.wake = TR.wake.filter(w => ts - w.t < 2600 && ts >= w.t);
      const wl = buckets(), core = buckets();
      // клин Кельвина: ширина растёт с удалением от кормы (~0.35 пути) и со временем — волна расходится
      let prev = null, back = 0;
      for (let i = TR.wake.length - 1; i >= 0; i--) {
        const w = TR.wake[i];
        if (w.z !== z) { prev = null; continue; }
        if (prev) { const g = Math.hypot(w.x - prev.w.x, w.y - prev.w.y); if (g > 8) { prev = null; back = 0; } else back += g; }
        const age = (ts - w.t) / 2600, spread = 1.2 + back * 0.32 + age * 5 + Math.sin(back * 0.45 - ts / 160) * 0.5 * Math.min(1, back / 12), a = Math.pow(1 - age, 1.3) * Math.max(0, 1 - back / 110);
        const L = [w.x + w.nx * spread, w.y + w.ny * spread * 0.7], R = [w.x - w.nx * spread, w.y - w.ny * spread * 0.7];
        if (prev && a > 0.02) {
          const p = bk(wl, a); p.moveTo(prev.L[0], prev.L[1]); p.lineTo(L[0], L[1]); p.moveTo(prev.R[0], prev.R[1]); p.lineTo(R[0], R[1]);
          if (back < 30) { const q = bk(core, a * (1 - back / 30)); q.moveTo(prev.w.x, prev.w.y); q.lineTo(w.x, w.y); }
        }
        prev = { w, L, R };
      }
      ctx.save(); ctx.lineCap = 'butt';
      strokeBuckets(ctx, core, '205,232,248', 0.3, 2.2);   // взбитая вода прямо за кормой
      ctx.lineCap = 'round'; strokeBuckets(ctx, wl, '236,248,255', 0.65, 0.6);   // расходящиеся усы
      ctx.restore();
    }
  }
  /** Пыль и брызги — поверх героев (их поднимают копыта). */
  function drawAir(ctx, ts, z) {
    if (!TR.puffs.length) return;
    TR.puffs = TR.puffs.filter(p => ts - p.t < p.life && ts >= p.t);
    ctx.save();
    for (const p of TR.puffs) {
      if (p.z !== z) continue;
      const k = (ts - p.t) / p.life, s = (ts - p.t) / 1000;
      if (p.kind === 'puff') {
        const r = p.r * (1 + k * p.g), a = p.a * (1 - k) * (1 - k * 0.5);
        ctx.globalAlpha = a; ctx.drawImage(puffSprite(p.col), p.x + p.vx * s - r * 1.3, p.y + p.vy * s - r, r * 2.6, r * 2);
      } else if (p.kind === 'ring') {
        ctx.globalAlpha = 1; const r = p.r + k * 4.5; ctx.strokeStyle = 'rgba(210,235,245,' + (0.7 * (1 - k)).toFixed(3) + ')'; ctx.lineWidth = 0.6;
        ctx.beginPath(); ctx.ellipse(p.x, p.y, r, r * 0.4, 0, 0, Math.PI * 2); ctx.stroke();
      } else {
        ctx.globalAlpha = 1; const x = p.x + p.vx * s, y = p.y + p.vy * s + 150 * s * s;
        ctx.fillStyle = p.swamp ? 'rgba(150,180,150,' + (0.85 * (1 - k)).toFixed(3) + ')' : 'rgba(215,238,250,' + (0.9 * (1 - k)).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(x, y, p.r, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.restore();
  }

  /* ---------- неразведанное как старая карта ---------- */
  // бесшовный шум с периодом P (для текстуры-плитки)
  function vnoiseP(x, y, s, P, Py) {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const Q = Py || P, w = a => ((a % P) + P) % P, wy = a => ((a % Q) + Q) % Q;
    const a = hash(w(xi), wy(yi), s), b = hash(w(xi + 1), wy(yi), s), c = hash(w(xi), wy(yi + 1), s), d = hash(w(xi + 1), wy(yi + 1), s);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  }
  const TEX_MAP = 192, TEX_RS = 2;   // плитка фактуры: 192 пикс. карты, двойная плотность
  const texCache = {};
  /** Плитка фактуры: 'paper' — пергамент, 'stone' — тёмный камень подземелья. */
  function texture(kind) {
    if (texCache[kind]) return texCache[kind];
    const S = TEX_MAP * TEX_RS, cv = document.createElement('canvas'); cv.width = S; cv.height = S;
    const c = cv.getContext('2d'), img = c.createImageData(S, S), d = img.data, stone = kind === 'stone';
    const base = stone ? [46, 42, 50] : [232, 214, 170], dark = stone ? [26, 24, 30] : [206, 178, 128], lite = stone ? [66, 62, 72] : [246, 234, 200];
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      let n = 0, amp = 0.5, tot = 0;
      for (let o = 0; o < 4; o++) { const P = 3 << o; n += amp * vnoiseP(x / S * P, y / S * P, 31 + o * 7 + (stone ? 100 : 0), P); tot += amp; amp *= 0.5; }
      n /= tot;
      const g = hash(x, y, stone ? 5 : 6);
      let col = n < 0.5 ? mix(dark, base, sstep(0.18, 0.5, n)) : mix(base, lite, sstep(0.5, 0.85, n));
      // волокна бумаги / зерно камня
      const fib = stone ? (g - 0.5) * 18 : (vnoiseP(x / S * 96, y / S * 12, 77, 96, 12) - 0.5) * 10 + (g - 0.5) * 7;
      const k = (y * S + x) * 4; d[k] = col[0] + fib; d[k + 1] = col[1] + fib; d[k + 2] = col[2] + fib * (stone ? 1.1 : 0.8); d[k + 3] = 255;
    }
    c.putImageData(img, 0, 0);
    c.setTransform(TEX_RS, 0, 0, TEX_RS, 0, 0); c.lineCap = 'round';
    const rnd = rngOf(stone ? 991 : 177), wrap = fn => { for (const ox of [-TEX_MAP, 0, TEX_MAP]) for (const oy of [-TEX_MAP, 0, TEX_MAP]) { c.save(); c.translate(ox, oy); fn(); c.restore(); } };
    if (stone) {
      // трещины с тёмной щелью и светлой кромкой, светлые вкрапления
      for (let i = 0; i < 26; i++) {
        let x = rnd() * TEX_MAP, y = rnd() * TEX_MAP; const pts = [[x, y]]; let a = rnd() * Math.PI * 2;
        for (let k = 0; k < 5; k++) { a += (rnd() - 0.5) * 1.2; x += Math.cos(a) * (3 + rnd() * 6); y += Math.sin(a) * (3 + rnd() * 6); pts.push([x, y]); }
        wrap(() => { c.beginPath(); pts.forEach((p, j) => j ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.strokeStyle = 'rgba(12,10,16,0.55)'; c.lineWidth = 0.6; c.stroke(); c.translate(0.4, 0.5); c.strokeStyle = 'rgba(140,134,150,0.22)'; c.lineWidth = 0.4; c.stroke(); });
      }
      for (let i = 0; i < 120; i++) { const x = rnd() * TEX_MAP, y = rnd() * TEX_MAP, r = 0.25 + rnd() * 0.5; c.fillStyle = rnd() < 0.15 ? 'rgba(150,120,200,0.35)' : 'rgba(190,188,205,0.3)'; wrap(() => { c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill(); }); }
    } else {
      // пятна-«лисьи» подпалины и тонкие волокна
      for (let i = 0; i < 14; i++) {
        const x = rnd() * TEX_MAP, y = rnd() * TEX_MAP, r = 1.5 + rnd() * 6;
        wrap(() => { const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(150,100,50,' + (0.08 + rnd() * 0.1).toFixed(2) + ')'); g.addColorStop(1, 'rgba(150,100,50,0)'); c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2); });
      }
      for (let i = 0; i < 220; i++) {
        const x = rnd() * TEX_MAP, y = rnd() * TEX_MAP, a = rnd() * Math.PI, L = 2 + rnd() * 7, b = (rnd() - 0.5) * 2;
        const col = rnd() < 0.55 ? 'rgba(140,110,70,0.13)' : 'rgba(255,252,238,0.22)';
        wrap(() => { c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + Math.cos(a) * L / 2 + b, y + Math.sin(a) * L / 2 - b, x + Math.cos(a) * L, y + Math.sin(a) * L); c.strokeStyle = col; c.lineWidth = 0.35; c.stroke(); });
      }
    }
    return (texCache[kind] = cv);
  }
  /* Значки на неразведанном: рисуются тушью в пикселях карты вокруг (0,0). */
  const ICONS = {
    compass(c, r) {
      c.lineWidth = 0.7; c.beginPath(); c.arc(0, 0, r, 0, Math.PI * 2); c.stroke();
      c.lineWidth = 0.4; c.beginPath(); c.arc(0, 0, r * 0.82, 0, Math.PI * 2); c.stroke();
      c.beginPath(); for (let i = 0; i < 32; i++) { const a = i / 32 * Math.PI * 2, r0 = i % 4 ? r * 0.9 : r * 0.82; c.moveTo(Math.cos(a) * r0, Math.sin(a) * r0); c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.stroke();
      const ray = (a, L, w) => {
        const tip = [Math.cos(a) * L, Math.sin(a) * L], l = [Math.cos(a - Math.PI / 2) * w, Math.sin(a - Math.PI / 2) * w], rr = [-l[0], -l[1]];
        c.beginPath(); c.moveTo(0, 0); c.lineTo(l[0], l[1]); c.lineTo(tip[0], tip[1]); c.closePath(); c.fill();
        c.beginPath(); c.moveTo(0, 0); c.lineTo(rr[0], rr[1]); c.lineTo(tip[0], tip[1]); c.closePath(); c.stroke();
      };
      c.lineWidth = 0.5;
      for (let i = 0; i < 4; i++) ray(Math.PI / 4 + i * Math.PI / 2, r * 0.62, r * 0.12);
      for (let i = 0; i < 4; i++) ray(-Math.PI / 2 + i * Math.PI / 2, r * 1.22, r * 0.17);
      // север — лилия-наконечник
      c.beginPath(); c.moveTo(0, -r * 1.22 - 1); c.quadraticCurveTo(-3, -r * 1.22 - 4, 0, -r * 1.22 - 7); c.quadraticCurveTo(3, -r * 1.22 - 4, 0, -r * 1.22 - 1); c.fill();
      c.beginPath(); c.arc(0, 0, 1.2, 0, Math.PI * 2); c.fill();
    },
    waves(c) {
      c.lineWidth = 0.8;
      for (let row = 0; row < 3; row++) for (let k = 0; k < 3 - (row === 1 ? 1 : 0); k++) {
        const x = -14 + k * 11 + (row === 1 ? 5.5 : 0), y = -8 + row * 8;
        c.beginPath(); c.moveTo(x - 5, y + 1.5); c.quadraticCurveTo(x - 2.5, y - 2.5, x, y - 1.8); c.quadraticCurveTo(x + 2.5, y - 1, x + 1.5, y + 0.6); c.quadraticCurveTo(x + 0.2, y + 1, x + 0.8, y - 0.4);
        c.moveTo(x, y - 1.8); c.quadraticCurveTo(x + 3, y - 2.6, x + 5, y + 1.5); c.stroke();
      }
    },
    mountains(c) {
      const peak = (x, y, h, w) => {
        c.lineWidth = 0.75; c.beginPath(); c.moveTo(x - w, y); c.lineTo(x - w * 0.15, y - h); c.lineTo(x + w, y); c.stroke();
        c.lineWidth = 0.4; c.beginPath(); for (let i = 1; i <= 5; i++) { const t = i / 6, px = x - w * 0.15 + (w * 1.15) * t, py = y - h + h * t; c.moveTo(px, py); c.lineTo(px - w * 0.18, py + h * 0.28 * (1 - t) + 1.5); } c.stroke();
        c.lineWidth = 0.5; c.beginPath(); c.moveTo(x - w * 0.15 - w * 0.25, y - h * 0.62); c.lineTo(x - w * 0.15, y - h * 0.48); c.lineTo(x - w * 0.15 + w * 0.3, y - h * 0.66); c.stroke();
      };
      peak(-9, 6, 13, 9); peak(9, 7, 10, 8); peak(0, 4, 17, 10);
    },
    trees(c) {
      c.lineWidth = 0.6;
      for (const [x, y, s] of [[-10, 4, 1], [0, 1, 1.25], [10, 5, 0.95], [-4, 9, 0.85], [6, 10, 0.8]]) {
        c.beginPath(); c.moveTo(x, y + 3 * s); c.lineTo(x, y - 2 * s); c.stroke();
        c.beginPath(); c.moveTo(x - 4 * s, y); c.quadraticCurveTo(x - 4.5 * s, y - 8 * s, x, y - 9 * s); c.quadraticCurveTo(x + 4.5 * s, y - 8 * s, x + 4 * s, y); c.closePath(); c.stroke();
        c.lineWidth = 0.35; c.beginPath(); for (let i = 0; i < 3; i++) { c.moveTo(x + 0.8 * s, y - 1.5 * s - i * 2 * s); c.lineTo(x + 3.2 * s, y - 2.8 * s - i * 2 * s); } c.stroke(); c.lineWidth = 0.6;
      }
    },
    rune(c) {
      c.lineWidth = 0.7; c.beginPath(); c.arc(0, 0, 9, 0, Math.PI * 2); c.stroke();
      c.beginPath(); c.moveTo(0, -6); c.lineTo(0, 6); c.moveTo(0, -6); c.lineTo(4, -2); c.moveTo(0, 0); c.lineTo(-4, 3); c.moveTo(-3, -5); c.lineTo(3, 5); c.stroke();
      c.lineWidth = 0.4; c.beginPath(); for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; c.moveTo(Math.cos(a) * 10.5, Math.sin(a) * 10.5); c.lineTo(Math.cos(a) * 12.5, Math.sin(a) * 12.5); } c.stroke();
    },
    crystal(c) {
      c.lineWidth = 0.6;
      for (const [x, h, w] of [[-5, 12, 3], [2, 17, 4], [8, 10, 2.6]]) { c.beginPath(); c.moveTo(x - w, 6); c.lineTo(x - w, 6 - h * 0.7); c.lineTo(x, 6 - h); c.lineTo(x + w, 6 - h * 0.7); c.lineTo(x + w, 6); c.moveTo(x, 6 - h); c.lineTo(x, 6); c.stroke(); }
      c.beginPath(); c.moveTo(-12, 6); c.lineTo(14, 6); c.stroke();
    },
  };
  /**
   * Слой «неизведанного» для прямоугольника клеток [rx0..rx1]×[ry0..ry1]: холст в sc пикс.
   * на пиксель карты. Бумага (или камень) с фактурой, обожжённая кромка, значки тушью.
   * vis — видимость (0 — не открыто). Строится при смене области/видимости, не каждый кадр.
   */
  function fogLayer(vis, m, z, rx0, ry0, rx1, ry1, sc, prev) {
    const S8 = 8, S4 = 4, tw = rx1 - rx0 + 1, th = ry1 - ry0 + 1, w = tw * S8, h = th * S8, w4 = tw * S4, h4 = th * S4, stone = !!z;
    // 1) поле «неизведанности» по 4 точки на клетку (с тем же сдвигом кромки, что у тумана), размытое;
    //    там же — крупные разводы бумаги. Всё мелкое досчитывается ниже, в 8 точках на клетку.
    const a = new Float32Array(w4 * h4), b = new Float32Array(w4 * h4), stain = new Float32Array(w4 * h4);
    // сдвиг кромки и разводы — плавные, поэтому считаются реже (по 2 и по 1 точке на клетку) и интерполируются
    const w2 = tw * 2 + 2, h2 = th * 2 + 2, wpx = new Float32Array(w2 * h2), wpy = new Float32Array(w2 * h2);
    for (let y = 0; y < h2; y++) for (let x = 0; x < w2; x++) {
      const qx = rx0 * TILE + x * 16, qy = ry0 * TILE + y * 16;
      wpx[y * w2 + x] = (vnoise(qx / 22, qy / 22, 77) * 2 - 1) * 12; wpy[y * w2 + x] = (vnoise(qx / 22 + 40, qy / 22, 78) * 2 - 1) * 12;
    }
    const w1 = tw + 2, h1 = th + 2, st1 = new Float32Array(w1 * h1);
    for (let y = 0; y < h1; y++) for (let x = 0; x < w1; x++) { const qx = (rx0 + x) * TILE, qy = (ry0 + y) * TILE; st1[y * w1 + x] = sstep(0.45, 0.9, vnoise(qx / 150, qy / 150, 403)) * 0.8 + sstep(0.6, 0.95, vnoise(qx / 40, qy / 40, 404)) * 0.35; }
    const bil = (F, W, fx, fy) => { const ix = fx | 0, iy = fy | 0, u = fx - ix, v = fy - iy, i = iy * W + ix; return (F[i] * (1 - u) + F[i + 1] * u) * (1 - v) + (F[i + W] * (1 - u) + F[i + W + 1] * u) * v; };
    for (let y = 0; y < h4; y++) for (let x = 0; x < w4; x++) {
      const qx = rx0 * TILE + (x + 0.5) * TILE / S4, qy = ry0 * TILE + (y + 0.5) * TILE / S4, gx = (x + 0.5) / 2, gy = (y + 0.5) / 2;
      const px = qx + bil(wpx, w2, gx, gy), py = qy + bil(wpy, w2, gx, gy);
      const mx = Math.floor(px / TILE), my = Math.floor(py / TILE), i = y * w4 + x;
      a[i] = (mx < 0 || my < 0 || mx >= m.w || my >= m.h) ? 1 : vis[my * m.w + mx] ? 0 : 1;
      stain[i] = bil(st1, w1, (x + 0.5) / 4, (y + 0.5) / 4);
    }
    const R = 2, blur = (src, dst, dx, dy) => { for (let y = 0; y < h4; y++) for (let x = 0; x < w4; x++) { let s = 0, c = 0; for (let k = -R; k <= R; k++) { const xx = x + k * dx, yy = y + k * dy; if (xx < 0 || yy < 0 || xx >= w4 || yy >= h4) continue; s += src[yy * w4 + xx]; c++; } dst[y * w4 + x] = s / c; } };
    blur(a, b, 1, 0); blur(b, a, 0, 1); blur(a, b, 1, 0); blur(b, a, 0, 1);
    const samp = (F, x, y) => {   // билинейно из сетки S4 в точку сетки S8
      const fx = Math.max(0, Math.min(w4 - 1.001, (x + 0.5) / 2 - 0.5)), fy = Math.max(0, Math.min(h4 - 1.001, (y + 0.5) / 2 - 0.5));
      const ix = fx | 0, iy = fy | 0, u = fx - ix, v = fy - iy, i = iy * w4 + ix;
      return (F[i] * (1 - u) + F[i + 1] * u) * (1 - v) + (F[i + w4] * (1 - u) + F[i + w4 + 1] * u) * v;
    };
    // 2) маска (рваная кромка) и тон (обгоревший край, пятна) — две маленькие картинки
    const mk = document.createElement('canvas'); mk.width = w; mk.height = h;
    const tn = document.createElement('canvas'); tn.width = w; tn.height = h;
    const mi = mk.getContext('2d').createImageData(w, h), ti = tn.getContext('2d').createImageData(w, h), md = mi.data, td = ti.data;
    const B = stone ? [235, 232, 240, 120, 112, 128, 26, 22, 30] : [228, 196, 150, 150, 92, 44, 48, 26, 14], ST = stone ? [205, 200, 212] : [232, 214, 188];
    const burnTop = stone ? 0.72 : 0.8;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = y * w + x, k4 = i * 4, f0 = samp(a, x, y);
      if (f0 < 0.25) { td[k4] = td[k4 + 1] = td[k4 + 2] = 255; td[k4 + 3] = 255; continue; }   // открыто и далеко от края
      const wx = rx0 * TILE + (x + 0.5) * TILE / S8, wy = ry0 * TILE + (y + 0.5) * TILE / S8;
      // рваный край: мелкий шум по кромке
      const f = f0 < 0.97 ? f0 + (vnoise(wx / 9, wy / 9, 401) - 0.5) * 0.22 + (vnoise(wx / 3.5, wy / 3.5, 402) - 0.5) * 0.1 : f0;
      md[k4 + 3] = 255 * sstep(0.44, 0.52, f);
      // крупные разводы — плитка фактуры не читается; обгоревшая кромка — чем ближе к краю бумаги, тем темнее
      const sk = samp(stain, x, y);
      let r = 255 + (ST[0] - 255) * sk, g = 255 + (ST[1] - 255) * sk, bl = 255 + (ST[2] - 255) * sk;
      const burn = 1 - sstep(0.5, burnTop, f);
      if (burn > 0) {
        let o, q, t;
        if (burn < 0.45) { t = burn / 0.45; r += (B[0] - r) * t; g += (B[1] - g) * t; bl += (B[2] - bl) * t; }
        else { if (burn < 0.8) { o = 0; q = 3; t = (burn - 0.45) / 0.35; } else { o = 3; q = 6; t = (burn - 0.8) / 0.2; } r = B[o] + (B[q] - B[o]) * t; g = B[o + 1] + (B[q + 1] - B[o + 1]) * t; bl = B[o + 2] + (B[q + 2] - B[o + 2]) * t; }
      }
      td[k4] = r; td[k4 + 1] = g; td[k4 + 2] = bl; td[k4 + 3] = 255;
    }
    mk.getContext('2d').putImageData(mi, 0, 0); tn.getContext('2d').putImageData(ti, 0, 0);
    // 3) сборка в пикселях карты × sc
    const X0 = rx0 * TILE, Y0 = ry0 * TILE, WM = tw * TILE, HM = th * TILE;
    const cv = prev && prev.width === Math.round(WM * sc) && prev.height === Math.round(HM * sc) ? prev : document.createElement('canvas');
    cv.width = Math.round(WM * sc); cv.height = Math.round(HM * sc);
    const c = cv.getContext('2d');
    c.setTransform(sc, 0, 0, sc, -X0 * sc, -Y0 * sc); c.imageSmoothingEnabled = true;
    const tex = texture(stone ? 'stone' : 'paper');
    for (let ty = Math.floor(Y0 / TEX_MAP) * TEX_MAP; ty < Y0 + HM; ty += TEX_MAP) for (let tx = Math.floor(X0 / TEX_MAP) * TEX_MAP; tx < X0 + WM; tx += TEX_MAP) c.drawImage(tex, tx, ty, TEX_MAP, TEX_MAP);
    // значки: по одному на квадрат 7×7 клеток, только там, где вокруг всё неизведанно
    const G = 7, ink = stone ? 'rgba(178,170,200,0.5)' : 'rgba(78,48,24,0.62)';
    c.strokeStyle = ink; c.fillStyle = ink; c.lineCap = 'round'; c.lineJoin = 'round';
    const kinds = stone ? ['rune', 'crystal', 'rune'] : ['waves', 'mountains', 'trees', 'waves', 'mountains', 'compass'];
    for (let gy = Math.floor((ry0 - 2) / G); gy <= Math.floor((ry1 + 2) / G); gy++) for (let gx = Math.floor((rx0 - 2) / G); gx <= Math.floor((rx1 + 2) / G); gx++) {
      const h1 = hash(gx, gy, 700 + z); if (h1 > 0.55) continue;
      const cx = gx * G + 1 + Math.floor(hash(gx, gy, 701) * (G - 2)), cy = gy * G + 1 + Math.floor(hash(gx, gy, 702) * (G - 2));
      const kind = kinds[Math.floor(hash(gx, gy, 703) * kinds.length)], r = kind === 'compass' ? 2 : 1;
      let clear = true;
      for (let y = cy - r; y <= cy + r && clear; y++) for (let x = cx - r; x <= cx + r; x++) { if (x < 0 || y < 0 || x >= m.w || y >= m.h) continue; if (vis[y * m.w + x]) { clear = false; break; } }
      if (!clear) continue;
      c.save(); c.translate(cx * TILE + 16, cy * TILE + 16); c.rotate((hash(gx, gy, 704) - 0.5) * 0.25);
      if (stone) {   // под землёй значки процарапаны: тёмная борозда и светлая кромка
        c.save(); c.translate(0.5, 0.6); c.strokeStyle = c.fillStyle = 'rgba(0,0,0,0.55)'; ICONS[kind](c, 16); c.restore();
      }
      ICONS[kind](c, 16);
      c.restore();
    }
    // тон: подпалины и крупные разводы; маска: рваный край
    c.globalCompositeOperation = 'multiply'; c.drawImage(tn, X0, Y0, WM, HM);
    c.globalCompositeOperation = 'destination-in'; c.drawImage(mk, X0, Y0, WM, HM);
    c.globalCompositeOperation = 'source-over'; c.setTransform(1, 0, 0, 1, 0, 0);
    return cv;
  }

  H3.MapPaint = { create, PAL, CH, warp, Live: { drawSurf, drawWater, follow, drawGround, drawAir, fogLayer, texture, TR, SEA, reset } };
})(typeof window !== 'undefined' ? window : globalThis);
