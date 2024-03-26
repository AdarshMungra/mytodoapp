import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Constants from "expo-constants";
import { create } from "zustand";

const useStore = create((set) => ({
  items: [],
  addItem: (value) =>
    set((state) => ({
      items: [...state.items, { id: Date.now(), done: false, value }],
    })),
  toggleItem: (id) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      ),
    })),
  deleteItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
}));

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

export default function App() {
  const [text, setText] = useState("");
  const addItem = useStore((state) => state.addItem);
  const toggleItem = useStore((state) => state.toggleItem);
  const deleteItem = useStore((state) => state.deleteItem);

  const add = () => {
    if (text.trim() === "") {
      return;
    }

    addItem(text.trim());
    setText("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>DO it now!!</Text>

      <View style={styles.flexRow}>
        <TextInput
          onChangeText={(text) => setText(text)}
          onSubmitEditing={add}
          placeholder="what do you need to do?"
          style={styles.input}
          value={text}
        />
        <TouchableOpacity onPress={add}>
          <Text>Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.listArea}>
        <Items
          done={false}
          onPressItem={(id) => toggleItem(id)}
          deleteItem={deleteItem}
        />
      </ScrollView>

      <ScrollView style={styles.listArea}>
        <Items
          done={true}
          onPressItem={(id) => toggleItem(id)}
          deleteItem={deleteItem}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    paddingHorizontal: 16,
  },
  heading: {
    marginTop: 32,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  input: {
    borderColor: "#4630eb",
    borderRadius: 24,
    borderWidth: 1,
    flex: 1,
    height: 48,
    padding: 16,
    marginRight: 16,
  },
  addBtn: {
    backgroundColor: "#4630eb",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  listArea: {
    backgroundColor: "#f0f0f0",
    flex: 1,
    padding: 16,
    borderRadius: 8,
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: "bold",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  deleteButton: {
    color: "red",
    marginLeft: 8,
  },
});
