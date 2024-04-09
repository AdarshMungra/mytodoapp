import React from "react";
import { View, Text } from "react-native";
import useItemStore from "../store/itemStore";
import ItemsList from "../components/itemList";
import styles from "../components/styles";;

const CompletedScreen = () => {
  const toggleItem = useItemStore((state) => state.toggleItem);
  const deleteItem = useItemStore((state) => state.deleteItem);
  const items = useItemStore((state) => state.items);

  const completedItems = items.filter((item) => item.done);

  return (
    <View style={styles.container}>
      <Text style={styles.subheading}>Completed</Text>
      <ItemsList
        items={completedItems}
        onPressItem={(id) => toggleItem(id)}
        deleteItem={deleteItem}
      />
    </View>
  );
};

export default CompletedScreen;
