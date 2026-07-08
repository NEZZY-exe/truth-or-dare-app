import { truths as coupleT, dares as coupleD } from "./couples";
import { truths as friendT, dares as friendD } from "./friends";
import { truths as partyT, dares as partyD } from "./party";
import { truths as familyT, dares as familyD } from "./family";

export type Mode = "couples" | "friends" | "party" | "family" | "custom";

export const MODES: {
  id: Mode;
  label: string;
  icon: string;
  tag: string;
  gradient: string;
  emoji: string;
}[] = [
  { id: "couples", label: "Couples", icon: "bi-heart-fill", tag: "For two", emoji: "❤️", gradient: "from-rose-400/40 to-cyan-400/30" },
  { id: "friends", label: "Friends", icon: "bi-people-fill", tag: "Squad up", emoji: "👥", gradient: "from-cyan-400/40 to-sky-500/30" },
  { id: "party", label: "Party", icon: "bi-stars", tag: "Turn it up", emoji: "🎉", gradient: "from-fuchsia-400/40 to-cyan-400/30" },
  { id: "family", label: "Family", icon: "bi-house-heart-fill", tag: "All ages", emoji: "👨‍👩‍👧", gradient: "from-emerald-300/40 to-cyan-400/30" },
  { id: "custom", label: "Custom", icon: "bi-lock-fill", tag: "Your rules", emoji: "🔒", gradient: "from-sky-400/40 to-indigo-400/30" },
];

export const BUILT_IN: Record<Exclude<Mode, "custom">, { truths: string[]; dares: string[] }> = {
  couples: { truths: coupleT, dares: coupleD },
  friends: { truths: friendT, dares: friendD },
  party: { truths: partyT, dares: partyD },
  family: { truths: familyT, dares: familyD },
};
