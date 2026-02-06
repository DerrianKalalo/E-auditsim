
import { Case, Verdict } from './types.ts';

export const SCENARIOS: Case[] = [
  {
    id: 'case-001',
    fiscalYear: 2024,
    title: 'Discrepancy Kantin',
    description: 'Rekonsiliasi mingguan kantin sekolah menunjukkan ketidaksesuaian antara penjualan sistem POS dan kas yang disetorkan.',
    difficulty: 1,
    politicalPressure: 10,
    documents: [
      {
        id: 'doc-1',
        title: 'Laporan Penjualan POS - Minggu 4',
        type: 'report',
        content: `
          <h3>TERMINAL POS A - RINGKASAN MINGGUAN</h3>
          <p>Tanggal: 20-25 Okt</p>
          <hr/>
          <ul>
            <li>Penjualan Makanan: $1,250.00</li>
            <li>Penjualan Minuman: $450.00</li>
            <li>Snack: $300.00</li>
          </ul>
          <p><strong>TOTAL PENJUALAN SISTEM: $2,000.00</strong></p>
        `
      },
      {
        id: 'doc-2',
        title: 'Slip Setoran Bank',
        type: 'invoice',
        content: `
          <h3>SETORAN BANK UNKLAB</h3>
          <p>Tanggal: 25 Okt</p>
          <p>Penyetor: Ibu Sarah (Manajer Kantin)</p>
          <hr/>
          <p>Jumlah Tunai: $1,800.00</p>
          <p>Catatan: Kuitansi hilang untuk pembelian es darurat.</p>
        `
      }
    ],
    logs: [
      { id: 'log-1', timestamp: '2023-10-25 14:00', user: 'SYSTEM', action: 'Penutupan Harian', details: 'Total Diharapkan: $400.00' },
      { id: 'log-2', timestamp: '2023-10-25 14:15', user: 's_sarah', action: 'Manual Override', details: 'Jumlah Kas Dimasukkan: $200.00', flagged: true },
    ],
    bankRecords: [
      { 
        date: '2023-10-25', 
        description: 'SETORAN KAS KANTIN MINGGU 4', 
        type: 'CR', 
        amount: 1800, 
        balance: 1800, 
        isSuspicious: true 
      }
    ],
    npc: {
      name: 'Ibu Sarah',
      role: 'Manajer Kantin',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      personality: 'Keibuan, sedikit tidak teratur, pekerja keras. Gugup dengan teknologi.',
      knowledge: 'Saya mengambil $200 tunai untuk membeli es batu karena mesin es rusak saat makan siang. Kuitansinya hilang tapi saya janji uangnya untuk sekolah!',
      openingLine: "Aduh, apakah ini soal angka-angka itu? Saya tidak terlalu paham dengan mesin komputer itu.",
      defenseStrategy: "Akui perbuatannya namun klaim tidak ada niat jahat. Tekankan pada keadaan darurat operasional."
    },
    findings: ['Selisih Kas', 'Dokumen Pendukung Hilang'],
    correctOpinion: Verdict.WDP,
    explanation: 'Meskipun penggunaan kas tanpa otorisasi adalah pelanggaran, niatnya adalah operasional dan bukan pencurian. Opini WDP tepat untuk menekankan prosedur penanganan kuitansi yang benar.',
    linkedEvidenceIds: ['log-2', 'doc-2']
  }
];

export const EMAIL_MESSAGES = [
  {
    day: 1,
    sender: "Kepala Sekolah Skinner",
    subject: "Selamat Datang di SMA Unklab",
    body: "Selamat bergabung. Pembukuan kami agak... ceroboh akhir-akhir ini. Tugas Anda adalah menjaga semua orang tetap jujur. Mulailah dengan kantin, angkanya terlihat aneh."
  }
];
