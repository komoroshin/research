#!/usr/bin/env node
/* ============================================================================
   dev/genframes.js — таблица рамок пиксельных спрайтов → js/view/sprite_frames.js.

   При рисованной графике пиксельные спрайты (~3,2 МБ) не грузятся, а от них нужны
   рамка и якорь (VK.frameOf), признак «спрайт есть» (Sprites.has) и скелет для
   Sprites.resolve (рост — темп дыхания в anim.js; окна построек — townscene.js).
   Скрипт грузит пиксельные файлы в порядке index.html и пишет всё это в маленький файл.

   Запуск после любой правки sprites_*.js:  node dev/genframes.js
   Проверка без записи (тест делает то же):  node dev/genframes.js --check
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'js', 'view', 'sprite_frames.js');
/* Окна (буква y) нужны только постройкам сцены города: у рисованных без meta.lights
   townscene.js берёт их из сетки пиксельного спрайта. Существам не нужны — не раздуваем файл. */
const WIN_RE = /^(bld_|shipyard)/;

/** Пиксельные файлы в том порядке, в каком их подключает index.html (_hd переопределяют базовые). */
function pixelFiles() {
  const idx = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const out = [];
  for (const m of idx.matchAll(/js\/view\/(sprites_[a-z0-9_]+\.js)/g)) if (!out.includes(m[1])) out.push(m[1]);
  return out;
}

/** Загрузить пиксельные спрайты в отдельный реестр (не трогая глобальный H3, если он уже есть). */
function loadRegistry() {
  const vm = require('vm');
  const ctx = { console };
  ctx.globalThis = ctx; ctx.window = ctx;
  vm.createContext(ctx);
  const run = f => vm.runInContext(fs.readFileSync(path.join(ROOT, 'js', 'view', f), 'utf8'), ctx, { filename: f });
  run('sprites.js');
  for (const f of pixelFiles()) run(f);
  return ctx.H3.Sprites;
}

/** Запись таблицы по описанию спрайта (после resolve: вариант уже собран из базового). */
function entryOf(name, sp) {
  const u = sp.unit || 1, W = Math.max(...sp.rows.map(r => r.length)), H = sp.rows.length;
  const e = [W, H, sp.anchor ? sp.anchor[0] : null, sp.anchor ? sp.anchor[1] : null];
  const win = [];
  if (sp.hd && WIN_RE.test(name)) {
    // так же, как townscene.js: шаг сетки u, координаты в номинальных пикселях
    for (let y = 0; y < sp.rows.length; y += u) for (let x = 0; x < sp.rows[y].length; x += u) if (sp.rows[y][x] === 'y') win.push(x / u, y / u);
  }
  if (u !== 1 || sp.hd || win.length) e.push(u);
  if (sp.hd || win.length) e.push(sp.hd ? 1 : 0);
  if (win.length) e.push(win);
  return e;
}

function build(Sp) {
  Sp = Sp || loadRegistry();
  const reg = Sp._registry, table = {};
  for (const name of Object.keys(reg).sort()) {
    const sp = Sp.resolve(name);
    if (!sp || !sp.rows || sp.skeleton) throw new Error('спрайт ' + name + ' не собирается');
    table[name] = entryOf(name, sp);
  }
  return table;
}

function source(table) {
  const lines = Object.keys(table).map(n => '  ' + JSON.stringify(n) + ': ' + JSON.stringify(table[n]) + ',');
  return '/* ============================================================================\n'
    + '   view/sprite_frames.js — рамки пиксельных спрайтов без самих пикселей.\n'
    + '   СГЕНЕРИРОВАНО dev/genframes.js — руками не править: node dev/genframes.js\n'
    + '   [W, H, ax, ay, unit, hd, окна] — см. sprites.js (таблица рамок).\n'
    + '   Грузится до рисованных файлов: они при загрузке вызывают VK.frameOf.\n'
    + '   ========================================================================== */\n'
    + 'H3.Sprites.setFrames({\n' + lines.join('\n') + '\n});\n';
}

module.exports = { build, source, entryOf, pixelFiles, loadRegistry, OUT, WIN_RE };

if (require.main === module) {
  const src = source(build());
  if (process.argv.includes('--check')) {
    const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
    if (cur !== src) { console.error('sprite_frames.js устарел: node dev/genframes.js'); process.exit(1); }
    console.log('sprite_frames.js актуален');
  } else {
    fs.writeFileSync(OUT, src);
    console.log('записано ' + path.relative(ROOT, OUT) + ': ' + (src.length / 1024).toFixed(1) + ' КБ');
  }
}
