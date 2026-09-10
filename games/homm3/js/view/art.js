/* ============================================================================
   view/art.js — рисованные вставки интерфейса: картина финала партии.

   Рисуем не иллюстрацию «вообще», а тот же мир: небо по исходу, дальние гряды,
   город фракции игрока силуэтом и на свету, знамёна. Победа — рассвет и лучи,
   поражение — дым, вороньё и погасшее небо.
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});
  const U = H3.U, Sp = H3.Sprites, F = H3.Factions;

  const W = 480, H = 190;

  /** Картина итога партии. opts: { won, faction, color, seed } */
  function finale(canvas, opts) {
    const won = !!opts.won, fid = opts.faction || 'castle';
    const color = opts.color || '#d23b2a';
    const ctx = canvas.getContext('2d');
    canvas.width = W; canvas.height = H;
    ctx.imageSmoothingEnabled = false;
    const rng = new U.RNG(U.hashStr('finale:' + fid + ':' + (opts.seed || 1) + ':' + won));

    // небо: рассвет над победой, зола над поражением
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    if (won) { sky.addColorStop(0, '#2b4a86'); sky.addColorStop(0.45, '#e08a3a'); sky.addColorStop(0.72, '#f6d08a'); sky.addColorStop(1, '#6b5a3a'); }
    else { sky.addColorStop(0, '#1a1420'); sky.addColorStop(0.5, '#4a2018'); sky.addColorStop(0.8, '#7a3a22'); sky.addColorStop(1, '#241a14'); }
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);

    // светило у горизонта
    const sx = W * 0.5, sy = H * 0.62;
    const glow = ctx.createRadialGradient(sx, sy, 4, sx, sy, W * 0.42);
    glow.addColorStop(0, won ? 'rgba(255,240,190,0.95)' : 'rgba(255,120,60,0.35)');
    glow.addColorStop(1, 'rgba(255,200,120,0)');
    ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);

    // лучи победы веером из-за горизонта
    if (won) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 9; i++) {
        const a = -Math.PI / 2 + (i - 4) * 0.19;
        ctx.fillStyle = 'rgba(255,232,170,' + (0.05 + (i % 2) * 0.03).toFixed(2) + ')';
        ctx.beginPath(); ctx.moveTo(sx, sy);
        ctx.lineTo(sx + Math.cos(a - 0.045) * W, sy + Math.sin(a - 0.045) * W);
        ctx.lineTo(sx + Math.cos(a + 0.045) * W, sy + Math.sin(a + 0.045) * W);
        ctx.fill();
      }
      ctx.restore();
    }

    // две дальние гряды
    for (let l = 0; l < 2; l++) {
      ctx.fillStyle = won ? (l ? '#6a5a48' : '#8a7458') : (l ? '#2a1c18' : '#3a2620');
      ctx.globalAlpha = l ? 1 : 0.8;
      ctx.beginPath(); ctx.moveTo(0, H);
      for (let x = 0; x <= W; x += 16) ctx.lineTo(x, H * (l ? 0.78 : 0.72) - Math.abs(Math.sin(x / (70 + l * 50) + l * 2)) * (l ? 14 : 22) - rng.int(0, 5));
      ctx.lineTo(W, H); ctx.fill();
    }
    ctx.globalAlpha = 1;

    // город фракции: у победы — на свету, у поражения — чёрным силуэтом в дыму
    const name = 'town_' + fid;
    if (Sp.has(name)) {
      const scale = 2;
      if (won) Sp.draw(ctx, name, W / 2, H * 0.94, scale);
      else {
        const cv = Sp.silhouette(name, scale);
        if (cv) { ctx.globalAlpha = 0.92; ctx.drawImage(cv, Math.round(W / 2 - cv._anchor[0] * scale), Math.round(H * 0.94 - cv._anchor[1] * scale)); ctx.globalAlpha = 1; }
      }
      // знамёна на башнях
      for (const dx of [-46, 46]) {
        const fx = W / 2 + dx, fy = H * 0.94 - 46;
        ctx.fillStyle = '#2a1a10'; ctx.fillRect(fx, fy, 1, 14);
        ctx.fillStyle = won ? color : '#4a3a34';
        for (let i = 0; i < 7; i++) ctx.fillRect(fx + 1 + i, fy + Math.round(Math.sin(i * 0.9 + dx) * (i / 7) * 1.6), 1, 6);
      }
    }

    // дым поражения или искры победы
    for (let i = 0; i < (won ? 40 : 26); i++) {
      if (won) {
        const x = rng.int(0, W), y = rng.int(H * 0.35, H * 0.95), r = rng.int(1, 2);
        ctx.fillStyle = 'rgba(255,240,190,' + (rng.int(20, 70) / 100).toFixed(2) + ')';
        ctx.fillRect(x, y, r, r);
      } else {
        const x = W / 2 + rng.int(-70, 70), y = H * 0.9 - rng.int(0, 70), r = rng.int(6, 22);
        ctx.fillStyle = 'rgba(60,54,50,' + (rng.int(10, 26) / 100).toFixed(2) + ')';
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      }
    }
    // вороньё над проигранным полем
    if (!won) {
      ctx.strokeStyle = 'rgba(20,16,14,0.75)'; ctx.lineWidth = 1;
      for (let i = 0; i < 7; i++) {
        const x = rng.int(30, W - 30), y = rng.int(20, 70), s = rng.int(3, 6);
        ctx.beginPath(); ctx.moveTo(x - s, y); ctx.quadraticCurveTo(x - s / 2, y - s / 2, x, y); ctx.quadraticCurveTo(x + s / 2, y - s / 2, x + s, y); ctx.stroke();
      }
    }

    // виньетка и рамка-паспарту
    const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.32, W / 2, H / 2, W * 0.62);
    v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(12,8,4,0.55)');
    ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(0,0,0,0.6)'; ctx.lineWidth = 2; ctx.strokeRect(1, 1, W - 2, H - 2);
    return canvas;
  }

  H3.Art = { finale, W, H };
})(typeof window !== 'undefined' ? window : globalThis);
