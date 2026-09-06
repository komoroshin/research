Compact 0-10 symptom scale — the v1 artboard control, for when three scales must fit above the fold.

```jsx
<ScaleSlider label="Belly" sub="pain or discomfort" value={belly}
  labels={['none','mild','mild','mild','got in the way','got in the way','got in the way','strong','strong','strong','worst ever']}
  onChange={setBelly} />
```

Trade-off against `ScaleStepper`: half the height, but a drag is less precise than a tap on a cell. The value is always spelled out in words next to the numeral, and nothing about the high end is coloured red.
