import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { UserTier } from '../types';
import { X, CheckCircle, Rocket } from './Icons';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpgrade: (tier: UserTier) => void;
    currentTier: UserTier;
}

const tierData: Record<UserTier, { name: string; price: string; features: string[]; style: string; buttonStyle: string; }> = {
    'Grátis': {
        name: 'Grátis',
        price: 'R$0',
        features: ['Acesso aos capítulos introdutórios', 'Funcionalidades básicas de notas', 'Checklists interativos iniciais'],
        style: 'border-slate-300',
        buttonStyle: 'bg-slate-500 text-white',
    },
    'Essencial': {
        name: 'Essencial',
        price: 'R$19/mês',
        features: ['Tudo do plano Grátis', 'Acesso a todos os métodos principais', 'Exercícios práticos aprofundados', 'Mapas mentais e resumos'],
        style: 'border-indigo-500 ring-2 ring-indigo-500',
        buttonStyle: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    },
    'Completo': {
        name: 'Completo',
        price: 'R$39/mês',
        features: ['Tudo do plano Essencial', 'Acesso a todos os capítulos avançados', 'Sessões de mentoria (em breve)', 'Acesso antecipado a novos conteúdos'],
        style: 'border-purple-500',
        buttonStyle: 'bg-purple-600 hover:bg-purple-700 text-white',
    }
};

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, onUpgrade, currentTier }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);
    
    if (!isOpen) {
        return null;
    }

    const tierOrder: Record<UserTier, number> = { 'Grátis': 0, 'Essencial': 1, 'Completo': 2 };

    const modalContent = (
        <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeInUp"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="upgrade-modal-title"
        >
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-scaleIn"
                onClick={e => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-4 border-b border-slate-200 flex-shrink-0">
                    <div className="flex items-center space-x-3">
                        <Rocket className="w-6 h-6 text-indigo-600" />
                        <h2 id="upgrade-modal-title" className="text-lg font-semibold text-slate-800">Evolua seu Plano</h2>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-1 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                        aria-label="Fechar"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </header>
                <main className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
                    <p className="text-center text-slate-600 max-w-2xl mx-auto mb-8">
                        Desbloqueie todo o potencial do Método da Produtividade Caótica e transforme sua forma de trabalhar.
                    </p>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {(Object.keys(tierData) as UserTier[]).map(tier => {
                            const data = tierData[tier];
                            const isCurrent = tier === currentTier;
                            const isUpgrade = tierOrder[tier] > tierOrder[currentTier];

                            return (
                                <div key={tier} className={`relative p-6 rounded-lg border-2 bg-white shadow-md transition-all duration-300 ${isCurrent ? data.style : 'border-slate-300'}`}>
                                    {isCurrent && (
                                        <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full shadow-lg">
                                            Seu Plano
                                        </div>
                                    )}
                                    <h3 className="text-xl font-bold text-center text-slate-800">{data.name}</h3>
                                    <p className="text-3xl font-extrabold text-center my-4 text-slate-900">{data.price}</p>
                                    <ul className="space-y-3 text-sm mb-6">
                                        {data.features.map(feature => (
                                            <li key={feature} className="flex items-start gap-2">
                                                <CheckCircle className="w-5 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                                <span className="text-slate-600">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-auto pt-6">
                                        <button
                                            onClick={() => isUpgrade && onUpgrade(tier)}
                                            disabled={!isUpgrade}
                                            className={`w-full font-bold py-2.5 px-4 rounded-lg text-sm transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-50 ${isUpgrade ? `${data.buttonStyle} focus:ring-indigo-400` : 'bg-slate-200 text-slate-500 cursor-not-allowed'}`}
                                        >
                                            {isUpgrade ? `Fazer Upgrade` : (isCurrent ? 'Plano Atual' : '—')}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </main>
            </div>
        </div>
    );
    
    return isMounted ? createPortal(modalContent, document.body) : null;
};