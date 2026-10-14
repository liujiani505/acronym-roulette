# Acronym Roulette

A 30-second guessing game: same letters, different rooms.

Five cards per round. Each shows one giant acronym, a sentence that sets the
context, and three meanings. Pick one: the letters spin, hop (or wobble), and
unfold into the right answer with a one-line reason. Every round includes one
ambiguous pair played back to back (BU, PE or CPA), so the same letters come
back meaning something else.

## Run

```bash
npm install
npm run dev          # local
npm run build        # type-check + production build into dist/
npm run check:data   # validates the glossary and round builder
```

## Deploy to Vercel

Import the folder (or repo) in Vercel. It detects Vite; `vercel.json` pins
`npm run build` → `dist`. No environment variables, no backend.

## Content

`src/data/glossary.ts` holds 15 acronyms and 18 hand-written cards. Nothing is
AI-generated. The check script confirms each answer belongs to its acronym,
the highlighted letters spell it, options are distinct, and every round has
five unique cards with exactly one "same letters, new room" twist.

## Accessibility

- Real buttons; 1 / 2 / 3 keys pick an option; Enter continues.
- Focus moves to each new question, then to Next after a guess, then to the
  result.
- Right/wrong is shown with icons, fill and dashed borders, not colour alone,
  and announced in a polite live region.
- `prefers-reduced-motion` turns off the letter spin and all movement.

## Possible next step: AI bonus card

Not built. If added, a model may only write a new *context sentence* for an
acronym already in the glossary; the answer and options still come from the
glossary, so the correct meaning is always verifiable.
