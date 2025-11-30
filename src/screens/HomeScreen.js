import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../hooks/useTheme';
import TaskCard from '../components/TaskCard';
import ScreenWrapper from '../components/ScreenWrapper';
import EmptyState from '../components/EmptyState';
import { SHADOWS, TYPOGRAPHY, GLASS } from '../constants/Theme';
import { BlurView } from 'expo-blur';

const HomeScreen = ({ navigation }) => {
    const { tasks, toggleTask, deleteTask, isLoading } = useTasks();
    const { user } = useAuth();
    const { colors, spacing, isDark } = useTheme();

    const pendingTasks = tasks.filter(t => !t.completed).length;

    const renderHeader = () => (
        <View style={[styles.header, { marginBottom: spacing.l }]}>
            <View>
                <Text style={[styles.greeting, { color: colors.textSecondary }]}>
                    Hello, {user?.name || 'Guest'}
                </Text>
                <Text style={[styles.title, { color: colors.text }]}>
                    You have <Text style={{ color: colors.primary }}>{pendingTasks} tasks</Text>
                </Text>
            </View>
            <TouchableOpacity
                onPress={() => navigation.navigate('Profile')}
                style={[styles.profileButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
                <Feather name="user" size={24} color={colors.text} />
            </TouchableOpacity>
        </View>
    );

    return (
        <ScreenWrapper>
            <View style={[styles.container, { padding: spacing.m }]}>
                {renderHeader()}

                {tasks.length === 0 && !isLoading ? (
                    <EmptyState />
                ) : (
                    <FlatList
                        data={tasks}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <TaskCard
                                task={item}
                                onToggle={toggleTask}
                                onDelete={deleteTask}
                                onEdit={(task) => navigation.navigate('EditTask', { task })}
                            />
                        )}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100 }}
                    />
                )}

                <TouchableOpacity
                    style={[styles.fabContainer, SHADOWS.glow]}
                    onPress={() => navigation.navigate('AddTask')}
                    activeOpacity={0.8}
                >
                    <BlurView
                        intensity={GLASS.intensity}
                        tint={isDark ? 'dark' : 'light'}
                        style={[styles.fab, { backgroundColor: colors.primary + 'CC', borderColor: colors.border }]}
                    >
                        <Feather name="plus" size={32} color="#FFF" />
                    </BlurView>
                </TouchableOpacity>
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    greeting: {
        ...TYPOGRAPHY.body,
        marginBottom: 4,
    },
    title: {
        ...TYPOGRAPHY.h2,
    },
    profileButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    fabContainer: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        borderRadius: 30,
        overflow: 'hidden',
    },
    fab: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        borderWidth: 1,
    },
});

export default HomeScreen;
