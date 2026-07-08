import { motion, AnimatePresence } from "framer-motion";

export function QuestionCard({ text, kind }: { text: string | null; kind: "truth" | "dare" | null }) {
  return (
    <div className="relative w-full min-h-[220px]">
      <AnimatePresence mode="wait">
        {text ? (
          <motion.div
            key={text}
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="glass-strong rounded-[28px] p-8 w-full"
          >
            <div className="flex items-center gap-2 mb-4">
              <span
                className={`text-xs uppercase tracking-[0.3em] font-semibold ${
                  kind === "truth" ? "text-cyan" : "text-aqua"
                }`}
              >
                <i className={`bi ${kind === "truth" ? "bi-chat-quote-fill" : "bi-fire"} mr-1`} />
                {kind}
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-cyan/50 to-transparent" />
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="text-2xl md:text-3xl font-semibold leading-snug tracking-tight text-glow"
            >
              {text}
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass rounded-[28px] p-10 w-full text-center"
          >
            <div className="text-5xl mb-3">🌊</div>
            <p className="text-muted-foreground">Pick Truth, Dare, or Random to begin.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
