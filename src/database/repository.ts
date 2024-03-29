import { db } from "../database/database";

interface Item {
	id: number;
	done: boolean;
	value: string;
}

export async function insertItem(id: string, value: string, done: boolean) {
	return (await db.execAsync(
		[
			{
				sql: "INSERT INTO items (id, value, done) VALUES (?, ?, ?)",
				args: [id, value, done],
			},
		],
		false,
	)) as unknown as Item;
}

export async function updateItem(id: number, value: string, done: boolean) {
	await db.execAsync(
		[
			{
				sql: "UPDATE items SET value = ?, done = ? WHERE id = ?",
				args: [value, done, id],
			},
		],
		false,
	);
}

export async function deleteItem(id: string) {
	await db.execAsync(
		[
			{
				sql: "DELETE FROM items WHERE id = ?",
				args: [id],
			},
		],
		false,
	);
}

export async function selectItem(id: number): Promise<Item> {
	const result = await db.execAsync(
		[
			{
				sql: "SELECT * FROM items WHERE id = ?",
				args: [id],
			},
		],
		false,
	);
	return result[0]["rows"] as unknown as Item;
}

export async function findAll(): Promise<Item[]> {
	const result = await db.execAsync(
		[
			{
				sql: "SELECT * FROM items",
				args: [],
			},
		],
		false,
	);
	return result[0]["rows"] as unknown as Item[];
}

export async function insertMultiple(items: Item[]) {
	const sql = "INSERT INTO items (value, done) VALUES (?, ?)";
	const args = items.map((item) => [item.value, item.done]);
	await db.execAsync([{ sql, args }], false);
}
