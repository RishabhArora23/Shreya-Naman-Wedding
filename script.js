/* ==========================================================
   You normally don't need to edit this file.
   Settings (date + Google Sheet link) live in config.js
   ========================================================== */

/* ---------- 1. Countdown ---------- */
(function countdown() {
  const target = new Date(WEDDING_DATE).getTime();
  const el = id => document.getElementById(id);
  const pad = n => String(n).padStart(2, "0");
  function tick() {
    let s = Math.max(0, Math.floor((target - Date.now()) / 1000));
    el("cd-days").textContent = pad(Math.floor(s / 86400));
    el("cd-hours").textContent = pad(Math.floor((s % 86400) / 3600));
    el("cd-mins").textContent = pad(Math.floor((s % 3600) / 60));
    el("cd-secs").textContent = pad(s % 60);
  }
  tick();
  setInterval(tick, 1000);
})();

/* ---------- 2. Painted-style flowers drawn around each page ---------- */
(function flora() {
  const NS = "http://www.w3.org/2000/svg";
  const PAL = {
    cream:    { fl: ["#f4b9ad", "#f7d6c0", "#fdf3e4", "#ee9d8a", "#f9e1c4", "#e98a7c"], c: "#e0a83c", lf: ["#55703a", "#6d8a45", "#3f5a2e", "#879e55"] },
    green:    { fl: ["#f3c9a8", "#f8e6cc", "#eaa98f", "#f0bf7a"], c: "#d9a441", lf: ["#2f5f36", "#4d7a3e", "#6c8f47", "#3c6a3a"] },
    marigold: { fl: ["#f5a623", "#f08a1c", "#f7c948", "#ec7a1a", "#fbd36a"], c: "#b5541b", lf: ["#55703a", "#6d8a45", "#3f5a2e"] },
  };
  const mk = (tag, a) => { const e = document.createElementNS(NS, tag); for (const k in a) e.setAttribute(k, a[k]); return e; };
  const rnd = seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  function leaf(g, x, y, len, ang, col) {
    const p = mk("path", {
      d: `M0 0Q${len * .5} ${-len * .3} ${len} 0Q${len * .5} ${len * .3} 0 0M0 0L${len * .9} 0`,
      fill: col, stroke: "rgba(0,0,0,.15)", "stroke-width": .6,
      transform: `translate(${x} ${y}) rotate(${ang})`,
    });
    g.appendChild(p);
  }
  function flower(g, x, y, r, col, center, n, rot) {
    const f = mk("g", { transform: `translate(${x} ${y}) rotate(${rot})` });
    for (let i = 0; i < n; i++) {
      f.appendChild(mk("ellipse", { cx: r * .55, cy: 0, rx: r * .52, ry: r * .3, fill: col, stroke: "rgba(120,60,40,.25)", "stroke-width": .6, transform: `rotate(${(360 / n) * i})` }));
    }
    for (let i = 0; i < n; i++) {
      f.appendChild(mk("ellipse", { cx: r * .32, cy: 0, rx: r * .28, ry: r * .15, fill: "rgba(255,255,255,.35)", transform: `rotate(${(360 / n) * i + 180 / n})` }));
    }
    f.appendChild(mk("circle", { r: r * .24, fill: center }));
    f.appendChild(mk("circle", { r: r * .12, fill: "rgba(120,60,10,.45)" }));
    g.appendChild(f);
  }
  function cluster(g, x, y, spread, count, pal, R, scale) {
    for (let i = 0; i < count * 1.8; i++) {
      const a = R() * 360, d = R() * spread;
      leaf(g, x + Math.cos(a) * d * .8, y + Math.sin(a) * d * .8, (10 + R() * 14) * scale, R() * 360, pal.lf[Math.floor(R() * pal.lf.length)]);
    }
    for (let i = 0; i < count; i++) {
      const a = R() * Math.PI * 2, d = Math.sqrt(R()) * spread;
      flower(g, x + Math.cos(a) * d, y + Math.sin(a) * d, (6 + R() * 11) * scale,
        pal.fl[Math.floor(R() * pal.fl.length)], pal.c, 5 + Math.floor(R() * 4), R() * 90);
    }
  }

  function draw(panel, idx) {
    panel.querySelector(":scope > .flora")?.remove();
    const w = panel.clientWidth, h = panel.clientHeight;
    const type = panel.dataset.flora;
    const isGreen = panel.classList.contains("green");
    const pal = type === "marigold" ? PAL.marigold : isGreen ? PAL.green : PAL.cream;
    const s = Math.min(1.25, w / 380);
    const svg = mk("svg", { class: "flora", viewBox: `0 0 ${w} ${h}`, "aria-hidden": "true" });
    const g = mk("g", {});
    svg.appendChild(g);
    const R = rnd(1234 + idx * 97);

    const corners = () => { cluster(g, 0, 0, w * .24, 20, pal, R, s * 1.15); cluster(g, w, 0, w * .24, 20, pal, R, s * 1.15); };
    const bottom = () => { for (let x = 0; x <= w; x += w / 5) cluster(g, x, h + 4, w * .13, 10, pal, R, s * 1.1); };
    const sides = (step = 110) => {
      for (let y = 0; y <= h; y += step) {
        cluster(g, -4, y, 26 * s, 3, pal, R, s * .8);
        cluster(g, w + 4, y + step / 2, 26 * s, 3, pal, R, s * .8);
      }
      // little gold sparkles
      for (let i = 0; i < 40; i++) g.appendChild(mk("circle", { cx: R() * w, cy: R() * h, r: .6 + R() * 1.2, fill: "#e8c77d", opacity: .35 + R() * .4 }));
    };

    if (type === "top") corners();
    if (type === "bottom") bottom();
    if (type === "full") { corners(); bottom(); }
    if (type === "sides") { sides(); cluster(g, 0, 0, w * .16, 8, pal, R, s); cluster(g, w, 0, w * .16, 8, pal, R, s); }
    if (type === "marigold") {
      corners();
      // hanging marigold strings down both sides
      for (const x of [10 * s, w - 10 * s]) for (let y = 0; y < h * .75; y += 15 * s)
        flower(g, x + (R() - .5) * 6, y, (8 + R() * 3) * s, pal.fl[Math.floor(R() * pal.fl.length)], pal.c, 8, R() * 90);
      bottom();
    }
    panel.prepend(svg);
  }

  const panels = [...document.querySelectorAll(".panel[data-flora]")];
  const drawAll = () => panels.forEach(draw);
  drawAll();
  let t; window.addEventListener("resize", () => { clearTimeout(t); t = setTimeout(drawAll, 200); });
  document.fonts?.ready.then(drawAll);
})();

/* ---------- 3. Forms → Google Sheet ---------- */
(function forms() {
  const rsvp = document.getElementById("rsvp-form");
  const guestName = () => rsvp.elements.name.value.trim();

  async function send(form, data, okText) {
    const msg = form.querySelector(".form-msg");
    const btn = form.querySelector("button");
    if (!SHEET_URL) { msg.textContent = "RSVP is not connected yet (add SHEET_URL in config.js)."; return; }
    btn.disabled = true; msg.textContent = "Sending…";
    try {
      await fetch(SHEET_URL, { method: "POST", mode: "no-cors", body: new URLSearchParams(data) });
      msg.textContent = okText;
      form.reset();
    } catch (e) {
      msg.textContent = "Something went wrong — please try again.";
    }
    btn.disabled = false;
  }

  rsvp.addEventListener("submit", e => {
    e.preventDefault();
    const f = rsvp;
    send(f, {
      form: "RSVP", name: f.elements.name.value, email: f.email.value, phone: "+91 " + f.phone.value,
      attending: f.attending.value, guests: f.guests.value,
    }, "Thank you! Your RSVP has been received.");
  });

  const ev = document.getElementById("events-form");
  ev.addEventListener("submit", e => {
    e.preventDefault();
    const chosen = [...ev.querySelectorAll("input[name=events]:checked")].map(i => i.value).join(", ");
    if (!chosen && !ev.cry.value) { ev.querySelector(".form-msg").textContent = "Please choose at least one event or a guess."; return; }
    send(ev, { form: "Events & Guess", name: guestName(), events: chosen, cry: ev.cry.value }, "Got it — thank you!");
  });

  const note = document.getElementById("note-form");
  note.addEventListener("submit", e => {
    e.preventDefault();
    send(note, { form: "Note", name: guestName(), note: note.note.value }, "Your note has been sent with love ♥");
  });
})();
