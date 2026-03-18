"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, Loader2, Bot } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";

interface Message {
  role: "user" | "ai";
  content: string;
}

export function AIChatPanel({
  isOpen,
  onClose,
  lessonContext,
  courseContext
}: {
  isOpen: boolean;
  onClose: () => void;
  lessonContext?: any;
  courseContext?: any;
}) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Hi! I'm Aria, your Ascendia AI Tutor. I'm trained on this exact lesson. What can I clarify for you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  
  const { profile } = useAuthStore();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsTyping(true);

    try {
      const response = await fetch("/api/ai-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userMessage,
          lessonContext,
          courseContext,
          userId: profile?.id
        })
      });

      if (!response.body) throw new Error("No stream");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      setIsTyping(false);
      
      // Add empty AI message to append tokens to
      setMessages(prev => [...prev, { role: "ai", content: "" }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        
        setMessages(prev => {
          const newMessages = [...prev];
          const lastIndex = newMessages.length - 1;
          newMessages[lastIndex] = {
            ...newMessages[lastIndex],
            content: newMessages[lastIndex].content + chunk
          };
          return newMessages;
        });
      }
    } catch (error) {
      console.error(error);
      setIsTyping(false);
      setMessages(prev => [...prev, { role: "ai", content: "Sorry, I had trouble connecting across the void. Please try again!" }]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 right-0 md:right-8 md:bottom-8 w-full md:w-[400px] h-[85vh] md:h-[600px] bg-[#0f1018]/95 backdrop-blur-2xl border border-white/10 rounded-t-3xl md:rounded-3xl shadow-2xl z-[101] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="h-16 border-b border-white/10 px-6 flex items-center justify-between bg-gradient-to-r from-[#7c6df0]/10 to-transparent shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#7c6df0] to-[#38bdf8] flex items-center justify-center shadow-[0_0_15px_rgba(124,109,240,0.5)]">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-syne font-bold text-sm">Aria AI Tutor</h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium tracking-widest uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </div>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar relative">
              <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-[#0f1018] to-transparent pointer-events-none" />
              
              {messages.map((msg, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i}
                  className={`flex flex-col max-w-[85%] ${msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"}`}
                >
                  <div className={`text-[10px] uppercase tracking-wider font-bold mb-1.5 px-1 ${msg.role === "user" ? "text-white/40" : "text-[#7c6df0]"}`}>
                    {msg.role === "user" ? "You" : "Aria"}
                  </div>
                  <div className={`p-4 text-sm leading-relaxed ${
                    msg.role === "user" 
                      ? "bg-white text-black rounded-2xl rounded-tr-sm" 
                      : "bg-[#161820] border border-white/5 text-white/90 rounded-2xl rounded-tl-sm"
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 mr-auto max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-[#161820] flex items-center justify-center shrink-0 border border-white/5">
                    <Bot className="w-4 h-4 text-[#7c6df0]" />
                  </div>
                  <div className="bg-[#161820] border border-white/5 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1">
                    <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-[#7c6df0] rounded-full" />
                    <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-[#7c6df0] rounded-full" />
                    <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-[#7c6df0] rounded-full" />
                  </div>
                </motion.div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input Footer */}
            <div className="p-4 border-t border-white/10 bg-[#0f1018] shrink-0">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask a question..."
                  className="w-full bg-[#161820] border border-white/10 rounded-full pl-5 pr-12 py-3.5 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#7c6df0] transition-shadow"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 p-2 bg-[#7c6df0] hover:bg-[#6c63ff] disabled:bg-white/10 disabled:text-white/30 text-white rounded-full transition-colors flex items-center justify-center group"
                >
                  <Send className="w-4 h-4 -ml-0.5 group-hover:scale-110 transition-transform" />
                </button>
              </div>
              <div className="flex gap-2 mt-3 overflow-x-auto hide-scrollbar pb-1">
                <button onClick={() => setInput("Explain this module simply.")} className="shrink-0 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/60 text-xs rounded-full border border-white/5 transition-colors whitespace-nowrap">
                  Simplify this module
                </button>
                <button onClick={() => setInput("Give me an analogy.")} className="shrink-0 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/60 text-xs rounded-full border border-white/5 transition-colors whitespace-nowrap">
                  Give me an analogy
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
