
import React, { useState } from 'react';
import { Document, Evidence } from '../../types';

interface DocumentViewerProps {
  documents: Document[];
  forensicsLevel: number;
  onTagEvidence?: (ev: Evidence) => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ documents, forensicsLevel, onTagEvidence }) => {
  const [selectedDocId, setSelectedDocId] = useState<string>(documents[0]?.id);
  const selectedDoc = documents.find(d => d.id === selectedDocId);

  const handleTag = () => {
    if (selectedDoc && onTagEvidence) {
      onTagEvidence({
        id: selectedDoc.id,
        sourceType: 'doc',
        description: `Dokumen: ${selectedDoc.title}`,
        isStrongEvidence: selectedDoc.id.includes('EV') // Sesuai logika generator
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
      {forensicsLevel > 0 && <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden"><div className="scan-line"></div></div>}

      <div className="bg-slate-900 p-3 flex items-center justify-between border-b border-slate-800 shrink-0">
        <div className="flex space-x-2 overflow-x-auto custom-scrollbar pr-4">
          {documents.map(doc => (
            <button
              key={doc.id}
              onClick={() => setSelectedDocId(doc.id)}
              className={`px-4 py-2 text-[10px] rounded-xl font-black whitespace-nowrap transition-all uppercase tracking-tight border-2 ${
                selectedDocId === doc.id 
                  ? 'bg-audit-accent border-audit-accent text-white shadow-lg' 
                  : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
              }`}
            >
              {doc.title}
            </button>
          ))}
        </div>
        
        {selectedDoc && (
          <button 
            onClick={handleTag}
            className="bg-audit-gold hover:bg-yellow-500 text-slate-950 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 shadow-lg active:scale-95"
          >
            Tag Bukti KKP
          </button>
        )}
      </div>
      
      <div className="flex-1 p-4 md:p-10 overflow-y-auto bg-slate-950 custom-scrollbar font-sans">
        {selectedDoc ? (
          <div className="max-w-3xl mx-auto bg-white p-8 md:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-t-[12px] border-audit-gold relative min-h-full">
            <div className="absolute top-10 right-10 flex flex-col items-center opacity-10 pointer-events-none rotate-12">
               <div className="border-8 border-audit-navy p-4 rounded-xl text-audit-navy font-black text-4xl uppercase tracking-[0.2em]">BPK RI</div>
               <div className="text-audit-navy font-black text-sm uppercase mt-2">DOKUMEN NEGARA</div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
              .document-content table { border: 2px solid #000 !important; border-collapse: collapse !important; width: 100% !important; margin: 20px 0 !important; }
              .document-content td, .document-content th { border: 1px solid #000 !important; color: #000 !important; padding: 8px !important; font-family: 'JetBrains Mono', monospace; font-size: 11px; }
              .document-content th { background-color: #f1f5f9 !important; font-weight: 800 !important; text-transform: uppercase !important; }
              .document-content p, .document-content li, .document-content h3, .document-content h4 { color: #000 !important; margin-bottom: 12px !important; }
              ${forensicsLevel >= 1 ? '.document-content span.text-red-700, .document-content .underline { background: #fef08a !important; padding: 2px 4px; border-radius: 2px; }' : ''}
            `}} />
            
            <div className="flex justify-between items-start border-b-4 border-black pb-6 mb-10">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center font-black text-slate-300">LOGO</div>
                <div>
                    <h1 className="text-xl font-black leading-none uppercase tracking-tighter text-black">Audit Forensik</h1>
                    <p className="text-[8px] font-bold text-black/50 uppercase tracking-[0.4em] mt-1">Sistem Pengawasan Digital</p>
                </div>
              </div>
              <div className="text-right">
                 <div className="bg-black text-white px-2 py-0.5 text-[8px] font-mono font-black rounded uppercase tracking-widest mb-1">RAHASIA</div>
                 <p className="text-[9px] font-mono font-bold text-black/40 uppercase">{selectedDoc.id}</p>
              </div>
            </div>

            <div className="mb-8">
                <h2 className="text-lg font-black text-black uppercase tracking-tight leading-tight">{selectedDoc.title}</h2>
            </div>
            
            <div 
              className="text-[12px] leading-relaxed document-content font-medium text-black"
              dangerouslySetInnerHTML={{ __html: selectedDoc.content }}
            />
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-700 italic">
            <span className="font-black uppercase tracking-[0.3em] text-[10px]">Pilih berkas untuk diperiksa</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentViewer;
