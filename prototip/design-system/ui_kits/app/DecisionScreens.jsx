const { Display, BodyText, Eyebrow, Rule, Card, Button, Numeral, ActionLink, DayDots } = window.ThresholdDesignSystem_2ce5e4;

function SuspicionScreen({ onTest, onNotNow, onOther }) {
  return (
    <AppScreen>
      <TopRow left="A suspect" right="day 21" />
      <Display size="screen">Dairy keeps showing up on your rough days</Display>
      <Rule />
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
        <Card variant="dark">
          <Numeral size="xl" dark unit="/ 15">12</Numeral>
          <Eyebrow tone="dark" tight style={{ marginTop:10 }}>rough days with dairy</Eyebrow>
        </Card>
        <Card variant="quiet">
          <Numeral size="xl" unit="/ 20">3</Numeral>
          <Eyebrow tight style={{ marginTop:10 }}>good days with dairy</Eyebrow>
        </Card>
      </div>
      <BodyText size="lead">Dairy showed up in 12 of your 15 rough days. On good days — 3 of 20.</BodyText>
      <BodyText>This could be a coincidence — about a quarter of patterns like this turn out to be. Want to test it over eight days?</BodyText>
      <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:'auto' }}>
        <Button variant="accent" onClick={onTest}>Let's test it</Button>
        <Button variant="accent" onClick={onNotNow}>Not now</Button>
        <Button variant="accent" onClick={onOther}>Another suspect</Button>
      </div>
    </AppScreen>
  );
}

function VerdictScreen({ notConfirmed, onNext, onPath }) {
  return (
    <AppScreen>
      <TopRow left="The answer" right="Dairy · day 8" />
      <Display size="answer" style={{ marginTop:24 }}>
        {notConfirmed ? 'Not confirmed: the difference stayed within your usual range' : 'Milk: up to 125 ml is fine, 250 ml brings symptoms'}
      </Display>
      <Rule />
      <BodyText tone={notConfirmed ? 'default' : 'soft'}>
        {notConfirmed
          ? "You can bring dairy back. The restriction you were keeping wasn't needed — and that's an answer too."
          : 'The threshold was measured against your own day-to-day variation, with one control day inside the test.'}
      </BodyText>
      <Card variant="quiet" style={{ marginTop:8 }}>
        <Eyebrow>Next suspect</Eyebrow>
        <BodyText style={{ marginTop:8 }}>Fructans showed up in 9 of your 15 rough days. On good days — 5 of 20.</BodyText>
      </Card>
      <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:'auto' }}>
        <Button onClick={onNext}>Next suspect: fructans</Button>
        <div onClick={onPath} style={{ textAlign:'center', padding:12, minHeight:44, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
          <BodyText strong>To the path</BodyText>
        </div>
      </div>
    </AppScreen>
  );
}

function TestPlanScreen({ onClose, day }) {
  const rows = [['1–5','Without the group','Swaps from your own meals. Everything else as usual.'],['6','Bringing it back, ¼','Starts when the days are calm.'],['7','Bringing it back, ½',''],['8','Bringing it back, full dose','Then the answer.']];
  return (
    <AppScreen pinned>
      <TopRow left="Test plan" right={`day ${day}`} />
      <Feed>
        <Display size="screen">Test plan</Display>
        <Rule />
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {rows.map(([d, h, b], i) => (
            <Card key={d} variant={(i === 0 && day <= 5) || (i > 0 && day === 5 + i) ? 'default' : 'quiet'} style={{ display:'flex', gap:12, alignItems:'flex-start', padding:'13px 16px' }}>
              <Numeral size="xs" style={{ flex:'none', width:36, marginTop:2 }}>{d}</Numeral>
              <div>
                <BodyText size="sm" strong>{h}</BodyText>
                {b ? <BodyText tone="soft" size="xs" style={{ marginTop:3 }}>{b}</BodyText> : null}
              </div>
            </Card>
          ))}
        </div>
        <Card variant="quiet">
          <BodyText tone="soft" size="xs">
            A day after a short night (under 6 h), alcohol or illness is not counted — the dose moves. A missed day pauses the test, it does not fail it.
          </BodyText>
        </Card>
      </Feed>
      <Button variant="ghost" onClick={onClose}>Close</Button>
    </AppScreen>
  );
}

function RedFlagScreen({ onDoctor, onBack }) {
  return (
    <AppScreen tone="dark">
      <TopRow left="Protocol paused" right="" dark />
      <Display size="answer" dark style={{ marginTop:24 }}>This could be more serious than IBS</Display>
      <Rule dark />
      <BodyText tone="dark" size="lead">
        Please see a doctor — here is what to show them. We do not interpret this sign, we only make sure it is not missed.
      </BodyText>
      <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:'auto' }}>
        <Button variant="cream" onClick={onDoctor}>Page for your doctor</Button>
        <div onClick={onBack} style={{ textAlign:'center', padding:12, minHeight:44, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
          <BodyText tone="dark" strong>Back to the diary</BodyText>
        </div>
      </div>
    </AppScreen>
  );
}

Object.assign(window, { SuspicionScreen, VerdictScreen, TestPlanScreen, RedFlagScreen });
