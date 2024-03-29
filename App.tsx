import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import styles from "./src/components/styles";
import useItemStore from "./src/store/itemStore";
import Input from "./src/components/input";
import ItemsList from "./src/components/itemList";
import { createTable } from "./src/database/database";

export default function App() {
	const [text, setText] = useState<string>("");
	const addItem = useItemStore((state) => state.addItem);
	const toggleItem = useItemStore((state) => state.toggleItem);
	const deleteItem = useItemStore((state) => state.deleteItem);
	const items = useItemStore((state) => state.items);

	useEffect(() => {
		createTable();
	}, []);

	const add = () => {
		if (text.trim() === "") {
			return;
		}

		addItem(text.trim());
		setText("");
	};

	const todoItems = items.filter((item) => !item.done);
	const completedItems = items.filter((item) => item.done);

	return (
		<View style={styles.container}>
			<Text style={styles.heading}>DO IT NOW!!!</Text>
			<Input text={text} onChangeText={setText} onSubmitEditing={add} />
			<Text style={styles.subheading}>todo</Text>
			<ItemsList
				items={todoItems}
				onPressItem={(id) => toggleItem(id)}
				deleteItem={deleteItem}
			/>
			<Text style={styles.subheading}>Completed</Text>
			<ItemsList
				items={completedItems}
				onPressItem={(id) => toggleItem(id)}
				deleteItem={deleteItem}
			/>
		</View>
	);
}
