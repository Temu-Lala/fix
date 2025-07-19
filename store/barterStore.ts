import { create } from "zustand";
import { Barter } from "@/types/barter";

type BarterStore = {
  barters: Barter[];
  addBarter: (barter: Barter) => void;
};

export const useBarterStore = create<BarterStore>((set) => ({
  barters: [
    {
      id: "1",
      title: "Bike for Books",
      description: "Trade my bike for books",
      image:
        "https://images.unsplash.com/photo-1518655048521-f130df041f66?auto=format&fit=crop&w=400&q=80",
      user: { name: "Alice" },
      category: "goods",
    },
    {
      id: "2",
      title: "Guitar Lessons",
      description: "Teach guitar for cooking lessons",
      image:
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80",
      user: { name: "Bob" },
      category: "services",
    },
  ],
  addBarter: (barter) =>
    set((state) => ({ barters: [barter, ...state.barters] })),
}));
