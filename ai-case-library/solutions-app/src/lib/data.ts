import offersJson from '../../../data/offers.json';
import type { Category, Offer, OffersData } from '../types';

const data = offersJson as OffersData;

export const categories: Category[] = data.categories;
export const offers: Offer[] = data.offers;

export const byCategory = (catId: string): Offer[] =>
  offers.filter((o) => o.category === catId);

export const findOffer = (id: string | null): Offer | null =>
  offers.find((o) => o.id === id) ?? null;

/** Первый «козырь»: реальный результат, если есть, иначе первый ожидаемый эффект. */
export function headline(o: Offer): string {
  return o.proof[0] ?? o.outcomes[0];
}

export const TELEGRAM = 'https://t.me/kmoroshin';

/** Каталог реальных кейсов, на который опираются направления (та же площадка Pages). */
export const CASES_CATALOG = '../projects/';

export function ctaMessage(o: Offer): string {
  return `Хочу обсудить: «${o.title}». Похоже на нашу ситуацию — с чего начнём?`;
}
