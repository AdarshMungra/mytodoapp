import React, { useState, useEffect } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Constants from "expo-constants";
import * as SQLite from "expo-sqlite";

function openDatabase() {
  if (Platform.OS === "web") {
    return {
      transaction: () => {
        return {
          executeSql: () => {},
        };
      },
    };
  }

  const db = SQLite.openDatabase("db.db");

  db.transaction((tx) => {
    tx.executeSql(
      "create table if not exists items (id integer primary key not null, done int, value text);"
    );
  });
  return db;
}

const db = openDatabase();

function Items({ done: doneHeading, onPressItem }) {
  const [items, setItems] = useState(null);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from items where done = ?;`,
        [doneHeading ? 1 : 0],
        (_, { rows: { _array } }) => setItems(_array)
      );
    });
  }, []);

  const heading = doneHeading ? "Completed" : "Todo";

  if (items === null || items.length === 0) {
    return null;
  }

  const handleDelete = (id) => {
    db.transaction(
      (tx) => {
        tx.executeSql(`delete from items where id = ?;`, [id]);
      },
      null,
      onPressItem
    );
  };

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionHeading}>{heading}</Text>
      {items.map(({ id, done, value }) => (
        <View key={id} style={styles.itemContainer}>
          <TouchableOpacity
            onPress={() => onPressItem && onPressItem(id)}
            style={{
              backgroundColor: done ? "#1c9963" : "#fff",
              borderColor: "#000",
              borderWidth: 1,
              borderRadius: 16,
              padding: 10,
              flex: 1,
            }}
          >
            <Text style={{ color: done ? "#fff" : "#000" }}>{value}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(id)}>
            <Text style={styles.deleteButton}>X</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

export default function App() {
  const [text, setText] = useState(null);
  const [forceUpdate, forceUpdateId] = useForceUpdate();
  const [showLogs, setShowLogs] = useState(false); // State to toggle showing logs

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists items (id integer primary key not null, done int, value text);"
      );
    });
  }, []);

  const add = (text) => {
    if (text === null || text === "") {
      return false;
    }

    db.transaction(
      (tx) => {
        tx.executeSql("insert into items (done, value) values (0, ?)", [text]);
        tx.executeSql("select * from items", [], (_, { rows }) =>
          console.log(JSON.stringify(rows))
        );
      },
      null,
      forceUpdate
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>DO it now!!</Text>

      {Platform.OS === "web" ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={styles.heading}>
            Expo SQlite is not supported on web!
          </Text>
        </View>
      ) : (
        <>
          {showLogs ? (
            <ScrollView style={styles.listArea}>
              <Items
                done
                onPressItem={(id) =>
                  db.transaction(
                    (tx) => {
                      tx.executeSql(`delete from items where id = ?;`, [id]);
                    },
                    null,
                    forceUpdate
                  )
                }
              />
            </ScrollView>
          ) : (
            <>
              <View style={styles.flexRow}>
                <TextInput
                  onChangeText={(text) => setText(text)}
                  onSubmitEditing={() => {
                    add(text);
                    setText(null);
                  }}
                  placeholder="what do you need to do?"
                  style={styles.input}
                  value={text}
                />
              </View>
              <ScrollView style={styles.listArea}>
                <Items
                  key={`forceupdate-todo-${forceUpdateId}`}
                  done={false}
                  onPressItem={(id) =>
                    db.transaction(
                      (tx) => {
                        tx.executeSql(
                          `update items set done = 1 where id = ?;`,
                          [id]
                        );
                      },
                      null,
                      forceUpdate
                    )
                  }
                />
              </ScrollView>
            </>
          )}
          <TouchableOpacity onPress={() => setShowLogs(!showLogs)}>
            <Text
              style={{
                textAlign: "center",
                marginTop: 24,
                marginBottom: 24,
                color: "blue",
              }}
            >
              {showLogs ? "Back to Todos" : "View Logs"}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

function useForceUpdate() {
  const [value, setValue] = useState(0);
  return [() => setValue(value + 1), value];
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  heading: {
    marginTop: 32,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  flexRow: {
    flexDirection: "row",
  },
  input: {
    borderColor: "#4630eb",
    borderRadius: 24,
    borderWidth: 1,
    flex: 1,
    height: 48,
    margin: 16,
    padding: 16,
  },
  listArea: {
    backgroundColor: "#f0f0f0",
    flex: 1,
    paddingTop: 16,
  },
  sectionContainer: {
    marginBottom: 16,
    marginHorizontal: 16,
  },
  sectionHeading: {
    fontSize: 18,
    marginBottom: 8,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  deleteButton: {
    color: "red",
    marginLeft: 8,
  },
});
