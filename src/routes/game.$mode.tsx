import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import { FloatingParticles } from "../components/FloatingParticles";
import { GameButtons } from "../components/GameButtons";
import { QuestionCard } from "../components/QuestionCard";
import { RippleButton } from "../components/RippleButton";
import { BUILT_IN, MODES, type Mode } from "../data/questions";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useShuffledPool } from "../hooks/useShuffledPool";

export const Route = createFileRoute("/game/$mode")({
  component: Game,
});

type CustomStore = { truths: { id: string; text: string }[]; dares: { id: string; text: string }[] };

function Game() {
  const { mode } = useParams({ from: "/game/$mode" }) as { mode: Mode };
  const navigate = useNavigate();
  const modeMeta = MODES.find((m) => m.id === mode) ?? MODES[0];

  const [custom] = useLocalStorage<CustomStore>("tod:custom", { truths: [], dares: [] });

  const { truths, dares } = useMemo(() => {
    if (mode === "custom")
      return {
        truths: custom.truths.map((q) => q.text),
        dares: custom.dares.map((q) => q.text),
      };
    return BUILT_IN[mode as Exclude<Mode, "custom">] ?? { truths: [], dares: [] };
  }, [mode, custom]);

  const truthPool = useShuffledPool(truths);
  const darePool = useShuffledPool(dares);

  const [current, setCurrent] = useState<{ text: string; kind: "truth" | "dare" } | null>(null);
  const [history, setHistory] = useState<{ text: string; kind: "truth" | "dare" }[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  const pick = useCallback(
    (kind: "truth" | "dare" | "random") => {
      const resolved = kind === "random" ? (Math.random() < 0.5 ? "truth" : "dare") : kind;
      const pool = resolved === "truth" ? truthPool : darePool;
      const list = resolved === "truth" ? truths : dares;
      if (list.length === 0) {
        setCurrent({ text: `No ${resolved} questions yet. Add some in Custom mode.`, kind: resolved });
        return;
      }
      const text = pool.next();
      const entry = { text, kind: resolved };
      setCurrent(entry);
      setHistory((h) => {
        const next = [...h.slice(0, historyIdx + 1), entry];
        setHistoryIdx(next.length - 1);
        return next;
      });
    },
    [truthPool, darePool, truths, dares, historyIdx]
  );

  function back() {
    if (historyIdx > 0) {
      setHistoryIdx((i) => i - 1);
      setCurrent(history[historyIdx - 1]);
    }
  }
  function forward() {
    if (historyIdx < history.length - 1) {
      setHistoryIdx((i) => i + 1);
      setCurrent(history[historyIdx + 1]);
    } else if (current) {
      pick(current.kind);
    }
  }

  return (
    <div className="relative min-h-screen wave-bg overflow-hidden pb-10">
      <FloatingParticles count={12} />
      <div className="relative z-10 mx-auto max-w-md px-5 pt-6 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate({ to: "/" })}
            className="glass rounded-full w-10 h-10 flex items-center justify-center"
            aria-label="Back to modes"
          >
            <i className="bi bi-chevron-left" />
          </button>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 glass rounded-full px-4 py-1.5"
          >
            <span>{modeMeta.emoji}</span>
            <span className="text-sm font-semibold">{modeMeta.label}</span>
          </motion.div>
          {mode === "custom" ? (
            <Link to="/custom" className="glass rounded-full w-10 h-10 flex items-center justify-center" aria-label="Manage questions">
              <i className="bi bi-pencil-square" />
            </Link>
          ) : (
            <div className="w-10 h-10" />
          )}
        </div>

        <QuestionCard text={current?.text ?? null} kind={current?.kind ?? null} />

        <GameButtons onPick={pick} />

        <div className="flex items-center justify-between gap-3">
          <RippleButton
            onClick={back}
            disabled={historyIdx <= 0}
            className="glass rounded-full px-5 py-3 flex items-center gap-2 disabled:opacity-40"
          >
            <i className="bi bi-arrow-left" /> Back
          </RippleButton>
          <div className="text-xs text-muted-foreground tabular-nums">
            {history.length > 0 ? `${historyIdx + 1} / ${history.length}` : "—"}
          </div>
          <RippleButton
            onClick={forward}
            disabled={!current}
            className="glass rounded-full px-5 py-3 flex items-center gap-2 disabled:opacity-40"
          >
            Next <i className="bi bi-arrow-right" />
          </RippleButton>
        </div>
      </div>
    </div>
  );
}
