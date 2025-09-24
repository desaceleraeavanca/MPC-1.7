import React, { useMemo } from 'react';
import type { Chapter, ChecklistItem, ExerciseStep, FormInput, UserTier } from '../types';
import { CHAPTER_COMPLETION_REQUIREMENTS } from '../constants';
import { CheckCircle, Bookmark, LockClosed, Rocket } from './Icons';

// --- HELPER COMPONENTS ---

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => <input {...props} className={`w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white text-slate-900 ${className || ''}`} />;
const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className, ...props }) => <textarea {...props} rows={2} className={`w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white text-slate-900 ${className || ''}`} />;
const Checkbox: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => <input type="checkbox" {...props} className={`h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer bg-white ${className || ''}`} />;
const P: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => <p className={`mb-4 text-base leading-relaxed text-slate-600 ${className || ''}`.trim()}>{children}</p>;
const Blockquote: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => <blockquote className={`border-l-4 border-indigo-500 pl-4 italic text-slate-600 my-6 py-2 ${className || ''}`.trim()}>{children}</blockquote>;

// --- DYNAMIC FORM FIELD RENDERER ---

const FormField: React.FC<{ input: FormInput; formData: any; handleInputChange: (e: any) => void; }> = ({ input, formData, handleInputChange }) => {
  const commonProps = {
    name: input.name,
    onChange: handleInputChange,
    'aria-label': input.label,
  };

  if (input.type === 'checkbox') {
    return (
      <div className="flex items-center space-x-2 mt-2">
        <Checkbox {...commonProps} id={input.name} checked={!!formData[input.name]} />
        <label htmlFor={input.name} className="text-sm text-slate-700 cursor-pointer" dangerouslySetInnerHTML={{ __html: input.label }} />
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {input.label && <label className="text-sm font-medium text-slate-700 block" dangerouslySetInnerHTML={{ __html: input.label }} />}
      {input.subText && <p className="text-xs text-slate-500 !mb-1 italic" dangerouslySetInnerHTML={{ __html: input.subText }} />}
      
      {input.type === 'textarea' ? (
        <Textarea {...commonProps} value={formData[input.name] || ''} placeholder={input.placeholder} rows={input.rows || 2} />
      ) : (
        <Input {...commonProps} value={formData[input.name] || ''} type={input.type} min={input.min} max={input.max} placeholder={input.placeholder} className={input.className} />
      )}
    </div>
  );
};

// --- NEW INTERACTIVE COMPONENTS ---

const SectionContainer: React.FC<{ title: string; children: React.ReactNode; icon?: React.FC<any>; }> = ({ title, children, icon: Icon }) => {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden my-8 animate-fadeInUp">
            <div className="w-full flex items-center gap-3 p-5 bg-white border-b border-slate-200">
                {Icon && <Icon className="w-6 h-6 text-indigo-600" />}
                <h3 className="text-xl font-semibold text-slate-800 m-0">{title}</h3>
            </div>
            <div className="p-6">
                {children}
            </div>
        </div>
    );
};


const ProgressBar: React.FC<{ value: number; max: number }> = ({ value, max }) => {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="relative w-full mb-6">
      <div className="w-full bg-slate-200 rounded-full h-5 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-5 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${percentage}%` }}
        >
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-xs font-bold text-white text-shadow">
          {percentage}% Concluído ({value}/{max})
        </span>
      </div>
    </div>
  );
};

const ChecklistItemComponent: React.FC<{ item: ChecklistItem; formData: any; handleInputChange: (e: any) => void; }> = ({ item, formData, handleInputChange }) => {
    const isComplete = useMemo(() => {
        if (!item.inputs || item.inputs.length === 0) {
            return false;
        }

        const requiredInputs = item.inputs.filter(input => !input.optional);

        if (requiredInputs.length === 0) {
            return false;
        }

        return requiredInputs.every(input => {
            const value = formData[input.name];
            if (input.type === 'checkbox') {
                return value === true;
            }
            // For text, textarea, number, etc.
            return value !== null && value !== undefined && String(value).trim() !== '';
        });
    }, [item.inputs, formData]);

    return (
        <div className={`checklist-item-card border p-4 rounded-lg bg-white ${isComplete ? 'is-complete' : 'border-slate-200'}`}>
            <div className="flex items-start gap-4">
                <div className="checklist-icon flex-shrink-0 mt-1 h-6 w-6 rounded-full border-2 border-slate-300 flex items-center justify-center font-bold text-slate-400 transition-all">
                    {isComplete ? <CheckCircle className="w-5 h-5"/> : ''}
                </div>
                <div className="flex-1">
                    <p className="checklist-item-text text-slate-800 font-medium" dangerouslySetInnerHTML={{ __html: item.text }} />
                    
                    {item.inputs && (
                        <div className="mt-4 p-4 bg-slate-50/80 border border-dashed rounded-md space-y-4">
                            {item.inputs.map(input => (
                                <FormField key={input.name} input={input} formData={formData} handleInputChange={handleInputChange} />
                            ))}
                        </div>
                    )}
                    {item.subText && <p className="text-xs text-slate-500 mt-2 italic" dangerouslySetInnerHTML={{ __html: item.subText }} />}
                </div>
            </div>
        </div>
    );
};

const ExerciseStepComponent: React.FC<{ step: ExerciseStep; formData: any; handleInputChange: (e: any) => void; }> = ({ step, formData, handleInputChange }) => {
    const isComplete = useMemo(() => {
        const checkboxInputs = step.inputs.filter(input => input.type === 'checkbox' && !input.optional);
        if (checkboxInputs.length === 0) return false;
        return checkboxInputs.every(input => formData[input.name] === true);
    }, [step.inputs, formData]);

    return (
        <div className={`exercise-step-card p-4 border rounded-lg ${isComplete ? 'is-complete' : 'border-indigo-100 bg-indigo-50/50'}`}>
            <h4 className="font-bold text-slate-800 text-base mb-1" dangerouslySetInnerHTML={{ __html: step.title }} />
            {step.description && <p className="text-sm text-slate-600 mb-3" dangerouslySetInnerHTML={{ __html: step.description }} />}
            
            <div className="space-y-4 bg-white/60 p-3 rounded border border-white">
                {step.inputs.map(input => (
                    <FormField key={input.name} input={input} formData={formData} handleInputChange={handleInputChange} />
                ))}
            </div>
            {step.example && (
                 <div className="border border-slate-200 rounded-lg mt-6">
                    <div className="bg-slate-100 px-4 py-2 font-semibold text-slate-700 text-sm rounded-t-lg">{step.example.title}</div>
                    <div className="p-4 text-slate-700 text-sm">
                        {step.example.content}
                    </div>
                </div>
            )}
        </div>
    );
};

const UpgradePrompt: React.FC<{ chapterTitle: string; requiredTier: UserTier; onUpgradeClick: () => void; }> = ({ chapterTitle, requiredTier, onUpgradeClick }) => (
    <div className="flex items-center justify-center h-full p-4">
      <div className="text-center p-8 sm:p-12 bg-white rounded-xl shadow-lg max-w-2xl mx-auto mt-10 animate-fadeInUp border-t-4 border-indigo-500">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-yellow-100/50">
          <LockClosed className="w-8 h-8 text-yellow-500"/>
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Conteúdo Exclusivo</h2>
        <p className="text-slate-600 mt-2 max-w-md mx-auto">
          O capítulo <strong className="text-slate-900">"{chapterTitle}"</strong> faz parte do plano <strong className="text-indigo-600">{requiredTier}</strong>.
        </p>
        <p className="mt-1 text-slate-500">Faça upgrade do seu plano para desbloquear este e outros conteúdos avançados!</p>
        <button 
          onClick={onUpgradeClick} 
          className="mt-8 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
        >
          <Rocket className="w-5 h-5"/>
          Ver Planos de Upgrade
        </button>
      </div>
    </div>
);


// --- MAIN DISPLAY COMPONENT ---

interface ContentDisplayProps {
  chapter: Chapter;
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  favoriteChapterIds: Set<number>;
  onToggleFavorite: (id: number) => void;
  hasAccess: (tier: UserTier) => boolean;
  onUpgradeClick: () => void;
}

export const ContentDisplay: React.FC<ContentDisplayProps> = ({ chapter, formData, handleInputChange, favoriteChapterIds, onToggleFavorite, hasAccess, onUpgradeClick }) => {
  const isFavorited = favoriteChapterIds.has(chapter.id);

  if (!hasAccess(chapter.tier)) {
    return <UpgradePrompt chapterTitle={chapter.title} requiredTier={chapter.tier} onUpgradeClick={onUpgradeClick} />;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 w-full">
      <div className="max-w-4xl mx-auto">
        <div className="pb-6">
            <div className="flex items-center gap-4 border-b-2 border-gray-200 pb-4 mb-2">
                {chapter.icon && (
                    <div className="flex-shrink-0 w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center">
                        <chapter.icon className="w-8 h-8 text-indigo-600" />
                    </div>
                )}
                <div className="flex-1 flex items-start justify-between gap-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        {chapter.title}
                    </h2>
                    <button
                        onClick={() => onToggleFavorite(chapter.id)}
                        className={`p-2 rounded-full transition-colors duration-200 group relative flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-yellow-500 ${isFavorited ? 'bg-yellow-100 text-yellow-500' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
                        aria-label={isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                    >
                        <Bookmark className={`w-6 h-6 transition-all ${isFavorited ? 'fill-current' : ''}`} />
                        <div className="absolute right-0 bottom-full mb-2 w-max px-2 py-1 bg-slate-800 text-white text-xs font-semibold rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            {isFavorited ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                        </div>
                    </button>
                </div>
            </div>
            <div className="text-gray-700 leading-relaxed pt-4">
                {chapter.sections.map((section, index) => {
                    const key = `${chapter.id}-${index}`;
                    switch(section.type) {
                        case 'quote':
                            return <Blockquote key={key}>{section.content}</Blockquote>;
                        
                        case 'objective':
                            return (
                                <SectionContainer key={key} title={section.title || "Objetivo"} icon={section.icon}>
                                    <P>{section.content}</P>
                                </SectionContainer>
                            );

                        case 'interactive_checklist':
                            const checklistItems = section.content as ChecklistItem[];
                            
                            const completedCount = checklistItems.reduce((count, item) => {
                                if (!item.inputs || item.inputs.length === 0) {
                                    return count;
                                }
                                const requiredInputs = item.inputs.filter(input => !input.optional);
                                if (requiredInputs.length === 0) {
                                    return count;
                                }

                                const isItemComplete = requiredInputs.every(input => {
                                    const value = formData[input.name];
                                    if (input.type === 'checkbox') {
                                        return value === true;
                                    }
                                    return value !== null && value !== undefined && String(value).trim() !== '';
                                });

                                return isItemComplete ? count + 1 : count;
                            }, 0);

                            const maxCount = checklistItems.length;

                            return (
                                <SectionContainer key={key} title={section.title || "Checklist"} icon={section.icon}>
                                    <ProgressBar value={completedCount} max={maxCount} />
                                    <div className="space-y-4">
                                        {checklistItems.map(item => (
                                            <ChecklistItemComponent key={item.id} item={item} formData={formData} handleInputChange={handleInputChange} />
                                        ))}
                                    </div>
                                </SectionContainer>
                            );

                        case 'exercise':
                             return (
                                <SectionContainer key={key} title={section.title || "Exercício"} icon={section.icon}>
                                    <div className="space-y-4">
                                        {(section.content as ExerciseStep[]).map(step => (
                                            <ExerciseStepComponent key={step.id} step={step} formData={formData} handleInputChange={handleInputChange} />
                                        ))}
                                    </div>
                                </SectionContainer>
                            );
                        
                        case 'custom_jsx':
                             return <div key={key}>{section.content}</div>;

                        default:
                            return null;
                    }
                })}
            </div>
        </div>
      </div>
    </div>
  );
};