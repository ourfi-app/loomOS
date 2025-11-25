

'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  Search,
} from 'lucide-react';
import { MdAutoAwesome } from 'react-icons/md';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

// Expanded sample prompts based on user role
const ALL_RESIDENT_PROMPTS = [
  "Just type",
  "Check my payment history",
  "View upcoming community events",
  "Submit a maintenance request",
  "Review building documents",
  "See my household members",
  "Check announcement history",
  "View my profile information",
  "Contact board members",
  "Review community rules",
  "Schedule a meeting",
];

const ALL_ADMIN_PROMPTS = [
  "Just type",
  "Show unpaid accounts",
  "Review pending directory updates",
  "Generate financial report",
  "View all maintenance requests",
  "Check resident onboarding status",
  "Review budget summary",
  "Export payment records",
  "Manage community documents",
  "Send mass announcement",
  "View system analytics",
];

export function SearchAssistantBar() {
  const { data: session } = useSession() || {};
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const userName = session?.user?.name || 'there';
  const firstName = userName.split(' ')[0];
  const isAdmin = session?.user?.role === 'ADMIN';
  
  // All prompts based on role
  const allPrompts = isAdmin ? ALL_ADMIN_PROMPTS : ALL_RESIDENT_PROMPTS;

  // Typing animation effect for cycling prompts
  useEffect(() => {
    if (inputValue || isFocused) {
      setTypedText('');
      return;
    }

    const currentPrompt = allPrompts[currentPromptIndex];
    if (!currentPrompt) return; // Guard against undefined
    
    const isJustType = currentPrompt === "Just type";
    let charIndex = 0;
    let ellipsisIndex = 0;
    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;
    
    // Type out the current prompt (50% slower: 90ms instead of 60ms)
    const typeInterval = setInterval(() => {
      if (charIndex < currentPrompt.length) {
        setTypedText(currentPrompt.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        
        // Now add the ellipsis one dot at a time
        const ellipsisInterval = setInterval(() => {
          if (ellipsisIndex < 3) {
            ellipsisIndex++;
            const dots = ' ' + '.'.repeat(ellipsisIndex) + ' '.repeat(3 - ellipsisIndex);
            setTypedText(currentPrompt + dots.trimEnd());
          } else {
            clearInterval(ellipsisInterval);
            
            // Hold the full prompt with ellipsis
            // "Just type" stays for 3 seconds, others for 2 seconds
            const holdDuration = isJustType ? 3000 : 2000;
            
            timeoutId = setTimeout(() => {
              // Erase the prompt
              intervalId = setInterval(() => {
                if (charIndex > 0) {
                  charIndex--;
                  setTypedText(currentPrompt.slice(0, charIndex));
                } else {
                  clearInterval(intervalId);
                  // Move to next prompt
                  setCurrentPromptIndex((prev) => (prev + 1) % allPrompts.length);
                }
              }, 30);
            }, holdDuration);
          }
        }, 300); // Add dots slowly (300ms each)
      }
    }, 90); // 50% slower typing

    return () => {
      clearInterval(typeInterval);
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [currentPromptIndex, inputValue, isFocused, allPrompts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputValue.trim();
    
    if (query) {
      // Send to Universal Search in AI mode
      const event = new CustomEvent('openUniversalSearchAI', { 
        detail: { message: query } 
      });
      window.dispatchEvent(event);
      setInputValue(''); // Clear input after sending
    }
  };

  return (
    <div className="h-full flex flex-col w-full transition-all duration-300 justify-center">
      {/* Welcome Message - Centered */}
      <div className="mb-3 px-1 max-w-3xl mx-auto w-full">
        <h2 className="text-base font-medium text-white/90 drop-shadow-lg text-center">
          Welcome, <span className="text-white font-semibold">{firstName}</span>
        </h2>
      </div>
      
      {/* Search Bar with Transparent Background - Centered */}
      <form onSubmit={handleSubmit} className="relative group max-w-3xl mx-auto w-full">
        <div className={cn(
          'flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-500 ease-out',
          'bg-white/5 backdrop-blur-md border border-white/10',
          'shadow-[0_8px_32px_rgba(0, 0, 0, 0.9)]',
          isFocused && 'bg-white/8 border-white/20 shadow-[0_12px_48px_rgba(0, 0, 0, 0.9)]'
        )}>
          {/* AI Assistant Icon - Clickable to open Universal Search in AI mode */}
          <button
            type="button"
            onClick={() => {
              // Import and use universal search hook to open in AI mode
              const event = new CustomEvent('openUniversalSearchAI');
              window.dispatchEvent(event);
            }}
            className="relative flex-shrink-0 group/sparkle cursor-pointer hover:scale-110 transition-transform duration-200"
            title="Open AI Assistant"
          >
            {/* Subtle glow that breathes */}
            <div className={cn(
              "absolute inset-0 rounded-full transition-all duration-1000 ease-in-out",
              isFocused 
                ? "shadow-[0_0_12px_rgba(251, 191, 36, 0.3)]"
                : "shadow-[0_0_8px_rgba(251, 191, 36, 0.2)] animate-[pulse_4s_ease-in-out_infinite]"
            )} />
            
            {/* AI icon with subtle warm gradient */}
            <MdAutoAwesome 
              className={cn(
                'w-5 h-5 relative transition-all duration-500 ease-out',
                isFocused ? 'text-amber-400' : 'text-amber-500/80',
                'group-hover/sparkle:text-amber-400 group-hover/sparkle:scale-110'
              )} 
              style={{
                filter: isFocused 
                  ? 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.2))' 
                  : 'drop-shadow(0 0 2px rgba(251, 191, 36, 0.3))',
              }}
            />
          </button>

          {/* Input with Cycling Placeholder */}
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={!inputValue && !isFocused && typedText ? typedText : "Just type..."}
            className={cn(
              "flex-1 h-6 border-0 bg-transparent focus-visible:ring-0 px-0 py-0 text-base font-medium",
              "text-white placeholder:text-white/40 transition-all duration-300"
            )}
          />

          {/* Search Icon - Always visible on right */}
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className={cn(
              "flex-shrink-0 p-1.5 rounded-lg transition-all duration-300",
              inputValue.trim() 
                ? "text-amber-400 hover:text-amber-300 hover:bg-white/10" 
                : "text-white/30 cursor-default"
            )}
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
      </form>


    </div>
  );
}
