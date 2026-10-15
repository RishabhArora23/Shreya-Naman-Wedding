/* ==========================================================
   You normally don't need to edit this file.
   Settings (date, Google Sheet, music, map link) live in config.js
   ========================================================== */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- 1. Countdown ---------- */
(function countdown() {
  const target = new Date(WEDDING_DATE).getTime();
  const el = id => document.getElementById(id);
  const pad = n => String(n).padStart(2, "0");
  function tick() {
    const s = Math.max(0, Math.floor((target - Date.now()) / 1000));
    el("cd-days").textContent = pad(Math.floor(s / 86400));
    el("cd-hours").textContent = pad(Math.floor((s % 86400) / 3600));
    el("cd-mins").textContent = pad(Math.floor((s % 3600) / 60));
    el("cd-secs").textContent = pad(s % 60);
  }
  tick();
  setInterval(tick, 1000);
})();

/* ---------- 2. Map link ---------- */
document.getElementById("maps-link").href = MAPS_LINK;

/* ---------- 3. Reveal-on-scroll animation ---------- */
(function reveal() {
  const panels = [...document.querySelectorAll(".panel")];
  panels.forEach(p => {
    [...p.querySelectorAll(".t, .f:not(.link)")].forEach((el, i) => el.style.setProperty("--i", i));
  });
  panels[0].classList.add("in");
  if (!("IntersectionObserver" in window)) { panels.forEach(p => p.classList.add("in")); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.18 });
  panels.slice(1).forEach(p => io.observe(p));
})();

/* ---------- 4. Falling petals ---------- */
const petals = (function () {
  const cv = document.getElementById("petals");
  const ctx = cv.getContext("2d");
  const colors = ["#f4b9ad", "#f7d6c0", "#fbe7d3", "#ee9d8a", "#f3c27a"];
  let W, H, list = [], running = false, burstUntil = 0;
  function size() { const d = Math.min(2, devicePixelRatio || 1); W = cv.width = innerWidth * d; H = cv.height = innerHeight * d; cv.style.width = innerWidth + "px"; cv.style.height = innerHeight + "px"; }
  function petal(burst) {
    const d = Math.min(2, devicePixelRatio || 1);
    return {
      x: burst ? W / 2 + (Math.random() - .5) * W * .3 : Math.random() * W,
      y: burst ? H * .75 : -20 * d,
      r: (5 + Math.random() * 6) * d,
      vx: burst ? (Math.random() - .5) * 9 * d : (Math.random() - .5) * .6 * d,
      vy: burst ? -(6 + Math.random() * 8) * d : (.6 + Math.random() * .9) * d,
      rot: Math.random() * 6.28, vr: (Math.random() - .5) * .06,
      sway: Math.random() * 6.28, c: colors[Math.floor(Math.random() * colors.length)],
    };
  }
  function frame(t) {
    ctx.clearRect(0, 0, W, H);
    const target = t < burstUntil ? 0 : 14;
    if (list.length < target && Math.random() < .04) list.push(petal(false));
    list = list.filter(p => p.y < H + 30);
    for (const p of list) {
      p.sway += .02; p.x += p.vx + Math.sin(p.sway) * .5; p.y += p.vy; p.rot += p.vr;
      if (p.vy < 1.6) p.vy += .18;
      p.vx *= .99;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.fillStyle = p.c; ctx.globalAlpha = .85;
      ctx.beginPath(); ctx.ellipse(0, 0, p.r, p.r * .55, 0, 0, 6.283); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.beginPath(); ctx.ellipse(-p.r * .25, -p.r * .1, p.r * .4, p.r * .18, 0, 0, 6.283); ctx.fill();
      ctx.restore();
    }
    requestAnimationFrame(frame);
  }
  return {
    start(burst) {
      if (reduceMotion) return;
      size(); addEventListener("resize", size);
      if (burst) { for (let i = 0; i < 70; i++) list.push(petal(true)); burstUntil = performance.now() + 2500; }
      if (!running) { running = true; requestAnimationFrame(frame); }
    },
  };
})();

/* ---------- 5. Music ---------- */
const music = (function () {
  const audio = document.getElementById("bgm");
  const btn = document.getElementById("music-btn");
  if (!MUSIC_FILE) return { play() {} };
  audio.src = MUSIC_FILE;
  audio.volume = 0;
  let broken = false;
  audio.addEventListener("error", () => { broken = true; btn.hidden = true; });
  const setUi = () => btn.classList.toggle("playing", !audio.paused);
  audio.addEventListener("play", setUi); audio.addEventListener("pause", setUi);
  function fadeIn() {
    let v = 0; const id = setInterval(() => { v = Math.min(.6, v + .03); audio.volume = v; if (v >= .6) clearInterval(id); }, 120);
  }
  btn.addEventListener("click", () => {
    if (audio.paused) { audio.play().catch(() => {}); fadeIn(); } else audio.pause();
  });
  return {
    play() {
      audio.play().then(() => { btn.hidden = false; fadeIn(); }).catch(() => { if (!broken) btn.hidden = false; });
    },
  };
})();

/* ---------- 6. "Tap to open" ---------- */
(function opener() {
  const box = document.getElementById("opener");
  document.getElementById("open-btn").addEventListener("click", () => {
    music.play();
    box.classList.add("opening");
    petals.start(true);
    setTimeout(() => {
      document.body.classList.remove("locked");
      document.body.classList.add("opened");
      box.remove();
      const second = document.querySelectorAll(".panel")[1];
      setTimeout(() => second.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }), 650);
    }, 900);
  });
})();

/* ---------- 7. Forms → Google Sheet ---------- */
(function forms() {
  async function send(form, data, okText) {
    const msg = form.querySelector(".form-msg");
    const btn = form.querySelector("button");
    if (!SHEET_URL) { msg.textContent = "Not connected yet (add SHEET_URL in config.js)."; return; }
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

  const rsvp = document.getElementById("rsvp-form");
  rsvp.addEventListener("submit", e => {
    e.preventDefault();
    const f = rsvp.elements;
    send(rsvp, {
      form: "RSVP", name: f.name.value, email: f.email.value, phone: "+91 " + f.phone.value,
      attending: f.attending.value, guests: f.guests.value,
    }, "Thank you! Your RSVP has been received.");
  });

  const note = document.getElementById("note-form");
  note.addEventListener("submit", e => {
    e.preventDefault();
    const f = note.elements;
    send(note, { form: "Note", name: f.from.value, note: f.note.value }, "Your note has been sent with love ♥");
  });
})();
