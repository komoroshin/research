# Threshold — design system

Threshold is an iPhone app for adults in the US living with IBS-type gut symptoms.
Over about three weeks of quiet observation it finds which **food group** lines up
with a person's rough days, names one suspect from their own data, and proposes an
eight-day test. The output is never a ban — it is a **dose**: "milk: up to 125 ml is
fine, 250 ml brings symptoms". Everything in this design system serves that promise:
*we don't restrict you, we watch, and we tell you honestly what we found.*

## Sources this system was built from

Attached local codebase, mounted as `prototip/` (read-only):

| Path | What it is |
|---|---|
| `prototip/web/threshold-prototype.html` | **Primary source of truth.** Dependency-free clickable web prototype, v2 build — all screens, all states, the full CSS token block, EN + RU string tables. |
| `prototip/web/threshold-prototype-v1.html`, `-ru.html` | v1 build and the forced-Russian build. |
| `prototip/screens/gen.py` + `*.dc.html` | Generator and output for the design-canvas artboards ("Threshold Prototype Screens"), one file per screen/state. Its header notes an earlier `tokens/*.css` + `ui_kits/app/AppKit.jsx` design system that was **not** included in the attachment. |
| `prototip/01-specifikaciya.md` | CTO spec: scope, data model, navigation, every screen with states and transitions, Health integration, hard rules. |
| `prototip/02-scenarii.md` | User scenarios S1–S9 and the 90-second demo script. |
| `prototip/03-tz-dizajn.md` | The design brief: principles, per-screen requirements, explicit "do not make" list. |
| `prototip/04-teksty.md` | Single source of RU/EN strings by key — the localisation file. |
| `prototip/05-priemka.md`, `06-ux-issledovanie.md`, `07-tz-v2.md`, `08-ux-audit-v2.md`, `09-tz-v2-1.md` | Acceptance criteria, UX research, and the v2 briefs the current prototype implements. |

Published prototype URLs recorded in the source (not verified from here):
`https://komoroshin.github.io/research/prototype/` and `/prototype/ru/`.
The design-canvas artboard file is referenced as
`https://claude.ai/code/artifact/e45a9ab0-fb6b-4e7a-b117-2c33e4cf1d30`.
A Threshold **investor deck** is mentioned as the origin of the visual language but was
not attached; no slide templates are included here for that reason.

### Products represented

**One product: the Threshold iPhone app** (SwiftUI, iOS 17-ish, iPhone, light theme
only, offline). Inside it there is one surface with a different visual register: the
**Page for your doctor**, a white-paper document meant to be printed or shared. There is
no marketing site, no docs site, and no web app in the source.

## Index

| File / folder | What's in it |
|---|---|
| `styles.css` | Global entry point — `@import` lines only. Consumers link this. |
| `tokens/` | `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `radius.css`, `elevation.css`, `motion.css`, `texture.css` |
| `components/typography/` | Display, Numeral, Eyebrow, BodyText, Rule |
| `components/core/` | Button, Card, Chip, ActionLink, ProgressBar, Toast, PhotoTile |
| `components/forms/` | SegmentedControl, ScaleStepper, ScaleSlider, StoolPicker, Switch |
| `components/feedback/` | Notice |
| `components/progress/` | DayDots, PathNode, TabBar |
| `ui_kits/app/` | The iPhone app: `index.html` (click-through flow), `screens.html` (every screen and state, 1:1), `theme-dark.html` (dark theme), `doctor-letter.html` (the printable Letter document), `palette-weight.html` + `palette-weight-b.html` + `meal-input-options.html` (decision studies), screen JSX, its own README |
| `guidelines/` | 22 foundation specimen cards (Colors, Type, Spacing, Elevation, Brand) |
| `thumbnail.html` | Homepage tile |
| `SKILL.md` | Agent-skill front matter for using this system outside this project |

### Components

Full list, matching the primitives the prototype actually defines:
**Display**, **Numeral**, **Eyebrow**, **BodyText**, **Rule**, **Button**, **Card**,
**Chip**, **ActionLink**, **ProgressBar**, **Toast**, **PhotoTile**,
**SegmentedControl**, **ScaleStepper**, **ScaleSlider**, **StoolPicker**, **Switch**,
**DayDots**, **PathNode**, **TabBar**, **Notice**.

Each has a sibling `.d.ts` (props contract) and `.prompt.md` (what & when + example).

**Intentional additions.** The source's CSS has no component layer at all — these are
factored out of the prototype's own classes, one component per class family, so nothing
here is invented. Three are named differently from the source markup:
`ScaleStepper` (the prototype's `.scale` + `.segs` 0–10 block), `StoolPicker`
(`.stool`), `PathNode` (`.node`). `AppShell.jsx` in the UI kit holds
non-exported layout helpers (Phone, AppScreen, TopRow, Feed, Hint, Metric,
BackgroundCard) that are screen scaffolding, not brand primitives.

Two were added after review, on the founder's call, and are marked as such: **ScaleSlider** (the
v1 artboard control brought back, for when three scales must fit above the fold) and **Notice**
(the system had no failure surface at all — see the alert token below).

**Not built, because the source doesn't have them:** no Dialog/Modal component (modals
are full screens), no Avatar, no Tabs (there is exactly one three-item TabBar), no
Tooltip, no Input or Select (the app has no free-text entry), no Badge (Chip covers it),
no icon component (see Iconography).

---

## CONTENT FUNDAMENTALS

The copy is the product. `04-teksty.md` is the single source of strings, and the design
brief says plainly: *use the text verbatim, do not rewrite it.* Design around the words.

**Person and stance.** Second person for the reader ("**your** rough days", "**you** can
change it later"), first-person plural for the product ("**we** watch", "**we** do not
ban food", "**we** observe, we do not diagnose"). The product is a companion doing
work, never a coach issuing orders.

**Casing.** Sentence case in body copy, always. Headlines are set in uppercase
typographically (Oswald + `text-transform`) — but they are *written* as sentences, so
they read normally when the transform is off. Food groups and dishes stay lowercase
mid-sentence: "dairy", "fructans", "wheat and onion".

**Sentence shape.** Short declaratives, often two clauses joined by an em dash where the
second clause takes the pressure off: "A missed day is a pause, not a failure." "Not
confirmed: the difference stayed within your usual range." "The test is paused, not
failed. Continue today."

**Numbers as content.** Copy is written so the number carries the sentence: "12 of your
15 rough days", "day 5 of 8", "up to 125 ml", "three questions, thirty seconds". Never
"great progress!", never a percentage of achievement.

**Honesty is a named feature.** Every claim ships with its own caveat, at the same or
one-step-smaller size — never smaller than that:
"This could be a coincidence — about a quarter of patterns like this turn out to be."
"For now this is an observation, not a conclusion — there isn't much data yet."
"Observations, not a diagnosis. Treatment decisions stay with your doctor."

**Never restrictive language.** No "forbidden", "banned", "cheat", "failed", "violation".
A skipped day is "not counted"; an interrupted test is "paused, not failed"; a negative
result is reframed as a win: "You can bring dairy back. The restriction you were keeping
wasn't needed — and that's an answer too."

**No celebration.** No confetti, no "Congratulations", no streak-shaming. The optional
Rhythm card states a number and a goal: "5 days in a row · Today: day card + one photo".

**Button copy** is a first-person action or a plain verb: "Let's begin", "Let's test it",
"Not now", "Another suspect", "Close the day", "Got it", "I talked to a doctor —
continue". Toasts are receipts: "Meal saved", "Day 12 updated", "Day 5 counted · sleep
7 h 10 min".

**Labels** (Eyebrow) are 1–3 plain words, uppercased by CSS: "Background for the day",
"A suspect", "The answer", "Protocol paused", "Recent".

**No emoji anywhere.** None appear in any source file, and the brief's "language of
return" principle rules out any pictorial cuteness. The only non-alphanumeric glyphs in
the UI are `›` (action chevron), `·` (separator in meta lines), `¼ ½`, and `—`.

**Bilingual discipline.** Russian strings run 20–30% longer than English; every layout
must hold that overflow. Both languages share the same keys and the same voice — the
Russian is idiomatic, not translated word-for-word.

**Medical register.** The doctor page switches to clinical, document language: "Protocol",
"Results by group", "Symptom score, daily median", "Participant's own observations. Not a
diagnosis, not a prescription." Same restraint, different vocabulary.

---

## VISUAL FOUNDATIONS

**The palette is one hue family: forest green through sage to cream — weighted for an interface, not a deck.**
The source values came from the Threshold investor deck, where forest can hold large fields. In an
app opened every evening the same colour over ~40% of the screen becomes tiring, so the semantic
layer is re-pointed (weighting **B3**): saturated green appears only where something can be acted
on. Surfaces that cover area use a lower-chroma **interface ramp** — `--paper-warm` for the screen,
`--paper-warm-100` for quiet cards, `--moss-300` for accent cards, `--pine` / `--pine-lift` /
`--pine-screen` for dark fills — and headlines are set in `--ink-700` rather than forest.
Buttons, selected cells, rules, rings, the current-day dot and `--text-action` keep the original
forest, so the brand colour still means "act".

The base ramp itself is unchanged, ten values only —
`#FEFAE0` cream-50, `#F3F1DC` cream-100, `#E9EDC9` sage-100, `#CCD5AE` sage-300,
`#A3B18A` sage-500, `#7E9276` sage-600, `#4E6B57` ink-600, `#2A4A3A` ink-700,
`#0A5637` forest-800, `#01472E` forest — plus `#FFFFFF`/`#1F2A24` for the doctor
page and `#E6E3CC` for the web stage behind the phone. There is **no red, no amber, no
blue, no semantic status colour at all.** This is a rule, not an omission: the brief
forbids red for symptoms, rejected days, or a negative verdict. (The brief reserves red
for the red-flag screen; the implemented screen instead goes fully forest — the single
darkest, quietest screen in the app. Treat that as the shipped answer.)

**Type is two families.** Oswald 500/700 — condensed, uppercase, `line-height: 1.04`,
`letter-spacing: -0.02em` — carries every headline and every number (numerals tighten to
`0.9` / `-0.03em`). Inter 400/500/700 carries everything else: body at 15/1.45,
labels at 12px / 0.18em uppercase, hints at 12 and legal at 11. The 34px Display is
reserved for exactly two lines in the product: the answer, and the red-flag headline.
Numbers are always larger than the words explaining them, and they are tabular
(`--numeral-variant`) so columns of metrics line up.

Oswald **500** was added for a heading that sits under another heading (`weight="secondary"` on
`Display`) — before it, 34px and 26px shouted identically and hierarchy could only be made by
shrinking type.

**Dynamic Type.** Body copy scales freely. Display scales but caps at +2 steps, or the 34px answer
pushes the primary button off screen. Eyebrow labels, chips, the tab bar and the 0-10 cell numerals
are pinned — they are geometry, not reading text. From Accessibility sizes (AX1 and up) Display and
Numeral fall back to the system font: Oswald has no optical sizes and condensed type becomes
illegible when enlarged. Two-up grids collapse to one column from +3 steps.

**Backgrounds are flat colour plus grain.** No photography, no illustration, no
gradients — the only gradient in the codebase is the slider track (sage-300 → sage-500)
and it is 10px tall. Every cream and forest surface carries a fractal-noise SVG at
**5.5% alpha, 220px tile**, which gives the app a papery, printed feel. The doctor page
is the one surface with the grain removed — it is meant to look like a printout.

**Cards.** 24px radius, 18/20px padding (12/16 when tight), no border, no outline in the
loud variants. Loudness ladder: `line` (transparent + 2px sage-300 ring) → `quiet`
(cream-100) → `default` (sage-100) → `accent` (sage-300 + shadow) → `dark` (forest +
shadow), with `lift` (forest-800) only for cards nested inside a dark one. One dark card
per screen, and it is the screen's hero.

**Shadows: three, all green-tinted.** `0 18px 40px rgba(1,71,46,.2)` on dark and accent
cards, toasts and the photo tile; `0 8px 20px rgba(1,71,46,.25)` on the slider knob;
`0 30px 60px rgba(1,71,46,.2)` under the phone frame in web previews. No grey shadows,
no ambient elevation on quiet surfaces.

**Borders are 2px inset shadows**, never CSS borders (except the tab bar's
`2px solid` top rule and the doctor page's 1px footer hairline). sage-300 for hairlines,
sage-500 for strong rings.

**Corner radii**: 24 card · 20 button and segmented tray · 18 Bristol tile · 16 segment
selection and switch · 14 scale cell · 12 chip and nav pill · 6 progress bar · 8px
half-pill for shapes · 44 phone frame. Nothing is a rectangle; the only true circles are
the switch knob, slider thumb, path pins and the photo tile's lens.

**Contrast floor.** The half-size unit on a `Numeral` is content ("125 **ml is fine**"), so it has
its own token, `--text-unit` (ink-700), rather than the muted sage that was there before — sage-500
reached only 1.5:1 on the slate accent card, and ink-600 only 3.87:1. Ink-700 clears 6.45:1 there
and 9.1:1 on cream. On `accent` surfaces keep body text at full ink:
`tone="soft"` measures 3.87:1 there and `tone="muted"` fails.

**Ornament: exactly one.** A 64×2px sage rule under a headline, marking the boundary
between claim and explanation. `Rule` is the whole decorative vocabulary.

**Layout.** 390×844 fixed (spec: 391×852 with safe area), 20px gutters, 54px top pad for
the status bar, 22px bottom. 16px between screen blocks, 14px in a scrolling feed, 8px
inside a stack or grid. Screens are pinned: the top row and the primary button and tab
bar are fixed, only the middle feed scrolls. Every screen has **one** primary
action — the suspicion screen's three equal accent buttons are the single, deliberate
exception. 44px minimum hit height on every tappable row; buttons are 52px and full-width.

**Motion is one duration and one curve: 200ms `cubic-bezier(.4,0,.2,1)`**, applied only
to background colour, knob position, and opacity. No spring, no bounce, no scale, no
page transitions, no confetti, no animated progress fills. Toasts fade in, sit for 1.8s,
fade out.

**States.** Hover: forest darkens to forest-800, sage-300 lightens to sage-100, ghost and
cream don't change. Press: nothing — no shrink, no darken (native iOS handles it).
Selected: fill inverts to forest with cream text (segment, scale cell, Bristol tile,
switch, nav pill). Disabled: 50% opacity, never a grey fill. Focus: 3px sage-500
outline at 2px offset. Progress states are distinguished by **fill, not hue**: done =
sage-500, today = forest, ahead = 2px ring, skipped = cream fill + ring.

**Transparency and blur: none.** No frosted glass, no backdrop-filter, no protection
gradients over imagery (there is no imagery). Only two translucencies exist in the whole
codebase: the red-flag confirmation sheet's `rgba(1,71,46,.35)` scrim, and the 85%
opacity on one Bristol shape. Text is always full-opacity ink on a solid fill.

**Imagery: none, by constraint and by brief.** No illustrations, no stock food pictures, no
generated images — and, in this version, no stored photographs either: the CTO's scope for v1
keeps no image files, so a snapped meal is recognised and the picture is discarded. What remains
is the dish and the hour.

So the evening ritual is carried typographically instead. `MealStrip` renders the day as one
object: a thin band spanning 06:00–24:00 with a forest mark dropped at each logged meal — the day
visibly fills up — and under it a scrolling row of tiles, each with the time in Oswald, the dish,
and its food-group chips. The last tile is the dark capture card. The copy states the constraint
rather than hiding it: "Photos are read and discarded — we keep the dish and the hour, not the
picture."

A photo strip of the person's own meals is designed and worth building **when image storage
lands** (see `MealStrip` history): 104×104 frames at the tile radius, captions below the frame so
no protection gradient is ever needed, an unfilled frame a quiet cream frame rather than an error.
Until then, nothing pictorial ships.

Nothing prohibitive, ever — no crossed-out foods, no locks, no crosses. That extends to the
restaurant card, where the strongest line is "please leave out".

**Print.** The doctor page is designed to print, on **US Letter**: white paper, near-black text,
a document structure (protocol → results by group → three numbers → notes), a repeating header
with the wordmark and a repeating footer carrying the disclaimer, participant ID and date. It
states what an intake clinician needs and the app cannot infer: participant ID, date of issue,
period covered, protocol version, which days were excluded and why, and an explicit red-flag
negative. `ui_kits/app/doctor-letter.html` is the printable artefact; the in-app screen is its
preview.

---

## ICONOGRAPHY

**Threshold has no icon set, and that is deliberate.** The design brief specifies
"icons — system SF Symbols only, as a list", and the shipped prototype uses **zero
icons**. There is no icon font, no SVG sprite, no PNG glyphs anywhere in the source
package — so nothing was copied into `assets/` (the folder does not exist), and nothing
was substituted from a CDN.

What stands in for iconography:

- **The chevron `›`** — a plain Unicode character, 18px, appended to every
  `ActionLink` and to tappable card headers. This is the app's only affordance glyph.
- **Text labels** where other apps use icons: the tab bar is three uppercase words
  ("Today · Path · Tips"), meal capture is "Photo / Voice / Text" as three word tiles.
- **CSS-drawn shapes** for the Bristol stool scale: eight abstract forms built from
  radial gradients, repeating gradients, mask-composites, and one organic border-radius —
  drawn in the brand's own colours, copied verbatim into `StoolPicker.jsx`. They are
  diagrammatic, never illustrative.
- **Geometry as diagram**: day dots (pills), path pins (rings and filled circles), the
  progress bar, the photo tile's two-circle lens.
- **Typographic separators**: `·` between meta values, `—` for "none", `¼` and
  `½` for doses.
- **No emoji, ever.**

If a consuming design genuinely needs icons, use **SF Symbols** (per the spec) at regular
weight, tinted forest on light and cream on forest — and prefer a word.

---

## Copy deviations from `04-teksty.md` (need folding back into the string file)

The brief says strings are used verbatim. One string was changed on review and needs the
founder's sign-off before it goes into the localisation file:

- **`health` / `healthWhy`.** "Allow Health" / «Разрешить Health» did not say what the thing was
  or what allowing would do, and the explanation came *after* the button. Now: the label names the
  system ("Apple Health", marked "optional"), the explanation comes first and leads with the
  benefit, and the two outcomes are explicit buttons ("Not now" / "Connect") instead of one toggle.
  Suggested RU: «Apple Health · необязательно» — «Чтобы не спутать короткую ночь с реакцией на еду,
  мы можем читать ваш сон, шаги и пульс покоя. Только чтение — мы ничего не записываем обратно, и
  это можно отключить позже.» Buttons: «Не сейчас» / «Подключить».
- **Declined state.** The spec asks for a "demo data" mark; there was no visual state for it. It
  now uses `Notice`: what happened, what still works, the way back.
- **Pluralisation** in the Today progress lines follows the source string table's own singular /
  plural branches (they had been flattened to "1 days" in an earlier pass).

## Substitutions and gaps (please confirm)

- **Fonts are Google-hosted, not vendored.** The source itself links
  `fonts.googleapis.com` for Oswald 700 and Inter 400/500/700 and falls back to
  system fonts offline; no font binaries exist in the attachment, so `tokens/fonts.css`
  reproduces that link. If you have licensed Oswald/Inter files, drop them in and I'll
  write real `@font-face` rules.
- **No logo.** The source package contains no mark, monogram, app icon or logo file. The
  wordmark is simply "Threshold" set in Oswald 700 uppercase (see the Brand card). Nothing
  was drawn or reconstructed.
- **No slide templates.** A Threshold deck is referenced as the origin of the visual
  language but was not attached.
- **The earlier design system referenced by `gen.py`** (`tokens/*.css`,
  `ui_kits/app/AppKit.jsx`) was not in the attachment. Values here come from the
  prototype's own CSS, which `gen.py` mirrors; where the two differ (Eyebrow at
  12px/0.18em in the prototype vs 11px/0.22em in the artboards, 0–10 scales vs 0–5
  sliders) the **prototype wins** and the artboard value is kept as a secondary token.
