import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const NotificationManager = {
  requestPermissions: async () => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  },

  scheduleTaskReminder: async (task) => {
    if (!task.dueDate) return null;

    const dueDate = new Date(task.dueDate);
    const notificationDate = new Date(dueDate);
    notificationDate.setHours(9, 0, 0, 0);

    const now = new Date();
    if (
      dueDate.getDate() === now.getDate() &&
      dueDate.getMonth() === now.getMonth() &&
      dueDate.getFullYear() === now.getFullYear() &&
      now.getHours() >= 9
    ) {
      notificationDate.setTime(now.getTime() + 30 * 60 * 1000); // 30 minutes from now
    }

    if (notificationDate <= now) return null;

    const priorityEmoji = {
      High: '🔴',
      Medium: '🟠',
      Low: '🟢',
    };

    const emoji = priorityEmoji[task.priority] || '📝';
    
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `${emoji} Task Reminder: ${task.text}`,
          body: `Your ${task.priority} priority task in ${task.category} category is due today!`,
          data: { taskId: task.id },
        },
        trigger: notificationDate,
      });
      
      return notificationId;
    } catch (error) {
      console.error('Failed to schedule notification:', error);
      return null;
    }
  },

  cancelNotification: async (notificationId) => {
    if (notificationId) {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    }
  },

  showTaskCompletedNotification: async (task) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '✅ Task Completed!',
        body: `You've completed "${task.text}"`,
        data: { taskId: task.id },
      },
      trigger: null,
    });
  },
};

export default NotificationManager;
