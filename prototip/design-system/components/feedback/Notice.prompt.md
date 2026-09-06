The "we couldn't" block — the only component allowed to use the alert token, and the only failure surface in the system.

```jsx
<Notice label="Demo data" action={<ActionLink>Allow Health</ActionLink>}>
  Health isn't connected, so sleep and steps are stand-in numbers. Everything else works.
</Notice>
<Notice tone="alert" label="Protocol paused">Show your doctor before the next test.</Notice>
```

Also carries "not built yet": `label="Coming soon"` states what is missing without pretending it is broken — use it wherever a surface is deliberately a stub (the assistant in Tips, extra languages on the restaurant card).

Copy rule: state what happened, then what still works, then the way out. Never "error", never "failed". `tone="alert"` is for the red-flag pause only.
