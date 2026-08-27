import type { AiCase, EvidenceGrade, MetricStatus } from '../types';

const GRADE_TEXT: Record<EvidenceGrade, string> = {
  A: 'Strong evidence',
  B: 'Good evidence',
  C: 'Limited evidence',
  D: 'Marketing claim',
};

/**
 * Качество доказательств видно до открытия кейса (п.37 ТЗ).
 * Для B/C дополнительно помечаем, что цифры пришли со стороны подрядчика.
 */
export function Grade({ grade, vendorClaim }: { grade: EvidenceGrade; vendorClaim?: boolean }) {
  const suffix = vendorClaim && grade !== 'A' ? ' · vendor-reported' : '';
  return (
    <span className={`grade grade-${grade}`} title={GRADE_TEXT[grade] + suffix}>
      {grade} · {GRADE_TEXT[grade]}
      {suffix}
    </span>
  );
}

export function Stars({ value }: { value: number }) {
  const n = Math.max(0, Math.min(5, Math.round(value)));
  return (
    <span className="stars" title={`Sales relevance: ${n} из 5`}>
      <b>{'★'.repeat(n)}</b>
      {'☆'.repeat(5 - n)}
    </span>
  );
}

const STATUS_LABEL: Record<MetricStatus, string> = {
  measured: 'Measured',
  reported: 'Reported',
  projected: 'Projected',
};

const STATUS_HINT: Record<MetricStatus, string> = {
  measured: 'Источник сообщает о фактически достигнутом результате',
  reported: 'Цифра заявлена стороной проекта без описания методики измерения',
  projected: 'Источник говорит об ожидаемом или плановом эффекте, а не о достигнутом',
};

export function MetricStatusBadge({ status }: { status: MetricStatus }) {
  return (
    <span className={`mstatus ${status}`} title={STATUS_HINT[status]}>
      {STATUS_LABEL[status]}
    </span>
  );
}

/** Самая показательная метрика кейса: сначала измеренные, потом заявленные, потом плановые. */
export function headlineMetric(c: AiCase) {
  const order: MetricStatus[] = ['measured', 'reported', 'projected'];
  for (const s of order) {
    const hit = c.metrics.find((m) => m.status === s);
    if (hit) return hit;
  }
  return undefined;
}
