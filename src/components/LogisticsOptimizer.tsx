import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Users, Leaf, Share2, Navigation } from 'lucide-react';

export interface RouteData {
  origin: string;
  destination: string;
  route: string;
  distance: string;
  co2Saved: string;
  shortestVia?: string;
  altVia?: string;
  altDistance?: string;
  savedKm?: string;
}

export const LogisticsOptimizer = ({ routeData }: { routeData: RouteData | null }) => {
  const origin = routeData?.origin || 'Your Origin';
  const destination = routeData?.destination || 'Your Destination';

  const truckMatches = [
    { company: 'GreenLogistics Co', emptySpace: 40, cost: 4500 },
    { company: 'EcoFreight India', emptySpace: 55, cost: 3800 },
    { company: 'SwiftHaul Pvt Ltd', emptySpace: 30, cost: 5200 },
  ];

  return (
    <section id="logistics" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Agentic AI: Truck Pooling Matcher Agent
          </motion.h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Maximize profit and sustainability through shared shipping. AI matches your route with available truck capacity in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Route Info & Match */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-bl-full -z-10" />
            <Users className="w-10 h-10 text-green-400 mb-6" />
            <h3 className="text-xl font-bold mb-4">Your Route Match</h3>
            
            {routeData ? (
              <div className="space-y-4">
                {/* Route display with Google Maps Real Data and Via between origin & destination */}
                <div className="bg-dark-900/60 p-5 rounded-xl border border-green-500/40 space-y-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-green-400 shrink-0" />
                      <span className="text-xs font-semibold text-gray-300">Shortest Route Corridor:</span>
                    </div>
                    <span className="bg-green-500/20 text-green-400 text-xs px-2.5 py-1 rounded-full font-bold font-mono shrink-0 border border-green-500/30">
                      {routeData.distance} • Google Maps
                    </span>
                  </div>

                  {/* Origin -> via Stop -> Destination strictly formatted */}
                  <div className="p-3 bg-dark-950/70 rounded-lg border border-green-500/30 font-mono text-sm text-green-300 flex items-start gap-2">
                    <Navigation className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                    <span className="font-bold leading-relaxed">{routeData.route}</span>
                  </div>

                  {/* Comparison showing why this route is chosen as the shortest compared to the other route */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-green-950/40 border border-green-500/40 p-2.5 rounded-lg">
                      <p className="text-[11px] text-green-400 font-semibold flex items-center gap-1">
                        <span>✓</span> Shortest Route (Selected)
                      </p>
                      <p className="text-white font-mono font-bold text-sm mt-0.5">{routeData.distance}</p>
                      <p className="text-[11px] text-gray-300 truncate">via {routeData.shortestVia || 'Direct Expressway'}</p>
                    </div>
                    <div className="bg-dark-900/80 border border-white/10 p-2.5 rounded-lg">
                      <p className="text-[11px] text-gray-400">Alternative Route</p>
                      <p className="text-gray-400 font-mono font-bold text-sm mt-0.5">{routeData.altDistance || 'Longer Bypass'}</p>
                      <p className="text-[11px] text-gray-500 truncate">via {routeData.altVia || 'State Highway'}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-white/5">
                    <span>Route Advantage: <strong className="text-green-400 font-semibold">{routeData.savedKm ? `${routeData.savedKm} shorter` : 'Shortest path selected'}</strong></span>
                    <span>CO₂ Saved: <strong className="text-green-400 font-mono">{routeData.co2Saved}</strong></span>
                  </div>
                </div>

                <p className="text-gray-400 text-sm">
                  Connect with other businesses to share freight space on this route. Reduces empty miles by 42% and turns deadhead routes into profit centers.
                </p>

                {/* Match stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-dark-900/50 p-3 rounded-xl border border-white/5 text-center">
                    <p className="text-2xl font-bold text-green-400">3</p>
                    <p className="text-xs text-gray-500">Trucks Available</p>
                  </div>
                  <div className="bg-dark-900/50 p-3 rounded-xl border border-white/5 text-center">
                    <p className="text-2xl font-bold text-green-400">42%</p>
                    <p className="text-xs text-gray-500">Avg. Empty Space</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <Truck className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Calculate a route in the AI Carbon Calculator above to see available truck matches here.</p>
              </div>
            )}
          </motion.div>

          {/* Live Truck Pooling Marketplace */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full -z-10" />
            <div className="flex items-center gap-3 mb-6">
              <Share2 className="w-10 h-10 text-emerald-400" />
              <div>
                <h3 className="text-xl font-bold">Live Truck Pooling Marketplace</h3>
                <p className="text-xs text-gray-500">
                  {routeData ? `${origin} → ${destination}` : 'Enter a route to see matches'}
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              {truckMatches.map((match, i) => (
                <motion.div
                  key={match.company}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-dark-900/50 border border-white/5 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 font-bold text-sm shrink-0">
                        {match.company.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{match.company}</p>
                        <p className="text-xs text-gray-500">{match.emptySpace}% empty capacity</p>
                      </div>
                    </div>
                    <span className="text-green-400 text-xs font-bold bg-green-400/20 px-2 py-1 rounded">
                      Rs. {match.cost.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Leaf className="w-3 h-3 text-green-400" />
                      <span>Save ~{(match.emptySpace * 0.3).toFixed(0)}kg CO₂</span>
                    </div>
                    <button 
                      onClick={() => alert(`Cost share request sent to ${match.company} for Rs. ${match.cost.toLocaleString()} (50% split)`)}
                      className="text-xs bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-lg font-medium transition-all"
                    >
                      Share Cost 50%
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
