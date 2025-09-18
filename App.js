import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';

import TaskItem from './components/TaskItem';
import AddTaskModal from './components/AddTaskModal';
import EditTaskModal from './components/EditTaskModal';
import { COLORS } from './constants/Colors';
import { STORAGE_KEY } from './constants/Storage';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks));
        }
      } catch (error) {
        console.error("Failed to load tasks.", error);
      }
    };
    loadTasks();
  }, []);

  useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      } catch (error) {
        console.error("Failed to save tasks.", error);
      }
    };
    saveTasks();
  }, [tasks]);

  const addTask = (task) => {
    setTasks([...tasks, task]);
    setModalVisible(false);
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const startEditTask = (task) => {
    setTaskToEdit(task);
    setEditModalVisible(true);
  };

  const saveEditedTask = (editedTask) => {
    setTasks(tasks.map(task =>
      task.id === editedTask.id ? editedTask : task
    ));
    setEditModalVisible(false);
    setTaskToEdit(null);
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

  const sortedTasks = [...tasks].sort((a, b) => {
    const order = { High: 1, Medium: 2, Low: 3 };
    const priorityComparison = order[a.priority] - order[b.priority];
    if (priorityComparison !== 0) return priorityComparison;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="sunny-outline" size={64} color={COLORS.gray} />
      <Text style={styles.emptyText}>All tasks completed!</Text>
      <Text style={styles.emptySubText}>Add a new task to get started.</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.heading}>Today's Slate</Text>
            <Text style={styles.counter}>
              {tasks.filter(t => !t.completed).length} tasks remaining
            </Text>
          </View>
          <TouchableOpacity onPress={clearAll}>
            <MaterialIcons name="delete-sweep" size={28} color={COLORS.gray} />
          </TouchableOpacity>
        </View>

        <FlatList
          style={styles.list}
          data={sortedTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onToggle={() => toggleTask(item.id)}
              onDelete={() => deleteTask(item.id)}
              onEdit={() => startEditTask(item)}
            />
          )}
          ListEmptyComponent={renderEmptyComponent}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
        />

        <TouchableOpacity
          style={styles.fab}
          onPress={() => setModalVisible(true)}
        >
          <Feather name="plus" size={28} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <AddTaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={addTask}
      />

      {taskToEdit && (
        <EditTaskModal
          visible={editModalVisible}
          onClose={() => setEditModalVisible(false)}
          onSave={saveEditedTask}
          task={taskToEdit}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.light },
  container: { flex: 1, paddingHorizontal: 20, backgroundColor: COLORS.light },
  header: {
    paddingTop: 20,
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: { fontSize: 32, fontWeight: 'bold', color: COLORS.dark },
  counter: { fontSize: 16, color: COLORS.gray, marginTop: 4 },
  list: { flex: 1, marginTop: 10 },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: -50,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.dark,
    marginTop: 16,
  },
  emptySubText: { fontSize: 15, color: COLORS.gray, marginTop: 8 },
});