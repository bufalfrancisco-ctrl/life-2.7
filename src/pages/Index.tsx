import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, LogOut, Trophy } from "lucide-react";
import SettingsButton from "@/components/SettingsButton";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  const [exiting, setExiting] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth", { replace: true });
  };

  const handleClick = () => {
    setExiting(true);
    setTimeout(() => navigate("/project"), 400);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute top-5 right-5 z-20 flex items-center gap-2">
        <button
          onClick={() => navigate("/history")}
          className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:scale-105 transition-transform"
          aria-label="Hall of Fame"
          title="Hall of Fame"
        >
          <Trophy className="w-4 h-4 text-foreground" />
        </button>
        <SettingsButton />
        <button
          onClick={handleSignOut}
          className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:scale-105 transition-transform"
          aria-label="Sign out"
          title="Sign out"
        >
          <LogOut className="w-4 h-4 text-foreground" />
        </button>
      </div>

      <div
        className={`relative z-10 flex flex-col items-center gap-6 text-center px-6 ${
          exiting ? "animate-hero-exit" : "animate-hero-enter"
        }`}
      >
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-foreground">
          Project of Life
        </h1>
        <p className="text-muted-foreground text-lg max-w-md">
          Define your objectives. Track your journey. Build the life you envision.
        </p>
        <button onClick={handleClick} className="hero-button flex items-center gap-3 mt-4">
          <Sparkles className="w-5 h-5" />
          Make a Project
        </button>
      </div>
    </div>
  );
};

export default Index;

