
import React, { useState } from 'react';
import { BankRecord, NPC, Evidence } from '../../types.ts';

interface BankForensicsProps {
  records: BankRecord[];
  bankForensicLevel: number;
  npc: NPC;
  onTagEvidence?: (ev: Evidence) => void;
}

const BankForensics: React.FC<BankForensicsProps> = ({ records, bankForensicLevel, npc, onTagEvidence }) => {
  const [activeSubTab, setActiveSubTab] = useState<'statement' | 'profile'>('statement');

  return (
    <div className="h-full bg-slate-50 border-4 border-slate-300 rounded-3xl flex flex-col shadow-2xl overflow-hidden font-sans">
      <div className="bg-white p-5 border-b-2 border-slate-200 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-sm font-black text-slate-800 uppercase italic leading-none">SIP-BANK Forensik</h2>
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Otoritas Pemeriksaan Perbankan</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button onClick={() => setActiveSubTab('statement')} className={`px-4 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${activeSubTab === 'statement' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-200'}`}>Mutasi</button>
          <button onClick={() => setActiveSubTab('profile')} className={`px-4 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${activeSubTab === 'profile' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-200'}`}>Profil</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-white custom-scrollbar">
        {activeSubTab === 'statement' ? (
          <div className="p-4">
            <table className="w-full text-left border-separate border-spacing-y-1">
              <thead>
                <tr className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
                  <th className="py-2 px-3">Tanggal</th>
                  <th className="py-2 px-3">Deskripsi</th>
                  <th className="py-2 px-3 text-right">Nilai (IDR)</th>
                  <th className="py-2 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-[10px]">
                {records.map((rec, i) => (
                  <tr key={i} className="bg-slate-50 hover:bg-slate-100 transition-colors">
                    <td className="py-4 px-3 font-mono text-slate-500 whitespace-nowrap">{rec.date}</td>
                    <td className="py-4 px-3 font-bold text-slate-800">{rec.description}</td>
                    <td className={`py-4 px-3 text-right font-mono font-black text-xs ${rec.type === 'CR' ? 'text-green-600' : 'text-slate-800'}`}>
                      {rec.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="py-4 px-3 text-right">
                      <button 
                        onClick={() => onTagEvidence?.({ id: `BANK-${i}`, sourceType: 'bank', description: `Transfer ${rec.amount.toLocaleString()} - ${rec.description}`, isStrongEvidence: !!rec.isSuspicious })}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all shadow-md active:scale-90"
                      >
                        Tag KKP
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 space-y-6 max-w-xl mx-auto">
             <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Nama Pemilik Akun</p>
                <p className="text-2xl font-black uppercase mt-1 tracking-tighter">{npc.name}</p>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[9px] uppercase font-black text-slate-500">NIK / KTP</p>
                    <p className="text-sm font-mono font-bold">{npc.ktp || '3171020038840001'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-black text-slate-500">Status BI</p>
                    <p className="text-sm font-bold text-audit-gold uppercase">High-Risk</p>
                  </div>
                </div>
             </div>
             <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-100 flex items-start space-x-4">
                <div className="bg-red-600 text-white p-2 rounded-xl">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <div>
                  <p className="text-[11px] font-black text-red-800 uppercase italic">Catatan Intelijen Keuangan:</p>
                  <p className="text-[11px] text-red-700 leading-relaxed mt-1 font-medium">Terdeteksi aliran dana tidak wajar ke entitas cangkang (Shell Company) di British Virgin Islands.</p>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BankForensics;
