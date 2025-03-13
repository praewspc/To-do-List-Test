import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput, Button, Card, IconButton } from "react-native-paper";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    saveTodos();
  }, [todos]);

  const loadTodos = async () => {
    const storedTodos = await AsyncStorage.getItem("todos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  };

  const saveTodos = async () => {
    await AsyncStorage.setItem("todos", JSON.stringify(todos));
  };

  const addTodo = () => {
    if (input.trim() === "") return;
    setTodos([...todos, { id: Date.now().toString(), text: input, completed: false }]);
    setInput("");
  };

  const toggleComplete = (id: string) => {
    setTodos(
      todos.map(todo => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📌 To-Do List</Text>
      <View style={styles.inputContainer}>
        <TextInput
          mode="outlined"
          label="Add new task..."
          value={input}
          onChangeText={setInput}
          style={styles.input}
        />
        <Button mode="contained" onPress={addTodo} style={styles.addButton}>
          ADD
        </Button>
      </View>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.todoItem}>
            <View style={styles.todoRow}>
              <TouchableOpacity onPress={() => toggleComplete(item.id)} style={styles.todoContent}>
                <Text style={[styles.todoText, item.completed && styles.completed]}>
                  {item.text}
                </Text>
              </TouchableOpacity>
              <IconButton 
                icon="delete" 
                onPress={() => deleteTodo(item.id)} 
                iconColor="red" 
              />
            </View>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F8F9FA" },
  header: { fontSize: 26, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "#333" },
  inputContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 20 
  },
  input: { 
    flex: 1, 
    marginRight: 10 
  },
  addButton: { 
    height: 50, 
    justifyContent: "center",
    paddingHorizontal: 20 
  },
  todoItem: { 
    backgroundColor: "white", 
    borderRadius: 10, 
    marginBottom: 10, 
    padding: 10, 
    elevation: 2 
  },
  todoRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between" 
  },
  todoContent: { 
    flex: 1 
  },
  todoText: { 
    fontSize: 18 
  },
  completed: { 
    textDecorationLine: "line-through", 
    color: "gray" 
  }
});
