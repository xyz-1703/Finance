import React, { useState, useEffect, useRef } from "react";
import api from "../api/client";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I am the QuantVista AI assistant. How can I help you today?" }
  ]);
  const [inputStr, setInputStr] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const isAuthenticated = Boolean(localStorage.getItem("access_token"));
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      api.get("/chat/")
        .then(res => {
          if (res.data && res.data.length > 0) {
            setMessages(res.data);
          }
        })
        .catch(console.error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (overrideText = null) => {
    const text = (typeof overrideText === 'string' ? overrideText : inputStr).trim();
    if (!text) return;

    // Add user message to UI immediately
    setMessages(prev => [...prev, { sender: "user", text }]);
    setInputStr("");
    setIsTyping(true);

    try {
      const response = await api.post("/chat/", { message: text });
      setMessages(prev => [...prev, { sender: "bot", text: response.data.reply }]);
    } catch (error) {
      console.error("Chatbot API Error:", error);
      setMessages(prev => [...prev, { sender: "bot", text: "Sorry, I am having trouble connecting to my service right now." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-[350px] sm:w-[400px] h-[500px] bg-white dark:bg-[#151a22] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-white/10 mb-4 transition-all duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 p-4 flex items-center justify-between text-white flex-shrink-0">
            <div>
              <h3 className="font-bold text-lg leading-tight">QuantVista AI</h3>
              <p className="text-xs text-white/80">
                {isAuthenticated ? "Personalized AI Assistant" : "General Purpose Assistant"}
              </p>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                 <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 dark:bg-finance-bg flex flex-col gap-4">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div 
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                    m.sender === "user" 
                      ? "bg-emerald-500 text-white rounded-br-none shadow-md shadow-emerald-500/20" 
                      : "bg-white dark:bg-finance-card text-slate-800 dark:text-white rounded-bl-none shadow-sm border border-slate-100 dark:border-white/5"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-finance-card px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1 border border-slate-100 dark:border-white/5">
                  <div className="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
                  <div className="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce" style={{animationDelay: "0.4s"}}></div>
                </div>
              </div>
            )}
            
            {/* Quick Suggestions for General Chat */}
            {!isAuthenticated && messages.length === 1 && !isTyping && (
              <div className="flex flex-wrap gap-2 pt-2 animate-fade-in">
                {["What is stock?", "What is portfolio?", "How to invest?"].map((q, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleSend(q)} 
                    className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-xs px-3 py-1.5 rounded-full transition-colors border border-emerald-200 dark:border-emerald-500/20 shadow-sm"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white dark:bg-[#151a22] border-t border-slate-200 dark:border-white/10 flex gap-2 flex-shrink-0">
            <input 
              type="text" 
              value={inputStr}
              onChange={(e) => setInputStr(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={isAuthenticated ? "Ask about your portfolio..." : "Ask a finance question..."}
              className="flex-1 bg-slate-100 dark:bg-white/5 border-none outline-none rounded-xl px-4 py-2 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/50 transition-all"
            />
            <button 
              onClick={handleSend}
              disabled={isTyping || !inputStr.trim()}
              className="bg-emerald-500 hover:bg-emerald-600 text-white p-2.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md shadow-emerald-500/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
                 <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>

        </div>
      )}

      {/* Floating Action Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-[0_8px_30px_rgba(16,185,129,0.3)] flex items-center justify-center transition-all hover:-translate-y-1 animate-bounce hover:animate-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}
    </div>
  );
}
