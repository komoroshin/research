const { Display, BodyText, Eyebrow, Rule, Button, SegmentedControl, Card, Notice, ActionLink } = window.ThresholdDesignSystem_2ce5e4;

function OnboardingScreen({ onStart, health, onHealth }) {
  const [q, setQ] = React.useState([0, 1, 1]);
  const set = (i) => (v) => setQ(q.map((x, k) => (k === i ? v : x)));
  const rows = [
    ['What bothers you', ['bloating', 'pain', 'bowel habits']],
    ['How often', ['less than weekly', 'a few times a week', 'almost daily']],
    ["What you've tried", ['nothing yet', 'cut foods on my own', 'with a dietitian']],
  ];
  return (
    <AppScreen pinned style={{ gap:10 }}>
      <Eyebrow>Threshold</Eyebrow>
      <Feed>
        <Display size="hero">For the first days we don't restrict anything — we watch</Display>
        <Rule />
        <Hint>Pick one in each row. You can change it later.</Hint>
        {rows.map(([label, opts], i) => (
          <div key={i} style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <Eyebrow>{label}</Eyebrow>
            <SegmentedControl options={opts} value={q[i]} onChange={set(i)} />
          </div>
        ))}
      </Feed>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {health === 'denied' ? (
          <Notice label="Demo data" action={<ActionLink onClick={() => onHealth('on')}>Connect Apple Health</ActionLink>}>
            Sleep and steps will be stand-in numbers. Everything else works, and we'll ask about your sleep in the evening.
          </Notice>
        ) : health === 'on' ? (
          <Card variant="accent" tight>
            <Eyebrow tone="forest">Apple Health connected</Eyebrow>
            <BodyText size="xs" style={{ marginTop:4 }}>We'll read sleep, steps and resting heart rate. Nothing is written back.</BodyText>
          </Card>
        ) : (
          <Card variant="quiet" tight>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
              <Eyebrow>Apple Health</Eyebrow>
              <Eyebrow tight>optional</Eyebrow>
            </div>
            <BodyText size="xs" style={{ marginTop:6 }}>
              So a short night isn't mistaken for a reaction to food, we can read your sleep, steps and resting heart rate. Read only — nothing is written back, and you can turn it off later.
            </BodyText>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:10 }}>
              <Button variant="ghost" style={{ minHeight:44, padding:'10px 12px', fontSize:14 }} onClick={() => onHealth('denied')}>Not now</Button>
              <Button style={{ minHeight:44, padding:'10px 12px', fontSize:14 }} onClick={() => onHealth('on')}>Connect</Button>
            </div>
          </Card>
        )}
        <Button onClick={onStart}>Start</Button>
        <BodyText tone="soft" size="3xs" style={{ textAlign:'center', padding:'2px 8px 0' }}>
          Observations, not a diagnosis. Treatment decisions stay with your doctor.
        </BodyText>
      </div>
    </AppScreen>
  );
}

Object.assign(window, { OnboardingScreen });
