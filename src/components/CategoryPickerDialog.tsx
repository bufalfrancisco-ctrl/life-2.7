import { useState } from "react";
import { Search, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CATEGORIES } from "@/lib/categories";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  selected: string;
  onSelect: (name: string, emoji: string) => void;
}

const CategoryPickerDialog = ({ open, onOpenChange, selected, onSelect }: Props) => {
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const filtered = q
    ? CATEGORIES.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.keywords.some((k) => k.includes(q)) ||
          c.emoji.includes(q)
      )
    : CATEGORIES;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card max-w-md w-[92vw] p-0 border-0 overflow-hidden">
        <DialogHeader className="px-5 pt-5 pb-3">
          <DialogTitle>Choose a category</DialogTitle>
        </DialogHeader>

        <div className="px-5 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search categories…"
              className="glass-input w-full pl-9"
            />
          </div>
        </div>

        <div className="max-h-[55vh] overflow-y-auto px-2 pb-4">
          {filtered.length === 0 && (
            <p className="px-4 py-6 text-sm text-muted-foreground text-center">
              No matches.
            </p>
          )}
          <ul className="flex flex-col">
            {filtered.map((c) => {
              const active = selected === c.name;
              return (
                <li key={c.name}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(c.name, c.emoji);
                      onOpenChange(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                      active
                        ? "bg-primary/15 text-foreground"
                        : "hover:bg-foreground/5 text-foreground"
                    }`}
                  >
                    <span className="text-xl leading-none">{c.emoji}</span>
                    <span className="flex-1 text-sm font-medium">{c.name}</span>
                    {active && <Check className="w-4 h-4 text-primary" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryPickerDialog;
