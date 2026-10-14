import { AMBIGUOUS, CARDS, GLOSSARY, isMeaningId, plain, type Card } from './data/glossary';

export const ROUND_SIZE = 5;

export interface Option {
  id: string;
  label: string;
  correct: boolean;
}

export interface RoundCard extends Card {
  options: Option[];
  expansion: string;
  /** True for the second card of an ambiguous pair: same letters, new room. */
  twist: boolean;
}

function shuffle<T>(items: readonly T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function toRoundCard(card: Card, twist: boolean): RoundCard {
  const expansion = GLOSSARY[card.answer].expansion;
  const options: Option[] = [
    { id: `${card.id}-answer`, label: plain(expansion), correct: true },
    ...card.decoys.map((d, i) => ({
      id: `${card.id}-decoy-${i}`,
      label: isMeaningId(d) ? plain(GLOSSARY[d].expansion) : d,
      correct: false,
    })),
  ];
  return { ...card, expansion, options: shuffle(options), twist };
}

/**
 * Five cards: one ambiguous pair played back to back (the "same letters,
 * new room" moment), plus three single acronyms in random order.
 */
export function buildRound(size = ROUND_SIZE): RoundCard[] {
  const pairAcronym = AMBIGUOUS[Math.floor(Math.random() * AMBIGUOUS.length)];
  const pair = shuffle(CARDS.filter((c) => c.acronym === pairAcronym)).slice(0, 2);
  const singles = shuffle(
    CARDS.filter((c) => !(AMBIGUOUS as readonly string[]).includes(c.acronym)),
  ).slice(0, size - pair.length);

  const at = Math.floor(Math.random() * (singles.length + 1));
  const ordered: { card: Card; twist: boolean }[] = singles.map((card) => ({ card, twist: false }));
  ordered.splice(at, 0, { card: pair[0], twist: false }, { card: pair[1], twist: true });

  return ordered.slice(0, size).map(({ card, twist }) => toRoundCard(card, twist));
}

export interface Verdict {
  title: string;
  line: string;
}

export function verdictFor(score: number): Verdict {
  if (score >= 5) return { title: 'Acronym Oracle', line: 'Five for five. You read the room every time.' };
  if (score === 4) return { title: 'Context Whisperer', line: 'One letter slipped. The rest bowed to you.' };
  if (score === 3) return { title: 'Letter Juggler', line: 'More catches than drops. Respectable juggling.' };
  if (score === 2) return { title: 'Jargon Tourist', line: 'You visited. You took photos. Come back soon.' };
  return { title: 'Alphabet Soup Sommelier', line: 'Bold palate. Questionable pairings. Spin again.' };
}
