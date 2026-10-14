interface Props {
  /** Bracket-marked expansion, e.g. "[B]usiness [U]nit". */
  text: string;
}

/** The unfolded meaning: words rise in, the acronym's own letters light up. */
export function Expansion({ text }: Props) {
  const words = text.split(' ');
  return (
    <p className="expansion">
      {words.map((word, w) => (
        <span key={w} className="expansion__word" style={{ ['--w' as string]: w }}>
          {word.split(/(\[[^\]]+\])/).filter(Boolean).map((part, p) =>
            part.startsWith('[') ? (
              <span key={p} className="expansion__key">
                {part.slice(1, -1)}
              </span>
            ) : (
              <span key={p}>{part}</span>
            ),
          )}
          {w < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </p>
  );
}
