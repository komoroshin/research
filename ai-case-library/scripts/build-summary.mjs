#!/usr/bin/env node
/**
 * Генерация research/executive-summary.md (п.63.8 ТЗ).
 *
 * Отвечает на шесть вопросов ТЗ строго по данным из cases.json.
 * Каждое утверждение здесь — производное от базы; там, где вывод является
 * интерпретацией, а не подсчётом, это помечено явно.
 */
import fs from 'node:fs';
import path from 'node:path';
import { DATA, RESEARCH, readJson, taxonomy, COLORS } from './lib.mjs';

const cases = readJson(path.join(DATA, 'cases.json'));
if (cases.length === 0) {
  console.error(COLORS.red('cases.json пуст — сначала соберите базу.'));
  process.exit(1);
}

const labels = new Map();
for (const group of [
  taxonomy.industries,
  taxonomy.business_processes,
  taxonomy.ai_mechanisms,
  taxonomy.metric_groups,
]) {
  for (const t of group) labels.set(t.id, t.label_ru);
}
const L = (id) => labels.get(id) ?? id;

/**
 * Согласование существительного с числительным по-русски: 1 кейс, 2 кейса, 5 кейсов.
 * Исключение — вторая десятка (11–14), где всегда родительный множественного.
 */
function plural(n, one, few, many) {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return many;
  const mod10 = n % 10;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
}

const isProd = (c) => c.stage === 'production' || c.stage === 'scaled-production';
const isStrong = (c) => c.evidence_grade === 'A' || c.evidence_grade === 'B';
const hasMeasured = (c) => c.metrics.some((m) => m.status === 'measured');

/** Считает сущности с разбивкой по «зрелости»: сколько всего, сколько в production, сколько с цифрами. */
function profile(keyOf) {
  const acc = new Map();
  for (const c of cases) {
    const keys = keyOf(c);
    for (const k of new Set(Array.isArray(keys) ? keys : [keys])) {
      const e = acc.get(k) ?? { total: 0, prod: 0, measured: 0, strong: 0, ru: 0 };
      e.total++;
      if (isProd(c)) e.prod++;
      if (hasMeasured(c)) e.measured++;
      if (isStrong(c)) e.strong++;
      if (c.region === 'russia-cis') e.ru++;
      acc.set(k, e);
    }
  }
  return [...acc.entries()].map(([id, v]) => ({ id, ...v }));
}

const byIndustry = profile((c) => c.industry).sort((a, b) => b.total - a.total);
const byProcess = profile((c) => c.business_process).sort((a, b) => b.total - a.total);
const byMech = profile((c) => c.ai_mechanisms).sort((a, b) => b.total - a.total);

const share = (n, d) => (d ? Math.round((n / d) * 100) : 0);

/** Зрелость = доля production среди кейсов сущности; считаем только при достаточной выборке. */
const MIN_SAMPLE = 4;
const matureProcesses = byProcess
  .filter((p) => p.total >= MIN_SAMPLE)
  .map((p) => ({ ...p, prodShare: share(p.prod, p.total) }))
  .sort((a, b) => b.prodShare - a.prodShare || b.total - a.total);

const matureMechs = byMech
  .filter((m) => m.total >= MIN_SAMPLE)
  .map((m) => ({ ...m, prodShare: share(m.prod, m.total) }))
  .sort((a, b) => b.prodShare - a.prodShare || b.total - a.total);

/** Где сильнее всего измеримые результаты — доля кейсов с measured-метрикой. */
const measurable = byIndustry
  .filter((i) => i.total >= 3)
  .map((i) => ({ ...i, measuredShare: share(i.measured, i.total) }))
  .sort((a, b) => b.measuredShare - a.measuredShare || b.total - a.total);

const weakIndustries = taxonomy.industries
  .map((i) => ({ id: i.id, total: byIndustry.find((x) => x.id === i.id)?.total ?? 0 }))
  .filter((x) => x.total <= 4)
  .sort((a, b) => a.total - b.total);

const top20 = [...cases]
  .filter((c) => c.client_disclosed && c.metrics.length > 0 && isStrong(c))
  .sort(
    (a, b) =>
      b.sales_relevance - a.sales_relevance ||
      (a.evidence_grade === 'A' ? 0 : 1) - (b.evidence_grade === 'A' ? 0 : 1) ||
      Number(hasMeasured(b)) - Number(hasMeasured(a)) ||
      b.metrics.length - a.metrics.length,
  )
  .slice(0, 20);

const ru = cases.filter((c) => c.region === 'russia-cis');
const grades = cases.reduce((m, c) => m.set(c.evidence_grade, (m.get(c.evidence_grade) ?? 0) + 1), new Map());

function table(head, rows) {
  return [
    `| ${head.join(' | ')} |`,
    `|${head.map((_, i) => (i === 0 ? '---' : '---:')).join('|')}|`,
    ...rows.map((r) => `| ${r.join(' | ')} |`),
  ].join('\n');
}

const md = `# Executive Summary

Сгенерировано из \`data/cases.json\` ${new Date().toISOString().slice(0, 10)}.
Все числа — подсчёт по базе. Формулировки выводов, помеченные *интерпретация*, —
суждение исследователя, а не утверждение источников.

**Состав базы:** ${cases.length} ${plural(cases.length, 'подтверждённый кейс', 'подтверждённых кейса', 'подтверждённых кейсов')}, из них Россия/СНГ — ${ru.length}
(${share(ru.length, cases.length)}%), остальной мир — ${cases.length - ru.length}.
Evidence A — ${grades.get('A') ?? 0}, B — ${grades.get('B') ?? 0}, C — ${grades.get('C') ?? 0}, D — 0.
Кейсов с измеренным (не заявленным и не плановым) результатом — ${cases.filter(hasMeasured).length}.

---

## 1. Какие отрасли имеют больше всего доказанных внедрений

${table(
  ['Отрасль', 'Кейсов', 'Из них Россия/СНГ', 'Evidence A/B', 'В production'],
  byIndustry.map((i) => [L(i.id), i.total, i.ru, i.strong, i.prod]),
)}

Лидер по объёму подтверждённых внедрений — **${L(byIndustry[0].id)}**: ${byIndustry[0].total} ${plural(byIndustry[0].total, 'кейс', 'кейса', 'кейсов')},
из них ${byIndustry[0].prod} в промышленной эксплуатации.

## 2. Какие процессы наиболее зрелые

Зрелость измеряем долей кейсов, дошедших до промышленной эксплуатации.
Учитываются процессы, представленные минимум ${MIN_SAMPLE} кейсами.

${table(
  ['Процесс', 'Кейсов', 'В production', 'Доля production'],
  matureProcesses.map((p) => [L(p.id), p.total, p.prod, `${p.prodShare}%`]),
)}

## 3. Какие AI-механики чаще доходят до production

${table(
  ['Механика', 'Кейсов', 'В production', 'Доля production'],
  matureMechs.map((m) => [L(m.id), m.total, m.prod, `${m.prodShare}%`]),
)}

## 4. Где наиболее сильные measurable results

Доля кейсов, где источник сообщает о **фактически измеренном** результате,
а не о заявленном или плановом эффекте.

${table(
  ['Отрасль', 'Кейсов', 'С измеренным результатом', 'Доля'],
  measurable.map((i) => [L(i.id), i.total, i.measured, `${i.measuredShare}%`]),
)}

## 5. Какие отрасли пока слабо представлены

${
  weakIndustries.length
    ? table(['Отрасль', 'Кейсов'], weakIndustries.map((x) => [L(x.id), x.total])) +
      '\n\nЭто зоны для следующего цикла исследования, а не вывод об отсутствии внедрений в отрасли.'
    : 'Все отрасли таксономии представлены минимум пятью кейсами.'
}

## 6. Двадцать кейсов, наиболее полезных для B2B-продаж

Отбор: клиент назван + есть количественный результат + Evidence A или B,
сортировка по sales relevance и качеству доказательств.

${table(
  ['#', 'Клиент', 'Страна', 'Отрасль', 'Ключевая метрика', 'Ev.', 'SR'],
  top20.map((c, i) => [
    i + 1,
    c.client,
    c.country,
    L(c.industry),
    c.metrics[0]
      ? `${c.metrics[0].metric_name}: ${c.metrics[0].result}${c.metrics[0].delta ? ` (${c.metrics[0].delta})` : ''}`
      : '—',
    c.evidence_grade,
    c.sales_relevance,
  ]),
)}

---

### Как читать эти выводы

- «Доля production» показывает, насколько технология выходит за рамки пилота **в найденных
  кейсах**, а не в отрасли в целом: выборка смещена в сторону публикуемых успехов.
- Отсутствие отрасли в таблицах означает нехватку подтверждённых публикаций, а не отсутствие
  внедрений: слабое покрытие — задача следующего цикла исследования.
- Vendor-заявления помечены в базе полем \`vendor_claim\`; при сравнении цифр между кейсами
  учитывайте статус метрики (measured / reported / projected).
`;

fs.mkdirSync(RESEARCH, { recursive: true });
fs.writeFileSync(path.join(RESEARCH, 'executive-summary.md'), md, 'utf8');
console.log(COLORS.green(`research/executive-summary.md — ${cases.length} кейсов, топ-${top20.length} для sales`));
