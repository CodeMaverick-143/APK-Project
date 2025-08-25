import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert
} from 'react-native';
import { useState } from 'react';

const COLORS = {
  primary: '#007bff',
  primaryMuted: '#e7f3ff',
  danger: '#dc3545',
  dangerMuted: '#f8d7da',
  light: '#f8f9fa',
  dark: '#343a40',
  gray: '#6c757d',
  white: '#ffffff',
};

const TaskItem = ({ task, onToggle, onDelete }) => {
  return (
    <View style={styles.taskContainer}>
      <TouchableOpacity onPress={onToggle} style={styles.taskWrapper}>
        <View style={[styles.checkbox, task.completed && styles.checkboxChecked]}>
          {task.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={[styles.taskText, task.completed && styles.taskTextCompleted]}>
          {task.text}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  const addTask = () => {
    if (task.trim() === '') {
      Alert.alert('Empty Task', 'Please enter a task before adding.');
      return;
    }
    setTasks([...tasks, { id: Date.now().toString(), text: task, completed: false }]);
    setTask('');
    Keyboard.dismiss();
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const clearAll = () => {
    if (tasks.length > 0) {
      Alert.alert(
        'Confirm Clear',
        'Are you sure you want to delete all tasks?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Clear All', onPress: () => setTasks([]), style: 'destructive' },
        ],
        { cancelable: true }
      );
    }
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No tasks yet! 🙃</Text>
      <Text style={styles.emptySubText}>Add a task to get started.</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <StatusBar style="dark" />
        <View style={styles.header}>
          <Text style={styles.heading}>📝 Slate</Text>
          <Text style={styles.counter}>
            {tasks.filter(t => t.completed).length} / {tasks.length} Done
          </Text>
        </View>

        <FlatList
          style={styles.list}
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskItem task={item} onToggle={() => toggleTask(item.id)} onDelete={() => deleteTask(item.id)} />
          )}
          ListEmptyComponent={renderEmptyComponent}
          contentContainerStyle={{ flexGrow: 1 }}
        />

        <View style={styles.footer}>
          <TextInput
            style={styles.input}
            placeholder="What's next on your list?"
            placeholderTextColor={COLORS.gray}
            value={task}
            onChangeText={setTask}
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={clearAll}>
              <Text style={[styles.buttonText, styles.clearButtonText]}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.addButton]} onPress={addTask}>
              <Text style={styles.buttonText}>Add Task</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: COLORS.light,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.dark,
    textAlign: 'center',
  },
  counter: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 8,
  },
  list: {
    flex: 1,
    marginTop: 10,
  },
  footer: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#ced4da',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: COLORS.primary,
  },
  clearButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  clearButtonText: {
    color: COLORS.danger,
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 15,
    marginVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  taskWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
  },
  checkmark: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold'
  },
  taskText: {
    fontSize: 16,
    color: COLORS.dark,
    flexShrink: 1,
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.gray,
  },
  deleteButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  deleteButtonText: {
    fontSize: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.gray,
  },
  emptySubText: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 8,
  },
});
