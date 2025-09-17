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
      title: 'Check my emails',
      label: 'and summarize important messages',
      action: 'Check my recent Gmail inbox for important emails and give me a brief summary of anything urgent.',
      appSlugs: ['app_1TpJxE'],
      webSearchIcon: false,
    },
    {
      title: 'What\'s on my calendar',
      label: 'for tomorrow',
      action: 'Show me my Google Calendar events for tomorrow and highlight any important meetings.',
      appSlugs: ['app_13Gh2V'],
    },
    {
      title: 'Create a task list',
      label: 'in Notion for today',
      action: 'Create a new task list page in Notion for today with sections for urgent, important, and nice-to-have items.',
      appSlugs: ['app_X7Lhxr'],
    },
    {
      title: 'Analyze my GitHub activity',
      label: 'from the past week',
      action: 'Show me my GitHub commits and pull requests from the past week and summarize what I worked on.',
      appSlugs: ['app_OrZhaO'],
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
            className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 flex-col gap-1 w-full h-auto justify-start items-start"
          >
            <div className="flex justify-between items-start w-full">
              <span className="font-medium">{suggestedAction.title}</span>
              {(suggestedAction.appSlugs && suggestedAction.appSlugs.length > 0 || suggestedAction.webSearchIcon) && (
                <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                  {/* Add web search icon */}
                  {suggestedAction.webSearchIcon && (
                    <div 
                      className="size-5 rounded-sm overflow-hidden flex items-center justify-center bg-muted/20"
                    >
                      <Globe className="size-4 text-foreground/70 dark:text-white" />
                    </div>
                  )}
                  {/* Add app icons (limit to 2) */}
                  {suggestedAction.appSlugs && suggestedAction.appSlugs.slice(0, suggestedAction.webSearchIcon ? 2 : 3).map((slug) => (
                    <div 
                      key={`app-icon-${slug}`} 
                      className="size-5 rounded-sm overflow-hidden flex items-center justify-center"
                    >
                      <img
                        src={`https://pipedream.com/s.v0/${slug}/logo/48`}
                        alt={slug}
                        className="size-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <span className="text-muted-foreground break-words">
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
