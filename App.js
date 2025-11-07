import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Notifications from 'expo-notifications';

import DraggableTaskList from './components/DraggableTaskList';
import AddTaskModal from './components/AddTaskModal';
import EditTaskModal from './components/EditTaskModal';
import NotificationManager from './utils/NotificationManager';
import { COLORS } from './constants/Colors';
import { STORAGE_KEY } from './constants/Storage';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [notificationPermission, setNotificationPermission] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

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
    

    NotificationManager.requestPermissions().then(granted => {
      setNotificationPermission(granted);
    });
    

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      const taskId = notification.request.content.data.taskId;
      if (taskId) {
        console.log('Received notification for task:', taskId);
      }
    });
    
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const taskId = response.notification.request.content.data.taskId;
      if (taskId) {

        const task = tasks.find(t => t.id === taskId);
        if (task) {
          startEditTask(task);
        }
      }
    });
    
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
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

  const addTask = async (task) => {
    setTasks([...tasks, task]);
    setModalVisible(false);
    

    if (notificationPermission && task.dueDate) {
      const notificationId = await NotificationManager.scheduleTaskReminder(task);
      if (notificationId) {

        task.notificationId = notificationId;
      }
    }
  };

  const toggleTask = async (id) => {
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) return;
    
    const task = tasks[taskIndex];
    const updatedTask = { ...task, completed: !task.completed };
    
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex] = updatedTask;
    setTasks(updatedTasks);
    
    if (updatedTask.completed) {
      if (updatedTask.notificationId) {
        await NotificationManager.cancelNotification(updatedTask.notificationId);
      }
      
      if (notificationPermission) {
        await NotificationManager.showTaskCompletedNotification(updatedTask);
      }
    } else if (notificationPermission && updatedTask.dueDate) {
      const notificationId = await NotificationManager.scheduleTaskReminder(updatedTask);
      if (notificationId) {
        updatedTask.notificationId = notificationId;
        updatedTasks[taskIndex] = updatedTask;
        setTasks(updatedTasks);
      }
    }
  };

  const deleteTask = async (id) => {
    const taskToDelete = tasks.find(t => t.id === id);
    if (taskToDelete && taskToDelete.notificationId) {
      await NotificationManager.cancelNotification(taskToDelete.notificationId);
    }
    setTasks(tasks.filter(t => t.id !== id));
  };

  const startEditTask = (task) => {
    setTaskToEdit(task);
    setEditModalVisible(true);
  };

  const saveEditedTask = async (editedTask) => {
    const originalTask = tasks.find(t => t.id === editedTask.id);
    
    setTasks(tasks.map(task =>
      task.id === editedTask.id ? editedTask : task
    ));
    
    if (notificationPermission && originalTask) {
      if (originalTask.notificationId) {
        await NotificationManager.cancelNotification(originalTask.notificationId);
      }
      
      if (editedTask.dueDate && !editedTask.completed) {
        const notificationId = await NotificationManager.scheduleTaskReminder(editedTask);
        if (notificationId) {
          editedTask.notificationId = notificationId;
          setTasks(tasks.map(task =>
            task.id === editedTask.id ? {...editedTask, notificationId} : task
          ));
        }
      }
    }
    
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
          { 
            text: 'Clear All', 
            onPress: async () => {
              for (const task of tasks) {
                if (task.notificationId) {
                  await NotificationManager.cancelNotification(task.notificationId);
                }
              }
              setTasks([]);
            }, 
            style: 'destructive' 
          },
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
    <GestureHandlerRootView style={{ flex: 1 }}>
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

          {tasks.length === 0 ? (
            renderEmptyComponent()
          ) : (
            <DraggableTaskList
              tasks={sortedTasks}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onEdit={startEditTask}
              onReorder={setTasks}
            />
          )}

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
    </GestureHandlerRootView>
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