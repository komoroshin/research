/* ============================================================================
   view/vec_seasons.js — смена времён года на карте.

   Год игры — четыре месяца по 28 дней, по месяцу на сезон; партия начинается
   летом (привычная зелёная карта), дальше осень, зима, весна — и по кругу:
     месяц 1 — лето, 2 — осень, 3 — зима, 4 — весна, 5 — снова лето…
   Внутри сезона всё меняется по неделям, а не скачком на первое число:
     лето   — сочная трава; к последней неделе кое-где желтеют кроны;
     осень  — трава буреет, кроны желтеют, потом краснеют и облетают; в конце — первая пороша;
     зима   — снег ложится пятнами и за четыре недели укрывает всё (доля 35 → 60 → 85 → 100 %);
     весна  — снег тает (проталины, лужи, грязь у кромки), трава свежеет, сады цветут.
   Всё — только вид: механика сезонов не знает. Карта кусков пересобирается,
   когда меняется ключ сезона (раз в неделю, см. MapPaint).

   Проверка: ?season=spring|summer|autumn|winter — сезон принудительно (неделя — по дню
   партии, ?sweek=1..4 — неделю тоже).
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});

  /* ---------- модель сезона ---------- */
  const ORDER = ['summer', 'autumn', 'winter', 'spring'];
  const NAMES = { summer: 'лето', autumn: 'осень', winter: 'зима', spring: 'весна' };
  // bud — доля деревьев с первыми листочками (весна); по неделям 1..4: snow — доля земли под снегом, fall — пожухлость травы и крон, bare — доля голых
  // лиственных деревьев, bloom — цветение (цветы в траве, сады), wet — талая вода, fresh — весенняя яркость,
  // dormant — прошлогодняя бурая трава (под снегом и сразу после него), leaves — листопад (частицы, опавшие листья)
  const TABLE = {
    summer: { snow: [0, 0, 0, 0], fall: [0, 0, 0, 0.12], bare: [0, 0, 0, 0], bloom: [0.35, 0.25, 0.2, 0.1], wet: [0, 0, 0, 0], fresh: [0.3, 0.1, 0, 0], dormant: [0, 0, 0, 0], leaves: [0.05, 0.05, 0.1, 0.2] },
    autumn: { snow: [0, 0, 0, 0.12], fall: [0.45, 0.7, 0.9, 1], bare: [0, 0.1, 0.35, 0.6], bloom: [0, 0, 0, 0], wet: [0, 0.1, 0.2, 0.2], fresh: [0, 0, 0, 0], dormant: [0, 0.1, 0.3, 0.5], leaves: [0.5, 0.9, 1, 0.6] },
    winter: { snow: [0.35, 0.6, 0.85, 1], fall: [1, 1, 1, 1], bare: [1, 1, 1, 1], bloom: [0, 0, 0, 0], wet: [0, 0, 0, 0], fresh: [0, 0, 0, 0], dormant: [1, 1, 1, 1], leaves: [0, 0, 0, 0] },
    spring: { snow: [0.45, 0.15, 0, 0], fall: [0, 0, 0, 0], bare: [0.75, 0.15, 0, 0], bud: [1, 0.5, 0, 0], bloom: [0.2, 0.8, 1, 0.6], wet: [1, 0.8, 0.4, 0.1], fresh: [0.4, 0.8, 1, 0.8], dormant: [0.7, 0.3, 0.05, 0], leaves: [0, 0.2, 0.4, 0.3] },
  };
  const q = () => { try { return new URLSearchParams(root.location ? root.location.search : ''); } catch (e) { return null; } };
  const QP = q(), FORCE = QP && ORDER.includes(QP.get('season')) ? QP.get('season') : null, FWEEK = QP && +QP.get('sweek');
  const cache = new Map();
  /** Сезон на день партии: { id, name, month, week (0..3), snow, fall, bare, bloom, wet, fresh, dormant, leaves, key }. */
  function of(day) {
    const d = Math.max(0, (day | 0) - 1), month = Math.floor(d / 28);
    let id = ORDER[month % 4], week = Math.floor((d % 28) / 7);
    if (FORCE) id = FORCE;
    if (FWEEK >= 1 && FWEEK <= 4) week = FWEEK - 1;
    const key = id + (week + 1);
    let s = cache.get(key); if (s) return Object.assign({}, s, { month: month + 1 });
    const T = TABLE[id];
    s = { id, name: NAMES[id], week, key };
    for (const k in T) s[k] = T[k][week];
    cache.set(key, s);
    return Object.assign({}, s, { month: month + 1 });
  }
  /** Нейтральный сезон (подземелье: там времён года нет). */
  const NONE = { id: 'none', name: '', week: 0, key: 'none', snow: 0, fall: 0, bare: 0, bloom: 0.2, wet: 0, fresh: 0, dormant: 0, leaves: 0 };

  /* ---------- деревья по сезону ---------- */
  function hash(x, y, s) { let h = (x * 374761393 + y * 668265263 + s * 144665) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
  const LEAFY = /^tree_(1|2|3|swamp)$/;
  /**
   * Имя сезонного варианта препятствия (или прежнее имя). x, y — клетка; snowy — лежит ли снег
   * под деревом (0..1, от поля снега на земле). Деревья облетают и зацветают не все разом: у
   * каждого свой «характер» по хешу клетки — раннее, позднее.
   */
  function tree(name, S, x, y, snowy) {
    if (!S || S.id === 'none' || !name) return name;
    const V = H3.Vec, pick = n => (V && V.has(n) ? n : name);
    const h = hash(x, y, 811), h2 = hash(x, y, 812), snow = snowy > 0.45;
    if (LEAFY.test(name)) {
      if (h < S.bare) return pick(name + (snow ? '#winter' : S.id === 'autumn' ? '#late' : '#bare'));   // осенью на ветках ещё держатся листья
      if (S.fall > 0 && h2 < S.fall * 1.05) return pick(name + (hash(x, y, 813) < 0.45 ? '#autumn2' : '#autumn'));
      if (S.bloom > 0.5 && name !== 'tree_swamp' && h2 < (S.bloom - 0.3) * 0.9) return pick(name + '#spring');
      if (S.bud && hash(x, y, 814) < S.bud) return pick(name + '#bud');   // первые клейкие листочки
      return name;
    }
    if (name === 'tree_pine' || name === 'tree_dead') return snow ? pick(name + '#winter') : name;
    return name;
  }

  H3.Season = { of, NONE, tree, NAMES, ORDER, TABLE, forced: () => FORCE };
})(typeof window !== 'undefined' ? window : globalThis);
