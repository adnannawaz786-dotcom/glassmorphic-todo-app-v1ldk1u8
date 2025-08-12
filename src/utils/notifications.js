// Notification utilities for browser notifications and in-app notifications
class NotificationManager {
  constructor() {
    this.permission = 'default';
    this.isSupported = 'Notification' in window;
    this.callbacks = new Map();
    this.notificationQueue = [];
    this.maxNotifications = 5;
    this.defaultOptions = {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      vibrate: [100, 50, 100],
      requireInteraction: false,
      silent: false
    };
    
    this.init();
  }

  async init() {
    if (!this.isSupported) {
      console.warn('Browser notifications are not supported');
      return;
    }

    this.permission = Notification.permission;
    
    // Listen for visibility changes to manage notifications
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
  }

  async requestPermission() {
    if (!this.isSupported) {
      throw new Error('Notifications not supported');
    }

    if (this.permission === 'granted') {
      return true;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  async showNotification(title, options = {}) {
    if (!this.isSupported || this.permission !== 'granted') {
      return null;
    }

    // Don't show notifications if page is visible
    if (!document.hidden && !options.force) {
      return null;
    }

    const notificationOptions = {
      ...this.defaultOptions,
      ...options,
      timestamp: Date.now()
    };

    try {
      const notification = new Notification(title, notificationOptions);
      
      // Auto close after specified time
      if (options.autoClose !== false) {
        const timeout = options.timeout || 5000;
        setTimeout(() => {
          notification.close();
        }, timeout);
      }

      // Handle notification events
      notification.onclick = (event) => {
        event.preventDefault();
        window.focus();
        
        if (options.onClick) {
          options.onClick(event);
        }
        
        notification.close();
      };

      notification.onclose = (event) => {
        if (options.onClose) {
          options.onClose(event);
        }
      };

      notification.onerror = (event) => {
        console.error('Notification error:', event);
        if (options.onError) {
          options.onError(event);
        }
      };

      return notification;
    } catch (error) {
      console.error('Error showing notification:', error);
      return null;
    }
  }

  // Todo-specific notification methods
  async notifyTaskDue(task) {
    return this.showNotification(
      'Task Due Soon!',
      {
        body: `"${task.title}" is due ${this.formatDueTime(task.dueDate)}`,
        icon: '/icons/task-due.png',
        tag: `task-due-${task.id}`,
        requireInteraction: true,
        actions: [
          { action: 'complete', title: 'Mark Complete' },
          { action: 'snooze', title: 'Snooze 10min' }
        ],
        onClick: () => {
          this.executeCallback('taskDue', task);
        }
      }
    );
  }

  async notifyTaskCompleted(task) {
    return this.showNotification(
      'Task Completed! 🎉',
      {
        body: `You completed "${task.title}"`,
        icon: '/icons/task-complete.png',
        tag: `task-complete-${task.id}`,
        timeout: 3000,
        onClick: () => {
          this.executeCallback('taskCompleted', task);
        }
      }
    );
  }

  async notifyDailySummary(stats) {
    const { completed, total, streak } = stats;
    
    return this.showNotification(
      'Daily Summary',
      {
        body: `${completed}/${total} tasks completed today. ${streak} day streak! 🔥`,
        icon: '/icons/daily-summary.png',
        tag: 'daily-summary',
        requireInteraction: true,
        onClick: () => {
          this.executeCallback('dailySummary', stats);
        }
      }
    );
  }

  async notifyReminder(reminder) {
    return this.showNotification(
      'Reminder',
      {
        body: reminder.message,
        icon: '/icons/reminder.png',
        tag: `reminder-${reminder.id}`,
        requireInteraction: true,
        vibrate: [200, 100, 200],
        onClick: () => {
          this.executeCallback('reminder', reminder);
        }
      }
    );
  }

  // Schedule notifications
  scheduleNotification(task) {
    if (!task.dueDate || !task.notifications) return;

    const dueTime = new Date(task.dueDate).getTime();
    const now = Date.now();

    // Schedule notifications at different intervals
    const intervals = [
      { time: 24 * 60 * 60 * 1000, label: '1 day before' },
      { time: 60 * 60 * 1000, label: '1 hour before' },
      { time: 15 * 60 * 1000, label: '15 minutes before' },
      { time: 0, label: 'now' }
    ];

    intervals.forEach(interval => {
      const notifyTime = dueTime - interval.time;
      
      if (notifyTime > now) {
        const timeoutId = setTimeout(() => {
          this.notifyTaskDue(task);
        }, notifyTime - now);

        // Store timeout ID for potential cancellation
        this.storeTimeout(task.id, interval.time, timeoutId);
      }
    });
  }

  cancelScheduledNotifications(taskId) {
    const key = `scheduled-${taskId}`;
    const timeouts = this.callbacks.get(key) || [];
    
    timeouts.forEach(timeoutId => {
      clearTimeout(timeoutId);
    });
    
    this.callbacks.delete(key);
  }

  storeTimeout(taskId, interval, timeoutId) {
    const key = `scheduled-${taskId}`;
    const timeouts = this.callbacks.get(key) || [];
    timeouts.push(timeoutId);
    this.callbacks.set(key, timeouts);
  }

  // Callback management
  registerCallback(type, callback) {
    this.callbacks.set(type, callback);
  }

  executeCallback(type, data) {
    const callback = this.callbacks.get(type);
    if (callback && typeof callback === 'function') {
      callback(data);
    }
  }

  // Utility methods
  formatDueTime(dueDate) {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due.getTime() - now.getTime();

    if (diff < 0) return 'overdue';
    if (diff < 60 * 60 * 1000) return `in ${Math.ceil(diff / (60 * 1000))} minutes`;
    if (diff < 24 * 60 * 60 * 1000) return `in ${Math.ceil(diff / (60 * 60 * 1000))} hours`;
    
    return `on ${due.toLocaleDateString()}`;
  }

  handleVisibilityChange() {
    if (document.hidden) {
      // Page is hidden, enable notifications
      this.processNotificationQueue();
    } else {
      // Page is visible, clear queue
      this.notificationQueue = [];
    }
  }

  processNotificationQueue() {
    while (this.notificationQueue.length > 0 && this.getActiveNotifications().length < this.maxNotifications) {
      const { title, options } = this.notificationQueue.shift();
      this.showNotification(title, { ...options, force: true });
    }
  }

  getActiveNotifications() {
    // This is a simplified version as the Notifications API doesn't provide
    // a direct way to get active notifications in all browsers
    return [];
  }

  // Settings and preferences
  updateSettings(settings) {
    this.defaultOptions = {
      ...this.defaultOptions,
      ...settings
    };
    
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
  }

  getSettings() {
    const saved = localStorage.getItem('notificationSettings');
    return saved ? JSON.parse(saved) : this.defaultOptions;
  }

  isEnabled() {
    return this.isSupported && this.permission === 'granted';
  }

  getPermissionStatus() {
    return {
      supported: this.isSupported,
      permission: this.permission,
      enabled: this.isEnabled()
    };
  }
}

// Create singleton instance
const notificationManager = new NotificationManager();

// Export utilities
export const requestNotificationPermission = () => notificationManager.requestPermission();
export const showNotification = (title, options) => notificationManager.showNotification(title, options);
export const notifyTaskDue = (task) => notificationManager.notifyTaskDue(task);
export const notifyTaskCompleted = (task) => notificationManager.notifyTaskCompleted(task);
export const notifyDailySummary = (stats) => notificationManager.notifyDailySummary(stats);
export const notifyReminder = (reminder) => notificationManager.notifyReminder(reminder);
export const scheduleNotification = (task) => notificationManager.scheduleNotification(task);
export const cancelScheduledNotifications = (taskId) => notificationManager.cancelScheduledNotifications(taskId);
export const registerNotificationCallback = (type, callback) => notificationManager.registerCallback(type, callback);
export const updateNotificationSettings = (settings) => notificationManager.updateSettings(settings);
export const getNotificationSettings = () => notificationManager.getSettings();
export const getNotificationStatus = () => notificationManager.getPermissionStatus();

export default notificationManager;