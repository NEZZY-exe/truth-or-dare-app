import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FloatingParticles } from "../components/FloatingParticles";
import { ModeCarousel } from "../components/ModeCarousel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ocean · Truth or Dare" },
      { name: "description", content: "A premium mobile Truth or Dare experience with modes for couples, friends, party, family, and custom." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="relative min-h-screen wave-bg overflow-hidden pb-16">
      <FloatingParticles />
      <div className="relative z-10 mx-auto max-w-md px-5 pt-10">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl animated-gradient flex items-center justify-center glow-cyan">
              <i className="bi bi-droplet-fill text-primary-foreground text-lg" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">Abyss</span>
          </div>
          <Link
            to="/settings"
            className="glass rounded-full w-10 h-10 flex items-center justify-center"
            aria-label="Settings"
          >
            <i className="bi bi-gear-fill" />
          </Link>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-center mb-6"
        >
          <h1 className="text-4xl font-bold tracking-tight gradient-text">Truth or Dare</h1>
          <p className="text-sm text-muted-foreground mt-2">Choose your tide</p>
        </motion.div>

        <ModeCarousel />
      </div>
    </div>
  );
}
