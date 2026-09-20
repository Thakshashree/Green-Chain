import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, MapPin, Navigation, Zap, Leaf } from 'lucide-react';
import { getCO2Optimization } from '../utils/realAI';

export interface CalcResult {
  route: string;
  distance: string;
  co2Saved: string;
  efficiency: number;
  fuelSaved: number;
  origin?: string;
  destination?: string;
  shortestVia?: string;
  altVia?: string;
  altDistance?: string;
  savedKm?: string;
}

export const EcoCalculator = ({ onRouteCalculated }: { onRouteCalculated?: (origin: string, destination: string, result: CalcResult) => void }) => {
  const [vehicle, setVehicle] = useState('Heavy Duty Truck');
  const [fuel, setFuel] = useState('Diesel');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [result, setResult] = useState<CalcResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin.trim() || !destination.trim()) return;
    setIsCalculating(true);

    try {
      const res = await getCO2Optimization(origin, destination, vehicle, fuel);
      const calcResult: CalcResult = {
        route: res.route,
        distance: res.distance,
        co2Saved: res.co2Saved,
        efficiency: res.efficiency,
        fuelSaved: res.fuelSaved,
        origin: res.origin,
        destination: res.destination,
        shortestVia: res.shortestVia,
        altVia: res.altVia,
        altDistance: res.altDistance,
        savedKm: res.savedKm
      };
      setResult(calcResult);
      onRouteCalculated?.(origin, destination, calcResult);
    } catch (err) {
      console.error(err);
    }

    setIsCalculating(false);
  };

  return (
    <section id="calculator" className="py-20 bg-dark-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            AI Interactive Carbon Calculator
          </motion.h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Input your fleet details to generate engine efficiency predictions and calculate the fastest, most eco-friendly routes.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-8"
          >
            <form onSubmit={handleCalculate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Vehicle Type</label>
                <select 
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option>Heavy Duty Truck</option>
                  <option>Medium Duty Delivery</option>
                  <option>Light Cargo Van</option>
                  <option>Electric Freight</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Fuel Type</label>
                <select 
                  value={fuel}
                  onChange={(e) => setFuel(e.target.value)}
                  className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option>Diesel</option>
                  <option>Petrol</option>
                  <option>Hybrid</option>
                  <option>Electric (EV)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Origin</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                    <input 
                      type="text" 
                      placeholder="e.g. Mumbai" 
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      required
                      className="w-full bg-dark-900 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Destination</label>
                  <div className="relative">
                    <Navigation className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                    <input 
                      type="text" 
                      placeholder="e.g. Delhi" 
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      required
                      className="w-full bg-dark-900 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500" 
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isCalculating || !origin.trim() || !destination.trim()}
                className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2"
              >
                {isCalculating ? (
                  <span className="animate-pulse">Processing via AI Engine...</span>
                ) : (
                  <>
                    <Calculator className="w-5 h-5" /> Calculate Optimization
                  </>
                )}
              </button>
            </form>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {result ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-8 space-y-6 bg-gradient-to-br from-dark-800 to-green-900/20"
              >
                <div className="text-center">
                  <div className="inline-flex p-4 rounded-full bg-green-500/20 text-green-400 mb-4">
                    <Zap className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">AI Optimization Complete</h3>
                  <p className="text-green-400 text-sm">Shortest Google Maps transit route selected.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-dark-900/50 p-4 rounded-xl border border-white/5">
                    <p className="text-gray-400 text-sm mb-1">Engine Efficiency</p>
                    <p className="text-3xl font-bold text-white">{result.efficiency}%</p>
                  </div>
                  <div className="bg-dark-900/50 p-4 rounded-xl border border-white/5">
                    <p className="text-gray-400 text-sm mb-1">Fuel Saved</p>
                    <p className="text-3xl font-bold text-white">{result.fuelSaved} L</p>
                  </div>
                </div>

                {/* Recommended Route Card with Shortest Path between Origin & Destination */}
                <div className="bg-dark-900/60 p-5 rounded-xl border border-green-500/40 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Leaf className="w-5 h-5 text-green-400 shrink-0" />
                      <h4 className="font-semibold text-white text-sm">Recommended Route (Shortest Path)</h4>
                    </div>
                    <span className="bg-green-500/20 text-green-400 text-[11px] px-2.5 py-0.5 rounded-full font-bold font-mono border border-green-500/30">
                      Google Maps Real Data
                    </span>
                  </div>

                  {/* Origin -> via Stop -> Destination strictly formatted */}
                  <div className="p-3 bg-dark-950/70 rounded-lg border border-green-500/30 font-mono text-sm text-green-300 flex items-start gap-2">
                    <Navigation className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                    <span className="font-bold leading-relaxed">{result.route}</span>
                  </div>

                  {/* Comparison of Shortest Route vs Alternative Route */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="bg-green-950/40 border border-green-500/40 p-3 rounded-lg">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-green-400 font-semibold flex items-center gap-1">
                          <span>✓</span> Shortest Route
                        </span>
                        <span className="text-white font-mono font-bold">{result.distance}</span>
                      </div>
                      <p className="text-[11px] text-gray-300 truncate">via {result.shortestVia}</p>
                    </div>

                    <div className="bg-dark-900/80 border border-white/10 p-3 rounded-lg">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-400">Alternative Route</span>
                        <span className="text-gray-400 font-mono">{result.altDistance}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 truncate">via {result.altVia}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-white/5">
                    <span>Route Advantage: <strong className="text-green-400 font-semibold">{result.savedKm} shorter</strong> than alternative route</span>
                    <span>CO₂ Saved: <strong className="text-green-400 font-mono">{result.co2Saved}</strong></span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-700 rounded-2xl">
                <Calculator className="w-16 h-16 text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-400">Awaiting Input</h3>
                <p className="text-gray-500 mt-2">Enter your fleet details and Indian city route to calculate optimal eco-paths.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
