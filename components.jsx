// Shared chunky components

function Logo({ size = 'md' }) {
  const small = size === 'sm';
  const dim = small ? 28 : 36;
  return (
    <div className="logo" style={{ fontSize: small ? 16 : 22 }}>
      <img src="snapsys_logo.svg" width={dim} height={dim} alt="SnapSys" style={{ display: 'block' }} />
      <span>SNAPSYS</span>
    </div>
  );
}

function ChunkyButton({ children, onClick, color = 'var(--yellow)', size = 'lg', textColor = 'var(--ink)', style = {}, type = 'button' }) {
  const sizes = {
    sm: { padding: '12px 20px', fontSize: 14, radius: 12 },
    md: { padding: '16px 28px', fontSize: 16, radius: 14 },
    lg: { padding: '24px 40px', fontSize: 22, radius: 18 },
    xl: { padding: '32px 56px', fontSize: 28, radius: 22 },
  };
  const s = sizes[size];
  return (
    <button
      type={type}
      onClick={onClick}
      className="chunk-btn display"
      style={{
        background: color,
        color: textColor,
        padding: s.padding,
        fontSize: s.fontSize,
        borderRadius: s.radius,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function Pill({ children, color, textColor = 'var(--ink)', icon = null }) {
  return (
    <span className="pill" style={{ background: color, color: textColor }}>
      {icon && <span style={{ fontSize: 14 }}>{icon}</span>}
      {children}
    </span>
  );
}

function NarratorBadge({ id, large = false }) {
  const n = window.NARRATORS[id];
  return (
    <div
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        padding: large ? '10px 18px' : '6px 14px',
        background: n.bg,
        border: '2px solid var(--ink)',
        borderRadius: 999,
        fontWeight: 800,
        fontSize: large ? 16 : 13,
      }}
    >
      <span style={{ fontSize: large ? 22 : 16, color: n.color }}>{n.emoji}</span>
      {n.name}
    </div>
  );
}

function SourceTag({ id }) {
  const s = window.SOURCES[id];
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '5px 11px',
        background: s.color,
        color: 'white',
        border: '2px solid var(--ink)',
        borderRadius: 8,
        fontWeight: 800,
        fontSize: 12,
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
      }}
    >
      {s.name}
    </span>
  );
}

function TileTag({ name }) {
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center',
        padding: '5px 11px',
        background: 'var(--green)',
        color: 'var(--ink)',
        border: '2px solid var(--ink)',
        borderRadius: 6,
        fontWeight: 700,
        fontSize: 12,
      }}
    >
      #{name}
    </span>
  );
}

// Render text with highlight spans
function HighlightedText({ text, highlights }) {
  if (!highlights || (!highlights.narrator?.length && !highlights.source?.length && !highlights.tiles?.length)) {
    return <span>{text}</span>;
  }
  // Build all matches
  const all = [];
  ['narrator', 'source', 'tiles'].forEach((kind) => {
    (highlights[kind] || []).forEach((phrase) => {
      const idx = text.indexOf(phrase);
      if (idx >= 0) all.push({ start: idx, end: idx + phrase.length, kind });
    });
  });
  all.sort((a, b) => a.start - b.start);
  // Merge overlaps (keep first)
  const filtered = [];
  let lastEnd = -1;
  for (const m of all) {
    if (m.start >= lastEnd) {
      filtered.push(m);
      lastEnd = m.end;
    }
  }
  // Walk text
  const out = [];
  let cursor = 0;
  filtered.forEach((m, i) => {
    if (cursor < m.start) out.push(<span key={`t${i}`}>{text.slice(cursor, m.start)}</span>);
    out.push(<mark key={`m${i}`} className={`diff-${m.kind}`}>{text.slice(m.start, m.end)}</mark>);
    cursor = m.end;
  });
  if (cursor < text.length) out.push(<span key="end">{text.slice(cursor)}</span>);
  return <>{out}</>;
}

Object.assign(window, {
  Logo, ChunkyButton, Pill, NarratorBadge, SourceTag, TileTag, HighlightedText,
});
