
export enum Verdict {
  WTP = 'Wajar Tanpa Pengecualian (WTP)',
  WDP = 'Wajar Dengan Pengecualian (WDP)',
  TW = 'Tidak Wajar (TW)',
  TMP = 'Tidak Memberikan Pendapat (TMP)',
}

export enum AuditPhase {
  ENTRY_MEETING = 'Entry Meeting',
  FIELDWORK = 'Pemeriksaan Lapangan',
  EXIT_MEETING = 'Exit Meeting',
  REPORTING = 'Finalisasi LHP',
  CLOSED = 'Selesai'
}

export interface Evidence {
  id: string;
  sourceType: 'doc' | 'log' | 'bank';
  description: string;
  isStrongEvidence: boolean;
}

export interface Document {
  id: string;
  title: string;
  type: 'invoice' | 'report' | 'email' | 'budget' | 'contract';
  content: string;
  metadata?: Record<string, any>;
  isLocked?: boolean; // Harus dibuka dengan kunci dari bukti lain
}

export interface LogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  flagged?: boolean;
}

export interface BankRecord {
  date: string;
  description: string;
  type: 'DB' | 'CR';
  amount: number;
  balance: number;
  isSuspicious?: boolean;
}

export interface NPC {
  name: string;
  role: string;
  avatar: string;
  personality: string;
  knowledge: string;
  defenseStrategy: string;
  openingLine: string;
  ktp?: string;
  npwp?: string;
}

export interface Case {
  id: string;
  fiscalYear: number;
  title: string;
  description: string;
  difficulty: number;
  politicalPressure: number;
  documents: Document[];
  logs: LogEntry[];
  bankRecords: BankRecord[];
  npc: NPC;
  findings: string[];
  correctOpinion: Verdict;
  explanation: string;
  isTutorial?: boolean;
  linkedEvidenceIds: string[]; // ID bukti yang harus ditemukan untuk memecahkan kasus
}

export interface PlayerStats {
  integrity: number; 
  professionalism: number;
  budget: number;
  casesSolved: number;
  politicalCapital: number; // Sumber daya baru untuk melawan intervensi
  tools: {
    aiScannerLevel: number;
    politicalShieldLevel: number;
    interrogationLevel: number;
    documentForensicLevel: number;
    bankForensicLevel: number;
  };
}

export interface GameState {
  fiscalYear: number;
  stats: PlayerStats;
  casesHistory: {
    caseId: string;
    year: number;
    opinion: Verdict;
    correct: boolean;
  }[];
  currentCase: Case | null;
  currentPhase: AuditPhase;
  taggedEvidenceIds: string[]; // Bukti yang ditandai pemain
  activeInterference: {
    sender: string;
    message: string;
    bribeAmount: number;
    integrityImpact: number;
  } | null;
}

export const INITIAL_GAME_STATE: GameState = {
  fiscalYear: 1,
  stats: {
    integrity: 100,
    professionalism: 50,
    budget: 50000000, 
    casesSolved: 0,
    politicalCapital: 10,
    tools: {
      aiScannerLevel: 0,
      politicalShieldLevel: 0,
      interrogationLevel: 0,
      documentForensicLevel: 0,
      bankForensicLevel: 1,
    }
  },
  casesHistory: [],
  currentCase: null,
  currentPhase: AuditPhase.CLOSED,
  taggedEvidenceIds: [],
  activeInterference: null
};
