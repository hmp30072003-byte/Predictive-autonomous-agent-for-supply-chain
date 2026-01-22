
export enum AgentMode {
  TRADITIONAL = 'Traditional',
  PAA = 'PAA (Predictive)'
}

export interface SimulationParams {
  initialInventory: number;
  demandMin: number;
  demandMax: number;
  reorderLevel: number;
  reorderQty: number;
  supplierProdRate: number;
  leadTimeMin: number;
  leadTimeMax: number;
  simulationDays: number;
  disruptionProbability: number;
}

export interface DailySnapshot {
  day: number;
  demand: number;
  inventory: number;
  backorder: number;
  fulfilled: number;
  shipped: number;
  cost: number;
  isDisrupted: boolean;
  agentAction?: string;
}

export interface SimulationResult {
  mode: AgentMode;
  snapshots: DailySnapshot[];
  metrics: {
    avgDelay: number;
    totalCost: number;
    serviceLevel: number;
    totalBackorders: number;
    resilienceScore: number;
  };
}

export interface AgentDecision {
  type: 'ORDER' | 'NOTHING' | 'EXPEDITE';
  quantity: number;
  reason: string;
}
