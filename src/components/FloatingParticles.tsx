import { motion } from "framer-motion";
import { useMemo } from "react";

export function FloatingParticles({ count = 18 }: { count?: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 3 + Math.random() * 7,
        duration: 12 + Math.random() * 14,
        delay: Math.random() * -20,
        opacity: 0.15 + Math.random() * 0.35,
      })),
    [count]
  );

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full bg-cyan/60 blur-[1px]"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animation: `float-particle ${p.duration}s linear ${p.delay}s infinite`,
            boxShadow: "0 0 12px oklch(0.82 0.18 210 / 70%)",
          }}
        />
      ))}
      <motion.div
        className="absolute -top-40 -right-40 h-[60vw] w-[60vw] rounded-full"
        style={{ background: "radial-gradient(circle, oklch(0.55 0.22 220 / 35%), transparent 70%)", filter: "blur(50px)" }}
        animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 -left-40 h-[60vw] w-[60vw] rounded-full"
        style={{ background: "radial-gradient(circle, oklch(0.6 0.2 190 / 30%), transparent 70%)", filter: "blur(50px)" }}
        animate={{ x: [0, 20, 0], y: [0, 30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
