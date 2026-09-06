const { Display, BodyText, Eyebrow, Rule, Card, Button, Chip, Numeral, SegmentedControl, Notice, ActionLink } = window.ThresholdDesignSystem_2ce5e4;

/* "In a restaurant" — a card the person shows to staff. It is the tolerance map, said out loud
   in the local language. The brief forbids prohibitive signs (crossed-out foods, locks, crosses),
   so nothing is marked with a symbol: each line states the dose in words and numbers, and the
   strongest thing it ever says is "please leave out". */
const LINES = {
  en: {
    title: 'For the kitchen',
    lead: 'I am testing food groups with my doctor. This is not an allergy — small amounts are fine.',
    avoid: 'Please leave out',
    dose: 'Fine in a small amount',
    free: 'No restriction',
    unknown: 'Not tested yet',
    thanks: 'Thank you — it helps a lot.',
    show: 'Show this to the waiter',
    lang: 'Card language',
  },
  ru: {
    title: 'Для кухни',
    lead: 'Я проверяю группы продуктов вместе с врачом. Это не аллергия — небольшое количество можно.',
    avoid: 'Прошу без этого',
    dose: 'Немного можно',
    free: 'Без ограничений',
    unknown: 'Пока не проверено',
    thanks: 'Спасибо — это очень помогает.',
    show: 'Показать официанту',
    lang: 'Язык карточки',
  },
};

const GROUPS = {
  en: { lactose:'Milk and cream', fructans:'Wheat, onion, garlic', gos:'Beans and lentils', fructose:'Apple, pear, honey', sorbitol:'Stone fruit, sugar-free', mannitol:'Mushrooms, cauliflower' },
  ru: { lactose:'Молоко и сливки', fructans:'Пшеница, лук, чеснок', gos:'Бобовые', fructose:'Яблоко, груша, мёд', sorbitol:'Косточковые, без сахара', mannitol:'Грибы, цветная капуста' },
};

function RestaurantCard({ tested, check, onClose }) {
  const [lang, setLang] = React.useState(0);
  const L = lang === 0 ? LINES.en : LINES.ru;
  const G = lang === 0 ? GROUPS.en : GROUPS.ru;

  /* Status per group: what is being tested right now outranks what has been answered. */
  const rows = [
    ['lactose', check ? L.avoid : tested ? L.dose : L.unknown, tested && !check ? 'up to 125 ml' : check ? 'testing now' : ''],
    ['fructans', L.unknown, ''],
    ['gos', L.unknown, ''],
    ['fructose', L.unknown, ''],
    ['sorbitol', L.unknown, ''],
    ['mannitol', L.unknown, ''],
  ];

  return (
    <AppScreen tone="paper" pinned>
      <TopRow left="Threshold" right={L.show} />
      <Feed>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <Display size="hero" style={{ color:'var(--text-paper)' }}>{L.title}</Display>
          <ActionLink onClick={onClose} style={{ marginTop:-8, flex:'none' }}>Close</ActionLink>
        </div>
        <Rule style={{ background:'var(--forest)' }} />
        <BodyText tone="paper" size="sm">{L.lead}</BodyText>
        <div style={{ display:'flex', flexDirection:'column', gap:0, marginTop:4 }}>
          {rows.map(([g, status, note], i) => {
            const strong = status === L.avoid;
            return (
              <div key={g} style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', gap:12, padding:'11px 0', borderBottom:'1px solid var(--sage-300)' }}>
                <BodyText tone="paper" size="sm" strong={strong} style={{ flex:1 }}>{G[g]}</BodyText>
                <div style={{ textAlign:'right', flex:'none' }}>
                  <BodyText tone="paper" size="xs" strong={strong}>{status}</BodyText>
                  {note ? <BodyText tone="soft" size="2xs" style={{ marginTop:2 }}>{note}</BodyText> : null}
                </div>
              </div>
            );
          })}
        </div>
        <BodyText tone="paper" size="sm" strong style={{ marginTop:4 }}>{L.thanks}</BodyText>
        <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:8 }}>
          <Eyebrow>{L.lang}</Eyebrow>
          <SegmentedControl options={['English', 'Русский']} value={lang} onChange={setLang} />
        </div>
        <Notice label={lang === 0 ? 'Coming soon' : 'Скоро'}>
          {lang === 0
            ? 'More languages, and a version that names dishes on the menu rather than food groups.'
            : 'Другие языки и версия, которая называет блюда из меню, а не группы продуктов.'}
        </Notice>
      </Feed>
      <Button onClick={onClose}>{L.show}</Button>
    </AppScreen>
  );
}

Object.assign(window, { RestaurantCard });
