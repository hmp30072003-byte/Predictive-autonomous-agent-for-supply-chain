
import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar, Cell
} from 'recharts';
import { SimulationResult, AgentMode } from '../types';
import { COLORS } from '../constants';

interface DashboardProps {
  results: SimulationResult[];
}

const Dashboard: React.FC<DashboardProps> = ({ results }) => {
  const trad = results.find(r => r.mode === AgentMode.TRADITIONAL);
  const paa = results.find(r => r.mode === AgentMode.PAA);

  if (!trad || !paa) return null;

  const comparisonData = [
    { name: 'Service Level %', trad: trad.metrics.serviceLevel, paa: paa.metrics.serviceLevel },
    { name: 'Resilience Score', trad: trad.metrics.resilienceScore, paa: paa.metrics.resilienceScore },
  ];

  const costData = [
    { name: 'Total Cost (k$)', trad: trad.metrics.totalCost / 1000, paa: paa.metrics.totalCost / 1000 },
  ];

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard 
          title="Service Level" 
          val1={trad.metrics.serviceLevel + '%'} 
          val2={paa.metrics.serviceLevel + '%'} 
          label="Target: >95%"
          isPercentage
        />
        <MetricCard 
          title="Avg Stockout Duration" 
          val1={trad.metrics.avgDelay + 'd'} 
          val2={paa.metrics.avgDelay + 'd'} 
          label="Lower is better"
          invert
        />
        <MetricCard 
          title="Total Simulation Cost" 
          val1={'$' + trad.metrics.totalCost.toLocaleString()} 
          val2={'$' + paa.metrics.totalCost.toLocaleString()} 
          label="Holding + Backorder"
          invert
        />
        <MetricCard 
          title="Resilience Score" 
          val1={trad.metrics.resilienceScore.toString()} 
          val2={paa.metrics.resilienceScore.toString()} 
          label="B.Tech PAA Evaluation"
          highlight
        />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <i className="fas fa-chart-line text-blue-500"></i>
            Inventory Level: Traditional vs PAA
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart margin={{ top: 5, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" hide />
                <YAxis label={{ value: 'Units', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Legend iconType="circle" />
                <Line 
                  data={trad.snapshots} 
                  type="monotone" 
                  name="Traditional" 
                  dataKey="inventory" 
                  stroke={COLORS.traditional} 
                  strokeWidth={2} 
                  dot={false}
                />
                <Line 
                  data={paa.snapshots} 
                  type="monotone" 
                  name="PAA (Predictive)" 
                  dataKey="inventory" 
                  stroke={COLORS.paa} 
                  strokeWidth={2} 
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-xs text-slate-500 italic">
            * Note how PAA inventory reacts earlier to demand signals, preventing deep stockouts during disruptions.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <i className="fas fa-chart-bar text-amber-500"></i>
            Comparison Performance
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Legend />
                <Bar dataKey="trad" name="Traditional" fill={COLORS.traditional} radius={[0, 4, 4, 0]} />
                <Bar dataKey="paa" name="PAA (Predictive)" fill={COLORS.paa} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-800 leading-relaxed">
            <strong>PAA Analysis:</strong> The Predictive Autonomous Agents achieved a 
            <span className="font-bold"> {(paa.metrics.serviceLevel - trad.metrics.serviceLevel).toFixed(1)}% improvement </span> 
            in service levels by identifying disruption signals {paramsToDays(paa)} days in advance.
          </div>
        </div>
      </div>

      {/* Detail Logs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Autonomous Agent Decision Logs (PAA)</h3>
          <span className="text-xs font-mono text-slate-400">SESSION_ID: 0xPAA_99</span>
        </div>
        <div className="max-h-[300px] overflow-y-auto font-mono text-[11px] p-4 bg-slate-900 text-slate-300 space-y-1">
          {paa.snapshots.map((s, i) => (
            <div key={i} className={`flex gap-4 ${s.agentAction ? 'text-emerald-400 bg-emerald-950/30 -mx-4 px-4 py-0.5' : ''}`}>
              <span className="text-slate-500 w-12 text-right">Day {s.day.toString().padStart(2, '0')}:</span>
              <span className={`w-24 ${s.isDisrupted ? 'text-red-400 font-bold' : ''}`}>
                {s.isDisrupted ? '[DISRUPTION]' : '[STABLE]'}
              </span>
              <span className="flex-1">
                {s.agentAction ? s.agentAction : 'No reorder triggered. Current Stock: ' + s.inventory}
              </span>
              <span className="text-slate-500 italic">Stockout: {s.backorder}u</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, val1, val2, label, invert = false, isPercentage = false, highlight = false }) => {
  const getImprovement = () => {
    const v1 = parseFloat(val1);
    const v2 = parseFloat(val2);
    const diff = v2 - v1;
    if (invert) return diff < 0;
    return diff > 0;
  };

  const isBetter = getImprovement();

  return (
    <div className={`p-5 rounded-xl border ${highlight ? 'bg-indigo-600 border-indigo-700 text-white' : 'bg-white border-slate-200 text-slate-800'}`}>
      <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${highlight ? 'text-indigo-200' : 'text-slate-500'}`}>{title}</div>
      <div className="flex items-baseline gap-2 mb-1">
        <span className={`text-2xl font-black ${highlight ? 'text-white' : 'text-blue-600'}`}>{val2}</span>
        <span className={`text-xs font-medium ${highlight ? 'text-indigo-200 line-through' : 'text-slate-400 line-through'}`}>{val1}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${isBetter ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
          {isBetter ? <i className="fas fa-arrow-up mr-1"></i> : <i className="fas fa-arrow-down mr-1"></i>}
          {isBetter ? 'Better' : 'Worse'}
        </span>
        <span className={`text-[10px] ${highlight ? 'text-indigo-200' : 'text-slate-500'}`}>{label}</span>
      </div>
    </div>
  );
};

// Helper
const paramsToDays = (paa: SimulationResult) => Math.floor(paa.snapshots.length * 0.1);

export default Dashboard;
