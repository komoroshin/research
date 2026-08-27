/** Типы данных библиотеки AI-кейсов. Соответствуют data/taxonomy.json и data/cases.json. */

export type EvidenceGrade = 'A' | 'B' | 'C' | 'D';
export type MetricStatus = 'measured' | 'reported' | 'projected';

export interface CaseMetric {
  metric_type: string;
  metric_name: string;
  baseline?: string;
  result: string;
  delta?: string;
  status: MetricStatus;
  source_url: string;
  source_type?: string;
}

export interface CaseSource {
  url: string;
  title?: string;
  type?: string;
  publisher?: string;
  date?: string;
}

export interface AiCase {
  id: string;
  title: string;

  client: string;
  client_disclosed: boolean;
  client_url?: string;

  vendor: string[];
  vendor_type?: string;
  technology_providers?: string[];

  country: string;
  region: string;

  industry: string;
  subindustry: string[];

  business_function: string[];
  business_process: string[];

  problem: string;
  before_state?: string;

  solution: string;
  ai_mechanisms: string[];

  data_used?: string[];
  integrations?: string[];

  deployment: string;
  stage: string;

  scale?: string;

  metrics: CaseMetric[];

  timeline?: string;
  budget_disclosed: number | null;
  budget_note?: string;

  result_summary: string;

  sources: CaseSource[];
  primary_source?: string;

  evidence_grade: EvidenceGrade;
  vendor_claim: boolean;

  sales_relevance: number;

  why_it_matters?: string;
  entry_hypothesis?: string;
  likely_buyer?: string[];

  land_opportunity?: string;
  expand_opportunities?: string[];

  tags?: string[];
  research_notes?: string;
}

export interface TaxonomyTerm {
  id: string;
  label_ru: string;
  label_en: string;
  [key: string]: unknown;
}

export interface IndustryTerm extends TaxonomyTerm {
  subindustries: TaxonomyTerm[];
}

export interface ProcessTerm extends TaxonomyTerm {
  function: string;
}

export interface MetricTypeTerm extends TaxonomyTerm {
  group: string;
}

export interface StageTerm extends TaxonomyTerm {
  order: number;
}

export interface CollectionTerm {
  id: string;
  label_ru: string;
  label_en: string;
  filter: Record<string, unknown>;
}

export interface Taxonomy {
  version: string;
  updated: string;
  industries: IndustryTerm[];
  business_functions: TaxonomyTerm[];
  business_processes: ProcessTerm[];
  ai_mechanisms: TaxonomyTerm[];
  metric_types: MetricTypeTerm[];
  metric_groups: TaxonomyTerm[];
  metric_status: TaxonomyTerm[];
  source_types: TaxonomyTerm[];
  evidence_grades: TaxonomyTerm[];
  stages: StageTerm[];
  deployments: TaxonomyTerm[];
  vendor_types: TaxonomyTerm[];
  regions: TaxonomyTerm[];
  likely_buyers: TaxonomyTerm[];
  collections: CollectionTerm[];
}

/** Активные фильтры. Все поля — множественный выбор, кроме поисковой строки и порогов. */
export interface Filters {
  q: string;
  region: string[];
  country: string[];
  industry: string[];
  subindustry: string[];
  business_function: string[];
  business_process: string[];
  ai_mechanisms: string[];
  vendor: string[];
  evidence_grade: string[];
  stage: string[];
  deployment: string[];
  metric_group: string[];
  sales_relevance_min: number;
  has_metrics: boolean;
  /** Только кейсы, где источник сообщает о фактически измеренном результате (пп. 58–59 ТЗ). */
  measured_only: boolean;
  named_client: boolean;
}

export type ViewMode = 'dashboard' | 'cards' | 'table' | 'matrix' | 'compare';
