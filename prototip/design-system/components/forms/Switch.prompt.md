51x31 toggle, forest when on and sage when off — for factual day flags, never for settings that punish.

```jsx
<Card variant="quiet" tight style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
  <BodyText size="sm">Alcohol</BodyText>
  <Switch checked={alcohol} onChange={setAlcohol} />
</Card>
```

The whole row is the hit target. "Blood in stool" is deliberately NOT a switch — it is a row with an ActionLink so it can't be flipped casually.
