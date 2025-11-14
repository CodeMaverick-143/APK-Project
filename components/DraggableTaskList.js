import React, { useCallback, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
  withTiming,
  useAnimatedReaction,
  scrollTo,
  runOnJS,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import TaskItem from './TaskItem';

const TASK_HEIGHT = 90;

const DraggableTaskList = ({ 
  tasks, 
  onToggle, 
  onDelete, 
  onEdit, 
  onReorder 
}) => {
  const scrollY = useSharedValue(0);
  const scrollViewRef = useAnimatedRef();
  const activeTaskIndex = useSharedValue(-1);
  const taskPositions = useSharedValue(tasks.map((_, index) => index * TASK_HEIGHT));
  const animatedTaskPositions = useRef(tasks.map((_, index) => useSharedValue(index * TASK_HEIGHT))).current;


  React.useEffect(() => {
    tasks.forEach((_, index) => {
      animatedTaskPositions[index].value = withTiming(index * TASK_HEIGHT);
    });
    taskPositions.value = tasks.map((_, index) => index * TASK_HEIGHT);
  }, [tasks]);

  const handleReorder = useCallback((from, to) => {
    if (from !== to) {
      const reorderedTasks = [...tasks];
      const task = reorderedTasks.splice(from, 1)[0];
      reorderedTasks.splice(to, 0, task);
      onReorder(reorderedTasks);
    }
  }, [tasks, onReorder]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });


  useAnimatedReaction(
    () => {
      return activeTaskIndex.value;
    },
    (activeIndex) => {
      if (activeIndex !== -1) {
        const position = taskPositions.value[activeIndex];
        const scrollPosition = scrollY.value;
        
        // Auto-scroll up
        if (position - scrollPosition < 100 && scrollPosition > 0) {
          scrollTo(scrollViewRef, 0, scrollPosition - 10, false);
        }
        
        // Auto-scroll down
        if (position - scrollPosition > 300 && scrollPosition < tasks.length * TASK_HEIGHT - 400) {
          scrollTo(scrollViewRef, 0, scrollPosition + 10, false);
        }
      }
    }
  );

  const panGesture = Gesture.Pan()
    .onStart((event) => {
      const startIndex = Math.floor((event.absoluteY + scrollY.value - 100) / TASK_HEIGHT);
      if (startIndex >= 0 && startIndex < tasks.length) {
        activeTaskIndex.value = startIndex;
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
      }
    })
    .onUpdate((event) => {
      if (activeTaskIndex.value !== -1) {
        const currentIndex = activeTaskIndex.value;
        const currentPosition = event.absoluteY + scrollY.value - 100;
        const newIndex = Math.floor(currentPosition / TASK_HEIGHT);
        
        if (newIndex >= 0 && newIndex < tasks.length && newIndex !== currentIndex) {
          // Provide haptic feedback when crossing task boundaries
          runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
          for (let i = 0; i < tasks.length; i++) {
            if (i === currentIndex) continue;
            
            if (newIndex > currentIndex && i > currentIndex && i <= newIndex) {
              animatedTaskPositions[i].value = withTiming((i - 1) * TASK_HEIGHT);
            } else if (newIndex < currentIndex && i < currentIndex && i >= newIndex) {
              animatedTaskPositions[i].value = withTiming((i + 1) * TASK_HEIGHT);
            } else {
              animatedTaskPositions[i].value = withTiming(i * TASK_HEIGHT);
            }
          }
          
          animatedTaskPositions[currentIndex].value = currentPosition - TASK_HEIGHT / 2;
        }
      }
    })
    .onEnd(() => {
      if (activeTaskIndex.value !== -1) {
        const currentIndex = activeTaskIndex.value;
        const currentPosition = animatedTaskPositions[currentIndex].value;
        const newIndex = Math.min(
          tasks.length - 1,
          Math.max(0, Math.round(currentPosition / TASK_HEIGHT))
        );
        
        // Animate to final position
        animatedTaskPositions[currentIndex].value = withTiming(newIndex * TASK_HEIGHT, {}, () => {
          if (currentIndex !== newIndex) {
            runOnJS(handleReorder)(currentIndex, newIndex);
          }
        });
        
        activeTaskIndex.value = -1;
      }
    });

  return (
    <Animated.ScrollView
      ref={scrollViewRef}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {tasks.map((task, index) => (
        <GestureDetector key={task.id} gesture={panGesture}>
          <Animated.View
            style={[
              styles.taskWrapper,
              {
                zIndex: activeTaskIndex.value === index ? 1 : 0,
                transform: [
                  {
                    translateY: animatedTaskPositions[index]
                  }
                ]
              }
            ]}
          >
            <TaskItem
              task={task}
              onToggle={() => onToggle(task.id)}
              onDelete={() => onDelete(task.id)}
              onEdit={() => onEdit(task)}
            />
          </Animated.View>
        </GestureDetector>
      ))}
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 80,
    minHeight: '100%',
  },
  taskWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: TASK_HEIGHT,
  },
});

export default DraggableTaskList;
