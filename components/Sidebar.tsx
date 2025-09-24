
import React from 'react';
import type { Chapter, SearchResult, UserTier } from '../types';
import { PluralsLogo, CheckCircle, Search, LockClosed, Rocket, Trophy } from './Icons';
import { Highlight } from './Highlight';

interface SidebarProps {
  chapters: Chapter[];
  activeChapterId: number;
  onSelectChapter: (id: number) => void;
  completedChapterIds: Set<number>;
  searchQuery: string;
  searchResults: SearchResult[];
  onSearchChange: (query: string) => void;
  hasAccess: (tier: UserTier) => boolean;
  onGoHome: () => void;
  userTier: UserTier;
  isUpgradeBannerHidden: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  chapters, 
  activeChapterId, 
  onSelectChapter, 
  completedChapterIds,
  searchQuery,
  searchResults,
  onSearchChange,
  hasAccess,
  onGoHome,
  userTier,
  isUpgradeBannerHidden
}) => {
  const showSearchResults = searchQuery.trim().length >= 3;

  const renderUpgradeBanner = () => {
    if (isUpgradeBannerHidden && userTier !== 'Completo') {
        return null;
    }
    if (userTier === 'Completo' && isUpgradeBannerHidden) {
        return null;
    }
    switch (userTier) {
      case 'Grátis':
        return (
          <div className="bg-gradient-to-br from-indigo-700 to-indigo-800 p-5 rounded-lg text-center space-y-3">
            <div className="w-12 h-12 bg-indigo-900/50 rounded-lg flex items-center justify-center mx-auto ring-2 ring-indigo-600/50">
              <LockClosed className="w-6 h-6 text-white"/>
            </div>
            <h3 className="font-bold text-white">Upgrade para Essencial</h3>
            <p className="text-xs text-indigo-200">Desbloqueie os métodos principais e exercícios práticos.</p>
            <button
                onClick={() => onSelectChapter(-1)} // Use a non-existent ID to trigger upgrade modal
                className="w-full bg-white text-indigo-800 font-bold py-2.5 rounded-lg text-sm hover:bg-indigo-100 transition-all shadow-md">
                Fazer Upgrade Agora
            </button>
          </div>
        );
      case 'Essencial':
        return (
          <div className="bg-gradient-to-br from-purple-700 to-purple-800 p-5 rounded-lg text-center space-y-3">
            <div className="w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center mx-auto ring-2 ring-purple-600/50">
              <Rocket className="w-6 h-6 text-white"/>
            </div>
            <h3 className="font-bold text-white">Vá para o plano Completo</h3>
            <p className="text-xs text-purple-200">Acesse conteúdo avançado e a semana intensiva.</p>
            <button
                onClick={() => onSelectChapter(-1)} // Use a non-existent ID to trigger upgrade modal
                className="w-full bg-white text-purple-800 font-bold py-2.5 rounded-lg text-sm hover:bg-purple-100 transition-all shadow-md">
                Fazer Upgrade Agora
            </button>
          </div>
        );
      case 'Completo':
         return (
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-5 rounded-lg text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-800/50 rounded-lg flex items-center justify-center mx-auto ring-2 ring-emerald-500/50">
                <Trophy className="w-6 h-6 text-white"/>
            </div>
            <h3 className="font-bold text-white">Você tem Acesso Total!</h3>
            <p className="text-xs text-emerald-200">Aproveite todos os recursos e capítulos do método.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <aside className="w-72 bg-indigo-900 text-white flex flex-col flex-shrink-0 overflow-y-auto">
      <div className="p-6 border-b border-indigo-800/50 space-y-4">
        <button onClick={onGoHome} className="w-full text-left flex items-center space-x-3 p-2 -m-2 rounded-lg hover:bg-indigo-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500" aria-label="Ir para a página inicial">
            <div className="bg-white p-2 rounded-lg shadow">
              <PluralsLogo className="w-6 h-6 text-indigo-700" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Plurals</h1>
              <p className="text-xs text-indigo-300">Método Produtividade</p>
            </div>
        </button>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3" aria-hidden="true">
            <Search className="w-5 h-5 text-indigo-400" />
          </span>
          <input
            type="search"
            aria-label="Pesquisar conteúdo"
            placeholder="Pesquisar..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-indigo-800 border border-indigo-700 text-white placeholder-indigo-400 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>
      </div>

      <nav className="flex-1 p-3">
        {showSearchResults ? (
           <div className="space-y-1">
            {searchResults.length > 0 ? (
              searchResults.map((result, index) => (
                <button
                  key={`result-${result.chapterId}-${index}`}
                  onClick={() => onSelectChapter(result.chapterId)}
                  className="w-full text-left px-3 py-2.5 rounded-md text-sm transition-all duration-200 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                >
                  <div className="font-semibold text-white flex items-center justify-between">
                    <span>{result.chapterTitle}</span>
                    {result.isLocked && <LockClosed className="w-4 h-4 text-yellow-400 flex-shrink-0" />}
                  </div>
                  <div className="text-xs text-indigo-300 mt-1 leading-snug">
                    <Highlight text={result.snippet} highlight={searchQuery} />
                  </div>
                </button>
              ))
            ) : (
              <div className="px-3 py-2.5 text-sm text-indigo-300 italic text-center">
                Nenhum resultado encontrado.
              </div>
            )}
          </div>
        ) : (
           <div className="space-y-1.5">
              {chapters.map((chapter) => {
                const canAccess = hasAccess(chapter.tier);
                return (
                  <button
                    key={chapter.id}
                    onClick={() => onSelectChapter(chapter.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 relative ${
                      activeChapterId === chapter.id && canAccess
                        ? 'bg-indigo-700/80 text-white font-semibold'
                        : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
                    } ${!canAccess ? 'opacity-60 cursor-pointer' : ''}`}
                  >
                    {activeChapterId === chapter.id && canAccess && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-full" />
                    )}
                    <div className="flex items-center space-x-3">
                        {chapter.icon && <chapter.icon className="w-5 h-5 flex-shrink-0 opacity-80" />}
                        <span className="flex-1 truncate">{chapter.shortTitle}</span>
                        {canAccess ? (
                            completedChapterIds.has(chapter.id) && (
                                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                            )
                        ) : (
                            <LockClosed className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                        )}
                    </div>
                  </button>
                );
              })}
            </div>
        )}
      </nav>

       <div className="p-4 mt-auto">
          {renderUpgradeBanner()}
      </div>
    </aside>
  );
};
