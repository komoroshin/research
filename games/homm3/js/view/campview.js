/* ============================================================================
   view/campview.js — экраны кампаний «Хроник»: обложки кампаний, нарисованная
   карта кампании с дорогой через сценарии, брифинг перед картой (реплики героев
   и выбор бонуса), письма сюжетных событий в партии и реплики после победы.

   Картины собраны из того, что уже умеет игра: пейзаж обложки — открытка недели
   H3.Scenes.week (обрезанная полосой), тона карты — H3.Scenes.LAND по земле фракции,
   портреты и иконки — H3.Sprites / H3.UI. Своего движка здесь нет.

   H3.CampView = {
     factionOf(camp), heroOf(camp) — главная фракция и главный герой кампании (с запасными вариантами),
     coverHtml(camp, label), mountCovers(root) — обложки списка, рисуются лениво по одной,
     mountMap(host, camp, progress, { sel, color, onPick }) → { select(i) } — карта кампании,
     scenarioCardHtml(camp, i, progress) — карточка выбранного сценария,
     briefing({ camp, sc, idx, heroCls, color }) → Promise<{ bonusPick } | null> — брифинг перед стартом,
     linesHtml(lines), outroHtml(camp, sc, last) — реплики (после победы — outro и эпилог),
     showQueue(state) → Promise<число показанных> — письма из state.storyQueue,
     rewardText(r, faction), rewardIcon(r, faction), goalLines(sc)
   }
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});
  const UI = () => H3.UI, Sp = () => H3.Sprites;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function hashStr(s) { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rngOf(seed) { let a = (seed >>> 0) || 1; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function rgbOf(c) { c = String(c || '#000').replace('#', ''); if (c.length === 3) c = c.replace(/./g, x => x + x); const n = parseInt(c, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  const mix = (a, b, t) => { const x = rgbOf(a), y = rgbOf(b); return '#' + x.map((v, i) => clamp(Math.round(v + (y[i] - v) * t), 0, 255).toString(16).padStart(2, '0')).join(''); };
  const rgba = (c, a) => { const [r, g, b] = rgbOf(c); return 'rgba(' + r + ',' + g + ',' + b + ',' + clamp(a, 0, 1).toFixed(3) + ')'; };
  const DPR = () => Math.min(2, Math.max(1, root.devicePixelRatio || 1));
  const has = name => { const S = Sp(); return !!(S && (S.has(name) || (H3.Vec && H3.Vec.has(name)))); };
  const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  const PLAYER = () => (H3.Factions && H3.Factions.PLAYER_COLORS && H3.Factions.PLAYER_COLORS[0]) || '#d23b2a';

  /* ---------- кампания: фракция, герой, земля ---------- */
  function factionOf(camp) { return (camp && (camp.faction || (camp.scenarios[0] || {}).faction)) || 'castle'; }
  function heroOf(camp) {
    if (!camp) return null;
    const id = camp.hero || (camp.scenarios.find(sc => sc.hero) || {}).hero;
    return id && H3.Heroes ? H3.Heroes.get(id) || null : null;
  }
  const portraitOf = t => t ? 'portrait_' + t.cls + '_' + t.portrait : null;
  function landOf(fid) {
    const Sc = H3.Scenes, f = H3.Factions && H3.Factions.get(fid);
    const L = Sc && Sc.LAND ? Sc.LAND[(f && f.terrain) || 'grass'] || Sc.LAND.grass : null;
    return L || { far: '#5e8a5a', mid: '#4e7a38', near: '#3e6a28', lit: '#a8d068', dark: '#1c3414', path: '#c8aa70' };
  }
  const terrainOf = fid => { const f = H3.Factions && H3.Factions.get(fid); return (f && f.terrain) || 'grass'; };

  /** Кто говорит: герой из H3.Heroes (портрет, имя, класс) или летописец. */
  function speaker(who) {
    const t = who && who !== 'narrator' && H3.Heroes ? H3.Heroes.get(who) : null;
    if (!t) return { narr: true, name: 'Летописец' };
    const cl = H3.Heroes.getClass(t.cls);
    return { id: who, name: t.name, sub: cl ? cl.name : '', portrait: portraitOf(t), faction: cl && cl.faction };
  }
  function portraitHtml(sp, scale) {
    if (!sp.portrait || !has(sp.portrait)) return '<span class="clnoport"></span>';
    try { return UI().heroPortrait({ id: 'cv_' + sp.id, portrait: sp.portrait }, scale || 3); } catch (e) { return UI().icon(sp.portrait, scale || 3); }
  }

  /* ---------- награды и цели ---------- */
  const KIND_NAME = { gold: 'Казна', res: 'Ресурсы', creatures: 'Войско', artifact: 'Артефакт', spell: 'Заклинание', primary: 'Навык героя', xp: 'Опыт', building: 'Постройка' };
  function rewardText(r, faction) {
    if (!r) return '';
    try { if (H3.Campaign && H3.Campaign.rewardText) return H3.Campaign.rewardText(r, faction); } catch (e) { console.error(e); }
    if (r.kind === 'building') {
      const b = H3.Buildings && H3.Buildings.get(faction || 'castle', r.building);
      return 'постройка «' + ((b && b.name) || r.building) + '»';
    }
    if (H3.Quest && H3.Quest.rewardText) { const t = H3.Quest.rewardText(r); if (t && t !== r.kind) return t; }
    return JSON.stringify(r);
  }
  function rewardIcon(r, faction) {
    if (!r) return null;
    const pick = (...names) => names.find(n => n && has(n)) || null;
    switch (r.kind) {
      case 'gold': return pick('res_gold', 'ic_gold');
      case 'res': return pick('res_' + r.res, 'ic_' + r.res);
      case 'creatures': return pick(r.cid);
      case 'artifact': return pick('art_' + r.art);
      case 'spell': return pick('sp_' + r.spell, 'ic_spellbook');
      case 'primary': return pick('ic_' + r.stat);
      case 'xp': return pick('ic_xp');
      case 'building': return pick('town_' + (faction || 'castle'), 'ic_town');
    }
    return null;
  }
  /** Карточка бонуса: крупное название (без повтора вида — он подписан сверху) и строка пояснения. */
  function rewardCard(r, faction) {
    const AR = H3.Artifacts, SP = H3.Spells;
    if (r.kind === 'artifact' && AR && AR.get(r.art)) { const a = AR.get(r.art); return { title: '«' + a.name + '»', sub: a.desc || '' }; }
    if (r.kind === 'spell' && SP && SP.get(r.spell)) { const sp = SP.get(r.spell); let d = ''; try { d = SP.describe(sp, 1); } catch (e) { /* без пояснения */ } return { title: '«' + sp.name + '»', sub: d }; }
    if (r.kind === 'building') { const b = H3.Buildings && H3.Buildings.get(faction || 'castle', r.building); if (b) return { title: '«' + b.name + '»', sub: 'в стартовом городе, бесплатно' }; }
    if (r.kind === 'creatures') return { title: cap(rewardText(r, faction)), sub: 'сразу в армию героя' };
    return { title: cap(rewardText(r, faction)), sub: '' };
  }
  /** Цели сценария до генерации карты: шаблоны `of: 'enemy'` ещё без конкретного города и героя. */
  const GOAL_TPL = { capture_town: 'Захватить вражеский город', defeat_hero: 'Победить вражеского героя', lose_town: 'Потерять свой город', lose_hero: 'Потерять своего героя' };
  function goalText(g) {
    if (g.of && GOAL_TPL[g.type]) return GOAL_TPL[g.type];
    try { return H3.Adventure.goalText({ towns: {}, heroes: {}, players: [] }, g); } catch (e) { return g.type; }
  }
  function goalLines(sc) {
    const g = sc.goals || { win: [], lose: [] };
    return { win: (g.win || []).map(goalText), lose: (g.lose || []).map(goalText) };
  }

  /* ---------- прогресс ---------- */
  function statusOf(camp, pr) {
    const st = (pr && pr[camp.id]) || { done: [], carry: null };
    const done = camp.scenarios.map(sc => st.done.includes(sc.id));
    const open = camp.scenarios.map((sc, i) => i === 0 || done[i - 1]);
    let cur = camp.scenarios.findIndex((sc, i) => open[i] && !done[i]);
    return { st, done, open, cur, all: done.every(Boolean) };
  }

  /* ======================================================================
     Обложки кампаний: пейзаж фракции (полоса открытки недели), портрет
     главного героя или герб, название поверх (DOM — чтобы текст был чётким).
     ====================================================================== */
  const coverCache = new Map();
  function coverHtml(camp, label, cls) {
    return '<div class="ccover" data-cover="' + esc(camp.id) + '"><canvas></canvas>'
      + '<div class="ccov-t"><b>' + esc(camp.name) + '</b>' + (label ? '<small class="' + (cls || '') + '">' + esc(label) + '</small>' : '') + '</div></div>';
  }
  function paintCover(cv, camp) {
    const cw = cv.clientWidth, ch = cv.clientHeight; if (!cw || !ch) return;
    const dpr = DPR(), W = cv.width = Math.round(cw * dpr), H = cv.height = Math.round(ch * dpr);
    const ctx = cv.getContext('2d'), key = camp.id + ':' + W + 'x' + H;
    const hit = coverCache.get(key);
    if (hit) { ctx.drawImage(hit, 0, 0); return; }
    const fid = factionOf(camp), hero = heroOf(camp), Ld = landOf(fid);
    // пейзаж: мирная неделя фракции (свой город вдали, первые существа), берём полосу через горизонт
    let painted = false;
    if (H3.Scenes && H3.Scenes.week) {
      try {
        const src = document.createElement('canvas'), sw = Math.max(320, cw);
        Object.defineProperty(src, 'clientWidth', { value: sw }); Object.defineProperty(src, 'clientHeight', { value: Math.round(sw * 0.62) });
        H3.Scenes.week(src, { kind: 'plain', faction: fid, heroCls: hero ? hero.cls : null, color: PLAYER(), seed: hashStr(camp.id) % 97 + 3 });
        const sh = src.width * H / W, sy = clamp(src.height * 0.3, 0, src.height - sh);
        ctx.drawImage(src, 0, sy, src.width, sh, 0, 0, W, H);
        painted = true;
      } catch (e) { console.error(e); }
    }
    if (painted) {   // тон фракции поверх рассвета: у каждой кампании своё небо
      const f = H3.Factions.get(fid) || {};
      ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.fillStyle = rgba(f.color || '#806040', 0.55); ctx.fillRect(0, 0, W, H);
      if (f.alignment === 'evil') { ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(70,50,90,.35)'; ctx.fillRect(0, 0, W, H); }
      ctx.restore();
    }
    if (!painted) { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, mix(Ld.far, '#aac4e0', 0.5)); g.addColorStop(1, Ld.near); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
    // низ темнее — под название
    const sh = ctx.createLinearGradient(0, H * 0.35, 0, H); sh.addColorStop(0, 'rgba(12,8,4,0)'); sh.addColorStop(1, 'rgba(12,8,4,0.82)');
    ctx.fillStyle = sh; ctx.fillRect(0, 0, W, H);
    // портрет в рамке слева (или герб фракции)
    const ph = H - 16 * dpr, pw = Math.round(ph * 0.8), px = 10 * dpr, py = 8 * dpr;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,.7)'; ctx.shadowBlur = 8 * dpr; ctx.fillStyle = '#1a1007'; ctx.fillRect(px - 3 * dpr, py - 3 * dpr, pw + 6 * dpr, ph + 6 * dpr);
    ctx.restore();
    const pic = portraitOf(hero);
    if (pic && has(pic)) {
      ctx.fillStyle = '#2a1c0c'; ctx.fillRect(px, py, pw, ph);
      Sp().drawFit(ctx, pic, px, py, pw, ph);
    } else {
      const g = ctx.createRadialGradient(px + pw / 2, py + ph * 0.4, 0, px + pw / 2, py + ph / 2, ph * 0.7);
      g.addColorStop(0, mix((H3.Factions.get(fid) || {}).color || '#6a5030', '#ffffff', 0.25)); g.addColorStop(1, '#20140a');
      ctx.fillStyle = g; ctx.fillRect(px, py, pw, ph);
      if (has('town_' + fid)) Sp().drawFit(ctx, 'town_' + fid, px + pw * 0.06, py + ph * 0.18, pw * 0.88, ph * 0.66);
    }
    ctx.strokeStyle = '#d6a83f'; ctx.lineWidth = 2 * dpr; ctx.strokeRect(px - 1 * dpr, py - 1 * dpr, pw + 2 * dpr, ph + 2 * dpr);
    ctx.strokeStyle = 'rgba(255,240,190,.35)'; ctx.lineWidth = 1 * dpr; ctx.strokeRect(px + 2 * dpr, py + 2 * dpr, pw - 4 * dpr, ph - 4 * dpr);
    const keep = document.createElement('canvas'); keep.width = W; keep.height = H; keep.getContext('2d').drawImage(cv, 0, 0);
    coverCache.set(key, keep);
    cv.parentNode && cv.parentNode.style.setProperty('--covpw', Math.round((pw + px + 10 * dpr) / dpr) + 'px');
  }
  /** Обложки рисуются, только когда карточка видна, и строго по одной за кадр — список не подвисает. */
  const coverQueue = []; let coverBusy = false;
  function pumpCovers() {
    if (coverBusy) return;
    const job = coverQueue.shift(); if (!job) return;
    coverBusy = true;
    setTimeout(() => {
      try { if (job.cv.isConnected) { paintCover(job.cv, job.camp); job.cv.parentNode.classList.add('ready'); } } catch (e) { console.error(e); }
      coverBusy = false; pumpCovers();
    }, 16);
  }
  function mountCovers(host) {
    const nodes = [...host.querySelectorAll('.ccover[data-cover]')];
    const want = node => {
      const camp = H3.Campaign.get(node.dataset.cover), cv = node.querySelector('canvas');
      if (!camp || !cv || node._queued) return; node._queued = true;
      // размер под портрет известен заранее — чтобы название не прыгало после отрисовки
      node.style.setProperty('--covpw', Math.round((node.clientHeight - 16) * 0.8 + 20) + 'px');
      const key = camp.id + ':' + Math.round(cv.clientWidth * DPR()) + 'x' + Math.round(cv.clientHeight * DPR());
      if (coverCache.has(key)) { paintCover(cv, camp); node.classList.add('ready'); return; }
      coverQueue.push({ cv, camp }); pumpCovers();
    };
    if (!('IntersectionObserver' in root)) { nodes.forEach(want); return; }
    const io = new IntersectionObserver(ents => { for (const e of ents) if (e.isIntersecting) { io.unobserve(e.target); want(e.target); } }, { rootMargin: '120px 0px' });
    nodes.forEach(n => io.observe(n));
  }

  /* ======================================================================
     Карта кампании: пергамент, местность в тонах фракции, дорога через
     точки сценариев. Точки — кнопки поверх холста (пульс и выбор — CSS).
     ====================================================================== */
  const hasSea = camp => factionOf(camp) === 'cove' || camp.scenarios.some(sc => sc.sea === 'wide');
  let measureCtx = null;
  const LAB_FONT = '700 12px Philosopher, "Trebuchet MS", Georgia, serif';
  /** Точки сценариев (снизу вверх, зигзагом) и место под их подписи — снаружи от дороги. */
  function layout(camp, W, H) {
    const n = camp.scenarios.length, rnd = rngOf(hashStr('cmap:' + camp.id));
    const Wl = hasSea(camp) ? W * 0.86 : W;           // у моря точки и подписи сдвинуты от берега
    const flip = rnd() < 0.5, pts = [];
    if (!measureCtx) measureCtx = document.createElement('canvas').getContext('2d');
    measureCtx.font = LAB_FONT;
    for (let i = 0; i < n; i++) {
      const t = n === 1 ? 0.5 : i / (n - 1);
      const left = (i % 2 === 0) !== flip;
      const x = (left ? 0.3 + rnd() * 0.1 : 0.6 + rnd() * 0.1) * Wl;
      const y = (0.88 - t * 0.68 + (rnd() - 0.5) * 0.04) * H;
      const room = clamp(Math.round(left ? x - 30 : Wl - x - 30), 60, 150);
      const tw = measureCtx.measureText(camp.scenarios[i].name).width, lines = Math.max(1, Math.ceil(tw / room));
      const lw = Math.min(tw, room), lh = lines * 14;
      pts.push({ x, y, left, room, lab: { x0: left ? x - 22 - lw : x + 22, x1: left ? x - 22 : x + 22 + lw, y0: y - lh / 2 - 2, y1: y + lh / 2 + 2 } });
    }
    return pts;
  }
  /** Дорога: гладкая кривая через точки (Кэтмелл — Ром) с лишними изгибами между ними. */
  function roadPoints(pts, rnd) {
    if (pts.length < 2) return pts.map(p => [p.x, p.y]);
    const P = [[pts[0].x - 30, pts[0].y + 40]];
    for (let i = 0; i < pts.length; i++) {
      P.push([pts[i].x, pts[i].y]);
      if (i < pts.length - 1) { const a = pts[i], b = pts[i + 1]; const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2; P.push([mx + (rnd() - 0.5) * 60, my + (rnd() - 0.5) * 14]); }
    }
    const l = pts[pts.length - 1]; P.push([l.x + 30, l.y - 40]);
    const out = [];
    for (let i = 1; i < P.length - 2; i++) {
      const p0 = P[i - 1], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2];
      for (let s = 0; s < 12; s++) {
        const t = s / 12, t2 = t * t, t3 = t2 * t;
        out.push([0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
          0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)]);
      }
    }
    out.push([l.x, l.y]);
    return out;
  }
  const INK = '#5a3a1a';
  function glyph(ctx, kind, x, y, s, Ld, rnd) {
    ctx.save(); ctx.lineWidth = Math.max(1, s * 0.09); ctx.strokeStyle = INK; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const leaf = mix(Ld.mid, '#e6d3a3', 0.28), dark = mix(Ld.dark, '#e6d3a3', 0.2);
    if (kind === 'tree') {
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - s * 0.45); ctx.stroke();
      ctx.fillStyle = leaf; ctx.beginPath(); ctx.arc(x, y - s * 0.7, s * 0.36, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = rgba(dark, 0.35); ctx.beginPath(); ctx.arc(x + s * 0.12, y - s * 0.62, s * 0.2, 0, Math.PI * 2); ctx.fill();
    } else if (kind === 'pine') {
      ctx.fillStyle = leaf; ctx.beginPath(); ctx.moveTo(x, y - s * 1.1); ctx.lineTo(x + s * 0.34, y - s * 0.15); ctx.lineTo(x - s * 0.34, y - s * 0.15); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, y - s * 0.15); ctx.lineTo(x, y); ctx.stroke();
    } else if (kind === 'dead') {
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - s * 0.9); ctx.moveTo(x, y - s * 0.5); ctx.lineTo(x - s * 0.3, y - s * 0.8); ctx.moveTo(x, y - s * 0.62); ctx.lineTo(x + s * 0.28, y - s * 0.95); ctx.stroke();
    } else if (kind === 'palm') {
      ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + s * 0.15, y - s * 0.5, x + s * 0.05, y - s * 0.95); ctx.stroke();
      ctx.strokeStyle = mix(Ld.lit, INK, 0.5);
      for (const a of [-2.6, -1.9, -1.2, -0.5]) { ctx.beginPath(); ctx.moveTo(x + s * 0.05, y - s * 0.95); ctx.quadraticCurveTo(x + s * 0.05 + Math.cos(a) * s * 0.3, y - s * 0.95 + Math.sin(a) * s * 0.3 - s * 0.05, x + s * 0.05 + Math.cos(a) * s * 0.5, y - s * 0.95 + Math.sin(a) * s * 0.25 + s * 0.12); ctx.stroke(); }
    } else if (kind === 'rock' || kind === 'crystal') {
      ctx.fillStyle = kind === 'crystal' ? mix(Ld.lit, '#e6d3a3', 0.2) : mix(Ld.far, '#e6d3a3', 0.35);
      ctx.beginPath(); ctx.moveTo(x - s * 0.4, y); ctx.lineTo(x - s * 0.25, y - s * (kind === 'crystal' ? 0.9 : 0.4)); ctx.lineTo(x + s * 0.05, y - s * (kind === 'crystal' ? 0.6 : 0.5)); ctx.lineTo(x + s * 0.2, y - s * (kind === 'crystal' ? 1 : 0.35)); ctx.lineTo(x + s * 0.4, y); ctx.closePath(); ctx.fill(); ctx.stroke();
    } else if (kind === 'reed') {
      for (const dx of [-0.2, 0, 0.2]) { ctx.beginPath(); ctx.moveTo(x + dx * s, y); ctx.quadraticCurveTo(x + dx * s * 1.5, y - s * 0.4, x + dx * s * 2, y - s * 0.7); ctx.stroke(); }
    } else if (kind === 'dune') {
      ctx.beginPath(); ctx.moveTo(x - s * 0.6, y); ctx.quadraticCurveTo(x - s * 0.1, y - s * 0.45, x + s * 0.6, y); ctx.stroke();
    } else if (kind === 'crack') {
      ctx.strokeStyle = rgba(Ld.glow || '#ff6020', 0.7); ctx.beginPath(); ctx.moveTo(x - s * 0.4, y); ctx.lineTo(x - s * 0.1, y - s * 0.12); ctx.lineTo(x + s * 0.1, y + s * 0.05); ctx.lineTo(x + s * 0.45, y - s * 0.1); ctx.stroke();
    }
    ctx.restore();
  }
  function mountain(ctx, x, y, s, Ld, rnd) {
    const top = [x + (rnd() - 0.5) * s * 0.3, y - s];
    ctx.save(); ctx.lineJoin = 'round'; ctx.lineWidth = Math.max(1, s * 0.05); ctx.strokeStyle = INK;
    ctx.fillStyle = mix(Ld.far, '#e6d3a3', 0.45);
    ctx.beginPath(); ctx.moveTo(x - s * 0.75, y); ctx.lineTo(top[0], top[1]); ctx.lineTo(x + s * 0.75, y); ctx.closePath(); ctx.fill();
    ctx.fillStyle = rgba(mix(Ld.dark, INK, 0.3), 0.35);   // теневой склон
    ctx.beginPath(); ctx.moveTo(top[0], top[1]); ctx.lineTo(x + s * 0.75, y); ctx.lineTo(x + s * 0.05, y); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x - s * 0.75, y); ctx.lineTo(top[0], top[1]); ctx.lineTo(x + s * 0.75, y); ctx.stroke();
    if (terrainOfLd(Ld) !== 'lava') { ctx.fillStyle = 'rgba(255,255,250,.75)'; ctx.beginPath(); ctx.moveTo(top[0], top[1]); ctx.lineTo(top[0] - s * 0.2, top[1] + s * 0.28); ctx.lineTo(top[0] + s * 0.02, top[1] + s * 0.2); ctx.lineTo(top[0] + s * 0.18, top[1] + s * 0.26); ctx.closePath(); ctx.fill(); }
    ctx.restore();
  }
  const terrainOfLd = Ld => { const L = H3.Scenes && H3.Scenes.LAND; if (!L) return ''; for (const k in L) if (L[k] === Ld) return k; return ''; };
  const GLYPHS = { grass: ['tree', 'tree', 'pine'], snow: ['pine', 'pine', 'rock'], lava: ['dead', 'crack', 'rock'], dirt: ['dead', 'pine', 'rock'], subter: ['crystal', 'rock', 'crystal'],
    rough: ['rock', 'rock', 'dead'], swamp: ['reed', 'tree', 'reed'], sand: ['dune', 'palm', 'dune'] };

  function paintMap(cv, camp, pts, W, H) {
    const dpr = DPR(); cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    const ctx = cv.getContext('2d'); ctx.scale(dpr, dpr);
    const fid = factionOf(camp), ter = terrainOf(fid), Ld = landOf(fid), rnd = rngOf(hashStr('cmapart:' + camp.id));
    // пергамент
    const bg = ctx.createLinearGradient(0, 0, W * 0.3, H); bg.addColorStop(0, '#efe0b6'); bg.addColorStop(1, '#dcc48f');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 14; i++) {   // пятна времени
      const x = rnd() * W, y = rnd() * H, r = 20 + rnd() * 70, g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, 'rgba(150,110,50,' + (0.05 + rnd() * 0.08).toFixed(3) + ')'); g.addColorStop(1, 'rgba(150,110,50,0)');
      ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
    // местность: мягкие пятна цвета земли фракции
    const road = roadPoints(pts, rngOf(hashStr('croad:' + camp.id)));
    for (let i = 0; i < 26; i++) {
      const x = rnd() * W, y = rnd() * H, r = 26 + rnd() * 60, g = ctx.createRadialGradient(x, y, 0, x, y, r), c = rnd() < 0.6 ? Ld.mid : Ld.lit;
      g.addColorStop(0, rgba(c, 0.22 + rnd() * 0.12)); g.addColorStop(1, rgba(c, 0));
      ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
    // вода: у Бухты — море вдоль края, у остальных — озеро
    const sea = hasSea(camp);
    ctx.save();
    const water = new Path2D();
    if (sea) {
      water.moveTo(W, 0); water.lineTo(W * 0.9, 0);
      for (let y = 0; y <= H; y += H / 8) water.lineTo(W * (0.9 + Math.sin(y / H * 7 + rnd()) * 0.025), y);
      water.lineTo(W, H); water.closePath();
    } else {
      const cx = W * (rnd() < 0.5 ? 0.12 : 0.88), cy = H * (0.3 + rnd() * 0.4), rx = W * 0.07, ry = H * 0.05;
      for (let a = 0; a <= 12; a++) { const t = a / 12 * Math.PI * 2, k = 0.8 + rnd() * 0.35, px = cx + Math.cos(t) * rx * k, py = cy + Math.sin(t) * ry * k; if (!a) water.moveTo(px, py); else water.lineTo(px, py); }
      water.closePath();
    }
    ctx.fillStyle = 'rgba(90,140,170,.42)'; ctx.fill(water);
    ctx.strokeStyle = rgba(INK, 0.6); ctx.lineWidth = 1.2; ctx.stroke(water);
    ctx.clip(water); ctx.strokeStyle = 'rgba(40,70,100,.35)'; ctx.lineWidth = 1;
    for (let i = 0; i < 40; i++) { const x = rnd() * W, y = rnd() * H; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 4, y - 3, x + 8, y); ctx.quadraticCurveTo(x + 12, y + 3, x + 16, y); ctx.stroke(); }
    ctx.restore();
    // что не должно лечь на дорогу и точки
    const last = pts[pts.length - 1], cx = last && !last.left ? 40 : W - (sea ? W * 0.1 + 40 : 40), cy = 46;   // роза ветров — в свободном верхнем углу
    const inLab = (x, y, d) => pts.some(p => x + d * 0.6 > p.lab.x0 && x - d * 0.6 < p.lab.x1 && y + d * 0.6 > p.lab.y0 && y - d * 1.1 < p.lab.y1);
    const near = (x, y, d) => pts.some(p => Math.hypot(p.x - x, p.y - y) < d + 26) || road.some(q => Math.hypot(q[0] - x, q[1] - y) < d) || inLab(x, y, d) || Math.hypot(x - cx, y - cy) < d + 26
      || ctx.isPointInPath(water, x * dpr, y * dpr);
    // горы и знаки местности (дальние — выше, рисуем сверху вниз)
    const items = [];
    for (let i = 0; i < 70 && items.length < 11; i++) { const x = W * (0.05 + rnd() * 0.9), y = H * (0.1 + rnd() * 0.85), s = 18 + rnd() * 16; if (!near(x, y - s / 2, s * 0.8) && !items.some(o => Math.hypot(o.x - x, o.y - y) < s * 1.3)) items.push({ x, y, s, m: true }); }
    const gl = GLYPHS[ter] || GLYPHS.grass;
    for (let i = 0; i < 220 && items.length < 50; i++) { const x = W * (0.03 + rnd() * 0.94), y = H * (0.06 + rnd() * 0.92), s = 9 + rnd() * 6; if (!near(x, y - s / 2, s * 0.9) && !items.some(o => Math.hypot(o.x - x, o.y - y) < (o.m ? o.s : s) * 0.9)) items.push({ x, y, s, k: gl[Math.floor(rnd() * gl.length)] }); }
    items.sort((a, b) => a.y - b.y);
    for (const o of items) { if (o.m) mountain(ctx, o.x, o.y, o.s, Ld, rnd); else glyph(ctx, o.k, o.x, o.y, o.s, Ld, rnd); }
    // дорога: широкая подложка и пунктир чернилами
    const path = new Path2D(); road.forEach((q, i) => i ? path.lineTo(q[0], q[1]) : path.moveTo(q[0], q[1]));
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.strokeStyle = rgba(mix(Ld.path, '#e6d3a3', 0.3), 0.85); ctx.lineWidth = 9; ctx.stroke(path);
    ctx.strokeStyle = rgba(INK, 0.28); ctx.lineWidth = 11; ctx.globalCompositeOperation = 'destination-over'; ctx.stroke(path); ctx.globalCompositeOperation = 'source-over';
    ctx.setLineDash([5, 5]); ctx.strokeStyle = rgba(INK, 0.85); ctx.lineWidth = 1.8; ctx.stroke(path);
    ctx.restore();
    // вражеская твердыня у последней точки — башенка чернилами
    if (last) {
      const x = last.x, y = last.y - 22; ctx.save(); ctx.strokeStyle = INK; ctx.fillStyle = rgba('#8a2a1a', 0.25); ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.rect(x - 9, y - 16, 18, 14); ctx.fill(); ctx.stroke();
      for (const dx of [-9, -3, 3]) ctx.strokeRect(x + dx, y - 20, 6, 4);
      ctx.restore();
    }
    // роза ветров
    ctx.save(); ctx.strokeStyle = rgba(INK, 0.8); ctx.fillStyle = rgba(INK, 0.75); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, 15, 0, Math.PI * 2); ctx.stroke();
    for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 - Math.PI / 2; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * 20, cy + Math.sin(a) * 20); ctx.lineTo(cx + Math.cos(a + 0.5) * 5, cy + Math.sin(a + 0.5) * 5); ctx.lineTo(cx + Math.cos(a - 0.5) * 5, cy + Math.sin(a - 0.5) * 5); ctx.closePath(); k ? ctx.stroke() : ctx.fill(); }
    ctx.font = '700 9px Georgia, serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('С', cx, cy - 26);
    ctx.restore();
    // края: подпалина и двойная рамка
    const v = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.72);
    v.addColorStop(0, 'rgba(90,58,20,0)'); v.addColorStop(1, 'rgba(90,58,20,.45)'); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = rgba(INK, 0.7); ctx.lineWidth = 1.5; ctx.strokeRect(6.5, 6.5, W - 13, H - 13);
    ctx.strokeStyle = rgba(INK, 0.35); ctx.lineWidth = 1; ctx.strokeRect(10.5, 10.5, W - 21, H - 21);
  }
  function mountMap(host, camp, pr, o) {
    o = o || {};
    const S = statusOf(camp, pr), color = o.color || PLAYER();
    host.classList.add('cmap'); host.innerHTML = '<canvas class="cmapart"></canvas><div class="cmlayer"></div>';
    const cv = host.querySelector('canvas'), layer = host.querySelector('.cmlayer');
    let sel = o.sel !== undefined ? o.sel : S.cur >= 0 ? S.cur : 0, lastW = 0;
    const draw = () => {
      const W = host.clientWidth || 360, H = Math.round(clamp(W * 0.86, 280, 380));
      if (W === lastW) return; lastW = W;
      host.style.height = H + 'px';
      const pts = layout(camp, W, H);
      try { paintMap(cv, camp, pts, W, H); } catch (e) { console.error(e); }
      cv.style.width = W + 'px'; cv.style.height = H + 'px';
      layer.innerHTML = camp.scenarios.map((sc, i) => {
        const p = pts[i], st = S.done[i] ? 'done' : !S.open[i] ? 'locked' : i === S.cur ? 'cur' : 'open';
        return '<button class="cpt ' + st + (i === sel ? ' sel' : '') + '" data-pt="' + i + '" style="left:' + p.x.toFixed(1) + 'px;top:' + p.y.toFixed(1) + 'px;--pc:' + color + '" aria-label="' + esc((i + 1) + '. ' + sc.name) + '">'
          + '<span class="cpd">' + (i + 1) + '</span>' + (S.done[i] ? '<i class="cflag"></i>' : '') + '</button>'
          + '<span class="cplab ' + (p.left ? 'l' : 'r') + ' ' + st + (i === sel ? ' sel' : '') + '" data-lab="' + i + '" style="' + (p.left ? 'right:' + (W - p.x + 22).toFixed(1) : 'left:' + (p.x + 22).toFixed(1)) + 'px;top:' + p.y.toFixed(1) + 'px;max-width:' + p.room + 'px">' + esc(sc.name) + '</span>';
      }).join('');
      layer.querySelectorAll('[data-pt]').forEach(b => { b.onclick = () => { H3.Audio && H3.Audio.play('click'); api.select(+b.dataset.pt, true); }; });
      layer.querySelectorAll('[data-lab]').forEach(b => { b.onclick = () => { H3.Audio && H3.Audio.play('click'); api.select(+b.dataset.lab, true); }; });
    };
    const api = {
      select(i, user) {
        sel = i;
        layer.querySelectorAll('[data-pt]').forEach(b => b.classList.toggle('sel', +b.dataset.pt === i));
        layer.querySelectorAll('[data-lab]').forEach(b => b.classList.toggle('sel', +b.dataset.lab === i));
        if (user && o.onPick) o.onPick(i);
      },
      get sel() { return sel; },
    };
    draw();
    if ('ResizeObserver' in root) { const ro = new ResizeObserver(() => { if (!host.isConnected) { ro.disconnect(); return; } draw(); }); ro.observe(host); }
    return api;
  }

  /** Карточка выбранного сценария под картой. */
  function scenarioCardHtml(camp, i, pr) {
    const S = statusOf(camp, pr), sc = camp.scenarios[i]; if (!sc) return '';
    const g = goalLines(sc);
    const tag = S.done[i] ? '<span class="small green">✔ пройден</span>' : !S.open[i] ? '<span class="small muted">закрыт</span>' : i === S.cur ? '<span class="small gold">текущий</span>' : '';
    const bonus = (sc.bonus || []).filter(Boolean);
    return '<div class="cscard parch">'
      + '<div class="row sp"><h3>' + (i + 1) + '. ' + esc(sc.name) + '</h3>' + tag + '</div>'
      + '<p>' + esc(sc.brief) + '</p>'
      + '<div class="csgoals small">' + g.win.map(t => '<div class="w">★ ' + esc(t) + '</div>').join('') + g.lose.map(t => '<div class="l">☠ ' + esc(t) + '</div>').join('') + '</div>'
      + (i ? '<div class="small csline"><b>Переходит из прошлого:</b> ' + esc(H3.Campaign.carryText(sc)) + '</div>' : '')
      + (bonus.length ? '<div class="small csline"><b>Бонус на выбор:</b> ' + bonus.map(r => esc(rewardText(r, sc.faction))).join(' · ') + '</div>' : '')
      + (!S.open[i] ? '<div class="small csline muted">Откроется после сценария «' + esc(camp.scenarios[i - 1].name) + '».</div>' : '')
      + '</div>';
  }

  /* ======================================================================
     Реплики: портрет говорящего крупно слева, имя, текст.
     Летописец — свиток без портрета.
     ====================================================================== */
  function lineHtml(line, o) {
    const sp = speaker(line.who), cls = o && o.cls ? ' ' + o.cls : '';
    if (sp.narr) return '<div class="cline narr' + cls + '"><div class="clscroll"><div class="clwho"><b>' + esc(sp.name) + '</b></div><p>' + esc(line.text) + '</p></div></div>';
    return '<div class="cline' + cls + '"><div class="clport">' + portraitHtml(sp, (o && o.scale) || 3) + '</div>'
      + '<div class="clbub parch"><div class="clwho"><b>' + esc(sp.name) + '</b>' + (sp.sub ? '<small>' + esc(sp.sub) + '</small>' : '') + '</div><p>' + esc(line.text) + '</p></div></div>';
  }
  function linesHtml(lines, o) { return (lines || []).filter(l => l && l.text).map(l => lineHtml(l, o)).join(''); }
  /** После победы: реплики outro; после последнего сценария — эпилог кампании. */
  function outroHtml(camp, sc, last) {
    const out = sc && sc.story && sc.story.outro;
    let html = out && out.length ? '<div class="clines">' + linesHtml(out, { scale: 2 }) + '</div>' : '';
    if (last && camp && camp.epilogue) html += '<div class="cepi parch"><div class="cepih">Эпилог</div><p>' + esc(camp.epilogue) + '</p></div>';
    return html;
  }

  /* ======================================================================
     Брифинг перед сценарием: лист во весь экран. Реплики intro по одной
     («Дальше»), потом выбор бонуса и «В бой». «Пропустить» — сразу к бонусу.
     → Promise<{ bonusPick } | null>; null — вернулись назад.
     ====================================================================== */
  function briefing(o) {
    const { camp, sc } = o, idx = o.idx || 0;
    const intro = ((sc.story && sc.story.intro) || []).filter(l => l && l.text);
    const bonus = (sc.bonus || []).filter(Boolean);
    if (!intro.length && !bonus.length) return Promise.resolve({ bonusPick: null });
    const U = UI();
    return new Promise(resolve => {
      const wrap = U.el('div', 'cbrief wood');
      wrap.innerHTML = '<div class="cbhead"><button class="back" data-back aria-label="Назад">‹</button><h2>' + esc((idx + 1) + '. ' + sc.name) + '</h2><button class="sm cbskip" data-skip>Пропустить</button></div>'
        + '<div class="cbbody"><div class="cbpic"><canvas class="cbart"></canvas><div class="cbrib"><span>' + esc(camp.name) + '</span></div></div><div class="cbstage"></div></div>'
        + '<div class="cbfoot"></div>';
      U.$('#modals').appendChild(wrap);
      const stage = wrap.querySelector('.cbstage'), foot = wrap.querySelector('.cbfoot'), skip = wrap.querySelector('[data-skip]'), body = wrap.querySelector('.cbbody');
      let step = 0, pick = -1, closed = false;
      const done = v => { if (closed) return; closed = true; root.removeEventListener('keydown', onKey, true); wrap.classList.add('out'); setTimeout(() => wrap.remove(), 160); resolve(v); };
      /** Дальше: следующая реплика → выбор бонуса (если есть) → в бой. */
      const go = () => {
        if (step < intro.length - 1) { step++; render(); return; }
        if (step < intro.length) { if (bonus.length) { step = intro.length; render(); } else done({ bonusPick: null }); return; }
        if (pick >= 0) done({ bonusPick: bonus[pick] });
      };
      function render() {
        body.scrollTop = 0;
        if (step < intro.length) {
          const n = intro.length;
          stage.innerHTML = '<div class="cbdots">' + intro.map((l, i) => '<i class="' + (i <= step ? 'on' : '') + '"></i>').join('') + '</div>' + lineHtml(intro[step], { cls: 'cbin', scale: 4 });
          const lastLine = step === n - 1;
          foot.innerHTML = '<button class="big primary" data-next>' + (!lastLine ? 'Дальше' : bonus.length ? 'К выбору бонуса' : 'В бой') + '</button>';
          skip.classList.toggle('hidden', false);
        } else {
          stage.innerHTML = '<div class="cbask">Выберите бонус</div><div class="small cbhint">Он достанется вам в начале сценария.</div><div class="cbonus">'
            + bonus.map((r, i) => {
              const ic = rewardIcon(r, sc.faction), cd = rewardCard(r, sc.faction);
              return '<button class="cbcard' + (i === pick ? ' on' : '') + '" data-pick="' + i + '"><span class="cbic">' + (ic ? U.icon(ic, r.kind === 'creatures' || r.kind === 'building' ? 2 : 3) : '') + '</span>'
                + '<span class="cbtx"><small>' + esc(KIND_NAME[r.kind] || 'Бонус') + '</small><b>' + esc(cd.title) + '</b>' + (cd.sub ? '<em>' + esc(cd.sub) + '</em>' : '') + '</span><span class="cbmark"></span></button>';
            }).join('') + '</div>';
          foot.innerHTML = '<button class="big primary" data-next' + (pick < 0 ? ' disabled' : '') + '>В бой</button>';
          skip.classList.add('hidden'); wrap.classList.add('bonus');
          stage.querySelectorAll('[data-pick]').forEach(b => { b.onclick = () => { H3.Audio && H3.Audio.play('click'); pick = +b.dataset.pick; stage.querySelectorAll('[data-pick]').forEach(x => x.classList.toggle('on', +x.dataset.pick === pick)); foot.querySelector('[data-next]').disabled = false; }; });
        }
        foot.querySelector('[data-next]').onclick = () => { H3.Audio && H3.Audio.play('click'); go(); };
      }
      const onKey = e => {
        if (e.key === 'Escape') { e.stopPropagation(); e.preventDefault(); done(null); }
        else if ((e.key === 'Enter' || e.key === ' ') && step < intro.length) { e.stopPropagation(); e.preventDefault(); go(); }
      };
      root.addEventListener('keydown', onKey, true);
      wrap.querySelector('[data-back]').onclick = () => { H3.Audio && H3.Audio.play('click'); done(null); };
      skip.onclick = () => { H3.Audio && H3.Audio.play('click'); step = intro.length; if (bonus.length) render(); else done({ bonusPick: null }); };
      render();
      // картина: путник на дороге в землях фракции сценария
      requestAnimationFrame(() => {
        const cv = wrap.querySelector('canvas.cbart');
        try { if (H3.Scenes) H3.Scenes.week(cv, { kind: 'wanderer', faction: sc.faction || factionOf(camp), heroCls: o.heroCls || null, color: o.color || PLAYER(), seed: hashStr(camp.id + ':' + sc.id) % 97 + 1 }); else cv.remove(); }
        catch (e) { console.error(e); cv.remove(); }
      });
    });
  }

  /* ======================================================================
     Сюжетные события в партии: письмо на каждое событие очереди.
     ====================================================================== */
  function letter(ev) {
    const U = UI(), sp = speaker(ev.who);
    const box = U.el('div', 'cletter');
    box.innerHTML = linesHtml([{ who: ev.who, text: ev.text }], { scale: 3 })
      + (ev.gift ? '<div class="clgift">' + U.icon('ic_check', 1) + '<span><b>Получено:</b> ' + esc(ev.gift) + '</span></div>' : '')
      + (ev.foe ? '<div class="clfoe">' + U.icon('ic_skull', 1) + '<span><b>К врагу подошло:</b> ' + esc(ev.foe) + '</span></div>' : '');
    return U.modal({ title: sp.narr ? 'Летопись' : 'Весть', html: box, buttons: [{ label: 'Дальше', cls: 'primary', value: true }], closable: false,
      onOpen: bx => bx.classList.add('clmodal') });
  }
  async function showQueue(state) {
    const q = state && state.storyQueue;
    if (!q || !q.length) return 0;
    const list = q.slice();
    for (const ev of list) { try { await letter(ev); } catch (e) { console.error(e); } }
    state.storyQueue = [];
    return list.length;
  }

  H3.CampView = { factionOf, heroOf, speaker, statusOf, coverHtml, mountCovers, mountMap, scenarioCardHtml, briefing, lineHtml, linesHtml, outroHtml, letter, showQueue, rewardText, rewardIcon, goalLines };
})(typeof window !== 'undefined' ? window : globalThis);
