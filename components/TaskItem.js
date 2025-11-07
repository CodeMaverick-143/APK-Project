import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated as RNAnimated } from 'react-native';
import { Feather, MaterialIcons, AntDesign } from '@expo/vector-icons';
import { COLORS } from '../constants/Colors';
import { Swipeable } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, withTiming, withSpring, useSharedValue } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

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
  const scale = useSharedValue(1);
  
  // Animation for task press
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    };
  });
  
  const onTaskPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSpring(0.95, { damping: 10 }, () => {
      scale.value = withSpring(1);
    });
    onToggle();
  };
  
  const onLongPressTask = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSpring(0.98);
    onEdit();
  };
  
  // Render right swipe actions (delete)
  const renderRightActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 100],
      extrapolate: 'clamp',
    });
    
    // Trigger haptic feedback when swipe reaches threshold
    if (dragX._value < -50) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    return (
      <RNAnimated.View style={[styles.rightAction, {
        transform: [{ translateX: trans }],
      }]}>
        <TouchableOpacity 
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            onDelete();
          }} 
          style={styles.actionButton}
        >
          <MaterialIcons name="delete" size={24} color={COLORS.white} />
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </RNAnimated.View>
    );
  };
  
  // Render left swipe actions (toggle completion)
  const renderLeftActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [-100, 0],
      extrapolate: 'clamp',
    });
    
    // Trigger haptic feedback when swipe reaches threshold
    if (dragX._value > 50) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    return (
      <RNAnimated.View style={[styles.leftAction, {
        transform: [{ translateX: trans }],
        backgroundColor: task.completed ? COLORS.warning : COLORS.primary,
      }]}>
        <TouchableOpacity 
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onToggle();
          }} 
          style={styles.actionButton}
        >
          {task.completed ? (
            <>
              <AntDesign name="reload1" size={24} color={COLORS.white} />
              <Text style={styles.actionText}>Undo</Text>
            </>
          ) : (
            <>
              <Feather name="check" size={24} color={COLORS.white} />
              <Text style={styles.actionText}>Complete</Text>
            </>
          )}
        </TouchableOpacity>
      </RNAnimated.View>
    );
  };
  
  return (
    <Swipeable
      renderRightActions={renderRightActions}
      renderLeftActions={renderLeftActions}
      friction={2}
      overshootFriction={8}
    >
      <Animated.View style={[styles.taskContainer, animatedStyle]}>
        <View style={[styles.priorityIndicator, { backgroundColor: priorityColor }]} />
        <TouchableOpacity onPress={onTaskPress} style={styles.checkboxContainer}>
          <View style={[styles.checkbox, task.completed && styles.checkboxChecked]}>
            {task.completed && <Feather name="check" size={16} color={COLORS.white} />}
          </View>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.taskDetails}
          onLongPress={onLongPressTask}
          activeOpacity={0.7}
        >
          <Text style={[styles.taskText, task.completed && styles.taskTextCompleted]}>
            {task.text}
          </Text>
          <View style={styles.metaContainer}>
            <Pill text={task.category} color={COLORS.primaryMuted} />
            {task.dueDate && <Pill text={new Date(task.dueDate).toLocaleDateString()} color={COLORS.successMuted} />}
          </View>
        </TouchableOpacity>
      </Animated.View>
    </Swipeable>
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
  rightAction: {
    backgroundColor: COLORS.danger,
    justifyContent: 'center',
    alignItems: 'flex-end',
    flex: 1,
    borderRadius: 12,
    marginVertical: 6,
  },
  leftAction: {
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 1,
    borderRadius: 12,
    marginVertical: 6,
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    width: 100,
  },
  actionText: {
    color: COLORS.white,
    fontWeight: '600',
    marginTop: 4,
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