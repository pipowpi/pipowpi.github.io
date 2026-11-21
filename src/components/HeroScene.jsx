import { useEffect, useRef } from 'react';

// A small isometric grid of runner nodes that pull jobs from a queue floating above them.
// Grey dots are requests going up; amber dots are jobs coming down to a runner.
export function HeroScene({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c || !c.getContext) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const s = { mx: 0, my: 0, smx: 0, smy: 0, pulses: [], flash: {}, lastSpawn: 0, raf: null, colors: null, t0: performance.now() };

    const readColors = () => {
      const cs = getComputedStyle(c);
      const g = (n, d) => cs.getPropertyValue(n).trim() || d;
      return { job: g('--accent', '#FFB224'), queue: g('--ink', '#F2ECDF'), ink: g('--lead', '#A89F8E'), request: g('--queue', '#8D8575'), line: g('--rule-strong', '#3B342B') };
    };

    function draw(now, moving) {
      const dpr = window.devicePixelRatio || 1;
      const w = c.clientWidth;
      const h = c.clientHeight;
      if (!w || !h) return;
      if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) {
        c.width = Math.round(w * dpr);
        c.height = Math.round(h * dpr);
      }
      const ctx = c.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      if (!s.colors) s.colors = readColors();
      const col = s.colors;
      const t = (now - s.t0) / 1000;

      s.smx += (s.mx - s.smx) * 0.06;
      s.smy += (s.my - s.smy) * 0.06;
      const yaw = t * 0.12 + 0.7 + s.smx * 0.9;
      const pitch = 0.42 + s.smy * 0.3;
      const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      const base = Math.min(w * 0.9, h) * 1.25;
      const proj = (x, y, z) => {
        const x1 = x * cy - z * sy;
        const z1 = x * sy + z * cy;
        const y1 = y * cp - z1 * sp;
        const z2 = y * sp + z1 * cp;
        const sc = base / (z2 + 7.5);
        return { x: w / 2 + x1 * sc, y: h * 0.64 - y1 * sc, s: sc, z: z2 };
      };

      const N = 5;
      const nodes = [];
      for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) nodes.push({ x: (i - (N - 1) / 2), y: 0, z: (j - (N - 1) / 2), i, j });
      const q = proj(0, 2.7, 0);
      const P = nodes.map((n) => proj(n.x, n.y, n.z));

      ctx.lineWidth = 1;
      ctx.strokeStyle = col.line;
      nodes.forEach((n, a) => {
        if (n.i < N - 1) { ctx.beginPath(); ctx.moveTo(P[a].x, P[a].y); ctx.lineTo(P[a + N].x, P[a + N].y); ctx.stroke(); }
        if (n.j < N - 1) { ctx.beginPath(); ctx.moveTo(P[a].x, P[a].y); ctx.lineTo(P[a + 1].x, P[a + 1].y); ctx.stroke(); }
      });

      if (moving) {
        if (t - s.lastSpawn > 0.45) {
          s.lastSpawn = t;
          s.pulses.push({ k: Math.floor(Math.random() * nodes.length), start: t, dir: 'up' });
        }
      } else {
        s.pulses = [{ k: 3, start: t - 0.5, dir: 'up' }, { k: 17, start: t - 0.3, dir: 'down' }, { k: 21, start: t - 0.7, dir: 'down' }, { k: 9, start: t - 0.2, dir: 'up' }];
      }

      const dur = 1.1;
      const keep = [];
      s.pulses.forEach((p) => {
        const u = (t - p.start) / dur;
        if (u >= 1) {
          if (p.dir === 'up') keep.push({ k: p.k, start: t, dir: 'down' });
          else s.flash[p.k] = t;
          return;
        }
        keep.push(p);
        const from = p.dir === 'up' ? P[p.k] : q;
        const to = p.dir === 'up' ? q : P[p.k];
        const e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
        ctx.strokeStyle = p.dir === 'up' ? col.request : col.job;
        ctx.globalAlpha = 0.18;
        ctx.beginPath(); ctx.moveTo(P[p.k].x, P[p.k].y); ctx.lineTo(q.x, q.y); ctx.stroke();
        ctx.globalAlpha = 1;
        const x = from.x + (to.x - from.x) * e;
        const y = from.y + (to.y - from.y) * e;
        ctx.beginPath();
        if (p.dir === 'down') {
          ctx.fillStyle = col.job;
          ctx.arc(x, y, 3.6, 0, Math.PI * 2);
        } else {
          ctx.fillStyle = col.request;
          ctx.arc(x, y, 2.4, 0, Math.PI * 2);
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      if (moving) s.pulses = keep;

      P.map((p, idx) => idx).sort((m, k2) => P[k2].z - P[m].z).forEach((idx) => {
        const p = P[idx];
        const size = p.s * 0.16;
        const f = s.flash[idx];
        const glow = f !== undefined && t - f < 0.9 ? 1 - (t - f) / 0.9 : 0;
        ctx.fillStyle = col.ink;
        ctx.globalAlpha = 0.7 + 0.3 * (1 - (p.z + 4) / 8);
        ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);
        if (glow > 0) {
          ctx.globalAlpha = glow;
          ctx.fillStyle = col.job;
          ctx.fillRect(p.x - size / 2 - 1, p.y - size / 2 - 1, size + 2, size + 2);
          ctx.shadowBlur = 0;
        }
        ctx.globalAlpha = 1;
      });

      const pulse = moving ? 0.5 + 0.5 * Math.sin(t * 3) : 0.6;
      ctx.strokeStyle = col.queue; ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.25 + 0.25 * pulse;
      ctx.beginPath(); ctx.arc(q.x, q.y, q.s * 0.42 + pulse * 6, 0, Math.PI * 2); ctx.stroke();
      ctx.globalAlpha = 1;
      const qs = q.s * 0.28;
      ctx.fillStyle = col.queue;
      ctx.fillRect(q.x - qs / 2, q.y - qs / 2, qs, qs);
      ctx.shadowBlur = 0;
      ctx.font = `500 13px ${getComputedStyle(c).fontFamily}`;
      ctx.fillStyle = col.queue;
      ctx.fillText('job queue', q.x + qs, q.y - qs);
    }

    const start = () => {
      if (s.raf) return;
      const frame = (now) => { draw(now, true); s.raf = requestAnimationFrame(frame); };
      s.raf = requestAnimationFrame(frame);
    };
    const stop = () => { if (s.raf) { cancelAnimationFrame(s.raf); s.raf = null; } };
    const drawOnce = () => { s.colors = null; draw(s.t0 + 4200, false); };

    const host = c.parentElement;
    const move = (e) => {
      const r = host.getBoundingClientRect();
      s.mx = (e.clientX - r.left) / r.width - 0.5;
      s.my = (e.clientY - r.top) / r.height - 0.5;
    };
    const leave = () => { s.mx = 0; s.my = 0; };
    const motionOff = () => document.documentElement.getAttribute('data-motion') === 'off';
    let visible = false;
    const onTheme = () => { s.colors = null; if (reduce || motionOff()) drawOnce(); };
    // The pause button in the hero stops the scene where it is; play resumes it if it is on screen.
    const onMotion = () => { if (motionOff()) stop(); else if (visible) start(); };
    host.addEventListener('pointermove', move);
    host.addEventListener('pointerleave', leave);
    window.addEventListener('themechange', onTheme);
    window.addEventListener('motionchange', onMotion);

    let io = null;
    if (reduce) {
      drawOnce();
      window.addEventListener('resize', drawOnce);
    } else if ('IntersectionObserver' in window) {
      if (motionOff()) drawOnce();
      io = new IntersectionObserver((entries) => entries.forEach((en) => {
        visible = en.isIntersecting;
        if (visible && !motionOff()) start(); else stop();
      }));
      io.observe(c);
    } else if (!motionOff()) {
      start();
    } else {
      drawOnce();
    }
    return () => {
      stop();
      if (io) io.disconnect();
      host.removeEventListener('pointermove', move);
      host.removeEventListener('pointerleave', leave);
      window.removeEventListener('themechange', onTheme);
      window.removeEventListener('motionchange', onMotion);
      window.removeEventListener('resize', drawOnce);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
