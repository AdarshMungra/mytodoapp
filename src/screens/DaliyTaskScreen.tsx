import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, FlatList, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';

// Color options for tasks
const colorOptions = ["#ffadad", "#ffd6a5", "#fdffb6", "#caffbf", "#9bf6ff", "#a0c4ff", "#bdb2ff", "#ffc6ff", "#fffffc"];

// List of icon names
const iconOptions = ["checkbox-marked-circle-outline", "alarm"];

// Component for rendering color options
const ColorPicker = ({ setSelectedColor }) => (
  <View style={{ flexDirection: "row", marginBottom: 10 }}>
    {colorOptions.map((color, index) => (
      <TouchableOpacity
        key={index}
        style={{ backgroundColor: color, width: 30, height: 30, borderRadius: 15, marginRight: 10 }}
        onPress={() => setSelectedColor(color)}
      />
    ))}
  </View>
);

// Component for rendering icon picker modal
const IconPickerModal = ({ iconPickerVisible, setIconPickerVisible, setSelectedIcon }) => (
  <Modal
    visible={iconPickerVisible}
    transparent={true}
    onRequestClose={() => setIconPickerVisible(false)}
  >
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
      <View style={{ backgroundColor: "#fff", borderRadius: 10, padding: 20 }}>
        <Text>Select Icon</Text>
        <FlatList
          data={iconOptions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => { setSelectedIcon(item); setIconPickerVisible(false); }}>
              <MaterialCommunityIcons name={item} size={30} color="black" style={{ marginVertical: 5 }} />
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  </Modal>
);

// Component for rendering individual task item
const TaskItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.taskContainer, { backgroundColor: item.color }]}
      onPress={() => {}} // No action on click
    >
      <Text style={styles.taskText}>{item.text} ({item.startTime} - {item.endTime})</Text>
      <MaterialCommunityIcons
        name={item.done ? "checkbox-marked-circle-outline" : "checkbox-blank-circle-outline"}
        size={24}
        color="#fff"
        style={{ marginLeft: 10 }}
      />
    </TouchableOpacity>
  );
  
  const DailyTaskScreen = ({ recurringItems, setRecurringItems }) => {
    const [newItem, setNewItem] = useState("");
    const [selectedColor, setSelectedColor] = useState("#7f7f7f");
    const [selectedIcon, setSelectedIcon] = useState("checkbox-marked-circle-outline");
    const [selectedStartTime, setSelectedStartTime] = useState(new Date());
    const [selectedEndTime, setSelectedEndTime] = useState(new Date());
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);
    const [iconPickerVisible, setIconPickerVisible] = useState(false);
  
    const addRecurringItem = () => {
      if (newItem.trim() === "") {
        return;
      }
  
      const newItemObject = {
        text: newItem.trim(),
        color: selectedColor,
        icon: selectedIcon,
        startTime: selectedStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        endTime: selectedEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        done: false,
      };
  
      setRecurringItems([...recurringItems, newItemObject]);
      setNewItem("");
    };
  
    const renderStartTimePicker = () => (
      <DateTimePicker
        value={selectedStartTime}
        mode="time"
        is24Hour={true}
        display="default"
        onChange={(event, selectedTime) => {
          setShowStartTimePicker(false);
          if (selectedTime) {
            setSelectedStartTime(selectedTime);
          }
        }}
      />
    );
  
    const renderEndTimePicker = () => (
      <DateTimePicker
        value={selectedEndTime}
        mode="time"
        is24Hour={true}
        display="default"
        onChange={(event, selectedTime) => {
          setShowEndTimePicker(false);
          if (selectedTime) {
            setSelectedEndTime(selectedTime);
          }
        }}
      />
    );
  
    return (
      <View style={{ flex: 1, paddingTop: 40, paddingHorizontal: 20 }}>
        <View style={{ marginBottom: 20 }}>
          <TextInput
            value={newItem}
            onChangeText={setNewItem}
            placeholder="Task name"
            style={{ height: 40, borderColor: "#ccc", borderWidth: 1, paddingHorizontal: 10, marginBottom: 10 }}
          />
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
            <TouchableOpacity
              style={{ backgroundColor: "#1c9983", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5 }}
              onPress={() => setShowStartTimePicker(true)}
            >
              <Text style={{ color: "#fff" }}>Select Start Time</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: selectedColor, width: 40, height: 40, marginLeft: 10, borderRadius: 20 }}
            />
            <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={() => setIconPickerVisible(true)}
            >
              <MaterialCommunityIcons name={selectedIcon} size={30} color="black" />
            </TouchableOpacity>
            {showStartTimePicker && renderStartTimePicker()}
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
            <TouchableOpacity
              style={{ backgroundColor: "#1c9983", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5 }}
              onPress={() => setShowEndTimePicker(true)}
            >
              <Text style={{ color: "#fff" }}>Select End Time</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: selectedColor, width: 40, height: 40, marginLeft: 10, borderRadius: 20 }}
            />
            <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={() => setIconPickerVisible(true)}
            >
              <MaterialCommunityIcons name={selectedIcon} size={30} color="black" />
            </TouchableOpacity>
            {showEndTimePicker && renderEndTimePicker()}
          </View>
          <ColorPicker setSelectedColor={setSelectedColor} />
          <TouchableOpacity
            style={{ backgroundColor: "#1c9983", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5 }}
            onPress={addRecurringItem}
          >
            <Text style={{ color: "#fff" }}>Add</Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Recurring Items</Text>
          {recurringItems.map((item, index) => (
            <TaskItem key={index} item={item} />
          ))}
        </ScrollView>
        <IconPickerModal iconPickerVisible={iconPickerVisible} setIconPickerVisible={setIconPickerVisible} setSelectedIcon={setSelectedIcon} />
      </View>
    );
  };

const styles = StyleSheet.create({
  taskContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  taskText: {
    color: "#fff",
    fontWeight: "bold",
    marginRight: 10,
  },
});

export default DailyTaskScreen;
