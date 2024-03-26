'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useChat, UseChatOptions } from 'ai/react';
import { ArrowUp, Plus } from 'lucide-react'; // <User2 className="text-black-400" size={24} />
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, TooltipArrow } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';

const promptIdeas = [
  'Can you give me a quick update for today?',
  'How many active contracts do we have?',
  'Which customers have active contracts?',
  'When is the next contract renewal?',
  'Which customers have never accessed data they are licensed to?',
  'Which customers have not accessed data in the last 30 days?',
  'How many contracts in progress but not approved?',
  'How many contracts are expiring in the next 30 days?',
  'Please create a new contract for a customer.',
  'Can you give a sentence summary of my most recent agreement?',
];

const promptContext = `
Here are the most recent updates for Zephyr Share. Please answer the prompted questions based on the following data. Don't make up data, just use the data available here. Your tone should be confident, speak as if you are the Zephyr Share AI.:
- Today's update is there are no new cusomters.
- We have 3 contracts in progress and 2 contracts expiring in the next 30 days.
- The most recent agreement is a 3-year contract with a new customer.
- The customer has not accessed data in the last 30 days.
- Our currently active customers are Yes Energy, Argus, and EIA.
- The next contract renewal is coming up with Argus in April 2024.

Always ask the user if they have follow up questions about what they asked.
`;

const chatOptions: UseChatOptions = {
  // initialInput: promptContext    // this is prepending the promptContext to the input field.
};

export default function AIChat() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { messages, input, handleInputChange, setInput, handleSubmit } = useChat(chatOptions);
  const [visiblePrompts, setVisiblePrompts] = useState(promptIdeas.slice(0, 4)); // Initialize with the first 4 prompts
  const { data: session } = useSession();

  async function handleSubmitPrompt() {
    if (input.length > 0) {
      // Create a new fake e: React.FormEvent<HTMLFormElement> to pass to handleSubmit
      // const e = new Event('e') as React.FormEvent<HTMLFormElement>;
      // @ts-ignore
      const e = { preventDefault: () => {} } as React.FormEvent<HTMLFormElement>;
      handleSubmit(e);
      return;
    }
  }

  function showMorePrompts() {
    setVisiblePrompts((currentPrompts) => {
      const nextVisibleCount = currentPrompts.length + 2;
      return promptIdeas.slice(0, Math.min(nextVisibleCount, promptIdeas.length));
    });
  }

  function handleButtonClick(text: string) {
    setInput(`${text}\n\n\n${promptContext}`);

    // focus on the textarea
    textareaRef.current?.focus();
  }

  return (
    <div className="flex flex-col w-full max-w-2xl py-10 mx-auto stretch">
      <div className="w-full">
        <div className="relative">
          <TooltipProvider delayDuration={50}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    'absolute right-4 top-3 h-8 w-8 rounded-md cursor-pointer flex justify-center items-center',
                    input.length > 0 ? 'bg-gray-700' : 'bg-gray-300'
                  )}
                  onClick={handleSubmitPrompt}
                >
                  <ArrowUp className="text-grey" size={25} color="white" />
                </div>
              </TooltipTrigger>
              <TooltipContent sideOffset={17}>
                <p>Send message</p>
                {/* <TooltipArrow width={11} height={5} /> */}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Textarea
            ref={textareaRef}
            className="py-4 px-4 mb-2 min-h-0 border border-gray-300 rounded-lg shadow-sm text-sm font-light tracking-normal resize-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-opacity-0"
            value={input}
            placeholder="Ask Zephyr Share..."
            onChange={handleInputChange}
            // when the user presses enter, the form will submit. HOWEVER, if the user presses shift+enter, the form will not submit.
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmitPrompt();
              }
            }}
            autoFocus
            rows={1}
          />
        </div>
        <div className="pb-4 flex flex-wrap w-full relative max-h-48 overflow-y-scroll">
          {visiblePrompts.map((prompt: string, i: number) => (
            <Button
              key={i}
              className="rounded-3xl px-2 py-0 h-8 mr-2 mt-2 font-normal text-sm"
              variant="outline"
              onClick={() => handleButtonClick(prompt)}
            >
              {prompt}
            </Button>
          ))}
          <TooltipProvider delayDuration={50}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="absolute top-3 right-0 cursor-pointer" onClick={showMorePrompts}>
                  <Plus className="text-black-400" size={20} />
                  <TooltipContent sideOffset={5}>
                    <p>Show more sample prompts</p>
                  </TooltipContent>
                </div>
              </TooltipTrigger>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      {messages.map((m) => (
        <div key={m.id} className="flex items-top space-x-3 mt-6">
          <div className="flex-shrink-0">
            {m.role === 'user' ? (
              <Image
                src={session?.user?.image ?? `https://avatar.vercel.sh/${session?.user?.email}`}
                width={50}
                height={50}
                alt={session?.user?.name ?? 'User avatar'}
                className="h-10 w-10 rounded-full"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span>ZS</span>
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <h4 className="text-sm font-bold">{m.role === 'user' ? 'You' : 'Zephyr Share'}</h4>
            <div className="whitespace-pre-wrap text-sm">{m.content.split('\n\n\n')[0]}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
