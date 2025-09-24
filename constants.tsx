import React from 'react';
import type { Chapter, UserTier } from './types';
import {
  ClipboardList, Waves, Compass, RefreshCw, Layers, GitBranch,
  BadgeCheck, PieChart, Flame, CalendarDays, InfinityIcon, PlayCircle,
  FlaskConical, Wrench, Sparkles, Target, CheckSquare, Lightbulb, Stairs, Trophy, Rocket, Gift, Gem, Crown
} from './components/Icons';

const H2: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => <h2 className={`text-2xl font-semibold mt-8 mb-4 text-slate-800 border-b pb-2 ${className || ''}`.trim()}>{children}</h2>;
const H3: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => <h3 className={`text-xl font-semibold mt-6 mb-3 text-slate-700 ${className || ''}`.trim()}>{children}</h3>;
const P: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => <p className={`mb-4 text-base leading-relaxed text-slate-600 ${className || ''}`.trim()}>{children}</p>;
const UL: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => <ul className={`list-disc list-inside space-y-2 mb-4 pl-4 ${className || ''}`.trim()}>{children}</ul>;
const LI: React.FC<{ children: React.ReactNode }> = ({ children }) => <li>{children}</li>;
const Strong: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => <strong className={`font-semibold text-slate-900 ${className || ''}`.trim()}>{children}</strong>;

export const BOOK_QUOTES: string[] = [
    "O mundo não precisa de mais um livro sobre produtividade perfeita. Precisa de um manual para quem vive no caos.",
    "Pare de lutar contra a maré do caos. Em vez disso, vamos aprender a surfar nela.",
    "O erro não é um acidente indesejado – ele é feedback. É a bússola que nos ajuda a navegar.",
    "A ação imperfeita e consistente sempre superará a busca paralisante pela perfeição.",
    "Eficácia real não vem de controlar tudo. Vem de focar no que podemos controlar.",
    "A maioria das coisas não importa tanto quanto você pensa. Descubra o que realmente gera impacto.",
    "Não basta ser resistente ao caos. Você precisa aprender a crescer com ele.",
    "Aja Agora: O aprendizado está na ação.",
    "Complexidade é inimiga da execução. Abrace a simplicidade.",
    "Gerencie Sua Energia, não Apenas seu Tempo: Energia é o combustível da ação."
];

export const tierInfo: Record<UserTier, { name: string; Icon: React.FC<any>; color: string; }> = {
    'Grátis': { name: 'Grátis', Icon: Gift, color: 'text-slate-500' },
    'Essencial': { name: 'Essencial', Icon: Gem, color: 'text-indigo-500' },
    'Completo': { name: 'Completo', Icon: Crown, color: 'text-purple-500' },
};

export const BOOK_CONTENT: Chapter[] = [
  {
    id: 0,
    title: "Introdução: Diagnóstico Inicial",
    shortTitle: "Introdução",
    icon: ClipboardList,
    tier: 'Grátis',
    sections: [
      { type: 'quote', content: "O mundo não precisa de mais um livro sobre produtividade perfeita. Precisa de um manual para quem vive no caos." },
      {
        type: 'objective',
        title: "Objetivo Desta Etapa:",
        icon: Target,
        content: "Antes de mergulhar nos métodos, vamos fazer um diagnóstico honesto do seu ponto de partida. Entender suas frustrações atuais e o que você busca é o primeiro passo para construir um sistema que *realmente* funcione para você. Responda às perguntas abaixo com sinceridade. Não há respostas certas ou erradas, apenas a *sua* realidade.",
      },
      {
        type: 'interactive_checklist',
        title: "Checklist Interativo: Diagnóstico Inicial",
        icon: CheckSquare,
        content: [
          {
            id: 'c0_item1',
            text: '<Strong>1. Métodos Frustrantes:</Strong> Liste 3 métodos, dicas ou ferramentas de produtividade que você já tentou e que <Strong>não funcionaram bem</Strong> para você a longo prazo. Por que você acha que eles falharam *para você*?',
            subText: 'Dica: Pense em rotinas matinais rígidas, sistemas de organização complexos, apps que você abandonou, etc.',
            inputs: [
              { name: 'c0_method1', label: 'Método/Dica 1 e Porquê:', type: 'textarea' },
              { name: 'c0_method2', label: 'Método/Dica 2 e Porquê:', type: 'textarea' },
              { name: 'c0_method3', label: 'Método/Dica 3 e Porquê:', type: 'textarea' },
            ]
          },
          {
            id: 'c0_item2',
            text: '<Strong>2. Gatilhos do Caos:</Strong> Qual foi o último "incêndio" ou imprevisto significativo que <Strong>bagunçou completamente</Strong> seus planos ou sua rotina? Como você reagiu?',
            subText: 'Dica: Pode ser uma demanda urgente, um problema técnico, uma questão pessoal, etc.',
            inputs: [
              { name: 'c0_unexpected_event', label: 'Imprevisto:', type: 'text' },
              { name: 'c0_reaction', label: 'Reação:', type: 'text' },
            ]
          },
          {
            id: 'c0_item3',
            text: '<Strong>3. Mudança Urgente:</Strong> Se você pudesse mudar UMA ÚNICA coisa na sua forma atual de trabalhar ou gerenciar seu tempo e energia, qual seria a mudança <Strong>mais impactante e urgente</Strong>?',
            subText: 'Dica: Seja específico! Ex: "Parar de procrastinar tarefas importantes", "Ter mais clareza do que fazer", "Sentir menos culpa no fim do dia", "Lidar melhor com interrupções".',
            inputs: [{ name: 'c0_urgent_change', label: 'Mudança Urgente:', type: 'textarea' }]
          },
          {
            id: 'c0_item4',
            text: '<Strong>4. Nível de Satisfação Atual:</Strong> Em uma escala de 1 a 10, qual seu nível de satisfação atual com sua capacidade de realizar o que é importante e se sentir bem no processo?',
            inputs: [
                { name: 'c0_satisfaction_score', label: 'Nota (1-10):', type: 'number', min: "1", max: "10", className: "w-24"},
                { name: 'c0_satisfaction_comment', label: 'Breve comentário (opcional):', type: 'text', optional: true },
            ]
          },
          {
            id: 'c0_item5',
            text: '<Strong>5. Compromisso Inicial:</Strong> Você está pronto(a) para explorar uma abordagem diferente, aceitando que não há fórmulas mágicas, mas sim um caminho de adaptação e aprendizado?',
            subText: 'Ação Final Sugerida: Guarde esta página ou suas respostas. Será interessante revisitá-las ao concluir o livro/curso para ver sua evolução!',
            inputs: [{ name: 'c0_commitment', label: 'Sim, estou pronto(a)!', type: 'checkbox' }]
          }
        ]
      },
    ]
  },
  {
    id: 1,
    title: "Capítulo 1: Aceitando a Realidade",
    shortTitle: "Aceitando a Realidade",
    icon: CheckSquare,
    tier: 'Grátis',
    sections: [
        { type: 'quote', content: "Pare de lutar contra a maré do caos. Em vez disso, vamos aprender a surfar nela." },
        {
            type: 'objective',
            title: 'Objetivo Desta Etapa:',
            icon: Target,
            content: 'Neste capítulo, desmontamos a busca pela perfeição e pelo controle absoluto. O objetivo agora é começar a internalizar a aceitação da incerteza e, principalmente, *agir* de forma imperfeita, mas consistente. Vamos quebrar a paralisia do perfeccionismo com ações pequenas e imediatas.',
        },
        {
            type: 'interactive_checklist',
            title: 'Checklist Interativo: Aceitando a Realidade',
            icon: CheckSquare,
            content: [
                { id: 'c1_item1', text: '<Strong>1. Identifique seu Perfeccionista Interior:</Strong> Qual hábito, pensamento ou medo específico relacionado ao perfeccionismo <Strong>mais te impede de começar ou finalizar</Strong> tarefas?', inputs: [{ name: 'c1_perfectionist_habit', label: 'Meu Principal Hábito/Medo Perfeccionista:', type: 'textarea' }] },
                { id: 'c1_item2', text: '<Strong>2. Ação "Boa o Suficiente":</Strong> Escolha UMA tarefa que você faria hoje ou amanhã. Comprometa-se a realizá-la focando em concluir (atingir o objetivo essencial) em vez de torná-la "perfeita".', inputs: [{ name: 'c1_good_enough_task', label: 'Tarefa Escolhida:', type: 'text' }, { name: 'c1_task_done', label: 'Tarefa realizada de forma "boa o suficiente"?', type: 'checkbox' }] },
                { id: 'c1_item3', text: '<Strong>3. Regra dos 5 Minutos em Ação:</Strong> Escolha UMA tarefa que você está adiando há algum tempo. Trabalhe nela por apenas 5 minutos cronometrados, com a permissão de parar depois.', inputs: [{ name: 'c1_procrastinated_task', label: 'Tarefa Adiada Escolhida:', type: 'text' }, { name: 'c1_5min_rule_done', label: 'Trabalhei por 5 minutos?', type: 'checkbox' }, { name: 'c1_continued_working', label: '(Opcional) Continuei trabalhando após os 5 min? (Sim/Não)', type: 'text', optional: true }] },
                { id: 'c1_item4', text: '<Strong>4. Crie a Versão "Feia" (MVP):</Strong> Pense em um projeto ou ideia. Qual é a versão MAIS SIMPLES e "imperfeita" que você poderia esboçar HOJE para tirar a ideia do papel? Realize essa ação mínima.', inputs: [{ name: 'c1_mvp_idea', label: 'Ideia/Projeto:', type: 'text' }, { name: 'c1_mvp_action', label: 'Versão Mínima/Feia a Criar Hoje:', type: 'text' }, { name: 'c1_mvp_created', label: 'Versão mínima criada?', type: 'checkbox' }] },
                { id: 'c1_item5', text: '<Strong>5. Reflexão Pós-Ação Imperfeita:</Strong> Após realizar uma das ações acima, reserve 1 minuto. Como você se sentiu ao agir *apesar* da imperfeição? Houve algum alívio ou progresso?', inputs: [{ name: 'c1_reflection', label: 'Sentimento/Observação:', type: 'textarea' }] }
            ]
        },
        {
            type: 'exercise',
            title: 'Exercício do Capítulo: Teste da Simplicidade',
            icon: Wrench,
            content: [
                { id: 'c1_ex_intro', title: 'Contexto', description: 'Pegue uma tarefa ou projeto que parece complexo ou que você está adiando por causa disso:', inputs: [] },
                { id: 'c1_ex_step1', title: '1. Liste Todas as Etapas Percebidas:', inputs: [{ name: 'c1_exercise_all_steps', label: '', type: 'textarea', rows: 3 }] },
                { id: 'c1_ex_step2', title: '2. Corte Pela Metade (ou Mais!):', description: 'O que é *realmente* essencial para o primeiro passo? O que pode ser eliminado, simplificado ou adiado?', inputs: [{ name: 'c1_exercise_cut_steps', label: '', type: 'textarea', rows: 3 }] },
                { id: 'c1_ex_step3', title: '3. Defina a Ação Mínima Viável:', description: 'Qual é a menor ação física e concreta que você pode realizar AGORA para iniciar?', inputs: [{ name: 'c1_exercise_min_action', label: '', type: 'text' }, { name: 'c1_exercise_commit', label: 'Comprometa-se: Realize esta Ação Mínima Viável!', type: 'checkbox' }],
                  example: {
                    title: 'Exemplo Prático (Criar um Blog):',
                    content: <UL className="!mb-0 space-y-3"><LI><Strong>Antes (Planejamento Excessivo):</Strong> Escolher nicho, pesquisar domínio, contratar hospedagem, instalar WordPress, escolher tema, customizar design, criar logo, planejar calendário editorial, escrever 10 posts... (Paralisia!)</LI><LI><Strong>Depois (Simplificado - Foco no 1º Valor):</Strong> Escrever 1 artigo simples sobre um tema que gosto, publicar em uma plataforma gratuita (Medium, LinkedIn Pulse, etc).</LI><LI><Strong>Ação Mínima Viável:</Strong> Escrever o primeiro parágrafo do artigo HOJE.</LI></UL>
                  }
                }
            ]
        }
    ]
  },
  {
    id: 2,
    title: "Capítulo 2: A Arte de Errar Melhor",
    shortTitle: "Errar Melhor",
    icon: Compass,
    tier: 'Grátis',
    sections: [
      { type: 'quote', content: "O erro não é um acidente indesejado – ele é feedback. É informação valiosa. É a bússola que nos ajuda a navegar." },
      {
        type: 'objective',
        title: 'Objetivo Desta Etapa:',
        icon: Target,
        content: 'Superar o medo paralisante do fracasso e começar a ver os erros não como vereditos finais, mas como oportunidades cruciais de aprendizado e ajuste. Vamos extrair lições do passado e planejar "erros controlados" para aprender mais rápido.'
      },
      {
        type: 'interactive_checklist',
        title: 'Checklist Interativo: A Arte de Errar Melhor',
        icon: CheckSquare,
        content: [
          { id: 'c2_item1', text: '<Strong>1. Mapeie um Erro Passado Significativo:</Strong> Pense em um projeto ou decisão profissional que não saiu como o esperado. Descreva brevemente o que aconteceu.', inputs: [{ name: 'c2_past_error', label: 'Descrição do Erro/Falha:', type: 'textarea' }] },
          { id: 'c2_item2', text: '<Strong>2. Extraia a Lição Central:</Strong> Sem se culpar, qual foi a lição mais importante que você aprendeu com essa experiência? O que você faria diferente hoje?', inputs: [{ name: 'c2_lesson', label: 'Lição Aprendida:', type: 'textarea' }] },
          { id: 'c2_item3', text: '<Strong>3. Reenquadre como Dados (Estilo Edison):</Strong> Tente descrever o resultado não como "falha", mas como um dado. Ex: "Tentei a abordagem X e descobri que ela não funciona neste contexto."', inputs: [{ name: 'c2_reframe', label: 'Resultado como Dados:', type: 'textarea' }] },
          { id: 'c2_item4', text: '<Strong>4. Identifique um Medo de Erro Atual:</Strong> Qual ação ou decisão você está adiando AGORA por medo de errar ou de não ser perfeito?', inputs: [{ name: 'c2_current_fear', label: 'Ação Adiada pelo Medo:', type: 'text' }] },
          { id: 'c2_item5', text: '<Strong>5. Planeje um "Erro Controlado" (Micro-Teste):</Strong> Com base no item 4, qual é a menor e mais segura maneira de testar sua ideia e obter feedback real, mesmo que o resultado seja "errado"?', inputs: [{ name: 'c2_controlled_error_plan', label: 'Plano do Micro-Teste:', type: 'textarea' }, { name: 'c2_controlled_error_done', label: 'Comprometo-me a realizar este micro-teste.', type: 'checkbox' }] }
        ]
      },
      {
        type: 'exercise',
        title: 'Exercício do Capítulo: Teste do "Pior Cenário Simulado" (Fear-Setting)',
        icon: Wrench,
        content: [
          { id: 'c2_ex_step1', title: '1. Ação/Decisão que Causa Medo:', description: 'Escreva a ação que você está considerando, mas que o medo está te impedindo (a mesma do item 4 acima, por exemplo).', inputs: [{ name: 'c2_ex_fear_action', label: 'Ação:', type: 'text' }] },
          { id: 'c2_ex_step2', title: '2. Piores Cenários Possíveis (Brainstorm):', description: 'O que de pior poderia acontecer se você fizesse isso? Liste de 1 a 3 resultados terríveis.', inputs: [{ name: 'c2_ex_worst_case', label: 'Piores Cenários:', type: 'textarea', rows: 3 }] },
          { id: 'c2_ex_step3', title: '3. Prevenção:', description: 'O que você poderia fazer para prevenir que cada um desses piores cenários aconteça, ou para diminuir a probabilidade?', inputs: [{ name: 'c2_ex_prevention', label: 'Ações de Prevenção:', type: 'textarea', rows: 3 }] },
          { id: 'c2_ex_step4', title: '4. Reparo:', description: 'Se o pior acontecer, o que você poderia fazer para consertar o dano? A quem você poderia pedir ajuda?', inputs: [{ name: 'c2_ex_repair', label: 'Ações de Reparo:', type: 'textarea', rows: 3 }] },
          { id: 'c2_ex_step5', title: '5. Custo da Inação:', description: 'Pense nos custos (financeiros, emocionais, de carreira) de adiar essa decisão por 6 meses, 1 ano e 3 anos. O que você perderá se não agir?', inputs: [{ name: 'c2_ex_inaction_cost', label: 'Custo de Não Agir:', type: 'textarea', rows: 3 }] },
          { id: 'c2_ex_step6', title: '6. Decisão Pós-Análise:', description: 'Após analisar, o risco parece mais gerenciável? Esta análise te deu mais clareza para agir?', inputs: [{ name: 'c2_ex_decision', label: 'Sim, tenho mais clareza para tomar uma decisão.', type: 'checkbox' }] }
        ]
      }
    ]
  },
  {
      id: 3,
      title: "Capítulo 3: O Método MPC em Ação",
      shortTitle: "O Método MPC",
      icon: RefreshCw,
      tier: 'Essencial',
      sections: [
        { type: 'quote', content: "O Ciclo Orientar -> Agir -> Aprender/Adaptar não é algo que você faz uma vez. É seu sistema operacional contínuo para navegar na incerteza." },
        {
          type: 'objective',
          title: 'Objetivo Desta Etapa:',
          icon: Target,
          content: 'Internalizar e começar a aplicar o núcleo prático do Método da Produtividade Caótica: o Ciclo contínuo e os 3 Passos diários (Bússola, Blocos de Ação, Check-in Adaptativo).'
        },
        {
          type: 'visual_guide',
          title: 'O Ciclo da Produtividade Caótica: O Modelo Mental',
          icon: RefreshCw,
          content: <>
            <P><Strong>Este é o coração do método.</Strong> É um ciclo simples, projetado para ser repetido continuamente, especialmente em dias de caos.</P>
            <UL>
              <LI><Strong>1. ORIENTAR:</Strong> Onde estou? O que realmente importa AGORA? É um momento de clareza, não de planejamento extenso. Defina 1-3 prioridades.</LI>
              <LI><Strong>2. AGIR:</Strong> Fazer acontecer, de forma imperfeita. Foco total em executar a prioridade definida, ignorando o resto por um período determinado.</LI>
              <LI><Strong>3. APRENDER/ADAPTAR:</Strong> O que aconteceu? Como ajustar? Uma breve pausa para refletir sobre o que funcionou, o que não funcionou e o que fazer a seguir.</LI>
            </UL>
          </>
        },
        {
          type: 'interactive_checklist',
          title: 'Checklist Interativo: Os 3 Passos Práticos Diários',
          icon: CheckSquare,
          content: [
            { id: 'c3_item1', text: '<Strong>PASSO 1: O Ritual da Bússola (Orientar):</Strong> No início do seu dia (ou na noite anterior), defina suas 1-3 prioridades mais importantes. Esqueça a lista de 20 itens.', inputs: [{ name: 'c3_compass_ritual', label: 'Minhas 1-3 Prioridades Para Hoje/Amanhã:', type: 'textarea' }] },
            { id: 'c3_item2', text: '<Strong>PASSO 2: Blocos de Ação Focada (Agir):</Strong> Comprometa-se a trabalhar em sua prioridade #1 por um bloco de tempo focado (ex: 25, 45, ou 60 minutos) com o mínimo de distrações.', inputs: [{ name: 'c3_action_blocks_commit', label: 'Comprometo-me a fazer pelo menos um Bloco de Ação Focada hoje.', type: 'checkbox' }] },
            { id: 'c3_item3', text: '<Strong>PASSO 3: Check-in Adaptativo (Aprender/Adaptar):</Strong> No final do dia, responda rapidamente: O que funcionou? O que me atrapalhou? Qual o ajuste para amanhã?', inputs: [{ name: 'c3_adaptive_checkin', label: 'Reflexão Rápida do Dia:', type: 'textarea' }] }
          ]
        },
        {
          type: 'exercise',
          title: 'Exercício do Capítulo: Seu Primeiro Ciclo MPC',
          icon: Wrench,
          content: [
            { id: 'c3_ex_step1', title: '1. Defina sua "Bússola" para Amanhã:', description: 'Quais são as 1-3 coisas que, se você as completar amanhã, farão o dia ser uma vitória, não importa o que mais aconteça?', inputs: [{ name: 'c3_ex_compass', label: 'Prioridades de Amanhã:', type: 'textarea' }] },
            { id: 'c3_ex_step2', title: '2. Agende Seu Bloco de Ação:', description: 'Abra sua agenda agora e bloqueie um horário específico para sua primeira tarefa prioritária. Trate-o como um compromisso inadiável.', inputs: [{ name: 'c3_ex_block_schedule', label: 'Horário do Bloco de Ação Agendeado:', type: 'text', placeholder: 'Ex: 9:00 - 9:45' }] },
            { id: 'c3_ex_step3', title: '3. Comprometa-se com o Check-in:', description: 'No final de amanhã, volte aqui e faça seu check-in adaptativo. O que você aprendeu com este primeiro ciclo completo?', inputs: [{ name: 'c3_ex_checkin_reflection', label: 'Reflexão Pós-Ciclo:', type: 'textarea' }, { name: 'c3_ex_commit', label: 'Sim, eu me comprometo a executar um ciclo MPC completo amanhã.', type: 'checkbox' }] }
          ]
        }
      ]
  },
  {
      id: 4,
      title: "Capítulo 4: Destruindo o \"Tudo ou Nada\" (TAE)",
      shortTitle: "O Método TAE",
      icon: Layers,
      tier: 'Essencial',
      sections: [
        { type: 'quote', content: "A ação imperfeita e consistente sempre superará a busca paralisante pela perfeição. Comece pequeno, aprenda rápido, melhore sempre." },
        {
          type: 'objective',
          title: 'Objetivo Desta Etapa:',
          icon: Target,
          content: 'Superar a mentalidade perfeccionista do "Tudo ou Nada". Aprender e praticar o Método TAE (Teste, Ajuste, Escale) como uma ferramenta fundamental para fazer progresso incremental e real em projetos importantes.'
        },
        {
          type: 'visual_guide',
          title: 'O Método TAE: Teste, Ajuste, Escale',
          icon: FlaskConical,
          content: <>
            <P><Strong>É a sua arma secreta contra a procrastinação e o planejamento excessivo.</Strong></P>
            <UL>
              <LI><Strong>1. TESTE:</Strong> Comece pequeno, muito pequeno! O objetivo principal é <Strong>APRENDER</Strong> rápido com baixo risco, não ter sucesso imediato. Qual é a menor versão da sua ideia que pode gerar feedback?</LI>
              <LI><Strong>2. AJUSTE:</Strong> Observe os resultados (dados!) do seu Teste. O que funcionou? O que não? O objetivo principal é <Strong>ADAPTAR</Strong> e melhorar com base na realidade, não em suposições.</LI>
              <LI><Strong>3. ESCALE:</Strong> Somente depois de testar e ajustar, comece a aumentar gradualmente a escala. O objetivo principal é <Strong>EXPANDIR</Strong> o que funciona, de forma sustentável.</LI>
            </UL>
          </>
        },
        {
          type: 'interactive_checklist',
          title: 'Checklist Interativo: Aplicando o TAE',
          icon: CheckSquare,
          content: [
            { id: 'c4_item1', text: '<Strong>1. Identifique um Alvo para o TAE:</Strong> Escolha um projeto, tarefa ou ideia que você está adiando ou planejando demais.', inputs: [{ name: 'c4_tae_target', label: 'Projeto/Ideia Alvo:', type: 'text' }] },
            { id: 'c4_item2', text: '<Strong>2. Defina seu Mini-TESTE:</Strong> Qual é a ação mais simples e rápida que você pode fazer para testar a premissa principal da sua ideia? (Ex: Enviar 1 e-mail, criar 1 slide, escrever 1 parágrafo).', inputs: [{ name: 'c4_test_def', label: 'Meu Mini-Teste (Ação de 15 min):', type: 'textarea' }] },
            { id: 'c4_item3', text: '<Strong>3. Execute o Mini-TESTE:</Strong> Comprometa-se a realizar a ação definida acima. O foco é na execução e no aprendizado, não no resultado perfeito.', inputs: [{ name: 'c4_test_executed', label: 'Executei o mini-teste.', type: 'checkbox' }] },
            { id: 'c4_item4', text: '<Strong>4. Analise e Planeje o AJUSTE:</Strong> Com base no resultado do teste, o que você aprendeu? Qual é o próximo pequeno passo ou ajuste lógico?', inputs: [{ name: 'c4_adjustment_plan', label: 'Aprendizado e Próximo Ajuste:', type: 'textarea' }] },
            { id: 'c4_item5', text: '<Strong>5. Pense na ESCALA (Visão):</Strong> Se seus próximos testes e ajustes continuarem positivos, como seria a versão "escalada" deste projeto em 1 ou 3 meses? (Isso é para motivação, não para planejamento agora).', inputs: [{ name: 'c4_scaling_idea', label: 'Visão de Futuro (se funcionar):', type: 'textarea' }] }
          ]
        }
      ]
  },
  {
      id: 5,
      title: "Capítulo 5: Paradoxo do Controle (Flexibilidade)",
      shortTitle: "Paradoxo do Controle",
      icon: GitBranch,
      tier: 'Essencial',
      sections: [
        { type: 'quote', content: "Eficácia real não vem de controlar tudo. Vem de focar no que podemos controlar (nossas respostas, nossa energia) e desenvolver a adaptabilidade para lidar com o resto." },
        {
          type: 'objective',
          title: 'Objetivo Desta Etapa:',
          icon: Target,
          content: 'Revisitar nossa relação com o controle. Aprender estratégias práticas para cultivar controle flexível: criar estruturas que oferecem direção, mas têm maleabilidade suficiente para absorver o inesperado e permitir a adaptação.'
        },
        {
          type: 'custom_jsx', content: <>
            <H3>Custos Ocultos do Controle Rígido</H3>
            <P>Tentar controlar cada detalhe de um dia ou projeto leva a:</P>
            <UL>
                <LI><Strong>Fragilidade:</Strong> Um plano rígido quebra com o primeiro imprevisto.</LI>
                <LI><Strong>Oportunidades Perdidas:</Strong> Não há espaço para desvios criativos ou novas ideias.</LI>
                <LI><Strong>Estresse e Exaustão:</Strong> É mentalmente cansativo tentar prever e gerenciar tudo.</LI>
            </UL>
          </>
        },
        {
          type: 'interactive_checklist',
          title: 'Checklist Interativo: Cultivando o Controle Flexível',
          icon: CheckSquare,
          content: [
            { id: 'c5_item1', text: '<Strong>1. Identifique sua Área de Controle Excessivo:</Strong> Em que área da sua vida ou trabalho você gasta muita energia tentando controlar cada detalhe?', inputs: [{ name: 'c5_control_area', label: 'Área de Microgerenciamento:', type: 'text' }] },
            { id: 'c5_item2', text: '<Strong>2. Micro-Ação de "Soltar as Rédeas":</Strong> Qual é a menor coisa que você poderia fazer para relaxar o controle nessa área? (Ex: Delegar uma pequena decisão, não verificar o e-mail por 1 hora, permitir um pequeno "desvio" no plano).', inputs: [{ name: 'c5_let_go_action', label: 'Minha Micro-Ação:', type: 'textarea' }, { name: 'c5_let_go_done', label: 'Realizei esta micro-ação.', type: 'checkbox' }] },
            { id: 'c5_item3', text: '<Strong>3. Planeje com Buffer (80/20):</Strong> Ao planejar seu próximo dia ou semana, agende apenas 80% do seu tempo. Deixe 20% como um "buffer" para imprevistos, pausas ou oportunidades.', inputs: [{ name: 'c5_buffer_plan', label: 'Como vou aplicar o buffer de 20% no meu próximo planejamento?', type: 'textarea' }] },
            { id: 'c5_item4', text: '<Strong>4. Observe a Reação ao Imprevisto:</Strong> Da próxima vez que um imprevisto surgir, pause por 10 segundos antes de reagir. Observe sua tendência inicial (frustração, pânico) e então pergunte: "Qual é a resposta mais adaptativa aqui?"', inputs: [{ name: 'c5_unexpected_reaction', label: 'Minha observação após um imprevisto:', type: 'textarea' }] }
          ]
        },
        {
          type: 'exercise',
          title: 'Exercício do Capítulo: Desafio do Planejamento 80/20',
          icon: Wrench,
          content: [
              { id: 'c5_ex_step1', title: '1. Planeje seu Próximo Dia de Trabalho:', description: 'Liste as tarefas que pretende fazer. Agora, estime o tempo para cada uma e garanta que o tempo total agendado ocupe no máximo 80% do seu dia de trabalho. (Ex: 6.5h de um dia de 8h).', inputs: [{ name: 'c5_ex_plan', label: 'Meu plano 80/20 para amanhã:', type: 'textarea', rows: 4 }] },
              { id: 'c5_ex_step2', title: '2. Relatório de Campo:', description: 'Ao final do dia, relate como o buffer de 20% foi usado. Foi para resolver problemas? Aproveitar uma oportunidade? Ou simplesmente para ter um respiro e terminar o dia com mais calma?', inputs: [{ name: 'c5_ex_reflection', label: 'Como o buffer foi usado:', type: 'textarea', rows: 3 }, { name: 'c5_ex_done', label: 'Completei o desafio do planejamento 80/20.', type: 'checkbox' }] }
          ]
        }
      ]
  },
  {
      id: 6,
      title: "Capítulo 6: Autoridade Autêntica (Erros)",
      shortTitle: "Autoridade Autêntica",
      icon: BadgeCheck,
      tier: 'Essencial',
      sections: [
        { type: 'quote', content: "A maior prova de que você sabe o que está fazendo é mostrar como já errou no passado... e o que aprendeu com isso." },
        {
          type: 'objective',
          title: 'Objetivo Desta Etapa:',
          icon: Target,
          content: 'Entender como sua jornada através do caos e os erros que você superou podem se tornar fontes de conexão, confiança e autoridade autêntica. Deixar de esconder as cicatrizes e começar a usá-las para ensinar.'
        },
        {
          type: 'custom_jsx', content: <>
            <H3>Por Que Compartilhar Erros Constrói Autoridade?</H3>
            <P>Ao contrário do que se pensa, a vulnerabilidade estratégica não diminui sua autoridade, ela a humaniza e fortalece. Pessoas se conectam com jornadas, não com perfeição.</P>
            <UL>
              <LI><Strong>Gera Conexão:</Strong> Mostra que você enfrentou os mesmos desafios que seu público.</LI>
              <LI><Strong>Cria Confiança:</Strong> Transparência sobre falhas é um sinal de autoconfiança e honestidade.</LI>
              <LI><Strong>Ensina de Verdade:</Strong> Lições aprendidas na prática são mais memoráveis e valiosas do que teoria pura.</LI>
            </UL>
          </>
        },
        {
          type: 'interactive_checklist',
          title: 'Checklist Interativo: Construindo Sua Narrativa de Erro Construtivo',
          icon: CheckSquare,
          content: [
            { id: 'c6_item1', text: '<Strong>1. Relembre uma Lição Valiosa:</Strong> Pense em um erro do passado que te ensinou algo fundamental para o que você faz hoje.', inputs: [{ name: 'c6_lesson', label: 'O erro e a lição aprendida:', type: 'textarea' }] },
            { id: 'c6_item2', text: '<Strong>2. Identifique o Público Beneficiado:</Strong> Quem mais se beneficiaria de ouvir sobre essa lição? (Ex: Clientes, colegas de equipe, seguidores).', inputs: [{ name: 'c6_audience', label: 'Público-alvo:', type: 'text' }] },
            { id: 'c6_item3', text: '<Strong>3. Estruture sua Mini-História:</Strong> Esboce a história em 3 partes: O Contexto (o que eu tentava fazer), O Erro (o que deu errado), A Lição (o que aprendi e como aplico hoje).', inputs: [{ name: 'c6_story_structure', label: 'Esboço da História:', type: 'textarea', rows: 3 }] },
            { id: 'c6_item4', text: '<Strong>4. Verificação Ética e de Intenção:</Strong> Antes de compartilhar, faça uma verificação tripla.', inputs: [
                { name: 'c6_ethics_check1', label: 'Minha intenção é ajudar/ensinar, não apenas me exibir.', type: 'checkbox' },
                { name: 'c6_ethics_check2', label: 'A história não expõe negativamente outras pessoas de forma injusta.', type: 'checkbox' },
                { name: 'c6_ethics_check3', label: 'Eu já superei emocionalmente este erro e posso falar sobre ele de forma construtiva.', type: 'checkbox' }
            ]},
            { id: 'c6_item5', text: '<Strong>5. Compartilhe em Pequena Escala (Teste TAE!):</Strong> Pense na forma mais simples de compartilhar essa história. (Ex: um comentário em uma reunião, um parágrafo em um post, uma conversa com um colega).', inputs: [{ name: 'c6_share_done', label: 'Comprometo-me a compartilhar essa lição em pequena escala esta semana.', type: 'checkbox' }] }
          ]
        }
      ]
  },
  {
      id: 7,
      title: "Capítulo 7: Regra 80/20 na Prática",
      shortTitle: "A Regra 80/20",
      icon: PieChart,
      tier: 'Essencial',
      sections: [
        { type: 'quote', content: "A maioria das coisas não importa tanto quanto você pensa. Descubra o que realmente gera impacto e elimine (ou minimize drasticamente) o resto." },
        {
          type: 'objective',
          title: 'Objetivo Desta Etapa:',
          icon: Target,
          content: 'Aprender a usar o Princípio de Pareto (Regra 80/20) como uma lente poderosa para identificar os poucos elementos (tarefas, esforços, clientes) que geram a maior parte dos resultados (os "20% vitais") e focar sua energia neles.'
        },
        {
          type: 'custom_jsx', content: <>
            <H3>Entendendo a Regra 80/20</H3>
            <P>O Princípio de Pareto afirma que, para muitos eventos, aproximadamente 80% dos efeitos vêm de 20% das causas. Por exemplo:</P>
            <UL>
              <LI>80% dos seus resultados vêm de 20% das suas tarefas.</LI>
              <LI>80% da sua receita vem de 20% dos seus clientes.</LI>
              <LI>80% do seu estresse vem de 20% dos seus problemas.</LI>
            </UL>
            <P>Sua missão é identificar e focar nesses 20% de alto impacto.</P>
          </>
        },
        {
          type: 'interactive_checklist',
          title: 'Checklist Interativo: Aplicando o Filtro 80/20 HOJE',
          icon: CheckSquare,
          content: [
            { id: 'c7_item1', text: '<Strong>1. Faça a Pergunta 80/20 AGORA:</Strong> Olhando para sua lista de tarefas, qual item teria o maior impacto positivo se você o concluísse hoje?', inputs: [{ name: 'c7_8020_question', label: 'Minha Tarefa de Maior Impacto (os 20%):', type: 'textarea' }] },
            { id: 'c7_item2', text: '<Strong>2. Identifique 1 Item Trivial para Eliminar/Reduzir:</Strong> Qual tarefa da sua lista consome tempo mas gera pouco valor (os "80% triviais")?', inputs: [{ name: 'c7_trivial_item', label: 'Tarefa de Baixo Impacto a ser Eliminada/Reduzida:', type: 'text' }] },
            { id: 'c7_item3', text: '<Strong>3. Decida a Ação sobre o Trivial:</Strong> Comprometa-se a não fazer, delegar ou simplificar drasticamente a tarefa de baixo impacto identificada acima.', inputs: [{ name: 'c7_action_taken', label: 'Ação sobre o trivial decidida e comprometida.', type: 'checkbox' }] },
            { id: 'c7_item4', text: '<Strong>4. Proteja o Vital:</Strong> Como você pode garantir que terá tempo e energia para focar na sua tarefa de maior impacto? (Ex: Bloquear agenda, desligar notificações).', inputs: [{ name: 'c7_protect_vital', label: 'Plano para Proteger o Tempo da Tarefa Vital:', type: 'textarea' }] }
          ]
        },
        {
          type: 'exercise',
          title: 'Exercício do Capítulo: Análise 80/20 Pessoal',
          icon: Wrench,
          content: [
            { id: 'c7_ex_step1', title: 'Parte 1: Amplificar o Positivo', description: 'Quais são os 20% de atividades/pessoas na sua vida que te trazem 80% da sua felicidade e energia? Como você pode investir MAIS nelas?', inputs: [{ name: 'c7_ex_amplify', label: 'Atividades/Pessoas a Amplificar:', type: 'textarea' }, { name: 'c7_ex_commit_amplify', label: 'Comprometo-me a dedicar mais tempo a um desses itens esta semana.', type: 'checkbox' }] },
            { id: 'c7_ex_step2', title: 'Parte 2: Reduzir o Negativo', description: 'Quais são os 20% de atividades/problemas que causam 80% do seu estresse e frustração? Qual o menor passo que você pode dar para começar a reduzi-los?', inputs: [{ name: 'c7_ex_reduce', label: 'Atividades/Problemas a Reduzir e Primeiro Passo:', type: 'textarea' }, { name: 'c7_ex_commit_reduce', label: 'Comprometo-me a dar este primeiro passo para reduzir um desses itens.', type: 'checkbox' }] }
          ]
        }
      ]
  },
  {
      id: 8,
      title: "Capítulo 8: Modelo Antifrágil",
      shortTitle: "O Modelo Antifrágil",
      icon: Flame,
      tier: 'Completo',
      sections: [
        { type: 'quote', content: "Não basta ser resistente ao caos. Você precisa aprender a crescer com ele." },
        {
          type: 'objective',
          title: 'Objetivo Desta Etapa:',
          icon: Target,
          content: 'Explorar o conceito de Antifragilidade: a capacidade de sistemas (incluindo você, sua carreira e seus projetos) de se beneficiarem e se fortalecerem com a exposição a estressores, volatilidade, erros e caos.'
        },
        {
          type: 'visual_guide',
          title: 'A Tríade de Taleb: Frágil, Robusto, Antifrágil',
          icon: Stairs,
          content: <>
            <UL>
              <LI><Strong>Frágil:</Strong> Quebra com o estresse e a desordem. Odeia a incerteza. (Ex: Um vaso de cristal).</LI>
              <LI><Strong>Robusto/Resiliente:</Strong> Resiste ao estresse, mas permanece o mesmo. Indiferente à incerteza. (Ex: Uma rocha).</LI>
              <LI><Strong>Antifrágil:</Strong> Fica mais forte com o estresse e a desordem. Adora a incerteza e a opcionalidade. (Ex: O sistema imunológico, que se fortalece após combater um vírus).</LI>
            </UL>
            <P>O objetivo não é prever o futuro, mas construir sistemas que se beneficiem do fato de que o futuro é imprevisível.</P>
          </>
        },
        {
          type: 'interactive_checklist',
          title: 'Checklist Interativo: Construindo Sua Antifragilidade',
          icon: CheckSquare,
          content: [
            { id: 'c8_item1', text: '<Strong>1. Identifique sua MAIOR Fragilidade Atual:</Strong> Onde uma única falha ou imprevisto poderia causar o maior dano em sua vida profissional? (Ex: Depender de um único cliente, uma única habilidade, uma única fonte de renda).', inputs: [{ name: 'c8_fragility', label: 'Minha Maior Fragilidade:', type: 'textarea' }] },
            { id: 'c8_item2', text: '<Strong>2. Aplique a Estratégia Barbell (Micro-Ação):</Strong> A estratégia "Barbell" (haltere) consiste em ser extremamente seguro em uma ponta e assumir pequenos riscos calculados na outra. Defina uma ação para cada ponta.',
              inputs: [
                { name: 'c8_barbell_safety', label: 'Ação de Segurança (Ex: guardar uma pequena quantia de dinheiro, reforçar minha habilidade principal):', type: 'text' },
                { name: 'c8_barbell_opportunity', label: 'Pequena Aposta de Alto Potencial (Ex: fazer um curso rápido de 1h sobre um tema novo, ter uma conversa exploratória):', type: 'text' },
                { name: 'c8_barbell_done', label: 'Comprometo-me a realizar essas duas ações (segurança + aposta).', type: 'checkbox' }
              ]
            },
            { id: 'c8_item3', text: '<Strong>3. Crie Opcionalidade:</Strong> Opcionalidade é ter o direito, mas não a obrigação, de fazer algo. Qual pequena ação hoje poderia abrir novas portas no futuro, mesmo que você não as use? (Ex: Reativar um contato antigo, aprender o básico de uma nova ferramenta).', inputs: [{ name: 'c8_optionality', label: 'Ação para Criar Opcionalidade:', type: 'textarea' }] },
            { id: 'c8_item4', text: '<Strong>4. Transforme um Problema em Oportunidade:</Strong> Pense em um pequeno problema ou erro recente. Como você pode extrair um benefício dele? (Ex: Um bug no software te força a aprender mais sobre o sistema; uma reclamação de cliente te dá um insight valioso).', inputs: [{ name: 'c8_problem_opportunity', label: 'Benefício Extraído de um Problema Recente:', type: 'textarea' }] }
          ]
        }
      ]
  },
  {
      id: 9,
      title: "Capítulo 9: Semana Intensiva MPC",
      shortTitle: "Semana Intensiva MPC",
      icon: CalendarDays,
      tier: 'Completo',
      sections: [
        { type: 'quote', content: "Teoria sem prática é apenas entretenimento. A verdadeira transformação acontece na arena." },
        {
          type: 'objective',
          title: 'Objetivo Desta Etapa:',
          icon: Rocket,
          content: 'Mergulhar de cabeça na prática! Durante os próximos 7 dias, você aplicará intencionalmente os conceitos e ferramentas chave do Método da Produtividade Caótica™. Preencha cada dia ao final dele.'
        },
        {
          type: 'interactive_checklist',
          title: 'Seu Desafio de 7 Dias',
          icon: CheckSquare,
          content: [
            { id: 'c9_item1', text: '<Strong>Dia 1: Mapeando Seu Caos Pessoal.</Strong> Anote as 3 maiores fontes de caos e interrupção no seu dia de hoje.', inputs: [{ name: 'c9_d1_chaos_map', label: 'Fontes de Caos de Hoje:', type: 'textarea' }] },
            { id: 'c9_item2', text: '<Strong>Dia 2: Aplicando o Ciclo MPC.</Strong> Pratique o ciclo "Orientar, Agir, Adaptar" pelo menos uma vez. Defina 1 prioridade, trabalhe nela focada e anote o que aprendeu.', inputs: [{ name: 'c9_d2_mpc_cycle', label: 'Relato do Ciclo MPC:', type: 'textarea' }] },
            { id: 'c9_item3', text: '<Strong>Dia 3: Testando o "Pior Cenário Simulado" (Fear-Setting).</Strong> Use o exercício do Capítulo 2 em uma pequena decisão que você está adiando.', inputs: [{ name: 'c9_d3_fear_setting', label: 'Insight do Fear-Setting:', type: 'textarea' }] },
            { id: 'c9_item4', text: '<Strong>Dia 4: Experimentando um "Erro Controlado" (TAE na Prática).</Strong> Realize um mini-teste de 15 minutos em uma ideia ou projeto, focando no aprendizado.', inputs: [{ name: 'c9_d4_tae_test', label: 'O que aprendi com meu mini-teste:', type: 'textarea' }] },
            { id: 'c9_item5', text: '<Strong>Dia 5: Praticando o Controle Flexível.</Strong> Deixe intencionalmente 20% do seu dia não planejado (buffer) e veja como isso te afeta.', inputs: [{ name: 'c9_d5_buffer', label: 'Como usei meu buffer de 20%:', type: 'textarea' }, { name: 'c9_d5_practiced', label: 'Pratiquei o controle flexível.', type: 'checkbox' }] },
            { id: 'c9_item6', text: '<Strong>Dia 6: Compartilhando uma Lição.</Strong> Compartilhe uma pequena lição aprendida de um erro passado com um colega ou amigo (Autoridade Autêntica).', inputs: [{ name: 'c9_d6_sharing', label: 'Como foi a experiência de compartilhar:', type: 'textarea' }, { name: 'c9_d6_done', label: 'Compartilhei uma lição.', type: 'checkbox' }] },
            { id: 'c9_item7', text: '<Strong>Dia 7: Reflexão Final da Semana.</Strong> Qual foi o maior insight ou mudança de mentalidade que você teve nesta semana intensiva?', inputs: [{ name: 'c9_d7_reflection', label: 'Maior Insight da Semana:', type: 'textarea' }] }
          ]
        }
      ]
  },
  {
      id: 10,
      title: "Capítulo 10: Integrando para Sempre",
      shortTitle: "Integrando para Sempre",
      icon: InfinityIcon,
      tier: 'Completo',
      sections: [
        { type: 'quote', content: "A Produtividade Caótica não é um destino a ser alcançado, mas uma forma de viajar – um processo constante de orientação, ação e adaptação." },
        {
          type: 'objective',
          title: 'Objetivo Desta Etapa:',
          icon: Target,
          content: 'Consolidar seus aprendizados e transformar a Produtividade Caótica em uma filosofia e prática sustentáveis, criando um sistema personalizado que funciona para VOCÊ.'
        },
        {
          type: 'visual_guide',
          title: 'As 10 "Regras" Fundamentais da Produtividade Caótica',
          icon: Lightbulb,
          content: <UL>
            <LI><Strong>1. Aceite o Caos:</Strong> Ele é a norma, não a exceção.</LI>
            <LI><Strong>2. Busque Progresso, não Perfeição:</Strong> Ação imperfeita é melhor que inação perfeita.</LI>
            <LI><Strong>3. Veja o Erro Como Feedback:</Strong> É a sua bússola para o ajuste.</LI>
            <LI><Strong>4. Cultive a Flexibilidade:</Strong> Planos rígidos quebram.</LI>
            <LI><Strong>5. Foque no Vital (80/20):</Strong> A maioria das coisas não importa.</LI>
            <LI><Strong>6. Comece Pequeno (TAE):</Strong> Teste, aprenda, depois expanda.</LI>
            <LI><Strong>7. Abrace a Simplicidade:</Strong> Complexidade é inimiga da execução.</LI>
            <LI><Strong>8. Gerencie Sua Energia, não Apenas seu Tempo:</Strong> Energia é o combustível da ação.</LI>
            <LI><Strong>9. Construa Antifragilidade:</Strong> Fique mais forte com o caos.</LI>
            <LI><Strong>10. Aja Agora:</Strong> O aprendizado está na ação.</LI>
          </UL>
        },
        {
          type: 'interactive_checklist',
          title: 'Checklist Interativo: Criando SEU Sistema MPC Personalizado',
          icon: CheckSquare,
          content: [
            { id: 'c10_item1', text: '<Strong>1. Autoconhecimento Pós-Jornada:</Strong> Qual foi o conceito ou ferramenta deste curso que mais ressoou com você e seu estilo de trabalho?', inputs: [{ name: 'c10_self_awareness', label: 'Conceito Mais Impactante para Mim:', type: 'textarea' }] },
            { id: 'c10_item2', text: '<Strong>2. Selecione Suas Ferramentas Nucleares:</Strong> Das ferramentas (Ciclo MPC, TAE, 80/20, Fear-Setting), quais 1-2 você vai se comprometer a usar consistentemente?', inputs: [{ name: 'c10_core_tools', label: 'Minhas 1-2 Ferramentas Principais:', type: 'text' }] },
            { id: 'c10_item3', text: '<Strong>3. Adapte as Ferramentas à SUA Realidade:</Strong> Como você vai adaptar essas ferramentas ao seu contexto? (Ex: "Meu Ritual da Bússola será de 5 min com café", "Vou usar o TAE para planejar posts de redes sociais").', inputs: [{ name: 'c10_adaptation', label: 'Minha Adaptação Pessoal:', type: 'textarea' }] },
            { id: 'c10_item4', text: '<Strong>4. Planeje a Revisão Contínua (TAE no Sistema!):</Strong> Agende um lembrete em sua agenda (daqui a 1 mês) para revisar seu sistema. Pergunte: "O que está funcionando? O que precisa de ajuste?"', inputs: [{ name: 'c10_review_scheduled', label: 'Agendei minha revisão mensal do sistema.', type: 'checkbox' }] }
          ]
        }
      ]
  },
  {
      id: 11,
      title: "Conclusão: Comece Agora!",
      shortTitle: "Conclusão",
      icon: PlayCircle,
      tier: 'Completo',
      sections: [
        { type: 'quote', content: "A vida não vai ficar mais calma. Mas você pode ficar muito mais potente dentro dela... O caos, agora, está verdadeiramente do seu lado." },
        {
          type: 'objective',
          title: 'Objetivo Desta Etapa:',
          icon: Trophy,
          content: 'Consolidar sua jornada e dar o impulso final e imediato para a ação. A teoria termina aqui; sua revolução de produtividade começa AGORA.'
        },
        {
          type: 'interactive_checklist',
          title: 'Checklist Interativo Final: Ação Imediata!',
          icon: CheckSquare,
          content: [
            { id: 'c11_item1', text: '<Strong>1. Escolha UMA Micro-Ação:</Strong> Com base em tudo que você aprendeu, qual é a menor ação (menos de 5 minutos) que você pode tomar AGORA para iniciar seu novo método?', inputs: [{ name: 'c11_micro_action', label: 'Minha Micro-Ação Imediata:', type: 'text' }] },
            { id: 'c11_item2', text: '<Strong>2. Aja AGORA (Sem Desculpas!):</Strong> Pause a leitura e execute a ação que você definiu acima. Não amanhã, não em uma hora. AGORA.', inputs: [{ name: 'c11_action_done', label: 'Ação imediata realizada!', type: 'checkbox' }] },
            { id: 'c11_item3', text: '<Strong>3. Declare o Começo:</Strong> Marque esta caixa como um compromisso simbólico de que você está iniciando sua nova abordagem à produtividade.', inputs: [{ name: 'c11_declaration_done', label: 'Eu declaro o início da minha jornada com a Produtividade Caótica.', type: 'checkbox' }] },
            { id: 'c11_item4', text: '<Strong>4. Micro-Compartilhamento:</Strong> Compartilhe UM insight que você teve com este material com UMA pessoa. Ensinar é a melhor forma de aprender.', inputs: [{ name: 'c11_sharing_done', label: 'Compartilhei um insight.', type: 'checkbox' }] },
            { id: 'c11_item5', text: '<Strong>5. Prepare o Amanhã (Mini-Bússola):</Strong> Antes de encerrar, defina UMA prioridade para amanhã. Apenas uma. Escreva-a abaixo.', inputs: [{ name: 'c11_tomorrow_compass', label: 'Minha Prioridade #1 para Amanhã:', type: 'textarea' }] }
          ]
        }
      ]
  }
];

export const CHAPTER_COMPLETION_REQUIREMENTS: Record<number, string[]> = {
  0: ['c0_commitment'],
  1: ['c1_task_done', 'c1_5min_rule_done', 'c1_mvp_created', 'c1_exercise_commit'],
  2: ['c2_controlled_error_done', 'c2_ex_decision'],
  3: ['c3_action_blocks_commit', 'c3_ex_commit'],
  4: ['c4_test_executed'],
  5: ['c5_let_go_done', 'c5_ex_done'],
  6: ['c6_ethics_check1', 'c6_ethics_check2', 'c6_ethics_check3', 'c6_share_done'],
  7: ['c7_action_taken', 'c7_ex_commit_amplify', 'c7_ex_commit_reduce'],
  8: ['c8_barbell_done'],
  9: ['c9_d5_practiced', 'c9_d6_done'],
  10: ['c10_review_scheduled'],
  11: ['c11_action_done', 'c11_declaration_done', 'c11_sharing_done'],
};