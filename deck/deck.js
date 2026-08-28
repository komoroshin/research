/* ---------------------------------------------------------------------------
   Threshold deck — parser, renderers, navigation, presenter sync.
   No build step, no network. Loaded as a classic script so it works from
   file:// with a double click.
--------------------------------------------------------------------------- */

const Deck = (() => {
  // --- parsing ------------------------------------------------------------
  // Slides are separated by "=== slide N | layout: x" / "=== appendix N | ...".
  function parse(src) {
    const chunks = src.split(/^===[ \t]*/m).slice(1)
    const main = []
    const appendix = []
    for (const chunk of chunks) {
      const nl = chunk.indexOf('\n')
      const head = chunk.slice(0, nl).trim()
      const rest = chunk.slice(nl + 1)
      const [kindPart, ...opts] = head.split('|').map((s) => s.trim())
      const [kind, num] = kindPart.split(/\s+/)
      const layout =
        (opts.find((o) => o.startsWith('layout:')) || 'layout: statement')
          .split(':')[1]
          .trim()

      const [bodyRaw, notesRaw = ''] = rest.split(/^---[ \t]*notes[ \t]*$/m)
      const slide = {
        kind,
        num: Number(num),
        layout,
        // Слайд с пометкой internal не идёт ни в PDF, ни в публичную копию:
        // это внутренняя памятка, а не часть показа.
        internal: opts.includes('internal'),
        blocks: parseBlocks(bodyRaw),
        notes: notesRaw.trim(),
      }
      ;(kind === 'appendix' ? appendix : main).push(slide)
    }
    main.sort((a, b) => a.num - b.num)
    appendix.sort((a, b) => a.num - b.num)
    return { main, appendix, all: [...main, ...appendix] }
  }

  function parseBlocks(text) {
    const lines = text.split('\n')
    const blocks = []
    let list = null
    let table = null

    const flush = () => {
      if (list) { blocks.push({ type: 'list', items: list }); list = null }
      if (table) { blocks.push({ type: 'table', rows: table }); table = null }
    }

    for (const raw of lines) {
      const line = raw.trim()
      if (!line) { flush(); continue }

      if (line.startsWith('# ')) { flush(); blocks.push({ type: 'h1', text: line.slice(2) }); continue }
      if (line.startsWith('## ')) { flush(); blocks.push({ type: 'h2', text: line.slice(3) }); continue }
      if (line.startsWith('!! ')) {
        flush()
        // «!! [Метка] текст» — метка садится на рамку блока.
        const m = /^\[([^\]]+)\]\s*([\s\S]*)$/.exec(line.slice(3))
        blocks.push(m ? { type: 'accent', label: m[1], text: m[2] } : { type: 'accent', text: line.slice(3) })
        continue
      }
      if (line.startsWith('> ')) { flush(); blocks.push({ type: 'footnote', text: line.slice(2) }); continue }
      if (line.startsWith('[img] ')) {
        flush()
        const [src, caption = ''] = line.slice(6).split('|').map((x) => x.trim())
        blocks.push({ type: 'image', src, caption })
        continue
      }
      if (line.startsWith('[time] ')) {
        if (list) { blocks.push({ type: 'list', items: list }); list = null }
        if (table) { blocks.push({ type: 'table', rows: table }); table = null }
        const [when, what = ''] = line.slice(7).split('|').map((x) => x.trim())
        const last = blocks[blocks.length - 1]
        if (last && last.type === 'timeline') last.points.push({ when, what })
        else blocks.push({ type: 'timeline', points: [{ when, what }] })
        continue
      }
      if (line.startsWith('[big] ')) {
        flush()
        const [value, unit = ''] = line.slice(6).split('|').map((s) => s.trim())
        blocks.push({ type: 'big', value, unit })
        continue
      }
      if (line.startsWith('|')) {
        if (list) { blocks.push({ type: 'list', items: list }); list = null }
        table = table || []
        table.push(line.split('|').slice(1, -1).map((c) => c.trim()))
        continue
      }
      if (line.startsWith('- ')) {
        if (table) { blocks.push({ type: 'table', rows: table }); table = null }
        list = list || []
        list.push(line.slice(2))
        continue
      }
      flush()
      blocks.push({ type: 'p', text: line })
    }
    flush()
    return blocks
  }

  // --- inline formatting: **bold** only, everything else stays literal ----
  function inline(text) {
    const esc = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    return esc.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  }

  // --- rendering ----------------------------------------------------------
  function renderSlide(slide, index, total) {
    const canvas = document.createElement('div')
    canvas.className = 'canvas'
    canvas.dataset.index = String(index)

    const el = document.createElement('article')
    el.className = 'slide'
    el.dataset.layout = slide.layout
    if (slide.kind === 'appendix') el.dataset.appendix = '1'
    if (slide.internal) el.dataset.internal = '1'

    const head = slide.blocks.find((b) => b.type === 'h1')
    const rest = slide.blocks.filter((b) => b !== head)

    const eyebrow = document.createElement('p')
    eyebrow.className = 'eyebrow'
    eyebrow.textContent =
      slide.kind === 'appendix' ? `Приложение ${slide.num}` : `Threshold`
    el.appendChild(eyebrow)

    if (head) {
      const h1 = document.createElement('h1')
      if (head.text.length > 34) h1.classList.add('long')
      h1.innerHTML = inline(head.text)
      el.appendChild(h1)
    }

    const rule = document.createElement('div')
    rule.className = 'rule'
    el.appendChild(rule)

    const body = document.createElement('div')
    body.className = 'body'
    if (slide.layout === 'screen') {
      const image = rest.find((b) => b.type === 'image')
      const cols = document.createElement('div')
      cols.className = 'screenshot-cols'
      const left = document.createElement('div')
      renderBlocks(left, rest.filter((b) => b !== image), 'statement')
      cols.appendChild(left)
      if (image) {
        const fig = document.createElement('figure')
        fig.className = 'shot'
        const img = document.createElement('img')
        img.src = image.src
        img.alt = ''
        fig.appendChild(img)
        if (image.caption) {
          const cap = document.createElement('figcaption')
          cap.textContent = image.caption
          fig.appendChild(cap)
        }
        cols.appendChild(fig)
      }
      body.appendChild(cols)
    } else if (slide.layout === 'phases') {
      // Первый список в блоках — фазы для диаграммы. Всё, что стоит перед ним
      // в контенте (например объяснение метода), рендерится над диаграммой;
      // всё, что после, — под ней. Порядок в content.js задаёт порядок на слайде.
      const list = rest.find((b) => b.type === 'list')
      const idx = list ? rest.indexOf(list) : rest.length
      renderBlocks(body, rest.slice(0, idx), slide.layout)
      body.appendChild(phasesDiagram((list ? list.items : []).map(parsePhase)))
      renderBlocks(body, rest.slice(idx + 1), slide.layout)
    } else if (slide.layout === 'timeline') {
      const line = rest.find((b) => b.type === 'timeline')
      if (line) body.appendChild(timelineDiagram(line.points))
      renderBlocks(body, rest.filter((b) => b !== line), 'timeline')
    } else if (slide.layout === 'tranches' || slide.layout === 'ask') {
      renderTranches(body, rest)
    } else if (slide.layout === 'outlook') {
      // Два разных стола на одном слайде: пороги в две колонки и капитал в три.
      for (const b of rest) {
        if (b.type === 'table' && b.rows[0].length === 3) body.appendChild(capitalTable(b.rows))
        else renderBlocks(body, [b], 'outlook')
      }
    } else if (slide.layout === 'budget') {
      for (const b of rest) {
        if (b.type === 'table') body.appendChild(budgetTable(b.rows))
        else renderBlocks(body, [b], 'budget')
      }
    } else if (slide.layout === 'capital') {
      renderCapital(body, rest)
    } else if (slide.layout === 'risks' || slide.layout === 'thresholds' || slide.layout === 'dense') {
      renderBlocks(body, rest, slide.layout)
    } else {
      renderBlocks(body, rest, slide.layout)
    }
    el.appendChild(body)

    const num = document.createElement('div')
    num.className = 'num'
    num.textContent =
      slide.kind === 'appendix' ? `A${slide.num}` : `${slide.num} / ${total}`
    el.appendChild(num)

    if (slide.internal) {
      const mark = document.createElement('div')
      mark.className = 'private'
      mark.textContent = 'Не для показа'
      el.appendChild(mark)
    }

    canvas.appendChild(el)
    return canvas
  }

  function renderBlocks(host, blocks, layout) {
    let metrics = null
    for (const b of blocks) {
      if (b.type === 'big') {
        if (!metrics) {
          metrics = document.createElement('div')
          metrics.className = 'metrics'
          host.appendChild(metrics)
        }
        const wrap = document.createElement('div')
        const v = document.createElement('span')
        v.className = 'metric-value'
        v.textContent = b.value
        const u = document.createElement('span')
        u.className = 'metric-unit'
        u.textContent = b.unit
        wrap.appendChild(v)
        wrap.appendChild(u)
        metrics.appendChild(wrap)
        continue
      }
      metrics = null

      if (b.type === 'p') {
        const p = document.createElement('p')
        if (layout === 'title') p.className = 'lead'
        p.innerHTML = inline(b.text)
        host.appendChild(p)
      } else if (b.type === 'list') {
        const ul = document.createElement('ul')
        for (const item of b.items) {
          const li = document.createElement('li')
          li.innerHTML = inline(item)
          ul.appendChild(li)
        }
        host.appendChild(ul)
      } else if (b.type === 'accent') {
        const d = document.createElement('div')
        // Акцент с явной меткой ([Метка]) рисуется рамкой в любой раскладке:
        // рамка и есть способ пометить строку как ответ на конкретный вопрос.
        const gated = Boolean(b.label) ||
          layout === 'tranches' || layout === 'capital' || layout === 'ask' || layout === 'outlook'
        d.className = gated ? 'gate' : 'arith'
        if (gated) d.dataset.label = b.label || 'Ворота'
        d.innerHTML = inline(b.text)
        host.appendChild(d)
      } else if (b.type === 'footnote') {
        const d = document.createElement('p')
        d.className = 'footnote'
        d.innerHTML = inline(b.text)
        host.appendChild(d)
      } else if (b.type === 'table') {
        const t = document.createElement('table')
        t.className = 'levels'
        const tb = document.createElement('tbody')
        for (const row of b.rows) {
          const tr = document.createElement('tr')
          if (row.length === 2) tr.className = 'cols-2'
          for (const cell of row) {
            const td = document.createElement('td')
            td.innerHTML = inline(cell)
            tr.appendChild(td)
          }
          tb.appendChild(tr)
        }
        t.appendChild(tb)
        host.appendChild(t)
      }
    }
  }

  // Slide 12: two tranches side by side, then the gate, then the footer line.
  function renderTranches(host, blocks) {
    const grid = document.createElement('div')
    grid.className = 'tranches'
    let current = null
    const after = []

    for (const b of blocks) {
      if (b.type === 'h2') {
        current = document.createElement('div')
        current.className = 'tranche'
        const h2 = document.createElement('h2')
        h2.textContent = b.text
        current.appendChild(h2)
        grid.appendChild(current)
        continue
      }
      if (b.type === 'accent' || b.type === 'footnote') { after.push(b); continue }
      if (current) renderBlocks(current, [b], 'tranches')
      else renderBlocks(host, [b], 'statement')
    }
    host.appendChild(grid)
    renderBlocks(host, after, 'tranches')
  }

  // Финальный слайд: таблица капитала по рубежам слева, роль команды справа,
  // ворота и открытое допущение — во всю ширину под ними. Первая строка
  // таблицы читается как шапка: в ней стоят названия колонок, не данные.
  function renderCapital(host, blocks) {
    const table = blocks.find((b) => b.type === 'table')
    const idx = table ? blocks.indexOf(table) : blocks.length

    const cols = document.createElement('div')
    cols.className = 'capital-cols'
    const left = document.createElement('div')
    renderBlocks(left, blocks.slice(0, idx).filter((b) => b.type === 'p'), 'capital')
    if (table) left.appendChild(capitalTable(table.rows))
    cols.appendChild(left)

    const roles = document.createElement('div')
    roles.className = 'roles'
    const tail = []
    let inRoles = false
    for (const b of blocks.slice(idx + 1)) {
      if (b.type === 'h2') {
        inRoles = true
        const h2 = document.createElement('h2')
        h2.textContent = b.text
        roles.appendChild(h2)
        continue
      }
      if (b.type === 'accent' || b.type === 'footnote') { tail.push(b); continue }
      if (inRoles) renderBlocks(roles, [b], 'capital')
      else tail.push(b)
    }
    cols.appendChild(roles)
    host.appendChild(cols)
    renderBlocks(host, tail, 'capital')
  }

  // Смета: статья слева, сумма справа моноширинным. Строка «Итого» набрана в
  // контенте жирным и получает подчёркнутую рамку.
  function budgetTable(rows) {
    const t = document.createElement('table')
    t.className = 'budget'
    const [head, ...body] = rows
    const thead = document.createElement('thead')
    const htr = document.createElement('tr')
    for (const cell of head) {
      const th = document.createElement('th')
      th.textContent = cell
      htr.appendChild(th)
    }
    thead.appendChild(htr)
    t.appendChild(thead)
    const tb = document.createElement('tbody')
    for (const row of body) {
      const tr = document.createElement('tr')
      if (row.some((c) => c.startsWith('**'))) tr.className = 'sum'
      row.forEach((cell) => {
        const td = document.createElement('td')
        td.innerHTML = inline(cell)
        tr.appendChild(td)
      })
      tb.appendChild(tr)
    }
    t.appendChild(tb)
    return t
  }

  function capitalTable(rows) {
    const t = document.createElement('table')
    t.className = 'capital'
    const [head, ...body] = rows
    const thead = document.createElement('thead')
    const htr = document.createElement('tr')
    for (const cell of head) {
      const th = document.createElement('th')
      th.textContent = cell
      htr.appendChild(th)
    }
    thead.appendChild(htr)
    t.appendChild(thead)
    const tb = document.createElement('tbody')
    for (const row of body) {
      const tr = document.createElement('tr')
      row.forEach((cell) => {
        const td = document.createElement('td')
        td.innerHTML = inline(cell)
        tr.appendChild(td)
      })
      tb.appendChild(tr)
    }
    t.appendChild(tb)
    return t
  }

  // Slide 4: the four phases, drawn in code from the slide's own bullets.
  // Phase three is the product — it is the only one that repeats, and the only
  // one drawn in the accent colour.
  function parsePhase(item) {
    const m = /^\*\*(.+?)\*\*\s*[—–-]?\s*(.*)$/.exec(item.trim())
    return m ? { name: m[1], sub: m[2] } : { name: item.trim(), sub: '' }
  }

  function wrap(text, max) {
    const words = text.split(' ')
    const lines = ['']
    for (const w of words) {
      const line = lines[lines.length - 1]
      if (!line) lines[lines.length - 1] = w
      else if ((line + ' ' + w).length <= max) lines[lines.length - 1] = line + ' ' + w
      else lines.push(w)
    }
    return lines
  }

  // Слайд 7: горизонт тремя годами. Первая точка залита — она уже строится,
  // остальные обведены: это горизонт, а не план поставки с датами.
  function timelineDiagram(points) {
    const NS = 'http://www.w3.org/2000/svg'
    const W = 1656
    const H = 104
    const svg = document.createElementNS(NS, 'svg')
    svg.setAttribute('class', 'timeline')
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`)
    svg.setAttribute('role', 'img')

    const add = (name, attrs) => {
      const n = document.createElementNS(NS, name)
      for (const k in attrs) n.setAttribute(k, attrs[k])
      svg.appendChild(n)
      return n
    }
    const label = (x, y, text, cls, anchor) => {
      const t = document.createElementNS(NS, 'text')
      t.setAttribute('x', x)
      t.setAttribute('y', y)
      t.setAttribute('class', cls)
      t.setAttribute('text-anchor', anchor)
      t.textContent = text
      svg.appendChild(t)
      return t
    }

    const yAxis = 52
    // Точки отступают от краёв на радиус, иначе первый кружок срезается полем,
    // а последний налезает на стрелку.
    const r = 11
    const left = r + 1
    const right = W - 96
    const last = points.length - 1
    const step = last > 0 ? (right - left) / last : 0

    add('line', { x1: 0, y1: yAxis, x2: W - 34, y2: yAxis, stroke: 'var(--rule)', 'stroke-width': 3 })
    // Стрелка вправо: горизонт продолжается за третьим годом.
    add('path', {
      d: `M ${W - 34} ${yAxis - 12} L ${W} ${yAxis} L ${W - 34} ${yAxis + 12} Z`,
      fill: 'var(--rule)',
    })

    points.forEach((p, i) => {
      const x = left + i * step
      const now = i === 0
      // Крайние подписи прижаты к краям, иначе третий год уезжает за поле.
      const anchor = i === 0 ? 'start' : i === last ? 'end' : 'middle'
      label(x, yAxis - 26, p.when, now ? 'when on' : 'when', anchor)
      add('circle', {
        cx: x, cy: yAxis, r: 11,
        fill: now ? 'var(--accent)' : 'var(--paper)',
        stroke: now ? 'var(--accent)' : 'var(--ink-3)',
        'stroke-width': 3,
      })
      label(x, yAxis + 44, p.what, now ? 'what on' : 'what', anchor)
    })
    return svg
  }

  function phasesDiagram(phases) {
    const NS = 'http://www.w3.org/2000/svg'
    const W = 1656
    const H = 231
    const svg = document.createElementNS(NS, 'svg')
    svg.setAttribute('class', 'diagram')
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`)
    svg.setAttribute('role', 'img')

    const add = (name, attrs, cls) => {
      const n = document.createElementNS(NS, name)
      for (const k in attrs) n.setAttribute(k, attrs[k])
      if (cls) n.setAttribute('class', cls)
      svg.appendChild(n)
      return n
    }
    const label = (x, y, text, cls, anchor) => {
      const t = document.createElementNS(NS, 'text')
      t.setAttribute('x', x)
      t.setAttribute('y', y)
      if (cls) t.setAttribute('class', cls)
      if (anchor) t.setAttribute('text-anchor', anchor)
      t.textContent = text
      svg.appendChild(t)
      return t
    }

    // Phase three carries the product, so it gets the width as well as the ink.
    const weights = [1, 1, 2.15, 1.15]
    const gap = 44
    const usable = W - gap * (phases.length - 1)
    const sum = weights.slice(0, phases.length).reduce((a, b) => a + b, 0)
    let x = 0
    const yBox = 58
    const hBox = 54
    const key = 2

    phases.forEach((p, i) => {
      const w = (usable * (weights[i] || 1)) / sum
      label(x, 34, p.name, 'big')

      if (i === key) {
        add('rect', { x: x - 10, y: yBox - 14, width: w + 20, height: hBox + 28, fill: 'var(--accent-soft)' })
        const tests = 4
        const tw = (w - gap * 0.7 * (tests - 1)) / tests
        for (let k = 0; k < tests; k++) {
          const bx = x + k * (tw + gap * 0.7)
          add('rect', { x: bx, y: yBox, width: tw, height: hBox, fill: 'var(--accent)' })
          if (k < tests - 1) {
            add('line', {
              x1: bx + tw + 5, y1: yBox + hBox / 2, x2: bx + tw + gap * 0.7 - 5, y2: yBox + hBox / 2,
              stroke: 'var(--ink-2)', 'stroke-width': 3, 'stroke-dasharray': '3 7', 'stroke-linecap': 'round',
            })
          }
        }
      } else {
        add('rect', { x, y: yBox, width: w, height: hBox, fill: 'none', stroke: 'var(--ink-3)', 'stroke-width': 2 })
      }

      // Mono at 26px runs ~17px per character; wrap to what the column holds.
      const perLine = Math.max(9, Math.floor(w / 17))
      wrap(p.sub, perLine).forEach((line, n) => label(x, yBox + hBox + 34 + n * 27, line))
      x += w + gap
    })

    // The spine: the phases run left to right, in order.
    const yAxis = H - 18
    add('line', { x1: 0, y1: yAxis, x2: W, y2: yAxis, stroke: 'var(--rule)', 'stroke-width': 2 })
    let tick = 0
    phases.forEach((p, i) => {
      add('line', { x1: tick, y1: yAxis - 8, x2: tick, y2: yAxis + 8, stroke: 'var(--rule)', 'stroke-width': 2 })
      tick += (usable * (weights[i] || 1)) / sum + gap
    })
    return svg
  }

  return { parse, renderSlide, inline }
})()

// --- the show ---------------------------------------------------------------

function boot(source) {
  const deck = Deck.parse(source)
  const stage = document.querySelector('.stage')
  const total = deck.main.length

  deck.all.forEach((slide, i) => {
    stage.appendChild(Deck.renderSlide(slide, i, total))
  })

  const canvases = Array.from(stage.querySelectorAll('.canvas'))
  let index = 0
  let presenterWin = null

  function fit() {
    const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080)
    canvases.forEach((c) => { c.style.transform = `scale(${scale})` })
  }

  let updateControls = () => {}

  function show(i) {
    index = Math.max(0, Math.min(canvases.length - 1, i))
    canvases.forEach((c, n) => {
      c.classList.toggle('is-current', n === index)
      c.querySelector('.slide').classList.toggle('is-current', n === index)
    })
    updateControls()
    sync()
  }

  // Presenter sync goes through localStorage, polled from both sides.
  // Cross-window property access and hash writes are blocked under file://
  // (SecurityError), storage is not — and polling survives even when the
  // storage event does not fire.
  const CH = 'threshold-deck'
  function sync() {
    try { localStorage.setItem(CH + '-state', JSON.stringify({ i: index, at: Date.now() })) } catch (e) { /* ignore */ }
  }

  let lastCmd = 0
  setInterval(() => {
    try {
      const raw = localStorage.getItem(CH + '-cmd')
      if (!raw) return
      const cmd = JSON.parse(raw)
      if (cmd.seq === lastCmd) return
      lastCmd = cmd.seq
      if (typeof cmd.i === 'number' && cmd.i !== index) show(cmd.i)
    } catch (e) { /* ignore */ }
  }, 180)

  function openPresenter() {
    sync()
    presenterWin = window.open('presenter.html', 'threshold-presenter', 'width=1100,height=760')
  }

  // The main flow stops at the last numbered slide. The appendix is reachable
  // by number or by the A key, never by paging off the end.
  const lastMain = total - 1
  const next = () => show(index >= lastMain && index < total ? Math.min(index + 1, lastMain) : index + 1)
  const prev = () => show(index - 1)

  // On touch, "next" at the boundary can't silently stop the way it does on
  // a keyboard — the phone has no `A` key to fall back on, and a swipe that
  // does nothing reads as broken, not as "the deck is over". So a touch
  // advance at the last main slide opens the picker instead of no-op'ing.
  // Keyboard ArrowRight/Space keep the plain no-op — that behavior is
  // covered by check.mjs and is what a presenter driving from a laptop
  // expects.
  let picker = null
  const advance = () => {
    if (index === lastMain && picker) picker.classList.add('show')
    else next()
  }

  let typed = ''
  let typedTimer = null
  const overlay = document.querySelector('.overlay')
  function showTyped() {
    overlay.textContent = typed ? `Слайд ${typed} — Enter` : ''
    overlay.classList.toggle('show', Boolean(typed))
  }

  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return
    const k = e.key

    if (/^[0-9]$/.test(k)) {
      typed += k
      clearTimeout(typedTimer)
      typedTimer = setTimeout(() => { typed = ''; showTyped() }, 2000)
      showTyped()
      return
    }
    if (k === 'Enter' && typed) {
      const n = Number(typed)
      typed = ''
      showTyped()
      if (n >= 1 && n <= canvases.length) show(n - 1)
      return
    }

    switch (k) {
      case 'ArrowRight': case 'ArrowDown': case 'PageDown': case ' ':
        e.preventDefault(); next(); break
      case 'ArrowLeft': case 'ArrowUp': case 'PageUp':
        e.preventDefault(); prev(); break
      case 'Home': show(0); break
      case 'End': show(lastMain); break
      case 'a': case 'A': case 'ф': case 'Ф':
        show(total); break
      case 'p': case 'P': case 'з': case 'З':
        openPresenter(); break
      case 'f': case 'F': case 'а': case 'А':
        if (document.fullscreenElement) document.exitFullscreen()
        else document.documentElement.requestFullscreen()
        break
    }
  })

  // --- touch: без клавиатуры показ был непроходим ------------------------
  // Свайп по горизонтали, тап по краям экрана и видимые кнопки. Кнопки
  // показываются только там, где нет мыши или экран узкий — на проекторе
  // ничего лишнего.
  let touchX = null
  let touchY = null
  document.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return
    touchX = e.touches[0].clientX
    touchY = e.touches[0].clientY
  }, { passive: true })

  document.addEventListener('touchend', (e) => {
    if (touchX === null) return
    const t = e.changedTouches[0]
    const dx = t.clientX - touchX
    const dy = t.clientY - touchY
    touchX = null
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      dx < 0 ? advance() : prev()
    }
  }, { passive: true })

  // Тап по краю: правая треть — вперёд, левая — назад. Середина не реагирует,
  // чтобы случайное касание не листало.
  document.addEventListener('click', (e) => {
    if (e.target.closest('.deck-controls') || e.target.closest('.deck-picker')) return
    // Открытый список закрывается касанием мимо и слайд при этом не листает.
    const openPicker = document.querySelector('.deck-picker.show')
    if (openPicker) {
      openPicker.classList.remove('show')
      return
    }
    const x = e.clientX / window.innerWidth
    if (x > 0.68) advance()
    else if (x < 0.32) prev()
  })

  buildControls()

  function buildControls() {
    const bar = document.createElement('div')
    bar.className = 'deck-controls'

    const mk = (label, aria, fn) => {
      const b = document.createElement('button')
      b.type = 'button'
      b.textContent = label
      b.setAttribute('aria-label', aria)
      b.addEventListener('click', fn)
      return b
    }

    const prevBtn = mk('‹', 'Предыдущий слайд', prev)
    const counter = mk('', 'Список слайдов', () => picker.classList.toggle('show'))
    counter.className = 'counter'
    const nextBtn = mk('›', 'Следующий слайд', advance)

    bar.append(prevBtn, counter, nextBtn)
    document.body.appendChild(bar)

    // Список для перехода: на телефоне номер с клавиатуры не набрать.
    picker = document.createElement('div')
    picker.className = 'deck-picker'
    deck.all.forEach((slide, i) => {
      const b = document.createElement('button')
      b.type = 'button'
      b.textContent = slide.kind === 'appendix' ? `A${slide.num}` : String(slide.num)
      if (slide.kind === 'appendix') b.className = 'appendix'
      b.addEventListener('click', () => {
        show(i)
        picker.classList.remove('show')
      })
      picker.appendChild(b)
    })
    document.body.appendChild(picker)

    updateControls = () => {
      const slide = deck.all[index]
      counter.textContent = slide.kind === 'appendix' ? `A${slide.num}` : `${slide.num} / ${total}`
      prevBtn.disabled = index === 0
      // Disabled only at the true end (last appendix slide). At the last
      // main slide it stays tappable — that tap is what opens the picker.
      nextBtn.disabled = index === canvases.length - 1
      picker.querySelectorAll('button').forEach((b, i) => b.classList.toggle('on', i === index))
    }
    updateControls()
  }

  window.addEventListener('hashchange', () => {
    const m = /i=(\d+)/.exec(location.hash)
    if (m && Number(m[1]) !== index) show(Number(m[1]))
  })
  window.addEventListener('resize', fit)
  window.addEventListener('unload', () => { if (presenterWin && !presenterWin.closed) presenterWin.close() })

  fit()
  show(0)

  // Typography floor check: report any slide whose content does not fit at the
  // required minimum size. Never shrink the type — report it instead.
  // Слайды, кроме текущего, скрыты через display:none — у скрытого элемента
  // scrollHeight равен нулю, и проверка молча считала, что всё помещается.
  // Поэтому на время замера показываем все холсты, как это делает печать.
  window.deckOverflows = () => {
    document.body.classList.add('measure-all')
    const over = canvases
      .map((c, i) => {
        const s = c.querySelector('.slide')
        const b = c.querySelector('.body')
        // .body — flex-элемент с min-height: 0: он схлопывается и режет
        // содержимое, не переполняя при этом сам слайд. Мерим и его.
        const px = Math.max(
          s.scrollHeight - s.clientHeight,
          b ? b.scrollHeight - b.clientHeight : 0
        )
        const slide = deck.all[i]
        return px > 1
          ? { slide: slide.kind === 'appendix' ? `A${slide.num}` : String(slide.num), overflowPx: px }
          : null
      })
      .filter(Boolean)
    document.body.classList.remove('measure-all')
    return over
  }

  window.deckData = deck
  window.deckGoto = show
}
