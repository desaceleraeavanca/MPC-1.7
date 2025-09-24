import { useEffect } from 'react';
import type { Note, Task, WeeklyGoal, UserTier, UserProfile } from '@/src/types';
import { supabase } from '@/src/integrations/supabase/client';

interface UseSupabaseDataPersistenceProps {
  isAuthenticated: boolean;
  user: UserProfile;
  formData: Record<string, any>;
  favoriteChapterIds: Set<number>;
  isBannerDismissed: boolean;
  userTier: UserTier;
  isUpgradeBannerHidden: boolean;
}

export const useSupabaseDataPersistence = ({
  isAuthenticated,
  user,
  formData,
  favoriteChapterIds,
  isBannerDismissed,
  userTier,
  isUpgradeBannerHidden,
}: UseSupabaseDataPersistenceProps) => {

  // Persist profile settings
  useEffect(() => {
    const saveProfileSettings = async () => {
      if (!isAuthenticated || !user.email) return;
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          user_tier: userTier,
          is_banner_dismissed: isBannerDismissed,
          is_upgrade_banner_hidden: isUpgradeBannerHidden,
        })
        .eq('id', authUser.id);

      if (error) console.error('Error saving profile settings:', error);
    };
    saveProfileSettings();
  }, [isAuthenticated, user.email, userTier, isBannerDismissed, isUpgradeBannerHidden]);

  // Persist form data
  useEffect(() => {
    const saveFormData = async () => {
      if (!isAuthenticated || !user.email) return;
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      for (const key in formData) {
        const value = formData[key];
        const { error } = await supabase
          .from('user_form_data')
          .upsert({ user_id: authUser.id, key, value })
          .eq('user_id', authUser.id)
          .eq('key', key);
        if (error) console.error(`Error saving form data for key ${key}:`, error);
      }
    };
    saveFormData();
  }, [isAuthenticated, user.email, formData]);

  // Persist favorite chapters
  useEffect(() => {
    const saveFavoriteChapters = async () => {
      if (!isAuthenticated || !user.email) return;
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const { error: deleteError } = await supabase
        .from('user_favorite_chapters')
        .delete()
        .eq('user_id', authUser.id);

      if (deleteError) {
        console.error('Error deleting old favorite chapters:', deleteError);
        return;
      }

      const favoritesToInsert = Array.from(favoriteChapterIds).map(chapter_id => ({
        user_id: authUser.id,
        chapter_id,
      }));

      if (favoritesToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from('user_favorite_chapters')
          .insert(favoritesToInsert);
        if (insertError) console.error('Error inserting new favorite chapters:', insertError);
      }
    };
    saveFavoriteChapters();
  }, [isAuthenticated, user.email, favoriteChapterIds]);
};