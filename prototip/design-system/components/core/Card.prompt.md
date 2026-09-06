The 24px-radius block everything sits in — variant chooses how loud it is, from `line` (silent) to `dark` (the screen's one hero).

```jsx
<Card variant="dark">
  <Eyebrow tone="dark">Observing</Eyebrow>
  <Display size="hero" dark style={{marginTop:10}}>Eat as usual</Display>
</Card>
<Card variant="quiet" tight>…one-line row…</Card>
```

On `accent` (slate-300) keep text at full ink: `tone="soft"` small text only reaches 3.87:1 there, and `tone="muted"` fails outright. Ink-700 and forest both clear 6:1.

Order of loudness: line → quiet → default → accent → dark. `lift` (forest-800) is only for cards nested inside a dark card. Never more than one dark card per screen.
