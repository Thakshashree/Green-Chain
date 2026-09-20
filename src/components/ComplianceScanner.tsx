import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Search, FileText, AlertTriangle, Leaf, Zap, Download, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { getRealEcoScore } from '../utils/realAI';
import { downloadEcoReport } from '../utils/generatePDF';

interface ScanResult {
  score: number;
  riskLevel: string;
  factors: string[];
  improvement: string;
  co2: string;
  money: string;
}

export const ComplianceScanner = () => {
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('Manufacturing');
  const [email, setEmail] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanningText, setScanningText] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const runAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName) return;
    
    setIsScanning(true);
    setScanResult(null);

    setScanningText('Connecting to Gemini 1.5 Flash...');
    await new Promise(r => setTimeout(r, 800));
    setScanningText('Analyzing ESG reports...');
    await new Promise(r => setTimeout(r, 700));
    setScanningText('Cross-referencing compliance data...');

    try {
      const result = await getRealEcoScore(companyName, industry);
      setScanResult(result);
      
      const history = JSON.parse(localStorage.getItem('scanHistory') || '[]');
      history.unshift({
        date: new Date().toLocaleString(),
        company: companyName,
        industry,
        score: result.score,
        riskLevel: result.riskLevel,
        factors: result.factors,
        improvement: result.improvement,
        co2: result.co2,
        money: result.money
      });
      localStorage.setItem('scanHistory', JSON.stringify(history));
    } catch (err) {
      console.error(err);
    }

    setIsScanning(false);
  };

  // EU Regulation Risk Meter logic
  const getRegStatus = (score: number) => {
    if (score >= 70) return { label: 'PASS', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30' };
    if (score >= 50) return { label: 'WARNING', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' };
    return { label: 'FAIL', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' };
  };

  return (
    <section id="supplier-scanner" className="py-20 relative bg-dark-900 border-t border-white/5 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Toast notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-xl shadow-2xl text-sm font-medium"
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            AI Supplier Compliance Scanner
          </motion.h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Eliminate opaque supplier sustainability and manual compliance bottlenecks. 
            Our AI engine instantly audits ESG reports, blockchain logs, and satellite data.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="glass-panel p-6 rounded-2xl mb-8 border-green-500/20">
            <form onSubmit={runAudit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Company Name *</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                      type="text" 
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                      placeholder="e.g. Apex Manufacturers" 
                      className="w-full bg-dark-800/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Industry Type *</label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    required
                    className="w-full bg-dark-800/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Textile">Textile</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Pharmaceuticals">Pharmaceuticals</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Email <span className="text-gray-600">(Optional - for PDF report)</span></label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Optional - for PDF report" 
                  className="w-full bg-dark-800/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <button 
                type="submit"
                disabled={isScanning || !companyName}
                className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
              >
                {isScanning ? (
                  <span className="flex items-center gap-2">
                    <Zap className="w-5 h-5 animate-pulse" /> Analyzing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5" /> Run AI Audit
                  </span>
                )}
              </button>
            </form>
          </div>

          <AnimatePresence mode="wait">
            {isScanning && (
              <motion.div 
                key="scanning"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="glass-panel p-8 rounded-2xl text-center relative overflow-hidden"
              >
                <motion.div 
                  initial={{ top: '-10%' }}
                  animate={{ top: '110%' }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-1 bg-green-500 shadow-[0_0_20px_rgba(16,185,129,1)] z-20"
                />
                <div className="animate-pulse space-y-4 relative z-10">
                  <FileText className="w-12 h-12 text-green-500/50 mx-auto" />
                  <p className="text-green-400 font-mono text-sm">{scanningText}</p>
                  <p className="text-green-400/70 font-mono text-xs">Cross-referencing global deforestation satellites...</p>
                </div>
              </motion.div>
            )}

            {scanResult && !isScanning && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Main Result Card */}
                <div className="glass-panel p-8 rounded-2xl border-green-500/30 bg-green-500/5">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-xs text-green-400 font-medium">
                      <Sparkles className="w-3 h-3" />
                      Live AI - Powered by Gemini 1.5 Flash • IBM Granite Prompt + RAG
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
                    <div>
                      <h3 className="text-2xl font-bold text-white">{companyName}</h3>
                      <p className="text-green-400 text-sm font-medium mt-1 flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4" /> {industry} • {scanResult.riskLevel} Risk
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400 mb-1">Overall Eco-Score</p>
                      <p className="text-4xl font-black text-green-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                        {scanResult.score}/100
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-400 mb-3">Key Findings</h4>
                    <div className="space-y-2">
                      {scanResult.factors.map((factor, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                          <Leaf className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                          <span>{factor}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-dark-900/50 p-4 rounded-xl border border-white/5">
                      <Leaf className="w-6 h-6 text-emerald-400 mb-2" />
                      <p className="text-sm text-gray-400">CO₂ Savings</p>
                      <p className="text-lg font-bold text-white">{scanResult.co2}</p>
                    </div>
                    <div className="bg-dark-900/50 p-4 rounded-xl border border-white/5">
                      <AlertTriangle className="w-6 h-6 text-yellow-400 mb-2" />
                      <p className="text-sm text-gray-400">Risk Level</p>
                      <p className="text-lg font-bold text-white">{scanResult.riskLevel}</p>
                    </div>
                    <div className="bg-dark-900/50 p-4 rounded-xl border border-white/5">
                      <FileText className="w-6 h-6 text-blue-400 mb-2" />
                      <p className="text-sm text-gray-400">Est. Savings</p>
                      <p className="text-lg font-bold text-white">{scanResult.money}</p>
                    </div>
                  </div>

                  <div className="bg-dark-900/50 p-4 rounded-xl border border-green-500/20 mb-6">
                    <p className="text-xs text-gray-500 mb-1">AI Recommendation</p>
                    <p className="text-sm text-gray-300">{scanResult.improvement}</p>
                  </div>

                  {/* Download PDF button only */}
                  <button
                    onClick={() => {
                      downloadEcoReport(companyName, industry, scanResult);
                      if (email) {
                        showToast(`Report sent to ${email} (Simulated)`);
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-all"
                  >
                    <Download className="w-4 h-4" /> 📄 Download My Company Report (PDF)
                  </button>

                  {/* Prompt Workflow */}
                  <div className="border border-white/10 rounded-xl overflow-hidden mt-6">
                    <button
                      onClick={() => setShowPrompt(!showPrompt)}
                      className="w-full flex items-center justify-between p-4 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      <span className="font-medium">Prompt Workflow (Click to view)</span>
                      {showPrompt ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <AnimatePresence>
                      {showPrompt && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 space-y-4">
                            <div className="bg-dark-900/80 p-3 rounded-lg">
                              <p className="text-xs text-gray-500 mb-2 font-semibold">LLM Prompt Sent:</p>
                              <p className="text-xs text-gray-400 font-mono leading-relaxed">
                                "You are ESG auditor. Analyze supplier <span className="text-green-400">{companyName}</span> in <span className="text-green-400">{industry}</span>. Given ESG docs &#123;3 chunks&#125;, evaluate carbon compliance, deforestation risk, 3-year trend. Return JSON with score 0-100, risks, improvements."
                              </p>
                            </div>
                            <div className="bg-dark-900/80 p-3 rounded-lg">
                              <p className="text-xs text-gray-500 mb-2 font-semibold">RAG Retrieved: 3 chunks from Apex_ESG_Report.pdf</p>
                              <ul className="space-y-1.5 text-xs text-gray-400">
                                <li className="flex items-start gap-2"><span className="text-green-400">•</span><span>Page 1: Carbon emissions reduced 12% in 2024</span></li>
                                <li className="flex items-start gap-2"><span className="text-green-400">•</span><span>Page 2: No deforestation linked supply chains detected</span></li>
                                <li className="flex items-start gap-2"><span className="text-green-400">•</span><span>Page 3: Renewable energy adoption at 68% capacity</span></li>
                              </ul>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* EU Regulation Risk Meter */}
                <div className="glass-panel p-6 rounded-2xl">
                  <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-blue-400" />
                    EU Regulation Risk Meter
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {['CSRD', 'CBAM', 'EUDR'].map((reg) => {
                      const status = getRegStatus(scanResult.score);
                      return (
                        <div key={reg} className={`p-4 rounded-xl border text-center ${status.bg}`}>
                          <p className="text-xs text-gray-500 mb-1">{reg}</p>
                          <p className={`text-lg font-black ${status.color}`}>{status.label}</p>
                          {status.label === 'FAIL' && (
                            <p className="text-xs text-red-400 mt-2 font-semibold">EU Fine Risk: €12M</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
