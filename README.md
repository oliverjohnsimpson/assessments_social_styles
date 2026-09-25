# Pelai Collective — Social Styles Self-Assessment

An online version of the Social Styles self-assessment in
[`docs/social-styles-questionnaire.pdf`](docs/social-styles-questionnaire.pdf).

A static site with no build step: `index.html`, `styles.css`, `content.js` and `app.js`.
Open `index.html` in a browser, or host the folder on any static host (for example GitHub Pages).

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

Nothing is stored. Refreshing the page starts the assessment again, with the items reshuffled.

### Ties at the midpoint cannot happen

Totals are whole numbers from 15 to 60, so averages are multiples of 1/15. The cut-offs 1.75, 2.5 and 3.25
would need totals of 26.25, 37.5 and 48.75, so no score ever lands exactly on a line.

### Sub-styles

The chart's 1.75 and 3.25 lines divide each quadrant into four sub-quadrants, following the
Merrill–Reid / TRACOM convention (e.g. "Driving Driver" for the outer Driver corner). Each quadrant is split
around its own centre (1.75 for low scores, 3.25 for high), and the sub-quadrant is named after the style it leans
toward, e.g. "Amiable Driver" for a Driver who sits toward the Amiable side.

## Editing content

All wording (items and interpretation) is in `content.js`, copied from the source PDF with spelling corrections only.
The explanations of *Pace*, *Priorities* and the backup styles are written from the questionnaire's own content.

## Brand

Pelai Collective "Ark" palette (Variation C: equal weight): Ebony `#120700`, Dark Timber `#3A1A06`,
Gold Grain `#C8A060`, Abyss `#062030`, Living Teal `#1A8090`, Sea Mist `#E8F4F8`.
Logos are in `assets/`: `pelai-logo-on-dark.png` (white hull, used on the dark header and PDF band),
`pelai-logo-on-light.png` (dark hull, for light backgrounds) and `favicon.png` (hull only).
