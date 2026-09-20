import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, CheckCircle2 } from 'lucide-react';

export const SignupModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailData, setEmailData] = useState({ email: '', company: '' });
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(r => setTimeout(r, 1200));

    setIsLoading(false);
    setIsDone(true);
  };

  const resetAndClose = () => {
    setTimeout(() => {
      setEmailData({ email: '', company: '' });
      setIsDone(false);
    }, 300);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetAndClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md z-[101]"
          >
            <div className="glass-panel p-8 relative overflow-hidden bg-dark-900 border-green-500/30">
              <button 
                onClick={resetAndClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {!isDone ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2">Join Greenchain AI</h3>
                    <p className="text-sm text-gray-400">Start optimizing your supply chain today.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Company Email</label>
                      <input 
                        type="email" 
                        required
                        value={emailData.email}
                        onChange={(e) => setEmailData({...emailData, email: e.target.value})}
                        placeholder="logistics@company.com" 
                        className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Company Name</label>
                      <input 
                        type="text" 
                        required
                        value={emailData.company}
                        onChange={(e) => setEmailData({...emailData, company: e.target.value})}
                        placeholder="GlobalTech Logistics" 
                        className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500"
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-all"
                    >
                      {isLoading ? (
                        <span className="animate-pulse">Provisioning Workspace...</span>
                      ) : (
                        <>Get Started <ArrowRight className="w-4 h-4" /></>
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-400"
                  >
                    <CheckCircle2 className="w-8 h-8" />
                  </motion.div>
                  <h3 className="text-2xl font-bold">Welcome Aboard!</h3>
                  <p className="text-gray-400">Your AI-driven logistics workspace is ready.</p>

                  <button 
                    onClick={resetAndClose}
                    className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-all mt-6"
                  >
                    Close Dashboard
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
