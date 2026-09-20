import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, Globe, ShieldCheck } from 'lucide-react';

export const Hero = ({ onOpenModal }: { onOpenModal?: () => void } = {}) => {
  const scrollToScanner = () => {
    const el = document.getElementById('supplier-scanner');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/20 rounded-full blur-[120px] -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8"
          >
            <Activity className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-gray-300">Powered by Next-Gen AI Analytics</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-8"
          >
            Decarbonize Your <br/>
            <span className="text-gradient">Supply Chain</span> With AI
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto"
          >
            Transform opaque logistics into transparent, sustainable, and profitable operations. Real-time carbon tracking, predictive routing, and smart dashboards.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <div className="flex flex-col items-center">
              <button onClick={scrollToScanner} className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 w-full sm:w-auto justify-center">
                Get Your Eco-Score in 30 Secs <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-xs text-gray-500 mt-3">No credit card required • Instant AI Audit</p>
            </div>
            <a href="#compliance" className="flex items-center gap-2 glass-panel hover:bg-white/10 px-8 py-4 rounded-full font-bold text-lg transition-all w-full sm:w-auto justify-center">
              <ShieldCheck className="w-5 h-5 text-green-400" /> Run Supplier Audit
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
