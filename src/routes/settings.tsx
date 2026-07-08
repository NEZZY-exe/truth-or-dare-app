import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FloatingParticles } from "../components/FloatingParticles";
import { useLocalStorage } from "../hooks/useLocalStorage";

export const Route = createFileRoute("/settings")({
  component: Settings,
});

type Prefs = { sound: boolean; music: boolean; volume: number };

function Settings() {
  const navigate = useNavigate();
  const [prefs, setPrefs] = useLocalStorage<Prefs>("tod:prefs", { sound: true, music: false, volume: 0.5 });

  return (
    <div className="relative min-h-screen wave-bg overflow-hidden pb-16">
      <FloatingParticles count={10} />
      <div className="relative z-10 mx-auto max-w-md px-5 pt-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate({ to: "/" })} className="glass rounded-full w-10 h-10 flex items-center justify-center" aria-label="Back">
            <i className="bi bi-chevron-left" />
          </button>
          <h1 className="text-xl font-bold gradient-text">Settings</h1>
          <div className="w-10 h-10" />
        </div>

        <div className="space-y-3">
          <Toggle label="Sound effects" icon="bi-volume-up-fill" value={prefs.sound} onChange={(v) => setPrefs({ ...prefs, sound: v })} />
          <Toggle label="Background music" icon="bi-music-note-beamed" value={prefs.music} onChange={(v) => setPrefs({ ...prefs, music: v })} />

          <div className="glass-strong rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <i className="bi bi-sliders text-cyan" />
              <span className="flex-1 font-semibold">Volume</span>
              <span className="text-sm text-muted-foreground tabular-nums">{Math.round(prefs.volume * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={prefs.volume}
              onChange={(e) => setPrefs({ ...prefs, volume: parseFloat(e.target.value) })}
              className="w-full accent-cyan"
            />
          </div>

          <div className="glass rounded-2xl p-4 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground mb-1">About</p>
            <p>Ocean · Truth or Dare. Built for late-night vibes.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Toggle({ label, icon, value, onChange }: { label: string; icon: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="glass-strong w-full rounded-2xl p-4 flex items-center gap-3"
      aria-pressed={value}
    >
      <i className={`bi ${icon} text-cyan text-lg`} />
      <span className="flex-1 text-left font-semibold">{label}</span>
      <span
        className={`w-12 h-7 rounded-full flex items-center transition-all ${
          value ? "animated-gradient glow-cyan justify-end" : "bg-input justify-start"
        } px-1`}
      >
        <span className="w-5 h-5 rounded-full bg-white shadow-lg" />
      </span>
    </button>
  );
}
