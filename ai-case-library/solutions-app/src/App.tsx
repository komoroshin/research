import { useEffect, useMemo, useRef, useState } from 'react';
import { findOffer } from './lib/data';
import Home from './components/Home';
import OfferDetail from './components/OfferDetail';

function offerFromUrl(): string | null {
  return new URLSearchParams(window.location.search).get('offer');
}

export default function App() {
  const [offerId, setOfferId] = useState<string | null>(offerFromUrl);
  const open = useMemo(() => findOffer(offerId), [offerId]);

  // Открытие направления создаёт запись в истории: браузерный «назад» возвращает
  // к списку, а прямую ссылку ?offer=… можно отправить клиенту.
  const prev = useRef(offerId);
  useEffect(() => {
    const qs = offerId ? `?offer=${offerId}` : '';
    const next = `${window.location.pathname}${qs}`;
    const changed = prev.current !== offerId;
    prev.current = offerId;
    if (next !== window.location.pathname + window.location.search) {
      if (changed) window.history.pushState(null, '', next);
      else window.history.replaceState(null, '', next);
    }
    if (changed) window.scrollTo(0, 0);
  }, [offerId]);

  useEffect(() => {
    const onPop = () => setOfferId(offerFromUrl());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  return (
    <div className="app">
      <header className="header">
        <div className="brand" style={{ cursor: 'pointer' }} onClick={() => setOfferId(null)}>
          AI под вашу задачу <small>что мы решаем</small>
        </div>
        <span style={{ flex: 1 }} />
        <nav className="tabs" aria-label="Разделы">
          <button aria-current={!open} onClick={() => setOfferId(null)}>
            Направления
          </button>
        </nav>
      </header>

      <div className="body">
        <main className="main" style={{ maxWidth: 1240, margin: '0 auto', width: '100%' }}>
          {open ? <OfferDetail item={open} onBack={() => setOfferId(null)} /> : <Home onOpen={setOfferId} />}
        </main>
      </div>

      <footer className="footer" style={{ textAlign: 'center' }}>
        Строим AI-решения под конкретную бизнес-проблему — от пилота до продакшена.{' '}
        <a href="https://t.me/kmoroshin" target="_blank" rel="noopener noreferrer">
          Написать в Telegram
        </a>
        .
      </footer>
    </div>
  );
}
