function ScreenCharacters({ onBack }) {
  return (
    <div className="col" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div className="topbar" style={{ padding: 'clamp(14px,3vw,22px) clamp(16px,4vw,32px)', borderBottom: '3.5px solid var(--ink)', background: 'var(--bg)' }}>
        <Logo />
        <ChunkyButton color="var(--paper)" size="md" onClick={onBack}>← BACK</ChunkyButton>
      </div>

      <div className="col center" style={{ flex: 1, padding: '40px clamp(16px,4vw,32px)' }}>
        <h1 className="display" style={{ fontSize: 'clamp(36px,5vw,64px)', lineHeight: 0.95, letterSpacing: '-0.02em', textAlign: 'center', marginBottom: 12 }}>
          Meet your<br />
          <span style={{ background: 'var(--yellow)', padding: '4px 18px', border: '3.5px solid var(--ink)', borderRadius: 14, display: 'inline-block', transform: 'rotate(-1.5deg)', marginTop: 8 }}>narrators</span>
        </h1>

        <p style={{ fontSize: 'clamp(15px,2.5vw,18px)', color: 'var(--ink-soft)', margin: '28px auto 40px', maxWidth: 480, fontWeight: 500, textAlign: 'center' }}>
          Three minds. Three ways of seeing the world. Tap play to hear their voice.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, width: '100%', maxWidth: 780 }}>
          <CharacterCard
            color="#60B8FF"
            bgColor="#E6F1FB"
            name="BLUE"
            tagline="Calm and logical. Thinks carefully. Always sticks to the facts."
            audioSrc="assets/fact.mp3"
            rotate="-1.5deg"
          />
          <CharacterCard
            color="#A875F5"
            bgColor="#EEEDFE"
            name="PURPLE"
            tagline="Full of ideas and big questions. Loves finding surprising things."
            audioSrc="assets/magic.mp3"
            rotate="1.2deg"
          />
          <CharacterCard
            color="#FFD23F"
            bgColor="#FAEEDA"
            name="YELLOW"
            tagline="Short, punchy, full of energy. Honest and always uplifting."
            audioSrc="assets/energetic.mp3"
            rotate="-0.8deg"
          />
        </div>
      </div>
    </div>
  );
}

function CharacterCard({ color, bgColor, name, tagline, audioSrc, rotate }) {
  const [playing, setPlaying] = React.useState(false);
  const audioRef = React.useRef(null);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      audio.currentTime = 0;
      setPlaying(false);
    } else {
      document.querySelectorAll('audio').forEach(a => { a.pause(); a.currentTime = 0; });
      document.querySelectorAll('.__playing').forEach(b => b.classList.remove('__playing'));
      audio.play();
      setPlaying(true);
    }
  };

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnd = () => setPlaying(false);
    audio.addEventListener('ended', onEnd);
    return () => audio.removeEventListener('ended', onEnd);
  }, []);

  return (
    <div className="chunk" style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, background: 'var(--paper)', transform: `rotate(${rotate})` }}>
      <audio ref={audioRef} src={audioSrc} />

      <div style={{ width: 80, height: 80, borderRadius: '50%', background: bgColor, border: '3.5px solid var(--ink)', boxShadow: '3px 3px 0 0 var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: color, border: '2.5px solid var(--ink)' }} />
      </div>

      <div style={{ fontFamily: 'Archivo Black', fontSize: 22, letterSpacing: '0.04em' }}>{name}</div>

      <p style={{ fontSize: 14, color: 'var(--ink-soft)', textAlign: 'center', lineHeight: 1.5, fontWeight: 500, margin: 0 }}>
        {tagline}
      </p>

      <ChunkyButton
        onClick={toggle}
        color={playing ? 'var(--ink)' : color}
        textColor={playing ? 'white' : 'var(--ink)'}
        size="md"
        style={{ width: '100%' }}
      >
        {playing ? '■ STOP' : '▶ PLAY VOICE'}
      </ChunkyButton>
    </div>
  );
}

window.ScreenCharacters = ScreenCharacters;
