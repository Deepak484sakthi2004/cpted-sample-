---
name: cpted-india-design
description: Use this skill to generate well-branded interfaces and assets for CPTED India, an eLearning and advisory practice in Crime Prevention Through Environmental Design. Use for production Next.js/React code in the cpted-sample- repo or for throwaway prototypes, decks, mocks, and slides that need the CPTED India visual identity (deep navy brand, muted gold accent, Source Serif 4 + Inter, warm-paper neutrals, editorial composition, zero rounded corners).
user-invocable: true
---

Read the `README.md` file in this skill first — it is the source of truth for voice, colour, type, iconography, and the three product surfaces (marketing, student portal, administrative console). The system is a **considered upgrade** of the reference codebase — not a documentation pass — and intentionally replaces the codebase's Tailwind blue-800 + amber-500 palette with a narrower institutional one.

Then explore as needed:

- `colors_and_type.css` — all CSS variables + semantic element recipes (`h1`, `h2`, `p`, `.btn-primary`, `.btn-secondary`, `.btn-outline`, `.eyebrow`, `.tagline`, `.badge.a`, `.badge.p`). Drop this stylesheet into any HTML artifact to inherit the system. Fonts (Source Serif 4 + Inter) are loaded via a `@import` at the top.
- `assets/` — real brand imagery (hero photography, ISO badge, original logo JPG). Copy files out of this folder when building artifacts; reference them by relative path. Do **not** use the `logo-ci.jpg` directly — render the monogram in CSS as a navy square with serif `CI` typography.
- `ui_kits/public/index.html`, `ui_kits/student-app/index.html`, `ui_kits/admin/index.html` — full-page recreations of the three surfaces. Read the kit that matches the surface you need before composing new screens; lift patterns (utility bar, hero ledger, numbered service card, programme card, KPI tile, enrolment table, activity log) directly.
- `preview/` — small specimen cards documenting individual tokens and patterns; useful when picking a colour, a type recipe, or a component.

## Building artifacts — non-negotiables

- **Palette is narrow.** Navy `#0B2545` for importance, gold `#B08A3E` as a condiment (underlines, 2px borders, progress bars, numerals), warm paper `#F5F5F3` for page backgrounds, white for panels. Evergreen / oxblood are for state only. **No gradients, no amber, no blue-800, no Tailwind defaults.**
- **Zero rounded corners.** Every surface is square — cards, buttons, inputs, badges, avatars. This is the single most distinctive rule.
- **Typography is a pair.** Serif (Source Serif 4, 500–600) for display and numerals; sans (Inter, 400–600) for body and UI. Weight 700+ is not used.
- **No shadows** except the single card-hover shadow. Elevation is communicated with borders and colour, not cast light.
- **Icons are Lucide only**, rendered at 14–18px with stroke `1.75`. No icon tiles, no illustrations, no emoji.
- **Imagery sits at ~25% opacity over navy** in heroes. Full-opacity photography is only used in About-style split sections at 4:5 aspect ratio with `filter: grayscale(.1)`.

## Surface-specific mapping

- **Marketing site** → navy hero, warm-paper sections, credentials rail under hero, numbered services, navy programmes band with gold tier eyebrows, CTA closer.
- **Student portal** → warm-paper page, white editorial panels, 248px navy-on-white sidebar with gold 2px active indicator, serif dashboard greeting (_"Good afternoon, Rahul."_), gold progress bars.
- **Administrative console** → warm-paper page, 256px white-on-navy sidebar with gold active indicator, square KPI tiles with serif numerals, enrolment table with 32px monogram avatars + square state badges, time-stamped activity log.

## Tone

Professional, measured, institutional. Indian English. Em-dashes between clauses. Numbered list prefixes (`01`, `02`) in serif gold. No emoji, no urgency, no casual imperatives. Wordmark is **CPTED India** (two words, serif).

## When invoked with no further guidance

Ask the user what they want to build (slide, landing page, feature mock, full screen, component), which surface it belongs to (marketing / student / admin), and whether they want variations. Then act as an expert designer and produce either an HTML artifact or production-grade React/Tailwind code, matching the system above. Never invent a new colour. Never round a corner.
