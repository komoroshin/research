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
      if (line.startsWith('!! ')) { flush(); blocks.push({ type: 'accent', text: line.slice(3) }); continue }
      if (line.startsWith('> ')) { flush(); blocks.push({ type: 'footnote', text: line.slice(2) }); continue }
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
    if (slide.layout === 'phases') body.appendChild(phasesDiagram())
    if (slide.layout === 'tranches') renderTranches(body, rest)
    else renderBlocks(body, rest, slide.layout)
    el.appendChild(body)

    const num = document.createElement('div')
    num.className = 'num'
    num.textContent =
      slide.kind === 'appendix' ? `A${slide.num}` : `${slide.num} / ${total}`
    el.appendChild(num)

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
        d.className = layout === 'tranches' ? 'gate' : 'arith'
        if (layout === 'tranches') d.dataset.label = 'Ворота'
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

  // Slide 4: four phases, drawn in code. Phase three is the product — it is
  // the only one that repeats, and the only one drawn in the accent colour.
  function phasesDiagram() {
    const NS = 'http://www.w3.org/2000/svg'
    const svg = document.createElementNS(NS, 'svg')
    svg.setAttribute('class', 'diagram')
    svg.setAttribute('viewBox', '0 0 1656 320')
    svg.setAttribute('role', 'img')

    const add = (name, attrs, cls) => {
      const n = document.createElementNS(NS, name)
      for (const k in attrs) n.setAttribute(k, attrs[k])
      if (cls) n.setAttribute('class', cls)
      svg.appendChild(n)
      return n
    }
    const label = (x, y, text, cls) => {
      const t = document.createElementNS(NS, 'text')
      t.setAttribute('x', x)
      t.setAttribute('y', y)
      if (cls) t.setAttribute('class', cls)
      t.textContent = text
      svg.appendChild(t)
      return t
    }

    const y = 132
    const h = 56
    const phases = [
      { x: 0, w: 250, name: 'Базовый период', sub: '14 дней' },
      { x: 274, w: 250, name: 'Элиминация', sub: '2 недели' },
      { x: 548, w: 720, name: 'Реинтродукция', sub: 'повторяющиеся тесты', on: true },
      { x: 1292, w: 364, name: 'Применение', sub: 'карта переносимости' },
    ]

    phases.forEach((p) => {
      if (p.on) {
        add('rect', { x: p.x, y: y - 34, width: p.w, height: h + 68, fill: 'var(--accent-soft)' })
        // Repeating tests with rest gaps between them.
        const tests = 5
        const gap = 28
        const tw = (p.w - gap * (tests - 1) - 32) / tests
        for (let i = 0; i < tests; i++) {
          const x = p.x + 16 + i * (tw + gap)
          add('rect', { x, y, width: tw, height: h, fill: 'var(--accent)' })
          label(x + tw / 2, y + h + 34, String(i + 1), 'on').setAttribute('text-anchor', 'middle')
          if (i < tests - 1) {
            add('line', {
              x1: x + tw + 4, y1: y + h / 2, x2: x + tw + gap - 4, y2: y + h / 2,
              stroke: 'var(--ink-2)', 'stroke-width': 3, 'stroke-dasharray': '3 6',
              'stroke-linecap': 'round',
            })
          }
        }
        label(p.x + 16, y - 56, p.name, 'big')
        label(p.x + p.w - 16, y - 56, p.sub).setAttribute('text-anchor', 'end')
        label(p.x + p.w / 2, y + h + 76, '· перерыв между тестами ·').setAttribute('text-anchor', 'middle')
      } else {
        add('rect', { x: p.x, y, width: p.w, height: h, fill: 'none', stroke: 'var(--ink-3)', 'stroke-width': 2 })
        label(p.x, y - 56, p.name, 'big')
        label(p.x, y + h + 34, p.sub)
      }
    })

    // The spine: phases run left to right, in order.
    add('line', { x1: 0, y1: y + h + 78, x2: 1656, y2: y + h + 78, stroke: 'var(--rule)', 'stroke-width': 2 })
    for (const p of phases) {
      add('line', { x1: p.x, y1: y + h + 70, x2: p.x, y2: y + h + 86, stroke: 'var(--rule)', 'stroke-width': 2 })
    }
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

  function show(i) {
    index = Math.max(0, Math.min(canvases.length - 1, i))
    canvases.forEach((c, n) => {
      c.classList.toggle('is-current', n === index)
      c.querySelector('.slide').classList.toggle('is-current', n === index)
    })
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
  window.deckOverflows = () =>
    canvases
      .map((c, i) => {
        const s = c.querySelector('.slide')
        const over = s.scrollHeight - s.clientHeight
        const slide = deck.all[i]
        return over > 1
          ? { slide: slide.kind === 'appendix' ? `A${slide.num}` : String(slide.num), overflowPx: over }
          : null
      })
      .filter(Boolean)

  window.deckData = deck
  window.deckGoto = show
}
