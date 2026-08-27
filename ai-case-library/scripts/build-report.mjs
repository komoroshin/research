#!/usr/bin/env node
/** Генерация research/research-report.md — фактическая часть отчёта об исследовании (п.44 ТЗ). */
import fs from 'node:fs';
import path from 'node:path';
import { DATA, RESEARCH, readJson, taxonomy, parseCsv, COLORS } from './lib.mjs';

const cases = readJson(path.join(DATA, 'cases.json'));

const labels = new Map();
for (const group of [
  taxonomy.industries,
  taxonomy.industries.flatMap((i) => i.subindustries),
  taxonomy.business_processes,
  taxonomy.ai_mechanisms,
  taxonomy.stages,
  taxonomy.regions,
  taxonomy.deployments,
  taxonomy.metric_groups,
]) {
  for (const t of group) labels.set(t.id, t.label_ru);
}
const L = (id) => labels.get(id) ?? id;

function tally(get) {
  const m = new Map();
  for (const c of cases) {
    const v = get(c);
    for (const id of new Set(Array.isArray(v) ? v : [v])) m.set(id, (m.get(id) ?? 0) + 1);
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

function table(rows, head) {
  return [
    `| ${head.join(' | ')} |`,
    `|${head.map((_, i) => (i === 0 ? '---' : '---:')).join('|')}|`,
    ...rows.map((r) => `| ${r.join(' | ')} |`),
  ].join('\n');
}

function countCsv(name) {
  const file = path.join(RESEARCH, name);
  if (!fs.existsSync(file)) return 0;
  return Math.max(0, parseCsv(fs.readFileSync(file, 'utf8')).length - 1);
}

const nCandidates = countCsv('candidates.csv');
const nRejected = countCsv('rejected.csv');
const nSources = countCsv('source-log.csv');
const nMerged = countCsv('dedup-log.csv');

const byGrade = new Map(tally((c) => c.evidence_grade));
const ru = cases.filter((c) => c.region === 'russia-cis');
const global = cases.filter((c) => c.region !== 'russia-cis');
const withMetrics = cases.filter((c) => c.metrics.length > 0);
const measured = cases.filter((c) => c.metrics.some((m) => m.status === 'measured'));
const production = cases.filter((c) => c.stage === 'production' || c.stage === 'scaled-production');

const industries = tally((c) => c.industry);
const processes = tally((c) => c.business_process);
const mechanisms = tally((c) => c.ai_mechanisms);
const stages = tally((c) => c.stage);
const countries = tally((c) => c.country);

const vendors = new Map();
for (const c of cases) for (const v of c.vendor ?? []) vendors.set(v, (vendors.get(v) ?? 0) + 1);
const vendorRows = [...vendors.entries()].sort((a, b) => b[1] - a[1]);

/** Доля production внутри механики — насколько технология доходит до эксплуатации. */
const mechMaturity = mechanisms
  .filter(([, n]) => n >= 3)
  .map(([id, n]) => {
    const prod = cases.filter(
      (c) => c.ai_mechanisms.includes(id) && (c.stage === 'production' || c.stage === 'scaled-production'),
    ).length;
    return { id, n, prod, share: Math.round((prod / n) * 100) };
  })
  .sort((a, b) => b.share - a.share || b.n - a.n);

/** Слабые места: отрасли и процессы, где кейсов почти нет. */
const weakIndustries = taxonomy.industries
  .map((i) => ({ id: i.id, n: cases.filter((c) => c.industry === i.id).length }))
  .filter((x) => x.n <= 4)
  .sort((a, b) => a.n - b.n);
const weakProcesses = taxonomy.business_processes
  .map((p) => ({ id: p.id, n: cases.filter((c) => c.business_process.includes(p.id)).length }))
  .filter((x) => x.n <= 3)
  .sort((a, b) => a.n - b.n);

const ruShare = cases.length ? Math.round((ru.length / cases.length) * 100) : 0;

const top20 = [...cases]
  .filter((c) => c.client_disclosed && c.metrics.length > 0 && ['A', 'B'].includes(c.evidence_grade))
  .sort(
    (a, b) =>
      b.sales_relevance - a.sales_relevance ||
      (a.evidence_grade === 'A' ? -1 : 1) - (b.evidence_grade === 'A' ? -1 : 1) ||
      b.metrics.length - a.metrics.length,
  )
  .slice(0, 20);

const md = `# Research Report — библиотека реальных AI-кейсов

Сгенерировано автоматически из \`data/cases.json\`: ${new Date().toISOString().slice(0, 10)}.
Цифры в этом файле — производные от базы, а не отдельное утверждение исследователя.

## Воронка исследования

| Этап | Значение |
|---|---:|
| Рассмотрено кандидатов | ${nCandidates} |
| Включено в библиотеку | ${cases.length} |
| Отклонено | ${nRejected} |
| Склеено как дубли | ${nMerged} |
| Источников открыто и залогировано | ${nSources} |

## Качество доказательств

| Grade | Кейсов | Доля |
|---|---:|---:|
| A — сильные доказательства | ${byGrade.get('A') ?? 0} | ${Math.round(((byGrade.get('A') ?? 0) / cases.length) * 100)}% |
| B — хорошие доказательства | ${byGrade.get('B') ?? 0} | ${Math.round(((byGrade.get('B') ?? 0) / cases.length) * 100)}% |
| C — ограниченные | ${byGrade.get('C') ?? 0} | ${Math.round(((byGrade.get('C') ?? 0) / cases.length) * 100)}% |
| D — маркетинговое заявление | ${byGrade.get('D') ?? 0} | — |

- Кейсов с количественным результатом: **${withMetrics.length}** (${Math.round((withMetrics.length / cases.length) * 100)}%)
- Из них хотя бы с одной **измеренной** метрикой: **${measured.length}**
- Дошли до промышленной эксплуатации: **${production.length}** (${Math.round((production.length / cases.length) * 100)}%)
- Кейсов с vendor_claim = true: **${cases.filter((c) => c.vendor_claim).length}**
- Клиент назван: **${cases.filter((c) => c.client_disclosed).length}**, под NDA: **${cases.filter((c) => !c.client_disclosed).length}**

## География

| Регион | Кейсов |
|---|---:|
${tally((c) => c.region).map(([id, n]) => `| ${L(id)} | ${n} |`).join('\n')}

Россия и СНГ — **${ru.length}** кейсов (${ruShare}%), остальной мир — **${global.length}**.

Топ стран:

${table(countries.slice(0, 12).map(([n, k]) => [n, k]), ['Страна', 'Кейсов'])}

## Распределение по отраслям

${table(industries.map(([id, n]) => [L(id), n, cases.filter((c) => c.industry === id && c.region === 'russia-cis').length, cases.filter((c) => c.industry === id && c.metrics.length > 0).length]), ['Отрасль', 'Всего', 'Россия/СНГ', 'С цифрами'])}

## Распределение по бизнес-процессам

Один кейс может закрывать несколько процессов, поэтому сумма больше числа кейсов.

${table(processes.map(([id, n]) => [L(id), n]), ['Процесс', 'Кейсов'])}

## Распределение по AI-механикам

${table(mechanisms.map(([id, n]) => [L(id), n]), ['Механика', 'Кейсов'])}

## Стадии внедрения

${table(stages.map(([id, n]) => [L(id), n]), ['Стадия', 'Кейсов'])}

## Зрелость механик: доля кейсов в промышленной эксплуатации

Считаются только механики, встречающиеся минимум в трёх кейсах.

${table(mechMaturity.map((m) => [L(m.id), m.n, m.prod, `${m.share}%`]), ['Механика', 'Кейсов', 'В production', 'Доля'])}

## Представленные подрядчики и команды

Всего различных исполнителей: **${vendorRows.length}**.

${table(vendorRows.slice(0, 25).map(([n, k]) => [n, k]), ['Подрядчик', 'Кейсов'])}

${vendorRows[0] && vendorRows[0][1] > 15 ? `> Внимание: «${vendorRows[0][0]}» даёт ${vendorRows[0][1]} кейсов. Порог из п.49 ТЗ — 15–20 на одного подрядчика.` : '> Ни один подрядчик не доминирует в базе (п.49 ТЗ соблюдён).'}

## Research gaps — где данных мало

${weakIndustries.length ? `Слабо представленные отрасли:\n\n${table(weakIndustries.map((x) => [L(x.id), x.n]), ['Отрасль', 'Кейсов'])}` : 'Все отрасли таксономии представлены не менее чем пятью кейсами.'}

${weakProcesses.length ? `Слабо представленные процессы:\n\n${table(weakProcesses.map((x) => [L(x.id), x.n]), ['Процесс', 'Кейсов'])}` : 'Все процессы таксономии представлены не менее чем четырьмя кейсами.'}

## 20 кейсов, наиболее полезных для B2B-продаж

Отбор: клиент назван, есть измеримый результат, Evidence A или B, максимальная sales relevance.

${table(
  top20.map((c, i) => [
    i + 1,
    c.client,
    c.country,
    L(c.industry),
    c.business_process.map(L).join(', '),
    c.metrics[0] ? `${c.metrics[0].metric_name}: ${c.metrics[0].result}${c.metrics[0].delta ? ` (${c.metrics[0].delta})` : ''}` : '—',
    c.evidence_grade,
  ]),
  ['#', 'Клиент', 'Страна', 'Отрасль', 'Процесс', 'Ключевая метрика', 'Ev.'],
)}
`;

fs.mkdirSync(RESEARCH, { recursive: true });
fs.writeFileSync(path.join(RESEARCH, 'research-report.md'), md, 'utf8');
console.log(COLORS.green(`research/research-report.md — ${cases.length} кейсов, ${industries.length} отраслей`));
