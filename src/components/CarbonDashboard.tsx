import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Leaf, ShieldCheck } from 'lucide-react';

const mockData = [
  { name: 'Mon', emissions: 4000, target: 2400 },
  { name: 'Tue', emissions: 3000, target: 1398 },
  { name: 'Wed', emissions: 2000, target: 9800 },
  { name: 'Thu', emissions: 2780, target: 3908 },
  { name: 'Fri', emissions: 1890, target: 4800 },
  { name: 'Sat', emissions: 2390, target: 3800 },
  { name: 'Sun', emissions: 3490, target: 4300 },
];

const truckTickers = [
  { id: 'MH-01', co2: 2.4, status: 'green' },
  { id: 'KA-02', co2: 8.1, status: 'red' },
  { id: 'DL-03', co2: 1.8, status: 'green' },
  { id: 'TN-04', co2: 6.5, status: 'red' },
  { id: 'GJ-05', co2: 3.2, status: 'green' },
  { id: 'RJ-06', co2: 7.9, status: 'red' },
];

export const CarbonDashboard = () => {
  const [tickerIndex, setTickerIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % truckTickers.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const co2Saved = 12.4;
  const credits = Math.floor(co2Saved);
  const earnings = co2Saved * 2000;

  const currentTruck = truckTickers[tickerIndex];
  const nextTruck = truckTickers[(tickerIndex + 1) % truckTickers.length];

  return (
    <section id="dashboard" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Smart Carbon Dashboard</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Real-time data pipeline powered by simulated Kafka & InfluxDB streams. Track compliance bottlenecks and carbon credit earnings.</p>
        </motion.div>

        {/* Live Truck Ticker */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel p-3 rounded-xl mb-8 flex items-center gap-3 overflow-hidden"
        >
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider">LIVE</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <motion.div
              key={tickerIndex}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-4 text-sm"
            >
              <span className="font-mono">
                Truck {currentTruck.id}: <span className={currentTruck.status === 'green' ? 'text-green-400' : 'text-red-400'}>{currentTruck.co2}kg CO₂/km</span>
                {currentTruck.status === 'green' ? 
                  <span className="text-green-400 ml-1">✓</span> : 
                  <span className="text-red-400 ml-1 font-bold animate-pulse">ALERT</span>
                }
              </span>
              <span className="text-gray-600">|</span>
              <span className="font-mono text-gray-500">
                Truck {nextTruck.id}: <span className={nextTruck.status === 'green' ? 'text-green-400/60' : 'text-red-400/60'}>{nextTruck.co2}kg CO₂/km</span>
              </span>
            </motion.div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 glass-panel p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Live Emissions Tracking</h3>
              <div className="flex items-center gap-2 text-green-400 text-sm bg-green-400/10 px-3 py-1 rounded-full">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> Live Stream
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockData}>
                  <defs>
                    <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="emissions" stroke="#10b981" fillOpacity={1} fill="url(#colorEmissions)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Side Metrics */}
          <div className="space-y-8">
            {/* Carbon Credit Earnings */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-panel p-6 bg-green-500/5 border-green-500/20"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-green-500/10 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h4 className="text-sm text-gray-400">Carbon Credit Earnings</h4>
                  <p className="text-2xl font-bold text-green-400">Rs. {earnings.toLocaleString()}</p>
                </div>
              </div>
              <div className="bg-dark-900/50 p-3 rounded-lg border border-green-500/20">
                <div className="flex items-center gap-2 text-sm">
                  <Leaf className="w-4 h-4 text-green-400" />
                  <span className="text-green-300 font-medium">{co2Saved} tons = {credits} Credits = Rs. {earnings.toLocaleString()} earned</span>
                </div>
                <p className="text-xs text-gray-500 mt-1.5">Formula: CO₂ Saved (tons) × Rs. 2,000 per credit</p>
              </div>
            </motion.div>

            {/* Fleet Decarbonization & Scope 1, 2, 3 Emissions Breakdown */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-panel p-6 bg-dark-800/60 border-green-500/20"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-green-400" />
                  Fleet Decarbonization Goals
                </h4>
                <span className="text-[11px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                  ON TRACK
                </span>
              </div>

              <div className="space-y-3.5">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-300">Scope 1 (Direct Fleet Diesel)</span>
                    <span className="text-white font-semibold">54% • 6.7 tCO₂</span>
                  </div>
                  <div className="w-full bg-dark-900 rounded-full h-2 overflow-hidden border border-white/5">
                    <div className="bg-yellow-500 h-full rounded-full transition-all duration-500" style={{ width: '54%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-300">Scope 2 (Facility & Solar Power)</span>
                    <span className="text-white font-semibold">18% • 2.2 tCO₂</span>
                  </div>
                  <div className="w-full bg-dark-900 rounded-full h-2 overflow-hidden border border-white/5">
                    <div className="bg-green-400 h-full rounded-full transition-all duration-500" style={{ width: '18%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-300">Scope 3 (Partner Truck Pooling)</span>
                    <span className="text-white font-semibold">28% • 3.5 tCO₂</span>
                  </div>
                  <div className="w-full bg-dark-900 rounded-full h-2 overflow-hidden border border-white/5">
                    <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: '28%' }} />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-gray-400">2026 Net-Zero Target</span>
                <span className="text-green-400 font-bold">-35% Emission Cut</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
