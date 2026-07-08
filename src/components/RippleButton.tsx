import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef, useState, type MouseEvent, type ReactNode } from "react";

type Props = Omit<HTMLMotionProps<"button">, "children"> & {
  children: ReactNode;
  className?: string;
};

export const RippleButton = forwardRef<HTMLButtonElement, Props>(function RippleButton(
  { children, className = "", onClick, ...rest },
  ref
) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now() + Math.random();
    setRipples((r) => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 700);
    onClick?.(e);
  }

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      onClick={handleClick}
      className={`relative overflow-hidden ${className}`}
      {...rest}
    >
      {children}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="pointer-events-none absolute rounded-full bg-white/40"
          style={{
            left: r.x,
            top: r.y,
            width: 10,
            height: 10,
            transform: "translate(-50%, -50%)",
            animation: "ripple 0.7s ease-out forwards",
          }}
        />
      ))}
      <style>{`@keyframes ripple { to { width: 400px; height: 400px; opacity: 0; } }`}</style>
    </motion.button>
  );
});
