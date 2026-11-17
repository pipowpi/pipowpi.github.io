/* Gopi Krishna Kanugula, portfolio scripts. No dependencies. */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = false;
  try { reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  /* ---------- theme toggle (dark is the default) ---------- */
  function currentTheme() { return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark'; }
  function labelToggle(btn) {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    btn.setAttribute('aria-label', 'Switch to ' + next + ' mode');
    btn.setAttribute('title', 'Switch to ' + next + ' mode');
  }
  var toggle = document.querySelector('[data-theme-toggle]');
  if (toggle) {
    labelToggle(toggle);
    toggle.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('gkk-theme', next); } catch (e) {}
      labelToggle(toggle);
      if (scene) { scene.colors = null; if (reduceMotion) { scene.drawOnce(); } }
    });
  }

  /* ---------- spotlight + tilt on tiles ---------- */
  var finePointer = true;
  try { finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches; } catch (e) {}
  if (finePointer) {
    document.querySelectorAll('.tile').forEach(function (el) {
      var tilt = !el.hasAttribute('data-no-tilt') && !reduceMotion;
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var x = e.clientX - r.left, y = e.clientY - r.top;
        el.style.setProperty('--mx', x + 'px');
        el.style.setProperty('--my', y + 'px');
        if (tilt) {
          el.style.setProperty('--ry', (((x / r.width) - 0.5) * 4).toFixed(2) + 'deg');
          el.style.setProperty('--rx', (((y / r.height) - 0.5) * -4).toFixed(2) + 'deg');
        }
      });
      el.addEventListener('pointerleave', function () {
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* ---------- count-up numbers ---------- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && !reduceMotion && 'IntersectionObserver' in window) {
    var countIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        countIO.unobserve(entry.target);
        var el = entry.target, target = parseFloat(el.getAttribute('data-count')) || 0;
        var start = performance.now(), dur = 1300;
        (function step(now) {
          var k = Math.min(1, (now - start) / dur), e = 1 - Math.pow(1 - k, 3);
          el.textContent = String(Math.round(target * e));
          if (k < 1) { requestAnimationFrame(step); }
        })(start);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { el.textContent = '0'; countIO.observe(el); });
  }

  /* ---------- writing filter ---------- */
  var chips = document.querySelectorAll('[data-filter]');
  if (chips.length) {
    var cards = document.querySelectorAll('[data-tags]');
    var empty = document.querySelector('[data-empty]');
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var f = chip.getAttribute('data-filter');
        chips.forEach(function (c) { c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'); });
        var shown = 0;
        cards.forEach(function (card) {
          var tags = card.getAttribute('data-tags').split('|');
          var show = f === 'All' || tags.indexOf(f) >= 0;
          card.hidden = !show;
          if (show) { shown++; }
        });
        if (empty) { empty.hidden = shown > 0; }
      });
    });
  }

  /* ---------- hero scene: runners pulling jobs from a queue ---------- */
  var scene = null;
  var canvas = document.getElementById('hero3d');
  if (canvas && canvas.getContext) {
    scene = makeScene(canvas);
    var host = canvas.parentElement;
    host.addEventListener('pointermove', function (e) {
      var r = host.getBoundingClientRect();
      scene.mx = (e.clientX - r.left) / r.width - 0.5;
      scene.my = (e.clientY - r.top) / r.height - 0.5;
    });
    host.addEventListener('pointerleave', function () { scene.mx = 0; scene.my = 0; });
    if (reduceMotion) {
      scene.drawOnce();
      window.addEventListener('resize', function () { scene.drawOnce(); });
    } else if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { scene.start(); } else { scene.stop(); } });
      }).observe(canvas);
    } else {
      scene.start();
    }
  }

  function makeScene(c) {
    var s = { mx: 0, my: 0, smx: 0, smy: 0, pulses: [], flash: {}, lastSpawn: 0, raf: null, colors: null, t0: performance.now() };

    function readColors() {
      var cs = getComputedStyle(c);
      var g = function (n, d) { var v = cs.getPropertyValue(n).trim(); return v || d; };
      return { accent: g('--accent', '#9AA8FF'), ink: g('--ink', '#ECEEF1'), faint: g('--faint', '#8A909B'), line: g('--line-strong', '#2F343C') };
    }

    function draw(now, moving) {
      var dpr = window.devicePixelRatio || 1;
      var w = c.clientWidth, h = c.clientHeight;
      if (!w || !h) { return; }
      if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) {
        c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
      }
      var ctx = c.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      if (!s.colors) { s.colors = readColors(); }
      var col = s.colors;
      var t = (now - s.t0) / 1000;

      s.smx += (s.mx - s.smx) * 0.06;
      s.smy += (s.my - s.smy) * 0.06;
      var yaw = t * 0.12 + 0.7 + s.smx * 0.9;
      var pitch = 0.42 + s.smy * 0.3;
      var cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      var base = Math.min(w * 0.9, h) * 1.25;
      function proj(x, y, z) {
        var x1 = x * cy - z * sy, z1 = x * sy + z * cy;
        var y1 = y * cp - z1 * sp, z2 = y * sp + z1 * cp;
        var sc = base / (z2 + 7.5);
        return { x: w / 2 + x1 * sc, y: h * 0.64 - y1 * sc, s: sc, z: z2 };
      }

      var N = 5, gap = 1.0, nodes = [], i, j;
      for (i = 0; i < N; i++) { for (j = 0; j < N; j++) {
        nodes.push({ x: (i - (N - 1) / 2) * gap, y: 0, z: (j - (N - 1) / 2) * gap, i: i, j: j });
      } }
      var q = proj(0, 2.7, 0);
      var P = nodes.map(function (n) { return proj(n.x, n.y, n.z); });

      ctx.lineWidth = 1;
      ctx.strokeStyle = col.line;
      for (var a = 0; a < nodes.length; a++) {
        var n = nodes[a];
        if (n.i < N - 1) { ctx.beginPath(); ctx.moveTo(P[a].x, P[a].y); ctx.lineTo(P[a + N].x, P[a + N].y); ctx.stroke(); }
        if (n.j < N - 1) { ctx.beginPath(); ctx.moveTo(P[a].x, P[a].y); ctx.lineTo(P[a + 1].x, P[a + 1].y); ctx.stroke(); }
      }

      if (moving) {
        if (t - s.lastSpawn > 0.45) {
          s.lastSpawn = t;
          s.pulses.push({ k: Math.floor(Math.random() * nodes.length), start: t, dir: 'up' });
        }
      } else {
        s.pulses = [{ k: 3, start: t - 0.5, dir: 'up' }, { k: 17, start: t - 0.3, dir: 'down' }, { k: 21, start: t - 0.7, dir: 'down' }, { k: 9, start: t - 0.2, dir: 'up' }];
      }

      var dur = 1.1, keep = [];
      s.pulses.forEach(function (p) {
        var u = (t - p.start) / dur;
        if (u >= 1) {
          if (p.dir === 'up') { keep.push({ k: p.k, start: t, dir: 'down' }); } else { s.flash[p.k] = t; }
          return;
        }
        keep.push(p);
        var from = p.dir === 'up' ? P[p.k] : q, to = p.dir === 'up' ? q : P[p.k];
        var e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
        ctx.strokeStyle = p.dir === 'up' ? col.faint : col.accent;
        ctx.globalAlpha = 0.18;
        ctx.beginPath(); ctx.moveTo(P[p.k].x, P[p.k].y); ctx.lineTo(q.x, q.y); ctx.stroke();
        ctx.globalAlpha = 1;
        var x = from.x + (to.x - from.x) * e, y = from.y + (to.y - from.y) * e;
        ctx.beginPath();
        if (p.dir === 'down') {
          ctx.fillStyle = col.accent; ctx.shadowColor = col.accent; ctx.shadowBlur = 14;
          ctx.arc(x, y, 3.6, 0, Math.PI * 2);
        } else {
          ctx.fillStyle = col.faint; ctx.shadowBlur = 0;
          ctx.arc(x, y, 2.4, 0, Math.PI * 2);
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      if (moving) { s.pulses = keep; }

      P.map(function (p, idx) { return idx; })
        .sort(function (m, k2) { return P[k2].z - P[m].z; })
        .forEach(function (idx) {
          var p = P[idx], size = p.s * 0.16, f = s.flash[idx];
          var glow = (f !== undefined && t - f < 0.9) ? 1 - (t - f) / 0.9 : 0;
          ctx.fillStyle = col.ink;
          ctx.globalAlpha = 0.55 + 0.35 * (1 - (p.z + 4) / 8);
          ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);
          if (glow > 0) {
            ctx.globalAlpha = glow;
            ctx.fillStyle = col.accent; ctx.shadowColor = col.accent; ctx.shadowBlur = 18 * glow;
            ctx.fillRect(p.x - size / 2 - 1, p.y - size / 2 - 1, size + 2, size + 2);
            ctx.shadowBlur = 0;
          }
          ctx.globalAlpha = 1;
        });

      var pulse = moving ? 0.5 + 0.5 * Math.sin(t * 3) : 0.6;
      ctx.strokeStyle = col.accent; ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.25 + 0.25 * pulse;
      ctx.beginPath(); ctx.arc(q.x, q.y, q.s * 0.42 + pulse * 6, 0, Math.PI * 2); ctx.stroke();
      ctx.globalAlpha = 1;
      var qs = q.s * 0.28;
      ctx.fillStyle = col.accent; ctx.shadowColor = col.accent; ctx.shadowBlur = 20;
      ctx.fillRect(q.x - qs / 2, q.y - qs / 2, qs, qs);
      ctx.shadowBlur = 0;
      ctx.font = "500 11px 'Geist Mono', ui-monospace, monospace";
      ctx.fillStyle = col.faint;
      ctx.fillText('job queue', q.x + qs, q.y - qs);
    }

    s.start = function () {
      if (s.raf) { return; }
      var frame = function (now) { draw(now, true); s.raf = requestAnimationFrame(frame); };
      s.raf = requestAnimationFrame(frame);
    };
    s.stop = function () { if (s.raf) { cancelAnimationFrame(s.raf); s.raf = null; } };
    s.drawOnce = function () { s.colors = null; draw(s.t0 + 4200, false); };
    return s;
  }
})();
