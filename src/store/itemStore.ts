import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface Item {
  id: number;
  done: boolean;
  value: string;
}

interface Actions {
  items: Item[];
  addItem: (value: string) => void;
  toggleItem: (id: number) => void;
  deleteItem: (id: number) => void;
  updateItem: (id: number, newValue: string) => void;
}

const jsonStorage = createJSONStorage(() => localStorage);

export const useItemStore = create<Actions>()(
  persist(
    (set) => ({
      items: [],
      addItem: (value) =>
        set((state) => ({
          items: [...state.items, { id: Date.now(), done: false, value }],
        })),
      toggleItem: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, done: !item.done } : item
          ),
        })),
      deleteItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      updateItem: (id, newValue) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, value: newValue } : item
          ),
        })),
    }),
    {
      name: "item-store",
      storage: jsonStorage, 
    }
  )
);

export default useItemStore;
