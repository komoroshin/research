/**
 * Типы каталога решений «с чем к нам приходят». Источник данных — data/offers.json:
 * авторский контент (проблема → решение → ожидаемый результат), опирающийся на
 * реальные кейсы из data/small-cases.json; направления без блока proof —
 * реалистичные типовые предложения без публичного кейса в базе.
 */

export interface Category {
  id: string;
  name: string;
}

export interface Offer {
  id: string;
  category: string;
  /** Формулировка боли голосом клиента — заголовок карточки. */
  title: string;
  pain: string;
  solution: string;
  /** «Что вы получите» — уверенные типовые диапазоны. */
  outcomes: string[];
  /** «Реальные проекты» — обезличенные результаты из базы кейсов; может быть пустым. */
  proof: string[];
  budget: string;
  timeline: string;
  first_step: string;
}

export interface OffersData {
  categories: Category[];
  offers: Offer[];
}
