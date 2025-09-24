
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import type { Chapter, Note, Task, WeeklyGoal, UserTier } from '../types';
import { BookOpen, Sparkles, LaurelWreath, FileText, CheckSquare, Compass, Pencil, Trash2, Loader, CheckCircle, X, GitBranch, Target, Trophy, Users, Bookmark, Plus, Bell, Clock, Lightbulb, Quote, LockClosed, Rocket, PieChart, Activity, CalendarDays, ChevronLeft, ChevronRight } from './Icons';
import { tierInfo, BOOK_QUOTES } from '../constants';

// --- Reusable Components ---

const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => {
  return (
    <div className="relative group flex items-center cursor-help">
      {children}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-xs px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
        {text}
        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-800"></div>
      </div>
    </div>
  );
};


const Card: React.FC<{ children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({ children, className = '', style }) => (
  <div style={style} className={`bg-white rounded-xl shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader: React.FC<{ title: string; icon?: React.FC<React.SVGProps<SVGSVGElement>>; tooltipText?: string; }> = ({ title, icon: Icon, tooltipText }) => (
    <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-200">
        {Icon && (
            tooltipText ? (
                <Tooltip text={tooltipText}>
                    <Icon className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform duration-200" />
                </Tooltip>
            ) : (
                <Icon className="w-5 h-5 text-indigo-600" />
            )
        )}
        <h3 className="text-base font-semibold text-slate-800 m-0">{title}</h3>
    </div>
);

// --- New Widgets ---

const ActivitySummaryCard: React.FC<{ tasks: Task[]; weeklyGoals: WeeklyGoal[]; notes: Note[] }> = ({ tasks, weeklyGoals, notes }) => {
    const [stats, setStats] = useState({ tasks: 0, goals: 0, notes: 0 });

    useEffect(() => {
        const tasksCompleted = tasks.filter(t => t.completed).length;
        const goalsMet = weeklyGoals.filter(g => g.current >= g.target).length;
        const notesCreated = notes.length;

        setStats({ tasks: tasksCompleted, goals: goalsMet, notes: notesCreated });
    }, [tasks, weeklyGoals, notes]);
    
    return (
        <Card>
            <CardHeader title="Resumo de Atividades" icon={Activity} tooltipText="Seu resumo de conquistas na plataforma" />
            <div className="p-6 grid grid-cols-3 gap-4">
                <div className="text-center bg-slate-50 p-4 rounded-lg">
                    <p className="text-3xl font-bold text-teal-600">{stats.tasks}</p>
                    <p className="text-xs font-semibold text-slate-500 uppercase mt-1">Tarefas Concluídas</p>
                </div>
                <div className="text-center bg-slate-50 p-4 rounded-lg">
                    <p className="text-3xl font-bold text-amber-600">{stats.goals}</p>
                    <p className="text-xs font-semibold text-slate-500 uppercase mt-1">Metas Atingidas</p>
                </div>
                <div className="text-center bg-slate-50 p-4 rounded-lg">
                    <p className="text-3xl font-bold text-sky-600">{stats.notes}</p>
                    <p className="text-xs font-semibold text-slate-500 uppercase mt-1">Notas Criadas</p>
                </div>
            </div>
        </Card>
    );
};

const QuoteOfTheDayCard: React.FC = () => {
    const [quote, setQuote] = useState('');

    useEffect(() => {
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
        const quoteIndex = dayOfYear % BOOK_QUOTES.length;
        setQuote(BOOK_QUOTES[quoteIndex]);
    }, []);
    
    return (
        <Card>
            <CardHeader title="Citação do Dia" icon={Quote} tooltipText="Uma dose de inspiração do método" />
            <div className="p-6">
                 <blockquote className="text-center italic text-slate-600 text-sm leading-relaxed">
                    "{quote}"
                </blockquote>
            </div>
        </Card>
    );
};

const FocusTimerCard: React.FC = () => {
    const durations = { Pomodoro: 25, Curto: 45, Longo: 60 };
    const [duration, setDuration] = useState(durations.Pomodoro * 60);
    const [timeRemaining, setTimeRemaining] = useState(duration);
    const [isActive, setIsActive] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            audioRef.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-positive-notification-951.mp3');
            audioRef.current.volume = 0.5;
        }
    }, []);

    useEffect(() => {
        // Fix: Use ReturnType<typeof setTimeout> for better type safety and compatibility.
        let interval: ReturnType<typeof setTimeout> | null = null;
        if (isActive && timeRemaining > 0) {
            interval = setInterval(() => {
                setTimeRemaining(time => time - 1);
            }, 1000);
        } else if (timeRemaining === 0 && isActive) {
            setIsActive(false);
            audioRef.current?.play();
            alert('Sessão de foco concluída!');
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeRemaining]);
    
    const handleDurationChange = (minutes: number) => {
        if (isActive) return;
        const newDurationInSeconds = minutes * 60;
        setDuration(newDurationInSeconds);
        setTimeRemaining(newDurationInSeconds);
    };

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeRemaining(duration);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const progress = (duration - timeRemaining) / duration * 100;

    return (
        <Card>
            <CardHeader title="Bloco de Foco" icon={Clock} tooltipText="Use blocos de tempo para focar em suas tarefas" />
            <div className="p-6 space-y-4">
                <div className="relative w-40 h-40 mx-auto">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle className="text-slate-200" strokeWidth="8" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                        <circle
                            className="text-indigo-600"
                            strokeWidth="8"
                            strokeDasharray={2 * Math.PI * 45}
                            strokeDashoffset={2 * Math.PI * 45 * (1 - progress / 100)}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="45"
                            cx="50"
                            cy="50"
                            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s linear' }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-bold text-slate-800 tracking-tighter">{formatTime(timeRemaining)}</span>
                    </div>
                </div>

                <div className="flex justify-center gap-2">
                    {Object.entries(durations).map(([label, minutes]) => (
                        <button 
                            key={label}
                            onClick={() => handleDurationChange(minutes)}
                            disabled={isActive}
                            className={`px-3 py-1 text-xs font-semibold rounded-full transition ${duration === minutes * 60 && !isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed'}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                <div className="flex justify-center gap-4">
                    <button 
                        onClick={toggleTimer} 
                        className="px-6 py-2 text-sm font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                        {isActive ? 'Pausar' : 'Iniciar'}
                    </button>
                    <button 
                        onClick={resetTimer} 
                        className="px-6 py-2 text-sm font-bold bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"
                    >
                        Resetar
                    </button>
                </div>
            </div>
        </Card>
    );
};

const CalendarCard: React.FC<{
  tasks: Task[];
  weeklyGoals: WeeklyGoal[];
}> = ({ tasks, weeklyGoals }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

    // --- Helper functions for date manipulation ---
    const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const startOfWeek = (date: Date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day;
        return new Date(d.setDate(diff));
    };
    const addDays = (date: Date, days: number) => {
        const d = new Date(date);
        d.setDate(d.getDate() + days);
        return d;
    };
    const isSameDay = (d1: Date, d2: Date) => 
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();

    const tasksByDate = useMemo(() => {
        const map = new Map<string, Task[]>();
        tasks.forEach(task => {
            if (task.reminder && !task.completed) {
                const reminderDate = new Date(task.reminder);
                const key = reminderDate.toDateString();
                if (!map.has(key)) {
                    map.set(key, []);
                }
                map.get(key)!.push(task);
            }
        });
        return map;
    }, [tasks]);

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const goToToday = () => {
        const today = new Date();
        setCurrentDate(today);
        setSelectedDate(today);
    };

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = addDays(startOfWeek(monthEnd), 6);

    const calendarDays = [];
    let day = startDate;
    while (day <= endDate) {
        calendarDays.push(new Date(day));
        day = addDays(day, 1);
    }

    const selectedDayTasks = selectedDate ? tasksByDate.get(selectedDate.toDateString()) || [] : [];
    
    return (
        <Card>
            <CardHeader title="Calendário" icon={CalendarDays} tooltipText="Visualize suas tarefas agendadas" />
            <div className="p-4">
                <div className="flex items-center justify-between mb-3 px-2">
                    <button onClick={prevMonth} aria-label="Mês anterior" className="p-1 rounded-full hover:bg-slate-100"><ChevronLeft className="w-5 h-5" /></button>
                    <div className="text-center">
                        <span className="font-semibold text-slate-800 text-sm">
                            {currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase())}
                        </span>
                         <button onClick={goToToday} className="ml-2 px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200">Hoje</button>
                    </div>
                    <button onClick={nextMonth} aria-label="Próximo mês" className="p-1 rounded-full hover:bg-slate-100"><ChevronRight className="w-5 h-5" /></button>
                </div>
                
                <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-500 mb-2">
                    <div>D</div><div>S</div><div>T</div><div>Q</div><div>Q</div><div>S</div><div>S</div>
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((date, index) => {
                        const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                        const isToday = isSameDay(date, new Date());
                        const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
                        const hasTasks = tasksByDate.has(date.toDateString());

                        return (
                            <button
                                key={index}
                                onClick={() => setSelectedDate(date)}
                                className={`relative w-9 h-9 flex items-center justify-center rounded-full text-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400
                                    ${!isCurrentMonth ? 'text-slate-300' : 'text-slate-700'}
                                    ${isToday && !isSelected ? 'font-bold text-indigo-600 bg-indigo-50' : ''}
                                    ${isSelected ? 'bg-indigo-600 text-white font-bold shadow-md' : 'hover:bg-slate-100'}
                                `}
                            >
                                {date.getDate()}
                                {hasTasks && !isSelected && <div className="absolute bottom-1.5 w-1 h-1 bg-teal-500 rounded-full"></div>}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="border-t border-slate-200 p-4">
                <h4 className="font-semibold text-slate-800 text-sm mb-3">
                    {selectedDate ? selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }) : 'Nenhum dia selecionado'}
                </h4>
                <div className="space-y-4 max-h-48 overflow-y-auto pr-2">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                           <CheckSquare className="w-4 h-4 text-slate-500"/>
                           <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tarefas do Dia</h5>
                        </div>
                        {selectedDayTasks.length > 0 ? (
                            <ul className="space-y-1.5">
                                {selectedDayTasks.map(task => (
                                    <li key={task.id} className="flex items-center gap-2 text-sm text-slate-700 pl-2 border-l-2 border-indigo-200">
                                        <Clock className="w-3.5 h-3.5 flex-shrink-0 text-indigo-500"/>
                                        <span className="flex-1">{task.text}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                             <p className="text-sm text-slate-400 italic pl-6">Nenhuma tarefa agendada.</p>
                        )}
                    </div>
                    <div>
                       <div className="flex items-center gap-2 mb-2">
                           <Target className="w-4 h-4 text-slate-500"/>
                           <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Metas da Semana</h5>
                        </div>
                        {weeklyGoals.length > 0 ? (
                           <ul className="space-y-1.5">
                               {weeklyGoals.map(goal => (
                                   <li key={goal.id} className="flex items-center gap-2 text-sm text-slate-700 pl-2 border-l-2 border-teal-200">
                                       <Trophy className="w-3.5 h-3.5 flex-shrink-0 text-teal-500"/>
                                       <span className="flex-1">{goal.description} ({goal.current}/{goal.target})</span>
                                   </li>
                               ))}
                           </ul>
                        ) : (
                            <p className="text-sm text-slate-400 italic pl-6">Nenhuma meta semanal definida.</p>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
};

// --- Dashboard Widgets ---

const StatCard: React.FC<{
    value: string | number;
    label: string;
    prefix?: string;
}> = ({ value, label, prefix }) => (
    <div className="bg-slate-50 rounded-xl p-6 text-center shadow-inner h-full flex flex-col justify-center">
        {prefix && <p className="text-lg font-semibold text-indigo-500 -mb-1">{prefix}</p>}
        <p className={`font-bold text-indigo-600 ${prefix ? 'text-3xl' : 'text-4xl'}`}>
            {value}
        </p>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-2">{label}</p>
    </div>
);

const StatsGrid: React.FC<{
    chapters: Chapter[];
    completedChapterIds: Set<number>;
    notes: Note[];
    tasks: Task[];
    nextChapter: Chapter;
}> = ({ chapters, completedChapterIds, notes, tasks, nextChapter }) => {
    const averageCompletion = chapters.length > 0 ? Math.round((completedChapterIds.size / chapters.length) * 100) : 0;
    const notesCreated = notes.length;
    const tasksCompleted = tasks.filter(t => t.completed).length;

    return (
        <Card>
            <CardHeader 
                title="Estatísticas Gerais"
                icon={Clock}
                tooltipText="Seu resumo de atividades na plataforma"
            />
            <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard value={notesCreated} label="Notas Criadas" />
                    <StatCard value={`${averageCompletion}%`} label="Conclusão Média" />
                    <StatCard value={tasksCompleted} label="Tarefas Concluídas" />
                    <StatCard 
                        prefix={`Cap. ${nextChapter.id}:`}
                        value={nextChapter.shortTitle} 
                        label="Próximo Capítulo"
                    />
                </div>
            </div>
        </Card>
    );
};

const LockedWidgetPreview: React.FC<{ title: string; requiredTier: UserTier; onUpgradeClick: () => void; }> = ({ title, requiredTier, onUpgradeClick }) => {
    const tierData = tierInfo[requiredTier];
    const { Icon, color, name } = tierData;

    return (
        <Card className="relative overflow-hidden border-2 border-dashed border-slate-300 bg-slate-50">
            <div className="p-8 text-center">
                <div className={`w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <LockClosed className="w-6 h-6 text-slate-500" />
                </div>
                <h4 className="font-bold text-slate-700">{title}</h4>
                <div className="text-sm text-slate-600 mt-2 flex items-baseline justify-center">
                    <p>
                        Este recurso está disponível no plano
                        <span className={`font-bold inline-flex items-center gap-1.5 ${color} ml-1.5`}>
                            <Icon className="w-4 h-4" /> {name}
                        </span>
                    </p>
                </div>
                <button
                    onClick={onUpgradeClick}
                    className="mt-5 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 text-sm"
                >
                    <Rocket className="w-5 h-5" />
                    Fazer Upgrade para Desbloquear
                </button>
            </div>
        </Card>
    );
};

const NoteItem: React.FC<{
    note: Note;
    isEditing: boolean;
    editedContent: string;
    isHighlighted: boolean;
    onEditChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onStartEdit: () => void;
    onSaveEdit: () => void;
    onCancelEdit: () => void;
    onDelete: () => void;
}> = ({ note, isEditing, editedContent, onEditChange, onStartEdit, onSaveEdit, onCancelEdit, onDelete, isHighlighted }) => {
    return (
        <div className={`p-3 rounded-lg border animate-fadeInUp transition-colors duration-1000 ${isHighlighted ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
            {isEditing ? (
                <div className="space-y-2">
                    <textarea
                        value={editedContent}
                        onChange={onEditChange}
                        rows={4}
                        className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white text-slate-900 text-sm"
                        aria-label="Editar nota"
                    />
                    <div className="flex justify-end space-x-2">
                        <button onClick={onCancelEdit} className="px-3 py-1 text-sm text-slate-600 hover:bg-slate-200 rounded-md transition">Cancelar</button>
                        <button onClick={onSaveEdit} className="px-3 py-1 text-sm bg-indigo-600 text-white hover:bg-indigo-700 rounded-md transition font-semibold">Salvar</button>
                    </div>
                </div>
            ) : (
                <div className="group">
                    <p className="text-slate-700 text-sm whitespace-pre-wrap break-words">{note.content}</p>
                    <div className="flex justify-end items-center space-x-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={onStartEdit} aria-label="Editar nota" className="p-1 text-slate-500 hover:text-indigo-600 rounded-full hover:bg-slate-100">
                            <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={onDelete} aria-label="Excluir nota" className="p-1 text-slate-500 hover:text-red-600 rounded-full hover:bg-slate-100">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const NotesModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  notes: Note[];
  onAddNote: (content: string) => void;
  onEditNote: (id: string, content: string) => void;
  onDeleteNote: (id: string) => void;
}> = ({ isOpen, onClose, notes, onAddNote, onEditNote, onDeleteNote }) => {
    const [newNoteContent, setNewNoteContent] = useState('');
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
    const [editedContent, setEditedContent] = useState('');
    const [savingState, setSavingState] = useState<'idle' | 'saving' | 'saved'>('idle');
    const [highlightedNoteId, setHighlightedNoteId] = useState<string | null>(null);
    const prevNotesRef = useRef(notes);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && notes.length > prevNotesRef.current.length) {
            const newNote = notes[0];
            if (newNote) {
                setHighlightedNoteId(newNote.id);
                setTimeout(() => setHighlightedNoteId(null), 2000);
            }
        }
        prevNotesRef.current = notes;
    }, [notes, isOpen]);

    if (!isOpen) {
        return null;
    }

    const handleAddClick = () => {
        if (!newNoteContent.trim() || savingState !== 'idle') return;
        setSavingState('saving');
        setTimeout(() => {
            onAddNote(newNoteContent);
            setNewNoteContent('');
            setSavingState('saved');
            setTimeout(() => setSavingState('idle'), 1500);
        }, 1000);
    };

    const handleStartEdit = (note: Note) => {
        setEditingNoteId(note.id);
        setEditedContent(note.content);
    };

    const handleSaveEdit = () => {
        if (editingNoteId) {
            onEditNote(editingNoteId, editedContent);
            setHighlightedNoteId(editingNoteId);
            setTimeout(() => setHighlightedNoteId(null), 2000);
            setEditingNoteId(null);
            setEditedContent('');
        }
    };

    const handleCancelEdit = () => {
        setEditingNoteId(null);
        setEditedContent('');
    };
    
    const modalContent = (
        <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeInUp"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="notes-modal-title"
        >
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scaleIn"
                onClick={e => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-4 border-b border-slate-200 flex-shrink-0">
                    <div className="flex items-center space-x-3">
                        <Pencil className="w-6 h-6 text-indigo-600" />
                        <h2 id="notes-modal-title" className="text-lg font-semibold text-slate-800">Bloco de Notas Pessoal</h2>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-1 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                        aria-label="Fechar"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </header>
                <main className="flex-1 overflow-y-auto p-6 space-y-4">
                     <div className="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <textarea
                            name="new_note_modal"
                            value={newNoteContent}
                            onChange={(e) => setNewNoteContent(e.target.value)}
                            rows={4}
                            placeholder="Escreva uma nova nota aqui..."
                            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white text-slate-900 text-sm"
                            aria-label="Nova nota"
                        />
                        <button
                            onClick={handleAddClick}
                            disabled={!newNoteContent.trim() || savingState !== 'idle'}
                            className={`w-full font-bold py-2 px-4 rounded-lg text-sm transition-all shadow focus:outline-none focus:ring-2 focus:ring-opacity-50 flex items-center justify-center
                                ${savingState === 'idle' ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed' : ''}
                                ${savingState === 'saving' ? 'bg-indigo-400 text-white cursor-wait' : ''}
                                ${savingState === 'saved' ? 'bg-emerald-500 text-white cursor-default' : ''}
                            `}
                        >
                            {savingState === 'saving' && <Loader className="animate-spin w-5 h-5 mr-2" />}
                            {savingState === 'saved' && <CheckCircle className="w-5 h-5 mr-2 animate-scaleIn" />}
                            {{
                                idle: 'Adicionar Nota',
                                saving: 'Salvando...',
                                saved: 'Salvo!'
                            }[savingState]}
                        </button>
                    </div>

                    <div className="space-y-3">
                        {notes.length > 0 ? (
                            notes.map(note => (
                                <NoteItem
                                    key={note.id}
                                    note={note}
                                    isEditing={editingNoteId === note.id}
                                    editedContent={editedContent}
                                    isHighlighted={highlightedNoteId === note.id}
                                    onEditChange={(e) => setEditedContent(e.target.value)}
                                    onStartEdit={() => handleStartEdit(note)}
                                    onSaveEdit={handleSaveEdit}
                                    onCancelEdit={handleCancelEdit}
                                    onDelete={() => onDeleteNote(note.id)}
                                />
                            ))
                        ) : (
                            <p className="text-sm text-slate-500 text-center py-8">Nenhuma nota salva ainda. Comece a escrever!</p>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
    
    return isMounted ? createPortal(modalContent, document.body) : null;
};

const CurrentStatusCard: React.FC<{
    chapters: Chapter[];
    completedChapterIds: Set<number>;
    nextChapter: Chapter;
    onSelectChapter: (id: number) => void;
}> = ({ chapters, completedChapterIds, nextChapter, onSelectChapter }) => {
    const totalChapters = chapters.length;
    const completedCount = completedChapterIds.size;
    const percentage = totalChapters > 0 ? Math.round((completedCount / totalChapters) * 100) : 0;

    return (
        <Card>
            <CardHeader 
                title="Seu Próximo Passo"
                icon={Compass}
                tooltipText="Foco no que vem a seguir para continuar sua jornada"
            />
            <div className="p-6">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                     <h4 className="text-lg font-bold text-slate-800">Capítulo {nextChapter.id}: {nextChapter.title}</h4>
                     <p className="text-xs text-slate-500 mb-4">Tempo Estimado para Conclusão: 3h 45m</p>
                     <button
                       onClick={() => onSelectChapter(nextChapter.id)}
                       className="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-lg text-sm hover:bg-indigo-700 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                     >
                         Acessar Módulo
                     </button>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-4 relative overflow-hidden mt-6 mb-2">
                    <div className="bg-gradient-to-r from-cyan-400 to-teal-500 h-4 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                </div>
                <p className="text-sm text-slate-600 text-center">Progresso total do método: <strong className="text-slate-800">{percentage}%</strong> concluído</p>
            </div>
        </Card>
    );
};

const ProgressTimelineCard: React.FC<{
    chapters: Chapter[];
    completedChapterIds: Set<number>;
    nextChapter: Chapter;
    onSelectChapter: (id: number) => void;
}> = ({ chapters, completedChapterIds, nextChapter, onSelectChapter }) => {
    return (
        <Card>
            <div className="flex items-center gap-3 px-6 pt-5 pb-2 border-b border-slate-200">
                <Tooltip text="Navegue pelos capítulos e veja seu progresso">
                    <GitBranch className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform duration-200" />
                </Tooltip>
                <h3 className="text-base font-semibold text-slate-800">Jornada de Aprendizagem</h3>
            </div>
            <div className="p-6 pt-4">
                <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-2.5 top-2.5 bottom-2.5 w-0.5 bg-slate-200" />
                    
                    <ul className="space-y-4">
                        {chapters.map(chapter => {
                            const isCompleted = completedChapterIds.has(chapter.id);
                            const isCurrent = chapter.id === nextChapter.id;

                            let statusStyles = {
                                circle: 'bg-white border-slate-300',
                                text: 'text-slate-500 hover:text-slate-800',
                            };

                            if (isCompleted) {
                                statusStyles = {
                                    circle: 'bg-teal-500 border-teal-500',
                                    text: 'text-slate-800 font-medium hover:text-indigo-600',
                                };
                            } else if (isCurrent) {
                                statusStyles = {
                                    circle: 'bg-white border-indigo-600 ring-4 ring-indigo-200',
                                    text: 'text-indigo-600 font-bold',
                                };
                            }
                            
                            return (
                                <li key={chapter.id} className="flex items-center">
                                    <div className={`relative z-10 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all ${statusStyles.circle}`}>
                                        {isCompleted && (
                                            <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                    <button 
                                        onClick={() => onSelectChapter(chapter.id)}
                                        className={`ml-4 flex-1 text-left text-sm transition-colors duration-200 ${statusStyles.text}`}
                                    >
                                        {chapter.shortTitle}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </Card>
    );
};

const LinearProgressBar: React.FC<{ value: number; max: number }> = ({ value, max }) => {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="w-full bg-slate-200 rounded-full h-2">
      <div 
        className="bg-teal-500 h-2 rounded-full transition-all duration-300" 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

const WeeklyGoalsCard: React.FC<{
  goals: WeeklyGoal[];
  onAddGoal: (description: string, target: number) => void;
  onUpdateGoal: (id: string, current: number) => void;
  onDeleteGoal: (id: string) => void;
}> = ({ goals, onAddGoal, onUpdateGoal, onDeleteGoal }) => {
  const [description, setDescription] = useState('');
  const [target, setTarget] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAdd = () => {
    const targetNum = parseInt(target, 10);
    if (description.trim() && !isNaN(targetNum) && targetNum > 0) {
      onAddGoal(description, targetNum);
      setDescription('');
      setTarget('');
      setShowAddForm(false);
    }
  };
  
  const handleCurrentChange = (id: string, value: string, max: number) => {
    let currentNum = parseInt(value, 10);
    if (isNaN(currentNum)) {
        currentNum = 0;
    }
    // Clamp the value between 0 and max
    currentNum = Math.max(0, Math.min(max, currentNum));
    onUpdateGoal(id, currentNum);
  };

  return (
    <Card>
      <CardHeader title="Metas Semanais" icon={Target} tooltipText="Defina e acompanhe suas metas para a semana" />
      <div className="p-4 space-y-3">
        {goals.length === 0 && !showAddForm ? (
          <div className="text-center py-6 px-4">
            <Target className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500 font-medium">Nenhuma meta definida</p>
            <p className="text-xs text-slate-400 mt-1">Clique abaixo para adicionar sua primeira meta semanal.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {goals.map(goal => (
              <div key={goal.id} className="p-3 bg-slate-50 rounded-lg group animate-fadeInUp">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium text-slate-800 flex-1 pr-2">{goal.description}</p>
                  <button onClick={() => onDeleteGoal(goal.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-red-500 rounded-full">
                    <Trash2 className="w-4 h-4"/>
                  </button>
                </div>
                <div className="flex items-center gap-3 mt-2">
                    <input 
                        type="number"
                        value={goal.current.toString()}
                        onChange={(e) => handleCurrentChange(goal.id, e.target.value, goal.target)}
                        className="w-16 p-1 border border-slate-300 rounded-md text-sm text-center focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        aria-label={`Progresso atual para ${goal.description}`}
                    />
                    <span className="text-sm text-slate-500">/ {goal.target}</span>
                    <div className="flex-1">
                        <LinearProgressBar value={goal.current} max={goal.target} />
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showAddForm ? (
          <div className="p-3 bg-slate-100 rounded-lg space-y-2 border border-slate-200 animate-fadeInUp">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição da meta (ex: Ler 5 capítulos)"
              className="w-full p-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="flex gap-2">
              <input
                type="number"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="Alvo (ex: 5)"
                className="w-24 p-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button onClick={handleAdd} className="flex-1 bg-indigo-600 text-white font-semibold text-sm rounded-md hover:bg-indigo-700 transition">Adicionar</button>
              <button onClick={() => setShowAddForm(false)} className="p-2 text-slate-500 hover:bg-slate-200 rounded-md transition">
                <X className="w-5 h-5"/>
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setShowAddForm(true)}
            className="w-full mt-2 flex items-center justify-center gap-2 p-2 border-2 border-dashed border-slate-300 text-slate-500 rounded-lg hover:bg-slate-100 hover:border-slate-400 transition-colors"
          >
            <Plus className="w-4 h-4"/>
            <span className="text-sm font-semibold">Adicionar Nova Meta</span>
          </button>
        )}
      </div>
    </Card>
  );
};

const Badge: React.FC<{ icon: React.FC<any>; label: string; subLabel: string; unlocked: boolean }> = ({ icon: Icon, label, subLabel, unlocked }) => (
    <div className={`text-center transition-opacity ${unlocked ? 'opacity-100' : 'opacity-40'}`}>
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 ${unlocked ? 'bg-yellow-100' : 'bg-slate-100'}`}>
            <Icon className={`w-8 h-8 ${unlocked ? 'text-yellow-500' : 'text-slate-400'}`} />
        </div>
        <p className="text-xs font-semibold text-slate-700">{label}</p>
        <p className="text-xs text-slate-500">{subLabel}</p>
    </div>
);

const BadgesCard: React.FC<{ completedChapterIds: Set<number> }> = ({ completedChapterIds }) => {
    return (
        <Card>
            <CardHeader title="Insígnias e Troféus" icon={Trophy} tooltipText="Colete insígnias por suas conquistas"/>
            <div className="p-6 flex items-start justify-around">
                <Badge icon={BookOpen} label="Leitor Ávido" subLabel="(Capítulo 3)" unlocked={completedChapterIds.has(3)} />
                <Badge icon={Sparkles} label="Idéia Luminosa" subLabel="10 Desafios" unlocked={completedChapterIds.has(5)} />
                <Badge icon={LaurelWreath} label="Mestre da Sabedoria" subLabel="Quiz Perfeito" unlocked={completedChapterIds.has(10)} />
            </div>
        </Card>
    );
};

const ConceptOfTheDayCard: React.FC<{ chapters: Chapter[]; onSelectChapter: (id: number) => void; }> = ({ chapters, onSelectChapter }) => {
    const conceptChapterId = 4;
    const concept = chapters.find(c => c.id === conceptChapterId)?.sections[0].content;
    return (
        <Card>
            <CardHeader 
                title="Conceito do Dia" 
                icon={Quote} 
                tooltipText="Receba uma nova ideia ou conceito para refletir a cada dia"
            />
            <div className="p-6">
                <blockquote className="border-l-4 border-indigo-200 pl-4 italic text-slate-600 text-base">
                    "{concept}"
                </blockquote>
                <div className="text-center mt-4">
                     <button 
                        onClick={() => onSelectChapter(conceptChapterId)}
                        className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                        Revisitar Conceito &rarr;
                    </button>
                </div>
            </div>
        </Card>
    )
};

const FriendsCard: React.FC = () => (
    <Card>
        <CardHeader title="Amigos/Conexões" icon={Users} tooltipText="Veja o progresso de seus amigos e conecte-se"/>
        <div className="p-6 flex items-center justify-around space-x-4">
            <div className="text-center">
                <img src="https://i.pravatar.cc/64?img=1" alt="Marie" className="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-white shadow"/>
                <p className="text-sm font-semibold text-slate-700">Marie</p>
                <div className="w-20 bg-slate-200 rounded-full h-1.5 mt-1"><div className="bg-teal-500 h-1.5 rounded-full" style={{width: '60%'}}></div></div>
            </div>
             <div className="text-center">
                <img src="https://i.pravatar.cc/100?u=joao" alt="João" className="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-white shadow"/>
                <p className="text-sm font-semibold text-slate-700">João</p>
                <div className="w-20 bg-slate-200 rounded-full h-1.5 mt-1"><div className="bg-teal-500 h-1.5 rounded-full" style={{width: '88%'}}></div></div>
            </div>
        </div>
    </Card>
);

const ResourcesCard: React.FC<{
  notes: Note[];
  onAddNote: (content: string) => void;
  onEditNote: (id: string, content: string) => void;
  onDeleteNote: (id: string) => void;
}> = ({ notes, onAddNote, onEditNote, onDeleteNote }) => {
    const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);

    return (
        <Card>
            <CardHeader title="Biblioteca de Recursos" icon={FileText} tooltipText="Acesse materiais de apoio, resumos e notas"/>
            <div className="p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <button className="flex flex-col items-center text-center p-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <FileText className="w-6 h-6 text-slate-600 mb-1" />
                    <span className="text-xs text-slate-700 font-medium">Resumos</span>
                </button>
                 <button className="flex flex-col items-center text-center p-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <Compass className="w-6 h-6 text-slate-600 mb-1" />
                    <span className="text-xs text-slate-700 font-medium">Mapas Mentais</span>
                </button>
                 <button className="flex flex-col items-center text-center p-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <CheckSquare className="w-6 h-6 text-slate-600 mb-1" />
                    <span className="text-xs text-slate-700 font-medium">Flashcards</span>
                </button>
                 <button className="flex flex-col items-center text-center p-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <Sparkles className="w-6 h-6 text-slate-600 mb-1" />
                    <span className="text-xs text-slate-700 font-medium">Quizes</span>
                </button>
                <button 
                    onClick={() => setIsNotesModalOpen(true)}
                    className="flex flex-col items-center text-center p-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <Pencil className="w-6 h-6 text-slate-600 mb-1" />
                    <span className="text-xs text-slate-700 font-medium">Bloco de Notas</span>
                </button>
            </div>
            <div className="px-6 pb-6 space-y-3">
                <button className="w-full text-left p-3 bg-slate-100 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-200 transition">Capítulo 1: Introdução (Concluído)</button>
                <button className="w-full text-left p-3 bg-cyan-500 text-white rounded-lg text-sm font-bold hover:bg-cyan-600 transition shadow">Quizes 3: Técnicas Novo!</button>
            </div>
            <NotesModal
                isOpen={isNotesModalOpen}
                onClose={() => setIsNotesModalOpen(false)}
                notes={notes}
                onAddNote={onAddNote}
                onEditNote={onEditNote}
                onDeleteNote={onDeleteNote}
            />
        </Card>
    );
};

const FavoritesCard: React.FC<{
    chapters: Chapter[];
    favoriteChapterIds: Set<number>;
    onSelectChapter: (id: number) => void;
    onToggleFavorite: (id: number) => void;
}> = ({ chapters, favoriteChapterIds, onSelectChapter, onToggleFavorite }) => {
    const favoriteChapters = chapters.filter(c => favoriteChapterIds.has(c.id));

    return (
        <Card>
            <CardHeader title="Meus Favoritos" icon={Bookmark} tooltipText="Acesse rapidamente seus capítulos favoritos" />
            <div className="p-4 space-y-2">
                {favoriteChapters.length > 0 ? (
                    favoriteChapters.map(chapter => (
                        <div key={chapter.id} className="group flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                            <button 
                                onClick={() => onSelectChapter(chapter.id)} 
                                className="flex-1 text-left flex items-center space-x-3"
                            >
                                {chapter.icon && <chapter.icon className="w-5 h-5 text-indigo-500 flex-shrink-0" />}
                                <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">
                                    {chapter.shortTitle}
                                </span>
                            </button>
                            <button 
                                onClick={() => onToggleFavorite(chapter.id)}
                                className="p-1 rounded-full text-yellow-500 opacity-80 group-hover:opacity-100 hover:bg-yellow-100 transition-opacity"
                                aria-label={`Remover ${chapter.shortTitle} dos favoritos`}
                            >
                                <Bookmark className="w-5 h-5 fill-current" />
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-6 px-4">
                        <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm text-slate-500 font-medium">Nenhum favorito ainda</p>
                        <p className="text-xs text-slate-400 mt-1">Clique no ícone de marcador em um capítulo para adicioná-lo aqui.</p>
                    </div>
                )}
            </div>
        </Card>
    );
};

const TaskManagementCard: React.FC<{
    tasks: Task[];
    onAddTask: (text: string) => void;
    onToggleTask: (id: string) => void;
    onDeleteTask: (id: string) => void;
    onSetTaskReminder: (id: string, reminder: string | null) => void;
}> = ({ tasks, onAddTask, onToggleTask, onDeleteTask, onSetTaskReminder }) => {
    const [newTaskText, setNewTaskText] = useState('');
    const [editingReminderFor, setEditingReminderFor] = useState<string | null>(null);
    const [reminderValue, setReminderValue] = useState('');

    const handleAdd = () => {
        onAddTask(newTaskText);
        setNewTaskText('');
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleAdd();
        }
    };

    const handleOpenReminderEditor = (task: Task) => {
        setEditingReminderFor(task.id);
        const now = new Date();
        const reminderDate = task.reminder ? new Date(task.reminder) : new Date(now.getTime() + 60 * 60 * 1000); // Default to 1 hour from now
        
        if (reminderDate < now) {
          reminderDate.setTime(now.getTime() + 60 * 60 * 1000);
        }

        const timezoneOffset = reminderDate.getTimezoneOffset() * 60000;
        const localDate = new Date(reminderDate.getTime() - timezoneOffset);
        setReminderValue(localDate.toISOString().slice(0, 16));
    };

    const handleSaveReminder = () => {
        if (editingReminderFor && reminderValue) {
            onSetTaskReminder(editingReminderFor, new Date(reminderValue).toISOString());
        }
        setEditingReminderFor(null);
    };

    const handleRemoveReminder = () => {
        if(editingReminderFor) {
            onSetTaskReminder(editingReminderFor, null);
        }
        setEditingReminderFor(null);
    };
    
    const formatReminder = (dateString?: string | null) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    };

    const getMinDateTime = () => {
        const now = new Date();
        const timezoneOffset = now.getTimezoneOffset() * 60000;
        const localDate = new Date(now.getTime() - timezoneOffset);
        return localDate.toISOString().slice(0, 16);
    };

    return (
        <Card>
            <CardHeader title="Minhas Tarefas" icon={CheckSquare} tooltipText="Gerencie suas tarefas e pendências"/>
            <div className="p-4 space-y-3">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={newTaskText}
                        onChange={(e) => setNewTaskText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Adicionar nova tarefa..."
                        className="flex-1 p-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
                        aria-label="Nova tarefa"
                    />
                    <button
                        onClick={handleAdd}
                        disabled={!newTaskText.trim()}
                        className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition"
                        aria-label="Adicionar Tarefa"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {tasks.length === 0 ? (
                        <p className="text-sm text-slate-500 text-center py-4">Nenhuma tarefa por aqui.</p>
                    ) : (
                        tasks.map(task => (
                            <div key={task.id} className="group p-2 rounded-md hover:bg-slate-50 relative">
                                <div className="flex items-start">
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => onToggleTask(task.id)}
                                        id={`task-${task.id}`}
                                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer mt-1"
                                    />
                                    <div className="ml-3 flex-1">
                                      <label htmlFor={`task-${task.id}`} className={`text-sm cursor-pointer ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                                          {task.text}
                                      </label>
                                      {task.reminder && !task.completed && (
                                        <div className="flex items-center space-x-1 text-xs text-indigo-600 mt-1">
                                          <Clock className="w-3 h-3"/>
                                          <span>{formatReminder(task.reminder)}</span>
                                        </div>
                                      )}
                                    </div>
                                    <div className="ml-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      {!task.completed && (
                                        <button 
                                          onClick={() => handleOpenReminderEditor(task)}
                                          className={`p-1 rounded-full ${task.reminder ? 'text-indigo-600' : 'text-slate-400'} hover:bg-slate-200`}
                                          aria-label="Definir lembrete"
                                        >
                                            <Bell className="w-4 h-4" />
                                        </button>
                                      )}
                                      <button 
                                        onClick={() => onDeleteTask(task.id)}
                                        className="p-1 text-slate-400 hover:text-red-500 rounded-full hover:bg-slate-200"
                                        aria-label="Excluir tarefa"
                                      >
                                          <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                </div>

                                {editingReminderFor === task.id && (
                                    <div className="mt-2 p-3 bg-white border border-slate-300 rounded-lg shadow-lg space-y-3 animate-fadeInUp">
                                        <label className="text-sm font-medium text-slate-700 block">Definir Lembrete</label>
                                        <input
                                            type="datetime-local"
                                            value={reminderValue}
                                            onChange={(e) => setReminderValue(e.target.value)}
                                            min={getMinDateTime()}
                                            className="w-full p-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
                                        />
                                        <div className="flex justify-end items-center space-x-2">
                                            {task.reminder && (
                                                <button onClick={handleRemoveReminder} className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md transition font-semibold">Remover</button>
                                            )}
                                            <button onClick={() => setEditingReminderFor(null)} className="px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 rounded-md transition">Cancelar</button>
                                            <button onClick={handleSaveReminder} className="px-3 py-1 text-sm bg-indigo-600 text-white hover:bg-indigo-700 rounded-md transition font-semibold">Salvar</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </Card>
    );
};


// --- Main Dashboard Component ---

interface DashboardProps {
    chapters: Chapter[];
    completedChapterIds: Set<number>;
    nextChapter: Chapter;
    onSelectChapter: (id: number) => void;
    notes: Note[];
    onAddNote: (content: string) => void;
    onEditNote: (id: string, content: string) => void;
    onDeleteNote: (id: string) => void;
    tasks: Task[];
    onAddTask: (text: string) => void;
    onToggleTask: (id: string) => void;
    onDeleteTask: (id: string) => void;
    onSetTaskReminder: (id: string, reminder: string | null) => void;
    favoriteChapterIds: Set<number>;
    onToggleFavorite: (id: number) => void;
    weeklyGoals: WeeklyGoal[];
    onAddWeeklyGoal: (description: string, target: number) => void;
    onUpdateWeeklyGoal: (id: string, current: number) => void;
    onDeleteWeeklyGoal: (id: string) => void;
    adminSettings: {
        socialModuleEnabled: boolean;
    };
    mainColumnWidgetOrder: string[];
    sidebarColumnWidgetOrder: string[];
    widgetTiers: Record<string, UserTier>;
    userTier: UserTier;
    onUpgradeClick: () => void;
}

export const Dashboard: React.FC<DashboardProps> = (props) => {
  const { 
    adminSettings, 
    mainColumnWidgetOrder, 
    sidebarColumnWidgetOrder,
    widgetTiers,
    userTier,
    onUpgradeClick,
    ...rest
  } = props;

  const tierOrder: Record<UserTier, number> = { 'Grátis': 0, 'Essencial': 1, 'Completo': 2 };
  const hasAccess = (requiredTier: UserTier) => tierOrder[userTier] >= tierOrder[requiredTier];

  const widgetNames: Record<string, string> = {
        currentStatus: "Seu Próximo Passo",
        concept: "Conceito do Dia",
        resources: "Biblioteca de Recursos",
        timeline: "Jornada de Aprendizagem",
        tasks: "Minhas Tarefas",
        weeklyGoals: "Metas Semanais",
        badges: "Insígnias e Troféus",
        friends: "Amigos/Conexões",
        favorites: "Meus Favoritos",
        quoteOfTheDay: "Citação do Dia",
        focusTimer: "Bloco de Foco",
        activitySummary: "Resumo de Atividades",
        calendar: "Calendário",
  };

  const allWidgets: Record<string, React.ReactNode> = {
      currentStatus: <CurrentStatusCard chapters={rest.chapters} completedChapterIds={rest.completedChapterIds} nextChapter={rest.nextChapter} onSelectChapter={rest.onSelectChapter} />,
      concept: <ConceptOfTheDayCard chapters={rest.chapters} onSelectChapter={rest.onSelectChapter} />,
      resources: <ResourcesCard notes={rest.notes} onAddNote={rest.onAddNote} onEditNote={rest.onEditNote} onDeleteNote={rest.onDeleteNote} />,
      timeline: <ProgressTimelineCard chapters={rest.chapters} completedChapterIds={rest.completedChapterIds} nextChapter={rest.nextChapter} onSelectChapter={rest.onSelectChapter} />,
      tasks: <TaskManagementCard tasks={rest.tasks} onAddTask={rest.onAddTask} onToggleTask={rest.onToggleTask} onDeleteTask={rest.onDeleteTask} onSetTaskReminder={rest.onSetTaskReminder} />,
      weeklyGoals: <WeeklyGoalsCard goals={rest.weeklyGoals} onAddGoal={rest.onAddWeeklyGoal} onUpdateGoal={rest.onUpdateWeeklyGoal} onDeleteGoal={rest.onDeleteWeeklyGoal} />,
      badges: <BadgesCard completedChapterIds={rest.completedChapterIds} />,
      friends: <FriendsCard />,
      favorites: <FavoritesCard chapters={rest.chapters} favoriteChapterIds={rest.favoriteChapterIds} onSelectChapter={rest.onSelectChapter} onToggleFavorite={rest.onToggleFavorite} />,
      quoteOfTheDay: <QuoteOfTheDayCard />,
      focusTimer: <FocusTimerCard />,
      activitySummary: <ActivitySummaryCard tasks={rest.tasks} weeklyGoals={rest.weeklyGoals} notes={rest.notes} />,
      calendar: <CalendarCard tasks={rest.tasks} weeklyGoals={rest.weeklyGoals} />,
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full animate-fadeInUp">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          <StatsGrid 
            chapters={rest.chapters}
            completedChapterIds={rest.completedChapterIds}
            notes={rest.notes}
            tasks={rest.tasks}
            nextChapter={rest.nextChapter}
          />
          {mainColumnWidgetOrder.map(widgetId => {
            const requiredTier = widgetTiers[widgetId] || 'Grátis';
            if (hasAccess(requiredTier)) {
                return <div key={widgetId}>{allWidgets[widgetId]}</div>;
            }
            return <LockedWidgetPreview key={widgetId} title={widgetNames[widgetId]} requiredTier={requiredTier} onUpgradeClick={onUpgradeClick} />;
          })}
        </div>
        
        {/* Right Sidebar Column */}
        <div className="space-y-6">
          {sidebarColumnWidgetOrder.map(widgetId => {
              if (widgetId === 'friends' && !adminSettings.socialModuleEnabled) {
                  return null;
              }
              const requiredTier = widgetTiers[widgetId] || 'Grátis';
              if (hasAccess(requiredTier)) {
                  return allWidgets[widgetId] ? <div key={widgetId}>{allWidgets[widgetId]}</div> : null;
              }
              return <LockedWidgetPreview key={widgetId} title={widgetNames[widgetId]} requiredTier={requiredTier} onUpgradeClick={onUpgradeClick} />;
          })}
        </div>
        
      </div>
    </div>
  );
};