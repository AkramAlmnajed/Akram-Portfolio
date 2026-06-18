import { useEffect, useState } from 'react';

// Editable rotating phrases — every line shares the one unified gold below.
const LINES = [
  'Welcome to my world',
  'Where ideas become interfaces',
  'Code is a craft, not a routine',
  'From concept to deployment',
  'Turning logic into experience',
  'Every detail, deliberate',
  'Built to scale, designed to feel',
  'Pixels with purpose',
  'Clean code, quiet confidence',
  'Ideas, engineered',
  'Form, function, finesse',
  'Crafting the web, one detail at a time',
];

// One refined gold: highlight -> brand -> deep (fades toward near-black at the base).
const GOLD = ['#F4E0A1', '#C9A227', '#7E6316'];

const ROTATE_MS = 3600;

// A thin near-white warm sheen band (a whisper of light) over the unified gold gradient.
const GOLD_GRADIENT = [
  'linear-gradient(110deg, transparent 42%, rgba(255, 246, 214, 0.7) 50%, transparent 58%)',
  `linear-gradient(180deg, ${GOLD[0]} 0%, ${GOLD[1]} 52%, ${GOLD[2]} 100%)`,
].join(', ');

export default function CurtainWelcome({ opening }) {
  const [index, setIndex] = useState(0);

  // Cycle the active line. Frozen while opening; cleaned up on unmount (StrictMode-safe).
  useEffect(() => {
    if (opening) return undefined;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % LINES.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [opening]);

  // Rotation is always +1, so the leaving line is simply the previous index.
  const prevIndex = (index - 1 + LINES.length) % LINES.length;

  return (
    <div className={`curtain-welcome${opening ? ' curtain-welcome--opening' : ''}`}>
      <div className="curtain-lines">
        {LINES.map((text, i) => {
          const state =
            i === index ? ' curtain-line--active' : i === prevIndex ? ' curtain-line--leave' : '';
          return (
            <div key={text} className={`curtain-line${state}`}>
              <span className="curtain-line-text" style={{ backgroundImage: GOLD_GRADIENT }}>
                {text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
