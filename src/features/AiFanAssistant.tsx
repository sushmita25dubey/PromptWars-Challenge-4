import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store';
import { runGeminiPrompt } from '../services/gemini';
import { VoiceAssistant } from '../components/VoiceAssistant';
import { Send, Bot, User, Trash2, ArrowRight } from 'lucide-react';
import { FAN_ASSISTANT_SUGGESTIONS } from '../constants';

export const AiFanAssistant: React.FC = () => {
  const { chatHistory, addChatMessage, clearChatHistory } = useAppStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    // 1. Add User Message
    addChatMessage({
      sender: 'user',
      content: textToSend,
    });
    setInput('');
    setIsTyping(true);

    try {
      // 2. Fetch response from simulated / live Gemini service
      const response = await runGeminiPrompt(textToSend, "You are a helpful FIFA World Cup 2026 Stadium AI Assistant. Respond in short, accessible bullet points where possible.");
      
      // 3. Add AI Message
      addChatMessage({
        sender: 'ai',
        content: response,
      });
    } catch (e) {
      console.error(e);
      addChatMessage({
        sender: 'ai',
        content: 'Sorry, I am having trouble connecting to stadium services. Please try again or notify a nearby steward.',
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleVoiceInput = (transcript: string) => {
    setInput(transcript);
    handleSendMessage(transcript);
  };

  // Get last AI response to enable speech output
  const lastAiMessage = [...chatHistory].reverse().find(msg => msg.sender === 'ai')?.content;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-fifa-gold/15 text-fifa-gold">
            <Bot className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              FIFA AI Fan Assistant
              <span className="text-xxs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-1 py-0.5 rounded font-mono">Gemini 1.5</span>
            </h3>
            <p className="text-xxs text-slate-400">Ask about seat routing, restrooms, schedules, or transit options</p>
          </div>
        </div>
        <button
          onClick={clearChatHistory}
          className="p-2 rounded-lg bg-slate-800/40 hover:bg-rose-950/20 text-slate-400 hover:text-rose-400 transition-colors border border-slate-800 hover:border-rose-900/30 text-xs flex items-center gap-1.5 focus:outline-none"
          title="Clear Conversation"
          aria-label="Clear chat messages"
        >
          <Trash2 className="h-4 w-4" />
          <span className="hidden sm:inline">Clear Chat</span>
        </button>
      </div>

      {/* Suggested Questions Area */}
      <div className="px-4 py-3 bg-slate-950/40 border-b border-slate-800 flex flex-wrap gap-2 items-center">
        <span className="text-xxs text-slate-400 font-semibold uppercase tracking-wider mr-1">Suggestions:</span>
        {FAN_ASSISTANT_SUGGESTIONS.map((q, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(q)}
            className="text-xxs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700/60 hover:border-slate-600 text-slate-300 hover:text-slate-100 transition-colors flex items-center gap-1 focus:outline-none focus:ring-1 focus:ring-fifa-gold"
          >
            <span>{q}</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/20">
        {chatHistory.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div 
              key={msg.id}
              className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center border shrink-0 ${
                isUser 
                  ? 'bg-slate-800 border-slate-700 text-slate-300' 
                  : 'bg-fifa-gold/15 border-fifa-gold/30 text-fifa-gold shadow-md shadow-amber-950/5'
              }`}>
                {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              {/* Message Bubble */}
              <div className="space-y-1">
                <div className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line border ${
                  isUser 
                    ? 'bg-slate-800 text-slate-100 border-slate-700/50 rounded-tr-none' 
                    : 'bg-slate-900 text-slate-200 border-slate-850 rounded-tl-none shadow-sm'
                }`}>
                  {msg.content}
                </div>
                <div className={`text-[10px] text-slate-500 font-mono ${isUser ? 'text-right' : ''}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex gap-3 max-w-[85%]">
            <div className="h-8 w-8 rounded-lg bg-fifa-gold/15 border border-fifa-gold/30 text-fifa-gold flex items-center justify-center">
              <Bot className="h-4 w-4 animate-bounce" />
            </div>
            <div className="p-3 bg-slate-900 border border-slate-850 rounded-2xl rounded-tl-none flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Tray */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(input);
        }}
        className="p-4 border-t border-slate-800 bg-slate-900/50 flex gap-2 items-center"
      >
        <div className="flex-1 relative flex items-center bg-slate-950 border border-slate-800 rounded-xl overflow-hidden focus-within:border-slate-700 transition-colors">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Stadium AI Assistant..."
            className="w-full bg-transparent px-4 py-3 border-none outline-none text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:ring-0"
            aria-label="Ask Stadium AI Assistant"
          />
          {input.trim() && (
            <button
              type="submit"
              className="mr-2 p-2 rounded-lg bg-fifa-gold text-slate-950 hover:bg-amber-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 focus:ring-fifa-gold"
            >
              <Send className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Voice Recognition / Synthesis Controls */}
        <VoiceAssistant 
          onTranscript={handleVoiceInput} 
          textToSpeak={lastAiMessage}
        />
      </form>
    </div>
  );
};
