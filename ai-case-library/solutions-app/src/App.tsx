import { useEffect, useMemo, useRef, useState } from 'react';
import logo from './assets/logo.svg';
import { findIndustry, findOffer } from './lib/data';
import { COMPANY } from './lib/company';
import Home from './components/Home';
import IndustriesHome from './components/IndustriesHome';
import IndustryPage from './components/IndustryPage';
import OfferDetail from './components/OfferDetail';

type View = 'problems' | 'industries';

interface NavState {
  view: View;
  industryId: string | null;
  offerId: string | null;
}

function fromUrl(): NavState {
  const p = new URLSearchParams(window.location.search);
  return {
    view: p.get('view') === 'industries' ? 'industries' : 'problems',
    industryId: p.get('industry'),
    offerId: p.get('offer'),
  };
}

function toQuery(s: NavState): string {
  const p = new URLSearchParams();
  if (s.view === 'industries') p.set('view', 'industries');
  if (s.industryId) p.set('industry', s.industryId);
  if (s.offerId) p.set('offer', s.offerId);
  const q = p.toString();
  return q ? `?${q}` : '';
}

export default function App() {
  const [nav, setNav] = useState<NavState>(fromUrl);
  const offer = useMemo(() => findOffer(nav.offerId), [nav.offerId]);
  const industry = useMemo(() => findIndustry(nav.industryId), [nav.industryId]);

  // Открытие направления или отрасли — навигация: запись в истории, «назад» работает,
  // прямые ссылки (?offer=…, ?industry=…) можно отправлять клиенту.
  const prev = useRef(nav);
  useEffect(() => {
    const next = `${window.location.pathname}${toQuery(nav)}`;
    const navigated = prev.current.offerId !== nav.offerId || prev.current.industryId !== nav.industryId;
    prev.current = nav;
    if (next !== window.location.pathname + window.location.search) {
      if (navigated) window.history.pushState(null, '', next);
      else window.history.replaceState(null, '', next);
    }
    if (navigated) window.scrollTo(0, 0);
  }, [nav]);

  useEffect(() => {
    const onPop = () => setNav(fromUrl());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const openOffer = (id: string) => setNav((s) => ({ ...s, offerId: id }));
  const closeOffer = () => setNav((s) => ({ ...s, offerId: null }));

  return (
    <div className="app">
      <header className="header">
        <div
          className="brand"
          style={{ cursor: 'pointer' }}
          onClick={() => setNav({ view: 'problems', industryId: null, offerId: null })}
        >
          <img src={logo} alt="Океан Тех" className="brand-logo" />
        </div>
        <span style={{ flex: 1 }} />
        <nav className="tabs" aria-label="Разделы">
          <button
            aria-current={!offer && nav.view === 'problems'}
            onClick={() => setNav({ view: 'problems', industryId: null, offerId: null })}
          >
            По проблемам
          </button>
          <button
            aria-current={!offer && nav.view === 'industries'}
            onClick={() => setNav({ view: 'industries', industryId: null, offerId: null })}
          >
            По отраслям
          </button>
        </nav>
      </header>

      <div className="body">
        <main className="main" style={{ maxWidth: 1240, margin: '0 auto', width: '100%' }}>
          {offer ? (
            <OfferDetail item={offer} onBack={closeOffer} />
          ) : nav.view === 'industries' ? (
            industry ? (
              <IndustryPage
                item={industry}
                onOpenOffer={openOffer}
                onBack={() => setNav((s) => ({ ...s, industryId: null }))}
              />
            ) : (
              <IndustriesHome onPick={(id) => setNav((s) => ({ ...s, industryId: id }))} />
            )
          ) : (
            <Home onOpen={openOffer} />
          )}
        </main>
      </div>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">Океан Тех — исследования и разработка искусственного интеллекта</div>
          <div className="footer-contacts">
            <a href="https://t.me/kmoroshin" target="_blank" rel="noopener noreferrer">Telegram</a>
            <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
            <a href={COMPANY.phoneHref}>{COMPANY.phone}</a>
            <a href={COMPANY.site} target="_blank" rel="noopener noreferrer">okeantech.ru</a>
            <span>{COMPANY.address}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
