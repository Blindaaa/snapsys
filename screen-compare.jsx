function ScreenCompare({ topic, onReset }) {
  const [selected, setSelected] = React.useState([]); // ids
  const [showFlashcards, setShowFlashcards] = React.useState(false);

  const toggle = (id) => {
    setSelected((cur) => {
      if (cur.includes(id)) return cur.filter((x) => x !== id);
      if (cur.length >= 2) return [cur[1], id];
      return [...cur, id];
    });
  };

  const compareMode = selected.length === 2;
  const cardA = compareMode ? window.RESPONSES.find((r) => r.id === selected[0]) : null;
  const cardB = compareMode ? window.RESPONSES.find((r) => r.id === selected[1]) : null;

  return (
    <div className="col" style={{ minHeight: '100vh', paddingBottom: 80 }}>
      {/* Top bar */}
      <div className="topbar" style={{ position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 5, borderBottom: '3.5px solid var(--ink)' }}>
        <Logo />
        <div className="row gap-12" style={{ alignItems: 'center' }}>
          <span className="pill" style={{ background: 'var(--paper)' }}>SESSION COMPLETE · {window.RESPONSES.length} ROUNDS</span>
          <ChunkyButton color="var(--paper)" size="md" onClick={onReset}>
            ↺ NEW SESSION
          </ChunkyButton>
        </div>
      </div>

      {/* Title */}
      <div style={{ padding: '40px 32px 24px', maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', color: '#888', marginBottom: 8 }}>TOPIC</div>
        <h1 className="display" style={{ fontSize: 'clamp(32px, 4vw, 52px)', margin: '0 0 8px', lineHeight: 1.05 }}>
          “{topic || 'Climate change in coastal cities'}”
        </h1>
        <p style={{ fontSize: 17, color: 'var(--ink-soft)', margin: 0, maxWidth: 720, fontWeight: 500 }}>
          {compareMode
            ? 'Spot what changed. Red = narrator voice. Blue = data source. Yellow = dataset tiles.'
            : 'Tap any two cards to compare them side by side.'}
        </p>
      </div>

      {/* Compare panel */}
      {compareMode && (
        <ComparePanel a={cardA} b={cardB} onClear={() => setSelected([])} />
      )}

      {/* Cards grid */}
      <div style={{ padding: '8px 32px 32px', maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 24,
        }}>
          {window.RESPONSES.map((r) => (
            <ResponseCard
              key={r.id}
              card={r}
              selected={selected.includes(r.id)}
              dimmed={selected.length === 2 && !selected.includes(r.id)}
              onToggle={() => toggle(r.id)}
              compareIndex={selected.indexOf(r.id)}
            />
          ))}
        </div>
      </div>

      {/* Flashcards CTA */}
      <div style={{ padding: '24px 32px 0', maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        <div style={{
          borderTop: '3.5px dashed var(--ink)',
          paddingTop: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
          flexWrap: 'wrap',
        }}>
          <div>
            <h2 className="display" style={{ fontSize: 'clamp(28px, 3vw, 40px)', margin: '0 0 6px' }}>
              Discussion questions
            </h2>
            <p style={{ margin: 0, fontSize: 16, color: 'var(--ink-soft)', fontWeight: 500 }}>
              Three prompts auto-generated from this session. Swipe through with the class.
            </p>
          </div>
          <ChunkyButton color="var(--blue)" textColor="white" size="lg" onClick={() => setShowFlashcards(true)}>
            OPEN FLASHCARDS →
          </ChunkyButton>
        </div>
      </div>

      {/* Flashcards modal */}
      {showFlashcards && (
        <FlashcardOverlay topic={topic} onClose={() => setShowFlashcards(false)} />
      )}
    </div>
  );
}

function ResponseCard({ card, selected, dimmed, onToggle, compareIndex }) {
  const n = window.NARRATORS[card.narrator];
  return (
    <div
      onClick={onToggle}
      className="chunk chunk-press response-card"
      style={{
        padding: 22,
        background: selected ? n.bg : 'var(--paper)',
        opacity: dimmed ? 0.4 : 1,
        position: 'relative',
        display: 'flex', flexDirection: 'column', gap: 14,
      }}
    >
      {/* round + select indicator */}
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'Archivo Black', fontSize: 13, color: '#999', letterSpacing: '0.05em' }}>
          ROUND {String(card.round).padStart(2, '0')}
        </span>
        <div style={{
          width: 32, height: 32,
          borderRadius: '50%',
          border: '3px solid var(--ink)',
          background: selected ? 'var(--ink)' : 'transparent',
          color: 'white',
          display: 'grid', placeItems: 'center',
          fontFamily: 'Archivo Black',
          fontSize: 14,
        }}>
          {selected ? compareIndex + 1 : ''}
        </div>
      </div>

      {/* Narrator + source */}
      <div className="row gap-8" style={{ flexWrap: 'wrap' }}>
        <NarratorBadge id={card.narrator} />
        <SourceTag id={card.source} />
      </div>

      {/* Tiles */}
      <div className="row gap-8" style={{ flexWrap: 'wrap' }}>
        {card.tiles.map((t) => <TileTag key={t} name={t} />)}
      </div>

      {/* Response text */}
      <p style={{
        margin: 0,
        fontSize: 15,
        lineHeight: 1.5,
        color: 'var(--ink-soft)',
        fontWeight: 500,
        display: '-webkit-box',
        WebkitLineClamp: 4,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>
        “{card.text}”
      </p>
    </div>
  );
}

function ComparePanel({ a, b, onClear }) {
  const diff = window.diffSpans(a, b);
  return (
    <div style={{
      background: 'var(--ink)',
      color: 'white',
      padding: '32px',
      margin: '0 32px 32px',
      maxWidth: 1216,
      marginLeft: 'auto',
      marginRight: 'auto',
      borderRadius: 24,
      border: '3px solid var(--ink)',
    }}>
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div className="row gap-16" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
          <h3 className="display" style={{ margin: 0, fontSize: 24 }}>LET'S COMPARE</h3>
          <div className="row gap-12" style={{ flexWrap: 'wrap' }}>
            {diff.narratorChanged && <DiffChip color="var(--coral)" label="NARRATOR" />}
            {diff.sourceChanged && <DiffChip color="var(--blue)" label="DATA SOURCE" />}
            {diff.tilesChanged && <DiffChip color="var(--green)" label="TILES" />}
            {!diff.narratorChanged && !diff.sourceChanged && !diff.tilesChanged && (
              <span style={{ fontSize: 13, opacity: 0.6 }}>Identical inputs · pure AI variance</span>
            )}
          </div>
        </div>
        <button
          onClick={onClear}
          style={{
            background: 'transparent',
            color: 'white',
            border: '2px solid white',
            borderRadius: 999,
            padding: '8px 16px',
            fontFamily: 'inherit',
            fontWeight: 700,
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          ✕ CLEAR
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <CompareCard card={a} index={1} />
        <CompareCard card={b} index={2} />
      </div>
    </div>
  );
}

function DiffChip({ color, label }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '5px 11px',
      background: color,
      color: 'var(--ink)',
      borderRadius: 6,
      fontWeight: 800,
      fontSize: 11,
      letterSpacing: '0.05em',
    }}>
      ◆ {label} CHANGED
    </span>
  );
}

function CompareCard({ card, index }) {
  return (
    <div style={{
      background: 'var(--paper)',
      color: 'var(--ink)',
      borderRadius: 16,
      padding: 22,
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
    }}>
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'Archivo Black', fontSize: 13, color: '#999' }}>
          ROUND {String(card.round).padStart(2, '0')}
        </span>
        <div style={{
          width: 28, height: 28,
          borderRadius: '50%',
          background: 'var(--ink)',
          color: 'white',
          display: 'grid', placeItems: 'center',
          fontFamily: 'Archivo Black',
          fontSize: 13,
        }}>{index}</div>
      </div>

      <div className="row gap-8" style={{ flexWrap: 'wrap' }}>
        <NarratorBadge id={card.narrator} />
        <SourceTag id={card.source} />
      </div>

      <div className="row gap-8" style={{ flexWrap: 'wrap' }}>
        {card.tiles.map((t) => <TileTag key={t} name={t} />)}
      </div>

      <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, fontWeight: 500 }}>
        “<HighlightedText text={card.text} highlights={window.HIGHLIGHT_MAP[card.id]} />”
      </p>
    </div>
  );
}

// ---------------- Flashcards ----------------

function FlashcardOverlay({ topic, onClose }) {
  const questions = React.useMemo(() => generateQuestions(topic), [topic]);
  const [idx, setIdx] = React.useState(0);
  const [drag, setDrag] = React.useState(0);
  const startX = React.useRef(null);

  const colors = [
    { bg: 'var(--yellow)', text: 'var(--ink)' },
    { bg: 'var(--blue)', text: 'white' },
    { bg: 'var(--coral)', text: 'white' },
  ];

  const next = () => setIdx((i) => Math.min(i + 1, questions.length - 1));
  const prev = () => setIdx((i) => Math.max(i - 1, 0));

  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const onPointerDown = (e) => { startX.current = e.clientX; };
  const onPointerMove = (e) => {
    if (startX.current == null) return;
    setDrag(e.clientX - startX.current);
  };
  const onPointerUp = () => {
    if (startX.current == null) return;
    if (drag < -80 && idx < questions.length - 1) next();
    else if (drag > 80 && idx > 0) prev();
    setDrag(0);
    startX.current = null;
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      background: 'rgba(26,26,26,0.9)',
      display: 'flex', flexDirection: 'column',
      padding: '40px 24px',
    }}>
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', maxWidth: 900, margin: '0 auto', width: '100%' }}>
        <div style={{ color: 'white', fontFamily: 'Archivo Black', letterSpacing: '0.05em' }}>
          QUESTION {idx + 1} / {questions.length}
        </div>
        <ChunkyButton color="var(--paper)" size="md" onClick={onClose}>✕ CLOSE</ChunkyButton>
      </div>

      <div
        style={{
          flex: 1,
          display: 'grid',
          placeItems: 'center',
          maxWidth: 900,
          width: '100%',
          margin: '0 auto',
          touchAction: 'pan-y',
          userSelect: 'none',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div style={{ position: 'relative', width: '100%', height: 'min(60vh, 500px)' }}>
          {questions.map((q, i) => {
            const offset = i - idx;
            const isCurrent = offset === 0;
            const c = colors[i % 3];
            return (
              <div
                key={i}
                className="flashcard"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: c.bg,
                  color: c.text,
                  transform: `translateX(calc(${offset * 110}% + ${isCurrent ? drag : 0}px)) rotate(${isCurrent ? drag * 0.04 : offset * 1.5}deg) scale(${isCurrent ? 1 : 0.96})`,
                  transition: startX.current == null ? 'transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
                  zIndex: questions.length - Math.abs(offset),
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  cursor: isCurrent ? 'grab' : 'default',
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.08em', opacity: 0.75, fontFamily: 'Space Grotesk' }}>
                  Q{String(i + 1).padStart(2, '0')}
                </div>
                <div style={{ textWrap: 'pretty' }}>{q}</div>
                <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', opacity: 0.7, fontFamily: 'Space Grotesk' }}>
                  ← SWIPE →
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="row" style={{ justifyContent: 'center', alignItems: 'center', gap: 18, maxWidth: 900, margin: '0 auto', width: '100%' }}>
        <ChunkyButton color="var(--paper)" size="md" onClick={prev} style={{ opacity: idx === 0 ? 0.4 : 1 }}>← PREV</ChunkyButton>
        <div className="row gap-8">
          {questions.map((_, i) => (
            <span key={i} style={{
              width: 14, height: 14, borderRadius: '50%',
              border: '2.5px solid white',
              background: i === idx ? 'white' : 'transparent',
            }}></span>
          ))}
        </div>
        <ChunkyButton color="var(--paper)" size="md" onClick={next} style={{ opacity: idx === questions.length - 1 ? 0.4 : 1 }}>NEXT →</ChunkyButton>
      </div>
    </div>
  );
}

function generateQuestions(topic) {
  const t = (topic || 'this topic').trim().replace(/[?.!]+$/, '');
  return [
    `Which narrator's version felt most TRUE to you, and why?`,
    `If you swapped the data source mid-game, how would the AI's answer about "${t}" change?`,
    `Whose voice is missing from these stories — and what tile would you add to bring them in?`,
  ];
}

window.ScreenCompare = ScreenCompare;
