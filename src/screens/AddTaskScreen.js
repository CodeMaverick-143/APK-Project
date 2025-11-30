import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BlurView } from 'expo-blur';
import { useTasks } from '../context/TaskContext';
import { useTheme } from '../hooks/useTheme';
import { SHADOWS, TYPOGRAPHY, GLASS } from '../constants/Theme';
import GlassWrapper from '../components/GlassWrapper';

const AddTaskScreen = ({ navigation }) => {
    const { addTask } = useTasks();
    const { colors, spacing, isDark } = useTheme();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [category, setCategory] = useState('Personal');
    const [deadlineDate, setDeadlineDate] = useState(new Date());
    const [deadlineTime, setDeadlineTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [focusedInput, setFocusedInput] = useState(null);

    const handleAddTask = async () => {
        if (title.trim().length === 0) return;

        const formattedDate = deadlineDate.toISOString().split('T')[0];
        const formattedTime = deadlineTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

        await addTask({
            title,
            description,
            priority,
            category,
            deadlineDate: formattedDate,
            deadlineTime: formattedTime,
            completed: false,
        });
        navigation.goBack();
    };

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDeadlineDate(selectedDate);
        }
    };

    const onTimeChange = (event, selectedTime) => {
        setShowTimePicker(false);
        if (selectedTime) {
            setDeadlineTime(selectedTime);
        }
    };

    const priorities = ['High', 'Medium', 'Low'];
    const categories = ['Work', 'Personal', 'Study', 'Health'];

    const priorityColors = {
        High: colors.error,
        Medium: colors.warning,
        Low: colors.info,
    };

    const renderGlassInput = (value, onChange, placeholder, multiline = false, type) => (
        <BlurView
            intensity={GLASS.intensity}
            tint={isDark ? 'dark' : 'light'}
            style={[
                styles.glassInput,
                {
                    borderColor: focusedInput === type ? colors.accent : colors.border,
                    backgroundColor: colors.surface,
                },
                focusedInput === type && SHADOWS.glow
            ]}
        >
            <TextInput
                style={[styles.input, { color: colors.text, minHeight: multiline ? 100 : 50 }]}
                placeholder={placeholder}
                placeholderTextColor={colors.textSecondary}
                value={value}
                onChangeText={onChange}
                multiline={multiline}
                onFocus={() => setFocusedInput(type)}
                onBlur={() => setFocusedInput(null)}
            />
        </BlurView>
    );

    return (
        <GlassWrapper>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View style={[styles.header, { padding: spacing.l, borderBottomColor: colors.border }]}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Feather name="x" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: colors.text }]}>New Task</Text>
                    <TouchableOpacity onPress={handleAddTask} disabled={title.length === 0}>
                        <BlurView
                            intensity={80}
                            tint={isDark ? 'dark' : 'light'}
                            style={[
                                styles.saveButtonContainer,
                                { backgroundColor: title.length > 0 ? colors.primary + '20' : 'transparent', borderColor: title.length > 0 ? colors.primary : 'transparent' }
                            ]}
                        >
                            <Text style={[
                                styles.saveButton,
                                { color: title.length > 0 ? colors.primary : colors.textSecondary }
                            ]}>Save</Text>
                        </BlurView>
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={{ padding: spacing.l }}>
                    <Text style={[styles.label, { color: colors.textSecondary, marginBottom: spacing.s }]}>Title</Text>
                    {renderGlassInput(title, setTitle, "Enter task title", false, 'title')}

                    <Text style={[styles.label, { color: colors.textSecondary, marginTop: spacing.l, marginBottom: spacing.s }]}>Description</Text>
                    {renderGlassInput(description, setDescription, "Add details", true, 'description')}

                    <View style={[styles.section, { marginTop: spacing.xl }]}>
                        <Text style={[styles.label, { color: colors.textSecondary, marginBottom: spacing.m }]}>Deadline</Text>
                        <View style={styles.row}>
                            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                                <BlurView
                                    intensity={GLASS.intensity}
                                    tint={isDark ? 'dark' : 'light'}
                                    style={[styles.dateButton, { borderColor: colors.border, backgroundColor: colors.surface }]}
                                >
                                    <Feather name="calendar" size={16} color={colors.text} />
                                    <Text style={[styles.dateText, { color: colors.text }]}>
                                        {deadlineDate.toLocaleDateString()}
                                    </Text>
                                </BlurView>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => setShowTimePicker(true)}>
                                <BlurView
                                    intensity={GLASS.intensity}
                                    tint={isDark ? 'dark' : 'light'}
                                    style={[styles.dateButton, { borderColor: colors.border, backgroundColor: colors.surface, marginLeft: spacing.m }]}
                                >
                                    <Feather name="clock" size={16} color={colors.text} />
                                    <Text style={[styles.dateText, { color: colors.text }]}>
                                        {deadlineTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Text>
                                </BlurView>
                            </TouchableOpacity>
                        </View>
                        {showDatePicker && (
                            <DateTimePicker
                                value={deadlineDate}
                                mode="date"
                                display="default"
                                onChange={onDateChange}
                            />
                        )}
                        {showTimePicker && (
                            <DateTimePicker
                                value={deadlineTime}
                                mode="time"
                                display="default"
                                onChange={onTimeChange}
                            />
                        )}
                    </View>

                    <View style={[styles.section, { marginTop: spacing.xl }]}>
                        <Text style={[styles.label, { color: colors.textSecondary, marginBottom: spacing.m }]}>Priority</Text>
                        <View style={styles.chipContainer}>
                            {priorities.map(p => (
                                <TouchableOpacity
                                    key={p}
                                    onPress={() => setPriority(p)}
                                >
                                    <BlurView
                                        intensity={GLASS.intensity}
                                        tint={isDark ? 'dark' : 'light'}
                                        style={[
                                            styles.chip,
                                            { borderColor: priority === p ? priorityColors[p] : colors.border, backgroundColor: priority === p ? priorityColors[p] + '20' : colors.surface }
                                        ]}
                                    >
                                        <Text style={[
                                            styles.chipText,
                                            { color: priority === p ? priorityColors[p] : colors.textSecondary, fontWeight: priority === p ? '700' : '400' }
                                        ]}>{p}</Text>
                                    </BlurView>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={[styles.section, { marginTop: spacing.xl }]}>
                        <Text style={[styles.label, { color: colors.textSecondary, marginBottom: spacing.m }]}>Category</Text>
                        <View style={styles.chipContainer}>
                            {categories.map(c => (
                                <TouchableOpacity
                                    key={c}
                                    onPress={() => setCategory(c)}
                                >
                                    <BlurView
                                        intensity={GLASS.intensity}
                                        tint={isDark ? 'dark' : 'light'}
                                        style={[
                                            styles.chip,
                                            { borderColor: category === c ? colors.secondary : colors.border, backgroundColor: category === c ? colors.secondary + '20' : colors.surface }
                                        ]}
                                    >
                                        <Text style={[
                                            styles.chipText,
                                            { color: category === c ? colors.secondary : colors.textSecondary, fontWeight: category === c ? '700' : '400' }
                                        ]}>{c}</Text>
                                    </BlurView>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </GlassWrapper>
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
        borderBottomWidth: 1,
    },
    title: {
        ...TYPOGRAPHY.h3,
    },
    saveButtonContainer: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        overflow: 'hidden',
    },
    saveButton: {
        ...TYPOGRAPHY.button,
    },
    label: {
        ...TYPOGRAPHY.caption,
        textTransform: 'uppercase',
        fontWeight: '600',
        letterSpacing: 1,
    },
    glassInput: {
        borderRadius: GLASS.borderRadius,
        borderWidth: 1,
        overflow: 'hidden',
        padding: 4,
    },
    input: {
        ...TYPOGRAPHY.body,
        padding: 12,
    },
    section: {
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        marginRight: 10,
        marginBottom: 10,
        overflow: 'hidden',
    },
    chipText: {
        ...TYPOGRAPHY.body,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderWidth: 1,
        borderRadius: GLASS.borderRadius,
        overflow: 'hidden',
    },
    dateText: {
        marginLeft: 8,
        ...TYPOGRAPHY.body,
    },
});

export default AddTaskScreen;
