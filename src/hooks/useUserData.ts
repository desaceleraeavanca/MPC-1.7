import { useState, useEffect } from 'react';
import type { Note, Task, WeeklyGoal, UserTier, UserProfile, Chapter, FormInput } from '@/src/types';
import { supabase } from '@/src/integrations/supabase/client';

export const useUserData = () => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [notes, setNotes] = useState<Note[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoal[]>([]);
  const [favoriteChapterIds, setFavoriteChapterIds] = useState<Set<number>>(new Set());
  const [isBannerDismissed, setIsBannerDismissed] = useState<boolean>(false);
  const [userTier, setUserTier] = useState<UserTier>('Grátis');
  const [isUpgradeBannerHidden, setIsUpgradeBannerHidden] = useState<boolean>(true);

  const loadUserData = async (userId: string) => {
    // Fetch profile data
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('user_tier, is_banner_dismissed, is_upgrade_banner_hidden')
      .eq('id', userId)
      .single();

    if (profileError) console.error('Error fetching user profile settings:', profileError);

    setUserTier(profileData?.user_tier || 'Grátis');
    setIsBannerDismissed(profileData?.is_banner_dismissed || false);
    setIsUpgradeBannerHidden(profileData?.is_upgrade_banner_hidden || true);

    // Fetch notes
    const { data: notesData, error: notesError } = await supabase
      .from('user_notes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (notesError) console.error('Error fetching notes:', notesError);
    setNotes(notesData || []);

    // Fetch tasks
    const { data: tasksData, error: tasksError } = await supabase
      .from('user_tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (tasksError) console.error('Error fetching tasks:', tasksError);
    setTasks(tasksData || []);

    // Fetch weekly goals
    const { data: goalsData, error: goalsError } = await supabase
      .from('user_weekly_goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (goalsError) console.error('Error fetching weekly goals:', goalsError);
    setWeeklyGoals(goalsData || []);

    // Fetch form data
    const { data: formDataArray, error: formDataError } = await supabase
      .from('user_form_data')
      .select('key, value')
      .eq('user_id', userId);
    if (formDataError) console.error('Error fetching form data:', formDataError);
    const loadedFormData = formDataArray ? formDataArray.reduce((acc, item) => ({ ...acc, [item.key]: item.value }), {}) : {};
    setFormData(loadedFormData);

    // Fetch favorite chapters
    const { data: favChaptersData, error: favChaptersError } = await supabase
      .from('user_favorite_chapters')
      .select('chapter_id')
      .eq('user_id', userId);
    if (favChaptersError) console.error('Error fetching favorite chapters:', favChaptersError);
    setFavoriteChapterIds(new Set(favChaptersData?.map(item => item.chapter_id) || []));
  };

  const resetUserData = () => {
    setFormData({});
    setNotes([]);
    setTasks([]);
    setWeeklyGoals([]);
    setFavoriteChapterIds(new Set());
    setIsBannerDismissed(false);
    setUserTier('Grátis');
    setIsUpgradeBannerHidden(true);
  };

  return {
    formData, setFormData,
    notes, setNotes,
    tasks, setTasks,
    weeklyGoals, setWeeklyGoals,
    favoriteChapterIds, setFavoriteChapterIds,
    isBannerDismissed, setIsBannerDismissed,
    userTier, setUserTier,
    isUpgradeBannerHidden, setIsUpgradeBannerHidden,
    loadUserData,
    resetUserData,
  };
};