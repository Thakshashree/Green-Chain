export interface EcoScoreResult {
  score: number;
  riskLevel: 'Low' | 'Medium' | 'High' | string;
  factors: string[];
  improvement: string;
  co2: string;
  money: string;
}

export interface FleetRecResult {
  co2Save: string;
  moneySave: string;
}

export interface CO2OptResult {
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

declare module '../utils/realAI' {
  export function getRealEcoScore(companyName: string, industry: string): Promise<EcoScoreResult>;
  export function getFleetRecommendation(truckId: string): Promise<FleetRecResult>;
  export function getCO2Optimization(origin: string, destination: string, vehicle: string, fuel: string): Promise<CO2OptResult>;
}

declare module './utils/realAI' {
  export function getRealEcoScore(companyName: string, industry: string): Promise<EcoScoreResult>;
  export function getFleetRecommendation(truckId: string): Promise<FleetRecResult>;
  export function getCO2Optimization(origin: string, destination: string, vehicle: string, fuel: string): Promise<CO2OptResult>;
}

declare module '../utils/generatePDF' {
  export function downloadEcoReport(companyName: string, industry: string, result: EcoScoreResult): void;
}

declare module './utils/generatePDF' {
  export function downloadEcoReport(companyName: string, industry: string, result: EcoScoreResult): void;
}
