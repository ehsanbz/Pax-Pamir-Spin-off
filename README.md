# Pax-Pamir-Spin-off

A Persian/English historical atlas exploring the people, places, events, and relationships behind **Pax Pamir: Second Edition**. Persian is the default language; use the language switch in the header to select English.

**[Open the atlas](https://ehsanbz.github.io/Pax-Pamir-Spin-off/)** · **[Read the research report](https://ehsanbz.github.io/Pax-Pamir-Spin-off/research.html)**

**[English atlas](https://ehsanbz.github.io/Pax-Pamir-Spin-off/en.html)** · **[English research report](https://ehsanbz.github.io/Pax-Pamir-Spin-off/research-en.html)**

## Explore

- Research profiles for all 116 cards: 41 historical people, one fictional character, 58 thematic cards, 12 event cards, and four structural cards.
- An interactive chronology containing 39 dated historical events.
- A geographic map and a network of 97 sourced relationship records.
- Clickable biographies, citations, search, filters, and a printable research report.

The complete interface and research are available in Persian and English, including all profiles, event headings, uncertainty notes, relationship descriptions, and source titles. Every original source URL is retained. The language switch preserves the selected section, profile, and timeline range. A fresh visit to the home page always opens in Persian, regardless of browser language.

Dates are Gregorian. Selected activity periods are not complete lifespans. The map uses contemporary boundaries for orientation, not reconstructed historical borders. Uncertain claims and thematic interpretations are identified in the profiles.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Interactive atlas, using local card images and embedded map data |
| `en.html` | Complete English atlas with left-to-right layout |
| `research.html` | Standalone research text for reading and printing |
| `research-en.html` | Complete English research report |
| `research-data.json` | Structured research records without embedded card images |
| `research-data-en.json` | English research records with the same IDs and source URLs |
| `preview.jpg` | Preview of the atlas |
| `.nojekyll` | Serve the static site directly through GitHub Pages |

No installation or build is required. Open `index.html` in a modern browser, or use the published GitHub Pages site. Keep `assets/cards/` and `global-search.js` alongside the HTML files; external source links require an internet connection.

## Sources and attribution

Historical references and source-critical notes are linked within each profile and in the atlas bibliography. Research includes academic publications, Encyclopaedia Iranica, museum collections, archives, and contemporary accounts.

Game design, graphic design and research: **Cole Wehrle**; publisher: **Wehrlegig Games LLC**. The [publisher’s Resources page](https://wehrlegig.com/pages/resources) links the [official rulebook](https://www.dropbox.com/scl/fi/rxcttget9flnuuv12lhlf/PaxPamir-Rules.pdf?dl=0&rlkey=kx19mzkv0x9x8p7ugg883g3hh), whose Third Printing (2021), p. 20, identifies the game licence as **[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)**.

The atlas stores 116 numbered card faces in `assets/cards/card_1.jpg` through `assets/cards/card_116.jpg`, with titles from [Rally the Troops’ card gallery](https://rally-the-troops.com/pax-pamir/info/cards.html). Images are stored locally and scaled for display; research, translations and interactive links are added. `preview.jpg` includes cards in an atlas screenshot. Reused game material and adaptations of it are supplied under CC BY-NC-SA 4.0: attribution, noncommercial use, indication of changes, and ShareAlike for adaptations. This is an unofficial fan project, without implied endorsement. This notice does not assert a blanket licence over independent research, site code, historical artwork in the public domain, or external sources. Full asset scope and links appear in the credits on all four pages.

## Site-wide search

The search above the atlas tabs covers all 116 cards (including people and thematic places), 39 dated events, 73 map locations and six historical chapters. It searches research text, aliases, dates and source titles, with all query words required. Results link to profiles, events, map locations or chapters. Persian/Arabic letter variants and digits are normalized. Each edition searches its own research language and stored alternate names. The research reports link back to the atlas search. No network request or search service is required; `global-search.js` uses the embedded research data.

Map boundary data: [Natural Earth](https://www.naturalearthdata.com/about/terms-of-use/), public domain.

Research edition: 27 October 2026.

English edition and language navigation added: 28 October 2026.


Browser regression checks: install the development dependency with `npm install`, install Microsoft Edge (or change the Playwright channel), then run `npm test`. Checks cover both language editions, all result types, reload links, digit normalization, no matches, clearing, hostile input, mobile width, and runtime errors.

Card-image source links in profiles, reports and research data open the repository-hosted JPG files. The original Rally the Troops gallery remains credited as their provenance.
