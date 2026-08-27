#!/usr/bin/env node
/**
 * Проекция внутренней базы в клиентскую: data/cases.json -> client-app/src/generated/.
 *
 * Клиентская версия собирается ТОЛЬКО из этого файла, поэтому внутренние поля
 * (Sales Lens: гипотезы входа, likely buyer, sales relevance; research_notes)
 * физически не попадают в клиентский бандл. Скрытие на уровне интерфейса не защита:
 * JSON виден в DevTools любому посетителю.
 *
 * Принцип — белый список, а не чёрный: новое поле во внутренней схеме по умолчанию
 * НЕ утекает к клиенту, пока его явно не разрешили здесь.
 */
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, DATA, readJson, COLORS } from './lib.mjs';

const OUT_DIR = path.join(ROOT, 'client-app', 'src', 'generated');

/** Поля, разрешённые к показу клиенту. Всё, чего нет в списке, отбрасывается. */
const CASE_WHITELIST = new Set([
  'id', 'title', 'client', 'client_disclosed', 'country', 'region',
  'industry', 'subindustry', 'business_process', 'ai_mechanisms',
  'problem', 'before_state', 'solution', 'data_used', 'integrations',
  'deployment', 'stage', 'scale', 'metrics', 'timeline', 'result_summary',
  'sources', 'primary_source', 'vendor', 'technology_providers', 'tags',
  // производные поля, создаваемые этим скриптом:
  'confidence', 'first_step', 'growth_paths',
]);

const METRIC_WHITELIST = new Set([
  'metric_type', 'metric_name', 'baseline', 'result', 'delta', 'status',
  'source_url', 'source_type',
]);

const SOURCE_WHITELIST = new Set(['url', 'title', 'type', 'publisher', 'date']);

/**
 * Внутренние evidence-грейды переводятся в человеческую шкалу уверенности.
 * Формулировки честные: они не обещают больше, чем есть в источниках.
 */
const CONFIDENCE = {
  A: { level: 'high', label: 'Подтверждён независимым источником' },
  B: { level: 'medium', label: 'Подтверждён; данные преимущественно от стороны проекта' },
  C: { level: 'limited', label: 'Ограниченные открытые данные' },
};

/**
 * Тексты land/expand писались исследователем для продавца. Большинство —
 * нейтральные описания пилота, но встречается «голос продавца»
 * («предложить клиенту…», «пилот в контакт-центре клиента»). Такие тексты клиенту
 * не показываем: поле пропускается, кейс попадает в отчёт для ручной редактуры.
 *
 * ВАЖНО: \b в JS не работает с кириллицей (кириллица не входит в \w), поэтому
 * границы слов заданы явно через [^а-яё]. Ловим только адресацию к продавцу:
 * косвенные падежи единственного числа «клиента/клиенту/заказчика…» и «предложить»;
 * «клиентский», «для клиентов», «клиентская база» — легитимная речь о клиентах
 * самой компании из кейса и НЕ флагуется.
 */
const SELLER_VOICE = new RegExp(
  [
    'предложи(ть|те|в)',                              // предложить (клиенту/заказчику)
    '(^|[^а-яё])продать([^а-яё]|$)',
    '(^|[^а-яё])клиент(а|у|е|ом)([^а-яё]|$)',         // ед. число, косв. падежи
    '(^|[^а-яё])заказчик(а|у|е|ом)?([^а-яё]|$)',
    'переговор',
  ].join('|'),
  'i',
);

const cases = readJson(path.join(DATA, 'cases.json'));

const flagged = [];
const projected = cases.map((c) => {
  const out = {};
  for (const key of CASE_WHITELIST) {
    if (key in c) out[key] = c[key];
  }

  out.metrics = (c.metrics ?? []).map((m) => {
    const mm = {};
    for (const k of METRIC_WHITELIST) if (k in m) mm[k] = m[k];
    return mm;
  });
  out.sources = (c.sources ?? []).map((s) => {
    const ss = {};
    for (const k of SOURCE_WHITELIST) if (k in s) ss[k] = s[k];
    return ss;
  });

  out.confidence = CONFIDENCE[c.evidence_grade] ?? CONFIDENCE.C;

  if (c.land_opportunity) {
    if (SELLER_VOICE.test(c.land_opportunity)) {
      flagged.push({ id: c.id, field: 'land_opportunity', text: c.land_opportunity });
    } else {
      out.first_step = c.land_opportunity;
    }
  }
  if (Array.isArray(c.expand_opportunities) && c.expand_opportunities.length) {
    const bad = c.expand_opportunities.filter((t) => SELLER_VOICE.test(t));
    if (bad.length) {
      flagged.push({ id: c.id, field: 'expand_opportunities', text: bad.join(' | ') });
    }
    const ok = c.expand_opportunities.filter((t) => !SELLER_VOICE.test(t));
    if (ok.length) out.growth_paths = ok;
  }

  return out;
});

// Сортировка «сильные вперёд»: подтверждённость, измеренный результат, объём метрик.
const gradeRank = { high: 2, medium: 1, limited: 0 };
projected.sort((a, b) => {
  const score = (x) =>
    gradeRank[x.confidence.level] * 10 +
    (x.metrics.some((m) => m.status === 'measured') ? 5 : 0) +
    Math.min(x.metrics.length, 4);
  return score(b) - score(a) || a.client.localeCompare(b.client, 'ru');
});

// --- Страховка от утечки: в выходных объектах не должно быть ключей вне белых списков ---
const leaks = [];
for (const c of projected) {
  for (const k of Object.keys(c)) if (!CASE_WHITELIST.has(k)) leaks.push(`${c.id}: ${k}`);
  for (const m of c.metrics) for (const k of Object.keys(m)) if (!METRIC_WHITELIST.has(k)) leaks.push(`${c.id}: metrics.${k}`);
  for (const s of c.sources) for (const k of Object.keys(s)) if (!SOURCE_WHITELIST.has(k)) leaks.push(`${c.id}: sources.${k}`);
}
// Пояс и подтяжки: сериализованный вывод не должен содержать имён внутренних полей.
const FORBIDDEN = ['entry_hypothesis', 'likely_buyer', 'sales_relevance', 'research_notes', 'why_it_matters', 'land_opportunity', 'expand_opportunities', 'evidence_grade', 'vendor_claim', 'budget'];
const serialized = JSON.stringify(projected);
for (const word of FORBIDDEN) {
  if (serialized.includes(`"${word}"`)) leaks.push(`сериализованный вывод содержит ключ "${word}"`);
}
if (leaks.length) {
  console.error(COLORS.red('УТЕЧКА ВНУТРЕННИХ ПОЛЕЙ — сборка остановлена:'));
  for (const l of leaks.slice(0, 20)) console.error('  x ' + l);
  process.exit(1);
}

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, 'client-cases.json'), JSON.stringify(projected, null, 2) + '\n', 'utf8');

console.log(COLORS.green(`client-cases.json — ${projected.length} кейсов, поля по белому списку`));
console.log(`  с first_step: ${projected.filter((c) => c.first_step).length}, с growth_paths: ${projected.filter((c) => c.growth_paths).length}`);
if (flagged.length) {
  console.log(COLORS.yellow(`  пропущено из-за «голоса продавца» (${flagged.length}) — кандидаты на ручную редактуру:`));
  for (const f of flagged.slice(0, 12)) console.log(COLORS.dim(`    ${f.id} [${f.field}]: ${f.text.slice(0, 90)}`));
  fs.writeFileSync(
    path.join(OUT_DIR, 'seller-voice-report.json'),
    JSON.stringify(flagged, null, 2) + '\n',
    'utf8',
  );
}
