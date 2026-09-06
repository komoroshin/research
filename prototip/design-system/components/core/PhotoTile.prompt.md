The primary meal-capture tile on Today — a forest card whose "lens" is two CSS circles, paired with a sage "Recent" tile in a 2-up grid.

```jsx
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
  <PhotoTile label="Snap a meal" sub="photo · voice · text" onClick={openMeal} />
  <Card variant="default" style={{minHeight:118}}>…recent…</Card>
</div>
```

118px minimum height. Keep the lens decoration — it is the only pictorial element in the app.
