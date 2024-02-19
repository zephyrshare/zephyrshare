'use client';

import { useRef } from 'react';
import { useChat } from 'ai/react';
import { ArrowUp, User2, Shuffle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, TooltipArrow } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const promptIdeas = [
  'Can you give me a quick update for today?',
  'How many active contracts do we have?',
  'When is the next contract renewal?',
  'Which customers have never accessed data they are licensed to?',
  'Which customers have not accessed data in the last 30 days?',
  'How many contracts in progress but not approved?',
  'How many contracts are expiring in the next 30 days?',
  'Please create a new contract for a customer.'
];

export default function AIChat() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { messages, input, handleInputChange, setInput, handleSubmit } = useChat();

  async function handleSubmitPrompt() {
    if (input.length > 0) {
      // Create a new fake e: React.FormEvent<HTMLFormElement> to pass to handleSubmit
      // const e = new Event('e') as React.FormEvent<HTMLFormElement>;
      // @ts-ignore
      const e = { preventDefault: () => {} } as React.FormEvent<HTMLFormElement>;
      handleSubmit(e);
    }
  }

  function handleButtonClick(text: string) {
    setInput(text);

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
            className="py-4 px-4 mb-2 min-h-0 border border-gray-300 rounded-lg shadow-sm text-md font-light tracking-normal resize-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-opacity-0"
            value={input}
            placeholder="Ask Zephyr Share..."
            onChange={handleInputChange}
            // when the user presses enter, the form will submit. HOWEVER, if the user presses shift+enter, the form will not submit.
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmitPrompt()}
            autoFocus
            rows={1}
          />
        </div>
        <div className="pb-4 flex flex-wrap w-full">
          {/* Start by displaying 4 random prompts from the array. At most, 4 sample prompts should be displayed */}
          {promptIdeas.map((prompt) => (
            <Button
              className="rounded-3xl px-2 py-0 h-8 mr-2 mt-2 font-normal text-sm"
              variant="outline"
              onClick={() => handleButtonClick(prompt)}
            >
              {prompt}
            </Button>
          ))}
          {/* Shuffle Icon here absolute positioned (within THIS parent div) bottom right 5 px each. When the shuffle is hovered, a tooltip over the Shuffle Icon shows saying "Shuffle prompts" (see other tooltip example). When the shuffle icon is clicked, 4 random prompts should be shown */}
        </div>
      </div>
      {messages.map((m) => (
        <div key={m.id} className="flex items-top space-x-3 mt-6">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              {m.role === 'user' ? (
                <User2 className="text-black-400" size={24} />
              ) : (
                <span>ZS</span> // Placeholder for Zephyr Share, adjust as needed
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <h4 className="text-sm font-bold">{m.role === 'user' ? 'You' : 'Zephyr Share'}</h4>
            <div className="whitespace-pre-wrap text-sm">{m.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
