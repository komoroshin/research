#!/usr/bin/env node
/**
 * Проверка доступности источников (п.42 ТЗ).
 *
 * Классификация: working | redirect | unavailable | broken.
 * Кейс НИКОГДА не удаляется автоматически: источник может быть временно недоступен,
 * закрыт для дата-центров или требовать браузерных заголовков. Результат — отчёт для человека.
 */
import fs from 'node:fs';
import path from 'node:path';
import { DATA, RESEARCH, readJson, toCsv, COLORS } from './lib.mjs';

const CONCURRENCY = 6;
const TIMEOUT_MS = 15000;

const cases = readJson(path.join(DATA, 'cases.json'));

const targets = new Map();
const add = (url, caseId, role) => {
  if (!url || !/^https?:\/\//i.test(url)) return;
  if (!targets.has(url)) targets.set(url, { cases: new Set(), roles: new Set() });
  targets.get(url).cases.add(caseId);
  targets.get(url).roles.add(role);
};

for (const c of cases) {
  for (const s of c.sources ?? []) add(s.url, c.id, s.url === c.primary_source ? 'primary' : 'source');
  for (const m of c.metrics ?? []) add(m.source_url, c.id, 'metric');
  if (c.client_url) add(c.client_url, c.id, 'client');
}

const urls = [...targets.keys()];
if (urls.length === 0) {
  console.log('Проверять нечего: в базе нет источников.');
  process.exit(0);
}

/** Сначала HEAD (дёшево), при отказе — GET: часть сайтов не отвечает на HEAD. */
async function probe(url) {
  for (const method of ['HEAD', 'GET']) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        method,
        redirect: 'follow',
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; AICaseLibraryLinkCheck/1.0)',
          'Accept-Language': 'ru,en;q=0.8',
        },
      });
      clearTimeout(timer);
      const redirected = res.redirected || res.url.replace(/\/$/, '') !== url.replace(/\/$/, '');
      if (res.status >= 200 && res.status < 300) {
        return { status: redirected ? 'redirect' : 'working', code: res.status, final: res.url, note: '' };
      }
      if (res.status === 405 && method === 'HEAD') continue;
      if (res.status === 403 || res.status === 401 || res.status === 429) {
        return { status: 'unavailable', code: res.status, final: res.url, note: 'доступ ограничен для робота' };
      }
      if (res.status >= 500) {
        return { status: 'unavailable', code: res.status, final: res.url, note: 'ошибка на стороне сервера' };
      }
      return { status: 'broken', code: res.status, final: res.url, note: '' };
    } catch (e) {
      clearTimeout(timer);
      if (method === 'GET') {
        const note = e.name === 'AbortError' ? 'таймаут' : e.cause?.code || e.message;
        return { status: 'unavailable', code: 0, final: '', note };
      }
    }
  }
  return { status: 'unavailable', code: 0, final: '', note: 'нет ответа' };
}

const results = [];
let done = 0;

async function worker(queue) {
  for (;;) {
    const url = queue.shift();
    if (!url) return;
    const r = await probe(url);
    const info = targets.get(url);
    results.push({ url, ...r, cases: [...info.cases], roles: [...info.roles] });
    done++;
    if (done % 10 === 0 || done === urls.length) {
      process.stdout.write(`\r  проверено ${done}/${urls.length}`);
    }
  }
}

const queue = [...urls];
console.log(`Проверка ${urls.length} уникальных ссылок…`);
await Promise.all(Array.from({ length: Math.min(CONCURRENCY, urls.length) }, () => worker(queue)));
process.stdout.write('\n');

const byStatus = results.reduce((m, r) => m.set(r.status, (m.get(r.status) ?? 0) + 1), new Map());

results.sort((a, b) => a.status.localeCompare(b.status) || a.url.localeCompare(b.url));
fs.mkdirSync(RESEARCH, { recursive: true });
fs.writeFileSync(
  path.join(RESEARCH, 'link-check.csv'),
  toCsv(
    ['url', 'status', 'http_code', 'final_url', 'note', 'roles', 'cases'],
    results.map((r) => [r.url, r.status, r.code || '', r.final, r.note, r.roles.join(';'), r.cases.join(';')]),
  ),
  'utf8',
);

console.log('\nРезультат проверки ссылок:');
for (const s of ['working', 'redirect', 'unavailable', 'broken']) {
  const n = byStatus.get(s) ?? 0;
  const paint = s === 'broken' ? COLORS.red : s === 'unavailable' ? COLORS.yellow : COLORS.green;
  console.log(`  ${paint(s.padEnd(12))} ${n}`);
}

const bad = results.filter((r) => r.status === 'broken');
if (bad.length) {
  console.log(COLORS.red(`\nНедоступные ссылки (${bad.length}) — проверьте вручную, кейсы не удалялись:`));
  for (const r of bad.slice(0, 30)) console.log(`  ${r.code} ${r.url}  → ${r.cases.join(', ')}`);
}

// Кейс без единого рабочего источника — единственная действительно критичная ситуация.
const okUrls = new Set(results.filter((r) => r.status === 'working' || r.status === 'redirect').map((r) => r.url));
const orphaned = cases.filter((c) => !(c.sources ?? []).some((s) => okUrls.has(s.url)));
if (orphaned.length) {
  console.log(COLORS.yellow(`\nКейсы без хотя бы одного отвечающего источника (${orphaned.length}):`));
  for (const c of orphaned) console.log(`  ${c.id} — ${c.client}`);
  console.log(COLORS.dim('  Часть сайтов блокирует дата-центры: перед удалением проверьте вручную в браузере.'));
}

console.log(`\nПолный отчёт: research/link-check.csv\n`);
