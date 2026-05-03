import { useRef } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  motivation: string;
  color: string;
  onChange: (motivation: string, color: string) => void;
}

const COLORS = [
  "#a78bfa", // violet
  "#c4b5fd", // light violet
  "#f472b6", // pink
  "#60a5fa", // blue
  "#34d399", // green
  "#fbbf24", // amber
  "#f87171", // red
  "#ffffff", // white
];

const MotivationDialog = ({
  open,
  onOpenChange,
  motivation,
  color,
  onChange,
}: Props) => {
  const colorInputRef = useRef<HTMLInputElement>(null);

  // Verifica se il colore attuale è uno di quelli predefiniti
  const isCustomColor = !COLORS.some(c => c.toLowerCase() === color.toLowerCase());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card max-w-md w-[92vw] p-6 border-0">
        <DialogHeader>
          <DialogTitle>Why does this matter?</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Anchor this goal in emotion. Your caption appears in the center of the card.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2">
          <textarea
            value={motivation}
            onChange={(e) => onChange(e.target.value, color)}
            placeholder="Because…"
            rows={3}
            className="glass-input w-full resize-none italic"
          />
        </div>

        <div className="mt-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            Caption color
          </p>
          <div className="flex flex-wrap gap-2 items-center">
            {/* COLORI PREDEFINITI */}
            {COLORS.map((c) => {
              const active = color.toLowerCase() === c.toLowerCase();
              return (
                <button
                  key={c}
                  type="button"
                  aria-label={`Color ${c}`}
                  onClick={() => onChange(motivation, c)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${
                    active ? "scale-110" : "hover:scale-105"
                  }`}
                  style={{
                    backgroundColor: c,
                    borderColor: active
                      ? "hsl(var(--primary))"
                      : "hsl(var(--glass-border) / 0.4)",
                  }}
                />
              );
            })}

            {/* SELETTORE RGB PERSONALIZZATO */}
            <div className="relative">
              <button
                type="button"
                onClick={() => colorInputRef.current?.click()}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all overflow-hidden bg-gradient-to-tr from-red-500 via-green-500 to-blue-500 ${
                  isCustomColor ? "scale-110 shadow-lg shadow-primary/20" : "hover:scale-105 opacity-80 hover:opacity-100"
                }`}
                style={{
                  borderColor: isCustomColor
                    ? "hsl(var(--primary))"
                    : "hsl(var(--glass-border) / 0.4)",
                }}
              >
                <Plus className="w-4 h-4 text-white drop-shadow-md" />
              </button>
              
              {/* Input colore invisibile */}
              <input
                ref={colorInputRef}
                type="color"
                value={color.startsWith("#") ? color : "#ffffff"}
                onChange={(e) => onChange(motivation, e.target.value)}
                className="absolute inset-0 opacity-0 w-0 h-0 pointer-events-none"
              />
            </div>
          </div>
        </div>

        {motivation && (
          <div className="mt-5 px-4 py-6 rounded-xl text-center glass-card">
            <p
              className="italic font-semibold text-lg leading-tight"
              style={{ color }}
            >
              “{motivation}”
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MotivationDialog;