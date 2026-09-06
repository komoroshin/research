Small uppercase "go here" link with the `›` chevron — the secondary action inside a card header or row.

```jsx
<div style={{display:'flex',justifyContent:'space-between'}}>
  <Eyebrow>Meals today</Eyebrow>
  <ActionLink onClick={openAll}>All tips</ActionLink>
</div>
```

Always keeps a 44px hit height even though the text is 12px. `dark` renders sage-300 on forest.
