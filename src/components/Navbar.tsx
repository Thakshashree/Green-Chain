import React, { useState } from 'react';
import { Leaf, Menu, X, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = ({ 
  onOpenCompany, 
  companyName 
}: { 
  onOpenCompany: () => void;
  companyName?: string;
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-40 glass-panel !rounded-none border-t-0 border-x-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <Leaf className="w-8 h-8 text-green-500" />
            <span className="font-bold text-xl tracking-tight">
              GREENCHAIN
            </span>
          </motion.div>
          
          <div className="hidden md:flex items-center space-x-6">
            <a href="#dashboard" className="text-gray-300 hover:text-green-400 transition-colors">Dashboard</a>
            <a href="#calculator" className="text-gray-300 hover:text-green-400 transition-colors">Eco-Calculator</a>
            <a href="#logistics" className="text-gray-300 hover:text-green-400 transition-colors">Logistics</a>
            <button onClick={onOpenCompany} className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-5 py-2 rounded-full font-medium transition-all transform hover:scale-105">
              <Building2 className="w-4 h-4" /> {companyName || 'My Company Account'}
            </button>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-300 hover:text-white p-2">
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-dark-900 border-b border-white/10"
          >
            <div className="px-4 pt-2 pb-6 space-y-4 flex flex-col">
              <a href="#dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-green-400 py-2">Dashboard</a>
              <a href="#calculator" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-green-400 py-2">Eco-Calculator</a>
              <a href="#logistics" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-green-400 py-2">Logistics</a>
              <button onClick={() => { setIsMobileMenuOpen(false); onOpenCompany(); }} className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-full font-medium transition-all w-full">
                <Building2 className="w-4 h-4" /> {companyName || 'My Company Account'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
