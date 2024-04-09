import React from "react";
import { TextInput, TouchableOpacity, Text, View } from "react-native";
import styles from "./styles"; 

interface InputProps {
  text: string;
  onChangeText: (text: string) => void;
  onSubmitEditing: () => void;
}

const Input: React.FC<InputProps> = ({ text, onChangeText, onSubmitEditing }) => {
  return (
    <View style={styles.flexRow}>
      <TextInput
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        placeholder="What do you need to do?"
        style={styles.input}
        value={text}
      />
      <TouchableOpacity onPress={onSubmitEditing}>
        <Text style={styles.addBtn}>Add</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Input;
