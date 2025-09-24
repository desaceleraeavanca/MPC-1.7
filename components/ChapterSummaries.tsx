

import React from 'react';
import type { Chapter, UserTier } from '../types';
import { LockClosed, Rocket, BookOpen } from './Icons';
import { tierInfo } from '../constants';

// Helper to find the objective
const getChapterObjective = (chapter: Chapter): string => {
    const objectiveSection = chapter.sections.find(s => s.type === 'objective');
    return objectiveSection?.content || 'Nenhum objetivo definido para este módulo.';
};

interface ChapterSummariesProps {
  chapters: Chapter[];
  onSelectChapter: (id: number) => void;
  hasAccess: (tier: UserTier) => boolean;
  onUpgradeClick: () => void;
}

export const ChapterSummaries: React.FC<ChapterSummariesProps> = ({ chapters, onSelectChapter, hasAccess, onUpgradeClick }) => {
    return (
        <div className="p-4 sm:p-6 lg:p-8 w-full animate-fadeInUp">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                     <h2 className="text-3xl font-bold text-slate-800">Resumo dos Módulos</h2>
                     <p className="mt-2 text-lg text-slate-600 max-w-2xl mx-auto">
                        Uma visão geral de cada módulo, seus objetivos e o que você aprenderá.
                     </p>
                </div>
                <div className="space-y-6">
                    {chapters.map((chapter) => {
                        const canAccess = hasAccess(chapter.tier);
                        const { Icon: TierIcon, color } = tierInfo[chapter.tier];
                        return (
                             <div key={chapter.id} className="bg-white rounded-xl shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg">
                                <div className="p-6">
                                    <div className="flex items-start gap-5">
                                        {chapter.icon && (
                                            <div className="flex-shrink-0 w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center">
                                                <chapter.icon className="w-8 h-8 text-indigo-600" />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mb-2">
                                                <h3 className="text-xl font-bold text-slate-800">{chapter.title}</h3>
                                                <div className="inline-flex items-center space-x-2 bg-slate-100 border border-slate-200 rounded-full px-3 py-1 text-sm font-semibold text-slate-700">
                                                    <TierIcon className={`w-4 h-4 ${color}`} />
                                                    <span>{chapter.tier}</span>
                                                </div>
                                            </div>
                                            <p className="text-slate-600 text-base leading-relaxed">
                                                {getChapterObjective(chapter)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-slate-200 px-6 py-4 flex justify-end">
                                    {canAccess ? (
                                        <button 
                                            onClick={() => onSelectChapter(chapter.id)}
                                            className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md"
                                        >
                                            <BookOpen className="w-5 h-5" />
                                            <span>Acessar Módulo</span>
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={onUpgradeClick}
                                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-2 px-5 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 text-sm"
                                        >
                                            <Rocket className="w-4 h-4"/>
                                            <span>Fazer Upgrade</span>
                                        </button>
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
