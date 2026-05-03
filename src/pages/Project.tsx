import { useState } from "react";
import { useObjectives } from "@/hooks/useObjectives";
import { Plus, ArrowLeft, Target, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ObjectiveCard from "@/components/ObjectiveCard";
import SettingsButton from "@/components/SettingsButton";

const Project = () => {
  const {
    objectives,
    archivedObjectives,
    addObjective,
    toggleObjective,
    deleteObjective,
    updateObjective,
    togglePin,
    archiveObjective,
    progress,
    total,
    completed,
  } = useObjectives();
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addObjective(input);
    setInput("");
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-10 animate-hero-enter">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate("/")} className="p-2 rounded-lg transition-colors hover:bg-muted">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">My Objectives</h1>
          </div>
          {total > 0 && (
            <span className="ml-auto text-sm text-muted-foreground">
              {completed}/{total} done
            </span>
          )}
          <button
            onClick={() => navigate("/history")}
            className={`p-2 rounded-lg hover:bg-muted transition-colors relative ${total > 0 ? "" : "ml-auto"}`}
            aria-label="Hall of Fame"
            title="Hall of Fame"
          >
            <Trophy className="w-5 h-5 text-muted-foreground" />
            {archivedObjectives.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 text-[9px] bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center">
                {archivedObjectives.length}
              </span>
            )}
          </button>
          <SettingsButton />
        </div>

        {total > 0 && (
          <div className="mb-8">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a life objective…"
            className="glass-input flex-1"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="hero-button !px-4 !py-3 !text-base disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
          >
            <Plus className="w-5 h-5" />
          </button>
        </form>

        <div className="flex flex-col gap-3">
          {objectives.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <Target className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg">No objectives yet</p>
              <p className="text-sm mt-1">Start by adding something you want to achieve.</p>
            </div>
          )}

          {objectives.map((obj) => (
            <ObjectiveCard
              key={obj.id}
              objective={obj}
              onToggle={toggleObjective}
              onDelete={deleteObjective}
              onTogglePin={togglePin}
              onUpdate={updateObjective}
              onArchive={archiveObjective}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Project;
