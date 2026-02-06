
import React, { useState, useEffect } from 'react';
import { GameState, INITIAL_GAME_STATE, Verdict, AuditPhase, Evidence } from './types.ts';
import { CaseGenerator } from './services/CaseGenerator.ts';
import Dashboard from './components/Dashboard.tsx';
import CaseView from './components/CaseView.tsx';

const STORAGE_KEY = 'e_audit_simulator_v3';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        return INITIAL_GAME_STATE;
      }
    }
    return INITIAL_GAME_STATE;
  });

  const [view, setView] = useState<'dashboard' | 'case' | 'summary'>('dashboard');
  const [taggedEvidences, setTaggedEvidences] = useState<Evidence[]>([]);
  const [lastVerdictResult, setLastVerdictResult] = useState<{correct: boolean, explanation: string, scoreDelta: number} | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  const handleStartNextCase = () => {
    const nextCase = gameState.stats.casesSolved === 0 
      ? CaseGenerator.getTutorialCase() 
      : CaseGenerator.generateCase(gameState.fiscalYear, gameState.stats);

    setGameState(prev => ({
        ...prev,
        currentCase: nextCase,
        currentPhase: AuditPhase.ENTRY_MEETING
    }));
    setTaggedEvidences([]);
    setView('case');
  };

  const handleTagEvidence = (ev: Evidence) => {
    if (taggedEvidences.find(item => item.id === ev.id)) return;
    setTaggedEvidences(prev => [...prev, ev]);
  };

  const handleRemoveEvidence = (id: string) => {
    setTaggedEvidences(prev => prev.filter(ev => ev.id !== id));
  };

  const handleResolveCase = (verdict: Verdict) => {
    if (!gameState.currentCase) return;

    const currentCase = gameState.currentCase;
    
    const linkedEvidenceInKKP = taggedEvidences.filter(ev => currentCase.linkedEvidenceIds.includes(ev.id));
    const isOpinionCorrect = verdict === currentCase.correctOpinion;
    const isStronglyProven = linkedEvidenceInKKP.length >= currentCase.linkedEvidenceIds.length;
    
    const isCorrect = isOpinionCorrect && (verdict === Verdict.WTP || isStronglyProven);
    
    let integrityDelta = 0;
    let budgetDelta = 0;

    if (isCorrect) {
        integrityDelta = 8;
        budgetDelta = 50000000 + (currentCase.difficulty * 20000000);
    } else {
        integrityDelta = -25;
        budgetDelta = 5000000;
    }

    setLastVerdictResult({
        correct: isCorrect,
        explanation: isCorrect 
          ? currentCase.explanation 
          : !isStronglyProven && verdict === Verdict.TW 
            ? "Opini Anda mungkin benar, tapi bukti di KKP sangat lemah. Auditee memenangkan gugatan di pengadilan." 
            : currentCase.explanation,
        scoreDelta: integrityDelta
    });

    setGameState(prev => ({
        ...prev,
        stats: {
            ...prev.stats,
            integrity: Math.min(100, Math.max(0, prev.stats.integrity + integrityDelta)),
            budget: prev.stats.budget + budgetDelta,
            casesSolved: prev.stats.casesSolved + 1
        },
        fiscalYear: Math.floor((prev.stats.casesSolved + 1) / 3) + 1,
        casesHistory: [...prev.casesHistory, { 
            caseId: currentCase.id, 
            year: prev.fiscalYear, 
            opinion: verdict, 
            correct: isCorrect
        }],
        currentCase: null,
        currentPhase: AuditPhase.CLOSED
    }));

    setView('summary');
  };

  const handleUpgrade = (toolKey: keyof typeof gameState.stats.tools) => {
    const currentLevel = gameState.stats.tools[toolKey];
    const upgradeCost = (currentLevel + 1) * 25000000; 
    
    if (gameState.stats.budget < upgradeCost) {
        alert("Budget operasional tidak cukup!");
        return;
    }

    setGameState(prev => ({
        ...prev,
        stats: {
            ...prev.stats,
            budget: prev.stats.budget - upgradeCost,
            tools: { ...prev.stats.tools, [toolKey]: prev.stats.tools[toolKey] + 1 }
        }
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {view === 'dashboard' && (
        <Dashboard 
            gameState={gameState} 
            onStartNextCase={handleStartNextCase}
            onUpgrade={handleUpgrade}
            onResetGame={() => { if(confirm("Hapus Karir?")) setGameState(INITIAL_GAME_STATE); }}
        />
      )}

      {view === 'case' && gameState.currentCase && (
        <CaseView 
            caseData={gameState.currentCase} 
            stats={gameState.stats}
            currentPhase={gameState.currentPhase}
            taggedEvidences={taggedEvidences}
            onPhaseChange={(p) => setGameState(prev => ({...prev, currentPhase: p}))}
            onResolve={handleResolveCase}
            onBack={() => setView('dashboard')}
            onTagEvidence={handleTagEvidence}
            onRemoveEvidence={handleRemoveEvidence}
        />
      )}

      {view === 'summary' && lastVerdictResult && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-6 backdrop-blur-md">
              <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-10 text-center space-y-6 shadow-2xl scale-in-center">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto ${lastVerdictResult.correct ? 'bg-green-600/20 text-green-500' : 'bg-red-600/20 text-red-500'}`}>
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={lastVerdictResult.correct ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} /></svg>
                  </div>
                  <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter">{lastVerdictResult.correct ? 'Audit Sukses' : 'Audit Gagal'}</h2>
                    <p className={`text-lg mt-1 font-black ${lastVerdictResult.scoreDelta > 0 ? 'text-audit-accent' : 'text-red-500'}`}>Integritas: {lastVerdictResult.scoreDelta > 0 ? '+' : ''}{lastVerdictResult.scoreDelta}%</p>
                  </div>
                  <div className="bg-slate-950 p-6 rounded-2xl text-xs text-slate-400 text-left leading-relaxed border border-slate-800">
                    <span className="font-black text-slate-500 block mb-2 uppercase tracking-widest text-[9px]">Laporan Tim Reviewer:</span>
                    {lastVerdictResult.explanation}
                  </div>
                  <button onClick={() => setView('dashboard')} className="w-full bg-audit-accent hover:bg-blue-500 py-5 rounded-2xl font-black uppercase tracking-widest transition-all">Kembali ke Dashboard</button>
              </div>
          </div>
      )}
    </div>
  );
};

export default App;
