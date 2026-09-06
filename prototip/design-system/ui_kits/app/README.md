# Threshold iOS app — UI kit

Click-through recreation of the one product in the source package: the Threshold
iPhone app (390×844, light theme only). Rebuilt from
`prototip/web/threshold-prototype.html` (v2 build) and
`prototip/screens/gen.py`, with copy taken verbatim from the English strings in
`prototip/04-teksty.md` / the prototype's string table.

## Two ways to look at it

- **`index.html`** — the click-through flow: start at onboarding and walk the whole loop.
- **`theme-dark.html`** — the same screens under `[data-theme="dark"]`.
- **`doctor-letter.html`** — the printable US Letter document (the in-app screen is only its preview).
- **`palette-weight.html` / `palette-weight-b.html` / `meal-input-options.html`** — the decision studies behind the palette weighting (B3) and the meal screen.
- **`screens.html`** — a static gallery of all 17 screens and states at 1:1, each captioned with its spec key (Э0…Э8) and the rule it demonstrates. Use this for review; use `index.html` to feel the transitions.

## Flow in `index.html`

1. **Onboarding** — three segmented questions, Health as the secondary action, disclaimer.
2. **Today (observing)** — the day's meals render as `MealStrip`: a 06:00–24:00 band with a mark at each logged meal, plus typographic tiles (time in Oswald, dish, groups) and the dark capture card. No photographs are stored in this version — a snapped photo is recognised and discarded. Then: — dark hero card, days-collected progress, meal capture, background metrics, tip of the day. Starts on day 6, so one more "Close the day" surfaces the first insight.
3. **Day card** — 0–10 belly and bloating on the compact `ScaleSlider`, Bristol picker, day flags, the deliberately non-switch "Blood in stool" row.
4. **Add a meal** — "capture first" (the chosen option), laid out for the thumb: the photo tile is the largest and darkest element and is pinned to the bottom block with voice and text beside it, while the person's own dishes scroll above and log in one tap. "Done" sits in the header, so it doesn't compete for the reachable slot. The recognised card appears only for photo and voice, where a confirmation is genuinely needed. During a test, the group under test is marked "test dose" in the list. Three alternatives were explored side by side in `meal-input-options.html`.
5. **Suspect** (modal) — three equal-weight buttons; the one screen that breaks the one-action rule.
6. **Test** — 8-day dot scale, swaps during restriction, dose numerals during return; test plan modal.
7. **Answer** — the 34px line, the largest type in the product; "not confirmed" is available in `VerdictScreen` via `notConfirmed`.
8. **Path** — stage nodes plus the six-group tolerance map; tapping a group explains what it is and where it turns up.
9. **Tips** — stage-dependent accordion.
10. **Page for your doctor** — white paper document, no grain. The real printable artefact is `doctor-letter.html` (US Letter, repeating header and footer).
11. **Red flag** — reached from the day card's "Blood in stool" row; fully dark screen, no dismiss.

Shortcut for demos: tapping the Today top row jumps the diary to day 21, where the next
"Close the day" raises the suspect.

## Not recreated (absent from the source)

Paywall, sign-up, dark theme, notifications, the "Ask" assistant as a real chat, food
illustrations, and the hidden ten-item moment switcher (a utility list the spec says
must stay unstyled).
