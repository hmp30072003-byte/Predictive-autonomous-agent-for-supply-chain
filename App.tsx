
import React, { useState, useCallback, useEffect } from 'react';
import { SimulationParams, SimulationResult, AgentMode } from './types';
import { DEFAULT_PARAMS } from './constants';
import { SimulationEngine } from './engine/SimulationEngine';
import ExcelUI from './components/ExcelUI';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [params, setParams] = useState<SimulationParams>(DEFAULT_PARAMS);
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'results'>('config');

  const runSimulation = useCallback(() => {
    setIsSimulating(true);
    // Add small delay to feel like a "computation" for B.Tech project presentation
    setTimeout(() => {
      const tradResult = SimulationEngine.run(params, AgentMode.TRADITIONAL);
      const paaResult = SimulationEngine.run(params, AgentMode.PAA);
      
      setResults([tradResult, paaResult]);
      setIsSimulating(false);
      setActiveTab('results');
    }, 800);
  }, [params]);

  // Initial Run
  useEffect(() => {
    runSimulation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-blue-200">
            <i className="fas fa-network-wired"></i>
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none">Hyper-Resilient Supply Chain</h1>
            <p className="text-xs text-slate-500 font-medium mt-1">Predictive Autonomous Agents (PAA) System • Digital Twin v2.1</p>
          </div>
        </div>
        
        <nav className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button 
            onClick={() => setActiveTab('config')}
            className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeTab === 'config' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <i className="fas fa-cog mr-2"></i>Configuration
          </button>
          <button 
            onClick={() => setActiveTab('results')}
            className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeTab === 'results' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <i className="fas fa-chart-pie mr-2"></i>Live Dashboard
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {isSimulating && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm">
              <div className="inline-block relative">
                <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-blue-600">
                  <i className="fas fa-brain animate-pulse"></i>
                </div>
              </div>
              <h2 className="mt-4 text-lg font-bold text-slate-800">Agent Intelligence Computing</h2>
              <p className="text-sm text-slate-500 mt-2">Running Discrete-Event Simulation & Predictive Logic Modeling...</p>
            </div>
          </div>
        )}

        {activeTab === 'config' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <i className="fas fa-table text-emerald-600"></i>
                System Configuration Input
              </h2>
              <ExcelUI params={params} setParams={setParams} onRun={runSimulation} />
              
              <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-6">
                <h3 className="text-blue-800 font-bold mb-2 flex items-center gap-2">
                  <i className="fas fa-info-circle"></i> Digital Twin Architecture
                </h3>
                <p className="text-sm text-blue-700 leading-relaxed">
                  This simulation models a 4-tier supply chain: Supplier → Warehouse → Transport → Retailer. 
                  In <span className="font-bold">Traditional Mode</span>, agents only respond when inventory crosses a fixed threshold. 
                  In <span className="font-bold">PAA Mode</span>, agents utilize Bayesian prediction to detect demand shifts and order preemptively, mitigating bullwhip effects and stockout risks.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <i className="fas fa-robot text-indigo-600"></i>
                Agent Strategy
              </h2>
              <StrategyCard 
                icon="fa-shopping-cart"
                title="Retail Agent"
                color="bg-blue-500"
                desc="Monitors consumer demand. PAA predicts surges using weighted moving averages."
              />
              <StrategyCard 
                icon="fa-warehouse"
                title="Warehouse Agent"
                color="bg-emerald-500"
                desc="Optimizes safety stock levels based on supplier reliability predictions."
              />
              <StrategyCard 
                icon="fa-truck-fast"
                title="Transport Agent"
                color="bg-amber-500"
                desc="Dynamically routes shipments. PAA anticipates delays to switch delivery modes."
              />
              <StrategyCard 
                icon="fa-industry"
                title="Supplier Agent"
                color="bg-purple-500"
                desc="Adjusts production rates to match downstream demand signals proactively."
              />
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-800">Simulation Intelligence Report</h2>
                <p className="text-slate-500 font-medium">Comparative Analysis: Traditional Reactive vs. Predictive Autonomous Agents</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => window.print()} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 shadow-sm transition-all">
                  <i className="fas fa-file-export mr-2"></i>Export Results
                </button>
                <button onClick={() => setActiveTab('config')} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
                  <i className="fas fa-redo-alt mr-2"></i>Modify Scenario
                </button>
              </div>
            </div>
            
            <Dashboard results={results} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-6 px-8 mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-sm font-medium">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2"><i className="fas fa-check-circle text-emerald-500"></i> System Operational</span>
            <span className="flex items-center gap-2"><i className="fas fa-microchip text-blue-400"></i> PAA Engine v2.1.0</span>
          </div>
          <p>© 2025 B.Tech Final Year Software Project • Hyper-Resilient Supply Chains</p>
        </div>
      </footer>
    </div>
  );
};

const StrategyCard = ({ icon, title, color, desc }: { icon: string; title: string; color: string; desc: string }) => (
  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
    <div className="flex items-start gap-4">
      <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform`}>
        <i className={`fas ${icon}`}></i>
      </div>
      <div>
        <h4 className="font-bold text-slate-800 text-sm">{title}</h4>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{desc}</p>
      </div>
    </div>
  </div>
);

export default App;
