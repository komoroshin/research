Full-width 52px action button — one `primary` per screen, `ghost` for the secondary, `cream` when the surface is forest.

```jsx
<Button variant="primary" onClick={closeDay}>Close the day</Button>
<Button variant="ghost">Allow Health</Button>
```

Variants: primary (forest → forest-800 on hover), accent (sage-300 → sage-100), ghost (transparent + 2px sage ring), cream (cream-50 on forest). Disabled is 50% opacity, never a grey. The suspicion screen intentionally stacks three `accent` buttons of equal weight.
