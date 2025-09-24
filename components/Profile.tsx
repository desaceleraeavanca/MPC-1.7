import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { UserProfile, Chapter, Task, WeeklyGoal, Note, UserTier } from '../types';
import { User, Award, ShieldCheck, AlertTriangle, Pencil, CheckCircle, X, Gift, Gem, Crown } from './Icons';
import { tierInfo } from '../constants';

// --- Reusable Components for this page ---

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm ${className}`}>{children}</div>
);

const CardHeader: React.FC<{ title: string; icon: React.FC<any>; }> = ({ title, icon: Icon }) => (
  <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-200">
    <Icon className="w-5 h-5 text-indigo-600" />
    <h3 className="text-base font-semibold text-slate-800 m-0">{title}</h3>
  </div>
);

const StatBox: React.FC<{ value: string | number; label: string }> = ({ value, label }) => (
    <div className="bg-slate-50 p-4 rounded-lg text-center border border-slate-200">
        <p className="text-2xl font-bold text-indigo-600">{value}</p>
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{label}</p>
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


interface ProfileProps {
    user: UserProfile;
    onUpdateUser: (user: UserProfile) => void;
    chapters: Chapter[];
    completedChapterIds: Set<number>;
    tasks: Task[];
    weeklyGoals: WeeklyGoal[];
    notes: Note[];
    userTier: UserTier;
    onUpgradeClick: () => void;
    onDeleteAccount: () => void;
}

export const Profile: React.FC<ProfileProps> = ({
    user,
    onUpdateUser,
    chapters,
    completedChapterIds,
    tasks,
    weeklyGoals,
    notes,
    userTier,
    onUpgradeClick,
    onDeleteAccount
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<UserProfile>(user);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onUpdateUser(formData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData(user);
        setIsEditing(false);
    };

    // Calculate progress stats
    const totalChapters = chapters.length;
    const completedChapters = completedChapterIds.size;
    const progressPercentage = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;
    const completedTasks = tasks.filter(t => t.completed).length;
    const completedGoals = weeklyGoals.filter(g => g.current >= g.target).length;
    const totalNotes = notes.length;

    const currentTierInfo = tierInfo[userTier];

    return (
        <div className="p-4 sm:p-6 lg:p-8 w-full">
            <div className="max-w-4xl mx-auto space-y-8 animate-fadeInUp">
                {/* Profile Details Card */}
                <Card>
                    <CardHeader title="Detalhes do Perfil" icon={User} />
                    <div className="p-6">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            <img src={formData.avatarUrl} alt="Avatar do usuário" className="w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-md flex-shrink-0" />
                            <div className="flex-1 w-full">
                                {isEditing ? (
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="name" className="text-sm font-medium text-slate-600">Nome</label>
                                            <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="w-full mt-1 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500" />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="text-sm font-medium text-slate-600">Email</label>
                                            <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full mt-1 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500" />
                                        </div>
                                        <div>
                                            <label htmlFor="avatarUrl" className="text-sm font-medium text-slate-600">URL do Avatar</label>
                                            <input type="text" id="avatarUrl" name="avatarUrl" value={formData.avatarUrl} onChange={handleInputChange} className="w-full mt-1 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500" />
                                        </div>
                                        <div className="flex justify-end space-x-2 pt-2">
                                            <button onClick={handleCancel} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md transition font-semibold">Cancelar</button>
                                            <button onClick={handleSave} className="px-4 py-2 text-sm bg-indigo-600 text-white hover:bg-indigo-700 rounded-md transition font-semibold">Salvar</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
                                        <p className="text-slate-500">{user.email}</p>
                                        <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-md transition font-semibold">
                                            <Pencil className="w-4 h-4" />
                                            Editar Perfil
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Progress Overview Card */}
                <Card>
                    <CardHeader title="Visão Geral do Progresso" icon={Award} />
                    <div className="p-6 space-y-6">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium text-slate-600">Progresso Geral</span>
                                <span className="text-sm font-bold text-indigo-600">{progressPercentage}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-4 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatBox value={completedChapters} label="Módulos Concluídos" />
                            <StatBox value={completedTasks} label="Tarefas Realizadas" />
                            <StatBox value={completedGoals} label="Metas Atingidas" />
                            <StatBox value={totalNotes} label="Notas Criadas" />
                        </div>
                    </div>
                </Card>

                {/* Account Management Card */}
                <Card>
                    <CardHeader title="Gerenciamento da Conta" icon={ShieldCheck} />
                    <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-4">
                            <p className="text-sm text-slate-600">Seu plano atual:</p>
                            <div className="flex items-center space-x-2 bg-slate-100 border border-slate-200 rounded-full px-3 py-1.5 text-sm font-semibold text-slate-700">
                                <currentTierInfo.Icon className={`w-4 h-4 ${currentTierInfo.color}`} />
                                <span>{currentTierInfo.name}</span>
                            </div>
                        </div>
                        <button 
                            onClick={onUpgradeClick}
                            className="px-5 py-2 text-sm bg-indigo-600 text-white hover:bg-indigo-700 rounded-md transition font-semibold shadow-sm"
                        >
                            Ver Planos de Upgrade
                        </button>
                    </div>
                </Card>

                {/* Danger Zone */}
                <Card className="border border-red-200 bg-red-50/50">
                    <div className="flex items-center gap-3 px-6 py-4 border-b border-red-200">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <h3 className="text-base font-semibold text-red-800 m-0">Zona de Perigo</h3>
                    </div>
                    <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div>
                            <h4 className="font-semibold text-red-900">Excluir sua conta</h4>
                            <p className="text-sm text-red-700 mt-1">Esta ação é irreversível. Todos os seus dados, progresso e notas serão permanentemente removidos.</p>
                        </div>
                        <button 
                          onClick={() => setIsConfirmModalOpen(true)}
                          className="px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 rounded-md transition font-semibold shadow-sm flex-shrink-0"
                        >
                            Excluir Conta
                        </button>
                    </div>
                </Card>
            </div>

            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={() => {
                    setIsConfirmModalOpen(false);
                    onDeleteAccount();
                }}
                title="Confirmar Exclusão de Conta"
                confirmButtonText="Sim, Excluir Minha Conta"
                confirmButtonVariant="danger"
            >
                <p>
                    Tem certeza que deseja excluir sua conta permanentemente? 
                    <strong className="text-slate-900"> Todos os seus dados, incluindo progresso, notas e tarefas, serão perdidos.</strong> 
                    Esta ação não pode ser desfeita.
                </p>
            </ConfirmationModal>
        </div>
    );
};
