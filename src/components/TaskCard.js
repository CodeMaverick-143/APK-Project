import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { useTheme } from '../hooks/useTheme';
import { SHADOWS, TYPOGRAPHY, GLASS } from '../constants/Theme';

const TaskCard = ({ task, onToggle, onDelete, onEdit }) => {
    const { colors, spacing, settings, isDark } = useTheme();
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.98);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1);
    };

    const handleToggle = () => {
        if (settings.hapticsEnabled) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onToggle(task.id);
    };

    const renderRightActions = (progress, dragX) => {
        return (
            <TouchableOpacity
                style={[styles.deleteButton, { backgroundColor: colors.error }]}
                onPress={() => {
                    if (settings.hapticsEnabled) {
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    }
                    onDelete(task.id);
                }}
            >
                <Feather name="trash-2" size={24} color="#FFF" />
            </TouchableOpacity>
        );
    };

    const priorityColors = {
        High: colors.error,
        Medium: colors.warning,
        Low: colors.info,
    };

    // Check if overdue
    const isOverdue = () => {
        if (!task.deadlineDate || task.completed) return false;
        const deadline = new Date(`${task.deadlineDate}T${task.deadlineTime || '23:59'}`);
        return new Date() > deadline;
    };

    const overdue = isOverdue();

    return (
        <Swipeable renderRightActions={renderRightActions}>
            <Animated.View style={[styles.container, animatedStyle, { marginBottom: spacing.m }]}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => onEdit(task)}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    style={SHADOWS.small}
                >
                    <BlurView
                        intensity={GLASS.intensity}
                        tint={isDark ? 'dark' : 'light'}
                        style={[
                            styles.card,
                            {
                                borderColor: overdue ? colors.error : colors.border,
                                backgroundColor: colors.surface,
                            }
                        ]}
                    >
                        <TouchableOpacity onPress={handleToggle} style={styles.checkboxContainer}>
                            <View style={[
                                styles.checkbox,
                                { borderColor: overdue ? colors.error : colors.primary },
                                task.completed && { backgroundColor: colors.primary, borderColor: colors.primary }
                            ]}>
                                {task.completed && <Feather name="check" size={14} color="#FFF" />}
                            </View>
                        </TouchableOpacity>

                        <View style={styles.contentContainer}>
                            <Text style={[
                                styles.taskText,
                                { color: colors.text },
                                task.completed && { textDecorationLine: 'line-through', color: colors.textSecondary }
                            ]}>
                                {task.title || task.text}
                            </Text>

                            {task.description ? (
                                <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={1}>
                                    {task.description}
                                </Text>
                            ) : null}

                            <View style={styles.metaContainer}>
                                <View style={[styles.badge, { backgroundColor: priorityColors[task.priority] + '20', borderColor: priorityColors[task.priority] + '40', borderWidth: 1 }]}>
                                    <Text style={[styles.badgeText, { color: priorityColors[task.priority] }]}>
                                        {task.priority}
                                    </Text>
                                </View>
                                {task.category && (
                                    <View style={[styles.badge, { backgroundColor: colors.secondary + '20', borderColor: colors.secondary + '40', borderWidth: 1, marginLeft: 8 }]}>
                                        <Text style={[styles.badgeText, { color: colors.secondary }]}>
                                            {task.category}
                                        </Text>
                                    </View>
                                )}
                                {task.deadlineDate && (
                                    <View style={[styles.badge, { backgroundColor: overdue ? colors.error + '20' : colors.textSecondary + '10', borderColor: overdue ? colors.error + '40' : colors.border, borderWidth: 1, marginLeft: 8, flexDirection: 'row', alignItems: 'center' }]}>
                                        <Feather name="clock" size={10} color={overdue ? colors.error : colors.textSecondary} style={{ marginRight: 4 }} />
                                        <Text style={[styles.badgeText, { color: overdue ? colors.error : colors.textSecondary }]}>
                                            {new Date(task.deadlineDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            {task.deadlineTime ? ` • ${task.deadlineTime}` : ''}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </BlurView>
                </TouchableOpacity>
            </Animated.View>
        </Swipeable>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: GLASS.borderRadius,
        borderWidth: GLASS.borderWidth,
        overflow: 'hidden',
    },
    checkboxContainer: {
        marginRight: 16,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 8,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        flex: 1,
    },
    taskText: {
        ...TYPOGRAPHY.body,
        fontWeight: '600',
        marginBottom: 4,
    },
    description: {
        ...TYPOGRAPHY.caption,
        marginBottom: 8,
    },
    metaContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginRight: 4,
        marginBottom: 4,
    },
    badgeText: {
        ...TYPOGRAPHY.caption,
        fontWeight: '600',
        fontSize: 10,
    },
    deleteButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: '100%',
        borderRadius: 20,
        marginRight: 20,
    },
});

export default TaskCard;
