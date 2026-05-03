import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Trash2, Check } from "lucide-react";
import type { SubTask } from "@/hooks/useObjectives";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  subtasks: SubTask[];
  onChange: (subtasks: SubTask[]) => void;
}

const SubTasksDialog = ({ open, onOpenChange, subtasks, onChange }: Props) => {
  const [draft, setDraft] = useState("");

  const add = () => {
    const t = draft.trim();
    if (!t) return;
    onChange([...subtasks, { id: crypto.randomUUID(), text: t, completed: false }]);
    setDraft("");
  };

  const toggle = (id: string) =>
    onChange(subtasks.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s)));

  const remove = (id: string) => onChange(subtasks.filter((s) => s.id !== id));

  const done = subtasks.filter((s) => s.completed).length;
  const pct = subtasks.length === 0 ? 0 : Math.round((done / subtasks.length) * 100);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card max-w-md w-[90vw] p-6 border-0">
        <DialogHeader>
          <DialogTitle>Sub-tasks</DialogTitle>
        </DialogHeader>

        {subtasks.length > 0 && (
          <div className="mb-2">
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              <span>{done}/{subtasks.length} done</span>
              <span>{pct}%</span>
            </div>
            <div className="progress-bar-track !h-2">
              <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2 max-h-72 overflow-y-auto py-2">
          {subtasks.map((s) => (
            <div key={s.id} className="flex items-center gap-2">
              <button
                onClick={() => toggle(s.id)}
                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                  s.completed ? "bg-primary border-primary" : "border-muted-foreground/40"
                }`}
              >
                {s.completed && <Check className="w-3 h-3 text-primary-foreground" />}
              </button>
              <span
                className={`flex-1 text-sm ${
                  s.completed ? "line-through text-muted-foreground" : "text-foreground"
                }`}
              >
                {s.text}
              </span>
              <button
                onClick={() => remove(s.id)}
                className="p-1 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {subtasks.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">
              Break this goal into micro-steps.
            </p>
          )}
        </div>

        <div className="flex gap-2 mt-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            placeholder="Add a step…"
            className="glass-input flex-1 !py-2"
          />
          <button
            onClick={add}
            disabled={!draft.trim()}
            className="hero-button !px-3 !py-2 !text-sm disabled:opacity-30"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubTasksDialog;
