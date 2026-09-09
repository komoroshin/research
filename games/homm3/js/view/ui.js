/* ============================================================================
   view/ui.js — общие элементы интерфейса: модальные окна, диалоги выбора,
   тосты, подсказки, помощники разметки (иконки ресурсов, стоимости, армии).
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});
  const U = H3.U, Sp = H3.Sprites, C = H3.Creatures, O = H3.Objects;
  const $ = (sel, el) => (el || document).querySelector(sel);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const stack = [];

  /**
   * modal({ title, html, buttons:[{label, cls, value, disabled}], wide, closable })
   * → Promise<value>. Кнопка закрывает окно и резолвит value (или label).
   */
  function modal(opts) {
    return new Promise(resolve => {
      const bg = el('div', 'modal-bg');
      const box = el('div', 'wood modal' + (opts.wide ? ' wide' : ''));
      if (opts.title !== undefined) box.appendChild(el('div', 'title', '<h2>' + esc(opts.title) + '</h2>' + (opts.titleRight || '')));
      const body = el('div', 'body'); if (typeof opts.html === 'string') body.innerHTML = opts.html; else if (opts.html) body.appendChild(opts.html);
      box.appendChild(body);
      const actions = el('div', 'actions');
      const buttons = opts.buttons || [{ label: 'OK', cls: 'primary', value: true }];
      let closed = false;
      const close = v => { if (closed) return; closed = true; bg.remove(); const i = stack.indexOf(bg); if (i >= 0) stack.splice(i, 1); resolve(v); };
      for (const b of buttons) {
        const btn = el('button', b.cls || '', b.html || esc(b.label)); if (b.disabled) btn.disabled = true;
        btn.onclick = () => { H3.Audio.play('click'); if (b.onClick && b.onClick(box) === false) return; close(b.value !== undefined ? b.value : b.label); };
        actions.appendChild(btn);
      }
      if (buttons.length) box.appendChild(actions);
      bg.appendChild(box); $('#modals').appendChild(bg); stack.push(bg);
      bg._close = close; box._close = close; bg._opts = opts;
      if (opts.onOpen) opts.onOpen(box, close);
      if (opts.closable !== false) bg.addEventListener('pointerdown', e => { if (e.target === bg && opts.closable !== false) close(opts.cancelValue !== undefined ? opts.cancelValue : null); });
      // фокус на кнопку — без прокрутки: иначе длинное окно (город) на телефоне уезжает к нижней кнопке
      const first = actions.querySelector('button.primary') || actions.querySelector('button'); if (first) setTimeout(() => { try { first.focus({ preventScroll: true }); } catch (e) { first.focus(); } }, 0);
    });
  }
  function closeTop(value) { const bg = stack[stack.length - 1]; if (bg && bg._opts.closable !== false) bg._close(value === undefined ? null : value); }
  function alert(title, html, icon) { return modal({ title, html: dlgHtml(icon, html) }); }
  function confirm(title, html, yes, no, icon) { return modal({ title, html: dlgHtml(icon, html), buttons: [{ label: yes || 'Да', cls: 'primary', value: true }, { label: no || 'Нет', value: false }], cancelValue: false }); }
  function dlgHtml(icon, html) { return '<div class="dlg">' + (icon && Sp.has(icon) ? '<img class="px big" src="' + Sp.url(icon, 3) + '" alt="">' : '') + '<div class="grow">' + html + '</div></div>'; }
  /** Диалог с вариантами: choices [{id,label,desc,disabled}] → Promise<id|null> */
  function choose(title, html, choices, icon) {
    const box = el('div', 'choice');
    return new Promise(resolve => {
      let closeFn = null;
      for (const c of choices) {
        const b = el('button', '', '<b>' + esc(c.label) + '</b>' + (c.desc ? '<small>' + esc(c.desc) + '</small>' : ''));
        if (c.disabled) b.disabled = true;
        b.onclick = () => { H3.Audio.play('click'); if (closeFn) closeFn(c.id); };
        box.appendChild(b);
      }
      const wrap = el('div', '', dlgHtml(icon, html)); wrap.appendChild(el('div', '', '<br>')); wrap.appendChild(box);
      modal({ title, html: wrap, buttons: [], onOpen: (bx, close) => { closeFn = close; } }).then(v => resolve(v));
    });
  }
  function toast(text, cls, icon) {
    const t = el('div', 'toast ' + (cls || ''), (icon && Sp.has(icon) ? '<img class="px" src="' + Sp.url(icon, 2) + '" alt="">' : '') + '<span>' + text + '</span>');
    $('#toasts').appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .4s'; setTimeout(() => t.remove(), 400); }, 2600);
  }
  let tipEl = null;
  function tip(x, y, html) {
    tipEl = tipEl || $('#tip');
    tipEl.innerHTML = html; tipEl.classList.remove('hidden');
    const r = tipEl.getBoundingClientRect();
    let tx = x + 14, ty = y + 14;
    if (tx + r.width > window.innerWidth - 8) tx = x - r.width - 10;
    if (ty + r.height > window.innerHeight - 8) ty = y - r.height - 10;
    tipEl.style.left = Math.max(4, tx) + 'px'; tipEl.style.top = Math.max(4, ty) + 'px';
  }
  function hideTip() { if (tipEl) tipEl.classList.add('hidden'); }

  /* ---------- разметка ---------- */
  const icon = (name, scale) => Sp.has(name) ? '<img class="px" src="' + Sp.url(name, scale || 2) + '" alt="">' : '';
  const resIcon = r => icon('ic_' + r, 2);
  function costHtml(cost, have) {
    return '<span class="cost">' + U.RES.filter(r => cost[r]).map(r => '<span class="' + (have && (have[r] || 0) < cost[r] ? 'lack' : '') + '">' + resIcon(r) + cost[r] + '</span>').join('') + '</span>';
  }
  function resLine(res) { return U.RES.map(r => '<span>' + resIcon(r) + '<b>' + U.fmt(res[r] || 0) + '</b></span>').join(''); }
  function slotHtml(st, cls) {
    if (!st || st.n <= 0) return '<div class="slot ' + (cls || '') + '"></div>';
    return '<div class="slot ' + (cls || '') + '" title="' + esc(C.get(st.cid).name) + '">' + icon(st.cid, 2) + '<i>' + st.n + '</i></div>';
  }
  function armyHtml(army, selIdx) { return '<div class="army7">' + army.map((s, i) => slotHtml(s, (i === selIdx ? 'sel' : '') + ' a' + i)).join('') + '</div>'; }
  function countWord(n) {
    if (n < 5) return 'Несколько'; if (n < 10) return 'Отряд'; if (n < 20) return 'Толпа'; if (n < 50) return 'Орда'; if (n < 100) return 'Множество'; if (n < 250) return 'Легион'; return 'Рой';
  }
  function creatureCard(c, extra) {
    const abs = C.abilityText(c);
    return '<div class="row top"><div>' + icon(c.id, 3) + '</div><div class="grow"><b class="w">' + esc(c.name) + '</b> <span class="muted small">(' + c.tier + ' ур., ' + esc(H3.Factions.get(c.faction).name) + ')</span>'
      + '<table class="t small"><tr><td>' + icon('ic_att') + ' Атака</td><td class="num">' + c.att + '</td><td>' + icon('ic_def') + ' Защита</td><td class="num">' + c.def + '</td></tr>'
      + '<tr><td>' + icon('ic_hp') + ' Здоровье</td><td class="num">' + c.hp + '</td><td>' + icon('ic_speed') + ' Скорость</td><td class="num">' + c.speed + '</td></tr>'
      + '<tr><td>Урон</td><td class="num">' + c.dmg[0] + '–' + c.dmg[1] + '</td><td>Цена</td><td class="num">' + costHtml(c.cost) + '</td></tr></table>'
      + (abs.length ? '<div class="small muted">' + abs.map(esc).join(' · ') + '</div>' : '') + (extra || '') + '</div></div>';
  }
  function heroPortrait(hero, scale) { return icon(hero.portrait, scale || 2); }
  function skillHtml(id, lvl) { const s = H3.Skills.get(id); return '<span class="skill" title="' + esc(H3.Skills.describe(id, lvl)) + '">' + icon('sk_' + id) + '<b>' + esc(s.name) + '</b> ' + esc(H3.Skills.levelName(lvl)) + '</span>'; }

  /**
   * Тап и долгое нажатие на одном элементе (мышь и палец). long() вызывается через 500 мс удержания и
   * гасит последующий tap; сдвиг пальца > 8 px отменяет и то и другое (это прокрутка).
   */
  function press(node, h) {
    let timer = null, start = null, longed = false;
    node.addEventListener('pointerdown', e => { if (e.button > 0) return; start = [e.clientX, e.clientY]; longed = false; clearTimeout(timer); if (h.long) timer = setTimeout(() => { longed = true; start = null; h.long(e); }, 500); });
    node.addEventListener('pointermove', e => { if (start && Math.hypot(e.clientX - start[0], e.clientY - start[1]) > 8) { clearTimeout(timer); start = null; } });
    node.addEventListener('pointerup', e => { clearTimeout(timer); const ok = !!start; start = null; if (ok && !longed && h.tap) h.tap(e); });
    node.addEventListener('pointercancel', () => { clearTimeout(timer); start = null; });
    node.addEventListener('contextmenu', e => { if (h.long) { e.preventDefault(); if (!longed) h.long(e); longed = false; } });
    node.addEventListener('click', e => { if (longed) { e.preventDefault(); e.stopPropagation(); longed = false; } });
  }
  /** Слоты армии: тап — onTap(i, e), долгое нажатие — карточка существа с числом. */
  function bindArmy(root, army, onTap) {
    root.querySelectorAll('.army7 .slot').forEach((slot, i) => press(slot, {
      tap: e => onTap(i, e),
      long: () => { const st = army[i]; if (!st || st.n <= 0) return; const c = C.get(st.cid); modal({ title: c.name + ' ×' + st.n, html: creatureCard(c) }); },
    }));
  }
  /** Панель выбранного отряда: кому куда, «Разделить», «Отмена». */
  function selBarHtml(st, split) {
    const c = C.get(st.cid);
    return '<div class="selbar row"><span class="grow small">' + (split ? 'Куда положить ' + esc(c.name) + ' ×' + split + '? Тапни по слоту.' : esc(c.name) + ' ×' + st.n + ' — тапни, куда переместить') + '</span>'
      + (st.n > 1 && !split ? '<button class="sm" data-split>Разделить</button>' : '') + '<button class="sm" data-unsel>Отмена</button></div>';
  }

  /** Ввод числа с ползунком: returns Promise<number|null> */
  function askNumber(title, html, max, def, unitCost, res) {
    const wrap = el('div', '', html + '<div class="row" style="margin-top:8px"><input type="range" min="1" max="' + max + '" value="' + (def || max) + '" class="grow"><input type="number" min="1" max="' + max + '" value="' + (def || max) + '" style="width:70px"></div><div class="small muted total"></div>');
    const range = wrap.querySelector('input[type=range]'), num = wrap.querySelector('input[type=number]'), total = wrap.querySelector('.total');
    const upd = v => { v = U.clamp(+v || 1, 1, max); range.value = v; num.value = v; if (unitCost) total.innerHTML = 'Итого: ' + costHtml(U.mulCost(unitCost, v), res); };
    range.oninput = () => upd(range.value); num.oninput = () => upd(num.value); upd(def || max);
    // быстрые значения — на телефоне ползунком точное число ловить неудобно
    if (max > 1) { const q = el('div', 'row quick'); q.innerHTML = '<button class="sm" data-q="1">1</button><button class="sm" data-q="' + Math.max(1, Math.floor(max / 2)) + '">Половина</button><button class="sm" data-q="' + max + '">Все (' + max + ')</button>'; q.querySelectorAll('[data-q]').forEach(b => { b.onclick = () => upd(b.dataset.q); }); wrap.appendChild(q); }
    return modal({ title, html: wrap, buttons: [{ label: 'OK', cls: 'primary', value: 'ok' }, { label: 'Отмена', value: null }] }).then(v => v === 'ok' ? +num.value : null);
  }

  H3.UI = { $, el, esc, modal, closeTop, alert, confirm, choose, toast, tip, hideTip, icon, resIcon, costHtml, resLine, slotHtml, armyHtml, countWord, creatureCard, heroPortrait, skillHtml, askNumber, dlgHtml, press, bindArmy, selBarHtml, stackDepth: () => stack.length };
})(typeof window !== 'undefined' ? window : globalThis);
