
import { SimulationParams } from './types';

export const DEFAULT_PARAMS: SimulationParams = {
  initialInventory: 100,
  demandMin: 10,
  demandMax: 30,
  reorderLevel: 50,
  reorderQty: 150,
  supplierProdRate: 25,
  leadTimeMin: 2,
  leadTimeMax: 5,
  simulationDays: 30,
  disruptionProbability: 0.15
};

export const COLORS = {
  traditional: '#64748b',
  paa: '#3b82f6',
  inventory: '#10b981',
  demand: '#f59e0b',
  backorder: '#ef4444',
  disruption: '#7c3aed'
};
