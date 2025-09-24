// Fix: Import React types to resolve JSX and React namespace errors.
import type React from 'react';

export type UserRole = 'Professor' | 'Administrador';

export type StaffUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
  joinedDate: string;
};

export type UserTier = 'Grátis' | 'Essencial' | 'Completo';

export type UserProfile = {
  name: string;
  email: string;
  avatarUrl: string;
  role?: UserRole; // Adicionado para refletir a coluna 'role' no perfil do Supabase
};

export type Student = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  tier: UserTier;
  joinedDate: string;
  progress: number;
};

export type FormInput = {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'checkbox' | 'date';
  placeholder?: string;
  min?: string;
  max?: string;
  className?: string;
  subText?: string;
  rows?: number;
  optional?: boolean;
};

export type ChecklistItem = {
  id: string;
  text: string;
  subText?: string;
  inputs?: FormInput[];
};

export type ExerciseStep = {
  id:string;
  title: string;
  description?: string;
  inputs: FormInput[];
  example?: {
    title: string;
    // Fix: Replaced JSX.Element with React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
    content: React.ReactElement;
  }
};

export type ChapterSection = {
  type: 'quote' | 'objective' | 'interactive_checklist' | 'exercise' | 'custom_jsx' | 'heading' | 'visual_guide';
  title?: string;
  content: any;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
};

export interface Chapter {
  id: number;
  title: string;
  shortTitle: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  tier: UserTier;
  sections: ChapterSection[];
}

export interface SearchResult {
  chapterId: number;
  chapterTitle: string;
  snippet: string;
  isLocked: boolean;
}

export type Note = {
  id: string;
  content: string;
};

export type Task = {
  id: string;
  text: string;
  completed: boolean;
  reminder?: string | null;
};

export type WeeklyGoal = {
  id: string;
  description: string;
  target: number;
  current: number;
};

export type Announcement = {
  message: string;
  displayType: 'banner' | 'notification' | 'both';
};

export type GlobalNotification = {
  id: string;
  message: string;
};