import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I am the GREENCHAIN AI Guide. How can I help you optimize your logistics today?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getAIResponse = async (userMessage: string): Promise<string> => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      // Smart fallback responses based on keywords
      const msg = userMessage.toLowerCase();
      if (msg.includes('carbon') || msg.includes('co2') || msg.includes('emission')) {
        return "Great question about carbon! Our AI dashboard tracks real-time emissions. You can run an Eco-Score audit in the Supplier Scanner above to get detailed CO₂ data. Carbon credits are calculated at Rs. 2,000 per ton saved.";
      }
      if (msg.includes('truck') || msg.includes('fleet') || msg.includes('ev') || msg.includes('vehicle')) {
        return "For fleet management, check your 'My Company Account' to see the Fleet Roadmap tab. Our AI recommends converting Diesel trucks to EV — each conversion saves 3-12 tons CO₂ and Rs. 20,000-80,000/year.";
      }
      if (msg.includes('route') || msg.includes('logistics') || msg.includes('shipping') || msg.includes('delivery')) {
        return "Our AI Carbon Calculator can optimize your routes! Enter your origin and destination (Indian cities) to get eco-friendly routing with CO₂ savings. The Truck Pooling Marketplace then matches you with shared freight opportunities to cut costs by up to 50%.";
      }
      if (msg.includes('eu') || msg.includes('regulation') || msg.includes('csrd') || msg.includes('cbam') || msg.includes('compliance')) {
        return "EU regulations are critical! After running a scan, you'll see the EU Regulation Risk Meter showing CSRD, CBAM, and EUDR compliance. Eco-Score ≥70 = PASS, 50-70 = WARNING, <50 = FAIL with €12M fine risk.";
      }
      if (msg.includes('pdf') || msg.includes('report') || msg.includes('download')) {
        return "You can download a comprehensive PDF report after running an Eco-Score audit. The report includes your company's score, risk level, key findings, and AI recommendations — all powered by Gemini 1.5 Flash.";
      }
      if (msg.includes('price') || msg.includes('cost') || msg.includes('money') || msg.includes('save') || msg.includes('rupee')) {
        return "GREENCHAIN helps save money through: 1) Truck pooling (save Rs. 3,800-5,200 per route), 2) EV conversion (save Rs. 20k-80k/year per truck), 3) Carbon credits (Rs. 2,000 per ton). All values in Indian Rupees!";
      }
      if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
        return "Hello! 👋 I'm here to help with supply chain sustainability. You can ask me about carbon tracking, fleet management, EU regulations, eco-routing, or our AI-powered features. What would you like to explore?";
      }
      return "I can help with: carbon tracking, fleet EV conversions, eco-routing, EU compliance (CSRD/CBAM/EUDR), truck pooling, and PDF reports. Try asking about any of these topics, or scroll up to use the Supplier Scanner for a detailed AI audit!";
    }

    // Real Gemini API call
    try {
      const prompt = `You are GREENCHAIN AI assistant for a green supply chain platform. The platform features: Eco-Score audits, Carbon Dashboard with Rs. 2000/ton credit system, Fleet Roadmap with EV conversion, Truck Pooling Marketplace, EU Regulation Risk Meter (CSRD/CBAM/EUDR). All money in Indian Rupees (Rs.). Answer this user question concisely in 2-3 sentences: "${userMessage}"`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
      return "I'm having trouble connecting right now. Please try again in a moment!";
    } catch {
      return "Connection issue — but I can still help! Ask about carbon tracking, fleet management, eco-routing, or EU compliance.";
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
    setInput('');
    setIsThinking(true);

    const response = await getAIResponse(userMsg);
    setMessages(prev => [...prev, { text: response, isBot: true }]);
    setIsThinking(false);
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-600 hover:bg-green-500 rounded-full flex items-center justify-center shadow-2xl z-50 transition-transform hover:scale-110"
      >
        <MessageSquare className="w-6 h-6 text-white" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-[350px] h-[500px] glass-panel z-50 flex flex-col overflow-hidden"
          >
            <div className="bg-dark-900/80 p-4 border-b border-white/10 flex justify-between items-center backdrop-blur-md">
              <div className="flex items-center gap-2">
                <Bot className="w-6 h-6 text-green-400" />
                <div>
                  <span className="font-semibold text-sm">GREENCHAIN AI Guide</span>
                  <span className="flex items-center gap-1 text-xs text-green-400">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Online
                  </span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-dark-800/50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.isBot ? 'bg-dark-900 border border-white/5 text-gray-300 rounded-tl-sm' : 'bg-green-600 text-white rounded-tr-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isThinking && (
                <div className="flex justify-start">
                  <div className="bg-dark-900 border border-white/5 p-3 rounded-2xl rounded-tl-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 bg-dark-900/80 border-t border-white/10">
              <form onSubmit={handleSend} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about carbon, routes, fleet..."
                  disabled={isThinking}
                  className="flex-1 bg-dark-800 border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-green-500 disabled:opacity-50"
                />
                <button type="submit" disabled={isThinking} className="p-2 bg-green-600 rounded-full text-white hover:bg-green-500 disabled:opacity-50">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
