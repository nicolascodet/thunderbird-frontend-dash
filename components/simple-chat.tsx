'use client';

import type { Attachment, UIMessage } from 'ai';
import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import { generateUUID } from '@/lib/utils';
import { MultimodalInput } from './multimodal-input';
import { Messages } from './messages';

export function SimpleChat({
  id,
  initialMessages,
}: {
  id: string;
  initialMessages: Array<UIMessage>;
}) {
  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    status,
    stop,
    reload,
  } = useChat({
    id,
    api: '/api/chat',
    body: { id, selectedChatModel: 'gpt-4o-mini' },
    initialMessages,
    experimental_throttle: 100,
    sendExtraMessageFields: true,
    generateId: generateUUID,
  });

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col justify-center items-center px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-8">
              How can I help you today?
            </h1>
          </div>

          <div className="w-full max-w-2xl">
            <MultimodalInput
              chatId={id}
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              status={status}
              stop={stop}
              attachments={attachments}
              setAttachments={setAttachments}
              messages={messages}
              setMessages={setMessages}
              append={append}
            />
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-hidden">
            <Messages
              chatId={id}
              status={status}
              votes={[]}
              messages={messages}
              setMessages={setMessages}
              reload={reload}
              isReadonly={false}
              isArtifactVisible={false}
              append={append}
              isSignedIn={true}
            />
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="max-w-4xl mx-auto">
              <MultimodalInput
                chatId={id}
                input={input}
                setInput={setInput}
                handleSubmit={handleSubmit}
                status={status}
                stop={stop}
                attachments={attachments}
                setAttachments={setAttachments}
                messages={messages}
                setMessages={setMessages}
                append={append}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}