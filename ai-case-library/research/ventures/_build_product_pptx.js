const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; pres.lang = "ru-RU";
const W = 13.33, M = 0.6, CW = W - 2 * M;
const C = { dark: "232323", ink: "141A22", lime: "D5F774", blue: "0460F5", subtle: "F7F7F7", white: "FFFFFF",
            cardDark: "343434", ink2: "5C6067", ink3: "8A8E94", wh2: "B8B8B8", wh3: "8C8C8C", ph: "E4E6EA", phDark: "3E3E3E" };
const F = "Arial", MONO = "Courier New";
let n = 0; const TOTAL = 7;
const PH = '_team/';
const MOCK = '_product/mock.png';

function base(dark, eyebrow, title, opts = {}, thesis = "") {
  n++;
  const s = pres.addSlide();
  s.background = { color: dark ? C.dark : C.white };
  const fg = dark ? C.white : C.ink;
  s.addText("ОКЕАН ТЕХ", { x: W - M - 2.5, y: 0.35, w: 2.5, h: 0.3, align: "right", fontFace: MONO, fontSize: 9,
    color: dark ? C.wh3 : C.ink3, charSpacing: 3, isTextBox: true, margin: 0 });
  if (eyebrow) s.addText(eyebrow.toUpperCase(), { x: M, y: 0.45, w: 8, h: 0.3, fontFace: MONO, fontSize: 9.5,
    color: dark ? C.lime : C.blue, charSpacing: 3, isTextBox: true, margin: 0 });
  s.addText(title, { x: M, y: 0.78, w: CW, h: 0.6, fontFace: F, fontSize: 30, bold: true, color: fg,
    valign: "top", isTextBox: true, margin: 0 });
  if (thesis) s.addText(thesis, { x: M, y: 1.4, w: CW, h: 0.75, fontFace: F, fontSize: 16, color: dark ? C.wh2 : C.ink2,
    valign: "top", isTextBox: true, margin: 0, lineSpacingMultiple: 1.1 });
  s.addText(`${n} / ${TOTAL}`, { x: W - M - 1.5, y: 7.0, w: 1.5, h: 0.3, align: "right", fontFace: MONO, fontSize: 9,
    color: dark ? C.wh3 : C.ink3, isTextBox: true, margin: 0 });
  return s;
}
function cards(s, dark, y, h, items, kind) {
  const gap = 0.25, cw = (CW - gap * (items.length - 1)) / items.length;
  items.forEach((it, i) => {
    const x = M + i * (cw + gap);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: cw, h, fill: { color: dark ? C.cardDark : C.subtle },
      line: { color: dark ? C.cardDark : C.subtle }, rectRadius: 0.18 });
    if (kind === "stat") {
      s.addText(it.n, { x: x + 0.35, y: y + 0.3, w: cw - 0.7, h: 0.9, fontFace: F, fontSize: 44, bold: true,
        color: dark ? C.white : C.ink, isTextBox: true, margin: 0, valign: "top" });
      s.addText(it.l, { x: x + 0.35, y: y + 1.25, w: cw - 0.7, h: h - 1.45, fontFace: F, fontSize: 13,
        color: dark ? C.wh2 : C.ink2, isTextBox: true, margin: 0, valign: "top" });
    } else if (kind === "step") {
      s.addText(it.num.toUpperCase(), { x: x + 0.3, y: y + 0.25, w: cw - 0.6, h: 0.3, fontFace: MONO, fontSize: 9.5,
        color: dark ? C.lime : C.blue, charSpacing: 2, isTextBox: true, margin: 0 });
      s.addText(it.head, { x: x + 0.3, y: y + 0.6, w: cw - 0.6, h: 0.45, fontFace: F, fontSize: 16, bold: true,
        color: dark ? C.white : C.ink, isTextBox: true, margin: 0 });
      s.addText(it.txt, { x: x + 0.3, y: y + 1.1, w: cw - 0.6, h: h - 1.3, fontFace: F, fontSize: 12.5,
        color: dark ? C.wh2 : C.ink2, isTextBox: true, margin: 0, valign: "top" });
    }
  });
}
function line(s, dark, y, h, text, opts = {}) {
  s.addText(text, { x: M, y, w: CW - 0.4, h, fontFace: F, fontSize: opts.size || 15, bold: !!opts.bold,
    color: opts.color || (dark ? C.white : C.ink), isTextBox: true, margin: 0, valign: "top", lineSpacingMultiple: 1.15 });
}
function punch(s, dark, y, text) {
  s.addText(text, { x: M, y, w: CW - 0.4, h: 0.5, fontFace: F, fontSize: 15, italic: true,
    color: dark ? C.lime : C.blue, isTextBox: true, margin: 0, valign: "top" });
}
function small(s, dark, y, text) {
  s.addText(text, { x: M, y, w: CW - 1.8, h: 0.5, fontFace: F, fontSize: 10, color: dark ? C.wh3 : C.ink3,
    isTextBox: true, margin: 0, valign: "top" });
}



// 0 · Титул
{
  n++;
  const s = pres.addSlide(); s.background = { color: C.dark };
  s.addText("ОКЕАН ТЕХ · ПРОДУКТ", { x: M, y: 0.6, w: 5, h: 0.3, fontFace: MONO, fontSize: 10, color: C.lime, charSpacing: 3, isTextBox: true, margin: 0 });
  s.addText("Океан Грид — ИИ-проектировщик подключения к сети",
    { x: M, y: 1.6, w: CW, h: 1.6, fontFace: F, fontSize: 40, bold: true, color: C.white, isTextBox: true, margin: 0, valign: "top", lineSpacingMultiple: 1.05 });
  s.addText("Площадка и мощность на входе — пакет проекта под подпись инженера на выходе. За недели, а не месяцы, и с первого раза через сетевую компанию.",
    { x: M, y: 3.5, w: 11, h: 1.1, fontFace: F, fontSize: 18, color: C.white, isTextBox: true, margin: 0, valign: "top" });
  s.addText("Электричество — новая нефть эпохи ИИ. Мы делаем инструмент для тех, кто её добывает.",
    { x: M, y: 4.8, w: 11, h: 0.5, fontFace: F, fontSize: 15, italic: true, color: C.lime, isTextBox: true, margin: 0 });
  s.addText("Персидский залив и Индия · 2026 · рабочее название продукта", { x: M, y: 6.6, w: 8, h: 0.3, fontFace: MONO, fontSize: 10, color: C.wh3, charSpacing: 2, isTextBox: true, margin: 0 });
  s.addNotes("Продуктовая форма для непрофильного инвестора: один продукт, один клиент, одна цена. Стратегия покупки фирм — на слайде «Запрос» как этап 2, не как суть.");
}

// 1 · Продукт
{
  const s = base(false, "что это", "1. Продукт", {}, "");
  s.addImage({ path: MOCK, x: M, y: 1.45, w: 7.9, h: 4.94 });
  const x = M + 8.2, w = CW - 8.2;
  const items = [
    ["Вход", "Площадка, нужная мощность, сетевая компания и точка подключения."],
    ["Выход", "Семь документов: схема подключения, расчёты, компоновка подстанции, спецификация, проверка по нормам сети, записка, пакет для подачи."],
    ["Инженер", "Проверяет, решает спорные места и подписывает. Без подписи пакет в сеть не уходит: ИИ делает работу, инженер отвечает."],
    ["Результат", "Пакет за недели вместо месяцев и проход через сеть с первого раза, без двух-трёх кругов правок."]];
  let y = 1.5;
  items.forEach(it => {
    s.addText(it[0].toUpperCase(), { x, y, w, h: 0.25, fontFace: MONO, fontSize: 9.5, color: C.blue, charSpacing: 2, isTextBox: true, margin: 0 });
    s.addText(it[1], { x, y: y + 0.27, w, h: 0.95, fontFace: F, fontSize: 12, color: C.ink, isTextBox: true, margin: 0, valign: "top" });
    y += 1.25;
  });
  small(s, false, 6.5, "На экране — концепт интерфейса, не работающая система; данные примера условные. Пять лет ожидания подключения — это очередь и оборудование; продукт ускоряет ту часть, которую клиент может ускорить деньгами: проект и его согласование.");
  s.addNotes("Не говорить «уже работает». Говорить: «так выглядит продукт после первого этапа; сегодня есть стек, на котором он собирается».");
}

// 2 · Кому и почём
{
  const s = base(true, "клиент, цена, почему купят", "2. Кому и почём", {},
    "Один клиент: инженерные компании и подрядчики, которые проектируют подключение дата-центров и электростанций. Платят за проект.");
  cards(s, true, 2.35, 2.25, [
    { num: "Клиент", head: "Инженерные компании", txt: "Небольшие и средние фирмы с лицензией и заказами: 89% компаний, строящих сети, не могут найти инженеров — заказов у них больше, чем рук." },
    { num: "Цена", head: "10–20% гонорара", txt: "Пакет подстанции стоит 0,5–1,0 млн $ — продукт берёт 50–150 тыс. $ за пакет. Клиент отдаёт долю гонорара, чтобы сделать в полтора-два раза больше проектов тем же штатом." },
    { num: "Почему купят", head: "Срок дороже денег", txt: "Их заказчик — дата-центр, у которого серверы уже куплены: месяц простоя стоит дороже всего проекта. Кто делает быстрее, тот и получает заказ." }], "step");
  line(s, true, 4.85, 1.0, "Где: Персидский залив и Индия — там строят больше всего, инженеров не хватает так же (Саудовская Аравия требует 30% местных инженеров), туда нас пускают. Рынок проектирования сетей только в Саудовской Аравии — порядка 450 млн $ в год; спрос дата-центров на электричество удваивается к 2030.", { size: 13 });
  small(s, true, 6.0, "Цена — допущение до первых пилотов. 450 млн $ — оценка: 3% (доля инжиниринга) от 15 млрд $ контрактов за год. Источники — на последнем слайде.");
  punch(s, true, 6.45, "Мегаватты ждут не железа. Они ждут людей с подписью.");
  s.addNotes("Цена 10–20% от гонорара — допущение; проверяется на пилотах. Не называть гиперскейлеров. США и Европа — позже и через партнёров.");
}

// 3 · Как это работает
{
  const s = base(false, "принцип, технология, сценарий", "3. Как это работает", {},
    "ИИ делает атомарные задачи, инженер решает и подписывает, сеть принимает с первого раза.");
  cards(s, false, 2.35, 2.05, [
    { num: "1", head: "Заявка", txt: "Инженерная фирма заводит проект: площадка, мощность, сетевая компания." },
    { num: "2", head: "ИИ считает и чертит", txt: "Агенты: расчёт схемы, чертежи подстанции и линии, спецификация с учётом сроков поставки." },
    { num: "3", head: "Проверка норм", txt: "База знаний хранит нормы конкретной сети; замечания — инженеру на решение." },
    { num: "4", head: "Подпись и подача", txt: "Инженер подписывает, пакет уходит в сеть. Каждый принятый пакет учит систему." }], "step");
  line(s, false, 4.65, 1.05, "Технология — мультиагентный фреймворк Океан Тех: каждый агент решает одну задачу, оркестрация собирает из них проект, многоуровневая память хранит нормы сетей и историю проектов. Продукт встраивается в инструменты инженеров (Bentley, AutoCAD), а не заменяет их.", { size: 13.5 });
  line(s, false, 5.75, 0.8, "Что даёт «с первого раза»: сегодня пакет ходит в сеть два-три круга; проверка по нормам до подачи снимает большую часть замечаний. Это и есть экономия месяцев для клиента.", { size: 13.5 });
  s.addNotes("Фреймворк — из корпоративной презентации: мультиагентная архитектура, многоуровневая память и база знаний, мониторинг и безопасность; 59% сокращения сроков по данным компании.");
}

// 4 · Почему мы и почему сейчас
{
  const s = base(true, "команда, стек, окно", "4. Почему мы — и почему сейчас", {},
    "Стек и команда уже есть; окно на рынке открылось этим летом.");
  const sw = (CW - 0.25 * 3) / 4;
  [["48", "проектов реализовано, 32 клиента из 7 отраслей"], ["64", "человека в штате: исследователи, инженеры, дизайнеры"], ["14", "исследователей и ML-инженеров; база из 277 верифицированных кейсов ИИ"], ["59%", "сокращение сроков создания решений на собственном фреймворке (по данным компании)"]].forEach((c, i) => {
    const x = M + i * (sw + 0.25);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 2.35, w: sw, h: 1.2, fill: { color: C.cardDark }, line: { color: C.cardDark }, rectRadius: 0.14 });
    s.addText(c[0], { x: x + 0.25, y: 2.45, w: 1.1, h: 0.5, fontFace: F, fontSize: 24, bold: true, color: C.white, isTextBox: true, margin: 0 });
    s.addText(c[1], { x: x + 1.3, y: 2.47, w: sw - 1.5, h: 1.0, fontFace: F, fontSize: 9.5, color: C.wh2, isTextBox: true, margin: 0, valign: "top" });
  });
  line(s, true, 3.8, 0.9, "Команда: Дмитрий Пеньков — генеральный директор и основатель; Константин Морошин — глава Центра исследований, 10+ лет продаж ИТ в энтерпрайзе; Сергей Ковалёв — управляющий партнёр, ИИ и Web3. Партнёр с электросетевой компанией — реальный поток проектов подключения для отладки.", { size: 13 });
  line(s, true, 4.8, 1.0, "Почему сейчас: за инженеров, которые проектируют сети, уже платят миллиарды — WSP купила POWER Engineers (4000 инженеров) за 1,78 млрд $. Гиганты только начали нанимать менеджеров по ИИ (Black & Veatch, август 2026); стартапы ИИ-инжиниринга для дата-центров появились этим летом (Marengo, Vela — YC 2026). В подключении к сети покупки фирм уже начались (E Source → CF Power, Littlejohn + GDS), но с продуктом, а не с людьми, и в Заливе и Индии — никого. Окно — год-два.", { size: 13 });
  line(s, true, 5.9, 0.7, "Чего пока нет, и это сказано честно: пилотов в энергетическом проектировании. Их даёт первый этап. Первый найм — инженер-партнёр с лицензией на целевом рынке.", { size: 13, bold: true });
  s.addNotes("Не «уникальная технология». Если спросят «а Bentley не сделает то же?» — Bentley делает помощника внутри своего софта; мы делаем пакет под нормы конкретной сети и под подпись — это работа фирмы, а не функция САПР.");
}

// 5 · Запрос
{
  const s = base(false, "сколько, на что, что дальше", "5. Запрос", {},
    "3 млн $ на 12 месяцев: продукт до пилота и первые оплаченные пакеты.");
  cards(s, false, 2.35, 2.05, [
    { num: "Первые 8 недель · 250 тыс. $", head: "Два пилота", txt: "Два реальных пакета на потоке партнёра: измеряем часы инженера до и после. Порог, ниже которого не идём дальше, — в полтора раза." },
    { num: "Месяцы 3–12 · 2,75 млн $", head: "Продукт и первые клиенты", txt: "Продукт до версии для инженерных фирм, нормы двух сетевых компаний в базе, две-три фирмы-клиента в Заливе или Индии, первые оплаченные пакеты." },
    { num: "Этап 2 · следующий раунд", head: "Масштабирование", txt: "Партнёрство или покупка инженерных фирм-клиентов: встроить продукт глубже и забирать не 10–20% гонорара, а весь. Ориентир — 20–30 млн $." }], "step");
  line(s, false, 4.65, 0.9, "Почему этап 2 — покупка фирм: продукт даёт долю гонорара, а фирма с продуктом внутри — весь гонорар и в полтора-два раза больше проектов. Малые фирмы стоят 5–7 годовых прибылей; 445 тысяч $ за инженера (WSP → POWER) платят за масштаб, не за ИИ. Это дистрибуция продукта, а не смена бизнеса.", { size: 13 });
  line(s, false, 5.6, 0.75, "Что получает инвестор: долю в новой международной компании, которая владеет продуктом и будущими фирмами; условия обсуждаем отдельно. Следующий шаг — демонстрация концепта и договорённость о первых восьми неделях.", { size: 13 });
  punch(s, false, 6.4, "Первые 250 тысяч — восемь недель. Если ИИ не даёт хотя бы полтора, вы узнаете это первым.");
  s.addText("Константин Морошин · Океан Тех · sales@okeantech.ru · okeantech.ru", { x: M, y: 6.85, w: CW, h: 0.3, fontFace: F, fontSize: 11, color: C.ink3, isTextBox: true, margin: 0 });
  s.addNotes("Этап 2 — в деке с первого дня, чтобы разворот к покупке фирм был запланированным этапом, а не сюрпризом. Наша проверка: софт в энергетике коммодитизируется; продукт — вход в разговор и в пилот, бизнес — группа фирм.");
}

// Источники
{
  const s = base(false, "Приложение", "Откуда цифры");
  const src = [
    "5 лет / 61 месяц; 2061 ГВт — LBNL, Queued Up: 2026 Edition. 89% работодателей — DOE, U.S. Energy & Employment Report 2025.",
    "Пакет подстанции 0,5–1,0 млн $ и доля инжиниринга ≈3% CAPEX — MISO Transmission Cost Estimation Guide. Цена продукта 10–20% гонорара — допущение до пилотов.",
    "15 млрд $ контрактов КСА (2025) — trade.gov; 450 млн $ — оценка (3% от 15 млрд $). 30% местных инженеров — HRSD КСА № 103105. Спрос ДЦ 415 → 950 ТВт·ч — IEA.",
    "1,78 млрд $ / 4000 сотрудников — WSP → POWER Engineers, 10.2024; 445 тыс. $ за инженера = 1,78 млрд / 4000 (группа на 4000 человек); малые фирмы 5,4–7,5× EBITDA — ROG Partners, см. engineering-rollup-passport.md. Black & Veatch — вакансия 27.08.2026. Marengo, Vela — YC 2026.",
    "48 проектов, 32 клиента, 64 сотрудника, 14 исследователей, 59% — корпоративная презентация Океан Тех (2026).",
    "Этап 2 (20–30 млн $) — финмодель roll-up: пять фирм по 2,8 млн $, ИИ-команда 1,2 млн $/год, потребность ≈21 млн $.",
  ];
  s.addText(src.map((t, i) => ({ text: t, options: { bullet: true, breakLine: i < src.length - 1 } })),
    { x: M, y: 2.0, w: CW, h: 4.6, fontFace: F, fontSize: 11.5, color: C.ink2, isTextBox: true, margin: 0, valign: "top", paraSpaceAfter: 6 });
}

pres.writeFile({ fileName: "grid-product-deck.pptx" }).then(f => console.log("written", f));
