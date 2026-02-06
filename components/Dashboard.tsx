
import React from 'react';
import { GameState, PlayerStats } from '../types.ts';

interface DashboardProps {
  gameState: GameState;
  onStartNextCase: () => void;
  onUpgrade: (toolKey: keyof PlayerStats['tools']) => void;
  onResetGame: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ gameState, onStartNextCase, onUpgrade, onResetGame }) => {
  
  const toolList: { key: keyof PlayerStats['tools'], name: string, desc: string, icon: React.ReactNode }[] = [
    { 
        key: 'aiScannerLevel', 
        name: 'AI FORENSIC SCANNER', 
        desc: 'Deteksi anomali pola transaksi dan log sistem secara otomatis.',
        icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
    },
    { 
        key: 'interrogationLevel', 
        name: 'INTERROGATION SUITE', 
        desc: 'Modul analisis stres auditee dan rekomendasi pertanyaan strategis.',
        icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
    },
    { 
        key: 'documentForensicLevel', 
        name: 'DEEP-SCAN X-RAY', 
        desc: 'Digital forensics untuk mendeteksi manipulasi teks pada dokumen.',
        icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
    },
    { 
        key: 'politicalShieldLevel', 
        name: 'POLITICAL LOBBYING', 
        desc: 'Akses jaringan untuk memitigasi dampak penalti integritas.',
        icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 overflow-y-auto custom-scrollbar">
      <header className="bg-slate-900 border-b-2 border-audit-gold/50 sticky top-0 z-50 px-6 py-4 shadow-2xl flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="bg-audit-gold text-slate-950 p-2 rounded-md font-black text-xl shadow-lg transform -rotate-1">BPK</div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tighter uppercase text-white">SIP-Auditor Terintegrasi</h1>
            <p className="text-[10px] text-audit-gold font-bold tracking-widest uppercase opacity-75">Sistem Informasi Pengawasan v3.1</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-8 mt-4 md:mt-0">
          <div className="text-right">
            <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Saldo Ops</p>
            <p className="text-xl font-mono text-audit-success font-black">Rp {gameState.stats.budget.toLocaleString('id-ID')}</p>
          </div>
          <div className="h-10 w-[1px] bg-slate-800 hidden md:block"></div>
          <div className="text-right">
            <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Integritas Profesi</p>
            <p className={`text-xl font-mono font-black ${gameState.stats.integrity < 50 ? 'text-audit-danger' : 'text-audit-accent'}`}>{gameState.stats.integrity}%</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 md:p-12 space-y-12">
        <div className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-audit-accent/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="space-y-4 text-center md:text-left">
                    <div className="inline-block bg-audit-accent/20 text-audit-accent px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-audit-accent/30">
                        Status Jabatan: Auditor Ahli Muda (Th-{gameState.fiscalYear})
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase leading-none">
                        Mulai Pemeriksaan <br/><span className="text-audit-gold">LHP Baru</span>
                    </h2>
                    <p className="text-slate-400 max-w-md text-sm leading-relaxed font-medium">
                        Identifikasi penyimpangan, kumpulkan bukti digital, dan berikan opini audit yang berintegritas untuk menyelamatkan keuangan negara.
                    </p>
                </div>
                <button 
                    onClick={onStartNextCase}
                    className="bg-audit-accent hover:bg-blue-500 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl hover:shadow-audit-accent/20 active:scale-95 group flex items-center"
                >
                    TERBITKAN SURAT TUGAS
                    <svg className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
            </div>
        </div>

        <section className="space-y-6">
            <div className="flex items-center space-x-3">
                <div className="w-2 h-6 bg-audit-gold rounded-full"></div>
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Perlengkapan Forensik Digital</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {toolList.map((tool) => {
                    const level = gameState.stats.tools[tool.key];
                    const nextCost = (level + 1) * 20000000;
                    const isMax = level >= 5;

                    return (
                        <div key={tool.key} className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl hover:bg-slate-900 hover:border-audit-accent/50 transition-all group flex flex-col justify-between">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-14 h-14 bg-slate-950 text-audit-gold border border-slate-800 rounded-2xl flex items-center justify-center shadow-inner group-hover:text-white group-hover:bg-audit-accent transition-all">
                                        {tool.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-white text-sm tracking-tight uppercase">{tool.name}</h4>
                                        <div className="flex mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <div key={i} className={`w-3 h-1 rounded-full mr-1 ${i < level ? 'bg-audit-gold' : 'bg-slate-800'}`}></div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-[10px] font-black text-slate-500 font-mono">MOD_ID: {tool.key.toUpperCase()}</span>
                            </div>
                            
                            <p className="text-xs text-slate-400 mt-4 leading-relaxed font-medium">{tool.desc}</p>
                            
                            <button 
                                onClick={() => onUpgrade(tool.key)}
                                disabled={isMax || gameState.stats.budget < nextCost}
                                className={`mt-6 w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border-2 ${
                                    isMax ? 'border-slate-800 text-slate-600 cursor-not-allowed' : 
                                    gameState.stats.budget >= nextCost ? 'border-audit-gold text-audit-gold hover:bg-audit-gold hover:text-slate-950' : 
                                    'border-slate-800 text-slate-700 opacity-50'
                                }`}
                            >
                                {isMax ? 'Unit Level Maksimal' : `Ajukan Upgrade: Rp ${nextCost.toLocaleString('id-ID')}`}
                            </button>
                        </div>
                    );
                })}
            </div>
        </section>

        <footer className="pt-12 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-6">
                <button onClick={onResetGame} className="text-slate-600 hover:text-audit-danger text-[9px] font-black uppercase tracking-widest transition-colors flex items-center">
                    <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    WIPE_STORAGE_DB
                </button>
            </div>
            <div className="text-[9px] text-slate-700 font-mono uppercase">
                &copy; 2025 BPK-RI | INTERNAL_USE_ONLY | ENCRYPTION_LEVEL: 512AES
            </div>
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;
