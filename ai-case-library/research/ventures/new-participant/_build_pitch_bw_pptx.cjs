/* Океан Тех · «Новый участник экономики» — 30 слайдов, ч/б.
   Стиль повторяет grid-9block-deck-bw: белый фон, чёрный текст, серые рамки,
   Arial для контента, Courier New с разрядкой для надзаголовков.
   Акцент один — инверсия: чёрная плашка с белым текстом. */

const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.lang = "ru-RU";

const W = 13.33, M = 0.6, CW = W - 2 * M;
const C = { ink: "000000", ink2: "333333", ink3: "555555", white: "FFFFFF" };
const BORDER = { color: "999999", width: 0.75 };
const BORDER_INK = { color: "000000", width: 0.75 };
const F = "Arial", MONO = "Courier New";
const TOTAL = 30;
const PH = "_team/bw/";
let n = 0;

function chrome(s, withNumber = true) {
  s.addText("ОКЕАН ТЕХ", { x: W - M - 2.5, y: 0.35, w: 2.5, h: 0.3, align: "right", fontFace: MONO,
    fontSize: 9, color: C.ink3, charSpacing: 3, isTextBox: true, margin: 0 });
  if (withNumber) s.addText(`${n} / ${TOTAL}`, { x: W - M - 1.5, y: 7.0, w: 1.5, h: 0.3, align: "right",
    fontFace: MONO, fontSize: 9, color: C.ink3, isTextBox: true, margin: 0 });
}

/* Базовый слайд: надзаголовок, заголовок-тезис, необязательный подзаголовок.
   Возвращает слайд и y, с которого можно класть контент. */
function base(eyebrow, title, thesis, opts = {}) {
  n++;
  const s = pres.addSlide();
  s.background = { color: C.white };
  chrome(s);
  if (eyebrow) s.addText(eyebrow.toUpperCase(), { x: M, y: 0.45, w: 9, h: 0.3, fontFace: MONO, fontSize: 9.5,
    color: C.ink3, charSpacing: 3, isTextBox: true, margin: 0 });
  const ts = opts.titleSize || 28;
  const perLine = Math.floor(115 * 28 / ts);
  const lines = Math.max(1, Math.ceil(title.length / perLine));
  const th = lines * (ts / 72) * 1.25;
  s.addText(title, { x: M, y: 0.82, w: CW, h: th + 0.1, fontFace: F, fontSize: ts, bold: true, color: C.ink,
    valign: "top", isTextBox: true, margin: 0, lineSpacingMultiple: 1.08 });
  let y = 0.82 + th + 0.22;
  if (thesis) {
    const tl = Math.max(1, Math.ceil(thesis.length / 118));
    const hh = tl * 0.3 + 0.1;
    s.addText(thesis, { x: M, y, w: CW, h: hh, fontFace: F, fontSize: 16, color: C.ink2,
      valign: "top", isTextBox: true, margin: 0, lineSpacingMultiple: 1.15 });
    y += hh + 0.28;
  }
  return { s, y };
}

/* Слайд-утверждение: одна фраза на весь слайд. */
function statement(eyebrow, text, size = 38) {
  n++;
  const s = pres.addSlide();
  s.background = { color: C.white };
  chrome(s);
  if (eyebrow) s.addText(eyebrow.toUpperCase(), { x: M, y: 0.45, w: 9, h: 0.3, fontFace: MONO, fontSize: 9.5,
    color: C.ink3, charSpacing: 3, isTextBox: true, margin: 0 });
  s.addText(text, { x: M, y: 1.9, w: CW - 0.8, h: 3.6, fontFace: F, fontSize: size, bold: true, color: C.ink,
    valign: "middle", isTextBox: true, margin: 0, lineSpacingMultiple: 1.1 });
  s.addShape(pres.shapes.RECTANGLE, { x: M, y: 5.9, w: 1.6, h: 0.02, fill: { color: C.ink }, line: { width: 0 } });
  return s;
}

/* Карточки в ряд: stat (крупное число), step (надпись + заголовок + текст), word (слово вместо числа). */
function cards(s, y, h, items, kind) {
  const gap = 0.25, cw = (CW - gap * (items.length - 1)) / items.length;
  items.forEach((it, i) => {
    const x = M + i * (cw + gap);
    const inv = !!it.inv;
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: cw, h, fill: { color: inv ? C.ink : C.white },
      line: inv ? BORDER_INK : BORDER });
    const fg = inv ? C.white : C.ink, fg2 = inv ? "DDDDDD" : C.ink2, fg3 = inv ? "AAAAAA" : C.ink3;
    if (kind === "stat" || kind === "word") {
      const bigSize = kind === "word" ? 30 : (it.n.length > 9 ? 30 : 40);
      s.addText(it.n, { x: x + 0.32, y: y + 0.3, w: cw - 0.64, h: 0.85, fontFace: F, fontSize: bigSize,
        bold: true, color: fg, isTextBox: true, margin: 0, valign: "top", fit: "shrink" });
      s.addText(it.l, { x: x + 0.32, y: y + 1.2, w: cw - 0.64, h: h - 1.4, fontFace: F, fontSize: 13,
        color: fg2, isTextBox: true, margin: 0, valign: "top", lineSpacingMultiple: 1.12 });
    } else {
      s.addText((it.num || "").toUpperCase(), { x: x + 0.3, y: y + 0.25, w: cw - 0.6, h: 0.3, fontFace: MONO,
        fontSize: 9.5, color: fg3, charSpacing: 2, isTextBox: true, margin: 0 });
      s.addText(it.head, { x: x + 0.3, y: y + 0.6, w: cw - 0.6, h: 0.55, fontFace: F, fontSize: 16, bold: true,
        color: fg, isTextBox: true, margin: 0, valign: "top" });
      s.addText(it.txt, { x: x + 0.3, y: y + 1.2, w: cw - 0.6, h: h - 1.4, fontFace: F, fontSize: 12.5,
        color: fg2, isTextBox: true, margin: 0, valign: "top", lineSpacingMultiple: 1.12 });
    }
  });
}

/* Таблица: заголовки колонок + строки. cols — доли ширины. inv — индекс колонки под инверсию. */
function table(s, y, cols, head, rows, opts = {}) {
  const gap = 0.18;
  const total = cols.reduce((a, b) => a + b, 0);
  const widths = cols.map(c => (CW - gap * (cols.length - 1)) * c / total);
  const xs = []; let x = M;
  widths.forEach(w => { xs.push(x); x += w + gap; });
  const rh = opts.rowHeight || 1.1;
  const inv = opts.inv;
  if (head) head.forEach((t, i) => {
    if (!t) return;
    s.addText(t.toUpperCase(), { x: xs[i], y, w: widths[i], h: 0.3, fontFace: MONO, fontSize: 9.5,
      color: C.ink3, charSpacing: 2, isTextBox: true, margin: 0 });
  });
  const y0 = head ? y + 0.42 : y;
  rows.forEach((row, r) => {
    const ry = y0 + r * (rh + 0.14);
    row.forEach((cell, i) => {
      const isInv = inv === i;
      s.addShape(pres.shapes.RECTANGLE, { x: xs[i], y: ry, w: widths[i], h: rh,
        fill: { color: isInv ? C.ink : C.white }, line: isInv ? BORDER_INK : BORDER });
      const lead = i === 0 && opts.boldFirst;
      s.addText(cell, { x: xs[i] + 0.25, y: ry + 0.18, w: widths[i] - 0.5, h: rh - 0.36, fontFace: F,
        fontSize: isInv ? (opts.invSize || 20) : (lead ? 17 : (opts.size || 13.5)),
        bold: isInv || lead, color: isInv ? C.white : C.ink, isTextBox: true, margin: 0,
        valign: opts.valign || "middle", lineSpacingMultiple: 1.1, fit: "shrink" });
    });
  });
  return y0 + rows.length * (rh + 0.14);
}

/* Строки-тезисы с тонкой линейкой. */
function rows(s, y, items, opts = {}) {
  const rh = opts.rowHeight || 0.62;
  items.forEach((t, i) => {
    const ry = y + i * rh;
    s.addShape(pres.shapes.RECTANGLE, { x: M, y: ry, w: CW, h: 0.014, fill: { color: "CCCCCC" }, line: { width: 0 } });
    s.addText(t, { x: M, y: ry + 0.14, w: CW - 0.4, h: rh - 0.2, fontFace: F, fontSize: opts.size || 15,
      color: C.ink, isTextBox: true, margin: 0, valign: "top", lineSpacingMultiple: 1.1 });
  });
  return y + items.length * rh;
}

/* Центрирует блок высотой blockH в свободном поле от yTop до низа слайда. */
const BOTTOM = 6.55;
function place(yTop, blockH) { return yTop + Math.max(0, (BOTTOM - yTop - blockH) / 2); }

function line(s, y, h, text, opts = {}) {
  s.addText(text, { x: M, y, w: CW - 0.4, h, fontFace: F, fontSize: opts.size || 15, bold: !!opts.bold,
    color: opts.color || C.ink, isTextBox: true, margin: 0, valign: "top", lineSpacingMultiple: 1.15 });
}

/* Крупная фраза-точка внизу слайда. */
function punch(s, y, text, size = 22) {
  s.addShape(pres.shapes.RECTANGLE, { x: M, y: y - 0.2, w: CW, h: 0.02, fill: { color: C.ink }, line: { width: 0 } });
  s.addText(text, { x: M, y, w: CW - 0.4, h: 0.8, fontFace: F, fontSize: size, bold: true, color: C.ink,
    isTextBox: true, margin: 0, valign: "top", lineSpacingMultiple: 1.1 });
}

function arrow(s, x, y) {
  s.addText("→", { x, y, w: 0.4, h: 0.4, fontFace: F, fontSize: 20, color: C.ink3, align: "center",
    isTextBox: true, margin: 0 });
}

/* ── 1 · Обложка ─────────────────────────────────────────────────────── */
{
  n++;
  const s = pres.addSlide();
  s.background = { color: C.white };
  s.addText("ОКЕАН ТЕХ", { x: M, y: 0.6, w: 5, h: 0.35, fontFace: MONO, fontSize: 11, color: C.ink,
    charSpacing: 4, isTextBox: true, margin: 0 });
  s.addText("Мы строим институты\nдля нового участника экономики.",
    { x: M, y: 1.9, w: CW, h: 2.3, fontFace: F, fontSize: 42, bold: true, color: C.ink, isTextBox: true,
      margin: 0, valign: "top", lineSpacingMultiple: 1.06 });
  s.addShape(pres.shapes.RECTANGLE, { x: M, y: 4.45, w: 2.2, h: 0.03, fill: { color: C.ink }, line: { width: 0 } });
  s.addText("Труд. Личность. Капитал. Три института для программ, которые уже работают, говорят от своего имени и тратят деньги.",
    { x: M, y: 4.8, w: 10.6, h: 1.0, fontFace: F, fontSize: 17, color: C.ink2, isTextBox: true, margin: 0,
      valign: "top", lineSpacingMultiple: 1.15 });
  s.addText("Программа на три года · 10 млн $", { x: M, y: 6.0, w: 8, h: 0.4, fontFace: F, fontSize: 14,
    color: C.ink2, isTextBox: true, margin: 0 });
  s.addText("2026", { x: W - M - 2, y: 6.6, w: 2, h: 0.3, align: "right", fontFace: MONO, fontSize: 10,
    color: C.ink3, isTextBox: true, margin: 0 });
}

/* ── 2 · Как это было раньше ─────────────────────────────────────────── */
{
  const { s, y } = base("Часть I · Концепция", "Сначала участником был человек. Потом — компания. Теперь — программа.", "");
  const CY = place(y + 0.3, 3.3 + 0);
  cards(s, CY, 3.3, [
    { num: "До XVII века", head: "Ремесленник и цех", txt: "Работает своими руками, отвечает своим именем, держит деньги при себе. Участник экономики — это тело, которое можно позвать, нанять и с которого можно спросить." },
    { num: "XVII век", head: "Акционерное общество", txt: "Появляется участник без тела. Компания владеет имуществом, нанимает людей, судится и платит налоги — и живёт дольше тех, кто её создал." },
    { num: "2020-е", head: "Автономная программа", txt: "Работает без человека за пультом, обращается к людям от своего имени и тратит деньги. Участник уже есть — институтов под него ещё нет.", inv: true },
  ], "step");
}

/* ── 3 · Что нужно, чтобы стать участником ───────────────────────────── */
{
  const { s, y } = base("Часть I · Концепция", "Чтобы стать участником экономики, нужны три вещи", "");
  const CY = place(y + 0.3, 3.2 + 0);
  cards(s, CY, 3.2, [
    { n: "Труд", l: "Уметь выполнять работу, за которую платят деньги. Не помогать в работе, а делать её и отвечать за результат." },
    { n: "Личность", l: "Иметь имя и лицо, которым доверяют. Того, кого нельзя назвать, нельзя ни нанять, ни полюбить, ни привлечь к ответу." },
    { n: "Капитал", l: "Владеть деньгами и распоряжаться ими. Иметь счёт, лимит и право на трату — без этого участник остаётся инструментом." },
  ], "word");
}

/* ── 4 · Институты (главный слайд) ───────────────────────────────────── */
{
  const { s, y } = base("Часть I · Концепция", "Под каждого участника мир построил свои институты",
    "Для людей их строили веками, для компаний — с XVII века. Для программ их нет ни одного.");
  table(s, y, [1.15, 1.6, 1.6, 1.6], ["", "Для людей", "Для компаний", "Для программ"], [
    ["Труд", "Цеха и биржи труда", "Найм и аутсорсинг", "Океан Тех"],
    ["Личность", "Имя и репутация", "Торговая марка", "Океан Тех"],
    ["Капитал", "Банки", "SWIFT и корпоративные счета", "Океан Тех"],
  ], { boldFirst: true, inv: 3, rowHeight: 1.15, invSize: 22 });
}

/* ── 5 · Что мы строим ───────────────────────────────────────────────── */
{
  const { s, y } = base("Часть I · Концепция", "Что мы строим", "Три института — три бизнеса, каждый со своим продуктом и своими деньгами.");
  table(s, y, [1.0, 1.5, 1.7], ["Институт", "Что строим", "Продукт"], [
    ["Труд", "→   ИИ-сотрудники", "→   Сотрудник для отрасли"],
    ["Личность", "→   Персонажи и их аудитория", "→   Сериалы и персонажи для брендов"],
    ["Капитал", "→   Финансовая инфраструктура", "→   Учёт и контроль расходов на ИИ"],
  ], { boldFirst: true, rowHeight: 1.15, size: 16 });
}

/* ── 6 · Почему три, а не один ───────────────────────────────────────── */
{
  const { s, y } = base("Часть I · Концепция", "Банк и биржа труда — разные бизнесы. Но без обоих экономика не работает.", "");
  const CY = place(y + 0.3, 2.5 + 0.95);
  cards(s, CY, 2.5, [
    { num: "По отдельности", head: "Каждый институт самодостаточен", txt: "У каждого свой покупатель, своя выручка и свой рынок. Ни один не ждёт, пока заработают остальные, — любой из трёх можно предъявить как отдельную компанию." },
    { num: "Вместе", head: "Позиция, которую нельзя скопировать по частям", txt: "Труд даёт программе работу, Личность — имя, Капитал — деньги. Тот, кто повторит одно, получит продукт. Все три вместе дают положение, к которому идут годами.", inv: true },
  ], "step");
  punch(s, CY + 2.5 + 0.55, "Мы делаем не три продукта. Мы делаем участника целиком.", 20);
}

/* ── 7 · Почему сейчас ───────────────────────────────────────────────── */
{
  const { s, y } = base("Часть I · Концепция", "Почему сейчас", "");
  const CY = place(y + 0.2, 3.2 + 0);
  cards(s, CY, 3.2, [
    { num: "Стоимость", head: "Упала в десятки раз", txt: "Создание продукта за два года подешевело в десятки раз. Дорого стало не делать, а выбирать, что именно делать." },
    { num: "Скорость", head: "Годы стали месяцами", txt: "То, на что уходили годы и сто человек, небольшая команда делает за месяцы. Размер студии перестал определять размер замысла." },
    { num: "Поле", head: "Целое не собрал никто", txt: "Крупные игроки скупают отдельные куски — счётчики, ассистентов, студии. Институт как целое пока не строит никто.", inv: true },
  ], "step");
}

/* ── 8 · Окно ────────────────────────────────────────────────────────── */
statement("Часть I · Концепция", "Институты закладывают один раз.\nЧерез пять лет места будут заняты.", 40);

/* ── 9 · Труд · институт ─────────────────────────────────────────────── */
statement("Часть II · Труд", "Софт продавали по числу людей.\nМы продаём саму работу.", 40);

/* ── 10 · Что делаем ─────────────────────────────────────────────────── */
{
  const { s, y } = base("Часть II · Труд", "ИИ-сотрудник для отрасли",
    "Не программа, которой учатся пользоваться, а сотрудник, которому дают задачу.");
  const CY = place(y + 0.2, 3.1 + 0);
  cards(s, CY, 3.1, [
    { num: "Не инструмент", head: "Ему дают задачу", txt: "Клиент не осваивает интерфейс и не описывает шаги. Он формулирует работу так же, как поставил бы её человеку, и получает сделанное." },
    { num: "Отраслевой", head: "Он знает отрасль", txt: "Внутри — правила, документы и порядок работы конкретной отрасли. Универсальный ассистент так не умеет: он знает всё и не отвечает ни за что." },
    { num: "Проверяемый", head: "Результат принимает человек", txt: "Проверка встроена в продукт, а не оставлена клиенту. Ответственность за результат остаётся на нас — за это и платят.", inv: true },
  ], "step");
}

/* ── 11 · Три цифры ──────────────────────────────────────────────────── */
{
  const { s, y } = base("Часть II · Труд", "Три цифры", "");
  const CY = place(y + 0.2, 2.9 + 0.95);
  cards(s, CY, 2.9, [
    { n: "55 000 €", l: "в год стоит живой сотрудник на этой роли — с налогами, рабочим местом и отпуском." },
    { n: "12 000 €", l: "в год стоит наш. Разница не в проценте экономии, а в том, что роль закрывается там, где на неё не хватало бюджета." },
    { n: "40 000", l: "компаний в отрасли, и у каждой таких ролей от двух до десяти.", inv: true },
  ], "stat");
  punch(s, CY + 2.9 + 0.55, "Мы продаём не подписку на софт, а закрытую роль.", 20);
}

/* ── 12 · Это уже принесло деньги ────────────────────────────────────── */
{
  const { s, y } = base("Часть II · Труд", "Это уже принесло деньги в пяти отраслях", "");
  const yy = table(s, y, [1.1, 1.5, 1.2], ["Компания", "Отрасль", "Деньги"], [
    ["Harvey", "Юристы", "Оценка $11 млрд"],
    ["Legora", "Юристы, Стокгольм", "Выручка более $100 млн"],
    ["EliseAI", "Недвижимость", "Выручка $200 млн"],
    ["Basis", "Бухгалтерия", "Оценка $1,15 млрд"],
    ["Parloa", "Клиентский сервис, Берлин", "Оценка $3 млрд"],
  ], { boldFirst: true, rowHeight: 0.62, size: 13.5 });
  line(s, yy + 0.15, 0.4, "Две из пяти — европейские.", { size: 15, bold: true });
}

/* ── 13 · Масштаб ────────────────────────────────────────────────────── */
{
  const { s, y } = base("Часть II · Труд", "Масштаб", "");
  const CY = place(y + 0.2, 2.6 + 0.95);
  cards(s, CY, 2.6, [
    { num: "Ступень 1", head: "Один сотрудник для одной задачи", txt: "Одна роль, один отдел, понятный счёт. Клиент сравнивает нас с зарплатой, а не с тарифом на софт." },
    { num: "Ступень 2", head: "Штат из десятка ролей, оплата за работу", txt: "Компания берёт не программу, а команду. Платит за объём сделанного, как платила бы подрядчику." },
    { num: "Ступень 3", head: "Смешанные команды из людей и программ", txt: "Люди и ИИ-сотрудники работают в одном процессе, и граница между наймом и подпиской исчезает.", inv: true },
  ], "step");
  punch(s, CY + 2.6 + 0.55, "Это не ИТ-бюджет. Это фонд оплаты труда — он в разы больше.", 24);
}

/* ── 14 · Почему мы возьмём эту отрасль ──────────────────────────────── */
{
  const { s, y } = base("Часть II · Труд", "Почему мы возьмём эту отрасль", "");
  rows(s, place(y + 0.3, 3 * 1.35), [
    "Прямой доступ к первым клиентам — мы уже работаем с этими компаниями и знаем, кто принимает решение.",
    "Отраслевой партнёр в команде: человек, который делал эту работу руками и отвечает за то, что продукт годится в дело.",
    "Опыт корпоративных продаж в США и ЕС — длинный цикл, служба безопасности, юристы, закупки.",
  ], { rowHeight: 1.35, size: 19 });
}

/* ── 15 · Личность · институт ────────────────────────────────────────── */
{
  const { s, y } = base("Часть III · Личность", "Персонажей в мире мало, потому что их дорого создавать.", "");
  const CY = place(y + 0.3, 2.2 + 0.95);
  cards(s, CY, 2.2, [
    { num: "США", head: "Миньоны", txt: "Годы работы студии и бюджет большого кино." },
    { num: "Россия", head: "Маша и Медведь", txt: "Десять лет производства и постоянная команда." },
    { num: "Финляндия", head: "Angry Birds", txt: "Годы попыток до того, как персонаж стал узнаваемым." },
  ], "step");
  punch(s, CY + 2.2 + 0.55, "Поэтому мировые персонажи принадлежат нескольким студиям. Вход стоил как завод.", 20);
}

/* ── 16 · Что изменилось ─────────────────────────────────────────────── */
{
  const { s, y } = base("Часть III · Личность", "Что изменилось", "");
  const t16 = place(y + 0.1, 0.42 + 2 * 1.44 + 0.95);
  table(s, t16, [1.0, 1.3, 1.3], ["", "Было", "Стало"], [
    ["Серия", "Месяцы и целая студия", "3 дня и 400 €"],
    ["Новый персонаж", "Год и больше", "3 недели"],
  ], { boldFirst: true, inv: 2, rowHeight: 1.3, size: 16, invSize: 24 });
  punch(s, t16 + 0.42 + 2 * 1.44 + 0.4, "Цена попытки упала настолько, что можно пробовать двадцать раз.", 20);
}

/* ── 17 · Наши персонажи ─────────────────────────────────────────────── */
{
  const { s, y } = base("Часть III · Личность", "Наши персонажи", "");
  const pw = 7.9, phh = 3.6;
  s.addShape(pres.shapes.RECTANGLE, { x: M, y: y + 0.2, w: pw, h: phh, fill: { color: "F2F2F2" }, line: BORDER });
  s.addText("Кадры из собственных сериалов", { x: M, y: y + 0.2 + phh / 2 - 0.25, w: pw, h: 0.5, align: "center",
    fontFace: MONO, fontSize: 11, color: C.ink3, charSpacing: 2, isTextBox: true, margin: 0 });
  const rx = M + pw + 0.3, rw = CW - pw - 0.3;
  const stats = [["24", "серии выпущено"], ["380 000", "просмотров первой серии"], ["12 000", "подписчиков"]];
  stats.forEach((st, i) => {
    const yy = y + 0.2 + i * (phh / 3);
    s.addShape(pres.shapes.RECTANGLE, { x: rx, y: yy, w: rw, h: phh / 3 - 0.15,
      fill: { color: i === 0 ? C.ink : C.white }, line: i === 0 ? BORDER_INK : BORDER });
    s.addText(st[0], { x: rx + 0.3, y: yy + 0.15, w: rw - 0.6, h: 0.6, fontFace: F, fontSize: 32, bold: true,
      color: i === 0 ? C.white : C.ink, isTextBox: true, margin: 0, valign: "top", fit: "shrink" });
    s.addText(st[1], { x: rx + 0.3, y: yy + 0.75, w: rw - 0.6, h: 0.4, fontFace: F, fontSize: 12.5,
      color: i === 0 ? "DDDDDD" : C.ink2, isTextBox: true, margin: 0, valign: "top" });
  });
}

/* ── 18 · Кто платит ─────────────────────────────────────────────────── */
{
  const { s, y } = base("Часть III · Личность", "Кто платит", "");
  const CY = place(y + 0.2, 3.0 + 0);
  cards(s, CY, 3.0, [
    { num: "Бренды", head: "48 000 € в год за собственного персонажа", txt: "Персонаж живёт постоянно: выходит каждую неделю, отвечает аудитории, стареет вместе с брендом. Это меньше, чем один маркетолог в штате, — и заметнее любой рекламной кампании." },
    { num: "Мы сами", head: "Всё, что делаем для себя, остаётся нашим", txt: "Зрители, права и лицензии не уходят заказчику. Каждый запуск для брендов оплачивает производство, а собственная библиотека растёт бесплатно.", inv: true },
  ], "step");
}

/* ── 19 · Масштаб ────────────────────────────────────────────────────── */
{
  const { s, y } = base("Часть III · Личность", "Масштаб", "");
  const CY = place(y + 0.2, 2.6 + 0.95);
  cards(s, CY, 2.6, [
    { num: "Ступень 1", head: "Производство на заказ", txt: "Бренд платит за серии. Деньги приходят сразу, права остаются у нас." },
    { num: "Ступень 2", head: "Персонаж как подписка", txt: "Бренд платит за то, что персонаж живёт: выходит, отвечает, развивается. Выручка становится регулярной." },
    { num: "Ступень 3", head: "Собственная библиотека прав", txt: "Лицензии, товары, игры и устройства. Персонаж перестаёт быть услугой и становится активом.", inv: true },
  ], "step");
  punch(s, CY + 2.6 + 0.55, "Из двадцати персонажей выстреливает один. Раньше двадцать попыток стоили как завод. Теперь — как машина.", 20);
}

/* ── 20 · Почему это институт ────────────────────────────────────────── */
statement("Часть III · Личность",
  "Персонаж — это не контент. Это имя, которому доверяют. Когда программы начнут работать и говорить с людьми, у них должны быть лица. Мы будем теми, кто их выдаёт.", 32);

/* ── 21 · Капитал · институт ─────────────────────────────────────────── */
{
  const { s, y } = base("Часть IV · Капитал", "Каждый новый класс плательщиков рождал новую финансовую инфраструктуру.", "");
  const chain = [["Люди", "Банки"], ["Компании", "SWIFT"], ["Люди в интернете", "Visa и PayPal"], ["Программы", "Океан Тех"]];
  const gap = 0.55, cw = (CW - gap * 3) / 4, cy = y + 0.6, ch = 2.2;
  chain.forEach((c, i) => {
    const x = M + i * (cw + gap), inv = i === 3;
    s.addShape(pres.shapes.RECTANGLE, { x, y: cy, w: cw, h: ch, fill: { color: inv ? C.ink : C.white },
      line: inv ? BORDER_INK : BORDER });
    s.addText(c[0].toUpperCase(), { x: x + 0.28, y: cy + 0.3, w: cw - 0.56, h: 0.5, fontFace: MONO, fontSize: 10,
      color: inv ? "AAAAAA" : C.ink3, charSpacing: 2, isTextBox: true, margin: 0, valign: "top", fit: "shrink" });
    s.addText(c[1], { x: x + 0.28, y: cy + 1.0, w: cw - 0.56, h: 0.9, fontFace: F, fontSize: 22, bold: true,
      color: inv ? C.white : C.ink, isTextBox: true, margin: 0, valign: "top", fit: "shrink" });
    if (i < 3) arrow(s, x + cw + 0.08, cy + ch / 2 - 0.2);
  });
  punch(s, cy + ch + 0.6, "Плательщик появляется раньше, чем инфраструктура под него.", 20);
}

/* ── 22 · Что делаем ─────────────────────────────────────────────────── */
{
  const { s, y } = base("Часть IV · Капитал", "Мы встаём между компанией и моделями", "");
  const boxes = ["Приложение компании", "Наш слой", "Модели ИИ"];
  const gap = 0.6, cw = (CW - gap * 2) / 3, cy = y + 0.25, ch = 1.5;
  boxes.forEach((b, i) => {
    const x = M + i * (cw + gap), inv = i === 1;
    s.addShape(pres.shapes.RECTANGLE, { x, y: cy, w: cw, h: ch, fill: { color: inv ? C.ink : C.white },
      line: inv ? BORDER_INK : BORDER });
    s.addText(b, { x: x + 0.25, y: cy, w: cw - 0.5, h: ch, fontFace: F, fontSize: 19, bold: true,
      color: inv ? C.white : C.ink, align: "center", valign: "middle", isTextBox: true, margin: 0, fit: "shrink" });
    if (i < 2) arrow(s, x + cw + 0.1, cy + ch / 2 - 0.2);
  });
  s.addText("СЧИТАЕМ  ·  ОГРАНИЧИВАЕМ  ·  ВЫСТАВЛЯЕМ СЧЕТА", { x: M + cw + gap - 0.6, y: cy + ch + 0.18,
    w: cw + 1.2, h: 0.35, fontFace: MONO, fontSize: 9.5, color: C.ink3, charSpacing: 1, align: "center",
    isTextBox: true, margin: 0 });
  cards(s, cy + ch + 0.7, 1.75, [
    { n: "98%", l: "специалистов по управлению ИТ-затратами занимаются расходами на ИИ. Год назад их было 63%." },
    { n: "$2,59 трлн", l: "мировые расходы на ИИ в 2026 году." },
  ], "stat");
}

/* ── 23 · Почему это станет главным ──────────────────────────────────── */
{
  const { s, y } = base("Часть IV · Капитал", "Программа тратит не так, как человек", "");
  const t23 = place(y + 0.1, 0.42 + 3 * 0.92 + 0.95);
  table(s, t23, [1.3, 1.3], ["Человек", "Программа"], [
    ["Тратит осознанно", "Не понимает, что тратит"],
    ["Ошибается на сотни", "Ошибается на десятки тысяч за час"],
    ["Отчёт в конце месяца достаточен", "Нужен запрет заранее"],
  ], { rowHeight: 0.78, size: 15 });
  punch(s, t23 + 0.42 + 3 * 0.92 + 0.4, "Главное здесь не перевод денег, а разрешение на трату.", 24);
}

/* ── 24 · Рынок уже движется ─────────────────────────────────────────── */
{
  const { s, y } = base("Часть IV · Капитал", "Рынок уже движется", "");
  const yy = table(s, y + 0.1, [1.0, 1.3, 0.9, 1.0], ["Компания", "Покупатель", "Когда", "Сумма"], [
    ["Metronome", "Stripe", "Январь 2026", "около $1 млрд"],
    ["Portkey", "Palo Alto Networks", "Май 2026", "не раскрыта"],
    ["Orb", "Adyen", "Июль 2026", "$335 млн"],
    ["Helicone", "Mintlify", "Март 2026", "не раскрыта"],
  ], { boldFirst: true, rowHeight: 0.66, size: 13.5 });
  line(s, yy + 0.2, 0.5, "Orb за пять лет привлёк $44 млн и продан за $335 млн.", { size: 16, bold: true });
}

/* ── 25 · Масштаб ────────────────────────────────────────────────────── */
{
  const { s, y } = base("Часть IV · Капитал", "Масштаб", "");
  const CY = place(y + 0.2, 3.2 + 0);
  cards(s, CY, 3.2, [
    { num: "Ступень 1", head: "Расходы компании", txt: "Компания видит, куда уходят деньги на ИИ, в разрезе команд и задач." },
    { num: "Ступень 2", head: "Бюджет каждой программы", txt: "У программы появляется свой лимит и своё право на трату, а не общий счёт компании." },
    { num: "Ступень 3", head: "Программы платят наружу", txt: "Программа расплачивается с другой программой сама, без человека в середине." },
    { num: "Ступень 4", head: "Реестр", txt: "Кто из машин чей и кому можно верить. Тот, кто ведёт реестр, держит всю систему.", inv: true },
  ], "step");
}

/* ── 26 · Одной фразой ───────────────────────────────────────────────── */
statement("Часть IV · Капитал",
  "Мы строим финансовую систему для машин.\nНачинаем со счётчика, потому что за счётчик платят уже сегодня.", 34);

/* ── 27 · Почему мы (+ команда) ──────────────────────────────────────── */
{
  const { s, y } = base("Часть V · Мы и сделка", "Почему мы", "");
  const gap = 0.25, cw = (CW - gap) / 2, ch = 0.95;
  const four = [
    ["Студия со сложными системами", "Финтех, высоконагруженные проекты, ИИ."],
    ["15 лет корпоративных продаж", "США и ЕС: длинный цикл, закупки, безопасность."],
    ["Собственные запущенные продукты", "И живая аудитория, которая их смотрит."],
    ["Инженеры и отраслевые эксперты", "Те, кто делал эту работу руками."],
  ];
  four.forEach((f, i) => {
    const x = M + (i % 2) * (cw + gap), yy = y + 0.1 + Math.floor(i / 2) * (ch + 0.18);
    s.addShape(pres.shapes.RECTANGLE, { x, y: yy, w: cw, h: ch, fill: { color: C.white }, line: BORDER });
    s.addText(f[0], { x: x + 0.28, y: yy + 0.16, w: cw - 0.56, h: 0.32, fontFace: F, fontSize: 15, bold: true,
      color: C.ink, isTextBox: true, margin: 0, fit: "shrink" });
    s.addText(f[1], { x: x + 0.28, y: yy + 0.5, w: cw - 0.56, h: 0.35, fontFace: F, fontSize: 12,
      color: C.ink2, isTextBox: true, margin: 0, valign: "top" });
  });
  const teamY = y + 0.1 + 2 * (ch + 0.18) + 0.3;
  s.addText("КОМАНДА", { x: M, y: teamY - 0.35, w: 4, h: 0.3, fontFace: MONO, fontSize: 9.5, color: C.ink3,
    charSpacing: 3, isTextBox: true, margin: 0 });
  const people = [
    ["penkov.png", "Дмитрий Пеньков", "Генеральный директор, основатель", "Предприниматель с опытом в технологиях. Buckswood School, МИРБИС, MBA при МГИМО."],
    ["moroshin.png", "Константин Морошин", "Глава Центра исследований", "Исследователь UX в B2B ИТ. 10+ лет корпоративных продаж ИТ."],
    ["kovalev.png", "Сергей Ковалёв", "Управляющий партнёр", "Предприниматель и стратег с опытом в области ИИ и Web3."],
  ];
  const tcw = (CW - 0.25 * 2) / 3, phh = 1.15;
  people.forEach((pp, i) => {
    const x = M + i * (tcw + 0.25);
    s.addShape(pres.shapes.RECTANGLE, { x, y: teamY, w: tcw, h: 1.55, fill: { color: C.white }, line: BORDER });
    s.addImage({ path: PH + pp[0], x: x + 0.2, y: teamY + 0.2, w: phh * 0.86, h: phh });
    const tx = x + 0.2 + phh * 0.86 + 0.18, tw = tcw - (phh * 0.86 + 0.55);
    s.addText(pp[1], { x: tx, y: teamY + 0.18, w: tw, h: 0.28, fontFace: F, fontSize: 12, bold: true,
      color: C.ink, isTextBox: true, margin: 0, fit: "shrink" });
    s.addText(pp[2], { x: tx, y: teamY + 0.45, w: tw, h: 0.35, fontFace: F, fontSize: 9.5, color: C.ink3,
      isTextBox: true, margin: 0, valign: "top" });
    s.addText(pp[3], { x: tx, y: teamY + 0.82, w: tw, h: 0.65, fontFace: F, fontSize: 9, color: C.ink2,
      isTextBox: true, margin: 0, valign: "top" });
  });
}

/* ── 28 · Что уже сделано ────────────────────────────────────────────── */
{
  const { s, y } = base("Часть V · Мы и сделка", "Что уже сделано", "");
  const CY = place(y + 0.2, 2.9 + 0);
  cards(s, CY, 2.9, [
    { n: "600 000 €", l: "выручка студии в год. Она платит за команду и даёт нам право строить вдолгую." },
    { n: "24 серии", l: "собственных сериалов выпущено, 380 000 просмотров первой серии." },
    { n: "6 брендов", l: "в переговорах о собственном персонаже.", inv: true },
  ], "stat");
}

/* ── 29 · План на 12 месяцев ─────────────────────────────────────────── */
{
  const { s, y } = base("Часть V · Мы и сделка", "План на 12 месяцев", "");
  const CY = place(y + 0.2, 3.1 + 0);
  cards(s, CY, 3.1, [
    { num: "Март", head: "Персонажи: 8 платящих брендов", txt: "Производство поставлено на поток, персонаж-подписка продан восьми брендам. Направление кормит себя само." },
    { num: "Июнь", head: "Первый ИИ-сотрудник в работе у 5 клиентов", txt: "Отраслевой сотрудник закрывает роль у пяти компаний, результат принимают их собственные люди." },
    { num: "Декабрь", head: "Выручка 2,5 млн €, третье направление запущено", txt: "Учёт расходов на ИИ работает у первых компаний. Все три института живые.", inv: true },
  ], "step");
}

/* ── 30 · Что просим ─────────────────────────────────────────────────── */
{
  const { s, y } = base("Часть V · Мы и сделка", "Программа на три года — $10 млн.\nПервый транш — $1,5 млн, 6 месяцев.", "", { titleSize: 32 });
  cards(s, y + 0.3, 3.0, [
    { num: "На что первый транш", head: "Команда 12 человек", txt: "Персонажи — до 8 платящих брендов. Запуск ИИ-сотрудника в отрасли, где у нас есть доступ к клиентам." },
    { num: "Что покажем через полгода", head: "Выручка, клиенты, стоимость запуска", txt: "Сколько стоит запустить продукт, сколько он приносит и как быстро повторяется — на собственных цифрах, а не в презентации." },
    { num: "Полная программа", head: "Три института", txt: "Команда 30–50 человек и выход на рынок США.", inv: true },
  ], "step");
  s.addText("Константин Морошин · Океан Тех · sales@okeantech.ru · okeantech.ru", { x: M, y: y + 3.5, w: CW, h: 0.35, fontFace: MONO, fontSize: 10, color: C.ink3,
    charSpacing: 2, isTextBox: true, margin: 0 });
}

pres.writeFile({ fileName: "output/pitch.pptx" }).then(f => console.log("written", f, "| slides:", n));
