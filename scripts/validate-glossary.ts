/**
 * Dataset check: run with `npm run check:data`.
 * Every card's answer must exist, belong to the same acronym, and the
 * bracketed letters of its expansion must spell that acronym.
 */
import { CARDS, GLOSSARY, isMeaningId, plain } from '../src/data/glossary';
import { buildRound } from '../src/game';

let errors = 0;
const fail = (msg: string) => {
  errors++;
  console.error('✗', msg);
};

for (const [id, m] of Object.entries(GLOSSARY)) {
  const letters = [...m.expansion.matchAll(/\[(.)\]/g)].map((x) => x[1].toUpperCase()).join('');
  if (letters !== m.acronym) fail(`${id}: bracketed letters "${letters}" ≠ ${m.acronym}`);
}

const acronyms = new Set<string>();
for (const c of CARDS) {
  acronyms.add(c.acronym);
  const answer = GLOSSARY[c.answer];
  if (!answer) fail(`${c.id}: unknown answer ${c.answer}`);
  else if (answer.acronym !== c.acronym) fail(`${c.id}: answer belongs to ${answer.acronym}`);
  const labels = [plain(answer.expansion), ...c.decoys.map((d) => (isMeaningId(d) ? plain(GLOSSARY[d].expansion) : d))];
  if (new Set(labels).size !== 3) fail(`${c.id}: duplicate option labels`);
  if (!c.context.includes(c.acronym)) fail(`${c.id}: context sentence does not use ${c.acronym}`);
}

if (acronyms.size !== 15) fail(`expected 15 acronyms, found ${acronyms.size}`);

for (let i = 0; i < 500; i++) {
  const round = buildRound();
  if (round.length !== 5) fail('round is not 5 cards');
  if (round.filter((r) => r.twist).length !== 1) fail('round lacks exactly one twist card');
  if (new Set(round.map((r) => r.id)).size !== 5) fail('duplicate card in round');
}

if (errors) {
  console.error(`\n${errors} problem(s)`);
  process.exit(1);
}
console.log(`✓ ${acronyms.size} acronyms, ${CARDS.length} cards, rounds OK`);
