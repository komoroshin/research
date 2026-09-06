const { Display, BodyText, Eyebrow, Rule, Card, Button, ActionLink, Chip, Numeral, PhotoTile, ScaleSlider, StoolPicker, Switch } = window.ThresholdDesignSystem_2ce5e4;

const LVL = ['none','mild','mild','mild','got in the way','got in the way','got in the way','strong','strong','strong','worst ever'];
const TYPES = ['none','hard lumps','lumpy sausage','cracked surface','smooth, soft','soft pieces','mushy','liquid'];

function DayCardScreen({ day, onClose, onCloseDay, onBlood, onAddMeal, meals }) {
  const [belly, setBelly] = React.useState(4);
  const [bloat, setBloat] = React.useState(6);
  const [stool, setStool] = React.useState(5);
  const [alcohol, setAlcohol] = React.useState(false);
  const [illness, setIllness] = React.useState(false);
  return (
    <AppScreen pinned>
      <TopRow left="Day card" right={`day ${day}`} />
      <Feed>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div>
            <Display size="screen">How was today</Display>
            <BodyText tone="soft" size="xs" style={{ marginTop:4 }}>At the worst moment today</BodyText>
          </div>
          <ActionLink onClick={onClose} style={{ marginTop:-8 }}>Back</ActionLink>
        </div>
        <ScaleSlider label="Belly" sub="pain or discomfort" value={belly} labels={LVL} onChange={setBelly} />
        <ScaleSlider label="Bloating" sub="fullness, tight belly" value={bloat} labels={LVL} onChange={setBloat} />
        <StoolPicker value={stool} onChange={setStool} sub="pick the closest" keyline="1–2 constipation · 3–5 normal · 6–7 loose" types={TYPES} />
        <BackgroundCard />
        <Hint>Mark if it happened: such days are counted separately.</Hint>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
          <Card variant="quiet" tight style={{ display:'flex', justifyContent:'space-between', alignItems:'center', minHeight:52 }}>
            <BodyText size="sm">Alcohol</BodyText><Switch checked={alcohol} onChange={setAlcohol} />
          </Card>
          <Card variant="quiet" tight style={{ display:'flex', justifyContent:'space-between', alignItems:'center', minHeight:52 }}>
            <BodyText size="sm">Unwell</BodyText><Switch checked={illness} onChange={setIllness} />
          </Card>
        </div>
        <div onClick={onBlood} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', borderRadius:'var(--radius-card)', padding:'4px 16px', minHeight:52, boxShadow:'var(--ring-strong)', cursor:'pointer' }}>
          <BodyText tone="soft" size="sm">Blood in stool</BodyText><ActionLink>Report</ActionLink>
        </div>
        <Card variant="quiet" tight onClick={onAddMeal} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', minHeight:52 }}>
          <BodyText size="sm">{meals.length ? `Meals today: ${meals.length}` : 'No meals yet today'}</BodyText>
          <ActionLink>Add</ActionLink>
        </Card>
      </Feed>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        <Button onClick={onCloseDay}>Close the day</Button>
        <Hint center>Saves the day. You can fix it tomorrow from Today.</Hint>
      </div>
    </AppScreen>
  );
}

/* Capture first (chosen option 1), thumb-zone layout: photo is the main path, so it is the
   largest and darkest element — but it lives in the PINNED bottom block, inside the thumb's
   arc on a 844pt screen, rather than in the top third where it can't be reached one-handed.
   The person's own dishes scroll above it and log in one tap. The recognised card appears
   only for photo and voice, where a confirmation is genuinely needed. */
const DISHES = [
  { name:'Oatmeal with milk', groups:['lactose'] },
  { name:'Coffee with milk', groups:['lactose'] },
  { name:'Caesar salad', groups:['lactose'] },
  { name:'Garlic pasta', groups:['fructans'] },
  { name:'Chicken and rice', groups:[] },
];

function AddMealScreen({ onBack, onSave, onLog, check, logged = [] }) {
  const [recognised, setRecognised] = React.useState(null);
  const [justLogged, setJustLogged] = React.useState(null);
  const isProbe = (d) => check && d.groups.includes('lactose');

  if (recognised) return (
    <AppScreen pinned>
      <TopRow left="Add a meal" right="19:20" />
      <Feed>
        <Display size="hero">Is this right?</Display>
        <Card variant="accent">
          <Eyebrow tone="forest">Recognized · 19:20</Eyebrow>
          <Display size="card" style={{ marginTop:8 }}>{recognised.name}</Display>
          <div style={{ display:'flex', gap:6, marginTop:10 }}>
            {recognised.groups.length ? recognised.groups.map((x) => <Chip key={x}>{x}</Chip>) : <Chip style={{ opacity:0.6 }}>no known group</Chip>}
          </div>
          {isProbe(recognised) ? (
            <>
              <Rule style={{ margin:'14px 0' }} />
              <BodyText size="sm" strong>This is today's test dose — counted.</BodyText>
            </>
          ) : null}
        </Card>
        <Hint>We remember the dish and its groups, so next time it is one tap from the list.</Hint>
      </Feed>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        <Button onClick={() => onSave({ time:'19:20', name:recognised.name, groups:recognised.groups })}>Correct</Button>
        <Button variant="ghost" onClick={() => setRecognised(null)}>Fix</Button>
      </div>
    </AppScreen>
  );

  return (
    <AppScreen pinned>
      <TopRow left="Add a meal" right={logged.length ? `${logged.length} today` : 'nothing today'} />
      <Feed>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <Display size="hero">What did you eat</Display>
          <ActionLink onClick={onBack} style={{ marginTop:-8, flex:'none' }}>Done</ActionLink>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginTop:4 }}>
          <Eyebrow>One tap from your own</Eyebrow>
          <Eyebrow tight>this week</Eyebrow>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          {DISHES.map((d) => (
            <Card key={d.name} variant={justLogged === d.name ? 'accent' : 'quiet'} tight
              onClick={() => { setJustLogged(d.name); onLog({ time:'19:20', name:d.name, groups:d.groups }); }}
              style={{ display:'flex', justifyContent:'space-between', alignItems:'center', minHeight:52 }}>
              <BodyText size="sm">{d.name}</BodyText>
              <div style={{ display:'flex', gap:4, alignItems:'center' }}>
                {isProbe(d) ? <Eyebrow tone="forest" tight>test dose</Eyebrow> : null}
                {d.groups.map((x) => <Chip key={x} tone="sage">{x}</Chip>)}
              </div>
            </Card>
          ))}
        </div>
        {logged.length ? <MealStrip meals={logged} onAdd={() => setRecognised(DISHES[0])} /> : null}
        <Hint>A day with meals counts towards finding a suspect. A day without them counts for wellbeing only.</Hint>
      </Feed>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        <PhotoTile label="Snap a meal" sub="we recognise the dish and its groups" style={{ minHeight:150 }}
          onClick={() => setRecognised(DISHES[0])} />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
          <Card variant="quiet" tight onClick={() => setRecognised(DISHES[2])} style={{ minHeight:52, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <BodyText size="sm" strong>Say it</BodyText>
          </Card>
          <Card variant="quiet" tight onClick={() => setRecognised(DISHES[3])} style={{ minHeight:52, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <BodyText size="sm" strong>Type it</BodyText>
          </Card>
        </div>
      </div>
    </AppScreen>
  );
}

Object.assign(window, { DayCardScreen, AddMealScreen });
