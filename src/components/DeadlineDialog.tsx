import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, Clock } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  deadline: number | null;
  checkInTime: string | null;
  // Cambiamo la firma per passare entrambi i valori ogni volta
  onChange: (deadline: number | null, checkInTime: string | null) => void; 
}

const toInputValue = (ts: number | null) => {
  if (!ts) return "";
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const DeadlineDialog = ({ open, onOpenChange, deadline, checkInTime, onChange }: Props) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="glass-card max-w-sm w-[90vw] p-6 border-0">
      <DialogHeader>
        <DialogTitle className="text-lg font-bold">Time Settings</DialogTitle>
      </DialogHeader>
      
      <p className="text-xs text-muted-foreground mb-5">
        Set your target date and a daily reminder.
      </p>

      <div className="flex gap-4">
        {/* COLONNA DEADLINE */}
        <div className="flex-1">
          <label className="text-[10px] font-bold text-muted-foreground uppercase mb-2 block tracking-wider">
            Deadline
          </label>
          <input
            type="date"
            value={toInputValue(deadline)}
            onChange={(e) => {
              const v = e.target.value;
              const newDeadline = v ? new Date(v + "T23:59:59").getTime() : null;
              // Passiamo il nuovo deadline MA manteniamo il checkInTime attuale
              onChange(newDeadline, checkInTime);
            }}
            className="glass-input w-full p-2.5 text-sm"
          />
        </div>

        {/* COLONNA DAILY CHECK-IN */}
        <div className="flex-1">
          <label className="text-[10px] font-bold text-muted-foreground uppercase mb-2 block tracking-wider">
            Daily Check-in
          </label>
          <div className="relative">
            <input
              type="time"
              value={checkInTime || ""}
              onChange={(e) => {
                const newTime = e.target.value || null;
                // Passiamo il nuovo checkInTime MA manteniamo il deadline attuale
                onChange(deadline, newTime);
              }}
              className="glass-input w-full p-2.5 text-sm appearance-none"
            />
            <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {(deadline || checkInTime) && (
        <button
          onClick={() => onChange(null, null)}
          className="mt-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors"
        >
          <X className="w-3 h-3" /> Clear all settings
        </button>
      )}
    </DialogContent>
  </Dialog>
);

export default DeadlineDialog;
