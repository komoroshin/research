Segmented picker on a cream tray — one row per onboarding question, always exactly one selection.

```jsx
<Eyebrow>What bothers you</Eyebrow>
<SegmentedControl options={['bloating','pain','bowel habits']} value={q1} onChange={setQ1} />
```

Selected cell is a forest pill with bold cream text; unselected cells are plain ink-600 on the cream tray. Cells keep a 44px hit height. Two-up (EN/RU) and three-up are both used; more than three options should become a list instead.
