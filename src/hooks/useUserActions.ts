import { useCallback } from 'react';
import type { Note, Task, WeeklyGoal, UserProfile } from '@/src/types';
import { supabase } from '@/src/integrations/supabase/client';

interface UseUserActionsProps {
  isAuthenticated: boolean;
  user: UserProfile;
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setWeeklyGoals: React.Dispatch<React.SetStateAction<WeeklyGoal[]>>;
  setFavoriteChapterIds: React.Dispatch<React.SetStateAction<Set<number>>>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  favoriteChapterIds: Set<number>;
  setActiveReminders: React.Dispatch<React.SetStateAction<Task[]>>;
}

export const useUserActions = ({
  isAuthenticated,
  user,
  setNotes,
  setTasks,
  setWeeklyGoals,
  setFavoriteChapterIds,
  setFormData,
  favoriteChapterIds,
  setActiveReminders,
}: UseUserActionsProps) => {

  const handleInputChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const inputValue = isCheckbox ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prevData => ({ ...prevData, [name]: inputValue }));

    if (isAuthenticated && user.email) {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const { error } = await supabase
        .from('user_form_data')
        .upsert({ user_id: authUser.id, key: name, value: inputValue })
        .eq('user_id', authUser.id)
        .eq('key', name);
      if (error) console.error(`Error saving form data for key ${name}:`, error);
    }
  }, [isAuthenticated, user.email, setFormData]);

  const handleAddNote = useCallback(async (content: string) => {
    if (!content.trim() || !isAuthenticated || !user.email) return;
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return;

    const { data, error } = await supabase
      .from('user_notes')
      .insert({ user_id: authUser.id, content })
      .select();

    if (error) console.error('Error adding note:', error);
    else if (data) setNotes(prevNotes => [...data, ...prevNotes]);
  }, [isAuthenticated, user.email, setNotes]);

  const handleEditNote = useCallback(async (id: string, content: string) => {
    if (!isAuthenticated || !user.email) return;
    const { error } = await supabase
      .from('user_notes')
      .update({ content })
      .eq('id', id)
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

    if (error) console.error('Error editing note:', error);
    else setNotes(prevNotes => prevNotes.map(note => (note.id === id ? { ...note, content } : note)));
  }, [isAuthenticated, user.email, setNotes]);

  const handleDeleteNote = useCallback(async (id: string) => {
    if (!isAuthenticated || !user.email) return;
    if (window.confirm('Tem certeza que deseja excluir esta nota?')) {
      const { error } = await supabase
        .from('user_notes')
        .delete()
        .eq('id', id)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) console.error('Error deleting note:', error);
      else setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    }
  }, [isAuthenticated, user.email, setNotes]);

  const handleAddTask = useCallback(async (text: string) => {
    if (!text.trim() || !isAuthenticated || !user.email) return;
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return;

    const { data, error } = await supabase
      .from('user_tasks')
      .insert({ user_id: authUser.id, text, completed: false })
      .select();

    if (error) console.error('Error adding task:', error);
    else if (data) setTasks(prevTasks => [...data, ...prevTasks]);
  }, [isAuthenticated, user.email, setTasks]);

  const handleToggleTask = useCallback(async (id: string) => {
    if (!isAuthenticated || !user.email) return;
    const { data: tasksData } = await supabase.from('user_tasks').select('completed').eq('id', id).single();
    if (!tasksData) return;

    const { error } = await supabase
      .from('user_tasks')
      .update({ completed: !tasksData.completed })
      .eq('id', id)
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

    if (error) console.error('Error toggling task:', error);
    else {
      setTasks(prevTasks => prevTasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
      setActiveReminders(prev => prev.filter(r => r.id !== id));
    }
  }, [isAuthenticated, user.email, setTasks, setActiveReminders]);
  
  const handleDeleteTask = useCallback(async (id: string) => {
    if (!isAuthenticated || !user.email) return;
    const { error } = await supabase
      .from('user_tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

    if (error) console.error('Error deleting task:', error);
    else {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      setActiveReminders(prev => prev.filter(r => r.id !== id));
    }
  }, [isAuthenticated, user.email, setTasks, setActiveReminders]);

  const handleSetTaskReminder = useCallback(async (id: string, reminder: string | null) => {
    if (!isAuthenticated || !user.email) return;
    const { error } = await supabase
      .from('user_tasks')
      .update({ reminder })
      .eq('id', id)
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

    if (error) console.error('Error setting task reminder:', error);
    else setTasks(prevTasks => prevTasks.map(task => task.id === id ? { ...task, reminder } : task));
  }, [isAuthenticated, user.email, setTasks]);

  const handleToggleFavoriteChapter = useCallback(async (chapterId: number) => {
    if (!isAuthenticated || !user.email) return;
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return;

    const isCurrentlyFavorited = favoriteChapterIds.has(chapterId);

    if (isCurrentlyFavorited) {
      const { error } = await supabase
        .from('user_favorite_chapters')
        .delete()
        .eq('user_id', authUser.id)
        .eq('chapter_id', chapterId);
      if (error) console.error('Error removing favorite chapter:', error);
      else setFavoriteChapterIds(prev => { const newSet = new Set(prev); newSet.delete(chapterId); return newSet; });
    } else {
      const { error } = await supabase
        .from('user_favorite_chapters')
        .insert({ user_id: authUser.id, chapter_id: chapterId });
      if (error) console.error('Error adding favorite chapter:', error);
      else setFavoriteChapterIds(prev => { const newSet = new Set(prev); newSet.add(chapterId); return newSet; });
    }
  }, [isAuthenticated, user.email, favoriteChapterIds, setFavoriteChapterIds]);

  const handleAddWeeklyGoal = useCallback(async (description: string, target: number) => {
    if (!description.trim() || target <= 0 || !isAuthenticated || !user.email) return;
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return;

    const { data, error } = await supabase
      .from('user_weekly_goals')
      .insert({ user_id: authUser.id, description, target, current: 0 })
      .select();

    if (error) console.error('Error adding weekly goal:', error);
    else if (data) setWeeklyGoals(prev => [...data, ...prev]);
  }, [isAuthenticated, user.email, setWeeklyGoals]);

  const handleUpdateWeeklyGoal = useCallback(async (id: string, current: number) => {
    if (!isAuthenticated || !user.email) return;
    const clampedCurrent = Math.max(0, current);
    const { error } = await supabase
      .from('user_weekly_goals')
      .update({ current: clampedCurrent })
      .eq('id', id)
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

    if (error) console.error('Error updating weekly goal:', error);
    else setWeeklyGoals(prev => prev.map(goal => goal.id === id ? { ...goal, current: clampedCurrent } : goal));
  }, [isAuthenticated, user.email, setWeeklyGoals]);

  const handleDeleteWeeklyGoal = useCallback(async (id: string) => {
    if (!isAuthenticated || !user.email) return;
    const { error } = await supabase
      .from('user_weekly_goals')
      .delete()
      .eq('id', id)
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

    if (error) console.error('Error deleting weekly goal:', error);
    else setWeeklyGoals(prev => prev.filter(goal => goal.id !== id));
  }, [isAuthenticated, user.email, setWeeklyGoals]);

  return {
    handleInputChange,
    handleAddNote,
    handleEditNote,
    handleDeleteNote,
    handleAddTask,
    handleToggleTask,
    handleDeleteTask,
    handleSetTaskReminder,
    handleToggleFavoriteChapter,
    handleAddWeeklyGoal,
    handleUpdateWeeklyGoal,
    handleDeleteWeeklyGoal,
  };
};