Bottom navigation for the app's three tabs — text only, sage pill on the active tab.

```jsx
<TabBar value={tab} onChange={setTab}
  tabs={[{id:'today',label:'Today'},{id:'path',label:'Path'},{id:'tips',label:'Tips'}]} />
```

Threshold ships no icon set, so the tab bar is uppercase 11px labels above a 2px sage-500 rule. Three tabs maximum.
