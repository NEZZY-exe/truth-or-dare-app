import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { FloatingParticles } from "../components/FloatingParticles";
import { RippleButton } from "../components/RippleButton";
import { useLocalStorage } from "../hooks/useLocalStorage";

export const Route = createFileRoute("/custom")({
  component: Custom,
});

type Q = { id: string; text: string };
type Store = { truths: Q[]; dares: Q[] };

function Custom() {
  const navigate = useNavigate();
  const [store, setStore] = useLocalStorage<Store>("tod:custom", { truths: [], dares: [] });
  const [tab, setTab] = useState<"truths" | "dares">("truths");
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && !sessionStorage.getItem("tod:custom-unlocked")) {
      navigate({ to: "/lock" });
    }
  }, [navigate]);

  const list = store[tab];
  const filtered = useMemo(
    () => (search ? list.filter((q) => q.text.toLowerCase().includes(search.toLowerCase())) : list),
    [list, search]
  );

  function save() {
    const text = draft.trim();
    if (!text) return;
    setStore((s) => {
      const copy = { ...s, [tab]: [...s[tab]] };
      if (editingId) {
        copy[tab] = copy[tab].map((q) => (q.id === editingId ? { ...q, text } : q));
      } else {
        copy[tab] = [{ id: crypto.randomUUID(), text }, ...copy[tab]];
      }
      return copy;
    });
    setDraft("");
    setEditingId(null);
  }

  function remove(id: string) {
    setStore((s) => ({ ...s, [tab]: s[tab].filter((q) => q.id !== id) }));
  }

  function edit(q: Q) {
    setEditingId(q.id);
    setDraft(q.text);
  }

  return (
    <div className="relative min-h-screen wave-bg overflow-hidden pb-24">
      <FloatingParticles count={10} />
      <div className="relative z-10 mx-auto max-w-md px-5 pt-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate({ to: "/" })} className="glass rounded-full w-10 h-10 flex items-center justify-center" aria-label="Home">
            <i className="bi bi-chevron-left" />
          </button>
          <h1 className="text-xl font-bold gradient-text">Custom Vault</h1>
          <Link to="/game/$mode" params={{ mode: "custom" }} className="glass rounded-full px-3 h-10 flex items-center gap-1 text-sm" aria-label="Play custom">
            <i className="bi bi-play-fill" /> Play
          </Link>
        </div>

        <div className="glass rounded-2xl p-1 flex mb-4">
          {(["truths", "dares"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold capitalize transition relative ${
                tab === t ? "text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {tab === t && (
                <motion.div layoutId="tab-bg" className="absolute inset-0 animated-gradient rounded-xl -z-10" />
              )}
              <i className={`bi ${t === "truths" ? "bi-chat-quote-fill" : "bi-fire"} mr-1`} />
              {t} ({store[t].length})
            </button>
          ))}
        </div>

        <div className="glass-strong rounded-2xl p-4 mb-4">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`Write a ${tab === "truths" ? "truth" : "dare"}…`}
            rows={2}
            className="w-full bg-input/50 rounded-xl p-3 outline-none focus:ring-2 focus:ring-cyan/40 resize-none"
          />
          <div className="flex gap-2 mt-2">
            {editingId && (
              <button onClick={() => { setEditingId(null); setDraft(""); }} className="glass rounded-xl px-4 py-2 text-sm">
                Cancel
              </button>
            )}
            <RippleButton onClick={save} className="flex-1 animated-gradient rounded-xl py-2.5 font-semibold text-primary-foreground">
              <i className={`bi ${editingId ? "bi-check-lg" : "bi-plus-lg"} mr-1`} />
              {editingId ? "Update" : "Add"}
            </RippleButton>
          </div>
        </div>

        <div className="relative mb-3">
          <i className="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-input/50 outline-none focus:ring-2 focus:ring-cyan/40"
          />
        </div>

        <div className="space-y-2">
          <AnimatePresence>
            {filtered.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass rounded-2xl p-8 text-center text-muted-foreground text-sm">
                {list.length === 0 ? `No ${tab} yet — add your first!` : "No matches."}
              </motion.div>
            ) : (
              filtered.map((q) => (
                <motion.div
                  key={q.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  className="glass rounded-2xl p-4 flex items-start gap-3"
                >
                  <p className="flex-1 text-sm leading-relaxed">{q.text}</p>
                  <div className="flex gap-1">
                    <button onClick={() => edit(q)} className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center" aria-label="Edit">
                      <i className="bi bi-pencil text-cyan" />
                    </button>
                    <button onClick={() => remove(q.id)} className="w-8 h-8 rounded-full hover:bg-destructive/20 flex items-center justify-center" aria-label="Delete">
                      <i className="bi bi-trash text-destructive" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
