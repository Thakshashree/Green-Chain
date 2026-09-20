import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, Truck, BarChart3, Edit3, Save, Download, History, Zap, Leaf, LogOut } from 'lucide-react';
import { downloadEcoReport } from '../utils/generatePDF';
import { getFleetRecommendation } from '../utils/realAI';

interface ScanRecord {
  date: string;
  company: string;
  industry: string;
  score: number;
  riskLevel: string;
  factors: string[];
  improvement: string;
  co2: string;
  money: string;
}

interface CompanyProfile {
  companyName: string;
  fleetSize: number;
  industry: string;
  email: string;
}

interface TruckData {
  id: string;
  fuel: string;
  status: string;
  recommendation?: string;
  loading?: boolean;
}

export const MyCompanyModal = ({ 
  isOpen, 
  onClose,
  onLogout,
  onProfileUpdate
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onLogout?: () => void;
  onProfileUpdate?: (name: string) => void;
}) => {
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanRecord[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<CompanyProfile>({ companyName: '', fleetSize: 1000, industry: 'Manufacturing', email: '' });
  const [createForm, setCreateForm] = useState({ companyName: '', fleetSize: 1000, industry: 'Manufacturing' });
  const [fleetTrucks, setFleetTrucks] = useState<TruckData[]>([]);
  const [auditFilter, setAuditFilter] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem('greenchain_company');
      const history = localStorage.getItem('scanHistory');
      if (stored) {
        const parsed = JSON.parse(stored);
        setCompanyProfile(parsed);
        setEditForm(parsed);
        generateFleet(parsed.fleetSize);
      }
      if (history) {
        setScanHistory(JSON.parse(history));
      }
    }
  }, [isOpen]);

  const generateFleet = (fleetSize: number) => {
    const count = Math.min(fleetSize, 5);
    const trucks: TruckData[] = [];
    for (let i = 1; i <= count; i++) {
      const isDiesel = i % 2 === 0;
      trucks.push({
        id: `TRUCK-${String(i).padStart(2, '0')}`,
        fuel: isDiesel ? 'Diesel' : 'EV',
        status: 'Active',
        recommendation: undefined,
        loading: false
      });
    }
    setFleetTrucks(trucks);

    // Fetch AI recommendations for diesel trucks
    trucks.forEach((truck, idx) => {
      if (truck.fuel === 'Diesel') {
        setFleetTrucks(prev => prev.map((t, i) => i === idx ? { ...t, loading: true } : t));
        getFleetRecommendation(truck.id).then((rec: any) => {
          setFleetTrucks(prev => prev.map((t, i) => 
            i === idx ? { ...t, loading: false, recommendation: `Convert to EV in Q1 — Save ${rec.co2Save} CO₂ + ${rec.moneySave}/year` } : t
          ));
        });
      }
    });
  };

  const handleCreateWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    const profile: CompanyProfile = {
      companyName: createForm.companyName,
      fleetSize: createForm.fleetSize,
      industry: createForm.industry,
      email: ''
    };
    localStorage.setItem('greenchain_company', JSON.stringify(profile));
    localStorage.setItem('scanHistory', JSON.stringify([]));
    setCompanyProfile(profile);
    setEditForm(profile);
    setScanHistory([]);
    generateFleet(profile.fleetSize);
    onProfileUpdate?.(profile.companyName);
  };

  const handleSaveProfile = () => {
    localStorage.setItem('greenchain_company', JSON.stringify(editForm));
    setCompanyProfile(editForm);
    setIsEditing(false);
    generateFleet(editForm.fleetSize);
    onProfileUpdate?.(editForm.companyName);
  };

  const handleLogout = () => {
    // Preserve Gemini key if stored in localStorage
    const savedGeminiKey = localStorage.getItem('VITE_GEMINI_API_KEY') || localStorage.getItem('gemini_api_key');
    
    // Clear localStorage
    localStorage.clear();
    
    // Keep Gemini key intact
    if (savedGeminiKey) {
      localStorage.setItem('VITE_GEMINI_API_KEY', savedGeminiKey);
    }

    // Reset all states
    setCompanyProfile(null);
    setEditForm({ companyName: '', fleetSize: 0, industry: '', email: '' });
    setCreateForm({ companyName: '', fleetSize: 1000, industry: 'Manufacturing' });
    setScanHistory([]);
    setFleetTrucks([]);
    setIsEditing(false);

    // Reset workspace name on top
    onLogout?.();

    // Close modal, notify user, and redirect
    onClose();
    alert('Logged out successfully');
    window.location.href = '/';
  };

  const totalCO2 = scanHistory.reduce((sum, s) => {
    const num = parseFloat(s.co2) || 0;
    return sum + num;
  }, 0);

  const filteredHistory = auditFilter ? scanHistory.filter(s => s.score < 50) : scanHistory;

  const tabs = ['Fleet Roadmap', 'Scan History', 'Company Profile'];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-2xl max-h-[85vh] overflow-y-auto z-[101]"
          >
            <div className="glass-panel p-6 md:p-8 relative overflow-hidden bg-dark-900 border-green-500/30">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {!companyProfile ? (
                /* Create Workspace Form */
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Building2 className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Create Your Workspace</h3>
                    <p className="text-sm text-gray-400">Set up your company profile to track scans and fleet</p>
                  </div>

                  <form onSubmit={handleCreateWorkspace} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Company Name *</label>
                      <input
                        type="text"
                        required
                        value={createForm.companyName}
                        onChange={(e) => setCreateForm({ ...createForm, companyName: e.target.value })}
                        placeholder="e.g. Apex Manufacturers"
                        className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Fleet Size</label>
                      <input
                        type="number"
                        value={createForm.fleetSize}
                        onChange={(e) => setCreateForm({ ...createForm, fleetSize: parseInt(e.target.value) || 0 })}
                        className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Industry *</label>
                      <select
                        required
                        value={createForm.industry}
                        onChange={(e) => setCreateForm({ ...createForm, industry: e.target.value })}
                        className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500"
                      >
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Logistics">Logistics</option>
                        <option value="Textile">Textile</option>
                        <option value="E-commerce">E-commerce</option>
                        <option value="Pharmaceuticals">Pharmaceuticals</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-all"
                    >
                      Create Workspace
                    </button>
                  </form>
                </div>
              ) : (
                /* Dashboard */
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 text-2xl font-bold shrink-0">
                      {companyProfile.companyName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Workspace: {companyProfile.companyName}</h3>
                      <p className="text-sm text-gray-400">{companyProfile.industry} • Fleet: {companyProfile.fleetSize}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-dark-800 border border-white/10 rounded-xl p-3 text-center">
                      <Truck className="w-5 h-5 text-green-400 mx-auto mb-1" />
                      <p className="text-lg font-bold">{companyProfile.fleetSize.toLocaleString()}+</p>
                      <p className="text-xs text-gray-500">Total Trucks</p>
                    </div>
                    <div className="bg-dark-800 border border-white/10 rounded-xl p-3 text-center">
                      <BarChart3 className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                      <p className="text-lg font-bold">{scanHistory.length}</p>
                      <p className="text-xs text-gray-500">Total Scans</p>
                    </div>
                    <div className="bg-dark-800 border border-white/10 rounded-xl p-3 text-center">
                      <Building2 className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                      <p className="text-lg font-bold">{totalCO2.toFixed(1)}</p>
                      <p className="text-xs text-gray-500">Total CO₂ (tons)</p>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex gap-1 bg-dark-800 p-1 rounded-xl">
                    {tabs.map((tab, i) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(i)}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${activeTab === i ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'}`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* Tab 0: Fleet Roadmap */}
                  {activeTab === 0 && (
                    <div className="space-y-3">
                      {fleetTrucks.map((truck) => (
                        <div key={truck.id} className="bg-dark-800/50 border border-white/5 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <Truck className={`w-5 h-5 ${truck.fuel === 'EV' ? 'text-green-400' : 'text-yellow-400'}`} />
                              <div>
                                <span className="font-mono text-white font-semibold text-sm">{truck.id}</span>
                                <span className={`ml-2 text-xs px-2 py-0.5 rounded ${truck.fuel === 'EV' ? 'bg-green-400/20 text-green-400' : 'bg-yellow-400/20 text-yellow-400'}`}>
                                  {truck.fuel}
                                </span>
                              </div>
                            </div>
                            <span className="text-xs text-green-400 flex items-center gap-1">
                              <span className="w-2 h-2 bg-green-400 rounded-full" />
                              {truck.status}
                            </span>
                          </div>
                          {truck.fuel === 'Diesel' && (
                            <div className="mt-2 pl-8">
                              {truck.loading ? (
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <Zap className="w-3 h-3 animate-pulse text-yellow-400" />
                                  <span className="animate-pulse">Fetching AI recommendation...</span>
                                </div>
                              ) : truck.recommendation ? (
                                <div className="flex items-start gap-2 text-xs bg-yellow-500/10 border border-yellow-500/20 p-2.5 rounded-lg">
                                  <Leaf className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" />
                                  <span className="text-yellow-300">{truck.recommendation}</span>
                                </div>
                              ) : null}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tab 1: Scan History */}
                  {activeTab === 1 && (
                    <div className="space-y-3">
                      {/* Audit toggle */}
                      <div className="flex items-center justify-between bg-dark-800/50 border border-white/5 rounded-lg p-3">
                        <span className="text-sm text-gray-400">Run Supply Chain Audit (show score &lt; 50 only)</span>
                        <button
                          onClick={() => setAuditFilter(!auditFilter)}
                          className={`relative w-11 h-6 rounded-full transition-colors ${auditFilter ? 'bg-green-600' : 'bg-gray-600'}`}
                        >
                          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${auditFilter ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                      </div>

                      {filteredHistory.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <History className="w-10 h-10 mx-auto mb-2 opacity-50" />
                          <p>{auditFilter ? 'No scans with eco-score below 50.' : 'No scans yet. Run your first Eco-Score audit!'}</p>
                        </div>
                      ) : (
                        filteredHistory.map((s, i) => (
                          <div key={i} className="bg-dark-800/50 border border-white/5 rounded-lg p-3 flex items-center justify-between">
                            <div>
                              <p className="text-sm font-semibold text-white">{s.company} <span className="text-xs text-gray-500">({s.industry})</span></p>
                              <p className="text-xs text-gray-500 mt-0.5">{s.date}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`text-lg font-bold ${s.score >= 75 ? 'text-green-400' : s.score >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                                {s.score}/100
                              </span>
                              <button
                                onClick={() => downloadEcoReport(s.company, s.industry, { score: s.score, riskLevel: s.riskLevel, factors: s.factors, improvement: s.improvement, co2: s.co2, money: s.money })}
                                className="p-1.5 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/40 transition-colors"
                                title="Download PDF"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* Tab 2: Company Profile */}
                  {activeTab === 2 && (
                    <div className="space-y-4">
                      {isEditing ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Company Name</label>
                            <input
                              type="text"
                              value={editForm.companyName}
                              onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })}
                              className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-green-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Industry</label>
                            <select
                              value={editForm.industry}
                              onChange={(e) => setEditForm({ ...editForm, industry: e.target.value })}
                              className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-green-500"
                            >
                              <option value="Manufacturing">Manufacturing</option>
                              <option value="Logistics">Logistics</option>
                              <option value="Textile">Textile</option>
                              <option value="E-commerce">E-commerce</option>
                              <option value="Pharmaceuticals">Pharmaceuticals</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Fleet Size</label>
                            <input
                              type="number"
                              value={editForm.fleetSize}
                              onChange={(e) => setEditForm({ ...editForm, fleetSize: parseInt(e.target.value) || 0 })}
                              className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-green-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Email</label>
                            <input
                              type="email"
                              value={editForm.email}
                              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                              placeholder="admin@company.com"
                              className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-green-500"
                            />
                          </div>
                          <button
                            onClick={handleSaveProfile}
                            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
                          >
                            <Save className="w-4 h-4" /> Save Changes
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="bg-dark-800/50 border border-white/5 rounded-lg p-3">
                            <p className="text-xs text-gray-500">Company Name</p>
                            <p className="text-sm font-semibold text-white">{companyProfile.companyName}</p>
                          </div>
                          <div className="bg-dark-800/50 border border-white/5 rounded-lg p-3">
                            <p className="text-xs text-gray-500">Industry</p>
                            <p className="text-sm font-semibold text-white">{companyProfile.industry}</p>
                          </div>
                          <div className="bg-dark-800/50 border border-white/5 rounded-lg p-3">
                            <p className="text-xs text-gray-500">Fleet Size</p>
                            <p className="text-sm font-semibold text-white">{companyProfile.fleetSize.toLocaleString()}</p>
                          </div>
                          <div className="bg-dark-800/50 border border-white/5 rounded-lg p-3">
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="text-sm font-semibold text-white">{companyProfile.email || 'Not set'}</p>
                          </div>
                          <button
                            onClick={() => setIsEditing(true)}
                            className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
                          >
                            <Edit3 className="w-4 h-4" /> Edit Profile
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Bottom Log Out Button */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <p className="text-xs text-gray-500">Sign out of your company workspace</p>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-red-600/20 active:scale-95"
                    >
                      <LogOut className="w-4 h-4" /> Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
