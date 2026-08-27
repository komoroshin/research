#!/usr/bin/env node
/**
 * Валидация базы кейсов (пп. 40, 41, 43, 60 ТЗ).
 *
 * Ошибки (exit 1): пустые обязательные поля, дубли id, значения вне таксономии,
 * Grade D в основной библиотеке, метрика без источника, кейс без рабочего источника.
 * Предупреждения (exit 0): количественное утверждение в тексте без метрики,
 * вероятные дубли кейсов, перекос по вендору или процессу, недобор по квотам.
 */
import path from 'node:path';
import fs from 'node:fs';
import {
  DATA, RESEARCH, readJson, allowed, subindustryParent, normName, similarity, canonicalUrl, COLORS,
} from './lib.mjs';

const CASES_FILE = path.join(DATA, 'cases.json');
const errors = [];
const warnings = [];

const err = (id, msg) => errors.push(`${id}: ${msg}`);
const warn = (id, msg) => warnings.push(`${id}: ${msg}`);

if (!fs.existsSync(CASES_FILE)) {
  console.error(COLORS.red(`Файл не найден: ${CASES_FILE}`));
  process.exit(1);
}

const cases = readJson(CASES_FILE);
if (!Array.isArray(cases)) {
  console.error(COLORS.red('cases.json должен быть массивом'));
  process.exit(1);
}

const REQUIRED_STRINGS = ['id', 'title', 'client', 'problem', 'solution', 'result_summary'];
const REQUIRED_ARRAYS = ['business_process', 'ai_mechanisms', 'subindustry'];

/** Число с единицей измерения: 40 минут, 12%, 3,5 раза, 2x, 150 млн. */
const NUMERIC_CLAIM =
  /(\d[\d\s.,]*)\s*(%|проц|п\.п|раз|x\b|×|мин|час|сут|дн|недел|мес|год|лет|руб|₽|\$|млн|млрд|тыс|шт)/i;

const MONTHS =
  'январ|феврал|март|апрел|мая|мае|июн|июл|август|сентябр|октябр|ноябр|декабр';

/**
 * Даты и годы — не количественные утверждения о результате: «2 сентября 2025 года»
 * и «в 2024 году» не требуют метрики. Вырезаем их перед проверкой, иначе поля
 * scale и timeline дают шум на каждом кейсе.
 */
function stripDates(text) {
  return String(text ?? '')
    .replace(new RegExp(`\\d{1,2}\\s*(${MONTHS})\\w*\\s*\\d{4}?\\s*(года|г\\.)?`, 'gi'), ' ')
    .replace(new RegExp(`(${MONTHS})\\w*\\s*\\d{4}`, 'gi'), ' ')
    .replace(/\b(в|с|до|по|за)?\s*\d{4}\s*(году|год|года|г\.|гг\.)/gi, ' ')
    .replace(/\b(19|20)\d{2}\s*[–—-]\s*(19|20)\d{2}\b/g, ' ')
    .replace(/\b(19|20)\d{2}\b/g, ' ');
}

const seenIds = new Set();
const urlOwners = new Map();

for (const c of cases) {
  const id = c.id || '(без id)';

  for (const f of REQUIRED_STRINGS) {
    if (typeof c[f] !== 'string' || c[f].trim() === '') err(id, `пустое обязательное поле "${f}"`);
  }
  for (const f of REQUIRED_ARRAYS) {
    if (!Array.isArray(c[f]) || c[f].length === 0) err(id, `пустое обязательное поле "${f}"`);
  }

  if (seenIds.has(c.id)) err(id, 'дублирующийся id');
  seenIds.add(c.id);
  if (c.id && !/^[a-z0-9-]+$/.test(c.id)) err(id, 'id должен быть kebab-case из латиницы и цифр');

  if (typeof c.client_disclosed !== 'boolean') err(id, 'client_disclosed должен быть boolean');
  if (typeof c.vendor_claim !== 'boolean') err(id, 'vendor_claim должен быть boolean');
  if (!Array.isArray(c.vendor)) err(id, 'vendor должен быть массивом');
  if (!(c.budget_disclosed === null || typeof c.budget_disclosed === 'number')) {
    err(id, 'budget_disclosed: число, если бюджет официально раскрыт, иначе null');
  }

  // --- Значения только из таксономии ---
  const single = [
    ['industry', c.industry],
    ['region', c.region],
    ['stage', c.stage],
    ['deployment', c.deployment],
    ['evidence_grade', c.evidence_grade],
  ];
  for (const [key, value] of single) {
    if (!value) err(id, `не заполнено поле "${key}"`);
    else if (!allowed[key].has(value)) err(id, `значение "${value}" отсутствует в taxonomy.${key}`);
  }
  if (c.vendor_type && !allowed.vendor_type.has(c.vendor_type)) {
    err(id, `vendor_type "${c.vendor_type}" отсутствует в таксономии`);
  }

  const multi = [
    ['subindustry', c.subindustry],
    ['business_function', c.business_function],
    ['business_process', c.business_process],
    ['ai_mechanisms', c.ai_mechanisms],
    ['likely_buyer', c.likely_buyer],
  ];
  for (const [key, list] of multi) {
    for (const v of list ?? []) {
      if (!allowed[key].has(v)) err(id, `значение "${v}" отсутствует в taxonomy.${key}`);
    }
  }
  for (const s of c.subindustry ?? []) {
    const parent = subindustryParent.get(s);
    if (parent && parent !== c.industry) {
      err(id, `подотрасль "${s}" принадлежит отрасли "${parent}", а не "${c.industry}"`);
    }
  }

  if (c.evidence_grade === 'D') err(id, 'Grade D не допускается в основной библиотеке (п.16 ТЗ)');

  if (!Number.isInteger(c.sales_relevance) || c.sales_relevance < 1 || c.sales_relevance > 5) {
    err(id, 'sales_relevance должен быть целым от 1 до 5');
  }

  // --- Источники ---
  if (!Array.isArray(c.sources) || c.sources.length === 0) {
    err(id, 'нет ни одного источника');
  } else {
    for (const s of c.sources) {
      if (!s?.url || !/^https?:\/\//i.test(s.url)) err(id, `некорректный URL источника: ${s?.url}`);
      if (s?.type && !allowed.source_type.has(s.type)) err(id, `source type "${s.type}" вне таксономии`);
      if (s?.url) {
        const key = canonicalUrl(s.url);
        if (!urlOwners.has(key)) urlOwners.set(key, new Set());
        urlOwners.get(key).add(c.id);
      }
    }
    if (c.primary_source && !c.sources.some((s) => s.url === c.primary_source)) {
      err(id, 'primary_source не входит в массив sources');
    }
    if (!c.primary_source) warn(id, 'не указан primary_source');
  }

  // --- Метрики: ни одной цифры без источника (п.14, п.41 ТЗ) ---
  if (!Array.isArray(c.metrics)) {
    err(id, 'metrics должен быть массивом');
  } else {
    for (const [i, m] of c.metrics.entries()) {
      const tag = `metrics[${i}]`;
      if (!m.source_url || !/^https?:\/\//i.test(m.source_url)) {
        err(id, `${tag}: количественный показатель без рабочего source_url`);
      }
      if (!m.result || String(m.result).trim() === '') err(id, `${tag}: пустое поле result`);
      if (!m.metric_name || String(m.metric_name).trim() === '') err(id, `${tag}: пустое metric_name`);
      if (!allowed.metric_type.has(m.metric_type)) err(id, `${tag}: metric_type "${m.metric_type}" вне таксономии`);
      if (!allowed.metric_status.has(m.status)) {
        err(id, `${tag}: status должен быть measured / reported / projected`);
      }
      if (m.source_type && !allowed.source_type.has(m.source_type)) {
        err(id, `${tag}: source_type "${m.source_type}" вне таксономии`);
      }
    }
    // Цифра в прозе, но пустой metrics — типичный признак незакрытого источника.
    if (c.metrics.length === 0) {
      for (const field of ['result_summary', 'scale', 'solution']) {
        if (NUMERIC_CLAIM.test(stripDates(c[field]))) {
          warn(id, `quantitative metric without source: в поле "${field}" есть число, но metrics пуст`);
          break;
        }
      }
    }
  }

  // --- Согласованность грейда и содержимого ---
  if (c.evidence_grade === 'A' && (c.metrics?.length ?? 0) === 0) {
    warn(id, 'Grade A без измеримого результата — проверьте грейд (ожидается B или C)');
  }
  if (c.evidence_grade === 'A' && (c.sources?.length ?? 0) < 2) {
    warn(id, 'Grade A с единственным источником — обычно требуется подтверждение');
  }
  // Grade B по определению — «информация в основном со стороны подрядчика».
  // Значит A при vendor_claim и единственном vendor/platform-источнике противоречит
  // самой шкале, а не просто выглядит сомнительно. Это ошибка, а не предупреждение:
  // иначе завышенный грейд расходится по базе от направления к направлению.
  const onlyVendorSource =
    (c.sources?.length ?? 0) === 1 && ['vendor', 'platform'].includes(c.sources?.[0]?.type);
  if (c.evidence_grade === 'A' && c.vendor_claim === true && onlyVendorSource) {
    err(
      id,
      `Grade A при vendor_claim=true и единственном источнике типа "${c.sources[0].type}" — ` +
        'по определению шкалы это Grade B (информация в основном со стороны подрядчика)',
    );
  }
  if (c.client_disclosed === false && c.evidence_grade === 'A') {
    warn(id, 'клиент не назван при Grade A — обычно это уровень C');
  }
  if ((c.sales_relevance ?? 0) >= 4 && !c.entry_hypothesis) {
    warn(id, 'сильный sales-кейс без entry_hypothesis (п.20 ТЗ)');
  }
  if (c.stage === 'unknown') warn(id, 'стадия не определена');
}

// --- Дубликаты (п.43 ТЗ): client+solution, client+vendor, похожие заголовки, общие источники ---
for (let i = 0; i < cases.length; i++) {
  for (let j = i + 1; j < cases.length; j++) {
    const a = cases[i];
    const b = cases[j];
    const sameClient = normName(a.client) && normName(a.client) === normName(b.client);
    const pair = `${a.id} ~ ${b.id}`;

    if (sameClient) {
      const solSim = similarity(a.solution, b.solution);
      const titleSim = similarity(a.title, b.title);
      const sameVendor = (a.vendor ?? []).some((v) => (b.vendor ?? []).includes(v));
      // Порог предупреждения намеренно ниже порога автослияния в merge-research:
      // склейка необратимо теряет данные, а предупреждение стоит одной ручной проверки.
      // Один проект, описанный подрядчиком и клиентом разными словами, даёт Жаккар ~0.3.
      if (solSim > 0.3 || titleSim > 0.4) {
        warnings.push(`возможный дубль ${pair}: один клиент, похожее решение (solution ${solSim.toFixed(2)}, title ${titleSim.toFixed(2)})`);
      } else if (sameVendor && (a.business_process ?? []).some((p) => (b.business_process ?? []).includes(p))) {
        warnings.push(`проверьте ${pair}: один клиент, один подрядчик и общий процесс — возможно, это один проект`);
      }
    }
  }
}
for (const [url, owners] of urlOwners) {
  if (owners.size > 1) {
    const list = [...owners];
    // Общий источник у кейсов разных клиентов — норма (обзорная статья), у одного клиента — повод для склейки.
    const clients = new Set(list.map((id) => normName(cases.find((c) => c.id === id)?.client)));
    // Общий источник у одного клиента — повод для проверки только если совпадает и процесс:
    // обзорная статья часто описывает несколько РАЗНЫХ проектов одной компании,
    // и склеивать их запрещено (п.45 ТЗ: «не объединять два разных проекта в один»).
    if (clients.size === 1) {
      const items = list.map((id) => cases.find((c) => c.id === id));
      const overlap = items.some((a, i) =>
        items.slice(i + 1).some((b) => (a.business_process ?? []).some((p) => (b.business_process ?? []).includes(p))),
      );
      if (overlap) {
        warnings.push(`общий источник ${url} у кейсов одного клиента с общим процессом: ${list.join(', ')} — проверьте, не один ли это проект`);
      }
    }
  }
}

// --- Сводка по критериям приёмки (п.60 ТЗ) ---
const by = (fn) => cases.reduce((m, c) => m.set(fn(c), (m.get(fn(c)) ?? 0) + 1), new Map());
const grades = by((c) => c.evidence_grade);
const ru = cases.filter((c) => c.region === 'russia-cis').length;
const ab = (grades.get('A') ?? 0) + (grades.get('B') ?? 0);
const withMetrics = cases.filter((c) => (c.metrics?.length ?? 0) > 0).length;
const withSource = cases.filter((c) => (c.sources?.length ?? 0) > 0).length;

const vendorCounts = new Map();
for (const c of cases) for (const v of c.vendor ?? []) vendorCounts.set(v, (vendorCounts.get(v) ?? 0) + 1);
const topVendor = [...vendorCounts.entries()].sort((a, b) => b[1] - a[1])[0];
if (topVendor && topVendor[1] > 20) {
  warnings.push(`подрядчик "${topVendor[0]}" даёт ${topVendor[1]} кейсов — база рискует стать его каталогом (п.49 ТЗ)`);
}

const processCounts = new Map();
for (const c of cases) for (const p of new Set(c.business_process ?? [])) processCounts.set(p, (processCounts.get(p) ?? 0) + 1);
const topProcess = [...processCounts.entries()].sort((a, b) => b[1] - a[1])[0];
if (topProcess && cases.length && topProcess[1] / cases.length > 0.35) {
  warnings.push(`процесс "${topProcess[0]}" покрывает ${topProcess[1]} из ${cases.length} кейсов — проверьте широту (п.50 ТЗ)`);
}

const checks = [
  ['всего кейсов не меньше 150', cases.length >= 150, `${cases.length}`],
  ['нет Grade D', (grades.get('D') ?? 0) === 0, `D: ${grades.get('D') ?? 0}`],
  ['минимум 120 Grade A/B', ab >= 120, `A/B: ${ab}`],
  ['максимум 30 Grade C', (grades.get('C') ?? 0) <= 30, `C: ${grades.get('C') ?? 0}`],
  ['минимум 70 Россия/СНГ', ru >= 70, `${ru}`],
  ['минимум 50 не-Россия', cases.length - ru >= 50, `${cases.length - ru}`],
  ['у каждого кейса есть источник', withSource === cases.length, `${withSource}/${cases.length}`],
];

console.log('\n' + '='.repeat(72));
console.log('  ВАЛИДАЦИЯ БАЗЫ AI-КЕЙСОВ');
console.log('='.repeat(72));
console.log(`Кейсов: ${cases.length} | A: ${grades.get('A') ?? 0} B: ${grades.get('B') ?? 0} C: ${grades.get('C') ?? 0} D: ${grades.get('D') ?? 0}`);
console.log(`Россия/СНГ: ${ru} | Остальной мир: ${cases.length - ru} | С метриками: ${withMetrics}`);
console.log('-'.repeat(72));
for (const [title, ok, detail] of checks) {
  console.log(`${ok ? COLORS.green('  OK  ') : COLORS.yellow(' НЕДО ')} ${title} — ${detail}`);
}

if (warnings.length) {
  console.log('\n' + COLORS.yellow(`Предупреждений: ${warnings.length}`));
  for (const w of warnings.slice(0, 60)) console.log('  ! ' + w);
  if (warnings.length > 60) console.log(COLORS.dim(`  … ещё ${warnings.length - 60}`));
}

if (errors.length) {
  console.log('\n' + COLORS.red(`ОШИБОК: ${errors.length}`));
  for (const e of errors.slice(0, 100)) console.log('  x ' + e);
  if (errors.length > 100) console.log(COLORS.dim(`  … ещё ${errors.length - 100}`));
  console.log('');
  process.exit(1);
}

console.log('\n' + COLORS.green('Структурных ошибок нет.') + '\n');

fs.mkdirSync(RESEARCH, { recursive: true });
fs.writeFileSync(
  path.join(RESEARCH, 'validation-report.txt'),
  [
    `Проверка: ${new Date().toISOString()}`,
    `Кейсов: ${cases.length}`,
    ...checks.map(([t, ok, d]) => `${ok ? 'OK  ' : 'НЕДО'} ${t} — ${d}`),
    '',
    `Предупреждения (${warnings.length}):`,
    ...warnings.map((w) => '  ! ' + w),
  ].join('\n') + '\n',
  'utf8',
);
