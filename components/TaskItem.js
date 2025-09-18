import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/Colors';

const priorityColors = {
  High: COLORS.danger,
  Medium: COLORS.warning,
  Low: COLORS.info,
};

const Pill = ({ text, color }) => (
  <View style={[styles.pill, { backgroundColor: color }]}>
    <Text style={styles.pillText}>{text}</Text>
  </View>
);

const TaskItem = ({ task, onToggle, onDelete, onEdit }) => {
  const priorityColor = priorityColors[task.priority] || COLORS.gray;

  return (
    <TouchableOpacity onLongPress={onEdit} style={styles.taskContainer}>
      <View style={[styles.priorityIndicator, { backgroundColor: priorityColor }]} />
      <TouchableOpacity onPress={onToggle} style={styles.checkboxContainer}>
        <View style={[styles.checkbox, task.completed && styles.checkboxChecked]}>
          {task.completed && <Feather name="check" size={16} color={COLORS.white} />}
        </View>
      </TouchableOpacity>
      <View style={styles.taskDetails}>
        <Text style={[styles.taskText, task.completed && styles.taskTextCompleted]}>
          {task.text}
        </Text>
        <View style={styles.metaContainer}>
          <Pill text={task.category} color={COLORS.primaryMuted} />
          {task.dueDate && <Pill text={new Date(task.dueDate).toLocaleDateString()} color={COLORS.successMuted} />}
        </View>
      </View>
      <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
        <MaterialIcons name="delete-outline" size={24} color={COLORS.gray} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  priorityIndicator: {
    width: 6,
    height: '100%',
  },
  checkboxContainer: {
    padding: 15,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  taskDetails: {
    flex: 1,
    paddingVertical: 15,
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
  metaContainer: {
    flexDirection: 'row',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  pill: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 6,
    marginBottom: 6,
  },
  pillText: {
    color: COLORS.dark,
    fontSize: 12,
    fontWeight: '500',
  },
  deleteButton: {
    padding: 15,
  },
});

export default TaskItem;