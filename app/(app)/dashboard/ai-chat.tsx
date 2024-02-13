'use client';

import { useChat } from 'ai/react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
export default function AIChat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map((m) => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content}
        </div>
      ))}

      <div className="fixed bottom-0 w-full max-w-md">
        <Label className="text-md">Ask Zephyr Share...</Label>
        <form onSubmit={handleSubmit}>
          <Textarea
            className=" p-2 mb-8 border border-gray-300 rounded shadow-xl text-md"
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
            // when the user presses enter, the form will submit. HOWEVER, if the user presses shift+enter, the form will not submit.
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit(e)}
            rows={3} // default 3 lines
          />
        </form>
      </div>
    </div>
  );
}
