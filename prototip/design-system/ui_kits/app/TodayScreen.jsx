const { Display, BodyText, Eyebrow, Rule, Card, Button, ActionLink, Chip, Numeral, TabBar, PhotoTile, ProgressBar, DayDots } = window.ThresholdDesignSystem_2ce5e4;

function ObservingHero({ day, insight, onInsightOk }) {
  if (day === 0) return (
    <Card variant="dark">
      <Eyebrow tone="dark">Today · day 0</Eyebrow>
      <Display size="hero" dark style={{ marginTop:10 }}>Tonight — your first day card</Display>
      <Rule dark style={{ margin:'14px 0' }} />
      <BodyText tone="dark" size="sm">Live as usual. In the evening, three questions and thirty seconds.</BodyText>
    </Card>
  );
  if (insight) return (
    <Card variant="dark">
      <Eyebrow tone="dark">One week in</Eyebrow>
      <Display size="card" dark style={{ marginTop:10 }}>The first thing we see</Display>
      <Rule dark style={{ margin:'14px 0' }} />
      <BodyText tone="dark">In four of your five rough days, the night was shorter than six hours.</BodyText>
      <BodyText tone="muted" size="sm" style={{ marginTop:12 }}>
        For now this is an observation, not a conclusion — there isn't much data yet. Too early to talk about food, and we won't guess.
      </BodyText>
      <Button variant="cream" style={{ marginTop:16 }} onClick={onInsightOk}>Got it</Button>
    </Card>
  );
  return (
    <Card variant="dark" style={{ padding:'14px 20px' }}>
      <Eyebrow tone="dark">Observing</Eyebrow>
      <Display size="inline" dark style={{ marginTop:6 }}>Eat as usual</Display>
      <BodyText tone="dark" size="xs" style={{ marginTop:6 }}>
        Nothing to restrict. Tonight: three questions and thirty seconds. A photo of a meal when it is convenient.
      </BodyText>
    </Card>
  );
}

function TestHero({ check }) {
  const swaps = ['oatmeal with water', 'lactose-free cheese', 'coffee with oat milk'];
  if (check.day <= 5) return (
    <Card variant="dark">
      <Eyebrow tone="dark">Test: dairy · Day {check.day}</Eyebrow>
      <Display size="hero" dark style={{ marginTop:10 }}>Today without dairy</Display>
      <Rule dark style={{ margin:'14px 0' }} />
      <BodyText tone="dark" size="xs">Swaps from your own meals</BodyText>
      <div style={{ display:'flex', flexDirection:'column', gap:6, marginTop:10 }}>
        {swaps.map((s) => (
          <Card key={s} variant="lift" style={{ padding:'11px 16px' }}>
            <BodyText tone="dark" size="sm">{s}</BodyText>
          </Card>
        ))}
      </div>
    </Card>
  );
  const step = check.day - 5;
  return (
    <Card variant="dark">
      <Eyebrow tone="dark">Test: dairy · Day {check.day}</Eyebrow>
      <Display size="card" dark style={{ marginTop:10 }}>Bringing it back, dose {step} of 3</Display>
      <Rule dark style={{ margin:'14px 0' }} />
      <Numeral size="xl" dark unit={['a quarter cup','half a cup','a full cup'][step-1]}>{['¼','½','1'][step-1]}</Numeral>
    </Card>
  );
}

/* Pluralisation follows the source string table (prototip/web/threshold-prototype.html, progress). */
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

function TodayScreen({ day, check, insight, meals, tested, onInsightOk, onOpenDay, onAddMeal, onOpenPlan, onEditYesterday, tab, onTab, onTapTop }) {
  const pct = Math.min(100, Math.round((100 * day) / 21));
  return (
    <AppScreen pinned>
      <TopRow left={`Today · day ${day}`} right={check ? 'Test: dairy' : 'Observing'} onClick={onTapTop} />
      <Feed>
        {check ? <TestHero check={check} /> : <ObservingHero day={day} insight={insight} onInsightOk={onInsightOk} />}
        {day > 0 && onEditYesterday ? (
          <Card variant="quiet" tight onClick={onEditYesterday} style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <Eyebrow tight>Yesterday · day {day - 1}</Eyebrow>
              <BodyText tone="soft" size="xs" style={{ marginTop:4 }}>belly 4 · bloating 6 · stool 5</BodyText>
            </div>
            <ActionLink style={{ flex:'none' }}>Edit</ActionLink>
          </Card>
        ) : null}
        {tested ? (
          <Card variant="accent">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
              <Eyebrow tone="forest">Your threshold</Eyebrow>
              <Eyebrow tight>dairy</Eyebrow>
            </div>
            <div style={{ display:'flex', alignItems:'baseline', gap:8, marginTop:8 }}>
              <Numeral size="md" unit="ml is fine">125</Numeral>
            </div>
            <BodyText size="xs" style={{ marginTop:6 }}>250 ml brings symptoms. Below the dose — freely.</BodyText>
          </Card>
        ) : null}
        {check ? (
          <Card variant="quiet" tight onClick={onOpenPlan}>
            <DayDots pattern={[...Array(8)].map((_, i) => (i + 1 < check.day ? 'd' : i + 1 === check.day ? 't' : 'a')).join('')} />
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:6 }}>
              <BodyText size="xs" strong>day {check.day} of 8 · {check.day <= 5 ? 'without dairy' : 'bringing it back'}</BodyText>
              <ActionLink>Test plan</ActionLink>
            </div>
          </Card>
        ) : day > 0 ? (
          <Card variant="quiet" tight onClick={() => onTab('path')}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <BodyText size="xs" strong>{plural(day, 'day', 'days')} collected</BodyText>
              <ActionLink>Open the path</ActionLink>
            </div>
            <ProgressBar value={pct} style={{ margin:'2px 0 8px' }} />
            <BodyText tone="soft" size="xs">{day < 7 ? `first insight in ${plural(7 - day, 'day', 'days')}` : `about ${plural(Math.max(1, 21 - day), 'day', 'days')} more to a suspect`}</BodyText>
          </Card>
        ) : null}
        <MealStrip meals={meals} onAdd={onAddMeal} />
        <BackgroundCard />
        <Card variant="line" style={{ padding:'4px 20px 14px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <Eyebrow>Tip of the day</Eyebrow>
            <ActionLink onClick={() => onTab('tips')}>All tips</ActionLink>
          </div>
          <BodyText size="sm" strong style={{ marginTop:2 }}>Eating out — as usual</BodyText>
        </Card>
      </Feed>
      <Hint center>Three questions, thirty seconds.</Hint>
      <Button onClick={onOpenDay}>Close the day</Button>
      <TabBar value={tab} onChange={onTab} tabs={[{ id:'today', label:'Today' }, { id:'path', label:'Path' }, { id:'tips', label:'Tips' }]} />
    </AppScreen>
  );
}

Object.assign(window, { TodayScreen });
