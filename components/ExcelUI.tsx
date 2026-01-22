
import React from 'react';
import { SimulationParams } from '../types';

interface ExcelUIProps {
  params: SimulationParams;
  setParams: (p: SimulationParams) => void;
  onRun: () => void;
}

const ExcelUI: React.FC<ExcelUIProps> = ({ params, setParams, onRun }) => {
  const handleChange = (key: keyof SimulationParams, value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setParams({ ...params, [key]: num });
    }
  };

  const fields: { key: keyof SimulationParams; label: string; unit: string }[] = [
    { key: 'initialInventory', label: 'Initial Inventory', unit: 'Units' },
    { key: 'demandMin', label: 'Min Daily Demand', unit: 'Units/Day' },
    { key: 'demandMax', label: 'Max Daily Demand', unit: 'Units/Day' },
    { key: 'reorderLevel', label: 'Reorder Point (ROP)', unit: 'Units' },
    { key: 'reorderQty', label: 'Reorder Quantity (EOQ)', unit: 'Units' },
    { key: 'leadTimeMin', label: 'Min Lead Time', unit: 'Days' },
    { key: 'leadTimeMax', label: 'Max Lead Time', unit: 'Days' },
    { key: 'simulationDays', label: 'Horizon', unit: 'Days' },
    { key: 'disruptionProbability', label: 'Disruption Risk', unit: '0.0 - 1.0' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-emerald-700 text-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <i className="fas fa-file-excel text-xl"></i>
          <span className="font-semibold tracking-tight">SupplyChain_Config.xlsx</span>
        </div>
        <div className="flex gap-4 text-xs font-medium opacity-80">
          <span>Sheet1: Input Parameters</span>
          <span className="opacity-50">Sheet2: Output Results</span>
        </div>
      </div>
      
      <div className="p-0 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-2 border-r border-slate-200 text-xs font-bold text-slate-500 w-12 text-center italic">Row</th>
              <th className="px-4 py-2 border-r border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">Parameter Name</th>
              <th className="px-4 py-2 border-r border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">Value</th>
              <th className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Unit/Reference</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((f, idx) => (
              <tr key={f.key} className="hover:bg-blue-50/50 transition-colors group border-b border-slate-100">
                <td className="px-4 py-2 border-r border-slate-200 text-xs text-slate-400 bg-slate-50/30 text-center font-medium italic group-hover:text-blue-500">
                  {idx + 1}
                </td>
                <td className="px-4 py-2 border-r border-slate-200 text-sm font-medium text-slate-700">
                  {f.label}
                </td>
                <td className="px-4 py-2 border-r border-slate-200">
                  <input
                    type="number"
                    step="0.1"
                    className="w-full bg-transparent border-none focus:ring-0 text-sm font-semibold text-blue-600 focus:outline-none placeholder-blue-300"
                    value={params[f.key]}
                    onChange={(e) => handleChange(f.key, e.target.value)}
                  />
                </td>
                <td className="px-4 py-2 text-xs text-slate-500 italic">
                  {f.unit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 bg-slate-50 flex justify-end gap-3 border-t border-slate-200">
        <button 
          onClick={() => setParams({ ...params })} // Simulate "Save"
          className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all flex items-center gap-2"
        >
          <i className="fas fa-save"></i> Save Changes
        </button>
        <button 
          onClick={onRun}
          className="px-6 py-2 text-sm font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-sm transition-all flex items-center gap-2"
        >
          <i className="fas fa-play"></i> RUN SIMULATION
        </button>
      </div>
    </div>
  );
};

export default ExcelUI;
