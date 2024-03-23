import React from "react";
import { Text, StyleSheet } from "react-native";

const TitleText = () => {
  return <Text style={styles.title}>Todo App</Text>;
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 32,
  },
});

export default TitleText;
