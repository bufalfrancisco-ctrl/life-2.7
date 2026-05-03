import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, RotateCcw, Trash2 } from "lucide-react";
import { useObjectives } from "@/hooks/useObjectives";
import SettingsButton from "@/components/SettingsButton";

const History = () => {
  const navigate = useNavigate();
  const { archivedObjectives, restoreObjective, deleteObjective } = useObjectives();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-10 animate-hero-enter">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Hall of Fame</h1>
          </div>
          <span className="ml-auto text-sm text-muted-foreground">
            {archivedObjectives.length} achieved
          </span>
          <SettingsButton />
        </div>

        {archivedObjectives.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Trophy className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">Your wins will live here</p>
            <p className="text-sm mt-1">Complete a goal and archive it to see it.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {archivedObjectives.map((o) => (
              <div key={o.id} className="glass-card px-5 py-4 flex items-center gap-3">
                {o.categoryEmoji && <span className="text-xl">{o.categoryEmoji}</span>}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{o.text}</p>
                  {o.archivedAt && (
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Achieved {new Date(o.archivedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => restoreObjective(o.id)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Restore"
                  title="Restore"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteObjective(o.id)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive transition-colors"
                  aria-label="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
