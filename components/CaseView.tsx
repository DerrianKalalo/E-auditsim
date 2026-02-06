
import React, { useState, useEffect } from 'react';
import { Case, Verdict, AuditPhase, PlayerStats, Evidence } from '../types';
import DocumentViewer from './tools/DocumentViewer';
import LogTerminal from './tools/LogTerminal';
import InterviewPanel from './tools/InterviewPanel';
import BankForensics from './tools/BankForensics';
import EvidenceBoard from './tools/EvidenceBoard';

interface CaseViewProps {
  caseData: Case;
  stats: PlayerStats;
  currentPhase: AuditPhase;
  taggedEvidences: Evidence[];
  onPhaseChange: (phase: AuditPhase) => void;
  onResolve: (verdict: Verdict) => void;
  onBack: () => void;
  onTagEvidence: (ev: Evidence) => void;
  onRemoveEvidence: (id: string) => void;
}

const CaseView: React.FC<CaseViewProps> = ({ 
  caseData, stats, currentPhase, taggedEvidences, onPhaseChange, onResolve, onBack, onTagEvidence, onRemoveEvidence 
}) => {
  const [activeTab, setActiveTab] = useState<'docs' | 'logs' | 'interview' | 'bank' | 'kkp'>('docs');
  const [showToast, setShowToast] = useState(false);
  
  const phases = [AuditPhase.ENTRY_MEETING, AuditPhase.FIELDWORK, AuditPhase.EXIT_MEETING, AuditPhase.REPORTING];
  const currentIdx = phases.indexOf(currentPhase);

  const handleTagWithFeedback = (ev: Evidence) => {
    onTagEvidence(ev);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const renderTool = () => {
    switch(activeTab) {
        case 'docs': return <DocumentViewer documents={caseData.documents} forensicsLevel={stats.tools.documentForensicLevel} onTagEvidence={handleTagWithFeedback} />;
        case 'logs': return <LogTerminal logs={caseData.logs} aiScannerLevel={stats.tools.aiScannerLevel} onTagEvidence={handleTagWithFeedback} />;
        case 'interview': return <InterviewPanel npc={caseData.npc} currentCase={caseData} interrogationLevel={stats.tools.interrogationLevel} />;
        case 'bank': return <BankForensics records={caseData.bankRecords} bankForensicLevel={stats.tools.bankForensicLevel} npc={caseData.npc} onTagEvidence={handleTagWithFeedback} />;
        case 'kkp': return <EvidenceBoard taggedEvidence={taggedEvidences} onRemove={onRemoveEvidence} />;
    }
  }

  const renderContent = () => {
    switch (currentPhase) {
      case AuditPhase.ENTRY_MEETING:
        return (
          <div className="flex flex-col h-full justify-center items-center p-6 space-y-8 text-center max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-red-600/20 text-red-600 rounded-3xl flex items-center justify-center shadow-inner ring-4 ring-red-600/10">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Misi: Corruption Hunter</h2>
              <p className="text-sm md:text-base text-slate-400 leading-relaxed italic">
                Pemeriksaan Khusus: <span className="text-white font-bold">{caseData.title}</span>
              </p>
              <p className="text-xs md:text-sm text-slate-500 max-w-md mx-auto">
                Intelijen memastikan ada penggelapan dana di sini. Cari dan <span className="text-audit-gold font-black underline">klik tombol 'Tag Bukti KKP'</span> pada dokumen, log, atau transaksi bank untuk mengumpulkan minimal 2 bukti kuat.
              </p>
            </div>
            <button 
              onClick={() => onPhaseChange(AuditPhase.FIELDWORK)}
              className="w-full max-w-xs bg-red-600 hover:bg-red-500 text-white active:scale-95 py-5 rounded-2xl font-black shadow-2xl transition-all uppercase tracking-widest text-sm"
            >
              Mulai Penyelidikan Lapangan
            </button>
          </div>
        );
      case AuditPhase.REPORTING:
        return (
          <div className="flex flex-col h-full p-6 md:p-12 space-y-8 max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500 overflow-y-auto">
            <div className="space-y-2 text-center">
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Vonis Akhir</h2>
                <p className="text-sm text-slate-400 italic">"Gunakan kekuatan hukum berdasarkan bukti yang Anda kumpulkan."</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.values(Verdict).map(v => (
                <button
                  key={v}
                  onClick={() => onResolve(v)}
                  className="p-6 text-left bg-slate-900 border border-slate-800 rounded-3xl hover:bg-slate-800 hover:border-red-500/50 active:scale-[0.98] transition-all shadow-xl group"
                >
                  <p className="text-sm font-black text-audit-accent uppercase tracking-tight group-hover:text-red-400">{v}</p>
                  <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
                      {v === Verdict.TW ? 'Berikan vonis ini untuk memidanakan para koruptor.' : 'Berikan vonis ini jika Anda merasa bukti tidak mencukupi untuk pidana.'}
                  </p>
                </button>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div className="h-full flex flex-col md:flex-row overflow-hidden bg-slate-950">
            <div className="flex-1 flex flex-col min-w-0">
                <div className="flex-1 overflow-hidden p-2 md:p-4 bg-slate-950 relative">
                    {renderTool()}
                    
                    {/* Toast Notification */}
                    {showToast && (
                      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 duration-300">
                        <div className="bg-audit-success text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl flex items-center border-2 border-green-400">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                          Bukti Berhasil Ditambahkan ke KKP
                        </div>
                      </div>
                    )}
                </div>
                <div className="h-20 bg-slate-900 border-t border-slate-800 flex justify-around items-center px-4 shrink-0 z-10">
                    <button onClick={() => setActiveTab('docs')} className={`p-2 flex flex-col items-center ${activeTab === 'docs' ? 'text-audit-accent' : 'text-slate-500'}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth={2.5} /></svg>
                        <span className="text-[8px] uppercase mt-1 font-black">Dokumen</span>
                    </button>
                    <button onClick={() => setActiveTab('logs')} className={`p-2 flex flex-col items-center ${activeTab === 'logs' ? 'text-audit-accent' : 'text-slate-500'}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" strokeWidth={2.5} /></svg>
                        <span className="text-[8px] uppercase mt-1 font-black">Log Sistem</span>
                    </button>
                    <button onClick={() => setActiveTab('bank')} className={`p-2 flex flex-col items-center ${activeTab === 'bank' ? 'text-audit-accent' : 'text-slate-500'}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                        <span className="text-[8px] uppercase mt-1 font-black">Bank</span>
                    </button>
                    <button onClick={() => setActiveTab('kkp')} className={`p-2 flex flex-col items-center relative ${activeTab === 'kkp' ? 'text-audit-gold' : 'text-slate-500'}`}>
                        {taggedEvidences.length > 0 && <span className="absolute top-1 right-2 w-3 h-3 bg-audit-gold text-slate-950 text-[7px] font-black rounded-full flex items-center justify-center border-2 border-slate-900">{taggedEvidences.length}</span>}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        <span className="text-[8px] uppercase mt-1 font-black">KKP</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('interview')}
                        className={`p-2 flex flex-col items-center ${activeTab === 'interview' ? 'text-audit-accent' : 'text-slate-500'} ${currentPhase !== AuditPhase.EXIT_MEETING ? 'opacity-20' : ''}`}
                        disabled={currentPhase !== AuditPhase.EXIT_MEETING}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeWidth={2.5} /></svg>
                        <span className="text-[8px] uppercase mt-1 font-black">Interogasi</span>
                    </button>
                </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col overflow-hidden">
      <div className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 shrink-0 z-50">
        <button onClick={onBack} className="text-slate-500 hover:text-white p-2 flex items-center text-[10px] uppercase font-black tracking-widest">
            Dashboard
        </button>
        <div className="text-center flex-1 mx-4 min-w-0">
          <h2 className="text-[10px] md:text-xs font-black truncate text-red-500 uppercase tracking-widest underline decoration-red-900">{caseData.title}</h2>
          <p className="text-[8px] text-slate-500 font-black uppercase mt-0.5 tracking-widest">{taggedEvidences.length} / 2 Bukti Terkumpul</p>
        </div>
        <div className="flex items-center space-x-3">
            {currentPhase === AuditPhase.FIELDWORK && (
            <button 
              onClick={() => onPhaseChange(AuditPhase.EXIT_MEETING)} 
              disabled={taggedEvidences.length < 2}
              className={`bg-audit-accent hover:bg-blue-500 text-white text-[10px] font-black uppercase px-4 py-2 rounded-xl transition-all ${taggedEvidences.length < 2 ? 'opacity-30 cursor-not-allowed grayscale' : 'shadow-xl'}`}
            >
              Exit Meeting
            </button>
            )}
            {currentPhase === AuditPhase.EXIT_MEETING && (
            <button onClick={() => onPhaseChange(AuditPhase.REPORTING)} className="bg-red-600 hover:bg-red-500 text-[10px] font-black uppercase px-4 py-2 rounded-xl transition-all shadow-xl">Vonis LHP</button>
            )}
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
};

export default CaseView;
