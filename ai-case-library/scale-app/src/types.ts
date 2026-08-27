/**
 * Типы каталога «проекты вашего масштаба». Источник данных —
 * generated/scale-cases.json (собирается scripts/build-scale-data.mjs).
 * Каталог обезличен: имён студий, клиентов и ссылок на источники здесь нет намеренно.
 */

export type BudgetBand = 'usd_50_200k' | 'usd_200k_1m' | 'undisclosed';

export interface ScaleMetric {
  name: string;
  result: string;
  status: 'reported';
}

export interface ScaleCase {
  id: string;
  title: string;
  /** Рукописный клиентский заголовок «сразу про результат»; есть у кейсов с цифрами. */
  headline?: string;
  region: string;
  geo: string;
  industry: string;
  business_process: string[];
  ai_mechanisms: string[];
  client_profile: string;
  /**
   * Исходная бизнес-проблема («что болело в деньгах/клиентах/рисках»).
   * Источники редко формулируют её явно, поэтому это реконструкция исследователя —
   * интерфейс честно проговаривает это в секции «Откуда этот кейс».
   */
  pain: string;
  problem: string;
  solution: string;
  result_summary: string;
  metrics: ScaleMetric[];
  budget_band: BudgetBand;
  budget_note: string | null;
  duration_months: number | null;
  year: number;
}

export type View = 'home' | 'cases' | 'compare';

export interface ScaleFilters {
  q: string;
  industry: string[];
  business_process: string[];
  budget: BudgetBand[];
  with_numbers: boolean;
}
