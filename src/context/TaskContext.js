import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '../api/client';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchTasks();
        } else {
            setTasks([]);
        }
    }, [user]);

    const fetchTasks = async () => {
        setIsLoading(true);
        try {
            const response = await client.get('/tasks');
            const mappedTasks = response.data.map(t => ({ ...t, id: t._id }));
            setTasks(mappedTasks);
            await AsyncStorage.setItem('tasks', JSON.stringify(mappedTasks));
        } catch (error) {
            console.log('Error fetching tasks', error);
            const localTasks = await AsyncStorage.getItem('tasks');
            if (localTasks) {
                setTasks(JSON.parse(localTasks));
            }
        } finally {
            setIsLoading(false);
        }
    };

    const addTask = async (taskData) => {
        const tempId = Date.now().toString();
        const newTask = { ...taskData, id: tempId, completed: false, createdAt: new Date().toISOString() };
        setTasks(prev => [newTask, ...prev]);

        try {
            const response = await client.post('/tasks', taskData);
            setTasks(prev => prev.map(t => t.id === tempId ? { ...response.data, id: response.data._id } : t));
        } catch (error) {
            console.log('Error adding task', error);
            alert('Failed to add task');
            setTasks(prev => prev.filter(t => t.id !== tempId));
        }
    };

    const updateTask = async (id, updates) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));

        try {
            await client.put(`/tasks/${id}`, updates);
        } catch (error) {
            console.log('Error updating task', error);
            alert('Failed to update task');
            fetchTasks();
        }
    };

    const deleteTask = async (id) => {
        const prevTasks = [...tasks];
        setTasks(prev => prev.filter(t => t.id !== id));

        try {
            await client.delete(`/tasks/${id}`);
        } catch (error) {
            console.log('Error deleting task', error);
            alert('Failed to delete task');
            setTasks(prevTasks);
        }
    };

    const toggleTask = async (id) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

        try {
            await client.patch(`/tasks/${id}/toggle`);
        } catch (error) {
            console.log('Error toggling task', error);
            setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
        }
    };

    return (
        <TaskContext.Provider value={{
            tasks,
            isLoading,
            addTask,
            updateTask,
            deleteTask,
            toggleTask,
            fetchTasks
        }}>
            {children}
        </TaskContext.Provider>
    );
};
