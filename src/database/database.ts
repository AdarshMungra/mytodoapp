import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabase("my.db");

// Create table todos
export async function createTable() {
	await db.execAsync(
		[
			{
				sql: "CREATE TABLE IF NOT EXISTS items (id TEXT PRIMARY KEY NOT NULL, value TEXT, done BOOLEAN)",
				args: [],
			},
		],
		false,
	);
}
