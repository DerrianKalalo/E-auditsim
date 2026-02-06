
import React from 'react';
import { Evidence } from '../../types.ts';

interface EvidenceBoardProps {
  taggedEvidence: Evidence[];
  onRemove: (id: string) => void;
}

const EvidenceBoard: React.FC<EvidenceBoardProps> = ({ taggedEvidence, onRemove }) => {
  return (
    <div className="h-full bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-black text-audit-gold uppercase tracking-[0.3em]">Kertas Kerja Pemeriksaan (KKP)</h3>
        <span className="bg-audit-accent/20 text-audit-accent px-2 py-1 rounded text-[10px] font-bold">{taggedEvidence.length} Bukti Terkumpul</span>
      </div>

      {taggedEvidence.length === 0 ? (
        <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl text-slate-600">
           <svg className="w-10 h-10 mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
           <span className="text-[10px] uppercase font-black tracking-widest">Klik 'Tag Evidence' pada data yang mencurigakan</span>
        </div>
      ) : (
        <div className="space-y-3">
          {taggedEvidence.map(ev => (
            <div key={ev.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl relative group hover:border-audit-accent transition-all animate-in slide-in-from-right-2">
              <button 
                onClick={() => onRemove(ev.id)}
                className="absolute top-2 right-2 text-slate-700 hover:text-red-500 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              </button>
              <div className="flex items-center space-x-2 mb-2">
                <span className={`text-[8px] px-1.5 py-0.5 rounded font-black uppercase ${
                  ev.sourceType === 'bank' ? 'bg-green-600/20 text-green-500' :
                  ev.sourceType === 'doc' ? 'bg-blue-600/20 text-blue-500' : 'bg-purple-600/20 text-purple-500'
                }`}>
                  {ev.sourceType}
                </span>
                <span className="text-[8px] text-slate-600 font-mono">{ev.id}</span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium leading-relaxed">{ev.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EvidenceBoard;
