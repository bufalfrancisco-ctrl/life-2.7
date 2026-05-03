import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Mood = "day" | "night" | "dark";

interface MoodContextValue {
  mood: Mood;
  setMood: (m: Mood) => void;
}

const MoodContext = createContext<MoodContextValue | undefined>(undefined);

const STORAGE_KEY = "mood-life";

export const MoodProvider = ({ children }: { children: ReactNode }) => {
  const [mood, setMoodState] = useState<Mood>(() => {
    if (typeof window === "undefined") return "dark";
    const stored = window.localStorage.getItem(STORAGE_KEY) as Mood | null;
    return stored ?? "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-mood", mood);
    window.localStorage.setItem(STORAGE_KEY, mood);
  }, [mood]);

  return (
    <MoodContext.Provider value={{ mood, setMood: setMoodState }}>
      {children}
    </MoodContext.Provider>
  );
};

export const useMood = () => {
  const ctx = useContext(MoodContext);
  if (!ctx) throw new Error("useMood must be used within MoodProvider");
  return ctx;
};
