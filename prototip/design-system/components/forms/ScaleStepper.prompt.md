The evening symptom scale — 0-10 in eleven tappable cells with a big Oswald readout and word anchors; used for Belly and Bloating.

```jsx
<ScaleStepper label="Belly" sub="pain or discomfort" value={belly}
  labels={['none','mild','mild','mild','got in the way','got in the way','got in the way','strong','strong','strong','worst ever']}
  onChange={setBelly} />
```

Never colour high values red — symptom severity stays neutral forest/sage. The current value is always spelled out in words next to the numeral.
