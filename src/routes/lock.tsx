import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { FloatingParticles } from "../components/FloatingParticles";
import { RippleButton } from "../components/RippleButton";
import { useLocalStorage } from "../hooks/useLocalStorage";

export const Route = createFileRoute("/lock")({
  component: Lock,
});

const DEFAULT_PIN = "1234";

function Lock() {
  const navigate = useNavigate();
  const [pin, setPin] = useLocalStorage<string>("tod:custom-pin", DEFAULT_PIN);
  const [entry, setEntry] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(0);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (entry === pin) {
      sessionStorage.setItem("tod:custom-unlocked", "1");
      navigate({ to: "/custom" });
    } else {
      setError(true);
      setShake((s) => s + 1);
      setTimeout(() => setError(false), 1200);
    }
  }

  return (
    <div className="relative min-h-screen wave-bg overflow-hidden flex items-center justify-center px-5">
      <FloatingParticles count={14} />
      <motion.form
        key={shake}
        onSubmit={submit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, x: error ? [0, -10, 10, -8, 8, 0] : 0 }}
        transition={{ duration: 0.5 }}
        className="glass-strong rounded-[28px] p-8 w-full max-w-sm relative z-10"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl animated-gradient flex items-center justify-center glow-cyan">
            <i className="bi bi-lock-fill text-2xl text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center gradient-text">Custom Vault</h1>
        <p className="text-sm text-muted-foreground text-center mt-1">Enter your PIN to continue</p>

        <input
          type="password"
          inputMode="numeric"
          autoFocus
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="••••"
          aria-label="PIN"
          className="mt-6 w-full text-center text-2xl tracking-[0.5em] bg-input/60 border border-white/10 rounded-2xl py-4 outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/40 transition"
        />
        {error && <p className="text-destructive text-sm text-center mt-2">Incorrect PIN</p>}

        <RippleButton type="submit" className="mt-6 w-full animated-gradient rounded-2xl py-4 font-bold text-primary-foreground glow-cyan">
          <i className="bi bi-unlock-fill mr-2" /> Unlock
        </RippleButton>

        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          className="mt-3 w-full text-xs text-muted-foreground hover:text-foreground transition"
        >
          ← Back to modes
        </button>

        <details className="mt-6 text-xs text-muted-foreground">
          <summary className="cursor-pointer">Change PIN</summary>
          <ChangePin currentPin={pin} onSave={setPin} />
        </details>
      </motion.form>
    </div>
  );
}

function ChangePin({ currentPin, onSave }: { currentPin: string; onSave: (p: string) => void }) {
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <div className="mt-3 space-y-2">
      <input value={cur} onChange={(e) => setCur(e.target.value)} type="password" placeholder="Current PIN" className="w-full bg-input/60 rounded-xl px-3 py-2 outline-none" />
      <input value={next} onChange={(e) => setNext(e.target.value)} type="password" placeholder="New PIN" className="w-full bg-input/60 rounded-xl px-3 py-2 outline-none" />
      <button
        type="button"
        onClick={() => {
          if (cur !== currentPin) return setMsg("Wrong current PIN");
          if (next.length < 3) return setMsg("PIN too short");
          onSave(next);
          setMsg("Updated!");
          setCur("");
          setNext("");
        }}
        className="w-full glass rounded-xl py-2 text-foreground"
      >
        Save
      </button>
      {msg && <p className="text-center">{msg}</p>}
      <p className="text-center opacity-60">Default PIN: 1234</p>
    </div>
  );
}
