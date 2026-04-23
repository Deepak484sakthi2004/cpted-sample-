# CPTED India Design System

A design system for **CPTED India** — an eLearning and advisory practice in Crime Prevention Through Environmental Design. The product surface spans a marketing site, a student learning portal, and an administrative console, unified by a single institutional visual language.

---

## Source & stance

- **Reference codebase:** [github.com/Deepak484sakthi2004/cpted-sample-](https://github.com/Deepak484sakthi2004/cpted-sample-) (branch `main`) — Next.js 16 · TypeScript · Tailwind CSS 4 · shadcn/ui · Lucide.
- **This system is a considered upgrade, not a documentation pass.** The codebase ships with a saturated Tailwind default palette (blue-800 brand + amber-500 CTA + gray-900 dark bands) and the native system sans stack. That reads as generic web SaaS and underplays a 20-year advisory practice. We have replaced it with a **deep institutional navy, muted ochre, editorial serif, and warm paper neutrals** — a palette more appropriate for a firm that advises governments and institutions.
- **Tagline:** _Enabling safer space by design_ — retained from the codebase, now set in a small gold eyebrow.

---

## Product surfaces

Three surfaces share one palette; they diverge in **density and weight of navy**, not in hue.

| Surface | Route | Visual register | Primary CTA |
|---|---|---|---|
| **Marketing site** | `/` · `/about` · `/services` · `/programmes` · `/contact` | White and warm-paper sections, navy hero, full-bleed navy programmes band, photographic imagery at reduced opacity | **Navy** `#0B2545` (gold `#B08A3E` as secondary on dark backgrounds) |
| **Student portal** | `/app/*` | Warm-paper page background, white editorial panels, gold progress bars and eyebrow datelines | **Navy** `#0B2545` |
| **Administrative console** | `/admin/*` | Dark navy sidebar, warm-paper content area, serif KPIs, subtle gold accents only | **Navy** `#0B2545` |

Gold is the **secondary accent** everywhere — never the primary. It appears as underlines under ghost links, 2px left borders on panels, progress bars, dateline eyebrows, hero-section meta rails, and admin sidebar active indicators.

---

## Content fundamentals

**Voice.** Professional, measured, institutional. Aimed at security professionals, government bodies, corporate buyers, and learners pursuing certification. Short declarative sentences. Indian English spellings used consistently (`certification`, `recognised`, `organisation`, `programme`).

**Tone.** Authoritative but welcoming. Understated. Never promotional, never clever, never urgent. Claims are backed with specifics (ISO 9001:2015, "Est. 2005", "240+ engagements", "18 certified practitioners").

**Person.** Second-person when addressing the learner or buyer: _"Advance your career"_, _"Speak with our advisory team"_. First-person plural when the practice speaks: _"Our practice"_, _"We assess, advise, and certify"_.

**Casing.**
- **Title Case** for page banners and primary buttons (`Request a Consultation`, `Download Capability Statement`, `Resume learning`).
- **Sentence case** for body copy, descriptions, panel titles, and secondary buttons (`View all`, `Read brief`, `Export`, `New programme`).
- **UPPERCASE** with wide tracking (`letter-spacing: .12em–.20em`) is reserved for **eyebrow labels**, **table headers**, **sidebar section labels**, and **credential rails** (`ISO 9001:2015`, `FOUNDATION`, `REPORTING PERIOD`). Never on body copy, never on paragraph-level text.
- **Brand wordmark:** `CPTED India` — the product wordmark is the organisation's name, rendered in serif. (The codebase uses `CPTEDINDIA` as a compressed wordmark; the refined system uses the two-word form consistently.)

**Punctuation.**
- **Em-dash between clauses** is the house style: _"Our practice covers the full CPTED engagement lifecycle — from initial threat modelling to post-implementation review."_
- **Numbered prefixes** (`01`, `02`, `03`) on service and feature lists — rendered in serif gold. An editorial tic that signals order and gravitas.
- **No arrow characters.** The codebase uses `→` on ghost CTAs; the refined system uses a **thin gold underline** instead.
- **Ampersand** is avoided in body copy (`Risk and Management`, not `Risk & Management`). Permitted in legal/credential names only.

**No emoji, no casual imperatives, no urgency cues.** Do not introduce any.

**Microcopy reference** (from the current UI kits):
- Hero CTA: _"Request a Consultation"_
- Secondary hero CTA: _"Download Capability Statement"_
- Admin primary action: _"New programme"_
- Section lead: _"Advisory, assessment, and certification — delivered with institutional rigour."_
- Dashboard greeting: _"Good afternoon, Rahul."_
- Empty state: _"No programmes yet. Your enrolled programmes will appear here once access is granted."_

**Do / don't.**
- ✅ _"Speak with our advisory team about a site audit, training cohort, or bespoke programme."_
- ❌ _"Book your free call now!"_ (urgency, imperative)
- ✅ _"Fee receipts"_ — the administrative ledger term
- ❌ _"Revenue 🎉"_ — informal, emoji

---

## Visual foundations

### Color

Palette deliberately narrow. All values live in `colors_and_type.css` as tokens.

| Token | Hex | Usage |
|---|---|---|
| `--brand` | `#0B2545` | Primary brand. Logo mark background, hero background, primary CTA fill, H1 / H2 text, sidebar (admin), panel headings. |
| `--brand-light` | `#1B3B6F` | Secondary navy — rarely used, reserved for hover states on navy surfaces. |
| `--brand-dark` | `#061936` | Near-black navy — primary-button hover. |
| `--accent` | `#B08A3E` | Muted gold. Secondary CTA fill, underlines on ghost links, 2px eyebrow borders on dark panels, progress-bar fill, numbered-list digits, sidebar active-indicator. |
| `--accent-hover` | `#8E6E2A` | Hover state on gold buttons — darker, never brighter. |
| `--accent-bright` | `#C9A24F` | Slightly brighter gold reserved for use on navy backgrounds (hero eyebrow, programme tier labels, logo-mark fill on dark sidebar). |
| `--success` | `#16624A` | Evergreen. `Active` status badges, positive deltas (`+12% vs prior`). |
| `--success-soft` | `#E6F0EC` | Pale evergreen — active-badge background. |
| `--danger` | `#9B2C2C` | Oxblood. Logout, revoked states, negative KPI deltas. |
| `--danger-soft` | `#F6E4E4` | Pale oxblood — danger badge background. |
| `--info-bg` | `#E8EEF5` | Navy-tinted pale surface — informational annotations. |
| `--warm-paper` | `#F5F5F3` | Off-white page background (student & admin shells). Replaces Tailwind `gray-50`. |

**Where colour goes, and doesn't.**
- **Navy dominates.** Hero sections, admin sidebar, primary buttons, display type. If a surface is "important", it is navy — full stop.
- **Gold is a condiment, not a course.** It appears as 2px borders, 3px progress bars, single-letter numerals, and small-caps eyebrows. Never as a button over 50px wide unless on a navy background.
- **No Tailwind amber-500, no blue-800, no gradient-to-r.** The refined system is flat and pigmented.
- **Green and red are reserved for state** — active/inactive, positive/negative. Never decorative.

### Type

Two families, loaded from Google Fonts:

```css
@import url("https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600;8..60,700&family=Inter:wght@400;500;600;700&display=swap");
```

- **Source Serif 4** — display face. Used on all H1, H2, KPI numerals, logo wordmark, panel headings, numbered list digits, and stat values. Weight 500 for display, 600 for small titles. `letter-spacing: -.01em` on large sizes.
- **Inter** — body, UI, labels, buttons, tabular data. Weights 400 / 500 / 600. Weight 700 is reserved (we do not use extrabold or black).

**Scale.**

| Role | Size | Family · weight | Casing |
|---|---|---|---|
| Hero display | `3.25rem` (clamp) | Serif · 500 | Sentence, serif italic for accent phrases |
| H1 page title | `2rem` | Serif · 500 | Sentence |
| H2 section | `2.25rem` marketing · `1.5rem` UI | Serif · 500–600 | Sentence |
| H3 panel | `1.125rem` | Serif · 600 | Sentence |
| Body | `14px–15px` | Sans · 400 | Sentence |
| Eyebrow / label | `10px–11px` · `letter-spacing: .14em` | Sans · 600 | UPPERCASE |
| KPI numeral | `2.25rem–2.5rem` | Serif · 500 | Tabular |
| Button | `12px–14px` | Sans · 500–600 | Title or Sentence |

**`colors_and_type.css` provides semantic element recipes** — `h1`, `h2`, `p`, `.eyebrow`, `.tagline`, `.btn-primary`, `.btn-secondary`, `.btn-outline`, `.btn-outline-inverse`, `.btn-ghost`. Import the stylesheet and inherit for free.

### Layout and composition

- **Container:** `max-width: 72rem` (1152px) on marketing, full-bleed with 40px content padding on portal surfaces.
- **Section rhythm:** 96px vertical padding on marketing sections; 40px gutter on portal content.
- **Dividers are hair-thin.** `1px solid #E5E7EB` on white, `1px solid rgba(255,255,255,.08)` on navy. No shadows between sections.
- **Cards have no shadow by default.** `background: #fff; border: 1px solid #E5E7EB` — the editorial default. Hover adds `border-color: #B08A3E` and an extremely subtle `0 2px 12px -4px rgb(11 37 69 / 0.12)` shadow.
- **No rounded corners.** Border-radius is **0** on every surface — cards, buttons, inputs, badges, avatars. This is the single most important composition rule and the strongest break from the reference codebase. Pills/rounded shapes are not used anywhere.
- **Grid and columns:** marketing services `repeat(2, 1fr)`, programmes `repeat(3, 1fr)`, admin KPI `repeat(4, 1fr)`. Always CSS grid, never flexbox row-wrap.

### Imagery

- **Photographic only at reduced opacity over navy.** Hero images sit at `opacity: .25` over `#0B2545` with `object-position: center 30%` so type remains legible. No full-opacity photography anywhere.
- **The `split` section** (About, Twenty years of practice) pairs a single photograph at a 4:5 aspect ratio beside a statistics ledger. Photograph may be at full opacity but receives a `filter: grayscale(.1)` to mute saturation.
- **No illustrations, icons-as-decoration, patterns, grain, or gradients.** Gradients are banned system-wide.

### Iconography

**Library:** [`lucide-react`](https://lucide.dev) — inherited from the codebase. Rendered via the Lucide UMD CDN in static mockups (`https://unpkg.com/lucide@0.474.0/dist/umd/lucide.min.js`).

**Rules.**
- Icons are sized `14px` (inline-utility), `16px` (sidebar nav, KPI labels, contact rows), `18px` (panel annotations). No icon larger than 18px in this system — we are not a SaaS, we do not need large illustrative icons.
- Stroke weight is always `1.75`. Default Lucide is `2.0`, which reads too heavy beside Source Serif.
- Tint: gold `#B08A3E` for most contexts (eyebrow glyphs, contact rows, sidebar nav in active state, annotation icons). Neutral `#6B7280` in the admin top bar. White `#fff` on dark sidebar.
- **No icon tiles.** The reference codebase used `bg-amber-500/20` rounded tiles around icons. We do not.

### Motion

Minimal, 200ms `ease-out` on hover transitions (`border-color`, `background`, `color`). No entrance animations, no parallax, no Lottie, no scroll-triggered reveals. The practice is institutional; it does not need motion to feel substantial.

### Shadows

One shadow token used across the system:

```
box-shadow: 0 2px 12px -4px rgb(11 37 69 / 0.12);   /* card hover only */
```

All other surfaces are shadow-free. Elevation is communicated via border weight and colour, not cast light.

---

## Components (patterns recurring across kits)

1. **Utility bar** — 8px navy strip above the navbar carrying the two contact points and the ISO certification line. `font-size: 12px`, gold glyphs, muted slate text.
2. **Navbar** — 88px tall white bar. Logo (40–48px navy square mark + serif wordmark + gold eyebrow). Nav links 14px sans, active link gets a 2px gold underline. Primary CTA is the small navy button on the right.
3. **Hero split** — two-column: headline + lead + CTAs on the left, a bordered ledger ("Practice at a glance", "Reporting period") on the right with a 2px gold left border.
4. **Credentials rail** — thin warm-paper band under the hero, uppercase labels separated by 1px vertical dividers. No logos.
5. **Numbered service card** — two-column card: serif gold numeral (`01`) beside title + description + gold-underlined "Read brief" link.
6. **Programme card** (on navy) — tier eyebrow in gold, serif title, description, hairline divider, duration + price row. Price is serif.
7. **Split about** — 4:5 photograph beside a 2×2 stat grid with serif numerals.
8. **CTA band** — warm-paper section with two buttons right-aligned; used as the marketing closer.
9. **Portal sidebar** — 248–256px wide. Navy-on-white for students; white-on-navy for admins. Gold 2px left indicator on active. Section labels in wide-tracked uppercase.
10. **Editorial KPI tile** — label with inline glyph at top, serif numeral, thin divider, delta + sub in a flex row. 4-up on admin dashboard.
11. **Enrolment table** — warm-paper header row with uppercase labels, 32px monogram avatars (navy on white), gold 3px progress bars, square state badges.
12. **Activity log** — stamped left rail (`09:14`, `Yest.`, `23 Apr`) in serif gold beside a two-line paragraph.
13. **Button system** — four recipes: `.btn-primary` (navy), `.btn-secondary` (gold), `.btn-outline` (transparent + gray border), `.btn-outline-inverse` (white 2px border on imagery). All square.
14. **Badge** — `.badge.a` (active, evergreen on pale green), `.badge.p` (pending, slate on warm paper with border). Square, uppercase, wide-tracked.

---

## Brand assets

In `assets/`:

- `logo-ci.jpg` — the codebase's blue "CI" monogram. **Flagged:** we render the logo as a navy square with serif `CI` typography instead, because the JPG includes whitespace and renders poorly on dark sidebars. The JPG is retained for reference only.
- `banner-safe-space.jpg` — marketing hero photography.
- `risk-assessment.jpg` — "About the practice" split section.
- `security-consulting.jpg` — available for services page imagery.
- `iso-certified.png` — ISO certification badge.
- `istock-3.jpg` — available for secondary use.

`certification-hero.jpg` is referenced by the codebase's HeroCarousel component but not present in the repo — flagged in _Caveats_.

---

## File index

```
./
├── README.md                   ← this file
├── SKILL.md                    ← agent skill manifest
├── colors_and_type.css         ← all CSS variables + semantic element styles
├── assets/                     ← logos, photography, ISO badge
├── preview/                    ← design-system specimen cards
└── ui_kits/
    ├── public/index.html       ← marketing site (hero, credentials, services, programmes, about, CTA)
    ├── student-app/index.html  ← student portal dashboard
    └── admin/index.html        ← administrative console
```

---

## Caveats

1. **Logo.** The codebase only supplies a JPG. The refined system substitutes a navy CSS-rendered monogram. A vector logo (SVG, ideally on transparent background, with gold and white variants) is required to operationalise the brand at scale. Please supply.
2. **`certification-hero.jpg` is missing** from `public/images/` in the codebase. UI kits substitute `banner-safe-space.jpg`.
3. **Palette and typography are a design direction, not a codebase audit.** The production codebase uses Tailwind blue-800 + amber-500 + system sans. This system proposes replacing those entirely. Rolling it out requires rewriting Tailwind config, updating all `bg-blue-*` / `bg-amber-*` / `text-*-*` class usages, and loading Source Serif 4 + Inter.
4. **No written brand guidelines supplied.** Voice, casing, and content rules above are a considered position, not transcribed house rules. Please validate with stakeholders.
5. **Programme naming, pricing, credentialling bodies, and credentials rail wording** in the UI kits are illustrative placeholders. Replace before production use.
