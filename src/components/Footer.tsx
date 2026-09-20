import React from 'react';
import { Leaf, Globe, Phone, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-dark-900 border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-6 h-6 text-green-500" />
              <span className="font-bold text-lg tracking-tight">
                GREENCHAIN <span className="text-gradient">ECOLOGIX X AI</span>
              </span>
            </div>
            <p className="text-gray-400 max-w-sm mb-6">
              Empowering global supply chains with AI-driven sustainability, transparent compliance, and carbon-neutral logistics.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Phone className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-green-400 text-sm">Carbon Dashboard</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-400 text-sm">Eco Calculator</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-400 text-sm">Logistics Optimizer</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-400 text-sm">Supplier Compliance</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-green-400 text-sm">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-400 text-sm">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-400 text-sm">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-400 text-sm">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">© 2026 GREENCHAIN ECOLOGIX X AI. All rights reserved.</p>
          <div className="text-gray-500 text-sm flex gap-4 mt-4 md:mt-0">
            <span>Powered by Python & PyTorch (Simulated)</span>
            <span>|</span>
            <span>Cloud Deployed</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
