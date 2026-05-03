export interface Category {
  name: string;
  emoji: string;
  keywords: string[];
}

export const CATEGORIES: Category[] = [
  { name: "Health & Fitness", emoji: "🏋️", keywords: ["gym", "workout", "exercise", "fitness", "health"] },
  { name: "Mindfulness", emoji: "🧘", keywords: ["meditation", "calm", "mindful", "yoga"] },
  { name: "Learning", emoji: "💡", keywords: ["study", "course", "read", "learn", "school"] },
  { name: "Deep Work", emoji: "🧠", keywords: ["focus", "deep", "flow", "concentrate"] },
  { name: "Career", emoji: "💼", keywords: ["job", "work", "career", "promotion"] },
  { name: "Finance", emoji: "💰", keywords: ["money", "save", "invest", "budget"] },
  { name: "Creativity", emoji: "🎨", keywords: ["art", "draw", "paint", "create", "design"] },
  { name: "Music", emoji: "🎵", keywords: ["song", "music", "instrument", "guitar", "piano"] },
  { name: "Writing", emoji: "✍️", keywords: ["write", "blog", "journal", "book"] },
  { name: "Reading", emoji: "📚", keywords: ["book", "read"] },
  { name: "Travel", emoji: "✈️", keywords: ["trip", "travel", "vacation"] },
  { name: "Relationships", emoji: "❤️", keywords: ["love", "family", "friend", "partner"] },
  { name: "Home", emoji: "🏠", keywords: ["home", "house", "clean", "organize"] },
  { name: "Cooking", emoji: "🍳", keywords: ["cook", "food", "recipe", "kitchen"] },
  { name: "Nature", emoji: "🌱", keywords: ["nature", "outside", "hike", "garden"] },
  { name: "Sleep", emoji: "😴", keywords: ["sleep", "rest", "recover"] },
  { name: "Side Project", emoji: "🚀", keywords: ["startup", "launch", "build", "ship"] },
  { name: "Spirituality", emoji: "✨", keywords: ["spirit", "soul", "pray", "faith"] },
  { name: "Habits", emoji: "🔁", keywords: ["habit", "routine", "daily"] },
  { name: "Other", emoji: "🎯", keywords: [] },
];
