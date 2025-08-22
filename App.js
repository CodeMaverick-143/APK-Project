import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';
import { useState } from 'react';

export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  const addTask = () => {
    if (task.trim() === '') return;
    setTasks([...tasks, task]);
    setTask('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Slate</Text>

      <TextInput
        style={styles.input}
        placeholder="Today's Task"
        value={task}
        onChangeText={setTask}
      />

      <Button title="Add Task" onPress={addTask} />

      <FlatList
        style={styles.list}
        data={tasks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={styles.taskItem}>• {item}</Text>
        )}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  list: {
    marginTop: 20,
    width: '100%',
  },
  taskItem: {
    fontSize: 16,
    padding: 10,
    marginVertical: 4,
    backgroundColor: '#e9ecef',
    borderRadius: 6,
  },
});
