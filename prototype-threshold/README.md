# Threshold — clickable protocol prototype

A demonstration mock-up of a mobile app that **guides** a person through a clinical
protocol (low-FODMAP reintroduction), rather than collecting data about them.
Built for an investor meeting and a trade-show stand: five minutes, four screens.

**This is not a product.** There is no backend, no authentication, no network
requests, no model calls and no speech recognition. Every number is written by
hand in one file, and the voice check plays back a script on a timer.

---

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
```

## Build and deploy

```bash
npm run build        # → dist/
npm run preview      # serve the build locally on :4173
```

`dist/` is a static bundle with relative asset paths (`base: './'`), so it drops
onto any static host — S3, Netlify, GitHub Pages, a USB stick with a local static
server. Once loaded it works with the network unplugged: no fonts, scripts or
images are fetched from anywhere. Do not open `dist/index.html` over `file://` —
browsers block ES modules from the file system; serve the folder instead
(`npx serve dist`, `python3 -m http.server`).

---

## Checking the scenario

```bash
npm run check
```

The demo's credibility rests on the numbers agreeing with each other, and that
is the first thing an audience tests. `check-data.mjs` asserts the links that
break most easily when the scenario is edited:

- every group has the same outcome in the protocol queue (screen 2) and on the
  tolerance map (screen 4);
- the chart on screen 3 draws **exactly** as many exposure marks as the copy
  claims, and exactly as many of them above the reaction line — so "7 of 9
  exposures" can be counted off the picture;
- no day without an exposure sits above the reaction line;
- the group named in the primary signal is "reacts" on the map, and the
  counter-example group is "tolerated";
- the tolerated amount on the map is a real rung of the dose ladder, and the
  reaction amount is the ladder's top rung;
- the current protocol day really is day *n* of the challenge's printed range;
- evenings logged never exceed days elapsed;
- symptom load only falls, and stays on the 0–10 scale;
- every group and outcome code has words in both languages.

Run it after any edit to `src/data.js` or `src/content.js`. It exits non-zero on
failure, so it can sit in a build step.

### Why the challenge dates look uneven

Rest days follow the rule the screen states: three after a challenge with no
reaction, six after one with a reaction, because the record has to come back
under the reaction line before the next group opens. Hence sorbitol 8–10 →
fructans 14–16 (three days), fructans reacted → lactose 23–25 (six days),
lactose crossed its threshold → GOS 32–34 (six days), GOS clean → fructose
38–40 (three days). At week 8 the person is on day 54 with 51 evenings logged;
the three missing evenings are the ones that left fructose undetermined.

## Presenter mode

A control bar floats above the phone on desktop, outside the frame:

| Control | What it does |
|---|---|
| **Screen** 1–4 | Jumps to any of the four demo screens |
| **Red flag** | Opens the alarm-symptom screen (screen 5) |
| **Week** 1 / 4 / 8 | Switches the protocol state without waiting eight weeks |
| ↺ | Reset — week 4, screen 1, English |
| 👁 | Hides the panel |

**Press `H`** (or `Esc`) to hide and show the panel. Hidden, the frame is clean
for photographs and screenshots. The language toggle (EN/RU) sits on the frame
corner and stays visible — it is part of the demo rig, not of the product.

The week switch is the argument, not a convenience: the same four screens change
state because the protocol has state. Week 1 is the base period (no challenges
yet, signals refuse to draw), week 4 is mid-reintroduction, week 8 is a finished
map.

On the red-flag screen the bottom navigation is gone on purpose — there is no way
round it inside the product. For a stand visitor who gets stuck, tapping the
**Threshold** wordmark in the header returns to screen 1.

---

## Demo order

1. **Check** — evening voice check. Answers "will anyone actually fill this in".
2. **Today** — challenge day with today's amount, the dose ladder and the queue.
   The queue is the point: it is what a diary does not have.
3. **Signals** — an association read out of the person's own records, with a
   counter-example where nothing was found.
4. **Map** — the tolerance map, the doctor summary, the next protocol.

---

## Where to edit

| File | Contents |
|---|---|
| `src/content.js` | **Every string in the interface, EN and RU.** Never edit copy inside components. |
| `src/data.js` | The scenario: one fictional person, eight weeks, five FODMAP groups, four challenge outcomes (no reaction / reaction / reaction above a limit / undetermined). Screens 3 and 4 read the same numbers, so they cannot disagree. |
| `tailwind.config.js` | Palette and type stacks. |
| `src/index.css` | The marigold hairline, the waveform, the paper grain. |

### Changing the scenario

`WEEKS` in `src/data.js` holds three complete protocol states keyed by week
number. Each has `check` (what the voice check parses into), `challenge` (the
current challenge and its dose ladder, or `null`), `queue` (the five groups and
their status), `signals` (the association, the counter-example and the 14-day
series) and `map` (rows, baseline, current reading). Add a week by adding a key
and a button in `src/components/Presenter.jsx`.

Amounts, group names and outcomes are separate on purpose: `data.js` holds
numbers and status codes, `content.js` turns them into words in both languages.

---

## Design notes

- **One marigold hairline per screen, and it always means the same thing** — the
  line you are working on. It is the rule under the title, the ring around
  today's rung on the dose ladder, the dashed reaction line on the chart, and
  finally the literal amount on the tolerance map. That last appearance is what
  the person carries out of the protocol.
- Filled square = a resolved group, outlined square = still open. Not a traffic
  light: the product reports states, not verdicts.
- Type: a mono face carries headings, amounts and labels — the register of an
  instrument readout, not a wellness app. Body copy is in the system sans. The
  doctor summary switches to a serif on paper stock, because it is a document
  and should not look like a screen.
- No web fonts, by requirement: the stand may have no internet.
- Reduced motion is respected; focus rings are visible; the layout falls back to
  full-screen below the `sm` breakpoint.

---

## Language of the copy

Three rules are enforced throughout `content.js`, and they are the reason some
sentences read the way they do:

- no diagnosis words — never "intolerance", "allergy", "IBS confirmed";
- no promises — never "will help", "cures", "you'll feel better";
- only observations, amounts and protocol steps.

Outcomes are named "No reaction", "Reaction", "Reaction above a limit",
"Undetermined". The signals screen carries a plaque saying the pattern is an
observation in the person's own records and not a diagnosis, and it shows a
group where nothing was found.

The stool field uses an own five-point scale, deliberately: the Bristol Stool
Form Scale is under copyright (Norgine) and licensed for commercial use, so a
demo should not reproduce it. Same reasoning for the symptom score — a plain
self-rated 0–10, not IBS-SSS, which also requires permission.

---

## What is deliberately absent

Sign-up, login, settings, profile; any clinician or admin view; a general-purpose
assistant chat; the elimination phase in detail. None of them sell the idea, and
each one costs demo time.
