# Pelai Collective — Social Styles Self-Assessment

An online version of the "Self-Assessment of Social Styles" questionnaire (the source PDF is kept privately by
Pelai Collective, not in this repository).

Live at **https://assessments.pelaicollective.com/social_styles/**, served by GitHub Pages from the `main` branch.

## Repository layout

| Path | What it is |
|---|---|
| `social_styles/` | The site: `index.html`, `styles.css`, `config.js`, `content.js`, `app.js`, `assets/`. Static files, no build step. |
| `index.html` | Redirects the bare domain to `social_styles/`. |
| `CNAME` | The custom domain for GitHub Pages. |
| `.nojekyll` | Tells GitHub Pages to serve the files as they are. |
| `apps-script/` | Google Apps Script that saves reports to Drive and emails them (not served by Pages). |

## Hosting on GitHub Pages

Once, in the repository on GitHub:

1. **Settings → Pages → Build and deployment**: Source **Deploy from a branch**, Branch **main**, folder **/ (root)**. Save.
2. In **Hostinger → Domains → pelaicollective.com → DNS**, add a record: type **CNAME**, name **assessments**,
   target **oliverjohnsimpson.github.io**.
3. Back in **Settings → Pages**, check that *Custom domain* shows `assessments.pelaicollective.com`
   (it is read from the `CNAME` file) and the DNS check passes. Then tick **Enforce HTTPS**.
   DNS changes can take from a few minutes to a few hours.

After that, every change merged into `main` goes live within a couple of minutes.
Set `saveEndpoint` in `social_styles/config.js` to the Apps Script Web app URL (see `apps-script/README.md`)
to turn on saving to Drive and the email option.

To add another assessment later, put it in its own folder next to `social_styles/`,
e.g. `assessments.pelaicollective.com/<name>/`.

## How it works

1. The participant enters their name (used only on the report).
2. **Section 1, Assertiveness:** 15 word pairs, shown in random order, scored 1 (left) to 4 (right).
3. **Section 2, Responsiveness:** 15 word pairs, shown in random order, scored 4 (left) to 1 (right), as printed.
   Every item in a section must be answered before moving on.
4. Scores: each section's total ÷ 15, shown to 3 decimal places, then plotted on the chart
   (Assertiveness left to right 1 → 4, Responsiveness top to bottom 1 → 4, quadrants split at 2.5).
5. The result shows only the participant's own style: description, summary, traits, style summary,
   backup style, interactions with the other styles, and the two scales.
6. **Download PDF report**: a 3-page A4 report. Each page is a flat image, so the text cannot be selected or copied.
7. **Email your report**: one email address, checked before the Send button turns on. The report is sent from
   ping@pelaicollective.com with a short summary of the profile in the email and the PDF attached. Up to 3 sends per report.

When the result appears, a copy of the report is sent automatically to Pelai Collective's Google Drive,
into the `reports` folder, inside a single folder for that day (IST), through the Apps Script in [`apps-script/`](apps-script/README.md).
Only the admin account can open those reports. Nothing is kept in the browser: refreshing the page starts
the assessment again, with the items reshuffled.

### Ties at the midpoint cannot happen

Totals are whole numbers from 15 to 60, so averages are multiples of 1/15. The cut-offs 1.75, 2.5 and 3.25
would need totals of 26.25, 37.5 and 48.75, so no score ever lands exactly on a line.

### Sub-styles

The chart's 1.75 and 3.25 lines divide each quadrant into four sub-quadrants, following the
Merrill–Reid / TRACOM convention (e.g. "Driving Driver" for the outer Driver corner). Each quadrant is split
around its own centre (1.75 for low scores, 3.25 for high), and the sub-quadrant is named after the style it leans
toward, e.g. "Amiable Driver" for a Driver who sits toward the Amiable side.

## Editing content

All wording (items and interpretation) is in `social_styles/content.js`, copied from the source PDF with spelling corrections only.
The explanations of *Pace*, *Priorities* and the backup styles are written from the questionnaire's own content.

## Brand

Pelai Collective "Ark" palette (Variation C: equal weight): Ebony `#120700`, Dark Timber `#3A1A06`,
Gold Grain `#C8A060`, Abyss `#062030`, Living Teal `#1A8090`, Sea Mist `#E8F4F8`.
Logos are in `social_styles/assets/`: `pelai-logo-on-light.png` (dark hull, shown on the light header in light mode),
`pelai-logo-on-dark.png` (white hull, shown on the dark header in dark mode, and used on the PDF band),
`pelai-logo-email.png` (white hull, for the email header) and `favicon.png` (hull only).
