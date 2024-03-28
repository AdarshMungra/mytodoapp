import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import styles from "./styles";

interface Item {
  id: number;
  done: boolean;
  value: string;
}

interface ItemsListProps {
  items: Item[];
  onPressItem: (id: number) => void;
  deleteItem: (id: number) => void;
}

const ItemsList: React.FC<ItemsListProps> = ({ items, onPressItem, deleteItem }) => {
  return (
    <ScrollView style={styles.listArea}>
      {items.map(({ id, done, value }: Item) => (
        <View key={id} style={styles.itemContainer}>
          <TouchableOpacity
            onPress={() => onPressItem(id)}
            style={{
              backgroundColor: done ? "#1c9983" : "#fff",
              borderColor: "#000",
              // borderWidth: 1,
              borderRadius: 8,
              padding:12,
              flex: 1,
            }}
          >
            <Text style={{ color: done ? "#fff" : "#000" }}>{value}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteItem(id)}>
            <Text style={styles.deleteButton}>❌</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

export default ItemsList;
