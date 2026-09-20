import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Logistics Director, GlobalTech",
    content: "GREENCHAIN ECOLOGIX X AI transformed our supply chain overnight. The predictive routing saved us $40k in fuel costs within the first month while hitting our carbon neutrality goals early.",
    image: "https://i.pravatar.cc/150?img=47"
  },
  {
    name: "Marcus Chen",
    role: "CEO, ShipSmart Solutions",
    content: "The collaborative shipping feature is a game changer. We went from 30% empty miles to less than 5%, drastically increasing our margins. The AI dashboard is incredibly intuitive.",
    image: "https://i.pravatar.cc/150?img=11"
  },
  {
    name: "Elena Rodriguez",
    role: "Sustainability Officer, EcoLog",
    content: "Finally, a platform that gives us true transparency into opaque supplier compliance. The simulated blockchain ledger makes tracking Scope 3 emissions effortless.",
    image: "https://i.pravatar.cc/150?img=32"
  }
];

export const Testimonials = () => {
  return (
    <section className="py-20 bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Trusted by Industry Leaders
          </motion.h2>
          <p className="text-gray-400 max-w-2xl mx-auto">See how top companies are using our AI engine to drive sustainable profitability.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-panel p-8 relative"
            >
              <Quote className="absolute top-4 right-4 w-12 h-12 text-white/5" />
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-green-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-8 italic">"{t.content}"</p>
              <div className="flex items-center gap-4">
                <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover border border-white/10" />
                <div>
                  <h4 className="font-semibold">{t.name}</h4>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
