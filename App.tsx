import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import TodoScreen from "./src/screens/TodoScreen";
import CompletedScreen from "./src/screens/CompletedScreen";
import DailyTaskScreen from "./src/screens/DaliyTaskScreen";
import useItemStore from "./src/store/itemStore";
import { createTable } from "./src/database/database";

const Tab = createBottomTabNavigator();

export default function App() {
  const [text, setText] = useState<string>("");
  const [recurringItems, setRecurringItems] = useState<string[]>([]); // State to store recurring items
  const addItem = useItemStore((state) => state.addItem);
  const toggleItem = useItemStore((state) => state.toggleItem);
  const deleteItem = useItemStore((state) => state.deleteItem);
  const items = useItemStore((state) => state.items);

  useEffect(() => {
    createTable();
    // Load recurring items from storage or set default values
    const storedRecurringItems = []; // Load from storage or set default values
    setRecurringItems(storedRecurringItems);
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
        <Tab.Screen name="Daily Task" options={{ tabBarLabel: 'Daily Task' }}>
          {() => (
            <DailyTaskScreen recurringItems={recurringItems} setRecurringItems={setRecurringItems} />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
