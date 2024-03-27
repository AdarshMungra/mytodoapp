import { db } from "../database/database";

interface Item {
  id: number;
  done: boolean;
  value: string;
}

export const getItemsFromStorage = async (): Promise<Item[]> => {
  return new Promise<Item[]>((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'SELECT * FROM items',
          [],
          (_, { rows }) => {
            resolve(rows['_array']);
          },
          (_, error) => {
            console.log('Error selecting items:', error);
            reject(error);
            return false;
          }
        );
      },
      (error) => {
        console.log('Transaction Error:', error);
        reject(error);
      }
    );
  });
};

export const saveItemsToStorage = async (items: Item[]): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql('DROP TABLE IF EXISTS items', []);
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, done INTEGER, value TEXT)',
          []
        );
        items.forEach((item) => {
          tx.executeSql('INSERT INTO items (done, value) VALUES (?, ?)', [item.done ? 1 : 0, item.value]);
        });
      },
      (error) => {
        console.log('Transaction Error:', error);
        reject(error);
      },
      () => resolve()
    );
  });
};
