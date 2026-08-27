import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ScaleCase, ScaleFilters, View } from './types';
import { applyFilters, cases, emptyFilters, parseState, stateToParams } from './lib/data';
import Home from './components/Home';
import CaseList from './components/CaseList';
import CaseDetail from './components/CaseDetail';
import CompareView from './components/CompareView';

export default function App() {
  const initial = useRef(parseState(window.location.search)).current;

  const [filters, setFiltersState] = useState<ScaleFilters>(initial.filters);
  const [view, setView] = useState<View>((initial.view as View) || 'home');
  const [caseId, setCaseId] = useState<string | null>(initial.caseId);
  const [compare, setCompare] = useState<string[]>(initial.compare);

  const setFilters = useCallback((updater: (f: ScaleFilters) => ScaleFilters) => {
    setFiltersState((f) => updater(f));
  }, []);

  const filtered = useMemo(() => applyFilters(filters), [filters]);
  const openItem = useMemo(() => cases.find((c) => c.id === caseId) ?? null, [caseId]);
  const compareItems = useMemo(
    () => compare.map((id) => cases.find((c) => c.id === id)).filter(Boolean) as ScaleCase[],
    [compare],
  );

  // Состояние в URL: ссылку на подборку или кейс можно отправить клиенту напрямую.
  // Открытие кейса создаёт запись в истории — браузерный «назад» возвращает к списку.
  const prevCaseId = useRef(caseId);
  useEffect(() => {
    const qs = stateToParams(filters, view, caseId, compare);
    const next = `${window.location.pathname}${qs}`;
    const caseChanged = prevCaseId.current !== caseId;
    prevCaseId.current = caseId;
    if (next !== window.location.pathname + window.location.search) {
      if (caseChanged) window.history.pushState(null, '', next);
      else window.history.replaceState(null, '', next);
    }
    // Переход по «похожим кейсам» открывает новую страницу — читаем её с начала.
    if (caseChanged && caseId) window.scrollTo(0, 0);
  }, [filters, view, caseId, compare]);

  useEffect(() => {
    const onPop = () => {
      const s = parseState(window.location.search);
      setFiltersState(s.filters);
      setView((s.view as View) || 'home');
      setCaseId(s.caseId);
      setCompare(s.compare);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const toggleCompare = useCallback((id: string) => {
    setCompare((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length >= 4 ? s : [...s, id]));
  }, []);

  const goHome = () => {
    setFiltersState(emptyFilters);
    setView('home');
  };

  return (
    <div className="app">
      <header className="header">
        <div className="brand" style={{ cursor: 'pointer' }} onClick={goHome}>
          Проекты вашего масштаба <small>AI-каталог $50k–$1M</small>
        </div>

        <div className="search">
          <span className="icon">⌕</span>
          <input
            type="search"
            value={filters.q}
            placeholder="Поиск: задача, процесс, технология…"
            onChange={(e) => {
              const q = e.target.value;
              setFiltersState((f) => ({ ...f, q }));
              if (q && view === 'home') setView('cases');
            }}
            aria-label="Поиск по кейсам"
          />
          {filters.q && (
            <button
              className="clear"
              onClick={() => setFiltersState((f) => ({ ...f, q: '' }))}
              aria-label="Очистить"
            >
              ✕
            </button>
          )}
        </div>

        <nav className="tabs" aria-label="Разделы">
          <button aria-current={view === 'home'} onClick={goHome}>
            Отрасли
          </button>
          <button aria-current={view === 'cases'} onClick={() => setView('cases')}>
            Кейсы
          </button>
          <button aria-current={view === 'compare'} onClick={() => setView('compare')}>
            Сравнение{compare.length ? ` (${compare.length})` : ''}
          </button>
        </nav>
      </header>

      <div className="body">
        <main className="main" style={{ maxWidth: 1240, margin: '0 auto', width: '100%' }}>
          {view === 'home' && !openItem && (
            <Home
              onPickIndustry={(id) => {
                setFiltersState({ ...emptyFilters, industry: [id] });
                setView('cases');
              }}
            />
          )}
          {openItem ? (
            <CaseDetail item={openItem} onBack={() => setCaseId(null)} onOpen={setCaseId} />
          ) : (
            <>
              {view === 'cases' && (
                <CaseList
                  list={filtered}
                  filters={filters}
                  setFilters={setFilters}
                  onOpen={setCaseId}
                  compare={compare}
                  onToggleCompare={toggleCompare}
                  onBackHome={goHome}
                />
              )}
              {view === 'compare' && (
                <CompareView
                  items={compareItems}
                  onRemove={(id) => setCompare((s) => s.filter((x) => x !== id))}
                  onOpen={setCaseId}
                />
              )}
            </>
          )}
        </main>
      </div>

      <footer className="footer" style={{ textAlign: 'center' }}>
        Обезличенные проекты из верифицированных отзывов заказчиков и публичных разборов —
        доказательство, что задачи этого масштаба уже решены. Хотите так же —{' '}
        <a href="https://t.me/kmoroshin" target="_blank" rel="noopener noreferrer">
          напишите в Telegram
        </a>
        .
      </footer>
    </div>
  );
}
