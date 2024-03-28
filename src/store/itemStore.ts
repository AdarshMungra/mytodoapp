import { create } from "zustand";
import { persist, createJSONStorage} from "zustand/middleware";
import { db } from "../database/database";

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


//this not good , doesnot exist ? get , set , del 
const storage = {
  getItem: async (name: string): Promise<any> => {
    console.log(`${name} has been retrieved`);
    //update here
    
  },
  setItem: async (name: string, value: any): Promise<void> => {
    console.log(`${name} with value ${value} has been saved`);
    //update here
  },
  removeItem: async (name: string): Promise<void> => {
    console.log(`${name} has been deleted`);
    //update here 
  },
};


//this is probally good 
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

    //this part not good 
    {
      name: "item-store",
      storage: createJSONStorage(() => storage),
    }
  )
);

export default useItemStore;
