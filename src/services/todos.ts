import { StorageValue } from 'zustand/middleware';
import * as TodosRepository from '../database/repository';
import { tryAsync } from '@eznix/try';
interface Item {
	id: number;
	done: boolean;
	value: string;
}

type SQLiteStorageType = StorageValue<{ items: Item[] }>;

async function findNewItems(items: Item[]): Promise<Item[]> {
	const result = await tryAsync<Item[]>(TodosRepository.findAll);
	const stored = await result.getOrElse([]);
	return items.filter((item) => {
		return !stored.find((element) => element.id === item.id);
	});
}

async function insertNewItems(items: Item[]): Promise<void> {
	for (const item of items) {
		await TodosRepository.insertItem(
			item.id.toString(),
			item.value,
			item.done,
		);
	}
}

async function findItemsToDelete(itemsFromMemory: Item[]): Promise<Item[]> {
	const result = await tryAsync<Item[]>(TodosRepository.findAll);
	const stored = await result.getOrElse([]);
	// return diff from memory and stored
	return stored.filter((item) => {
		return !itemsFromMemory.find(
			(element) => +element.id === +item.id,
		);
	});
}

async function deleteItems(items: Item[]): Promise<void> {
	for (const item of items) {
		await TodosRepository.deleteItem(item.id.toString());
	}
}

async function findItemsToUpdate(items: Item[]): Promise<Item[]> {
	const result = await tryAsync<Item[]>(TodosRepository.findAll);
	const stored = await result.getOrElse([]);

	return items.filter((item) => {
		return stored.find(
			(element) =>
				+element.id === +item.id &&
				element.done !== item.done,
		);
	});
}

async function updateItems(items: Item[]): Promise<void> {
	for (const item of items) {
		await TodosRepository.updateItem(
			item.id,
			item.value,
			item.done,
		);
	}
}

export async function syncTodos(value: string) {
	const state = JSON.parse(value) as SQLiteStorageType;

	const diff = await findNewItems(state.state.items);
	console.log({ diff });

	await insertNewItems(diff);

	const toUpdate = await findItemsToUpdate(state.state.items);

	console.log({ toUpdate });

	await updateItems(toUpdate);

	const toDelete = await findItemsToDelete(state.state.items);

	console.log({ toDelete });

	await deleteItems(toDelete);

	const verify = await tryAsync<Item[]>(TodosRepository.findAll);

	console.log(await verify.getOrElse([]));
}
