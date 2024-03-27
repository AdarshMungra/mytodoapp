import React, { useState } from "react";
import { View, Text } from "react-native";
import styles from "./src/components/styles";
import useItemStore from "./src/store/itemStore"; // Import useItemStore instead of useStore
import Input from "./src/components/input";
import ItemsList from "./src/components/itemList";

export default function App() {
  const [text, setText] = useState<string>("");
  const addItem = useItemStore((state) => state.addItem); // Use useItemStore instead of useStore
  const toggleItem = useItemStore((state) => state.toggleItem); // Use useItemStore instead of useStore
  const deleteItem = useItemStore((state) => state.deleteItem); // Use useItemStore instead of useStore
  const items = useItemStore((state) => state.items); // Use useItemStore instead of useStore

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
      <ItemsList items={todoItems} onPressItem={(id) => toggleItem(id)} deleteItem={deleteItem} />
      <ItemsList items={completedItems} onPressItem={(id) => toggleItem(id)} deleteItem={deleteItem} />
    </View>
  );
}
