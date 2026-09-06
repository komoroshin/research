const { Eyebrow, BodyText, Display, Rule, Card, Button, ActionLink, Chip, Numeral, TabBar, Toast } = window.ThresholdDesignSystem_2ce5e4;

/* Phone frame + screen chrome, matching the web prototype (390x844, 44px radius, grain). */
function Phone({ children, onTapTop }) {
  return (
    <div style={{ position:'relative', width:390, height:844, borderRadius:'var(--radius-phone)', overflow:'hidden',
      background:'var(--surface-screen)', backgroundImage:'var(--grain)', boxShadow:'var(--shadow-device)' }}>
      {children}
    </div>
  );
}

function AppScreen({ children, tone = 'cream', pinned = false, style }) {
  const bg = tone === 'dark' ? 'var(--surface-screen-dark)' : tone === 'paper' ? 'var(--surface-screen-paper)' : 'var(--surface-screen)';
  return (
    <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', gap:'var(--screen-gap)',
      padding:'var(--screen-pad-top) var(--screen-pad-x) var(--screen-pad-bottom)',
      overflowY: pinned ? 'hidden' : 'auto', background:bg,
      backgroundImage: tone === 'paper' ? 'none' : 'var(--grain)', ...style }}>
      {children}
    </div>
  );
}

function TopRow({ left, right, dark = false, onClick }) {
  return (
    <div onClick={onClick} style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', userSelect:'none', cursor: onClick ? 'pointer' : undefined }}>
      <Eyebrow tone={dark ? 'dark' : 'default'}>{left}</Eyebrow>
      <Eyebrow tone={dark ? 'dark' : 'default'}>{right}</Eyebrow>
    </div>
  );
}

/* Scrolling body of a pinned screen. */
function Feed({ children }) {
  return (
    <div style={{ flex:1, minHeight:0, overflowY:'auto', display:'flex', flexDirection:'column',
      gap:'var(--feed-gap)', margin:'0 -20px', padding:'0 20px 8px' }}>
      {children}
    </div>
  );
}

function Hint({ children, center = false }) {
  return <BodyText tone="soft" size="2xs" style={{ lineHeight:1.4, textAlign: center ? 'center' : undefined }}>{children}</BodyText>;
}

function Metric({ value, label, size = 'xs' }) {
  return (
    <div>
      <Numeral size={size}>{value}</Numeral>
      <Eyebrow tight style={{ marginTop:6 }}>{label}</Eyebrow>
    </div>
  );
}

function BackgroundCard({ source = 'demo data' }) {
  return (
    <Card variant="quiet">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
        <Eyebrow>Background for the day</Eyebrow>
        <Eyebrow tone="forest">{source}</Eyebrow>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,minmax(0,1fr))', gap:8, marginTop:10 }}>
        <Metric value="7 h 10 min" label="sleep" />
        <Metric value="6,200" label="steps" />
        <Metric value="61" label="resting hr" />
      </div>
    </Card>
  );
}

Object.assign(window, { Phone, AppScreen, TopRow, Feed, Hint, Metric, BackgroundCard });
