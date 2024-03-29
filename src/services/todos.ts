import { StorageValue } from "zustand/middleware";
import * as TodosRepository from "../database/repository";

interface Item {
	id: number;
	done: boolean;
	value: string;
}

type SQLiteStorageType = StorageValue<{ items: Item[] }>;

function findNewItems(items: Item[], stored: Item[]): Item[] {
	return items.filter((item) => {
		return !stored.find((element) => element.id === item.id);
	});
}

async function insertNewItems(items: Item[]): Promise<void> {
	for (const item of items) {
		await TodosRepository.insertItem(item.id.toString(), item.value, item.done);
	}
}

function findItemsToDelete(items: Item[], stored: Item[]): Item[] {
	return stored.filter((item) => {
		return !items.find((element) => element.id === item.id);
	});
}

async function deleteItems(items: Item[]): Promise<void> {
	for (const item of items) {
		await TodosRepository.deleteItem(item.id.toString());
	}
}

function findItemsToUpdate(items: Item[], stored: Item[]): Item[] {
	return items.filter((item) => {
		return stored.find(
			(element) => element.id === item.id && element.done !== item.done,
		);
	});
}

async function updateItems(items: Item[]): Promise<void> {
	for (const item of items) {
		await TodosRepository.updateItem(item.id, item.value, item.done);
	}
}

export async function syncTodos(value: string) {
	const state = JSON.parse(value) as SQLiteStorageType;

	const stored = await TodosRepository.findAll();

	const diff = findNewItems(state.state.items, stored);
	await insertNewItems(diff);

	const toDelete = findItemsToDelete(state.state.items, stored);
	await deleteItems(toDelete);

	const toUpdate = findItemsToUpdate(state.state.items, stored);
	await updateItems(toUpdate);
}
