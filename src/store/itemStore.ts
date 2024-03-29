import { create } from "zustand";
import {
	persist,
	createJSONStorage,
	StateStorage,
	StorageValue,
} from "zustand/middleware";
import * as TodosRepository from "../database/repository";
import { syncTodos } from "../services/todos";

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

type SQLiteStorageType = StorageValue<{ items: Item[] }>;

//this not good , doesnot exist ? get , set , del
const storage: StateStorage = {
	getItem: async (name: string): Promise<string> => {
		console.log(`${name} has been retrieved`);
		const toBeStored = {
			state: {
				items: await TodosRepository.findAll(),
			},
		} as SQLiteStorageType;

		return JSON.stringify(toBeStored);
	},
	setItem: async (name: string, value: string): Promise<void> => {
		console.log(`${name} with value ${value} has been saved`);
		await syncTodos(value);
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
						item.id === id ? { ...item, done: !item.done } : item,
					),
				})),
			deleteItem: (id) =>
				set((state) => ({
					items: state.items.filter((item) => item.id !== id),
				})),
			updateItem: (id, newValue) =>
				set((state) => ({
					items: state.items.map((item) =>
						item.id === id ? { ...item, value: newValue } : item,
					),
				})),
		}),

		//this part not good
		{
			name: "item-store",
			storage: createJSONStorage(() => storage),
		},
	),
);

export default useItemStore;
