
import React from 'react';
import type { Chapter, UserTier } from '../types';
import { LockClosed, CheckCircle } from './Icons';
import { tierInfo } from '../constants';

const tierDisplayData: Record<UserTier, { features: string[]; borderColor: string; headerBg: string; }> = {
    'Grátis': {
        features: ['Diagnóstico inicial e fundamentos', 'Aprenda a aceitar a realidade', 'Domine a arte de errar melhor'],
        borderColor: 'border-slate-300',
        headerBg: 'bg-slate-50',
    },
    'Essencial': {
        features: ['Tudo do plano Grátis', 'O núcleo do Método MPC em ação', 'Estratégias como TAE e 80/20', 'Construa autoridade autêntica'],
        borderColor: 'border-indigo-500',
        headerBg: 'bg-indigo-50',
    },
    'Completo': {
        features: ['Tudo do plano Essencial', 'Conceitos avançados como Antifragilidade', 'Semana intensiva de prática guiada', 'Integração do método para a vida'],
        borderColor: 'border-purple-500',
        headerBg: 'bg-purple-50',
    }
};

interface PlansProps {
  chapters: Chapter[];
  onSelectChapter: (id: number) => void;
  hasAccess: (tier: UserTier) => boolean;
  onUpgradeClick: () => void;
}

export const Plans: React.FC<PlansProps> = ({ chapters, onSelectChapter, hasAccess, onUpgradeClick }) => {
    
    const chaptersByTier = chapters.reduce((acc, chapter) => {
        if (!acc[chapter.tier]) {
            acc[chapter.tier] = [];
        }
        acc[chapter.tier].push(chapter);
        return acc;
    }, {} as Record<UserTier, Chapter[]>);

    const tierOrder: UserTier[] = ['Grátis', 'Essencial', 'Completo'];

    return (
        <div className="p-4 sm:p-6 lg:p-8 w-full animate-fadeInUp">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                     <h2 className="text-3xl font-bold text-slate-800">Estrutura do Método</h2>
                     <p className="mt-2 text-lg text-slate-600 max-w-2xl mx-auto">
                        Uma visão completa de todos os módulos, organizados por plano de acesso.
                     </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {tierOrder.map((tier) => {
                        const tierData = tierInfo[tier];
                        const displayData = tierDisplayData[tier];
                        const tierChapters = chaptersByTier[tier] || [];
                        const userCanAccessTier = hasAccess(tier);

                        return (
                            <div key={tier} className={`h-full flex flex-col bg-white rounded-xl shadow-lg border-2 transition-all duration-300 ${displayData.borderColor}`}>
                                <div className={`p-6 rounded-t-lg ${displayData.headerBg}`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <tierData.Icon className={`w-8 h-8 ${tierData.color}`} />
                                        <h3 className={`text-2xl font-bold ${tierData.color}`}>{tierData.name}</h3>
                                    </div>
                                    <ul className="space-y-2 text-sm">
                                        {displayData.features.map(feature => (
                                            <li key={feature} className="flex items-start gap-2">
                                                <CheckCircle className="w-5 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                                <span className="text-slate-600">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="p-4 flex-1 flex flex-col">
                                    <div className="space-y-2 flex-1">
                                        {tierChapters.map(chapter => (
                                            <button 
                                                key={chapter.id}
                                                onClick={() => userCanAccessTier ? onSelectChapter(chapter.id) : onUpgradeClick()}
                                                className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors duration-200 ${
                                                    userCanAccessTier 
                                                    ? 'hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-400'
                                                    : 'opacity-70 hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-400'
                                                }`}
                                            >
                                                {chapter.icon && <chapter.icon className={`w-5 h-5 flex-shrink-0 ${userCanAccessTier ? 'text-indigo-600' : 'text-slate-400'}`} />}
                                                <span className={`flex-1 font-medium ${userCanAccessTier ? 'text-slate-700' : 'text-slate-500'}`}>
                                                    {chapter.shortTitle}
                                                </span>
                                                {!userCanAccessTier && <LockClosed className="w-4 h-4 text-yellow-600 flex-shrink-0" />}
                                            </button>
                                        ))}
                                    </div>
                                    
                                    {!userCanAccessTier && (
                                        <div className="mt-auto pt-4">
                                            <button 
                                                onClick={onUpgradeClick}
                                                className="w-full text-center py-2 px-4 rounded-lg font-semibold text-sm bg-yellow-400 text-yellow-900 hover:bg-yellow-500 transition-colors shadow"
                                            >
                                                Desbloquear Plano {tierData.name}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
