# Генератор артбордов прототипа Threshold. Значения — из tokens/*.css и ui_kits/app/AppKit.jsx.
NOISE = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.055 0'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)'/%3E%3C/svg%3E\")"

STYLE = """
    body { margin: 0; font-family: Inter, system-ui, -apple-system, sans-serif; }
    a { color: #01472E; } a:hover { color: #0A5637; }
    .page { width: 390px; height: 844px; box-sizing: border-box; padding: 54px 20px 22px; display: flex; flex-direction: column; gap: 16px; background-color: #FEFAE0; background-image: NOISE; overflow: hidden; }
    .page.dark { background-color: #01472E; }
    .page.paper { background-color: #FFFFFF; background-image: none; }
    .eyebrow { font-size: 11px; font-weight: 500; letter-spacing: 0.22em; text-transform: uppercase; color: #7E9276; }
    .eyebrow.dark { color: #A3B18A; }
    .display { font-family: Oswald, Impact, "Arial Narrow", sans-serif; font-weight: 700; text-transform: uppercase; line-height: 1.04; letter-spacing: -0.02em; color: #01472E; text-wrap: balance; }
    .display.dark { color: #FEFAE0; }
    .numeral { font-family: Oswald, Impact, "Arial Narrow", sans-serif; font-weight: 700; line-height: 0.9; letter-spacing: -0.03em; color: #01472E; }
    .numeral.dark { color: #FEFAE0; }
    .body { font-size: 15px; line-height: 1.45; color: #2A4A3A; text-wrap: pretty; }
    .body.soft { color: #4E6B57; }
    .body.dark { color: #E9EDC9; }
    .body.muted { color: #A3B18A; }
    .card { border-radius: 24px; padding: 18px 20px; box-sizing: border-box; background: #E9EDC9; }
    .card.quiet { background: #F3F1DC; }
    .card.dark { background: #01472E; box-shadow: 0 18px 40px rgba(1,71,46,0.2); }
    .card.lift { background: #0A5637; }
    .card.accent { background: #CCD5AE; box-shadow: 0 18px 40px rgba(1,71,46,0.2); }
    .rule { height: 2px; width: 64px; background: #A3B18A; }
    .rule.dark { background: #CCD5AE; }
    .btn { border: 0; border-radius: 20px; padding: 15px 22px; min-height: 52px; font-family: Inter, system-ui, sans-serif; font-size: 15px; font-weight: 700; letter-spacing: 0.06em; width: 100%; text-align: center; box-sizing: border-box; display: flex; align-items: center; justify-content: center; }
    .btn.primary { background: #01472E; color: #FEFAE0; }
    .btn.accent { background: #CCD5AE; color: #01472E; }
    .btn.ghost { background: transparent; color: #01472E; box-shadow: inset 0 0 0 2px #A3B18A; }
    .btn.cream { background: #FEFAE0; color: #01472E; }
    .nav { display: flex; gap: 6px; margin-top: auto; padding-top: 14px; border-top: 2px solid #A3B18A; }
    .nav div { flex: 1; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #7E9276; padding: 10px 0; text-align: center; border-radius: 12px; }
    .nav div.on { background: #E9EDC9; color: #01472E; }
    .seg { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 4px; background: #F3F1DC; border-radius: 20px; padding: 4px; }
    .seg div { font-size: 13px; font-weight: 500; color: #4E6B57; text-align: center; padding: 11px 6px; border-radius: 16px; }
    .seg div.on { background: #01472E; color: #FEFAE0; font-weight: 700; }
    .track { position: relative; height: 8px; border-radius: 6px; background: #F3F1DC; }
    .track .fill { position: absolute; left: 0; top: 0; height: 8px; border-radius: 6px; background: #01472E; }
    .track .knob { position: absolute; top: -10px; width: 28px; height: 28px; border-radius: 14px; background: #01472E; box-shadow: 0 18px 40px rgba(1,71,46,0.2); }
    .switch { width: 51px; height: 31px; border-radius: 16px; background: #A3B18A; position: relative; flex: none; }
    .switch .k { position: absolute; top: 2px; left: 2px; width: 27px; height: 27px; border-radius: 14px; background: #FEFAE0; }
    .switch.on { background: #01472E; } .switch.on .k { left: 22px; }
    .dots { display: grid; grid-template-columns: repeat(8, minmax(0, 1fr)); gap: 6px; }
    .dots div { height: 10px; border-radius: 12px; }
    .d-done { background: #A3B18A; } .d-today { background: #01472E; } .d-ahead { box-shadow: inset 0 0 0 2px #A3B18A; } .d-skip { background: #F3F1DC; box-shadow: inset 0 0 0 2px #A3B18A; }
""".replace("NOISE", NOISE)

def page(body, cls=""):
    return f"""<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Oswald:wght@700&amp;family=Inter:wght@400;500;700&amp;display=swap">
  <style>{STYLE}  </style>
</helmet>
<div class="page {cls}">
{body}
</div>
</x-dc>
</body>
</html>
"""

def nav(on):
    return f"""  <div class="nav">
    <div class="{'on' if on=='today' else ''}">Today</div>
    <div class="{'on' if on=='map' else ''}">Map</div>
    <div class="{'on' if on=='ask' else ''}">Ask</div>
  </div>"""

def top(l, r, dark=False):
    d = " dark" if dark else ""
    return f"""  <div style="display: flex; justify-content: space-between; align-items: baseline;">
    <div class="eyebrow{d}">{l}</div>
    <div class="eyebrow{d}">{r}</div>
  </div>"""

def slider(label, v):
    pct = v/5*100
    return f"""  <div style="display: flex; flex-direction: column; gap: 10px;">
    <div style="display: flex; justify-content: space-between; align-items: baseline;">
      <div class="eyebrow">{label}</div>
      <div class="numeral" style="font-size: 18px;">{v}</div>
    </div>
    <div class="track"><div class="fill" style="width: {pct:.0f}%;"></div><div class="knob" style="left: calc({pct:.0f}% - 14px);"></div></div>
    <div style="display: flex; justify-content: space-between;">
      <div class="eyebrow" style="letter-spacing: 0.12em;">calm</div>
      <div class="eyebrow" style="letter-spacing: 0.12em;">strong</div>
    </div>
  </div>"""

def dots(pattern):
    m = {'d':'d-done','t':'d-today','a':'d-ahead','s':'d-skip'}
    return '  <div class="dots">\n' + '\n'.join(f'    <div class="{m[c]}"></div>' for c in pattern) + '\n  </div>'

files = {}

# Э0 Вход
files['Onboarding.dc.html'] = page(f"""
  <div class="eyebrow">Threshold</div>
  <div class="display" style="font-size: 26px;">For the first days we don't restrict anything — we watch</div>
  <div class="rule"></div>
  <div style="display: flex; flex-direction: column; gap: 8px;">
    <div class="eyebrow">What bothers you</div>
    <div class="seg"><div class="on">bloating</div><div>pain</div><div>bowel habits</div></div>
  </div>
  <div style="display: flex; flex-direction: column; gap: 8px;">
    <div class="eyebrow">How often</div>
    <div class="seg"><div>less than weekly</div><div class="on">a few times a week</div><div>almost daily</div></div>
  </div>
  <div style="display: flex; flex-direction: column; gap: 8px;">
    <div class="eyebrow">What you've tried</div>
    <div class="seg"><div>nothing yet</div><div class="on">cut foods on my own</div><div>with a dietitian</div></div>
  </div>
  <div style="display: flex; flex-direction: column; gap: 8px; margin-top: auto;">
    <div class="btn ghost">Allow Health</div>
    <div class="btn primary">Start</div>
    <div class="body soft" style="font-size: 12px; text-align: center; padding: 6px 8px 0;">Observations, not a diagnosis. Treatment decisions stay with your doctor.</div>
  </div>
""")

# Э1 Карта дня
files['DayCard.dc.html'] = page(f"""
{top('Day card · Sep 28', 'Day 24')}
  <div class="display" style="font-size: 24px;">How was today</div>
{slider('Belly', 1)}
{slider('Bowel', 0)}
{slider('Heaviness', 2)}
  <div class="card quiet" style="padding: 12px 16px;">
    <div class="body soft" style="font-size: 12px;">Sleep 7 h 10 min · 6,200 steps · resting HR 61 · Health</div>
  </div>
  <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px;">
    <div class="card quiet" style="padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; gap: 8px;">
      <div class="body" style="font-size: 14px;">Alcohol</div><div class="switch"><div class="k"></div></div>
    </div>
    <div class="card quiet" style="padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; gap: 8px;">
      <div class="body" style="font-size: 14px;">Unwell</div><div class="switch"><div class="k"></div></div>
    </div>
  </div>
  <div style="border-radius: 24px; padding: 12px 16px; box-shadow: inset 0 0 0 2px #A3B18A; display: flex; align-items: center; justify-content: space-between; gap: 8px;">
    <div class="body soft" style="font-size: 14px;">Blood in stool</div>
    <div class="eyebrow" style="color: #01472E; letter-spacing: 0.12em;">Report</div>
  </div>
  <div style="display: flex; flex-direction: column; gap: 8px; margin-top: auto;">
    <div class="btn ghost">Add a meal</div>
    <div class="btn primary">Close the day</div>
  </div>
""")

# Э1а Добавить еду
files['AddMeal.dc.html'] = page(f"""
{top('Add a meal', 'Day 24')}
  <div class="display" style="font-size: 24px;">What did you eat</div>
  <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px;">
    <div class="card" style="height: 96px; display: flex; align-items: flex-end;"><div class="display" style="font-size: 18px;">Photo</div></div>
    <div class="card" style="height: 96px; display: flex; align-items: flex-end;"><div class="display" style="font-size: 18px;">Voice</div></div>
    <div class="card" style="height: 96px; display: flex; align-items: flex-end;"><div class="display" style="font-size: 18px;">Type</div></div>
  </div>
  <div class="card accent">
    <div class="eyebrow" style="color: #4E6B57;">Recognized</div>
    <div class="display" style="font-size: 22px; margin-top: 8px;">Oatmeal with milk</div>
    <div style="display: flex; gap: 6px; margin-top: 10px;">
      <div style="font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #01472E; background: #FEFAE0; border-radius: 12px; padding: 6px 10px;">lactose</div>
    </div>
    <div class="rule" style="margin: 14px 0;"></div>
    <div class="body" style="font-size: 14px;">This is today's test dose — counted.</div>
  </div>
  <div style="display: flex; flex-direction: column; gap: 8px; margin-top: auto;">
    <div class="btn primary">Correct</div>
    <div class="btn ghost">Fix</div>
  </div>
""")

# Э2 Первый вывод (Today, day 7)
files['FirstInsight.dc.html'] = page(f"""
{top('Today · Day 7', 'Observing')}
  <div class="card dark">
    <div class="eyebrow dark">One week in</div>
    <div class="display dark" style="font-size: 22px; margin-top: 10px;">The first thing we see</div>
    <div class="rule dark" style="margin: 14px 0;"></div>
    <div class="body dark" style="font-size: 15px;">In four of your five rough days, the night was shorter than six hours.</div>
    <div class="body muted" style="font-size: 14px; margin-top: 12px;">For now this is an observation, not a conclusion — there isn't much data yet. Too early to talk about food, and we won't guess.</div>
    <div class="btn cream" style="margin-top: 16px;">Got it</div>
  </div>
  <div class="card quiet">
    <div class="eyebrow">of the data we need</div>
    <div style="display: flex; align-items: flex-end; gap: 10px; margin-top: 8px;">
      <div class="numeral" style="font-size: 44px;">24%</div>
      <div class="body soft" style="font-size: 13px; padding-bottom: 4px;">About 18 more days before we can name a suspect</div>
    </div>
  </div>
  <div class="btn primary" style="margin-top: auto;">Close the day</div>
{nav('today')}
""")

# Э3 Фон
files['Background.dc.html'] = page(f"""
{top('Today · Day 21', 'Observing')}
  <div style="display: flex; align-items: flex-end; gap: 12px;">
    <div class="numeral" style="font-size: 96px;">60%</div>
    <div class="eyebrow" style="padding-bottom: 12px;">of the data<br>we need</div>
  </div>
  <div class="body soft">About 6 more days before we can name a suspect</div>
  <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px;">
    <div class="card quiet" style="padding: 14px 16px;"><div class="numeral" style="font-size: 24px;">16<span style="font-size: 0.5em;"> / 20</span></div><div class="eyebrow" style="margin-top: 8px; letter-spacing: 0.12em;">full days</div></div>
    <div class="card quiet" style="padding: 14px 16px;"><div class="numeral" style="font-size: 24px;">9<span style="font-size: 0.5em;"> / 10</span></div><div class="eyebrow" style="margin-top: 8px; letter-spacing: 0.12em;">rough</div></div>
    <div class="card quiet" style="padding: 14px 16px;"><div class="numeral" style="font-size: 24px;">10<span style="font-size: 0.5em;"> / 10</span></div><div class="eyebrow" style="margin-top: 8px; letter-spacing: 0.12em;">good</div></div>
  </div>
  <div style="display: flex; flex-direction: column; gap: 8px;">
    <div class="eyebrow">Ask</div>
    <div class="card" style="padding: 14px 18px;">
      <div class="body" style="font-size: 14px; font-weight: 700;">What should I order at a café?</div>
      <div class="body soft" style="font-size: 14px; margin-top: 8px;">While we're observing there are no restrictions — order as usual and snap a photo if it's convenient.</div>
    </div>
    <div class="card quiet" style="padding: 14px 18px;"><div class="body" style="font-size: 14px;">Is yogurt okay?</div></div>
    <div class="card quiet" style="padding: 14px 18px;"><div class="body" style="font-size: 14px;">What can replace milk?</div></div>
  </div>
  <div class="btn primary" style="margin-top: auto;">Close the day</div>
{nav('today')}
""")

# Э4 Подозрение — Main
files['Main.dc.html'] = page(f"""
{top('A suspect', 'Day 25')}
  <div class="display" style="font-size: 26px;">Dairy keeps showing up on your rough days</div>
  <div class="rule"></div>
  <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px;">
    <div class="card dark">
      <div class="numeral dark" style="font-size: 48px;">12<span style="font-size: 0.5em; color: #A3B18A;"> / 15</span></div>
      <div class="eyebrow dark" style="margin-top: 10px; letter-spacing: 0.12em;">rough days with dairy</div>
    </div>
    <div class="card quiet">
      <div class="numeral" style="font-size: 48px;">3<span style="font-size: 0.5em; color: #7E9276;"> / 20</span></div>
      <div class="eyebrow" style="margin-top: 10px; letter-spacing: 0.12em;">good days with dairy</div>
    </div>
  </div>
  <div class="body" style="font-size: 16px;">Dairy showed up in 12 of your 15 rough days. On good days — 3 of 20.</div>
  <div class="body" style="font-size: 15px;">This could be a coincidence — about a quarter of patterns like this turn out to be. Want to test it over eight days?</div>
  <div style="display: flex; flex-direction: column; gap: 8px; margin-top: auto;">
    <div class="btn accent">Let's test it</div>
    <div class="btn accent">Not now</div>
    <div class="btn accent">Another suspect</div>
  </div>
""")

# Э5 Проверка, день 3
files['Check.dc.html'] = page(f"""
{top('Test: dairy', 'Day 3 · dairy-free')}
{dots('ddtaaaaa')}
  <div style="display: flex; justify-content: space-between;">
    <div class="eyebrow" style="letter-spacing: 0.12em;">return starts when calm</div>
    <div class="eyebrow" style="letter-spacing: 0.12em;">ends ~Oct 7</div>
  </div>
  <div class="card dark">
    <div class="eyebrow dark">Today</div>
    <div class="display dark" style="font-size: 22px; margin-top: 10px;">Today without dairy</div>
    <div class="rule dark" style="margin: 14px 0;"></div>
    <div class="body dark" style="font-size: 14px;">Swaps from your own meals:</div>
    <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 10px;">
      <div class="card lift" style="padding: 12px 16px;"><div class="body dark" style="font-size: 14px;">oatmeal with water</div></div>
      <div class="card lift" style="padding: 12px 16px;"><div class="body dark" style="font-size: 14px;">lactose-free cheese</div></div>
      <div class="card lift" style="padding: 12px 16px;"><div class="body dark" style="font-size: 14px;">coffee with oat milk</div></div>
    </div>
  </div>
  <div class="card quiet" style="padding: 12px 16px;"><div class="body soft" style="font-size: 13px;">Day 2 counted · sleep 7 h 20 min</div></div>
  <div class="btn primary" style="margin-top: auto;">Close the day</div>
{nav('today')}
""")

# Э5 отбракован
files['CheckDiscarded.dc.html'] = page(f"""
{top('Test: dairy', 'Day 6 · bringing it back')}
{dots('dddddsaa')}
  <div style="display: flex; justify-content: space-between;">
    <div class="eyebrow" style="letter-spacing: 0.12em;">today · not counted</div>
    <div class="eyebrow" style="letter-spacing: 0.12em;">ends ~Oct 8</div>
  </div>
  <div class="card accent">
    <div class="eyebrow" style="color: #4E6B57;">No test dose today</div>
    <div class="display" style="font-size: 22px; margin-top: 10px;">Last night: 4 h 40 min</div>
    <div class="rule" style="margin: 14px 0;"></div>
    <div class="body" style="font-size: 14px;">Short sleep causes symptoms on its own, and we couldn't tell it apart from dairy.</div>
    <div class="body" style="font-size: 14px; font-weight: 700; margin-top: 10px;">The dose moves to tomorrow. Eat as usual.</div>
  </div>
  <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px;">
    <div class="card quiet"><div class="eyebrow">Sleep</div><div class="numeral" style="font-size: 34px; margin-top: 8px;">4:40</div><div class="body soft" style="font-size: 12px; margin-top: 6px;">Health</div></div>
    <div class="card quiet"><div class="eyebrow">Threshold</div><div class="numeral" style="font-size: 34px; margin-top: 8px;">6:00</div><div class="body soft" style="font-size: 12px; margin-top: 6px;">protocol rule</div></div>
  </div>
  <div class="btn primary" style="margin-top: auto;">Got it</div>
{nav('today')}
""")

# Э5 пауза
files['CheckPaused.dc.html'] = page(f"""
{top('Test: dairy', 'Day 4 · dairy-free')}
{dots('dddsaaaa')}
  <div class="card quiet">
    <div class="eyebrow">Paused</div>
    <div class="display" style="font-size: 22px; margin-top: 10px;">No entries yesterday</div>
    <div class="rule" style="margin: 14px 0;"></div>
    <div class="body" style="font-size: 15px;">The test is paused, not failed. Continue today.</div>
  </div>
  <div class="card dark">
    <div class="eyebrow dark">Today</div>
    <div class="display dark" style="font-size: 22px; margin-top: 10px;">Today without dairy</div>
    <div class="body dark" style="font-size: 14px; margin-top: 10px;">Swaps from your own meals: oatmeal with water, lactose-free cheese, coffee with oat milk.</div>
  </div>
  <div class="btn primary" style="margin-top: auto;">Continue today</div>
{nav('today')}
""")

# Э6 Ответ
files['Verdict.dc.html'] = page(f"""
{top('The answer', 'Dairy · Day 8')}
  <div class="display" style="font-size: 34px; margin-top: 24px;">Milk: up to 125 ml is fine, 250 ml brings symptoms</div>
  <div class="rule"></div>
  <div class="body soft">The threshold was measured against your own day-to-day variation, with one control day inside the test.</div>
  <div class="card quiet" style="margin-top: 8px;">
    <div class="eyebrow">Next suspect</div>
    <div class="body" style="font-size: 15px; margin-top: 8px;">Fructans — in 9 of 15 rough days, 5 of 20 good.</div>
  </div>
  <div style="display: flex; flex-direction: column; gap: 8px; margin-top: auto;">
    <div class="btn primary">Next suspect: fructans</div>
    <div class="body" style="font-size: 15px; font-weight: 700; text-align: center; padding: 12px; color: #01472E;">To the map</div>
  </div>
""")

files['VerdictNotConfirmed.dc.html'] = page(f"""
{top('The answer', 'Dairy · Day 8')}
  <div class="display" style="font-size: 34px; margin-top: 24px;">Not confirmed: the difference stayed within your usual range</div>
  <div class="rule"></div>
  <div class="body">You can bring dairy back. The restriction you were keeping wasn't needed — and that's an answer too.</div>
  <div class="card quiet" style="margin-top: 8px;">
    <div class="eyebrow">Next suspect</div>
    <div class="body" style="font-size: 15px; margin-top: 8px;">Fructans — in 9 of 15 rough days, 5 of 20 good.</div>
  </div>
  <div style="display: flex; flex-direction: column; gap: 8px; margin-top: auto;">
    <div class="btn primary">Next suspect: fructans</div>
    <div class="body" style="font-size: 15px; font-weight: 700; text-align: center; padding: 12px; color: #01472E;">To the map</div>
  </div>
""")

def maprow(g, status, on=False):
    cls = "card" if on else "card quiet"
    return f"""    <div class="{cls}" style="padding: 14px 18px; display: flex; justify-content: space-between; align-items: baseline; gap: 8px;">
      <div class="body" style="font-size: 14px; font-weight: 700;">{g}</div>
      <div class="body soft" style="font-size: 12px; text-align: right;">{status}</div>
    </div>"""

# Э7 Карта
files['Map.dc.html'] = page(f"""
{top('Your tolerance map', '1 of 6 tested')}
  <div class="display" style="font-size: 26px;">What you tolerate — and how much</div>
  <div class="rule"></div>
  <div style="display: flex; flex-direction: column; gap: 8px;">
{maprow('Lactose', 'tested: up to 125 ml', True)}
{maprow('Fructans', 'observing')}
{maprow('GOS', 'observing')}
{maprow('Fructose', 'observing')}
{maprow('Sorbitol', 'observing')}
{maprow('Mannitol', 'observing')}
  </div>
  <div class="btn primary" style="margin-top: auto;">Page for your doctor</div>
{nav('map')}
""")

files['MapEmpty.dc.html'] = page(f"""
{top('Your tolerance map', 'Observing')}
  <div class="display" style="font-size: 26px;">What you tolerate — and how much</div>
  <div class="rule"></div>
  <div style="display: flex; flex-direction: column; gap: 8px;">
{maprow('Lactose', 'observing')}
{maprow('Fructans', 'observing')}
{maprow('GOS', 'observing')}
{maprow('Fructose', 'observing')}
{maprow('Sorbitol', 'observing')}
{maprow('Mannitol', 'observing')}
  </div>
  <div class="card quiet" style="padding: 12px 16px;"><div class="body soft" style="font-size: 13px;">Your first answer will appear after the first test.</div></div>
  <div class="btn ghost" style="margin-top: auto;">Page for your doctor</div>
{nav('map')}
""")

# Э7а Страница для врача — бумага
files['DoctorPage.dc.html'] = page(f"""
  <div style="display: flex; justify-content: space-between; align-items: baseline;">
    <div class="eyebrow" style="color: #01472E;">Threshold</div>
    <div class="eyebrow" style="color: #4E6B57;">1 page</div>
  </div>
  <div class="display" style="font-size: 24px; color: #1F2A24;">Participant observations</div>
  <div class="rule" style="background: #01472E;"></div>
  <div style="display: flex; flex-direction: column; gap: 6px;">
    <div class="eyebrow" style="color: #4E6B57;">Protocol</div>
    <div style="font-size: 13px; line-height: 1.45; color: #1F2A24;">Observation Sep 1–Sep 27. Test of "lactose" Sep 30–Oct 7: 5 days without the group, return in three doses, one control day.</div>
  </div>
  <div style="display: flex; flex-direction: column; gap: 6px;">
    <div class="eyebrow" style="color: #4E6B57;">Results by group</div>
    <div style="display: flex; flex-direction: column; gap: 4px; font-size: 13px; line-height: 1.45; color: #1F2A24;">
      <div style="display: flex; justify-content: space-between; gap: 8px;"><div style="font-weight: 700;">Lactose</div><div>up to 125 ml tolerated; 250 ml — symptoms</div></div>
      <div style="display: flex; justify-content: space-between; gap: 8px;"><div style="font-weight: 700;">Fructans</div><div>observing</div></div>
      <div style="display: flex; justify-content: space-between; gap: 8px;"><div style="font-weight: 700;">GOS · fructose · sorbitol · mannitol</div><div>observing</div></div>
    </div>
  </div>
  <div style="display: flex; flex-direction: column; gap: 6px;">
    <div class="eyebrow" style="color: #4E6B57;">Symptom score, daily median</div>
    <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px;">
      <div><div class="numeral" style="font-size: 30px; color: #1F2A24;">6</div><div class="eyebrow" style="margin-top: 6px; letter-spacing: 0.12em; color: #4E6B57;">before the test</div></div>
      <div><div class="numeral" style="font-size: 30px; color: #1F2A24;">3</div><div class="eyebrow" style="margin-top: 6px; letter-spacing: 0.12em; color: #4E6B57;">during restriction</div></div>
      <div><div class="numeral" style="font-size: 30px; color: #1F2A24;">5</div><div class="eyebrow" style="margin-top: 6px; letter-spacing: 0.12em; color: #4E6B57;">during return</div></div>
    </div>
  </div>
  <div style="font-size: 12px; line-height: 1.45; color: #4E6B57; margin-top: auto; border-top: 1px solid #A3B18A; padding-top: 12px;">Participant's own observations. Not a diagnosis, not a prescription.</div>
  <div class="btn primary">Share</div>
""", cls="paper")

# Э8 Красный флаг — единственный полностью тёмный
files['RedFlag.dc.html'] = page(f"""
  <div class="eyebrow dark">Protocol paused</div>
  <div class="display dark" style="font-size: 34px; margin-top: 24px;">This could be more serious than IBS</div>
  <div class="rule dark"></div>
  <div class="body dark" style="font-size: 16px;">You noted: blood in stool. Please see a doctor — here's what to show them.</div>
  <div class="body muted" style="font-size: 14px;">The protocol stays paused until you've talked to a doctor. We don't interpret this sign.</div>
  <div class="btn cream" style="margin-top: auto;">Open the page for your doctor</div>
""", cls="dark")

# Служебный переключатель
moments = [('Day 0 — start',False),('Day 7 — first insight',False),('Background, 60%',False),('Suspect',True),('Test, day 3',False),('Test, day 6 — not counted',False),('Test, day 4 — paused',False),('Answer — threshold',False),('Answer — not confirmed',False),('Map',False),('Red flag',False)]
rows = '\n'.join(f'    <div class="card{"" if on else " quiet"}" style="padding: 12px 16px;"><div class="body" style="font-size: 14px;{" font-weight: 700;" if on else ""}">{m}</div></div>' for m,on in moments)
files['MomentSwitcher.dc.html'] = page(f"""
  <div class="card dark" style="padding: 10px 16px;"><div class="body dark" style="font-size: 12px;">Moment: Suspect</div></div>
  <div class="eyebrow">Moment</div>
  <div style="display: flex; flex-direction: column; gap: 6px;">
{rows}
  </div>
""")

for name, html in files.items():
    open(name, 'w', encoding='utf-8').write(html)
print(len(files), 'artboards')
