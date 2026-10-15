# Shreya & Naman – Wedding Invitation Website

A one-page scrolling invitation (14 pages). Only the RSVP forms are interactive;
every other button is decoration. Responses land in a Google Sheet you own.

## What's in the folder

| File | What it is | Edit it? |
|---|---|---|
| `index.html` | All the text on every page | ✅ yes – names, dates, venues, wording |
| `config.js` | Countdown date + Google Sheet link | ✅ yes |
| `style.css` | Colours, fonts, sizes (colours are at the top) | optional |
| `script.js` | Countdown, flowers, form sending | no |
| `images/` | Illustrations (lake, cocktails, haldi bowls, outfits…) | swap for higher-res versions if you like, same file names |
| `google-apps-script.gs` | Code for the Google Sheet (Part 2) | only `NOTIFY_EMAIL` |

---

## Part 1 – Put the site on GitHub (free hosting)

1. Go to **github.com** and sign in (or create a free account).
2. Click **+** (top right) → **New repository**.
   - Name: e.g. `shreya-naman` (this becomes part of the link)
   - Set it to **Public**, then **Create repository**.
3. On the new repo page click **"uploading an existing file"**.
4. Drag in **everything in this folder** – `index.html`, `style.css`, `script.js`,
   `config.js`, `README.md`, `google-apps-script.gs` **and the `images` folder**
   (drag the folder itself so the images stay inside `images/`).
5. Click **Commit changes**.
6. Go to **Settings → Pages** (left menu).
   - Source: **Deploy from a branch**
   - Branch: **main**, folder **/ (root)** → **Save**.
7. Wait 1–2 minutes and refresh. Your link appears at the top:
   `https://YOUR-USERNAME.github.io/shreya-naman/`

## Part 2 – Receive the RSVPs in a Google Sheet

1. Go to **sheets.google.com** → create a blank sheet (name it "Wedding RSVPs").
2. **Extensions → Apps Script**. Delete what's there, paste the whole of
   `google-apps-script.gs`, click 💾 Save.
   (Optional: put your email in `NOTIFY_EMAIL` to get an email per response.)
3. Click **Deploy → New deployment** → gear icon ⚙ → **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
   - **Deploy** → approve the permissions (choose your account → *Advanced* →
     *Go to … (unsafe)* → *Allow*; this is normal for your own script).
4. Copy the **Web app URL** (ends in `/exec`).
5. On GitHub open `config.js` → ✏️ pencil icon → paste the URL between the quotes:
   `const SHEET_URL = "https://script.google.com/macros/s/.../exec";`
   → **Commit changes**.
6. Open your site, submit a test RSVP – a new row appears in the
   **Responses** tab of your sheet. Delete the test row afterwards.

> If you change the Apps Script later, use **Deploy → Manage deployments → ✏️ → Version: New version**
> so the same URL keeps working.

## Part 3 – Editing later

- **Text:** on GitHub open `index.html` → ✏️ → find the page (search for
  `PAGE 6`, etc.) → change the words → **Commit changes**. The live site
  updates within a minute or two.
- **Countdown date:** `config.js` → `WEDDING_DATE`.
- **Who-will-cry options / guest numbers:** in `index.html`, the `<option>` lines.
- **Images:** upload a new file with the **same name** into `images/` (it replaces the old one).
- **Colours:** top of `style.css` (`--green`, `--gold`, `--cream` …).

### Making a decorative button work later (optional)
The "View details" / "Click to view the location" pills are plain `<span>` tags so
nothing is clickable. To turn the location one into a Google Maps link, change
`<span class="pill green-pill">…</span>` to
`<a class="pill green-pill" href="https://maps.google.com/?q=Namaste+Corbett+Resort" target="_blank">…</a>`.
# Shreya-naman-wedding
