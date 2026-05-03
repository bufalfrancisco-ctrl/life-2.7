import { useState } from "react";
import { Settings, Sun, Moon, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useMood, type Mood } from "@/hooks/useMood";

const moodOptions: Array<{
  value: Mood;
  label: string;
  description: string;
  Icon: typeof Sun;
}> = [
  { value: "day", label: "Day", description: "Light & airy, soft mesh", Icon: Sun },
  { value: "night", label: "Night", description: "Deep violet, vivid glow", Icon: Moon },
  { value: "dark", label: "Dark", description: "Balanced default", Icon: Sparkles },
];

interface Props {
  className?: string;
}

const SettingsButton = ({ className = "" }: Props) => {
  const [open, setOpen] = useState(false);
  const { mood, setMood } = useMood();

  return (
    <>
      <button
        type="button"
        aria-label="Open settings"
        onClick={() => setOpen(true)}
        className={`glass-card w-10 h-10 flex items-center justify-center text-foreground hover:scale-105 transition-transform ${className}`}
      >
        <Settings className="w-4.5 h-4.5" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="glass-card max-w-md w-[92vw] p-6 border-0">
          <DialogHeader>
            <DialogTitle className="text-xl">Settings</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Tune the atmosphere with Mood Life.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
              Mood Life
            </p>
            <div className="grid grid-cols-3 gap-3">
              {moodOptions.map(({ value, label, description, Icon }) => {
                const active = mood === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setMood(value)}
                    className={`glass-card flex flex-col items-center gap-2 px-3 py-4 text-center transition-all ${
                      active ? "ring-2 ring-primary scale-[1.02]" : "hover:scale-[1.02]"
                    }`}
                    style={
                      active
                        ? { boxShadow: "0 0 24px hsl(var(--primary) / 0.35)" }
                        : undefined
                    }
                  >
                    <Icon
                      className="w-5 h-5"
                      style={{
                        color: active ? "hsl(var(--primary))" : "hsl(var(--foreground))",
                      }}
                    />
                    <span className="text-sm font-medium text-foreground">{label}</span>
                    <span className="text-[11px] leading-tight text-muted-foreground">
                      {description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SettingsButton;
