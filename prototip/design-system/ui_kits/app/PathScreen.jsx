const { Display, BodyText, Eyebrow, Rule, Card, Button, PathNode, ProgressBar, DayDots, ActionLink, Numeral, TabBar, Notice } = window.ThresholdDesignSystem_2ce5e4;

/* What each group is and where it turns up — the content exists in Tips but was never
   attached to the map, so six unfamiliar words sat there unexplained. */
const GROUP_NOTES = {
  Lactose: 'The sugar in milk. Milk, soft cheese, ice cream, milk chocolate, cream sauces.',
  Fructans: 'A chain sugar in wheat and onion. Bread, pasta, onion, garlic, rye.',
  GOS: 'A chain sugar in legumes. Beans, chickpeas, lentils, soy, cashews, pistachios.',
  Fructose: 'Fruit sugar in excess of glucose. Apple, pear, mango, honey, high-fructose syrup.',
  Sorbitol: 'A sugar alcohol. Stone fruit, avocado, sugar-free gum and mints.',
  Mannitol: 'A sugar alcohol. Mushrooms, cauliflower, celery, sugar-free sweets.',
};

function PathScreen({ day, tested, check, tab, onTab, onDoctor, onRestaurant }) {
  const [openGroup, setOpenGroup] = React.useState(null);
  const groups = [['Lactose', tested ? 'tested: up to 125 ml' : 'observing'], ['Fructans','observing'], ['GOS','observing'], ['Fructose','observing'], ['Sorbitol','observing'], ['Mannitol','observing']];
  const pct = Math.min(100, Math.round((100 * day) / 21));
  return (
    <AppScreen pinned>
      <TopRow left="Path" right={`day ${day}`} />
      <Feed>
        <div>
          <Display size="screen">Your path</Display>
          <BodyText tone="soft" size="xs" style={{ marginTop:4 }}>{check ? 'Test: dairy' : 'Observing'} · day {day}</BodyText>
        </div>
        <div>
          <PathNode title="Observing" meta={day >= 21 ? 'completed' : `day ${day} of ~21`} state={day >= 21 ? 'done' : 'current'}>
            <ProgressBar value={pct} style={{ marginBottom:8 }} />
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
              <Metric value={Math.min(20, day)} label="full" />
              <Metric value={Math.min(10, Math.round(day / 2))} label="rough" />
              <Metric value={Math.min(10, Math.round(day / 2))} label="good" />
            </div>
          </PathNode>
          <PathNode title="First insight" meta={day >= 7 ? 'Sep 7' : 'day 7'} state={day >= 7 ? 'done' : 'ahead'}>
            {day >= 7 ? <BodyText tone="soft" size="xs">In four of your five rough days, the night was shorter than six hours.</BodyText> : null}
          </PathNode>
          <PathNode title="Suspect" meta={day >= 21 ? 'dairy' : 'when the data is in'} state={day >= 21 ? 'done' : 'ahead'}>
            {day >= 21 ? <BodyText tone="soft" size="xs">Dairy showed up in 12 of your 15 rough days. On good days — 3 of 20.</BodyText> : null}
          </PathNode>
          <PathNode title="Test 1 · dairy" meta={check ? 'days 22–29' : tested ? 'completed' : 'when the data is in'} state={check ? 'current' : tested ? 'done' : 'ahead'}>
            {check ? (
              <>
                <DayDots pattern={[...Array(8)].map((_, i) => (i + 1 < check.day ? 'd' : i + 1 === check.day ? 't' : 'a')).join('')} />
                <BodyText tone="soft" size="2xs" style={{ marginTop:4 }}>day {check.day} of 8 · in progress</BodyText>
              </>
            ) : tested ? <BodyText tone="soft" size="xs">up to 125 ml tolerated; 250 ml — symptoms</BodyText> : null}
          </PathNode>
          <PathNode title="Answer 1" meta={tested ? '' : 'after the answer'} state={tested ? 'done' : 'ahead'}>
            {tested ? <BodyText size="xs" strong>Milk: up to 125 ml is fine, 250 ml brings symptoms</BodyText> : null}
          </PathNode>
          <PathNode title="Next test" meta="after the answer" state="ahead" last />
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:6 }}>
          <Eyebrow>Tolerance map</Eyebrow>
          <Eyebrow tight>{tested ? '1 of 6 tested' : 'observing'}</Eyebrow>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          {groups.map(([g, s], i) => (
            <Card key={g} variant="quiet" tight
              onClick={() => setOpenGroup(openGroup === g ? null : g)}
              style={i === 0 && tested ? { background:'var(--surface-answered)' } : undefined}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                <BodyText size="sm" strong>{g}</BodyText>
                <BodyText tone="soft" size="2xs" style={{ textAlign:'right' }}>{s}</BodyText>
              </div>
              {openGroup === g ? (
                <BodyText tone="soft" size="xs" style={{ marginTop:8 }}>{GROUP_NOTES[g]}</BodyText>
              ) : null}
            </Card>
          ))}
          <BodyText tone="soft" size="2xs" style={{ padding:'0 4px' }}>Tap a group to see what it is and where it turns up.</BodyText>
        </div>
        {tested ? null : <BodyText tone="soft" size="xs" style={{ padding:'0 4px' }}>Your first answer will appear after the first test.</BodyText>}
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          <Button variant={tested ? 'primary' : 'ghost'} onClick={onDoctor}>Page for your doctor</Button>
          <Button variant="ghost" onClick={onRestaurant}>Card for a restaurant</Button>
          <BodyText tone="soft" size="2xs" style={{ padding:'0 4px' }}>Both take your map outside the app: one for a clinician, one for a kitchen.</BodyText>
        </div>
      </Feed>
      <TabBar value={tab} onChange={onTab} tabs={[{ id:'today', label:'Today' }, { id:'path', label:'Path' }, { id:'tips', label:'Tips' }]} />
    </AppScreen>
  );
}

function TipsScreen({ tab, onTab, check }) {
  const set = check
    ? [['Swaps for today','Oatmeal with water, lactose-free cheese, coffee with oat milk — all from what you already eat.'],['At a party','Ask what is in the dish. If you cannot avoid the group, note it — the day will simply not count.'],['Ate it by accident','Nothing is lost. Mark the meal, the day is not counted, the test continues tomorrow.'],['Why a short night is not counted','Short sleep causes symptoms on its own. We cannot tell it apart from the food, so the dose moves to the next day.']]
    : [['Eating out — as usual','No restrictions while we watch. Order what you like and snap a photo if it is convenient.'],['Is yogurt okay?','Right now everything is on the table. If dairy ever comes under suspicion, we will suggest testing it — not banning it.'],['Why photos of meals','A day with meals counts towards finding a suspect. A day without meals counts for wellbeing only.'],['Why the first insight is about sleep','A week of data is enough to see sleep, not food. We do not guess about food early.']];
  const [open, setOpen] = React.useState(0);
  return (
    <AppScreen pinned>
      <TopRow left="Tips" right={check ? 'Test: dairy' : 'Observing'} />
      <Feed>
        <Display size="screen">Tips · {check ? 'Test: dairy' : 'Observing'}</Display>
        <Rule />
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {set.map(([q, a], i) => (
            <Card key={q} variant={open === i ? 'default' : 'quiet'} style={{ padding:'14px 18px', cursor:'pointer' }} onClick={() => setOpen(open === i ? -1 : i)}>
              <BodyText size="sm" strong={open === i}>{q}</BodyText>
              {open === i ? <BodyText tone="soft" size="sm" style={{ marginTop:8 }}>{a}</BodyText> : null}
            </Card>
          ))}
        </div>
        <Notice label="Coming soon">An assistant that answers from your own data, and insight cards pulled from your other records.</Notice>
      </Feed>
      <TabBar value={tab} onChange={onTab} tabs={[{ id:'today', label:'Today' }, { id:'path', label:'Path' }, { id:'tips', label:'Tips' }]} />
    </AppScreen>
  );
}

Object.assign(window, { PathScreen, TipsScreen });
