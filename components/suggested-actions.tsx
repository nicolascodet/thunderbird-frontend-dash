'use client';

import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { memo, useState } from 'react';
import { useEffectiveSession } from '@/hooks/use-effective-session';
import { UseChatHelpers } from '@ai-sdk/react';
import { SignInModal } from './sign-in-modal';
import { useIsMobile } from '../hooks/use-mobile';
import { Globe } from 'lucide-react';

interface SuggestedActionsProps {
  chatId: string;
  append: UseChatHelpers['append'];
}

interface SuggestedAction {
  title: string;
  label: string;
  action: string;
  appSlugs?: string[];
  webSearchIcon?: boolean;
}

function PureSuggestedActions({ chatId, append }: SuggestedActionsProps) {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const { status: authStatus } = useEffectiveSession();
  const isMobile = useIsMobile();
  
  const handleActionClick = (e: React.MouseEvent, actionText: string) => {
    // Prevent default button behavior which might cause navigation
    e.preventDefault();
    e.stopPropagation();
    
    if (authStatus === 'unauthenticated') {
      try {
        // Save action text to localStorage as a JSON string so useLocalStorage can parse it
        localStorage.setItem('input', JSON.stringify(actionText));
        setIsSignInModalOpen(true);
      } catch (error) {
        console.error('Error saving suggestion to localStorage:', error);
      }
      return;
    }
    
    // User is authenticated, proceed with the action
    window.history.replaceState({}, '', `/chat/${chatId}`);
    append({
      role: 'user',
      content: actionText,
    });
  };
  
  const suggestedActions: SuggestedAction[] = [
    {
      title: 'Research my competitors',
      label: 'and create a summary report',
      action: 'Research my top 3 competitors and create a comprehensive summary of their latest updates, features, and market positioning.',
      appSlugs: [],
      webSearchIcon: true,
    },
    {
      title: 'Plan my week',
      label: 'based on my priorities',
      action: 'Help me plan my week by reviewing my calendar and suggesting time blocks for deep work, meetings, and breaks.',
      appSlugs: ['app_13Gh2V'],
    },
    {
      title: 'Write a project update',
      label: 'for my team',
      action: 'Draft a project status update email for my team, highlighting completed milestones, current progress, and next steps.',
      appSlugs: [],
    },
    {
      title: 'Brainstorm new ideas',
      label: 'for product improvements',
      action: 'Help me brainstorm creative ideas for improving our product based on current market trends and user feedback.',
      appSlugs: [],
      webSearchIcon: true,
    },
  ];

  return (
    <>
      <SignInModal 
        isOpen={isSignInModalOpen} 
        onClose={() => setIsSignInModalOpen(false)} 
      />
      
      <div
        data-testid="suggested-actions"
        className="grid sm:grid-cols-2 gap-2 w-full"
      >
      {suggestedActions.slice(0, isMobile ? 2 : 4).map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className="block"
        >
          <Button
            variant="ghost"
            onClick={(e) => handleActionClick(e, suggestedAction.action)}
            className="text-left border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3.5 text-sm flex-1 flex-col gap-1 w-full h-auto justify-start items-start hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            <span className="font-medium text-gray-900 dark:text-gray-100">{suggestedAction.title}</span>
            <span className="text-gray-600 dark:text-gray-400 text-xs break-words">
              {suggestedAction.label}
            </span>
          </Button>
        </motion.div>
      ))}
    </div>
    </>
  );
}

export const SuggestedActions = memo(PureSuggestedActions, () => true);
