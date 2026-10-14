import { useCallback, useEffect, useRef, useState } from 'react';
import { Acronym, type Mood } from './components/Acronym';
import { Expansion } from './components/Expansion';
import { ArrowIcon, CheckIcon, CrossIcon, SpinIcon } from './components/Icons';
import { ROUND_SIZE, buildRound, verdictFor } from './game';
import { usePrefersReducedMotion } from './hooks';

const THEMES = ['blue', 'red', 'cobalt', 'red', 'blue'] as const;

function TopStrip() {
  return (
    <div className="strip strip--top" aria-hidden="true">
      <span className="tile tile--checker" />
      <span className="tile tile--pink tile--wide" />
      <span className="tile tile--red" />
      <span className="tile tile--stripes tile--wide" />
      <span className="tile tile--yellow">
        <span className="tile__dot" />
      </span>
      <span className="tile tile--blue" />
      <span className="tile tile--sky tile--wide" />
      <span className="tile tile--checker" />
    </div>
  );
}

function BottomStrip() {
  return <div className="strip strip--bottom" aria-hidden="true" />;
}
type Phase = 'play' | 'done';

export default function App() {
  const reducedMotion = usePrefersReducedMotion();
  const [round, setRound] = useState(() => buildRound());
  const [roundNo, setRoundNo] = useState(1);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [results, setResults] = useState<boolean[]>([]);
  const [phase, setPhase] = useState<Phase>('play');

  const headingRef = useRef<HTMLHeadingElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  const card = round[index];
  const pickedOption = card.options.find((o) => o.id === picked) ?? null;
  const mood: Mood = pickedOption ? (pickedOption.correct ? 'correct' : 'wrong') : 'idle';
  const score = results.filter(Boolean).length;
  const theme = phase === 'done' ? 'result' : THEMES[index % THEMES.length];

  const pick = useCallback(
    (id: string) => {
      if (picked || phase !== 'play') return;
      const opt = card.options.find((o) => o.id === id);
      if (!opt) return;
      setPicked(id);
      setResults((r) => [...r, opt.correct]);
    },
    [card, picked, phase],
  );

  const next = useCallback(() => {
    if (index >= ROUND_SIZE - 1) {
      setPhase('done');
    } else {
      setIndex((i) => i + 1);
    }
    setPicked(null);
  }, [index]);

  const playAgain = useCallback(() => {
    setRound(buildRound());
    setRoundNo((n) => n + 1);
    setIndex(0);
    setPicked(null);
    setResults([]);
    setPhase('play');
  }, []);

  // Focus: new card → its heading; after a guess → Next; end → result.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (phase === 'done') resultRef.current?.focus();
    else if (picked) nextRef.current?.focus();
    else headingRef.current?.focus();
  }, [phase, picked, index, roundNo]);

  // Number keys 1–3 pick an option while a card is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phase !== 'play' || picked || e.metaKey || e.ctrlKey || e.altKey) return;
      const n = Number(e.key);
      if (n >= 1 && n <= card.options.length) {
        e.preventDefault();
        pick(card.options[n - 1].id);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [card, phase, picked, pick]);

  // Keep the browser chrome in step with the poster colour.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const spinKey = `${roundNo}-${index}`;

  return (
    <main className="stage" data-theme={theme}>
      <TopStrip />
      <header className="topbar">
        <p className="wordmark">Acronym Roulette</p>
        <ol className="progress" aria-label={`Question ${Math.min(index + 1, ROUND_SIZE)} of ${ROUND_SIZE}`}>
          {round.map((r, i) => {
            const state =
              i < results.length ? (results[i] ? 'right' : 'wrong') : i === index && phase === 'play' ? 'now' : 'todo';
            return <li key={r.id} className={`progress__dot progress__dot--${state}`} aria-hidden="true" />;
          })}
        </ol>
      </header>

      {phase === 'play' ? (
        <section className="poster" key={spinKey} aria-labelledby="card-heading">
          <div className="poster__type">
            <p className="room">
              <span className="room__num">{String(index + 1).padStart(2, '0')}</span>
              <span>{card.room}</span>
              {card.twist && <span className="twist">Same letters. New room.</span>}
            </p>
            <h1 id="card-heading" ref={headingRef} tabIndex={-1} className="visually-hidden">
              {`Question ${index + 1} of ${ROUND_SIZE}: ${card.acronym.split('').join(' ')}`}
            </h1>
            <div className="acronym-wrap">
              <span className="sun" aria-hidden="true" />
              <span className="wedge" aria-hidden="true" />
              <Acronym letters={card.acronym} spinKey={spinKey} mood={mood} reducedMotion={reducedMotion} />
            </div>
            <div className="expansion-slot">{pickedOption && <Expansion text={card.expansion} />}</div>
          </div>

          <div className="poster__play">
            <blockquote className="context">
              <p>“{card.context}”</p>
            </blockquote>
            <p id="prompt" className="prompt">
              What does <strong>{card.acronym}</strong> mean here?
            </p>
            <div className="options" role="group" aria-labelledby="prompt">
              {card.options.map((opt, i) => {
                const state = !picked ? 'idle' : opt.correct ? 'correct' : opt.id === picked ? 'wrong' : 'dim';
                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={`option option--${state}`}
                    onClick={() => pick(opt.id)}
                    aria-disabled={picked ? 'true' : undefined}
                  >
                    <span className="option__key" aria-hidden="true">
                      {i + 1}
                    </span>
                    <span className="option__label">{opt.label}</span>
                    {state === 'correct' && (
                      <span className="option__mark">
                        <CheckIcon />
                        <span className="visually-hidden">(correct answer)</span>
                      </span>
                    )}
                    {state === 'wrong' && (
                      <span className="option__mark">
                        <CrossIcon />
                        <span className="visually-hidden">(your pick)</span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="reveal" aria-live="polite">
              {pickedOption && (
                <>
                  <p className="reveal__verdict">
                    {pickedOption.correct ? 'Nailed it.' : 'Wrong room.'}{' '}
                    <span className="visually-hidden">
                      {card.acronym} means {card.options.find((o) => o.correct)?.label}.
                    </span>
                  </p>
                  <p className="reveal__why">{card.why}</p>
                  <button ref={nextRef} type="button" className="cta" onClick={next}>
                    {index >= ROUND_SIZE - 1 ? 'See my result' : 'Next acronym'}
                    <ArrowIcon />
                  </button>
                </>
              )}
            </div>
            {!picked && (
              <p className="hint" aria-hidden="true">
                Tip: press 1, 2 or 3
              </p>
            )}
          </div>
        </section>
      ) : (
        <Result score={score} results={results} acronyms={round.map((r) => r.acronym)} onAgain={playAgain} headingRef={resultRef} />
      )}
      <BottomStrip />
    </main>
  );
}

interface ResultProps {
  score: number;
  results: boolean[];
  acronyms: string[];
  onAgain: () => void;
  headingRef: React.RefObject<HTMLHeadingElement>;
}

function Result({ score, results, acronyms, onAgain, headingRef }: ResultProps) {
  const verdict = verdictFor(score);
  return (
    <section className="result" aria-labelledby="result-heading">
      <p className="room">
        <span className="room__num">Game over</span>
      </p>
      <p className="result__score" aria-hidden="true">
        {score}
        <span>/{ROUND_SIZE}</span>
      </p>
      <h1 id="result-heading" ref={headingRef} tabIndex={-1} className="result__title">
        <span className="visually-hidden">
          {score} out of {ROUND_SIZE}.{' '}
        </span>
        {verdict.title}
      </h1>
      <p className="result__line">{verdict.line}</p>
      <ul className="result__strip" aria-label="Your answers">
        {acronyms.map((a, i) => (
          <li key={`${a}-${i}`} className={results[i] ? 'is-right' : 'is-wrong'}>
            <span>{a}</span>
            {results[i] ? <CheckIcon /> : <CrossIcon />}
            <span className="visually-hidden">{results[i] ? 'right' : 'wrong'}</span>
          </li>
        ))}
      </ul>
      <button type="button" className="cta cta--big" onClick={onAgain}>
        <SpinIcon />
        Play again
      </button>
    </section>
  );
}
