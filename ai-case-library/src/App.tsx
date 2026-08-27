import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { AiCase, Filters, ViewMode } from './types';
import { cases, taxonomy } from './lib/taxonomy';
import { applyFilters, emptyFilters, filtersToParams, parseParams } from './lib/filters';
import { exportCsv, exportJson } from './lib/export';
import FilterPanel from './components/FilterPanel';
import Dashboard from './components/Dashboard';
import CardsView from './components/CardsView';
import TableView from './components/TableView';
import MatrixView from './components/MatrixView';
import CompareView from './components/CompareView';
import CaseDetail from './components/CaseDetail';

const VIEWS: { id: ViewMode; title: string }[] = [
  { id: 'dashboard', title: 'Обзор' },
  { id: 'cards', title: 'Карточки' },
  { id: 'table', title: 'Таблица' },
  { id: 'matrix', title: 'Матрица' },
  { id: 'compare', title: 'Сравнение' },
];

const MAX_COMPARE = 4;

type SortMode = 'sales' | 'evidence' | 'metrics' | 'client';

const GRADE_RANK: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };

function sortCases(list: readonly AiCase[], mode: SortMode): AiCase[] {
  const copy = [...list];
  switch (mode) {
    case 'sales':
      copy.sort(
        (a, b) =>
          b.sales_relevance - a.sales_relevance ||
          GRADE_RANK[a.evidence_grade] - GRADE_RANK[b.evidence_grade] ||
          b.metrics.length - a.metrics.length,
      );
      break;
    case 'evidence':
      copy.sort(
        (a, b) =>
          GRADE_RANK[a.evidence_grade] - GRADE_RANK[b.evidence_grade] ||
          b.metrics.length - a.metrics.length ||
          b.sales_relevance - a.sales_relevance,
      );
      break;
    case 'metrics':
      copy.sort((a, b) => b.metrics.length - a.metrics.length || b.sales_relevance - a.sales_relevance);
      break;
    case 'client':
      copy.sort((a, b) => a.client.localeCompare(b.client, 'ru'));
      break;
  }
  return copy;
}

/** Пресет коллекции (п.34 ТЗ) переводится в набор фильтров. */
function collectionFilters(id: string): Filters {
  const c = taxonomy.collections.find((x) => x.id === id);
  if (!c) return emptyFilters;
  const f: Filters = { ...emptyFilters };
  const raw = c.filter as Record<string, unknown>;

  if (Array.isArray(raw.industry)) f.industry = raw.industry as string[];
  if (Array.isArray(raw.business_process)) f.business_process = raw.business_process as string[];
  if (Array.isArray(raw.ai_mechanisms)) f.ai_mechanisms = raw.ai_mechanisms as string[];
  if (Array.isArray(raw.evidence_grade)) f.evidence_grade = raw.evidence_grade as string[];
  if (Array.isArray(raw.region)) f.region = raw.region as string[];
  if (typeof raw.sales_relevance_min === 'number') f.sales_relevance_min = raw.sales_relevance_min;
  if (raw.has_metrics === true) f.has_metrics = true;
  if (raw.client_disclosed === true) f.named_client = true;
  // region_not выражаем перечислением всех регионов, кроме исключённых.
  if (Array.isArray(raw.region_not)) {
    const excluded = new Set(raw.region_not as string[]);
    f.region = taxonomy.regions.map((r) => r.id).filter((r) => !excluded.has(r));
  }
  return f;
}

export default function App() {
  const initial = useRef(parseParams(window.location.search)).current;

  const [filters, setFiltersState] = useState<Filters>(initial.filters);
  const [view, setView] = useState<ViewMode>((initial.view as ViewMode) || 'dashboard');
  const [selected, setSelected] = useState<string[]>(initial.selected);
  const [openId, setOpenId] = useState<string | null>(initial.caseId);
  const [sort, setSort] = useState<SortMode>('sales');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const setFilters = useCallback((updater: (f: Filters) => Filters) => {
    setFiltersState((f) => updater(f));
  }, []);

  const filtered = useMemo(() => applyFilters(cases, filters), [filters]);
  const sorted = useMemo(() => sortCases(filtered, sort), [filtered, sort]);
  const compareItems = useMemo(
    () => selected.map((id) => cases.find((c) => c.id === id)).filter(Boolean) as AiCase[],
    [selected],
  );
  const openItem = useMemo(() => cases.find((c) => c.id === openId) ?? null, [openId]);

  // Состояние фильтров живёт в URL — ссылку на подборку можно отправить коллеге (п.35 ТЗ).
  useEffect(() => {
    const qs = filtersToParams(filters, view, selected, openId);
    const next = `${window.location.pathname}${qs}`;
    if (next !== window.location.pathname + window.location.search) {
      window.history.replaceState(null, '', next);
    }
  }, [filters, view, selected, openId]);

  useEffect(() => {
    const onPop = () => {
      const s = parseParams(window.location.search);
      setFiltersState(s.filters);
      setView((s.view as ViewMode) || 'dashboard');
      setSelected(s.selected);
      setOpenId(s.caseId);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const togglePick = useCallback((id: string) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length >= MAX_COMPARE ? s : [...s, id]));
  }, []);

  const applyCollection = (id: string) => {
    setFiltersState(collectionFilters(id));
    setView((v) => (v === 'dashboard' || v === 'compare' ? 'cards' : v));
    setSidebarOpen(false);
  };

  const addFilterValue = (key: keyof Filters, value: string) => {
    setFiltersState((f) => {
      const cur = f[key] as string[];
      return { ...f, [key]: cur.includes(value) ? cur : [...cur, value] };
    });
  };

  const shareLink = () => {
    void navigator.clipboard
      ?.writeText(window.location.href)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      })
      .catch(() => undefined);
  };

  const empty = cases.length === 0;

  return (
    <div className="app">
      <header className="header">
        <button
          className="btn btn-sm sidebar-toggle"
          onClick={() => setSidebarOpen((v) => !v)}
          aria-label="Фильтры"
        >
          ☰ Фильтры
        </button>
        <div className="brand">
          AI Case Library <small>research &amp; sales intelligence</small>
        </div>

        <div className="search">
          <span className="icon">⌕</span>
          <input
            type="search"
            value={filters.q}
            placeholder="Поиск: компания, подрядчик, проблема, решение, тег…"
            onChange={(e) => setFiltersState((f) => ({ ...f, q: e.target.value }))}
            aria-label="Полнотекстовый поиск по кейсам"
          />
          {filters.q && (
            <button className="clear" onClick={() => setFiltersState((f) => ({ ...f, q: '' }))} aria-label="Очистить">
              ✕
            </button>
          )}
        </div>

        <nav className="tabs" aria-label="Режим просмотра">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              aria-current={view === v.id}
              onClick={() => setView(v.id)}
            >
              {v.title}
              {v.id === 'compare' && selected.length > 0 ? ` (${selected.length})` : ''}
            </button>
          ))}
        </nav>

        <div className="header-actions">
          <button className="btn btn-sm" onClick={shareLink} title="Скопировать ссылку на текущую подборку">
            {copied ? '✓ Скопировано' : 'Ссылка'}
          </button>
        </div>
      </header>

      <div className="body">
        <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
          <FilterPanel
            filters={filters}
            setFilters={setFilters}
            all={cases}
            visible={filtered}
            onReset={() => setFiltersState(emptyFilters)}
          />
        </aside>

        <main className="main">
          {empty ? (
            <div className="empty">
              <h3>База пуста</h3>
              <p>
                Файл <code>data/cases.json</code> не содержит записей. Запустите пайплайн исследования
                и пересоберите приложение.
              </p>
            </div>
          ) : (
            <>
              <div className="collections">
                <button className="chip gold" onClick={() => applyCollection('best-sales')}>
                  ★ Best Sales Cases
                </button>
                {taxonomy.collections
                  .filter((c) => c.id !== 'best-sales')
                  .map((c) => (
                    <button className="chip" key={c.id} onClick={() => applyCollection(c.id)}>
                      {c.label_ru}
                    </button>
                  ))}
              </div>

              <div className="resultbar">
                <span className="count">
                  <strong>{filtered.length}</strong> из {cases.length} кейсов
                </span>
                {view !== 'dashboard' && view !== 'matrix' && view !== 'compare' && (
                  <>
                    <label style={{ fontSize: 12, color: 'var(--text-muted)' }} htmlFor="sortsel">
                      Сортировка
                    </label>
                    <select
                      id="sortsel"
                      className="sort"
                      value={sort}
                      onChange={(e) => setSort(e.target.value as SortMode)}
                    >
                      <option value="sales">по sales relevance</option>
                      <option value="evidence">по качеству доказательств</option>
                      <option value="metrics">по числу метрик</option>
                      <option value="client">по названию клиента</option>
                    </select>
                  </>
                )}
                <span className="spacer" />
                <button className="btn btn-sm" onClick={() => exportCsv(sorted)} disabled={filtered.length === 0}>
                  Экспорт CSV
                </button>
                <button className="btn btn-sm" onClick={() => exportJson(sorted)} disabled={filtered.length === 0}>
                  Экспорт JSON
                </button>
              </div>

              {filtered.length === 0 && view !== 'compare' ? (
                <div className="empty">
                  <h3>Ничего не найдено</h3>
                  <p>Смягчите фильтры или измените поисковый запрос.</p>
                  <button className="btn" style={{ marginTop: 10 }} onClick={() => setFiltersState(emptyFilters)}>
                    Сбросить фильтры
                  </button>
                </div>
              ) : (
                <>
                  {view === 'dashboard' && (
                    <Dashboard
                      all={cases}
                      list={filtered}
                      onPickIndustry={(id) => addFilterValue('industry', id)}
                      onPickProcess={(id) => addFilterValue('business_process', id)}
                      onPickMechanism={(id) => addFilterValue('ai_mechanisms', id)}
                      onPickGrade={(id) => addFilterValue('evidence_grade', id)}
                    />
                  )}
                  {view === 'cards' && (
                    <CardsView list={sorted} onOpen={setOpenId} selected={selected} onTogglePick={togglePick} />
                  )}
                  {view === 'table' && <TableView list={sorted} onOpen={setOpenId} />}
                  {view === 'matrix' && (
                    <MatrixView
                      list={filtered}
                      onPick={(industry, process) => {
                        setFiltersState((f) => ({ ...f, industry: [industry], business_process: [process] }));
                        setView('cards');
                      }}
                    />
                  )}
                  {view === 'compare' && (
                    <CompareView
                      items={compareItems}
                      onRemove={(id) => setSelected((s) => s.filter((x) => x !== id))}
                      onOpen={setOpenId}
                    />
                  )}
                </>
              )}
            </>
          )}
        </main>
      </div>

      <footer className="footer">
        Библиотека реальных внедрений AI/ML/LLM. Каждый кейс содержит первичный источник; каждая цифра
        связана со ссылкой, где она опубликована. Блок Sales Lens — интерпретация исследователя, а не
        утверждение источника. Таксономия v{taxonomy.version}, обновлена {taxonomy.updated}.
      </footer>

      {openItem && (
        <CaseDetail
          item={openItem}
          onClose={() => setOpenId(null)}
          picked={selected.includes(openItem.id)}
          onTogglePick={() => togglePick(openItem.id)}
        />
      )}
    </div>
  );
}
