/**
 * Типы клиентской версии. Источник данных — generated/client-cases.json,
 * который собирается скриптом scripts/build-client-data.mjs по белому списку полей.
 * Внутренних полей (Sales Lens, research_notes, evidence_grade) здесь нет намеренно.
 */

export type MetricStatus = 'measured' | 'reported' | 'projected';

export interface ClientMetric {
  metric_type: string;
  metric_name: string;
  baseline?: string;
  result: string;
  delta?: string;
  status: MetricStatus;
  source_url: string;
  source_type?: string;
}

export interface ClientSource {
  url: string;
  title?: string;
  type?: string;
  publisher?: string;
  date?: string;
}

export interface Confidence {
  level: 'high' | 'medium' | 'limited';
  label: string;
}

export interface ClientCase {
  id: string;
  title: string;
  client: string;
  client_disclosed: boolean;
  country: string;
  region: string;
  industry: string;
  subindustry: string[];
  business_process: string[];
  ai_mechanisms: string[];
  problem: string;
  before_state?: string;
  solution: string;
  data_used?: string[];
  integrations?: string[];
  deployment: string;
  stage: string;
  scale?: string;
  metrics: ClientMetric[];
  timeline?: string;
  result_summary: string;
  sources: ClientSource[];
  primary_source?: string;
  vendor: string[];
  technology_providers?: string[];
  tags?: string[];
  confidence: Confidence;
  /** «С чего можно начать» — первый небольшой проект (бывш. land_opportunity). */
  first_step?: string;
  /** «Куда это развивается» — соседние процессы (бывш. expand_opportunities). */
  growth_paths?: string[];
}

export type View = 'home' | 'cases' | 'compare';

export interface ClientFilters {
  q: string;
  industry: string[];
  business_process: string[];
  measured_only: boolean;
}
