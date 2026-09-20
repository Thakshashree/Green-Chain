import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ComplianceScanner } from './components/ComplianceScanner';
import { CarbonDashboard } from './components/CarbonDashboard';
import { EcoCalculator } from './components/EcoCalculator';
import { LogisticsOptimizer } from './components/LogisticsOptimizer';
import { Testimonials } from './components/Testimonials';
import { Chatbot } from './components/Chatbot';
import { Footer } from './components/Footer';
import { MyCompanyModal } from './components/MyCompanyModal';

interface RouteData {
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

function App() {
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);
  const [routeData, setRouteData] = useState<RouteData | null>({
    origin: 'Mumbai',
    destination: 'Delhi',
    route: 'Mumbai → via Vadodara & Kota (NE-4 Expressway) → Delhi',
    distance: '1,350 km',
    co2Saved: '128.6 kg',
    shortestVia: 'Vadodara & Kota (NE-4 Expressway)',
    altVia: 'Ahmedabad & Jaipur (NH-48)',
    altDistance: '1,460 km',
    savedKm: '110 km'
  });
  const [companyName, setCompanyName] = useState<string>(() => {
    try {
      const stored = localStorage.getItem('greenchain_company');
      return stored ? JSON.parse(stored).companyName || '' : '';
    } catch {
      return '';
    }
  });

  return (
    <div className="min-h-screen bg-dark-900 text-white selection:bg-green-500/30">
      <Navbar onOpenCompany={() => setIsCompanyOpen(true)} companyName={companyName} />
      
      <main>
        <Hero />
        <ComplianceScanner />
        <CarbonDashboard />
        <EcoCalculator 
          onRouteCalculated={(origin, destination, result) => 
            setRouteData({
              origin,
              destination,
              route: result.route,
              distance: result.distance,
              co2Saved: result.co2Saved,
              shortestVia: result.shortestVia,
              altVia: result.altVia,
              altDistance: result.altDistance,
              savedKm: result.savedKm
            })
          } 
        />
        <LogisticsOptimizer routeData={routeData} />
        <Testimonials />
      </main>

      <Footer />
      <Chatbot />
      <MyCompanyModal 
        isOpen={isCompanyOpen} 
        onClose={() => setIsCompanyOpen(false)} 
        onLogout={() => setCompanyName('')}
        onProfileUpdate={(name) => setCompanyName(name)}
      />
    </div>
  );
}

export default App;
