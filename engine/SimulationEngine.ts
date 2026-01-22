
import { SimulationParams, SimulationResult, DailySnapshot, AgentMode } from '../types';

export class SimulationEngine {
  static run(params: SimulationParams, mode: AgentMode): SimulationResult {
    const snapshots: DailySnapshot[] = [];
    let currentInventory = params.initialInventory;
    let currentBackorder = 0;
    let totalCost = 0;
    let totalDemand = 0;
    let totalFulfilled = 0;
    let pendingOrders: { arrivalDay: number; qty: number }[] = [];
    
    // Predictive stats
    const demandHistory: number[] = [];

    for (let day = 1; day <= params.simulationDays; day++) {
      // 1. Generate Demand
      let baseDemand = Math.floor(Math.random() * (params.demandMax - params.demandMin + 1)) + params.demandMin;
      
      // 2. Disruption Logic
      const isDisrupted = Math.random() < params.disruptionProbability;
      if (isDisrupted) {
        // Surge demand or increase lead time
        baseDemand *= 2.5;
      }
      
      totalDemand += baseDemand;
      demandHistory.push(baseDemand);

      // 3. Process Arrivals
      const arrivals = pendingOrders.filter(o => o.arrivalDay === day);
      arrivals.forEach(a => {
        currentInventory += a.qty;
      });
      pendingOrders = pendingOrders.filter(o => o.arrivalDay !== day);

      // 4. PAA vs Traditional Logic
      let agentAction = '';
      if (mode === AgentMode.PAA) {
        // PREDICTIVE AGENT: Simple moving average + trend awareness
        const avgDemand = demandHistory.slice(-5).reduce((a, b) => a + b, 0) / Math.min(demandHistory.length, 5);
        const projectedShortage = (currentInventory - (avgDemand * params.leadTimeMax)) < params.reorderLevel;
        
        // Proactive Reordering
        if (projectedShortage && pendingOrders.length === 0) {
          const boost = isDisrupted ? 1.5 : 1.0; // PAA anticipates disruption if already occurring
          const orderQty = Math.round(params.reorderQty * boost);
          const leadTime = Math.floor(Math.random() * (params.leadTimeMax - params.leadTimeMin + 1)) + params.leadTimeMin;
          pendingOrders.push({ arrivalDay: day + leadTime, qty: orderQty });
          agentAction = `PAA: Predictive order of ${orderQty} units (LT: ${leadTime}d)`;
        }
      } else {
        // TRADITIONAL: Reactive reordering
        if (currentInventory <= params.reorderLevel && pendingOrders.length === 0) {
          const leadTime = Math.floor(Math.random() * (params.leadTimeMax - params.leadTimeMin + 1)) + params.leadTimeMin;
          pendingOrders.push({ arrivalDay: day + leadTime, qty: params.reorderQty });
          agentAction = `Reactive: Ordered ${params.reorderQty} units`;
        }
      }

      // 5. Fulfillment Logic
      const availableToFill = baseDemand + currentBackorder;
      const fulfilledToday = Math.min(availableToFill, currentInventory);
      currentInventory -= fulfilledToday;
      totalFulfilled += Math.max(0, fulfilledToday - currentBackorder); // Only count new demand fulfillment
      
      const newBackorder = Math.max(0, availableToFill - fulfilledToday);
      currentBackorder = newBackorder;

      // 6. Cost Calculation
      const holdingCost = currentInventory * 0.5;
      const stockoutCost = currentBackorder * 5.0;
      const dailyCost = holdingCost + stockoutCost;
      totalCost += dailyCost;

      snapshots.push({
        day,
        demand: baseDemand,
        inventory: currentInventory,
        backorder: currentBackorder,
        fulfilled: fulfilledToday,
        shipped: arrivals.reduce((sum, a) => sum + a.qty, 0),
        cost: dailyCost,
        isDisrupted,
        agentAction
      });
    }

    const serviceLevel = (totalFulfilled / totalDemand) * 100;
    const avgDelay = snapshots.reduce((acc, s) => acc + (s.backorder > 0 ? 1 : 0), 0) / params.simulationDays;
    
    // Resilience Score: (Service Level / Log10(Total Cost)) * Weighted Factor
    const resilienceScore = Math.max(0, (serviceLevel * 0.7) - (avgDelay * 20));

    return {
      mode,
      snapshots,
      metrics: {
        avgDelay: Number(avgDelay.toFixed(2)),
        totalCost: Math.round(totalCost),
        serviceLevel: Number(serviceLevel.toFixed(2)),
        totalBackorders: snapshots.reduce((acc, s) => acc + s.backorder, 0),
        resilienceScore: Number(resilienceScore.toFixed(2))
      }
    };
  }
}
