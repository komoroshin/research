const { Display, BodyText, Eyebrow, Rule, Card, Button, Chip, Numeral, ActionLink, PhotoTile } = window.ThresholdDesignSystem_2ce5e4;

const DISHES = [
  { name: 'Oatmeal with milk', groups: ['lactose'], moment: 'morning', times: 12 },
  { name: 'Coffee with milk', groups: ['lactose'], moment: 'morning', times: 21 },
  { name: 'Caesar salad', groups: ['lactose'], moment: 'day', times: 6 },
  { name: 'Garlic pasta', groups: ['fructans'], moment: 'day', times: 9 },
  { name: 'Chicken and rice', groups: [], moment: 'evening', times: 14 },
  { name: 'Apple', groups: ['fructose', 'sorbitol'], moment: 'snack', times: 8 },
];

/* ── 1 · Capture first ─────────────────────────────────────────────
   Smallest change: the photo tile becomes the top of the screen and goes
   full width, voice/text drop to a quiet secondary row, and the recent list
   logs in one tap. Fixes the inverted hierarchy, nothing else. */
function MealCaptureFirst({ onLog }) {
  const [logged, setLogged] = React.useState(null);
  return (
    <AppScreen pinned>
      <TopRow left="Add a meal" right="day 24" />
      <Feed>
        <Display size="hero">What did you eat</Display>
        <PhotoTile label="Snap a meal" sub="we recognise the dish and its groups" style={{ minHeight: 150 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <Card variant="quiet" tight style={{ minHeight: 52, display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <BodyText size="sm" strong>Say it</BodyText>
          </Card>
          <Card variant="quiet" tight style={{ minHeight: 52, display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <BodyText size="sm" strong>Type it</BodyText>
          </Card>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 4 }}>
          <Eyebrow>Or one tap from your own</Eyebrow>
          <Eyebrow tight>this week</Eyebrow>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {DISHES.slice(0, 5).map((d) => (
            <Card key={d.name} variant={logged === d.name ? 'accent' : 'quiet'} tight
              onClick={() => { setLogged(d.name); onLog(d); }}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 52 }}>
              <BodyText size="sm">{d.name}</BodyText>
              <div style={{ display: 'flex', gap: 4 }}>{d.groups.map((g) => <Chip key={g} tone="sage">{g}</Chip>)}</div>
            </Card>
          ))}
        </div>
        <Hint>A day with meals counts towards finding a suspect. A day without them counts for wellbeing only.</Hint>
      </Feed>
      <Button variant="ghost">Back</Button>
    </AppScreen>
  );
}

/* ── 2 · One-tap log ──────────────────────────────────────────────
   The list IS the screen. Every row logs immediately and the toast carries
   the undo, so the returning user — who eats the same six things — never
   sees a confirmation step. Capture methods compress to one row on top. */
function MealOneTap({ onLog }) {
  const [log, setLog] = React.useState([{ time: '08:30', name: 'Coffee with milk', groups: ['lactose'] }]);
  const add = (d) => { setLog((l) => [...l, { time: '13:10', name: d.name, groups: d.groups }]); onLog(d); };
  return (
    <AppScreen pinned>
      <TopRow left="Meals · day 24" right={`${log.length} logged`} />
      <Feed>
        <div>
          <Display size="hero">One tap and it's in</Display>
          <BodyText tone="soft" size="xs" style={{ marginTop: 4 }}>Nothing to confirm. Tap a dish to log it, tap it again to undo.</BodyText>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 8 }}>
          <Card variant="dark" tight style={{ minHeight: 52, display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <BodyText size="sm" strong tone="dark">Photo</BodyText>
          </Card>
          <Card variant="quiet" tight style={{ minHeight: 52, display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <BodyText size="sm">Voice</BodyText>
          </Card>
          <Card variant="quiet" tight style={{ minHeight: 52, display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <BodyText size="sm">Text</BodyText>
          </Card>
        </div>
        <Eyebrow>Yours, most often first</Eyebrow>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[...DISHES].sort((a, b) => b.times - a.times).map((d) => (
            <Card key={d.name} variant="quiet" tight onClick={() => add(d)}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 52 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <Numeral size="2xs" style={{ width: 26, flex: 'none' }}>{d.times}</Numeral>
                <BodyText size="sm">{d.name}</BodyText>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>{d.groups.map((g) => <Chip key={g} tone="sage">{g}</Chip>)}</div>
            </Card>
          ))}
        </div>
        <Eyebrow>Today</Eyebrow>
        <Card variant="quiet" style={{ padding: '6px 18px' }}>
          {log.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 0', borderBottom: i === log.length - 1 ? 0 : '1px solid var(--border-hairline)' }}>
              <Numeral size="2xs" style={{ width: 44, flex: 'none' }}>{m.time}</Numeral>
              <BodyText size="sm" strong style={{ flex: 1 }}>{m.name}</BodyText>
              <div style={{ display: 'flex', gap: 4 }}>{m.groups.map((g) => <Chip key={g} tone="sage">{g}</Chip>)}</div>
            </div>
          ))}
        </Card>
      </Feed>
      <Button variant="ghost">Done</Button>
    </AppScreen>
  );
}

/* ── 3 · Meal moments ─────────────────────────────────────────────
   Adds the control the screen is missing: which meal this was. The moment
   sets the time, each moment carries its own recents, and the test-dose line
   gets the room it deserves — it is the most motivating line in the flow. */
function MealMoments({ onLog, inTest = true }) {
  const MOMENTS = [
    { id: 'morning', label: 'Morning', time: '08:30' },
    { id: 'day', label: 'Day', time: '13:10' },
    { id: 'evening', label: 'Evening', time: '19:20' },
    { id: 'snack', label: 'Snack', time: '16:00' },
  ];
  const [moment, setMoment] = React.useState('day');
  const [picked, setPicked] = React.useState(null);
  const active = MOMENTS.find((m) => m.id === moment);
  const list = DISHES.filter((d) => d.moment === moment);
  const isProbe = picked && picked.groups.includes('lactose');
  return (
    <AppScreen pinned>
      <TopRow left="Add a meal" right="day 24" />
      <Feed>
        <div>
          <Display size="hero">What did you eat</Display>
          <BodyText tone="soft" size="xs" style={{ marginTop: 4 }}>Pick the moment — it sets the time for you.</BodyText>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 6 }}>
          {MOMENTS.map((m) => {
            const on = m.id === moment;
            return (
              <div key={m.id} onClick={() => { setMoment(m.id); setPicked(null); }}
                style={{ borderRadius: 'var(--radius-tile)', padding: '10px 8px 8px', cursor: 'pointer', minHeight: 66,
                  background: on ? 'var(--control-on)' : 'var(--surface-card-quiet)',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Numeral size="2xs" dark={on}>{m.time}</Numeral>
                <div style={{ fontFamily: 'var(--font-text)', fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: on ? 'var(--text-body-on-dark)' : 'var(--text-eyebrow)' }}>{m.label}</div>
              </div>
            );
          })}
        </div>
        {picked ? (
          <Card variant="accent">
            <Eyebrow tone="forest">Recognized · {active.time}</Eyebrow>
            <Display size="card" style={{ marginTop: 8 }}>{picked.name}</Display>
            <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
              {picked.groups.length ? picked.groups.map((g) => <Chip key={g}>{g}</Chip>) : <Chip style={{ opacity: 0.6 }}>no known group</Chip>}
            </div>
            {inTest && isProbe ? (
              <>
                <Rule style={{ margin: '14px 0' }} />
                <BodyText size="sm" strong>This is today's test dose — counted.</BodyText>
              </>
            ) : null}
          </Card>
        ) : (
          <>
            <PhotoTile label={`Snap your ${active.label.toLowerCase()}`} sub="photo · voice · text" style={{ minHeight: 132 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Eyebrow>Usually at {active.time}</Eyebrow>
              <Eyebrow tight>{list.length} dishes</Eyebrow>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {list.map((d) => (
                <Card key={d.name} variant="quiet" tight onClick={() => { setPicked(d); onLog(d); }}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 52 }}>
                  <BodyText size="sm">{d.name}</BodyText>
                  <div style={{ display: 'flex', gap: 4 }}>{d.groups.map((g) => <Chip key={g} tone="sage">{g}</Chip>)}</div>
                </Card>
              ))}
            </div>
          </>
        )}
        <Hint>{`One meal makes the day count as full — that's what finds the suspect.`}</Hint>
      </Feed>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Button disabled={!picked}>Save</Button>
        <Button variant="ghost" onClick={() => setPicked(null)}>{picked ? 'Fix' : 'Back'}</Button>
      </div>
    </AppScreen>
  );
}

Object.assign(window, { MealCaptureFirst, MealOneTap, MealMoments, DISHES });
