import { RippleButton } from "./RippleButton";

type Props = { onPick: (kind: "truth" | "dare" | "random") => void };

export function GameButtons({ onPick }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 w-full">
      <RippleButton
        onClick={() => onPick("truth")}
        className="glass-strong rounded-2xl py-5 font-semibold text-lg glow-cyan border border-cyan/40"
        aria-label="Pick a truth"
      >
        <i className="bi bi-chat-quote-fill mr-2 text-cyan" />
        Truth
      </RippleButton>
      <RippleButton
        onClick={() => onPick("dare")}
        className="glass-strong rounded-2xl py-5 font-semibold text-lg border border-aqua/40"
        style={{ boxShadow: "0 0 30px oklch(0.85 0.15 190 / 45%)" }}
        aria-label="Pick a dare"
      >
        <i className="bi bi-fire mr-2 text-aqua" />
        Dare
      </RippleButton>
      <RippleButton
        onClick={() => onPick("random")}
        className="col-span-2 animated-gradient rounded-2xl py-5 font-bold text-lg text-primary-foreground glow-cyan"
        aria-label="Random pick"
      >
        <i className="bi bi-shuffle mr-2" />
        Random
      </RippleButton>
    </div>
  );
}
