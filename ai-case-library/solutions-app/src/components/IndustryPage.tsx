import type { Industry } from '../types';
import { offersOf } from '../lib/data';
import { OfferCard } from './Shared';

interface Props {
  item: Industry;
  onOpenOffer: (id: string) => void;
  onBack: () => void;
}

export default function IndustryPage({ item: ind, onOpenOffer, onBack }: Props) {
  return (
    <>
      <button className="backlink" onClick={onBack}>
        ← Все отрасли
      </button>
      <h2 style={{ margin: '0 0 4px', letterSpacing: '-0.01em' }}>{ind.name}</h2>
      <p style={{ margin: '0 0 14px', color: 'var(--text-muted)', fontSize: 13.5 }}>{ind.intro}</p>

      {ind.highlights.length > 0 && (
        <section className="section" style={{ marginBottom: 18 }}>
          <h3>Что уже получают компании отрасли</h3>
          <ul className="proof-list">
            {ind.highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </section>
      )}

      <h3 className="offer-group-title" style={{ fontSize: 16 }}>С чем сюда приходят чаще всего</h3>
      <div className="cards">
        {offersOf(ind).map((o) => (
          <OfferCard key={o.id} offer={o} onOpen={onOpenOffer} />
        ))}
      </div>
    </>
  );
}
