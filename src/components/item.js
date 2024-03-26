import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useStore } from "../store";

function Items({ done: doneHeading, onPressItem, deleteItem }) {
  const [done, setDone] = useState(doneHeading);
  const items = useStore((state) => state.items);

  const filteredItems = items.filter((item) => item.done === done);

  if (filteredItems.length === 0) {
    return null;
  }

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionHeading}>{done ? "Completed" : "Todo"}</Text>
      {filteredItems.map(({ id, done, value }) => (
        <View key={id} style={styles.itemContainer}>
          <TouchableOpacity
            onPress={() => onPressItem(id)}
            style={{
              backgroundColor: done ? "#1c9983" : "#fff",
              borderColor: "#000",
              borderWidth: 1,
              borderRadius: 16,
              padding: 10,
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
    </View>
  );
}

export default Items;
