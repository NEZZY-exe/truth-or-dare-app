import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { MODES } from "../data/questions";

export function ModeCarousel() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-8, 0, 8]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") setIndex((i) => Math.min(MODES.length - 1, i + 1));
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(0, i - 1));
      if (e.key === "Enter") select(MODES[index].id);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  function select(id: string) {
    if (id === "custom") navigate({ to: "/lock" });
    else navigate({ to: "/game/$mode", params: { mode: id } });
  }

  function onDragEnd(_: unknown, info: PanInfo) {
    const threshold = 80;
    if (info.offset.x < -threshold && index < MODES.length - 1) setIndex(index + 1);
    else if (info.offset.x > threshold && index > 0) setIndex(index - 1);
  }

  return (
    <div className="relative w-full max-w-md mx-auto select-none">
      <div className="relative h-[440px] flex items-center justify-center">
        <AnimatePresence mode="popLayout" initial={false}>
          {MODES.map((mode, i) => {
            const offset = i - index;
            if (Math.abs(offset) > 1) return null;
            const isActive = offset === 0;
            return (
              <motion.button
                key={mode.id}
                layout
                drag={isActive ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.35}
                onDragEnd={onDragEnd}
                style={isActive ? { x, rotate } : undefined}
                initial={{ opacity: 0, scale: 0.8, x: offset * 220 }}
                animate={{
                  opacity: isActive ? 1 : 0.35,
                  scale: isActive ? 1 : 0.82,
                  x: offset * 220,
                  filter: isActive ? "blur(0px)" : "blur(2px)",
                }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                onClick={() => isActive && select(mode.id)}
                className="glass-strong absolute w-72 h-96 rounded-[28px] flex flex-col items-center justify-between p-8 cursor-grab active:cursor-grabbing"
                aria-label={`${mode.label} mode`}
              >
                <div className={`absolute inset-0 rounded-[28px] bg-gradient-to-br ${mode.gradient} opacity-60 -z-10`} />
                <span className="text-xs uppercase tracking-[0.25em] text-cyan/90">{mode.tag}</span>

                <motion.div
                  animate={isActive ? { y: [0, -10, 0], rotate: [0, 5, -5, 0] } : {}}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="text-7xl" aria-hidden>{mode.emoji}</div>
                  <i className={`bi ${mode.icon} text-4xl text-cyan text-glow`} aria-hidden />
                </motion.div>

                <div className="flex flex-col items-center gap-3 w-full">
                  <h2 className="text-3xl font-bold gradient-text">{mode.label}</h2>
                  <div className="text-xs text-muted-foreground text-center px-4">
                    {mode.id === "custom" ? "Your private question vault" : "Curated for the vibe"}
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="play-indicator"
                      className="mt-2 flex items-center gap-2 rounded-full px-4 py-2 animated-gradient text-primary-foreground text-sm font-semibold glow-cyan"
                    >
                      <i className="bi bi-play-fill" /> Tap to play
                    </motion.div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        {MODES.map((m, i) => (
          <button
            key={m.id}
            onClick={() => setIndex(i)}
            aria-label={`Go to ${m.label}`}
            className={`h-1.5 rounded-full transition-all ${i === index ? "w-8 bg-cyan glow-cyan" : "w-1.5 bg-white/25"}`}
          />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between px-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1"><i className="bi bi-arrow-left-short" /> Swipe</span>
        <span>Arrow keys work too</span>
        <span className="inline-flex items-center gap-1">Swipe <i className="bi bi-arrow-right-short" /></span>
      </div>
    </div>
  );
}
