# Shreya & Naman – Wedding Invitation Website

A one-page scrolling invitation (12 pages) that opens with a "Tap to open" wax seal,
plays music, and reveals each page as you scroll. Clickable: the seal, the Wardrobe Planner cards (each opens
that event's look), the RSVP form (with a note for the couple) and the location button (Google Maps).

## What's in the folder

| File / folder | What it is | Edit it? |
|---|---|---|
| `index.html` | All the text on every page | ✅ yes – names, dates, venues, wording |
| `config.js` | Countdown date, Google Form link, song file, map link | ✅ yes |
| `style.css` | Fonts, colours (colours are at the top) | optional |
| `script.js` | Countdown + sending the forms | no |
| `images/p1.jpg … p14.jpg` | The painted background of each page (text-free) | only to replace artwork |
| `fonts/` | The fonts (Italianno, Cormorant Garamond, Tiro Devanagari Hindi) | no |
| `music/` | Put `din-shagna-da.mp3` here for the background song | ✅ add your mp3 |
| `wardrobe/` | Wardrobe Planner pages (cover, mehndi, engagement, haldi, wedding, after-party) + card thumbnails | replace with same names |
| `wardrobe-planner.pdf` | The full PDF ("Download PDF" in the viewer) | replace with same name |

### How the pages work
Each page is a high-resolution painted background (`images/p1.jpg` = page 1, etc.)
with the text placed on top. In `index.html` each line looks like:

```html
<p class="t script sg" style="--y:177; --fs:32">Shreya Arora</p>
```
Change the words between `>` and `<`. `--y` is how far down the line sits and
`--fs` is the text size – if new text is longer and doesn't fit, lower `--fs` a little.

---

## Part 1 – Put the site on GitHub (free hosting)

1. Go to **github.com** and sign in (or create a free account).
2. Click **+** (top right) → **New repository**.
   - Name: e.g. `shreya-naman` (this becomes part of the link)
   - Set it to **Public**, then **Create repository**.
3. On the new repo page click **"uploading an existing file"**.
4. Drag in **everything in this folder** – all the files **plus the `images` and `fonts`
   folders** (drag the folders themselves so their files stay inside them).
5. Click **Commit changes**.
6. Go to **Settings → Pages** (left menu).
   - Source: **Deploy from a branch**
   - Branch: **main**, folder **/ (root)** → **Save**.
7. Wait 1–2 minutes and refresh. Your link appears at the top:
   `https://YOUR-USERNAME.github.io/shreya-naman/`

## Part 2 – Receive RSVPs with a Google Form (recommended)

The RSVP form on the website quietly sends each answer into a Google Form you own.
You see every response in Google Forms (and in a Google Sheet if you like).

1. Go to **forms.google.com** → **Blank form**. Name it e.g. "Shreya & Naman RSVP".
2. Add **4 questions**, all of type **Short answer** (the 4th can be **Paragraph**):
   `Name`, `Attending`, `Guests`, `Note`. Leave them **not required**.
3. **Settings** tab → **Responses**: make sure *Collect email addresses* is **Off**
   and *Limit to 1 response* is **Off** (these force a Google sign-in and block the website).
4. Back in the form, click **⋮** (top right) → **Get pre-filled link**.
   In the 4 boxes type exactly: **NAME**, **ATTENDING**, **GUESTS**, **NOTE** →
   **Get link** → **Copy link**.
5. Open `config.js` and paste it:
   `const GOOGLE_FORM_LINK = "https://docs.google.com/forms/d/e/…/viewform?usp=pp_url&entry…";`
6. Push to GitHub, open the live site, submit a test RSVP → it appears under the form's
   **Responses** tab. Click **Link to Sheets** there to also get a spreadsheet.

## Part 3 – Editing later

- **Text:** on GitHub open `index.html` → ✏️ → find the page (search for
  `PAGE 6`, etc.) → change the words → **Commit changes**. The live site
  updates within a minute or two.
- **Countdown date:** `config.js` → `WEDDING_DATE`.
- **Guest numbers:** in `index.html`, the `<option>` lines.
- **Artwork:** upload a new picture with the **same name** into `images/` (it replaces the old one).
- **Text colours:** top of `style.css` (`--script-green`, `--teal`, `--brown` …).
