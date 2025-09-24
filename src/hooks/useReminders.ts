import { useState, useEffect, useRef } from 'react';
import type { Task, GlobalNotification } from '@/src/types';
import { useClickOutside } from './useClickOutside';

interface UseRemindersProps {
  tasks: Task[];
  globalNotifications: GlobalNotification[];
  onDismissReminder: (id: string) => void;
  onDismissGlobalNotification: (id: string) => void;
}

export const useReminders = ({
  tasks,
  globalNotifications,
  onDismissReminder,
  onDismissGlobalNotification,
}: UseRemindersProps) => {
  const [activeReminders, setActiveReminders] = useState<Task[]>([]);
  const [isBellRinging, setIsBellRinging] = useState(false);
  const [showRemindersDropdown, setShowRemindersDropdown] = useState(false);

  const remindersDropdownRef = useClickOutside<HTMLDivElement>(() => setShowRemindersDropdown(false));

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const dueTasks = tasks.filter(task => !task.completed && task.reminder && new Date(task.reminder) <= now);
      const newDueTasks = dueTasks.filter(dueTask => !activeReminders.some(active => active.id === dueTask.id));
      if (newDueTasks.length > 0) {
        setIsBellRinging(true);
        setTimeout(() => setIsBellRinging(false), 1000);
      }
      setActiveReminders(dueTasks);
    }, 15000);
    return () => clearInterval(interval);
  }, [tasks, activeReminders]);

  const notificationCount = activeReminders.length + globalNotifications.length;

  return {
    activeReminders,
    isBellRinging,
    showRemindersDropdown,
    setShowRemindersDropdown,
    remindersDropdownRef,
    notificationCount,
    onDismissReminder,
    onDismissGlobalNotification,
  };
};