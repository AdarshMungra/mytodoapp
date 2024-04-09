import React, { useState } from "react";
import { View, Text } from "react-native";
import useItemStore from "../store/itemStore";
import Input from "../components/input";
import ItemsList from "../components/itemList";
import styles from "../components/styles";

const TodoScreen = () => {
  const [text, setText] = useState<string>("");
  const addItem = useItemStore((state) => state.addItem);
  const toggleItem = useItemStore((state) => state.toggleItem);
  const deleteItem = useItemStore((state) => state.deleteItem);
  const items = useItemStore((state) => state.items);

  const add = () => {
    if (text.trim() === "") {
      return;
    }

    addItem(text.trim());
    setText("");
  };

  const todoItems = items.filter((item) => !item.done);

  return (
    <View style={styles.container}>
      <Input text={text} onChangeText={setText} onSubmitEditing={add} />
      <Text style={styles.subheading}>Todo</Text>
      <ItemsList
        items={todoItems}
        onPressItem={(id) => toggleItem(id)}
        deleteItem={deleteItem}
      />
    </View>
  );
};

export default TodoScreen;
