const { Display, BodyText, Eyebrow, Card, Numeral, Chip } = window.ThresholdDesignSystem_2ce5e4;

/* The evening ritual without storing anything: the day itself is the object.
   A thin band spans 06:00–24:00 and each logged meal drops a mark onto it, so the day
   visibly fills up as it goes; underneath, each meal is a typographic tile — the time in
   Oswald, the dish, its groups. No photographs are kept: a snapped photo is recognised and
   discarded, and what remains is the dish and the hour. */
const START = 6;
const END = 24;
const pos = (time) => {
  const [h, m] = String(time).split(':').map(Number);
  const hours = h + (m || 0) / 60;
  return Math.max(0, Math.min(100, ((hours - START) / (END - START)) * 100));
};

function MealStrip({ meals = [], onAdd }) {
  const marks = ['06', '12', '18', '24'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Eyebrow>Your day</Eyebrow>
        <Eyebrow tight>{meals.length ? `${meals.length} logged` : 'nothing yet'}</Eyebrow>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ position: 'relative', height: 22 }}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 7, height: 8, borderRadius: 'var(--radius-bar)', background: 'var(--track-empty)' }} />
          {meals.map((m, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `calc(${pos(m.time)}% - 11px)`,
                top: 0,
                width: 22,
                height: 22,
                borderRadius: 11,
                background: 'var(--control-on)',
                boxShadow: '0 0 0 4px var(--surface-screen)',
              }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {marks.map((h) => (
            <div key={h} style={{ fontFamily: 'var(--font-text)', fontSize: 'var(--eyebrow-size)', fontWeight: 500, letterSpacing: 'var(--eyebrow-tracking-tight)', color: 'var(--text-eyebrow-soft)' }}>{h}</div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', margin: '0 -20px', padding: '0 20px 2px' }}>
        {meals.map((m, i) => (
          <div
            key={i}
            style={{ width: 132, flex: 'none', minHeight: 116, borderRadius: 'var(--radius-card)', background: 'var(--surface-card-quiet)', boxShadow: 'var(--ring-hairline)', padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 8 }}
          >
            <Numeral size="xs">{m.time}</Numeral>
            <div>
              <BodyText size="xs" strong style={{ lineHeight: 1.25 }}>{m.name}</BodyText>
              {m.groups && m.groups.length ? (
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 6 }}>
                  {m.groups.map((g) => <Chip key={g} tone="sage">{g}</Chip>)}
                </div>
              ) : null}
            </div>
          </div>
        ))}
        <div
          onClick={onAdd}
          role="button"
          tabIndex={0}
          style={{ width: 132, flex: 'none', minHeight: 116, borderRadius: 'var(--radius-card)', background: 'var(--surface-card-dark)', boxShadow: 'var(--shadow-card-sm)', cursor: 'pointer', position: 'relative', overflow: 'hidden', padding: '12px 14px', display: 'flex', alignItems: 'flex-end' }}
        >
          <div style={{ position: 'absolute', right: -20, top: -28, width: 84, height: 84, borderRadius: '50%', background: 'var(--surface-card-lift)' }} />
          <div style={{ position: 'absolute', right: 14, top: 12, width: 24, height: 24, borderRadius: '50%', boxShadow: 'inset 0 0 0 3px var(--sage-300)' }} />
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', fontSize: 'var(--display-tile)', lineHeight: 1.04, letterSpacing: '-0.02em', color: 'var(--text-display-on-dark)', position: 'relative' }}>
            Add a meal
          </div>
        </div>
      </div>

      <BodyText tone="soft" size="2xs">
        {meals.length
          ? 'Photos are read and discarded — we keep the dish and the hour, not the picture.'
          : 'One meal — and the day counts as full. Photos are read and discarded.'}
      </BodyText>
    </div>
  );
}

Object.assign(window, { MealStrip });
