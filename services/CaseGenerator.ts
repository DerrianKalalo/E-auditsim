
import { Case, Verdict, Document, PlayerStats, BankRecord, NPC } from '../types.ts';

interface ComponentPool {
  subTypes: string[];
  vendors: string[];
  findings: string[];
  docTypes: string[];
  npcRoles: string[];
  modus: string[];
}

export class CaseGenerator {
  private static ministries = [
    "Kementerian Pertahanan", "Kementerian Kominfo", "Kementerian Keuangan", 
    "Kementerian PUPR", "Kementerian Kesehatan", "Kementerian Sosial", 
    "Kementerian BUMN", "Otorita IKN", "Kementerian ESDM", "Kemenag"
  ];

  private static templates: Record<string, ComponentPool> = {
    "Kementerian Pertahanan": {
      subTypes: ["Jet Tempur Rafale-X", "Sistem Rudal Patriot", "Logistik Pangan TNI"],
      vendors: ["Global Arms Ltd", "PT. Industri Perang Nusantara", "EuroDefense Corp"],
      findings: ["Mark-up harga suku cadang 400%", "Komisi tersembunyi di Panama", "Barang rekondisi dicatat baru"],
      docTypes: ["End User Certificate", "Invoice Alutsista", "Laporan Bea Cukai"],
      npcRoles: ["Letjen Logistik", "Direktur Vendor Senjata", "Staf Ahli Menhan"],
      modus: ["rekening_luar_negeri", "markup_masif"]
    },
    "Otorita IKN": {
      subTypes: ["Paving Jalan Sumbu Kebangsaan", "Sistem Air Minum Pintar", "Gedung Kantor Deputi"],
      vendors: ["Konsorsium BUMN-A", "PT. Bangun IKN Jaya", "Archipelago Construction"],
      findings: ["Volume beton kurang 30%", "Suap izin lahan ring 1", "Pemenang lelang titipan pimpinan"],
      docTypes: ["Laporan Lab Beton", "Peta Plotting Lahan", "Buku Kas Vendor"],
      npcRoles: ["Kepala Deputi Teknis", "Ketua Pokja Lelang", "Manajer Proyek Lapangan"],
      modus: ["pengurangan_volume", "suap_lelang"]
    }
  };

  static generateCase(year: number, stats: PlayerStats): Case {
    const ministry = this.ministries[Math.floor(Math.random() * this.ministries.length)];
    const template = this.templates[ministry] || this.templates["Kementerian Pertahanan"];
    
    // SEMUA KASUS ADALAH FRAUD
    const isFraud = true; 
    const subType = template.subTypes[Math.floor(Math.random() * template.subTypes.length)];
    const vendor = template.vendors[Math.floor(Math.random() * template.vendors.length)];
    
    // Scaling budget dan fraud value (Miliar ke Triliun)
    const budgetValue = Math.floor(50000000000 * Math.pow(2.1, year - 1) * (0.9 + Math.random()));
    const fraudValue = Math.floor(budgetValue * (0.2 + Math.random() * 0.4)); // Korupsi 20-60%

    const npcName = this.generateName();
    const secretAccount = `ACC-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

    // Generate Evidence Chains (Sesuatu yang harus ditag pemain)
    const evidenceLogId = `LOG-EV-${Math.floor(Math.random()*999)}`;
    const evidenceDocId = `DOC-EV-${Math.floor(Math.random()*999)}`;

    return {
      id: `LHP-${2024+year}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      fiscalYear: year,
      title: `[TEMUAN] ${subType} - ${ministry}`,
      description: `Laporan intelijen menyebutkan adanya kebocoran anggaran masif pada ${subType}. Anda dikirim untuk mengunci bukti sebelum dimusnahkan.`,
      difficulty: Math.min(10, year + 3),
      politicalPressure: Math.min(100, (year * 15) + 30),
      documents: [
        {
          id: evidenceDocId,
          title: `Rincian Realisasi Anggaran: ${subType}`,
          type: 'report',
          content: `
            <table class="w-full">
              <tr><th>Uraian</th><th>Anggaran (Rp)</th><th>Realisasi (Rp)</th></tr>
              <tr><td>Material Utama</td><td>${(budgetValue * 0.4).toLocaleString()}</td><td>${(budgetValue * 0.4).toLocaleString()}</td></tr>
              <tr><td>Biaya Konsultan</td><td>${(budgetValue * 0.1).toLocaleString()}</td><td><span class="text-red-700 font-bold underline">${(budgetValue * 0.25).toLocaleString()}</span></td></tr>
            </table>
            <p>Catatan: Ada selisih signifikan pada biaya konsultan yang dialirkan ke vendor terafiliasi.</p>
          `
        },
        {
          id: 'D-SAFE',
          title: `Surat Pernyataan Tanggung Jawab`,
          type: 'contract',
          content: `Pihak ${vendor} menyatakan seluruh pekerjaan telah selesai 100% sesuai spesifikasi.`
        }
      ],
      logs: [
        { id: 'L1', timestamp: '2024-06-01 09:00', user: 'admin', action: 'LOGIN', details: 'Sesi dimulai' },
        { 
          id: evidenceLogId, 
          timestamp: '2024-06-01 23:45', 
          user: npcName.toLowerCase().replace(' ', '_'), 
          action: 'OVERRIDE', 
          details: `Manual adjustment pada invoice ID-9982. Mengalihkan dana ke ${secretAccount}`, 
          flagged: true 
        }
      ],
      bankRecords: [
        { date: '2024-06-10', description: `TERMIN 1: ${vendor}`, type: 'DB' as const, amount: budgetValue * 0.5, balance: budgetValue },
        { 
          date: '2024-06-11', 
          description: `KICKBACK TRANSFER TO: ${secretAccount}`, 
          type: 'CR' as const, 
          amount: fraudValue, 
          balance: fraudValue, 
          isSuspicious: true 
        }
      ],
      npc: {
        name: npcName,
        role: template.npcRoles[Math.floor(Math.random() * template.npcRoles.length)],
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${npcName}`,
        personality: "Sangat defensif. Menolak memberikan akses ke sistem database pusat.",
        knowledge: `Uang hasil korupsi sebesar Rp ${fraudValue.toLocaleString()} dikirim ke rekening ${secretAccount}.`,
        defenseStrategy: "Mengancam akan menelepon pimpinan BPK jika audit dilanjutkan.",
        openingLine: "Kenapa Anda mempermasalahkan hal kecil seperti ini? Kita punya target nasional yang lebih besar."
      },
      findings: template.findings,
      correctOpinion: Verdict.TW, // Selalu Tidak Wajar karena semua kasus fraud
      explanation: `Korupsi terdeteksi pada proyek ${subType} dengan kerugian negara Rp ${fraudValue.toLocaleString()}. Modus: Transfer ke rekening bayangan ${secretAccount}.`,
      linkedEvidenceIds: [evidenceLogId, evidenceDocId]
    };
  }

  private static generateName() {
    const first = ["Bambang", "Luhut", "Agus", "Sandiaga", "Puan", "Gibran", "Anies", "Basuki"];
    const last = ["Prasetyo", "Pandjaitan", "Harimurti", "Uno", "Maharani", "Rakabuming", "Baswedan", "Hadimuljono"];
    return `${first[Math.floor(Math.random()*first.length)]} ${last[Math.floor(Math.random()*last.length)]}`;
  }

  static getTutorialCase() {
    return this.generateCase(1, { integrity: 100, professionalism: 50, budget: 50000000, casesSolved: 0, politicalCapital: 10, tools: { aiScannerLevel: 0, politicalShieldLevel: 0, interrogationLevel: 0, documentForensicLevel: 0, bankForensicLevel: 1 }});
  }
}
