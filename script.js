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

/* ---------- 2. Forms → Google Sheet ---------- */
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
