/* ---------------------------------------------------------------------------
   Threshold landing — variant split and analytics.

   No third-party script, no network call. Events are pushed to
   window.dataLayer and mirrored to the console, so any analytics tool can be
   attached later by reading that queue. Nothing here loads on its own.
--------------------------------------------------------------------------- */

const CONFIG = {
  // Real launch date. The page prints [DATE] until this is filled in — a
  // deliberate blocker: the preorder promise must not go live with a
  // placeholder in it.
  launchDate: '',

  // Stripe payment links, one per variant. Until they are set, the buttons
  // record the click and go nowhere.
  checkout: {
    a: '', // one payment, $179
    b: '', // subscription, $29/month
  },

  // 50/50 split. Set to 'a' or 'b' to force a single variant.
  forceVariant: null,
}

// --- variant ----------------------------------------------------------------

const KEY = 'threshold-variant'

function pickVariant() {
  const fromUrl = new URLSearchParams(location.search).get('v')
  if (fromUrl === 'a' || fromUrl === 'b') {
    try { localStorage.setItem(KEY, fromUrl) } catch (e) {}
    return fromUrl
  }
  if (CONFIG.forceVariant) return CONFIG.forceVariant
  try {
    const seen = localStorage.getItem(KEY)
    if (seen === 'a' || seen === 'b') return seen
    const fresh = Math.random() < 0.5 ? 'a' : 'b'
    localStorage.setItem(KEY, fresh)
    return fresh
  } catch (e) {
    // Private mode: still split, just without stickiness.
    return Math.random() < 0.5 ? 'a' : 'b'
  }
}

const variant = pickVariant()

// The two versions differ in the price block and nowhere else. The final
// button carries the price, so it follows the variant too.
document.querySelectorAll('.price').forEach((el) => {
  el.hidden = el.dataset.variant !== variant
})
document.querySelectorAll('[data-price-label]').forEach((el) => {
  el.textContent = variant === 'a' ? '$179' : '$29/month'
})
document.documentElement.dataset.variant = variant

if (CONFIG.launchDate) {
  document.querySelectorAll('[data-launch-date]').forEach((el) => {
    el.textContent = CONFIG.launchDate
  })
}

// --- events -----------------------------------------------------------------

window.dataLayer = window.dataLayer || []

function track(event, props = {}) {
  const payload = {
    event,
    variant,
    ...utm,
    ...props,
    at: new Date().toISOString(),
  }
  window.dataLayer.push(payload)
  if (location.hostname === 'localhost' || location.protocol === 'file:') {
    console.log('[track]', payload)
  }
}

// Campaign source, kept for the whole session so later events carry it too.
const utm = (() => {
  const p = new URLSearchParams(location.search)
  const fields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
  const found = {}
  for (const f of fields) if (p.get(f)) found[f] = p.get(f)
  try {
    if (Object.keys(found).length) sessionStorage.setItem('threshold-utm', JSON.stringify(found))
    else return JSON.parse(sessionStorage.getItem('threshold-utm') || '{}')
  } catch (e) {}
  return found
})()

track('visit')

// Reaching the price block is the split the brief cares about: dropping off
// before it means the product was not believed, after it means the price was.
const price = document.getElementById('price')
if (price && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          track('price_view')
          io.disconnect()
        }
      }
    },
    { threshold: 0.4 }
  )
  io.observe(price)
}

document.querySelectorAll('[data-cta]').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const place = btn.dataset.cta
    track('cta_click', { place })

    if (!btn.hasAttribute('data-checkout')) return // in-page anchor, let it scroll

    e.preventDefault()
    const url = CONFIG.checkout[variant]
    if (!url) {
      console.warn('[threshold] checkout URL is not configured for variant', variant)
      return
    }
    track('checkout_open')
    location.href = url
  })
})

/* Events the page cannot see on its own — wire them where they happen:

     paid            → Stripe webhook (checkout.session.completed)
     refund          → Stripe webhook (charge.refunded)
     interview_book  → the confirmation page of the interview form

   Push them into the same queue so the funnel stays in one place:
     window.dataLayer.push({ event: 'paid', variant, ... })
*/
window.thresholdTrack = track
