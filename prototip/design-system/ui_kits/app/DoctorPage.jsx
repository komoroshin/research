const { Display, BodyText, Eyebrow, Rule, Button, Numeral } = window.ThresholdDesignSystem_2ce5e4;

/* The doctor page is a document, not an app screen: white paper, no grain, prints well. */
function DoctorPage({ onClose, tested }) {
  const res = tested ? 'up to 125 ml tolerated; 250 ml — symptoms' : 'observing';
  return (
    <AppScreen tone="paper">
      <TopRow left="Threshold" right="1 page" />
      <Display size="hero" style={{ color:'var(--text-paper)' }}>Participant observations</Display>
      <Rule style={{ background:'var(--forest)' }} />
      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        <Eyebrow>Protocol</Eyebrow>
        <BodyText tone="paper" size="xs">Observation Sep 1–Sep 27. Test of "lactose" Sep 30–Oct 7: 5 days without the group, return in three doses, one control day.</BodyText>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        <Eyebrow>Results by group</Eyebrow>
        <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
          {[['Lactose', res], ['Fructans','observing'], ['GOS · fructose · sorbitol · mannitol','observing']].map(([g, s]) => (
            <div key={g} style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', gap:12 }}>
              <BodyText tone="paper" size="xs" strong>{g}</BodyText>
              <BodyText tone="paper" size="xs" style={{ textAlign:'right' }}>{s}</BodyText>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        <Eyebrow>Symptom score, daily median</Eyebrow>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
          {[[6,'before the test'],[3,'during restriction'],[5,'during return']].map(([n, l]) => (
            <div key={l}>
              <Numeral size="sm" style={{ color:'var(--text-paper)' }}>{n}</Numeral>
              <Eyebrow tight style={{ marginTop:6 }}>{l}</Eyebrow>
            </div>
          ))}
        </div>
      </div>
      <BodyText tone="soft" size="2xs" style={{ marginTop:'auto', borderTop:'1px solid var(--sage-500)', paddingTop:12 }}>
        Participant's own observations. Not a diagnosis, not a prescription.
      </BodyText>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        <Button>Share</Button>
        <Button variant="ghost" onClick={onClose}>Close</Button>
      </div>
    </AppScreen>
  );
}

Object.assign(window, { DoctorPage });
