
import React from 'react';
import { LogEntry, Evidence } from '../../types';

interface LogTerminalProps {
  logs: LogEntry[];
  aiScannerLevel: number;
  onTagEvidence?: (ev: Evidence) => void;
}

const LogTerminal: React.FC<LogTerminalProps> = ({ logs, aiScannerLevel, onTagEvidence }) => {
  return (
    <div className="h-full bg-slate-950 border border-slate-800 rounded-2xl flex flex-col font-mono shadow-2xl overflow-hidden">
      <div className="bg-slate-900 px-4 py-3 text-slate-400 flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${aiScannerLevel > 0 ? 'bg-blue-500 animate-pulse' : 'bg-slate-700'}`}></div>
            <span className="text-[10px] font-bold tracking-widest uppercase">
                {aiScannerLevel > 0 ? `AI_FORENSIC_V${aiScannerLevel}.log` : 'Standard_System.log'}
            </span>
        </div>
        <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Live Trace Active</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-[9px] text-slate-500 uppercase font-black tracking-widest">
              <th className="pb-2 px-2">TIMESTAMP</th>
              <th className="pb-2 px-2">ACTION</th>
              <th className="pb-2 px-2">EVENT_DATA</th>
              <th className="pb-2 px-2 text-right">OPS</th>
            </tr>
          </thead>
          <tbody className="text-[10px]">
            {logs.map((log) => (
              <tr key={log.id} className="bg-slate-900/40 hover:bg-slate-900/80 transition-all rounded-lg group">
                <td className="py-3 px-2 text-slate-500 font-mono whitespace-nowrap">{log.timestamp}</td>
                <td className="py-3 px-2">
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black ${log.action === 'OVERRIDE' ? 'bg-red-600/20 text-red-500' : 'bg-slate-800 text-slate-400'}`}>
                    {log.action}
                  </span>
                </td>
                <td className="py-3 px-2 text-slate-300 leading-tight">
                  {log.details}
                </td>
                <td className="py-3 px-2 text-right">
                  <button 
                    onClick={() => onTagEvidence?.({ id: log.id, sourceType: 'log', description: log.details, isStrongEvidence: !!log.flagged })}
                    className="bg-audit-gold hover:bg-yellow-500 text-slate-950 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all shadow-lg active:scale-90"
                  >
                    Tag KKP
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LogTerminal;
