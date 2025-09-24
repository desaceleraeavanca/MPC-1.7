
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { ContentDisplay } from './components/ContentDisplay';
import { Dashboard } from './components/Dashboard';
import { Settings } from './components/Settings';
import { ChapterSummaries } from './components/ChapterSummaries';
import { Profile } from './components/Profile';
import { UpgradeModal } from './components/UpgradeModal';
import { Login } from './components/Login';
import { SignUp } from './components/SignUp';
import { Plans } from './components/Plans';
import { BOOK_CONTENT, CHAPTER_COMPLETION_REQUIREMENTS, tierInfo } from './constants';
import { SEARCHABLE_TEXT } from './searchableContent';
import type { Chapter, SearchResult, Note, Task, WeeklyGoal, UserTier, UserProfile, GlobalNotification, Announcement, Student, StaffUser, UserRole } from './types';
import { Bell, BookOpen, Cog, FileText, Eye, Home, User, LogOut, X, AlertTriangle, Megaphone, ChevronDown, CheckCircle, Layers } from './components/Icons';
import { iconMap } from './components/Icons';

// --- Persistence Helper ---
const getInitialState = <T,>(key: string, defaultValue: T): T => {
  try {
    const storedValue = localStorage.getItem(key);
    if (storedValue !== null) {
      const parsed = JSON.parse(storedValue);
      // Special handling for Sets stored as arrays
      if (defaultValue instanceof Set && Array.isArray(parsed)) {
        return new Set(parsed) as T;
      }
      return parsed;
    }
  } catch (error) {
    console.error(`Error reading "${key}" from localStorage:`, error);
  }
  return defaultValue;
};


const App: React.FC = () => {
  // --- Session State (persisted) ---
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => getInitialState('isAuthenticated', false));
  const [user, setUser] = useState<UserProfile>(() => getInitialState('user', { name: '', email: '', avatarUrl: '' }));

  // --- User-Specific State (loaded on login, persisted under user's key) ---
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [notes, setNotes] = useState<Note[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoal[]>([]);
  const [favoriteChapterIds, setFavoriteChapterIds] = useState<Set<number>>(new Set());
  const [isBannerDismissed, setIsBannerDismissed] = useState<boolean>(false);
  const [userTier, setUserTier] = useState<UserTier>('Grátis');
  const [isUpgradeBannerHidden, setIsUpgradeBannerHidden] = useState<boolean>(true);

  // --- Global App State (persisted with static keys) ---
  const [adminSettings, setAdminSettings] = useState(() => getInitialState('adminSettings', {
    socialModuleEnabled: true,
    maintenanceMode: false,
    newSignups: false,
  }));
  const [globalAnnouncement, setGlobalAnnouncement] = useState<Announcement | null>(() => getInitialState('globalAnnouncement', null));
  const defaultStudents: Student[] = [
    { id: "usr_1", name: "Alice Rodrigues", email: "alice.r@example.com", avatarUrl: "https://i.pravatar.cc/100?u=alice-r", tier: "Completo", joinedDate: "15/01/2023", progress: 85 },
    { id: "usr_2", name: "Bruno Costa", email: "bruno.c@example.com", avatarUrl: "https://i.pravatar.cc/100?u=marwz", tier: "Essencial", joinedDate: "22/03/2023", progress: 42 },
    { id: "usr_3", name: "Carla Dias", email: "carla.d@example.com", avatarUrl: "https://i.pravatar.cc/100?u=katy", tier: "Completo", joinedDate: "10/05/2023", progress: 100 },
    { id: "usr_4", name: "Daniel Alves", email: "daniel.a@example.com", avatarUrl: "https://i.pravatar.cc/100?u=daniel-a", tier: "Grátis", joinedDate: "01/06/2023", progress: 15 }
  ];
  const [students, setStudents] = useState<Student[]>(() => getInitialState('students', defaultStudents));
  const defaultStaffUsers: StaffUser[] = [
    { id: 'staff_alex', name: 'Alexandre Rossi', email: 'alex.rossi@example.com', avatarUrl: 'https://i.pravatar.cc/100?u=alex-rossi', role: 'Professor', joinedDate: '10/01/2023' },
    { id: 'staff_adilson', name: 'Adilson Silva', email: 'adilsonsilva@outlook.com', avatarUrl: 'https://i.pravatar.cc/100?u=joao', role: 'Administrador', joinedDate: '12/07/2023' },
  ];
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>(() => getInitialState('staffUsers', defaultStaffUsers));
  const [mainColumnWidgets, setMainColumnWidgets] = useState<string[]>(() => getInitialState('mainColumnWidgets', ['currentStatus', 'activitySummary', 'concept', 'resources']));
  const [sidebarColumnWidgets, setSidebarColumnWidgets] = useState<string[]>(() => getInitialState('sidebarColumnWidgets', ['timeline', 'tasks', 'weeklyGoals', 'calendar', 'focusTimer', 'quoteOfTheDay', 'badges', 'friends', 'favorites']));
  const [widgetTiers, setWidgetTiers] = useState<Record<string, UserTier>>(() => getInitialState('widgetTiers', { currentStatus: 'Grátis', concept: 'Essencial', resources: 'Grátis', timeline: 'Grátis', tasks: 'Grátis', weeklyGoals: 'Essencial', badges: 'Completo', friends: 'Completo', favorites: 'Essencial', quoteOfTheDay: 'Grátis', focusTimer: 'Essencial', activitySummary: 'Completo', calendar: 'Essencial' }));
  const getInitialChapterConfigs = () => BOOK_CONTENT.map(chapter => ({ id: chapter.id, title: chapter.title, shortTitle: chapter.shortTitle, tier: chapter.tier, iconName: Object.keys(iconMap).find(key => iconMap[key] === chapter.icon) || 'BookOpen' }));
  const [chapterConfigs, setChapterConfigs] = useState(() => getInitialState('chapterConfigs', getInitialChapterConfigs()));
  
  // --- Global State Persistence ---
  useEffect(() => { localStorage.setItem('adminSettings', JSON.stringify(adminSettings)); }, [adminSettings]);
  useEffect(() => { localStorage.setItem('globalAnnouncement', JSON.stringify(globalAnnouncement)); }, [globalAnnouncement]);
  useEffect(() => { localStorage.setItem('students', JSON.stringify(students)); }, [students]);
  useEffect(() => { localStorage.setItem('staffUsers', JSON.stringify(staffUsers)); }, [staffUsers]);
  useEffect(() => { localStorage.setItem('mainColumnWidgets', JSON.stringify(mainColumnWidgets)); }, [mainColumnWidgets]);
  useEffect(() => { localStorage.setItem('sidebarColumnWidgets', JSON.stringify(sidebarColumnWidgets)); }, [sidebarColumnWidgets]);
  useEffect(() => { localStorage.setItem('widgetTiers', JSON.stringify(widgetTiers)); }, [widgetTiers]);
  useEffect(() => { localStorage.setItem('chapterConfigs', JSON.stringify(chapterConfigs)); }, [chapterConfigs]);
  
  // --- Session State Persistence ---
  useEffect(() => { localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated)); }, [isAuthenticated]);
  useEffect(() => { localStorage.setItem('user', JSON.stringify(user)); }, [user]);

  // --- User-Specific State Persistence ---
  const userEmailKey = isAuthenticated ? user.email : null;
  useEffect(() => { if (userEmailKey) localStorage.setItem(`${userEmailKey}_formData`, JSON.stringify(formData)); }, [formData, userEmailKey]);
  useEffect(() => { if (userEmailKey) localStorage.setItem(`${userEmailKey}_notes`, JSON.stringify(notes)); }, [notes, userEmailKey]);
  useEffect(() => { if (userEmailKey) localStorage.setItem(`${userEmailKey}_tasks`, JSON.stringify(tasks)); }, [tasks, userEmailKey]);
  useEffect(() => { if (userEmailKey) localStorage.setItem(`${userEmailKey}_weeklyGoals`, JSON.stringify(weeklyGoals)); }, [weeklyGoals, userEmailKey]);
  useEffect(() => { if (userEmailKey) localStorage.setItem(`${userEmailKey}_favoriteChapterIds`, JSON.stringify(Array.from(favoriteChapterIds))); }, [favoriteChapterIds, userEmailKey]);
  useEffect(() => { if (userEmailKey) localStorage.setItem(`${userEmailKey}_isBannerDismissed`, JSON.stringify(isBannerDismissed)); }, [isBannerDismissed, userEmailKey]);
  useEffect(() => { if (userEmailKey) localStorage.setItem(`${userEmailKey}_userTier`, JSON.stringify(userTier)); }, [userTier, userEmailKey]);
  useEffect(() => { if (userEmailKey) localStorage.setItem(`${userEmailKey}_isUpgradeBannerHidden`, JSON.stringify(isUpgradeBannerHidden)); }, [isUpgradeBannerHidden, userEmailKey]);

  // --- Data Loading and Resetting ---
  const loadUserData = (email: string, studentRecordTier?: UserTier) => {
      setFormData(getInitialState(`${email}_formData`, {}));
      setNotes(getInitialState(`${email}_notes`, []));
      setTasks(getInitialState(`${email}_tasks`, []));
      setWeeklyGoals(getInitialState(`${email}_weeklyGoals`, []));
      const favsArray = getInitialState<number[]>(`${email}_favoriteChapterIds`, []);
      setFavoriteChapterIds(new Set(favsArray));
      setIsBannerDismissed(getInitialState(`${email}_isBannerDismissed`, false));
      setUserTier(getInitialState(`${email}_userTier`, studentRecordTier || 'Grátis'));
      setIsUpgradeBannerHidden(getInitialState(`${email}_isUpgradeBannerHidden`, true));
  };

  const resetUserState = () => {
      setFormData({});
      setNotes([]);
      setTasks([]);
      setWeeklyGoals([]);
      setFavoriteChapterIds(new Set());
      setUserTier('Grátis');
      setIsBannerDismissed(false);
      setIsUpgradeBannerHidden(true);
  };
  
  // Load user data on page refresh if already authenticated
  useEffect(() => {
    if (isAuthenticated && user.email) {
      loadUserData(user.email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on initial mount

  // --- Non-Persisted State ---
  const [selectedChapterId, setSelectedChapterId] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'content' | 'dashboard' | 'settings' | 'summaries' | 'profile' | 'plans'>('dashboard');
  const [activeReminders, setActiveReminders] = useState<Task[]>([]);
  const [isBellRinging, setIsBellRinging] = useState(false);
  const [showRemindersDropdown, setShowRemindersDropdown] = useState(false);
  const remindersDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const tierDropdownRef = useRef<HTMLDivElement>(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isTierDropdownOpen, setIsTierDropdownOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [globalNotifications, setGlobalNotifications] = useState<GlobalNotification[]>([]);

  const currentUser = useMemo(() => {
    return staffUsers.find(staff => staff.email === user.email) || null;
  }, [user.email, staffUsers]);
  
  const hasAdminAccess = currentUser?.role === 'Administrador';
  const isProfessor = currentUser?.role === 'Professor';
  const canAccessSettings = hasAdminAccess || isProfessor;

  const handleUpdateProfile = (updatedUser: UserProfile) => {
    const oldEmail = user.email; 
    setUser(updatedUser);
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.email === oldEmail
          ? { ...student, name: updatedUser.name, email: updatedUser.email, avatarUrl: updatedUser.avatarUrl }
          : student
      )
    );
    setStaffUsers(prevStaff =>
      prevStaff.map(staff =>
        staff.email === oldEmail
          ? { ...staff, name: updatedUser.name, email: updatedUser.email, avatarUrl: updatedUser.avatarUrl }
          : staff
      )
    );
  };
  
  const chapters = useMemo<Chapter[]>(() => {
    return chapterConfigs.map(config => {
      const originalChapter = BOOK_CONTENT.find(c => c.id === config.id);
      return { ...config, icon: iconMap[config.iconName] || BookOpen, sections: originalChapter ? originalChapter.sections : [] };
    });
  }, [chapterConfigs]);

  const handleUpdateChapterDetails = (chapterId: number, updates: { title: string; shortTitle: string; tier: UserTier; iconName: string; }) => {
      setChapterConfigs(prev => prev.map(config => config.id === chapterId ? { ...config, ...updates } : config));
  };

  const handleAddChapter = (details: { title: string; shortTitle: string; tier: UserTier; iconName: string; }) => {
      setChapterConfigs(prev => {
          const maxId = prev.reduce((max, chapter) => Math.max(max, chapter.id), -1);
          return [...prev, { id: maxId + 1, ...details }];
      });
  };

  const handleChaptersReorder = (reorderedChapters: Chapter[]) => {
      const newConfigs = reorderedChapters.map(chapter => ({
          id: chapter.id, title: chapter.title, shortTitle: chapter.shortTitle, tier: chapter.tier,
          iconName: Object.keys(iconMap).find(key => iconMap[key] === chapter.icon) || 'BookOpen',
      }));
      setChapterConfigs(newConfigs);
  };

    const handleUpdateStudentTier = (studentId: string, newTier: UserTier) => {
        setStudents(prevStudents => prevStudents.map(student => student.id === studentId ? { ...student, tier: newTier } : student));
    };
    
    const handleUpdateStudentDetails = (studentId: string, details: { name: string; email: string }) => {
        setStudents(prevStudents => prevStudents.map(student => student.id === studentId ? { ...student, ...details } : student));
    };

    const handleAddStudent = () => {
        const newId = `usr_${Date.now()}`;
        const newStudent: Student = {
            id: newId, name: 'Novo Usuário', email: `usuario_${Date.now().toString().slice(-5)}@example.com`,
            avatarUrl: `https://i.pravatar.cc/100?u=${newId}`, tier: 'Grátis',
            joinedDate: new Date().toLocaleDateString('pt-BR'), progress: 0,
        };
        setStudents(prevStudents => [newStudent, ...prevStudents]);
    };

    const handleDeleteStudent = (studentId: string) => {
        setStudents(prevStudents => prevStudents.filter(student => student.id !== studentId));
    };

    const handleUpdateStaffUserRole = (userId: string, newRole: UserRole) => {
        setStaffUsers(prev => prev.map(user => user.id === userId ? { ...user, role: newRole } : user));
    };

    const handleUpdateStaffUserDetails = (userId: string, details: { name: string; email: string; }) => {
        setStaffUsers(prev => prev.map(user => user.id === userId ? { ...user, ...details } : user));
    };

    const handleAddStaffUser = (details: { name: string; email: string; role: UserRole; }) => {
        const newId = `staff_${Date.now()}`;
        const newUser: StaffUser = {
            id: newId, ...details, avatarUrl: `https://i.pravatar.cc/100?u=${details.email}`,
            joinedDate: new Date().toLocaleDateString('pt-BR'),
        };
        setStaffUsers(prev => [newUser, ...prev]);
    };

    const handleDeleteStaffUser = (userId: string) => {
        setStaffUsers(prev => prev.filter(user => user.id !== userId));
    };

    const handleExportState = () => {
        const fullState = {
            formData, notes, tasks, weeklyGoals, favoriteChapterIds: Array.from(favoriteChapterIds),
            userTier, adminSettings, globalAnnouncement, students, staffUsers,
            mainColumnWidgets, sidebarColumnWidgets, widgetTiers, chapterConfigs,
        };
        console.log("===============================");
        console.log("ESTADO ATUAL DA APLICAÇÃO (JSON)");
        console.log("Copie este objeto e peça para o assistente atualizar o estado inicial do aplicativo com ele.");
        console.log("===============================");
        console.log(JSON.stringify(fullState, null, 2));
        alert('O estado atual da aplicação foi impresso no console do desenvolvedor (F12).');
    };

  const tierOrder: Record<UserTier, number> = { 'Grátis': 0, 'Essencial': 1, 'Completo': 2 };
  const hasAccess = (requiredTier: UserTier) => tierOrder[userTier] >= tierOrder[requiredTier];

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (remindersDropdownRef.current && !remindersDropdownRef.current.contains(event.target as Node)) setShowRemindersDropdown(false);
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) setIsProfileDropdownOpen(false);
      if (tierDropdownRef.current && !tierDropdownRef.current.contains(event.target as Node)) setIsTierDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  useEffect(() => {
    if (view === 'settings' && !canAccessSettings) setView('dashboard');
  }, [view, canAccessSettings]);
  
  useEffect(() => {
    const staffEmails = new Set(staffUsers.map(staff => staff.email));
    if (students.some(student => staffEmails.has(student.email))) {
      console.warn("Detected staff members in the student list. Cleaning up...");
      setStudents(prevStudents => prevStudents.filter(student => !staffEmails.has(student.email)));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const inputValue = isCheckbox ? (e.target as HTMLInputElement).checked : value;
    setFormData(prevData => ({ ...prevData, [name]: inputValue }));
  };
  
  const handleAddNote = (content: string) => {
    if (!content.trim()) return;
    const newNote: Note = { id: `note_${Date.now()}`, content };
    setNotes(prevNotes => [newNote, ...prevNotes]);
  };

  const handleEditNote = (id: string, content: string) => {
    setNotes(prevNotes => prevNotes.map(note => (note.id === id ? { ...note, content } : note)));
  };

  const handleDeleteNote = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta nota?')) {
      setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    }
  };

  const handleAddTask = (text: string) => {
    if (!text.trim()) return;
    const newTask: Task = { id: `task_${Date.now()}`, text, completed: false };
    setTasks(prevTasks => [newTask, ...prevTasks]);
  };

  const handleToggleTask = (id: string) => {
    setTasks(prevTasks => prevTasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
    setActiveReminders(prev => prev.filter(r => r.id !== id));
  };
  
  const handleDeleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    setActiveReminders(prev => prev.filter(r => r.id !== id));
  };

  const handleSetTaskReminder = (id: string, reminder: string | null) => {
    setTasks(prevTasks => prevTasks.map(task => task.id === id ? { ...task, reminder } : task));
  };

  const handleDismissReminder = (id: string) => {
    handleSetTaskReminder(id, null);
    setShowRemindersDropdown(false);
  };

  const handleToggleFavoriteChapter = (chapterId: number) => {
    setFavoriteChapterIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(chapterId)) newSet.delete(chapterId);
      else newSet.add(chapterId);
      return newSet;
    });
  };

  const handleAddWeeklyGoal = (description: string, target: number) => {
    if (!description.trim() || target <= 0) return;
    const newGoal: WeeklyGoal = { id: `goal_${Date.now()}`, description, target, current: 0 };
    setWeeklyGoals(prev => [newGoal, ...prev]);
  };

  const handleUpdateWeeklyGoal = (id: string, current: number) => {
    setWeeklyGoals(prev => prev.map(goal => goal.id === id ? { ...goal, current: Math.max(0, Math.min(goal.target, current)) } : goal));
  };

  const handleDeleteWeeklyGoal = (id: string) => {
    setWeeklyGoals(prev => prev.filter(goal => goal.id !== id));
  };

  const handlePublishAnnouncement = (announcement: Announcement | null) => {
      setGlobalAnnouncement(announcement);
      if (announcement) setIsBannerDismissed(false);
      if (announcement && announcement.message && (announcement.displayType === 'notification' || announcement.displayType === 'both')) {
          const newNotification: GlobalNotification = { id: `global_${Date.now()}`, message: announcement.message };
          setGlobalNotifications(prev => [newNotification, ...prev]);
          setIsBellRinging(true);
          setTimeout(() => setIsBellRinging(false), 1000);
      }
  };

  const handleDismissGlobalNotification = (id: string) => {
      setGlobalNotifications(prev => prev.filter(n => n.id !== id));
      setShowRemindersDropdown(false);
  };

  const completedChapterIds = useMemo(() => {
    const completedIds = new Set<number>();
    for (const chapter of chapters) {
      if (!hasAccess(chapter.tier)) continue;
      const requirements = CHAPTER_COMPLETION_REQUIREMENTS[chapter.id];
      if (requirements && requirements.length > 0) {
        if (requirements.every(key => formData[key] === true)) completedIds.add(chapter.id);
      }
    }
    return completedIds;
  }, [formData, chapters, userTier]);
  
  const nextChapter = useMemo(() => {
    return chapters.find(c => hasAccess(c.tier) && !completedChapterIds.has(c.id)) || chapters[chapters.length - 1];
  }, [completedChapterIds, chapters, userTier]);

  const searchResults = useMemo((): SearchResult[] => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery.length < 3) return [];
    const results: SearchResult[] = [];
    const lowerCaseQuery = trimmedQuery.toLowerCase();

    chapters.forEach(chapter => {
      const isLocked = !hasAccess(chapter.tier);
      const originalText = `${chapter.title} ${SEARCHABLE_TEXT[chapter.id] || ''}`;
      const matchIndex = originalText.toLowerCase().indexOf(lowerCaseQuery);
      if (matchIndex !== -1) {
        const context = 40;
        const start = Math.max(0, matchIndex - context);
        const end = Math.min(originalText.length, matchIndex + lowerCaseQuery.length + context);
        let snippet = originalText.substring(start, end);
        if (start > 0) snippet = '...' + snippet;
        if (end < originalText.length) snippet += '...';
        results.push({ chapterId: chapter.id, chapterTitle: chapter.shortTitle, snippet, isLocked });
      }
    });
    return results;
  }, [searchQuery, chapters, userTier]);

  const handleSelectChapter = (id: number) => {
    const chapter = chapters.find(c => c.id === id);
    if (chapter && hasAccess(chapter.tier)) {
      setSelectedChapterId(id);
      setSearchQuery('');
      setView('content');
    } else {
      setIsUpgradeModalOpen(true);
    }
  };
  
  const handleSearchChange = (query: string) => setSearchQuery(query);
  const handleGoHome = () => setView('dashboard');
  const handleUpgrade = (newTier: UserTier) => {
    setUserTier(newTier);
    setIsUpgradeModalOpen(false);
  };

  const handleLoginSuccess = (loggedInUser: UserProfile) => {
      const userEmail = loggedInUser.email;
      const staffRecord = staffUsers.find(s => s.email === userEmail);

      if (staffRecord) {
          loadUserData(userEmail); // Load any saved data for the staff member
          setUser(staffRecord);
          setUserTier('Completo'); // Staff get full access for viewing
          setIsAuthenticated(true);
          return;
      }

      const studentRecord = students.find(s => s.email === userEmail);
      if (studentRecord) {
          loadUserData(userEmail, studentRecord.tier);
          setUser(studentRecord);
      } else {
          resetUserState(); // Ensure fresh state for new user
          const newId = `usr_${Date.now()}`;
          const newStudent: Student = {
              id: newId,
              name: loggedInUser.name,
              email: loggedInUser.email,
              avatarUrl: loggedInUser.avatarUrl,
              tier: 'Grátis',
              joinedDate: new Date().toLocaleDateString('pt-BR'),
              progress: 0,
          };
          setStudents(prevStudents => [newStudent, ...prevStudents]);
          setUserTier('Grátis');
          setUser(loggedInUser);
      }
      setIsAuthenticated(true);
  };

  const handleLogout = () => {
      resetUserState();
      setIsAuthenticated(false);
      setUser({ name: '', email: '', avatarUrl: '' });
      setAuthView('login');
      setView('dashboard');
      setSelectedChapterId(0);
  };

  const handleDeleteAccount = () => {
    const userEmailToDelete = user.email;
    if (userEmailToDelete) {
        localStorage.removeItem(`${userEmailToDelete}_formData`);
        localStorage.removeItem(`${userEmailToDelete}_notes`);
        localStorage.removeItem(`${userEmailToDelete}_tasks`);
        localStorage.removeItem(`${userEmailToDelete}_weeklyGoals`);
        localStorage.removeItem(`${userEmailToDelete}_favoriteChapterIds`);
        localStorage.removeItem(`${userEmailToDelete}_isBannerDismissed`);
        localStorage.removeItem(`${userEmailToDelete}_userTier`);
        localStorage.removeItem(`${userEmailToDelete}_isUpgradeBannerHidden`);
    }
    setStudents(prevStudents => prevStudents.filter(student => student.email !== user.email));
    handleLogout();
  };

  const getPageTitle = () => {
    switch(view) {
        case 'dashboard': return 'Meu Progresso';
        case 'settings':
            if (hasAdminAccess) return 'Painel do Administrador';
            if (isProfessor) return 'Painel do Professor';
            return 'Configurações';
        case 'summaries': return 'Resumo dos Módulos';
        case 'plans': return 'Planos e Módulos';
        case 'profile': return 'Meu Perfil';
        case 'content': default: return 'Workspace';
    }
  }

  const getPageSubtitle = () => {
    switch(view) {
        case 'dashboard': return 'Visualize suas conquistas e próximos passos.';
        case 'settings':
            if (hasAdminAccess) return 'Gerencie as configurações globais do aplicativo.';
            if (isProfessor) return 'Gerencie alunos, módulos e o layout da plataforma.';
            return 'Gerencie suas configurações.';
        case 'summaries': return 'Uma visão geral de cada módulo e seus objetivos.';
        case 'plans': return 'Explore a estrutura completa do método e o que cada plano oferece.';
        case 'profile': return 'Gerencie suas informações, progresso e configurações.';
        case 'content': default: return 'An interactive guide to the Chaotic Productivity Method.';
    }
  }
  
  const notificationCount = activeReminders.length + globalNotifications.length;
  const selectedChapter = chapters.find(c => c.id === selectedChapterId) || chapters[0];
  const showBanner = !isBannerDismissed && globalAnnouncement && (globalAnnouncement.displayType === 'banner' || globalAnnouncement.displayType === 'both');

  if (!isAuthenticated) {
    if (authView === 'signup' && adminSettings.newSignups) {
        return <SignUp onSignUpSuccess={handleLoginSuccess} onNavigateToLogin={() => setAuthView('login')} />;
    }
    return <Login onLoginSuccess={handleLoginSuccess} onNavigateToSignUp={() => setAuthView('signup')} newSignupsAllowed={adminSettings.newSignups} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans antialiased">
      <Sidebar
        chapters={chapters} activeChapterId={selectedChapterId} onSelectChapter={handleSelectChapter}
        completedChapterIds={completedChapterIds} searchQuery={searchQuery} searchResults={searchResults}
        onSearchChange={handleSearchChange} hasAccess={hasAccess} onGoHome={handleGoHome}
        userTier={userTier} isUpgradeBannerHidden={isUpgradeBannerHidden}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-8 py-4 flex-shrink-0 relative z-30">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">{getPageTitle()}</h1>
                    <p className="text-sm text-gray-500">{getPageSubtitle()}</p>
                </div>
                <div className="flex items-center space-x-5">
                    {hasAdminAccess && (
                        <div className="relative" ref={tierDropdownRef}>
                            <button
                                onClick={() => setIsTierDropdownOpen(prev => !prev)}
                                className="flex items-center space-x-2 bg-slate-100 border border-slate-200 rounded-full px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                aria-label="Mudar visualização de plano de usuário" aria-haspopup="true" aria-expanded={isTierDropdownOpen}
                            >
                                <Eye className="w-4 h-4 text-slate-500" />
                                <span className="sr-only">Ver como:</span>
                                <span className="flex items-center gap-1.5">
                                    {React.createElement(tierInfo[userTier].Icon, { className: `w-4 h-4 ${tierInfo[userTier].color}`})}
                                    <span>{userTier}</span>
                                </span>
                                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isTierDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isTierDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 z-20 animate-fadeInUp overflow-hidden p-1">
                                    {(Object.keys(tierInfo) as UserTier[]).map((tier) => {
                                        const { name, Icon, color } = tierInfo[tier];
                                        const isSelected = userTier === tier;
                                        return (
                                            <button
                                                key={tier}
                                                onClick={() => { setUserTier(tier); setIsTierDropdownOpen(false); }}
                                                className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-left rounded-md transition-colors ${isSelected ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700 hover:bg-slate-100'}`}
                                                role="menuitem"
                                            >
                                                <Icon className={`w-5 h-5 ${color}`} />
                                                <span className="flex-1">{name}</span>
                                                {isSelected && <CheckCircle className="w-5 h-5 text-indigo-600" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                    
                    <button onClick={() => setView('dashboard')} className={`text-gray-500 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full p-1.5 transition-colors ${view === 'dashboard' ? 'text-indigo-600 bg-indigo-100' : ''}`} aria-label='Dashboard Principal' aria-pressed={view === 'dashboard'}>
                      <Home className="w-6 h-6"/>
                    </button>
                    <button onClick={() => setView('content')} className={`text-gray-500 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full p-1.5 transition-colors ${view === 'content' ? 'text-indigo-600 bg-indigo-100' : ''}`} aria-label='Ver Conteúdo do Curso' aria-pressed={view === 'content'}>
                      <BookOpen className="w-6 h-6"/>
                    </button>
                    <button onClick={() => setView('summaries')} className={`text-gray-500 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full p-1.5 transition-colors ${view === 'summaries' ? 'text-indigo-600 bg-indigo-100' : ''}`} aria-label='Ver Resumos' aria-pressed={view === 'summaries'}>
                      <FileText className="w-6 h-6"/>
                    </button>
                    <button onClick={() => setView('plans')} className={`text-gray-500 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full p-1.5 transition-colors ${view === 'plans' ? 'text-indigo-600 bg-indigo-100' : ''}`} aria-label='Ver Planos e Módulos' aria-pressed={view === 'plans'}>
                      <Layers className="w-6 h-6"/>
                    </button>
                     {canAccessSettings && (
                        <button onClick={() => setView('settings')} className={`text-gray-500 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full p-1.5 transition-colors ${view === 'settings' ? 'text-indigo-600 bg-indigo-100' : ''}`} aria-label="Painel de Controle" aria-pressed={view === 'settings'}>
                            <Cog className="w-6 h-6" />
                        </button>
                     )}
                    <div className="relative" ref={remindersDropdownRef}>
                      <button onClick={() => setShowRemindersDropdown(prev => !prev)} className="relative text-gray-500 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full p-1" aria-label="Notificações">
                          <Bell className={`w-6 h-6 ${isBellRinging ? 'animate-ring' : ''}`}/>
                          {notificationCount > 0 && (
                            <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center border-2 border-white">
                              {notificationCount}
                            </span>
                          )}
                      </button>
                       {showRemindersDropdown && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-20 animate-fadeInUp">
                            <div className="p-3 border-b font-semibold text-slate-700 text-sm">Notificações</div>
                            <div className="max-h-80 overflow-y-auto">
                                {notificationCount === 0 ? (
                                    <p className="p-4 text-sm text-slate-500 text-center">Nenhuma notificação nova.</p>
                                ) : (
                                    <>
                                        {globalNotifications.map(notification => (
                                            <div key={notification.id} className="p-3 hover:bg-slate-50 border-b border-slate-100 bg-indigo-50/50">
                                                <div className="flex items-start gap-3">
                                                    <Megaphone className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                                                    <div className="flex-1">
                                                        <p className="text-sm text-slate-800 font-medium leading-snug">{notification.message}</p>
                                                        <p className="text-xs text-indigo-600 font-semibold mt-1.5">Comunicado Importante</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-end mt-2">
                                                    <button onClick={() => handleDismissGlobalNotification(notification.id)} className="px-2 py-1 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors">Dispensar</button>
                                                </div>
                                            </div>
                                        ))}
                                        {activeReminders.map(task => (
                                            <div key={task.id} className="p-3 hover:bg-slate-50 border-b last:border-b-0 border-slate-100">
                                                <p className="text-sm text-slate-800 font-medium">{task.text}</p>
                                                <p className="text-xs text-slate-500 mt-1">Lembrete vencido.</p>
                                                <div className="flex items-center justify-end mt-2 space-x-2">
                                                    <button onClick={() => handleToggleTask(task.id)} className="px-2 py-1 text-xs font-semibold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-md transition-colors">Concluir</button>
                                                    <button onClick={() => handleDismissReminder(task.id)} className="px-2 py-1 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors">Dispensar</button>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        </div>
                      )}
                    </div>
                    <div className="relative" ref={profileDropdownRef}>
                        <button onClick={() => setIsProfileDropdownOpen(p => !p)} className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-inner ring-2 ring-white/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <img src={user.avatarUrl} alt="Avatar do usuário" className="w-full h-full rounded-full object-cover" />
                        </button>
                        {isProfileDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 z-20 animate-fadeInUp overflow-hidden">
                                <div className="p-3 border-b">
                                    <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                </div>
                                <div className="p-1">
                                    <button onClick={() => { setView('profile'); setIsProfileDropdownOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md transition-colors">
                                        <User className="w-4 h-4" /> <span>Meu Perfil</span>
                                    </button>
                                </div>
                                <div className="p-1 border-t">
                                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md transition-colors">
                                        <LogOut className="w-4 h-4" /> <span>Sair</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
        
        <main className="flex-1 overflow-y-auto bg-slate-100 relative">
            <UpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} onUpgrade={handleUpgrade} currentTier={userTier} />
            {adminSettings.maintenanceMode ? (
                <div className="sticky top-0 z-20 bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg animate-fadeInUp">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
                        <div className="flex items-center justify-center gap-3">
                            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm font-medium">O aplicativo está atualmente em modo de manutenção.</p>
                        </div>
                    </div>
                </div>
            ) : showBanner && (
                <div className="sticky top-0 z-20 bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-lg animate-fadeInUp">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-12">
                            <div className="flex items-center gap-3">
                                <Bell className="w-6 h-6 flex-shrink-0" />
                                <p className="text-sm font-medium">{globalAnnouncement?.message}</p>
                            </div>
                            <button onClick={() => setIsBannerDismissed(true)} className="p-1.5 rounded-full hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white" aria-label="Dispensar anúncio">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {view === 'content' && (
              <ContentDisplay key={selectedChapter.id} chapter={selectedChapter} formData={formData} handleInputChange={handleInputChange} favoriteChapterIds={favoriteChapterIds} onToggleFavorite={handleToggleFavoriteChapter} hasAccess={hasAccess} onUpgradeClick={() => setIsUpgradeModalOpen(true)} />
            )}
            {view === 'dashboard' && (
              <Dashboard 
                chapters={chapters} completedChapterIds={completedChapterIds} nextChapter={nextChapter} onSelectChapter={handleSelectChapter}
                notes={notes} onAddNote={handleAddNote} onEditNote={handleEditNote} onDeleteNote={handleDeleteNote}
                tasks={tasks} onAddTask={handleAddTask} onToggleTask={handleToggleTask} onDeleteTask={handleDeleteTask} onSetTaskReminder={handleSetTaskReminder}
                favoriteChapterIds={favoriteChapterIds} onToggleFavorite={handleToggleFavoriteChapter}
                weeklyGoals={weeklyGoals} onAddWeeklyGoal={handleAddWeeklyGoal} onUpdateWeeklyGoal={handleUpdateWeeklyGoal} onDeleteWeeklyGoal={handleDeleteWeeklyGoal}
                adminSettings={adminSettings} mainColumnWidgetOrder={mainColumnWidgets} sidebarColumnWidgetOrder={sidebarColumnWidgets}
                widgetTiers={widgetTiers} userTier={userTier} onUpgradeClick={() => setIsUpgradeModalOpen(true)}
              />
            )}
            {view === 'settings' && canAccessSettings && (
                <Settings 
                    adminSettings={adminSettings} onAdminSettingsChange={setAdminSettings}
                    globalAnnouncement={globalAnnouncement} onGlobalAnnouncementChange={handlePublishAnnouncement}
                    chapters={chapters} onChaptersReorder={handleChaptersReorder} onChapterUpdate={handleUpdateChapterDetails} onAddChapter={handleAddChapter}
                    mainColumnWidgets={mainColumnWidgets} onMainColumnWidgetsReorder={setMainColumnWidgets}
                    sidebarColumnWidgets={sidebarColumnWidgets} onSidebarColumnWidgetsReorder={setSidebarColumnWidgets}
                    widgetTiers={widgetTiers} onWidgetTiersChange={setWidgetTiers}
                    students={students} onUpdateStudentTier={handleUpdateStudentTier} onUpdateStudentDetails={handleUpdateStudentDetails} onAddStudent={handleAddStudent} onDeleteStudent={handleDeleteStudent}
                    staffUsers={staffUsers} onUpdateStaffUserRole={handleUpdateStaffUserRole} onAddStaffUser={handleAddStaffUser} onDeleteStaffUser={handleDeleteStaffUser} onUpdateStaffUserDetails={handleUpdateStaffUserDetails}
                    onExportState={handleExportState} userTier={userTier} isUpgradeBannerHidden={isUpgradeBannerHidden} onIsUpgradeBannerHiddenChange={setIsUpgradeBannerHidden}
                    currentUser={currentUser}
                />
            )}
             {view === 'summaries' && (
                <ChapterSummaries chapters={chapters} onSelectChapter={handleSelectChapter} hasAccess={hasAccess} onUpgradeClick={() => setIsUpgradeModalOpen(true)} />
            )}
             {view === 'plans' && (
                <Plans chapters={chapters} onSelectChapter={handleSelectChapter} hasAccess={hasAccess} onUpgradeClick={() => setIsUpgradeModalOpen(true)} />
            )}
            {view === 'profile' && (
              <Profile
                user={user} onUpdateUser={handleUpdateProfile} chapters={chapters} completedChapterIds={completedChapterIds}
                tasks={tasks} weeklyGoals={weeklyGoals} notes={notes} userTier={userTier}
                onUpgradeClick={() => setIsUpgradeModalOpen(true)} onDeleteAccount={handleDeleteAccount}
              />
            )}
        </main>
      </div>
    </div>
  );
};

export default App;
