
import React, { useState, useRef, useEffect } from 'react';
import { NPC, Case } from '../../types.ts';
import { generateInterviewResponse, InterviewTurn } from '../../services/geminiService.ts';

interface InterviewPanelProps {
  npc: NPC;
  currentCase: Case;
  interrogationLevel: number;
}

const InterviewPanel: React.FC<InterviewPanelProps> = ({ npc, currentCase, interrogationLevel }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: npc.openingLine }
  ]);
  const [choices, setChoices] = useState<string[]>([]);
  const [recommendedIndex, setRecommendedIndex] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    const initChoices = async () => {
        setIsLoading(true);
        const result = await generateInterviewResponse(currentCase, npc, [], null);
        if (isMounted) {
            setChoices(result.choices);
            setRecommendedIndex(result.recommendedIndex);
            setIsLoading(false);
        }
    };
    initChoices();
    return () => { isMounted = false };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSelectChoice = async (selectedChoice: string) => {
    if (isLoading) return;

    setMessages(prev => [...prev, { role: 'user', text: selectedChoice }]);
    setIsLoading(true);

    const turnResult: InterviewTurn = await generateInterviewResponse(
        currentCase, 
        npc, 
        messages, 
        selectedChoice
    );

    setMessages(prev => [...prev, { role: 'model', text: turnResult.response }]);
    setChoices(turnResult.choices);
    setRecommendedIndex(turnResult.recommendedIndex);
    setIsLoading(false);
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      <div className="bg-slate-900 px-6 py-5 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-5">
            <div className="relative group">
                <div className="absolute inset-0 bg-audit-accent rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <img 
                    src={npc.avatar} 
                    alt={npc.name} 
                    className="w-14 h-14 rounded-2xl border-2 border-slate-700 object-cover shadow-2xl relative z-10" 
                />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-audit-success border-4 border-slate-900 rounded-full z-20"></div>
            </div>
            <div>
              <h3 className="font-black text-white text-lg leading-tight uppercase tracking-tight">{npc.name}</h3>
              <p className="text-[10px] text-audit-gold uppercase font-black tracking-[0.2em]">{npc.role}</p>
            </div>
        </div>
        
        {interrogationLevel > 0 && (
            <div className="text-right space-y-1">
                <div className="flex items-center justify-end text-audit-accent">
                    <span className="text-[9px] font-black uppercase tracking-widest mr-2">Stress Analysis</span>
                    <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden flex">
                        <div className="h-full bg-audit-danger animate-pulse" style={{width: '65%'}}></div>
                    </div>
                </div>
                <p className="text-[8px] text-slate-500 font-mono">EYE_MOVEMENT: UNSTABLE</p>
            </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth" ref={scrollRef}>
        <div className="text-center opacity-30 py-4">
            <span className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-500">— TRANSKRIP SIDANG DIMULAI —</span>
        </div>

        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}
          >
            <div className="flex flex-col space-y-1 max-w-[80%]">
                <span className={`text-[8px] font-black uppercase tracking-widest ${msg.role === 'user' ? 'text-right text-audit-accent' : 'text-slate-500'}`}>
                    {msg.role === 'user' ? 'Auditor Utama' : 'Pihak Terperiksa'}
                </span>
                <div 
                  className={`rounded-2xl px-5 py-4 text-sm leading-relaxed shadow-xl border ${
                    msg.role === 'user' 
                      ? 'bg-audit-accent border-blue-400/30 text-white rounded-tr-none' 
                      : 'bg-slate-900 border-slate-800 text-slate-200 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                  {interrogationLevel >= 2 && msg.role === 'model' && (
                    <div className="mt-3 pt-3 border-t border-slate-800/50 flex items-start space-x-2">
                        <div className="w-4 h-4 text-audit-gold shrink-0">
                            <svg fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                        </div>
                        <p className="text-[10px] text-audit-gold font-bold italic">
                            Modul Psikologi: Terdeteksi upaya pengalihan tanggung jawab (deflection).
                        </p>
                    </div>
                  )}
                </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                <div className="flex space-x-2">
                    <div className="w-1.5 h-1.5 bg-audit-accent rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-audit-accent rounded-full animate-bounce [animation-delay:-.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-audit-accent rounded-full animate-bounce [animation-delay:-.5s]"></div>
                </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-slate-900 border-t border-slate-800 shrink-0">
        {!isLoading && choices.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-2">
                <div className="w-1 h-3 bg-audit-accent"></div>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em]">Strategi Interogasi Auditor</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
                {choices.map((choice, idx) => {
                const isRecommended = interrogationLevel >= 1 && idx === recommendedIndex;
                return (
                    <button
                    key={idx}
                    onClick={() => handleSelectChoice(choice)}
                    className={`group w-full text-left bg-slate-950 border-2 p-4 rounded-2xl text-xs transition-all active:scale-[0.98] flex items-center relative overflow-hidden ${
                        isRecommended 
                        ? 'border-audit-accent/50 bg-audit-accent/5 shadow-2xl' 
                        : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                    >
                    <div className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-xl mr-4 font-black transition-all ${
                        isRecommended ? 'bg-audit-accent text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-slate-800 text-slate-500 group-hover:bg-slate-700'
                    }`}>
                        {idx + 1}
                    </div>
                    <div className="flex-1">
                        <span className={`leading-relaxed font-bold ${isRecommended ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>{choice}</span>
                        {isRecommended && (
                            <div className="mt-1.5 flex items-center">
                                <span className="text-[8px] bg-audit-accent text-white px-2 py-0.5 rounded font-black uppercase tracking-widest animate-pulse">Rekomendasi Strategis AI</span>
                            </div>
                        )}
                    </div>
                    <svg className={`w-5 h-5 ml-4 transition-transform group-hover:translate-x-1 ${isRecommended ? 'text-audit-accent' : 'text-slate-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                    </button>
                );
                })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default InterviewPanel;
