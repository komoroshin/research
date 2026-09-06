Bristol-scale picker — eight tiles, each with an index, a CSS-drawn shape, and a plain word; the app's only "iconography".

```jsx
<StoolPicker value={stool} onChange={setStool} sub="pick the closest"
  keyline="1–2 constipation · 3–5 normal · 6–7 loose"
  types={['none','hard lumps','lumpy sausage','cracked surface','smooth, soft','soft pieces','mushy','liquid']} />
```

Selected tile inverts to forest with cream shape. Nothing here is red, no type is labelled "bad".
