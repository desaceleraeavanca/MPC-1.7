import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { Announcement, Chapter, UserTier, Student, StaffUser, UserRole } from '@/src/types'; // Fixed import path
import { iconMap, Users, AlertTriangle, GitMerge, PieChart, ShieldCheck, GraduationCap, User, Search } from '@/src/components/Icons'; // Fixed import path
import { BookOpen, Layout, Megaphone, Save, Cog as SettingsIcon, Trash2, X, ChevronUp, ChevronDown, Plus, Pencil, CheckCircle, Eye, EyeOff } from '@/src/components/Icons'; // Fixed import path
import { tierInfo } from '@/src/constants'; // Fixed import path
import { supabase } from '@/src/integrations/supabase/client'; // Fixed import path

// --- Reusable Components ---

const Card: React.FC<{ children: React.ReactNode; className?: string; }> = ({ children, className = '' }) => (
    <div className={`bg-white rounded-xl shadow-sm ${className}`}>{children}</div>
);
const CardHeader: React.FC<{ title: string; icon: React.FC<any>; }> = ({ title, icon: Icon }) => (
    <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-200">
        <Icon className="w-5 h-5 text-indigo-600" />
        <h3 className="text-base font-semibold text-slate-800 m-0">{title}</h3>
    </div>
);

// --- Confirmation Modal Component ---
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonVariant?: 'primary' | 'danger';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmButtonText = 'Confirmar',
  cancelButtonText = 'Cancelar',
  confirmButtonVariant = 'primary',
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isOpen) {
    return null;
  }
  
  const confirmClasses = confirmButtonVariant === 'danger'
    ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
    : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500';
    
  const iconContainerClasses = confirmButtonVariant === 'danger' ? 'bg-red-100' : 'bg-indigo-100';
  const iconClasses = confirmButtonVariant === 'danger' ? 'text-red-600' : 'text-indigo-600';
  
  const modalContent = (
    <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeInUp"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-modal-title"
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-scaleIn overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${iconContainerClasses}`}>
              <AlertTriangle className={`w-6 h-6 ${iconClasses}`} />
            </div>
            <div className="flex-1">
              <h2 id="confirmation-modal-title" className="text-lg font-semibold text-slate-800">{title}</h2>
              <div className="mt-2 text-sm text-slate-600">
                {children}
              </div>
            </div>
          </div>
        </div>
        <footer className="flex justify-end p-4 bg-slate-50 border-t space-x-2">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold rounded-md hover:bg-slate-200 transition-colors">
            {cancelButtonText}
          </button>
          <button 
            onClick={onConfirm} 
            className={`px-4 py-2 text-sm font-semibold text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${confirmClasses}`}
          >
            {confirmButtonText}
          </button>
        </footer>
      </div>
    </div>
  );
  
  return isMounted ? createPortal(modalContent, document.body) : null;
};

// --- Edit Student Modal ---
const EditStudentModal: React.FC<{
    student: Student;
    onClose: () => void;
    onSave: (studentId: string, details: { name: string; email: string }) => void;
}> = ({ student, onClose, onSave }) => {
    const [name, setName] = useState(student.name);
    const [email, setEmail] = useState(student.email);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleSave = () => {
        onSave(student.id, { name, email });
        onClose();
    };

    const modalContent = (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeInUp">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-scaleIn overflow-hidden" onClick={e => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">Editar Aluno</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100"><X className="w-6 h-6" /></button>
                </header>
                <main className="p-6 space-y-4">
                    <div>
                        <label className="text-sm font-medium">Nome Completo</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 mt-1 border rounded-md" />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 mt-1 border rounded-md" />
                    </div>
                </main>
                <footer className="flex justify-end p-4 bg-slate-50 border-t space-x-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-semibold rounded-md hover:bg-slate-100">Cancelar</button>
                    <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Salvar Alterações</button>
                </footer>
            </div>
        </div>
    );
    
    return isMounted ? createPortal(modalContent, document.body) : null;
};


// --- Student Management Card ---
const StudentManagementCard: React.FC<{
    students: Student[];
    onInitiateTierChange: (student: Student, newTier: UserTier) => void;
    onAddStudent: () => void;
    onInitiateDelete: (student: Student) => void;
    onInitiateEdit: (student: Student) => void;
    currentUser: StaffUser | null;
}> = ({ students, onInitiateTierChange, onAddStudent, onInitiateDelete, onInitiateEdit, currentUser }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>('bottom');
    const dropdownsRef = useRef<Record<string, HTMLDivElement | null>>({});

    const canManageStudents = currentUser?.role === 'Administrador' || currentUser?.role === 'Professor';

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (openDropdownId && dropdownsRef.current[openDropdownId] && !dropdownsRef.current[openDropdownId]!.contains(event.target as Node)) {
                setOpenDropdownId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openDropdownId]);

    const handleDropdownToggle = (e: React.MouseEvent<HTMLButtonElement>, studentId: string) => {
        const isOpening = openDropdownId !== studentId;
        if (isOpening) {
            const buttonRect = e.currentTarget.getBoundingClientRect();
            const spaceBelow = window.innerHeight - buttonRect.bottom;
            const dropdownHeight = 160; // Estimated height for the dropdown in pixels

            if (spaceBelow < dropdownHeight && buttonRect.top > dropdownHeight) {
                setDropdownPosition('top');
            } else {
                setDropdownPosition('bottom');
            }
            setOpenDropdownId(studentId);
        } else {
            setOpenDropdownId(null);
        }
    };

    return (
        <Card>
            <CardHeader title="Gerenciar Alunos" icon={Users} />
            <div className="p-4 border-b border-slate-100">
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3" aria-hidden="true">
                        <Search className="w-5 h-5 text-slate-400" />
                    </span>
                    <input
                        type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Pesquisar por nome ou e-mail..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        aria-label="Pesquisar alunos"
                    />
                </div>
            </div>
            <div className="p-4">
                <div className="flow-root">
                    <div className="-mx-2 -my-2 overflow-x-auto">
                        <div className="inline-block min-w-full py-2 align-middle">
                            <div className="divide-y divide-slate-100">
                                {filteredStudents.length > 0 ? (
                                    filteredStudents.map(student => {
                                        const currentTierInfo = tierInfo[student.tier];
                                        const isDropdownOpen = openDropdownId === student.id;

                                        return (
                                            <div key={student.id} className="flex flex-wrap items-center gap-y-3 gap-x-4 py-3 px-2">
                                                <div className="flex-1 flex items-center gap-4 min-w-[250px]">
                                                    <img src={student.avatarUrl} alt={student.name} className="w-10 h-10 rounded-full flex-shrink-0" />
                                                    <div className="truncate">
                                                        <p className="font-semibold text-slate-800 truncate text-sm">{student.name}</p>
                                                        <p className="text-xs text-slate-500 truncate">{student.email}</p>
                                                        <p className="text-xs text-slate-400 mt-1">Entrou em: {student.joinedDate}</p>
                                                    </div>
                                                </div>
                                                <div className="w-36">
                                                    <div className="relative" ref={(el) => { dropdownsRef.current[student.id] = el; }}>
                                                        <button
                                                            onClick={(e) => handleDropdownToggle(e, student.id)}
                                                            className="flex w-full items-center justify-between space-x-2 bg-slate-100 border border-slate-200 rounded-full px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-slate-100"
                                                            aria-haspopup="true"
                                                            aria-expanded={isDropdownOpen}
                                                            disabled={!canManageStudents}
                                                            title={!canManageStudents ? "Apenas administradores podem alterar planos." : ""}
                                                        >
                                                            <span className="flex items-center gap-1.5">
                                                                <currentTierInfo.Icon className={`w-4 h-4 ${currentTierInfo.color}`} />
                                                                <span>{student.tier}</span>
                                                            </span>
                                                            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                                        </button>
                                                        {isDropdownOpen && (
                                                            <div className={`absolute right-0 w-48 bg-white rounded-lg shadow-xl border border-slate-200 z-10 animate-fadeInUp p-1 ${dropdownPosition === 'top' ? 'bottom-full mb-2' : 'mt-2'}`}>
                                                                {(Object.keys(tierInfo) as UserTier[]).map((tierOption) => {
                                                                    const { name, Icon, color } = tierInfo[tierOption];
                                                                    const isSelected = student.tier === tierOption;
                                                                    return (
                                                                        <button
                                                                            key={tierOption}
                                                                            onClick={() => {
                                                                                if (student.tier !== tierOption) {
                                                                                    onInitiateTierChange(student, tierOption);
                                                                                }
                                                                                setOpenDropdownId(null);
                                                                            }}
                                                                            className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-left rounded-md transition-colors ${
                                                                                isSelected
                                                                                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                                                                                    : 'text-slate-700 hover:bg-slate-100'
                                                                            }`}
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
                                                </div>
                                                <div className="flex items-center justify-end gap-1 ml-auto">
                                                    <button
                                                        onClick={() => onInitiateEdit(student)}
                                                        className="p-2 text-slate-500 hover:text-indigo-600 rounded-full hover:bg-slate-100 transition-colors disabled:text-slate-300 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                                                        aria-label={`Editar ${student.name}`}
                                                        disabled={!canManageStudents}
                                                        title={!canManageStudents ? "Apenas administradores podem editar alunos." : `Editar ${student.name}`}
                                                    >
                                                        <Pencil className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => onInitiateDelete(student)}
                                                        className="p-2 text-slate-500 hover:text-red-600 rounded-full hover:bg-slate-100 transition-colors disabled:text-slate-300 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                                                        aria-label={`Excluir ${student.name}`}
                                                        disabled={!canManageStudents}
                                                        title={!canManageStudents ? "Apenas administradores podem excluir alunos." : `Excluir ${student.name}`}
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-8 px-4">
                                        <p className="text-sm text-slate-500 font-medium">Nenhum aluno encontrado.</p>
                                        <p className="text-xs text-slate-400 mt-1">Tente ajustar sua busca ou adicione um novo aluno.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    <button
                        onClick={onAddStudent}
                        disabled={!canManageStudents}
                        className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-300 text-slate-500 rounded-lg hover:bg-slate-100 hover:border-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-slate-300"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="text-sm font-semibold">Adicionar Aluno</span>
                    </button>
                </div>
            </div>
        </Card>
    );
};

// Helper component for individual stat cards
const StatCard: React.FC<{ value: string | number; label: string }> = ({ value, label }) => (
    <div className="bg-violet-50/60 rounded-xl p-4 text-center shadow-sm border border-violet-100/80 h-full flex flex-col justify-center">
        <p className="text-3xl font-bold text-indigo-600">{value}</p>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1.5 whitespace-nowrap">{label}</p>
    </div>
);


// --- Statistics Card ---
const StatisticsCard: React.FC<{ students: Student[] }> = ({ students }) => {
    const totalUsers = students.length;

    // Active users are those who have started the course (progress > 0)
    const activeUsers = students.filter(s => s.progress > 0).length;

    // Average progress across all users
    const averageProgress = totalUsers > 0
        ? Math.round(students.reduce((sum, student) => sum + student.progress, 0) / totalUsers)
        : 0;

    // Percentage of users who have completed the course
    const completedUsersCount = students.filter(s => s.progress === 100).length;
    const completionRate = totalUsers > 0
        ? Math.round((completedUsersCount / totalUsers) * 100)
        : 0;

    return (
        <Card>
            <CardHeader title="Estatísticas Gerais" icon={PieChart} />
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <StatCard value={totalUsers.toLocaleString('pt-BR')} label="Total de Alunos" />
                    <StatCard value={activeUsers.toLocaleString('pt-BR')} label="Alunos Ativos" />
                    <StatCard value={`${averageProgress}%`} label="Progresso Médio" />
                    <StatCard value={`${completionRate}%`} label="Taxa de Conclusão" />
                </div>
            </div>
        </Card>
    );
};


// --- Prop Interfaces ---
interface SettingsProps {
    adminSettings: {
        socialModuleEnabled: boolean;
        maintenanceMode: boolean;
        newSignups: boolean;
    };
    onAdminSettingsChange: (settings: SettingsProps['adminSettings']) => void;
    globalAnnouncement: Announcement | null;
    onGlobalAnnouncementChange: (announcement: Announcement | null) => void;
    chapters: Chapter[];
    onChaptersReorder: (chapters: Chapter[]) => void;
    onChapterUpdate: (chapterId: number, updates: { title: string; shortTitle: string; tier: UserTier; iconName: string; }) => void;
    onAddChapter: (details: { title: string; shortTitle: string; tier: UserTier; iconName: string; }) => void;
    mainColumnWidgets: string[];
    onMainColumnWidgetsReorder: (widgets: string[]) => void;
    sidebarColumnWidgets: string[];
    onSidebarColumnWidgetsReorder: (widgets: string[]) => void;
    widgetTiers: Record<string, UserTier>;
    onWidgetTiersChange: (tiers: Record<string, UserTier>) => void;
    students: Student[];
    onUpdateStudentTier: (studentId: string, newTier: UserTier) => void;
    onUpdateStudentDetails: (studentId: string, details: { name: string; email: string }) => void;
    onAddStudent: () => void;
    onDeleteStudent: (studentId: string) => void;
    staffUsers: StaffUser[];
    onUpdateStaffUserRole: (userId: string, role: UserRole) => void;
    onAddStaffUser: (details: { name: string; email: string; role: UserRole; }) => void;
    onDeleteStaffUser: (userId: string) => void;
    onUpdateStaffUserDetails: (userId: string, details: { name: string; email: string; }) => void;
    onExportState: () => void;
    userTier: UserTier;
    isUpgradeBannerHidden: boolean;
    onIsUpgradeBannerHiddenChange: (value: boolean) => void;
    currentUser: StaffUser | null;
}

// --- Chapter Edit Modal ---

const EditChapterModal: React.FC<{
    chapter: Chapter | { id?: undefined };
    onClose: () => void;
    onSave: (details: { title: string; shortTitle: string; tier: UserTier; iconName: string; }) => void;
}> = ({ chapter, onClose, onSave }) => {
    // Fix: Safely access properties on `chapter` which could be an empty object for a new chapter.
    const [title, setTitle] = useState('title' in chapter ? chapter.title : '');
    const [shortTitle, setShortTitle] = useState('shortTitle' in chapter ? chapter.shortTitle : '');
    const [tier, setTier] = useState<UserTier>('tier' in chapter ? chapter.tier : 'Grátis');
    const [isTierDropdownOpen, setIsTierDropdownOpen] = React.useState(false);
    const tierDropdownRef = React.useRef<HTMLDivElement>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (tierDropdownRef.current && !tierDropdownRef.current.contains(event.target as Node)) {
                setIsTierDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    
    // Fix: Safely access properties on `chapter` which could be an empty object for a new chapter.
    const currentIconName = 'icon' in chapter ? (Object.entries(iconMap).find(([, component]) => component === chapter.icon)?.[0] || Object.keys(iconMap)[0]) : Object.keys(iconMap)[0];
    const [iconName, setIconName] = useState(currentIconName);

    const handleSave = () => {
        onSave({ title, shortTitle, tier, iconName });
        onClose();
    };

    const modalContent = (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-scaleIn overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">{chapter.id !== undefined ? 'Editar Módulo' : 'Adicionar Novo Módulo'}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100"><X className="w-6 h-6" /></button>
                </header>
                <main className="p-6 space-y-4">
                    <div>
                        <label className="text-sm font-medium">Título Completo</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 mt-1 border rounded-md" />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Título Curto (Sidebar)</label>
                        <input type="text" value={shortTitle} onChange={e => setShortTitle(e.target.value)} className="w-full p-2 mt-1 border rounded-md" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-700">Plano</label>
                        <div className="relative mt-1" ref={tierDropdownRef}>
                            <button
                                type="button"
                                onClick={() => setIsTierDropdownOpen(prev => !prev)}
                                className="w-full flex items-center justify-between p-2 border border-slate-300 rounded-md bg-white text-left focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                aria-haspopup="listbox"
                                aria-expanded={isTierDropdownOpen}
                            >
                                <span className="flex items-center gap-3">
                                    {React.createElement(tierInfo[tier].Icon, { className: `w-5 h-5 ${tierInfo[tier].color}` })}
                                    <span className="font-medium text-slate-800">{tierInfo[tier].name}</span>
                                </span>
                                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isTierDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isTierDropdownOpen && (
                                <div className="absolute top-full mt-1 w-full bg-white rounded-md shadow-lg border z-10 p-1 animate-fadeInUp" role="listbox">
                                    {(Object.keys(tierInfo) as UserTier[]).map(t => {
                                        const { name: tierName, Icon: DropdownTierIcon, color: tierColor } = tierInfo[t];
                                        const isSelected = tier === t;
                                        return (
                                            <button
                                                key={t}
                                                type="button"
                                                role="option"
                                                aria-selected={isSelected}
                                                onClick={() => {
                                                    setTier(t);
                                                    setIsTierDropdownOpen(false);
                                                }}
                                                className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-left rounded-md transition-colors ${
                                                    isSelected
                                                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                                                        : 'text-slate-700 hover:bg-slate-100'
                                                }`}
                                            >
                                                <Icon className={`w-5 h-5 ${tierColor}`} />
                                                <span className="flex-1">{tierName}</span>
                                                {isSelected && <CheckCircle className="w-5 h-5 text-indigo-600" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Ícone</label>
                        <div className="mt-1 p-2 border rounded-md max-h-48 overflow-y-auto grid grid-cols-8 gap-1 bg-slate-50/50">
                            {Object.entries(iconMap).map(([name, IconComponent]) => (
                                <button
                                    key={name}
                                    type="button"
                                    onClick={() => setIconName(name)}
                                    className={`flex items-center justify-center aspect-square rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 ${
                                        iconName === name
                                            ? 'bg-indigo-600 text-white shadow-inner'
                                            : 'bg-white text-slate-500 hover:bg-indigo-100 hover:text-indigo-600'
                                    }`}
                                    title={name}
                                    aria-label={name}
                                    aria-pressed={iconName === name}
                                >
                                    <IconComponent className="w-5 h-5" />
                                </button>
                            ))}
                        </div>
                    </div>
                </main>
                <footer className="flex justify-end p-4 bg-slate-50 border-t space-x-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-semibold rounded-md hover:bg-slate-100">Cancelar</button>
                    <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Salvar</button>
                </footer>
            </div>
        </div>
    );
    
    return isMounted ? createPortal(modalContent, document.body) : null;
};


// --- Add Staff User Modal ---
const AddStaffUserModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (details: { name: string; email: string; role: UserRole; }) => void;
}> = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<UserRole>('Professor');
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleSave = () => {
        if (name.trim() && email.trim()) {
            onSave({ name, email, role });
            onClose();
        }
    };
    
    if (!isOpen) return null;

    const modalContent = (
         <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeInUp">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-scaleIn overflow-hidden" onClick={e => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">Adicionar Novo Membro da Equipe</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100"><X className="w-6 h-6" /></button>
                </header>
                <main className="p-6 space-y-4">
                    <div>
                        <label className="text-sm font-medium">Nome Completo</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 mt-1 border rounded-md" required />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 mt-1 border rounded-md" required />
                    </div>
                     <div>
                        <label className="text-sm font-medium">Permissão</label>
                        <select value={role} onChange={e => setRole(e.target.value as UserRole)} className="w-full p-2 mt-1 border rounded-md bg-white">
                            <option value="Professor">Professor</option>
                            <option value="Administrador">Administrador</option>
                        </select>
                    </div>
                </main>
                <footer className="flex justify-end p-4 bg-slate-50 border-t space-x-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-semibold rounded-md hover:bg-slate-100">Cancelar</button>
                    <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Adicionar Membro</button>
                </footer>
            </div>
        </div>
    );
    return isMounted ? createPortal(modalContent, document.body) : null;
};

// --- Edit Staff User Modal ---
const EditStaffUserModal: React.FC<{
    user: StaffUser;
    onClose: () => void;
    onSave: (userId: string, details: { name: string; email: string; }) => void;
}> = ({ user, onClose, onSave }) => {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleSave = () => {
        onSave(user.id, { name, email });
        onClose();
    };

    const modalContent = (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeInUp">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-scaleIn overflow-hidden" onClick={e => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">Editar Membro</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100"><X className="w-6 h-6" /></button>
                </header>
                <main className="p-6 space-y-4">
                    <div>
                        <label className="text-sm font-medium">Nome Completo</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 mt-1 border rounded-md" />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 mt-1 border rounded-md" />
                    </div>
                </main>
                <footer className="flex justify-end p-4 bg-slate-50 border-t space-x-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-semibold rounded-md hover:bg-slate-100">Cancelar</button>
                    <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Salvar Alterações</button>
                </footer>
            </div>
        </div>
    );
    
    return isMounted ? createPortal(modalContent, document.body) : null;
};

// --- User Management Card ---
const UserManagementCard: React.FC<{
    users: StaffUser[];
    onUpdateRole: (userId: string, newRole: UserRole) => void;
    onAddUser: (details: { name: string; email: string; role: UserRole; }) => void;
    onDeleteUser: (userId: string) => void;
    onInitiateEdit: (user: StaffUser) => void;
    currentUser: StaffUser | null;
}> = ({ users, onUpdateRole, onAddUser, onDeleteUser, onInitiateEdit, currentUser }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<StaffUser | null>(null);
    const [openRoleId, setOpenRoleId] = useState<string | null>(null);
    const roleDropdownsRef = useRef<Record<string, HTMLDivElement | null>>({});

    const roleInfo: Record<UserRole, { name: string; Icon: React.FC<any>; color: string; }> = {
        'Administrador': { name: 'Administrador', Icon: ShieldCheck, color: 'text-purple-600' },
        'Professor': { name: 'Professor', Icon: GraduationCap, color: 'text-sky-600' },
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (openRoleId && roleDropdownsRef.current[openRoleId] && !roleDropdownsRef.current[openRoleId]!.contains(event.target as Node)) {
                setOpenRoleId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openRoleId]);
    
    const handleInitiateDelete = (user: StaffUser) => {
        setUserToDelete(user);
    };
    
    const handleConfirmDelete = () => {
        if(userToDelete) {
            onDeleteUser(userToDelete.id);
            setUserToDelete(null);
        }
    };

    const canManageStaff = currentUser?.role === 'Administrador';
    
    return (
        <>
            <Card>
                <CardHeader title="Gerenciar Membros" icon={User} />
                <div className="p-4">
                    <div className="flow-root">
                        <div className="-mx-2 -my-2 overflow-x-auto">
                            <div className="inline-block min-w-full py-2 align-middle">
                                <div className="divide-y divide-slate-100">
                                    {users.map(user => {
                                        const isSelf = currentUser?.id === user.id;
                                        const currentRoleInfo = roleInfo[user.role];
                                        const isDropdownOpen = openRoleId === user.id;

                                        return (
                                        <div key={user.id} className="flex flex-wrap items-center gap-y-3 gap-x-4 py-3 px-2">
                                            <div className="flex-1 flex items-center gap-4 min-w-[250px]">
                                                <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full flex-shrink-0" />
                                                <div className="truncate">
                                                    <p className="font-semibold text-slate-800 truncate text-sm">{user.name}</p>
                                                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                                    <p className="text-xs text-slate-400 mt-1">Entrou em: {user.joinedDate}</p>
                                                </div>
                                            </div>
                                            <div className="w-48">
                                                <div className="relative" ref={(el) => { roleDropdownsRef.current[user.id] = el; }}>
                                                    <button
                                                        onClick={() => setOpenRoleId(isDropdownOpen ? null : user.id)}
                                                        className="flex w-full items-center justify-between space-x-2 bg-slate-100 border border-slate-200 rounded-full px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
                                                        aria-haspopup="true"
                                                        aria-expanded={isDropdownOpen}
                                                        disabled={!canManageStaff || isSelf}
                                                        title={isSelf ? "Você não pode alterar sua própria permissão." : (!canManageStaff ? "Apenas administradores podem alterar permissões." : "")}
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <currentRoleInfo.Icon className={`w-4 h-4 ${currentRoleInfo.color}`} />
                                                            <span>{currentRoleInfo.name}</span>
                                                        </span>
                                                        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                                    </button>
                                                    {isDropdownOpen && (
                                                        <div className="absolute right-0 w-full bg-white rounded-lg shadow-xl border border-slate-200 z-10 animate-fadeInUp p-1 mt-2">
                                                            {(Object.keys(roleInfo) as UserRole[]).map((roleOption) => {
                                                                const { name, Icon, color } = roleInfo[roleOption];
                                                                const isSelected = user.role === roleOption;
                                                                return (
                                                                    <button
                                                                        key={roleOption}
                                                                        onClick={() => {
                                                                            if (user.role !== roleOption) {
                                                                                onUpdateRole(user.id, roleOption);
                                                                            }
                                                                            setOpenRoleId(null);
                                                                        }}
                                                                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-left rounded-md transition-colors ${
                                                                            isSelected
                                                                                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                                                                                : 'text-slate-700 hover:bg-slate-100'
                                                                        }`}
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
                                            </div>
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => onInitiateEdit(user)}
                                                    className="p-2 text-slate-500 hover:text-indigo-600 rounded-full hover:bg-slate-100 transition-colors disabled:text-slate-300 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                                                    aria-label={`Editar ${user.name}`}
                                                    disabled={!canManageStaff || isSelf}
                                                    title={isSelf ? "Você não pode editar a si mesmo." : (!canManageStaff ? "Apenas administradores podem editar membros." : "Editar membro")}
                                                >
                                                    <Pencil className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleInitiateDelete(user)}
                                                    className="p-2 text-slate-500 hover:text-red-600 rounded-full hover:bg-slate-100 transition-colors disabled:text-slate-300 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                                                    aria-label={`Remover membro ${user.name}`}
                                                    disabled={!canManageStaff || isSelf}
                                                    title={isSelf ? "Você não pode remover a si mesmo." : (!canManageStaff ? "Apenas administradores podem remover membros." : `Remover ${user.name}`)}
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                    {canManageStaff && (
                    <div className="mt-4">
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-300 text-slate-500 rounded-lg hover:bg-slate-100 hover:border-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="text-sm font-semibold">Adicionar Membro</span>
                        </button>
                    </div>
                    )}
                </div>
            </Card>

            <AddStaffUserModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={onAddUser}
            />

            <ConfirmationModal
                isOpen={!!userToDelete}
                onClose={() => setUserToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Remover Membro da Equipe"
                confirmButtonText="Sim, Remover Membro"
                confirmButtonVariant="danger"
            >
                <p>Tem certeza que deseja remover <strong className="text-slate-900">{userToDelete?.name}</strong> da equipe? Ele(a) perderá o acesso ao painel administrativo.</p>
            </ConfirmationModal>
        </>
    );
};

// --- Admin User Deletion Card ---
const AdminUserDeletionCard: React.FC<{ currentUser: StaffUser | null }> = ({ currentUser }) => {
    const [emailToDelete, setEmailToDelete] = useState('');
    const [isConfirmDeleteUserModalOpen, setIsConfirmDeleteUserModalOpen] = useState(false);
    const [deletionStatus, setDeletionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [deletionMessage, setDeletionMessage] = useState('');

    const handleDeleteUser = async () => {
        setDeletionStatus('loading');
        setDeletionMessage('');
        setIsConfirmDeleteUserModalOpen(false);

        if (!currentUser || currentUser.role !== 'Administrador') {
            setDeletionStatus('error');
            setDeletionMessage('Você não tem permissão para realizar esta ação.');
            return;
        }

        try {
            const response = await fetch('https://zwmxzoyaffkrwkhjcoyt.supabase.co/functions/v1/delete-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await supabase.auth.getSession().then(res => res.data.session?.access_token)}`,
                },
                body: JSON.stringify({ email: emailToDelete }),
            });

            const data = await response.json();

            if (response.ok) {
                setDeletionStatus('success');
                setDeletionMessage(data.message || `Usuário ${emailToDelete} excluído com sucesso.`);
                setEmailToDelete('');
            } else {
                setDeletionStatus('error');
                setDeletionMessage(data.error || `Falha ao excluir usuário: ${data.message}`);
            }
        } catch (error) {
            console.error('Error calling delete-user edge function:', error);
            setDeletionStatus('error');
            setDeletionMessage('Erro de rede ou servidor ao tentar excluir o usuário.');
        }
    };

    if (currentUser?.role !== 'Administrador') {
        return null; // Only show for administrators
    }

    return (
        <>
            <Card className="border border-red-200 bg-red-50/50">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-red-200">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <h3 className="text-base font-semibold text-red-800 m-0">Excluir Usuário (Admin)</h3>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label htmlFor="emailToDelete" className="block text-sm font-medium text-red-700 mb-1">
                            E-mail do Usuário a Excluir
                        </label>
                        <input
                            type="email"
                            id="emailToDelete"
                            value={emailToDelete}
                            onChange={(e) => setEmailToDelete(e.target.value)}
                            placeholder="usuario@exemplo.com"
                            className="w-full p-2 border border-red-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition bg-white text-slate-900"
                        />
                    </div>
                    {deletionStatus === 'success' && (
                        <div className="bg-emerald-50 border-l-4 border-emerald-400 p-3 text-sm text-emerald-700">
                            {deletionMessage}
                        </div>
                    )}
                    {deletionStatus === 'error' && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-3 text-sm text-red-700">
                            {deletionMessage}
                        </div>
                    )}
                    <button
                        onClick={() => setIsConfirmDeleteUserModalOpen(true)}
                        disabled={!emailToDelete.trim() || deletionStatus === 'loading'}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 font-semibold bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                        {deletionStatus === 'loading' ? 'Excluindo...' : 'Excluir Usuário'}
                    </button>
                </div>
            </Card>

            <ConfirmationModal
                isOpen={isConfirmDeleteUserModalOpen}
                onClose={() => setIsConfirmDeleteUserModalOpen(false)}
                onConfirm={handleDeleteUser}
                title="Confirmar Exclusão de Usuário"
                confirmButtonText="Sim, Excluir Permanentemente"
                confirmButtonVariant="danger"
            >
                <p>
                    Tem certeza que deseja excluir permanentemente o usuário{' '}
                    <strong className="text-slate-900">{emailToDelete}</strong>?
                    Esta ação é irreversível e removerá todos os dados associados a este usuário.
                </p>
            </ConfirmationModal>
        </>
    );
};


// --- Main Settings Component ---

export const Settings: React.FC<SettingsProps> = ({
    adminSettings, onAdminSettingsChange,
    globalAnnouncement, onGlobalAnnouncementChange,
    chapters, onChaptersReorder, onChapterUpdate, onAddChapter,
    mainColumnWidgets, onMainColumnWidgetsReorder,
    sidebarColumnWidgets, onSidebarColumnWidgetsReorder,
    widgetTiers, onWidgetTiersChange,
    students, onUpdateStudentTier, onUpdateStudentDetails, onAddStudent, onDeleteStudent,
    staffUsers, onUpdateStaffUserRole, onAddStaffUser, onDeleteStaffUser, onUpdateStaffUserDetails,
    onExportState,
    userTier, isUpgradeBannerHidden, onIsUpgradeBannerHiddenChange,
    currentUser
}) => {
    const [announcementText, setAnnouncementText] = useState(globalAnnouncement?.message || '');
    const [announcementType, setAnnouncementType] = useState(globalAnnouncement?.displayType || 'banner');
    const [editingChapter, setEditingChapter] = useState<Chapter | { id?: undefined } | null>(null);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [editingStaffUser, setEditingStaffUser] = useState<StaffUser | null>(null);
    const [openWidgetDropdown, setOpenWidgetDropdown] = useState<string | null>(null);
    const layoutRef = useRef<HTMLDivElement>(null);

    const isAdmin = currentUser?.role === 'Administrador';

    const [confirmationState, setConfirmationState] = useState<{
        isOpen: boolean;
        title: string;
        message: React.ReactNode;
        onConfirm: (() => void) | null;
        variant?: 'primary' | 'danger';
    }>({
        isOpen: false,
        title: '',
        message: null,
        onConfirm: null,
        variant: 'primary',
    });

    const closeConfirmationModal = () => {
        setConfirmationState({ isOpen: false, title: '', message: null, onConfirm: null, variant: 'primary' });
    };

    const handleInitiateTierChange = (student: Student, newTier: UserTier) => {
        const { name, color } = tierInfo[newTier];
        setConfirmationState({
            isOpen: true,
            title: 'Confirmar Alteração de Plano',
            message: (
                <p>
                    Tem certeza que deseja alterar o plano de{' '}
                    <strong className="text-slate-900">{student.name}</strong> para{' '}
                    <strong className={`font-semibold ${color}`}>{name}</strong>?
                </p>
            ),
            onConfirm: () => {
                onUpdateStudentTier(student.id, newTier);
                closeConfirmationModal();
            },
            variant: 'primary',
        });
    };

    const handleInitiateDelete = (student: Student) => {
        setConfirmationState({
            isOpen: true,
            title: 'Confirmar Exclusão de Aluno',
            message: (
                <p>
                    Tem certeza que deseja excluir permanentemente o aluno{' '}
                    <strong className="text-slate-900">{student.name}</strong>? Esta ação não pode ser desfeita.
                </p>
            ),
            onConfirm: () => {
                onDeleteStudent(student.id);
                closeConfirmationModal();
            },
            variant: 'danger',
        });
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (layoutRef.current && !layoutRef.current.contains(event.target as Node)) {
                setOpenWidgetDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleAdminSettingChange = (key: keyof typeof adminSettings, value: boolean) => {
        onAdminSettingsChange({ ...adminSettings, [key]: value });
    };

    const handlePublishAnnouncement = () => {
        if (announcementText.trim()) {
            onGlobalAnnouncementChange({ message: announcementText, displayType: announcementType as any });
        } else {
            onGlobalAnnouncementChange(null);
        }
    };
    
    const moveItem = <T,>(list: T[], index: number, direction: 'up' | 'down'): T[] => {
        const newList = [...list];
        const item = newList.splice(index, 1)[0];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        newList.splice(newIndex, 0, item);
        return newList;
    };

    const widgetNames: Record<string, string> = {
        currentStatus: "Status Atual", concept: "Conceito do Dia", resources: "Recursos",
        timeline: "Linha do Tempo", tasks: "Tarefas", weeklyGoals: "Metas Semanais",
        badges: "Insígnias", friends: "Amigos", favorites: "Favoritos",
        quoteOfTheDay: "Citação do Dia", focusTimer: "Bloco de Foco", activitySummary: "Resumo de Atividades",
        calendar: "Calendário"
    };
    
    const announcementTypeLabels: Record<string, string> = {
        banner: 'Banner',
        notification: 'Notificação',
        both: 'Ambos'
    };

    const renderWidgetRow = (widgetId: string, index: number, list: string[], reorderFn: (list: string[]) => void) => {
        const tier = widgetTiers[widgetId] || 'Grátis';
        const { Icon: TierIcon, color } = tierInfo[tier];
        const isDropdownOpen = openWidgetDropdown === widgetId;

        return (
            <div key={widgetId} className="flex items-center p-2 bg-slate-50 rounded-lg gap-3">
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setOpenWidgetDropdown(isDropdownOpen ? null : widgetId)}
                        className="group flex items-center flex-shrink-0 p-1.5 rounded-md hover:bg-slate-200 transition-colors"
                        aria-haspopup="listbox"
                        aria-expanded={isDropdownOpen}
                        title={`Mudar plano de acesso (Atual: ${tier})`}
                    >
                        <TierIcon className={`w-5 h-5 ${color}`} />
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute top-full mt-1 w-48 bg-white rounded-md shadow-lg border z-10 p-1 animate-fadeInUp" role="listbox">
                            {(Object.keys(tierInfo) as UserTier[]).map(t => {
                                const { name: tierName, Icon: DropdownTierIcon, color: tierColor } = tierInfo[t];
                                const isSelected = tier === t;
                                return (
                                    <button
                                        key={t}
                                        type="button"
                                        role="option"
                                        aria-selected={isSelected}
                                        onClick={() => {
                                            onWidgetTiersChange({ ...widgetTiers, [widgetId]: t });
                                            setOpenWidgetDropdown(null);
                                        }}
                                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-left rounded-md transition-colors ${
                                            isSelected ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700 hover:bg-slate-100'
                                        }`}
                                    >
                                        <DropdownTierIcon className={`w-5 h-5 ${tierColor}`} />
                                        <span className="flex-1">{tierName}</span>
                                        {isSelected && <CheckCircle className="w-5 h-5 text-indigo-600" />}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
                <span className="font-semibold text-slate-700 flex-1 truncate">{widgetNames[widgetId] || widgetId}</span>
                <div className="flex items-center gap-1">
                    <button onClick={() => reorderFn(moveItem(list, index, 'up'))} disabled={index === 0} className="p-1 rounded-md disabled:opacity-30 hover:bg-slate-200"><ChevronUp className="w-5 h-5" /></button>
                    <button onClick={() => reorderFn(moveItem(list, index, 'down'))} disabled={index === list.length - 1} className="p-1 rounded-md disabled:opacity-30 hover:bg-slate-200"><ChevronDown className="w-5 h-5" /></button>
                </div>
            </div>
        );
    };

    const settingsItems = [
        {
            key: 'maintenanceMode',
            label: "Modo de Manutenção",
            description: "Coloca um banner de aviso em todo o app e desativa algumas funções.",
            isEnabled: adminSettings.maintenanceMode,
            onToggle: () => handleAdminSettingChange('maintenanceMode', !adminSettings.maintenanceMode),
            isVisible: true,
        },
        {
            key: 'socialModuleEnabled',
            label: "Módulo Social (Amigos)",
            description: "Ativa ou desativa o widget de amigos no dashboard.",
            isEnabled: adminSettings.socialModuleEnabled,
            onToggle: () => handleAdminSettingChange('socialModuleEnabled', !adminSettings.socialModuleEnabled),
            isVisible: true,
        },
        {
            key: 'upgradeBanner',
            label: "Banner de Upgrade",
            description: "Controla a visibilidade do banner de upgrade na sidebar para planos Grátis e Essencial.",
            isEnabled: !isUpgradeBannerHidden,
            onToggle: () => onIsUpgradeBannerHiddenChange(!isUpgradeBannerHidden),
            isVisible: userTier === 'Completo',
        },
        {
            key: 'newSignups',
            label: "Permitir Novos Cadastros",
            description: "Controla se novos usuários podem se cadastrar na plataforma.",
            isEnabled: adminSettings.newSignups,
            onToggle: () => handleAdminSettingChange('newSignups', !adminSettings.newSignups),
            isVisible: true,
        },
    ];

    const getSrText = (key: string, label: string, isEnabled: boolean) => {
        if (key === 'upgradeBanner') {
            return isEnabled ? "Banner de upgrade está visível" : "Banner de upgrade está oculto";
        }
        return `${label} - ${isEnabled ? "Ativado" : "Desativado"}`;
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 w-full">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeInUp">
                
                {/* Main Column */}
                <div className="lg:col-span-2 space-y-6" ref={layoutRef}>
                    {isAdmin && (
                        <UserManagementCard
                            users={staffUsers}
                            onUpdateRole={onUpdateStaffUserRole}
                            onAddUser={onAddStaffUser}
                            onDeleteUser={onDeleteStaffUser}
                            onInitiateEdit={setEditingStaffUser}
                            currentUser={currentUser}
                        />
                    )}
                    
                    <StudentManagementCard 
                        students={students} 
                        onInitiateTierChange={handleInitiateTierChange} 
                        onAddStudent={onAddStudent} 
                        onInitiateDelete={handleInitiateDelete} 
                        onInitiateEdit={setEditingStudent}
                        currentUser={currentUser}
                    />

                    <Card>
                        <CardHeader title="Gerenciar Módulos" icon={BookOpen} />
                        <div className="p-4 space-y-2">
                            {chapters.map((chapter, index) => {
                                const { Icon: TierIcon, color } = tierInfo[chapter.tier];
                                return (
                                <div key={chapter.id} className="flex items-center p-2 bg-slate-50 rounded-lg gap-3">
                                    <div className="relative group flex items-center flex-shrink-0">
                                        <TierIcon className={`w-5 h-5 ${color}`} />
                                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max px-2 py-1 bg-slate-800 text-white text-xs font-semibold rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                            Plano {chapter.tier}
                                        </div>
                                    </div>

                                    <span className="font-semibold text-slate-700 flex-1 truncate">{chapter.id}: {chapter.title}</span>
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => onChaptersReorder(moveItem(chapters, index, 'up'))} disabled={index === 0} className="p-1 rounded-md disabled:opacity-30 hover:bg-slate-200"><ChevronUp className="w-5 h-5" /></button>
                                        <button onClick={() => onChaptersReorder(moveItem(chapters, index, 'down'))} disabled={index === chapters.length - 1} className="p-1 rounded-md disabled:opacity-30 hover:bg-slate-200"><ChevronDown className="w-5 h-5" /></button>
                                        <button onClick={() => setEditingChapter(chapter)} className="p-1.5 bg-slate-200 text-slate-600 rounded-md hover:bg-slate-300 hover:text-slate-800 transition-colors" aria-label="Editar Módulo">
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                        <div className="p-4 border-t">
                            <button onClick={() => setEditingChapter({})} className="w-full flex items-center justify-center gap-2 p-2 border-2 border-dashed border-slate-300 text-slate-500 rounded-lg hover:bg-slate-100">
                                <Plus className="w-4 h-4" /> Adicionar Novo Módulo
                            </button>
                        </div>
                    </Card>
                    
                    {isAdmin && (
                        <>
                            <Card>
                                <CardHeader title="Layout do Dashboard (Principal)" icon={Layout} />
                                <div className="p-4 space-y-2">
                                   {mainColumnWidgets.map((widgetId, index) => renderWidgetRow(widgetId, index, mainColumnWidgets, onMainColumnWidgetsReorder))}
                                </div>
                            </Card>
                            <Card>
                                <CardHeader title="Layout do Dashboard (Sidebar)" icon={Layout} />
                                <div className="p-4 space-y-2">
                                   {sidebarColumnWidgets.map((widgetId, index) => {
                                        if (widgetId === 'friends' && !adminSettings.socialModuleEnabled) {
                                            return null;
                                        }
                                        return renderWidgetRow(widgetId, index, sidebarColumnWidgets, onSidebarColumnWidgetsReorder);
                                   })}
                                </div>
                            </Card>
                        </>
                    )}
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    <StatisticsCard students={students} />
                    {isAdmin && (
                        <Card>
                            <CardHeader title="Configurações Gerais" icon={SettingsIcon} />
                            <div className="p-6 space-y-4">
                                {settingsItems.filter(item => item.isVisible).map(item => (
                                    <div key={item.key} className="p-3 bg-slate-50 rounded-lg">
                                        <div className="flex items-start justify-between">
                                            <div className="pr-4">
                                                <label id={`${item.key}Label`} className="text-sm font-medium text-slate-700">{item.label}</label>
                                                {item.description && <p className="text-xs text-slate-500 mt-1">{item.description}</p>}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={item.onToggle}
                                                className={`flex-shrink-0 p-1.5 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                                                    item.isEnabled ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                                                }`}
                                                aria-pressed={item.isEnabled}
                                                aria-labelledby={`${item.key}Label`}
                                            >
                                                <span className="sr-only">{getSrText(item.key, item.label, item.isEnabled)}</span>
                                                {item.isEnabled ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    <Card>
                        <CardHeader title="Comunicado Global" icon={Megaphone} />
                        <div className="p-6 space-y-4">
                            <textarea value={announcementText} onChange={e => setAnnouncementText(e.target.value)} placeholder="Deixe em branco para remover o comunicado..." rows={3} className="w-full p-2 border rounded-md" />
                            <div className="flex items-center gap-4">
                                <label className="text-sm font-medium">Exibir como:</label>
                                <div className="flex gap-4">
                                    {(['banner', 'notification', 'both'] as const).map(type => (
                                        <label key={type} className="flex items-center gap-2 text-sm">
                                            <input
                                                type="radio"
                                                name="announcementType"
                                                value={type}
                                                checked={announcementType === type}
                                                onChange={e => setAnnouncementType(e.target.value as Announcement['displayType'])}
                                            />
                                            {announcementTypeLabels[type]}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <button onClick={handlePublishAnnouncement} className="w-full flex items-center justify-center gap-2 px-4 py-2 font-semibold bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                                <Save className="w-4 h-4" /> Publicar / Atualizar Comunicado
                            </button>
                        </div>
                    </Card>

                     {isAdmin && (
                        <AdminUserDeletionCard currentUser={currentUser} />
                     )}

                     {isAdmin && (
                        <Card>
                            <CardHeader title="Ferramentas de Desenvolvedor" icon={GitMerge} />
                            <div className="p-6">
                                <p className="text-sm text-slate-600 mb-3">Use esta ferramenta para "congelar" o estado atual da aplicação (salvo no seu navegador) e prepará-lo para ser salvo no código-fonte.</p>
                                <button 
                                    onClick={onExportState} 
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 font-semibold bg-slate-700 text-white rounded-md hover:bg-slate-800"
                                >
                                    Exportar Estado para Console
                                </button>
                            </div>
                        </Card>
                     )}
                </div>

                {editingChapter && (
                    <EditChapterModal 
                        chapter={editingChapter} 
                        onClose={() => setEditingChapter(null)}
                        onSave={(details) => {
                            if ('id' in editingChapter && editingChapter.id !== undefined) {
                                onChapterUpdate(editingChapter.id, details);
                            } else {
                                onAddChapter(details);
                            }
                        }}
                    />
                )}
                
                {editingStudent && (
                    <EditStudentModal
                        student={editingStudent}
                        onClose={() => setEditingStudent(null)}
                        onSave={onUpdateStudentDetails}
                    />
                )}

                {editingStaffUser && (
                    <EditStaffUserModal
                        user={editingStaffUser}
                        onClose={() => setEditingStaffUser(null)}
                        onSave={onUpdateStaffUserDetails}
                    />
                )}

                <ConfirmationModal
                    isOpen={confirmationState.isOpen}
                    onClose={closeConfirmationModal}
                    onConfirm={confirmationState.onConfirm || (() => {})}
                    title={confirmationState.title}
                    confirmButtonVariant={confirmationState.variant || 'primary'}
                >
                    {confirmationState.message}
                </ConfirmationModal>
            </div>
        </div>
    );
};