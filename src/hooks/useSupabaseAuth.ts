import { useState, useEffect } from 'react';
import type { UserProfile, Student, StaffUser, UserTier } from '@/src/types';
import { supabase } from '@/src/integrations/supabase/client';
import { useUserData } from './useUserData';

interface UseSupabaseAuthProps {
  students: Student[];
  staffUsers: StaffUser[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  setUserTier: React.Dispatch<React.SetStateAction<UserTier>>;
}

export const useSupabaseAuth = ({
  students,
  staffUsers,
  setStudents,
  setUserTier,
}: UseSupabaseAuthProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile>({ name: '', email: '', avatarUrl: '' });

  const { loadUserData, resetUserData, ...userDataStates } = useUserData();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) console.error('Error fetching profile:', error);
        
        const userProfile: UserProfile = {
            name: profile?.name || session.user.email || '',
            email: session.user.email || '',
            avatarUrl: profile?.avatar_url || `https://i.pravatar.cc/100?u=${session.user.id}`,
            role: profile?.role || 'user',
        };
        
        setUser(userProfile);
        
        const staffRecord = staffUsers.find(s => s.email === userProfile.email);
        if (staffRecord) {
            setUserTier('Completo');
            await loadUserData(session.user.id);
            setIsAuthenticated(true);
            return;
        }

        const studentRecord = students.find(s => s.email === userProfile.email);
        if (studentRecord) {
            setUserTier(profile?.user_tier || studentRecord.tier || 'Grátis');
            await loadUserData(session.user.id);
        } else {
            resetUserData();
            const newStudent: Student = {
                id: session.user.id,
                name: userProfile.name || 'Novo Aluno',
                email: userProfile.email,
                avatarUrl: userProfile.avatarUrl,
                tier: 'Grátis',
                joinedDate: new Date().toLocaleDateString('pt-BR'),
                progress: 0,
            };
            setStudents(prevStudents => [newStudent, ...prevStudents]);
            setUserTier('Grátis');
        }
        setIsAuthenticated(true);

      } else if (event === 'SIGNED_OUT') {
        resetUserData();
        setIsAuthenticated(false);
        setUser({ name: '', email: '', avatarUrl: '' });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [students, staffUsers, setStudents, setUserTier, loadUserData, resetUserData]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error logging out:', error.message);
  };

  const handleDeleteAccount = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return;

    // Delete all user-specific data from Supabase tables
    const { error: notesError } = await supabase.from('user_notes').delete().eq('user_id', authUser.id);
    if (notesError) console.error('Error deleting user notes:', notesError);

    const { error: tasksError } = await supabase.from('user_tasks').delete().eq('user_id', authUser.id);
    if (tasksError) console.error('Error deleting user tasks:', tasksError);

    const { error: goalsError } = await supabase.from('user_weekly_goals').delete().eq('user_id', authUser.id);
    if (goalsError) console.error('Error deleting user weekly goals:', goalsError);

    const { error: formDataError } = await supabase.from('user_form_data').delete().eq('user_id', authUser.id);
    if (formDataError) console.error('Error deleting user form data:', formDataError);

    const { error: favChaptersError } = await supabase.from('user_favorite_chapters').delete().eq('user_id', authUser.id);
    if (favChaptersError) console.error('Error deleting user favorite chapters:', favChaptersError);

    const { error: profileError } = await supabase.from('profiles').delete().eq('id', authUser.id);
    if (profileError) console.error('Error deleting user profile:', profileError);

    await handleLogout();
  };

  return {
    isAuthenticated,
    user,
    setUser,
    handleLogout,
    handleDeleteAccount,
    ...userDataStates, // Expose all states from useUserData
  };
};