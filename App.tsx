import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import styles from "./src/components/styles";
import useItemStore from "./src/store/itemStore";
import Input from "./src/components/input";
import ItemsList from "./src/components/itemList";
import { createTable } from "./src/database/database";

const Tab = createBottomTabNavigator();

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
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ tabBarActiveTintColor: 'blue', headerShown: false }}>
        <Tab.Screen name="Todo" component={TodoScreen} />
        <Tab.Screen name="Completed" component={CompletedScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

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

const CompletedScreen = () => {
  const [text, setText] = useState<string>("");
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
