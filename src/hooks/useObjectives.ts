import { useState, useEffect, useCallback, useMemo } from "react";

export interface SubTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Objective {
  id: string;
  text: string;
  description: string;
  link: string;
  images: string[];
  completed: boolean;
  pinned: boolean;
  archived: boolean;
  archivedAt: number | null;
  motivation: string;
  motivationColor: string;
  category: string;
  categoryEmoji: string;
  subtasks: SubTask[];
  deadline: number | null; 
  checkInTime: string | null;
  backgroundPos: number;      // Posizione immagine (0-100)
  isBackgroundWide: boolean;  // <--- AGGIUNTO: Capisce se l'immagine è landscape o portrait
  why: string;
  createdAt: number;
}

export type ObjectiveUpdate = Partial<
  Pick<
    Objective,
    | "text"
    | "description"
    | "link"
    | "images"
    | "pinned"
    | "motivation"
    | "motivationColor"
    | "category"
    | "categoryEmoji"
    | "subtasks"
    | "deadline"
    | "checkInTime"
    | "backgroundPos"
    | "isBackgroundWide" // <--- AGGIUNTO
    | "why"
  >
>;

const STORAGE_KEY = "project-of-life-objectives";

function loadObjectives(): Objective[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return parsed.map((o: any) => ({
      id: o.id,
      text: o.text ?? "",
      description: o.description ?? "",
      link: o.link ?? "",
      images: o.images ?? [],
      completed: !!o.completed,
      pinned: !!o.pinned,
      archived: !!o.archived,
      archivedAt: o.archivedAt ?? null,
      motivation: o.motivation ?? "",
      motivationColor: o.motivationColor ?? "#a78bfa",
      category: o.category ?? "",
      categoryEmoji: o.categoryEmoji ?? "",
      subtasks: Array.isArray(o.subtasks) ? o.subtasks : [],
      deadline: o.deadline ?? null,
      checkInTime: o.checkInTime ?? null,
      backgroundPos: o.backgroundPos ?? 50,
      isBackgroundWide: !!o.isBackgroundWide, // <--- AGGIUNTO: Carica lo stato
      why: o.why ?? "",
      createdAt: o.createdAt ?? Date.now(),
    }));
  } catch {
    return [];
  }
}

export function useObjectives() {
  const [objectives, setObjectives] = useState<Objective[]>(loadObjectives);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(objectives));
  }, [objectives]);

  const addObjective = useCallback((text: string) => {
    if (!text.trim()) return;
    setObjectives((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text: text.trim(),
        description: "",
        link: "",
        images: [],
        completed: false,
        pinned: false,
        archived: false,
        archivedAt: null,
        motivation: "",
        motivationColor: "#a78bfa",
        category: "",
        categoryEmoji: "",
        subtasks: [],
        deadline: null,
        checkInTime: null,
        backgroundPos: 50,
        isBackgroundWide: false, // <--- AGGIUNTO: Default falso
        why: "",
        createdAt: Date.now(),
      },
    ]);
  }, []);

  const toggleObjective = useCallback((id: string) => {
    setObjectives((prev) =>
      prev.map((o) => (o.id === id ? { ...o, completed: !o.completed } : o))
    );
  }, []);

  const togglePin = useCallback((id: string) => {
    setObjectives((prev) =>
      prev.map((o) => (o.id === id ? { ...o, pinned: !o.pinned } : o))
    );
  }, []);

  const archiveObjective = useCallback((id: string) => {
    setObjectives((prev) =>
      prev.map((o) =>
        o.id === id
          ? { ...o, archived: true, archivedAt: Date.now(), completed: true }
          : o
      )
    );
  }, []);

  const restoreObjective = useCallback((id: string) => {
    setObjectives((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, archived: false, archivedAt: null } : o
      )
    );
  }, []);

  const deleteObjective = useCallback((id: string) => {
    setObjectives((prev) => prev.filter((o) => o.id !== id));
  }, []);

  const updateObjective = useCallback(
    (id: string, updates: ObjectiveUpdate) => {
      setObjectives((prev) =>
        prev.map((o) => (o.id === id ? { ...o, ...updates } : o))
      );
    },
    []
  );

  const active = useMemo(
    () =>
      [...objectives]
        .filter((o) => !o.archived)
        .sort((a, b) => {
          if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
          return a.createdAt - b.createdAt;
        }),
    [objectives]
  );

  const archived = useMemo(
    () =>
      [...objectives]
        .filter((o) => o.archived)
        .sort((a, b) => (b.archivedAt ?? 0) - (a.archivedAt ?? 0)),
    [objectives]
  );

  const total = active.length;
  const completed = active.filter((o) => o.completed).length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return {
    objectives: active,
    archivedObjectives: archived,
    addObjective,
    toggleObjective,
    togglePin,
    archiveObjective,
    restoreObjective,
    deleteObjective,
    updateObjective,
    progress,
    total,
    completed,
  };
}