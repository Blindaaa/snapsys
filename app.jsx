// App shell + tweaks

const TWEAK_DEFAULTS = { ...window.__TWEAK_DEFAULTS, shadowSize: window.__TWEAK_DEFAULTS.shadowSize ?? 4, borderWidth: window.__TWEAK_DEFAULTS.borderWidth ?? 3 };

const ACCENT_PRESETS = {
  yellow: { yellow: '#FFD23F', coral: '#FF6B5C', blue: '#3D8BFD', green: '#5BC079', purple: '#A875F5' },
  coral:  { yellow: '#FF6B5C', coral: '#FFD23F', blue: '#3D8BFD', green: '#5BC079', purple: '#A875F5' },
  blue:   { yellow: '#3D8BFD', coral: '#FF6B5C', blue: '#FFD23F', green: '#5BC079', purple: '#A875F5' },
  green:  { yellow: '#5BC079', coral: '#FF6B5C', blue: '#3D8BFD', green: '#FFD23F', purple: '#A875F5' },
};

const BG_PRESETS = {
  cream:    { bg: '#FFF6E5', ink: '#1A1A1A', paper: '#FFFFFF', soft: '#2D2D2D' },
  mint:     { bg: '#E5F5EC', ink: '#1A1A1A', paper: '#FFFFFF', soft: '#2D2D2D' },
  paper:    { bg: '#F5F1EA', ink: '#1A1A1A', paper: '#FFFFFF', soft: '#2D2D2D' },
  dark:     { bg: '#1F1F22', ink: '#FFFFFF', paper: '#2C2C30', soft: '#E0E0E0' },
};

function App() {
  const [tweaks, setTweak] = window.useTweaks(TWEAK_DEFAULTS);
  const [screen, setScreen] = React.useState('setup');
  const [topic, setTopic] = React.useState('Climate change in coastal cities');

  // Apply tweaks to CSS vars
  React.useEffect(() => {
    const root = document.documentElement;
    const accent = ACCENT_PRESETS[tweaks.accent] || ACCENT_PRESETS.yellow;
    Object.entries(accent).forEach(([k, v]) => root.style.setProperty(`--${k}`, v));
    const bg = BG_PRESETS[tweaks.background] || BG_PRESETS.cream;
    root.style.setProperty('--bg', bg.bg);
    root.style.setProperty('--ink', bg.ink);
    root.style.setProperty('--ink-soft', bg.soft);
    root.style.setProperty('--paper', bg.paper);
    root.style.setProperty('--shadow-offset', `${tweaks.shadowSize}px`);
    root.style.setProperty('--border-w', `${tweaks.borderWidth}px`);
  }, [tweaks]);

  const handleStart = (t) => {
    setTopic(t);
    setScreen('compare');
  };

  return (
    <>
      {screen === 'setup' && <ScreenSetup onStart={handleStart} />}
      {screen === 'compare' && <ScreenCompare topic={topic} onReset={() => setScreen('setup')} />}

      {/* Tweaks panel */}
      <window.TweaksPanel title="TWEAKS">
        <window.TweakSection label="Color">
          <window.TweakRadio
            label="Accent"
            value={tweaks.accent}
            onChange={(v) => setTweak('accent', v)}
            options={[
              { value: 'yellow', label: 'Yellow' },
              { value: 'coral', label: 'Coral' },
              { value: 'blue', label: 'Blue' },
              { value: 'green', label: 'Green' },
            ]}
          />
          <window.TweakRadio
            label="Background"
            value={tweaks.background}
            onChange={(v) => setTweak('background', v)}
            options={[
              { value: 'cream', label: 'Cream' },
              { value: 'mint', label: 'Mint' },
              { value: 'paper', label: 'Paper' },
              { value: 'dark', label: 'Dark' },
            ]}
          />
        </window.TweakSection>
        <window.TweakSection label="Chunkiness">
          <window.TweakSlider label="Shadow" value={tweaks.shadowSize} min={2} max={12} step={1} onChange={(v) => setTweak('shadowSize', v)} unit="px" />
          <window.TweakSlider label="Border" value={tweaks.borderWidth} min={1.5} max={6} step={0.5} onChange={(v) => setTweak('borderWidth', v)} unit="px" />
        </window.TweakSection>
      </window.TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
