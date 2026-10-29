/**
 * SAFEWORK HSE - Construction Safety Management System
 * Main JavaScript Application File: app.js
 * Fitur: Pengaturan Lokasi & Identitas Proyek + Manajemen Multi-Proyek Terisolasi
 * Mata Kuliah: Aplikasi Komputer Teknik Sipil (Semester 5)
 */

(function () {
  'use strict';

  // --- STORAGE KEYS ---
  const STORAGE_KEYS = {
    PROJECTS: 'SAFEWORK_PROJECTS_V2',
    ACTIVE_PROJECT_ID: 'SAFEWORK_ACTIVE_PROJECT_ID_V2',
    INSPECTIONS: 'SAFEWORK_INSPECTIONS_V1',
    RISKS: 'SAFEWORK_RISKS_V1',
    FINDINGS: 'SAFEWORK_FINDINGS_V1',
    LEGACY_SETTINGS: 'SAFEWORK_SETTINGS_V1'
  };

  // --- STANDARD CHECKLIST ITEMS (CIVIL ENGINEERING CONSTRUCTION) ---
  const STANDARD_CHECKLIST_TEMPLATE = [
    {
      id: 'chk_apd',
      name: 'Kepatuhan Penggunaan APD Wajib',
      desc: 'Helm keselamatan, rompi reflektif, safety shoes, kacamata/sarung tangan sesuai zona.',
      status: 'Aman',
      note: ''
    },
    {
      id: 'chk_housekeeping',
      name: 'Kerapian Area Kerja & Housekeeping',
      desc: 'Bebas ceceran material tajam/paku, jalur pedestrian steril, pembuangan limbah teratur.',
      status: 'Aman',
      note: ''
    },
    {
      id: 'chk_perancah',
      name: 'Kondisi Perancah & Akses Kerja',
      desc: 'Pipa scaffolding kokoh, base plate/jack base terpasang, platform rapat, ada handrail & toe board.',
      status: 'Aman',
      note: ''
    },
    {
      id: 'chk_listrik',
      name: 'Keselamatan Instalasi Listrik',
      desc: 'Kabel terpasang menggantung/bebas genangan air, panel distribusi berpenutup rapat, proteksi ELCB.',
      status: 'Aman',
      note: ''
    },
    {
      id: 'chk_alat_mesin',
      name: 'Kelaikan Alat Berat & Mesin Kerja',
      desc: 'Surat Izin Layak Operasi (SILO) aktif, inspeksi harian checklist operator, APAR tersedia.',
      status: 'Aman',
      note: ''
    },
    {
      id: 'chk_proteksi_jatuh',
      name: 'Proteksi Bahaya Jatuh & Bukaan Void',
      desc: 'Barikade pipa kokoh di void tangga/lift, penutup lubang lantai bertanda peringatan, lifeline terpasang.',
      status: 'Aman',
      note: ''
    },
    {
      id: 'chk_rambu_p3k',
      name: 'Rambu K3, Jalur Evakuasi & Kotak P3K',
      desc: 'Rambu peringatan bahaya terbaca jelas, jalur evakuasi bebas rintangan, kotak P3K terisi lengkap.',
      status: 'Aman',
      note: ''
    }
  ];

  // --- DEFAULT REALISTIC PROJECTS ---
  const DEFAULT_PROJECTS = [
    {
      id: 'proj_mandiri',
      projectName: 'Proyek Pembangunan Gedung Mandiri Tower (10 Lantai)',
      projectType: 'Gedung',
      address: 'Jl. Ring Road Utara No. 45, Condongcatur',
      city: 'Kabupaten Sleman',
      province: 'D.I. Yogyakarta',
      contractor: 'PT Graha Konstruksi Pratama',
      projectManager: 'Ir. Hendra Pratama, S.T., M.T.',
      hseOfficer: 'Zahra Faizatun Najma',
      hseNim: '2410503008 (TS01)',
      safeHours: 428500,
      targetHours: 500000
    },
    {
      id: 'proj_jembatan',
      projectName: 'Proyek Pembangunan Jembatan & Flyover Akses Bandara YIA',
      projectType: 'Jembatan',
      address: 'Jl. Daendels Pantai Selatan KM 12, Temon',
      city: 'Kabupaten Kulon Progo',
      province: 'D.I. Yogyakarta',
      contractor: 'PT Wijaya Karya (Persero) Tbk',
      projectManager: 'Dr. Ir. Bagus Wicaksono, M.T.',
      hseOfficer: 'Zahra Faizatun Najma',
      hseNim: '2410503008 (TS01)',
      safeHours: 215400,
      targetHours: 400000
    }
  ];

  // --- DEFAULT DEMO INSPECTIONS (GEDUNG & JEMBATAN) ---
  const DEFAULT_INSPECTIONS = [
    // Proyek 1: Gedung Mandiri
    {
      id: 'ins_1',
      projectId: 'proj_mandiri',
      projectName: 'Proyek Pembangunan Gedung Mandiri Tower (10 Lantai)',
      projectLocation: 'Kabupaten Sleman, D.I. Yogyakarta',
      no: 'INS-2026-001',
      tanggal: '2026-10-15',
      area: 'Lantai 4 Zona Pengecoran Pelat & Balok',
      kategori: 'Perancah dan akses kerja',
      petugas: 'Zahra Faizatun Najma',
      status: 'Selesai',
      catatan: 'Perancah pipa telah dipasang bracing silang dan safety net perimeter terpasang penuh. Kondisi aman untuk pengecoran.',
      checklist: [
        { id: 'chk_apd', name: 'Kepatuhan Penggunaan APD Wajib', status: 'Aman', note: 'Semua pekerja memakai APD lengkap' },
        { id: 'chk_housekeeping', name: 'Kerapian Area Kerja & Housekeeping', status: 'Aman', note: 'Area bersih dari sisa kawat' },
        { id: 'chk_perancah', name: 'Kondisi Perancah & Akses Kerja', status: 'Aman', note: 'Telah diinspeksi scaffolder bersertifikat' },
        { id: 'chk_listrik', name: 'Keselamatan Instalasi Listrik', status: 'Aman', note: 'Vibrator kabel terangkat' },
        { id: 'chk_alat_mesin', name: 'Kelaikan Alat Berat & Mesin Kerja', status: 'Aman', note: 'Bucket cor dalam kondisi baik' },
        { id: 'chk_proteksi_jatuh', name: 'Proteksi Bahaya Jatuh & Bukaan Void', status: 'Aman', note: 'Handrail perimeter 1.1 meter' },
        { id: 'chk_rambu_p3k', name: 'Rambu K3, Jalur Evakuasi & Kotak P3K', status: 'Aman', note: 'Rambu bahaya jatuh terpasang' }
      ]
    },
    {
      id: 'ins_2',
      projectId: 'proj_mandiri',
      projectName: 'Proyek Pembangunan Gedung Mandiri Tower (10 Lantai)',
      projectLocation: 'Kabupaten Sleman, D.I. Yogyakarta',
      no: 'INS-2026-002',
      tanggal: '2026-10-18',
      area: 'Workshop Fabrikasi Baja & Area Pembesian',
      kategori: 'Instalasi listrik',
      petugas: 'Zahra Faizatun Najma',
      status: 'Perlu Tindak Lanjut',
      catatan: 'Ditemukan kabel sambungan sementara mesin bar bender melintang tanpa pipa pelindung conduit dan terendam air sisa hujan.',
      checklist: [
        { id: 'chk_apd', name: 'Kepatuhan Penggunaan APD Wajib', status: 'Aman', note: 'Sarung tangan kulit terpakai' },
        { id: 'chk_housekeeping', name: 'Kerapian Area Kerja & Housekeeping', status: 'Tidak Aman', note: 'Potongan besi berserakan di jalan' },
        { id: 'chk_perancah', name: 'Kondisi Perancah & Akses Kerja', status: 'N/A', note: 'Pekerjaan di lantai dasar' },
        { id: 'chk_listrik', name: 'Keselamatan Instalasi Listrik', status: 'Tidak Aman', note: 'Kabel terkelupas menyentuh air hujan' },
        { id: 'chk_alat_mesin', name: 'Kelaikan Alat Berat & Mesin Kerja', status: 'Aman', note: 'Mesin bar bender normal' },
        { id: 'chk_proteksi_jatuh', name: 'Proteksi Bahaya Jatuh & Bukaan Void', status: 'N/A', note: 'Zona datar' },
        { id: 'chk_rambu_p3k', name: 'Rambu K3, Jalur Evakuasi & Kotak P3K', status: 'Aman', note: 'APAR CO2 tersedia' }
      ]
    },
    {
      id: 'ins_3',
      projectId: 'proj_mandiri',
      projectName: 'Proyek Pembangunan Gedung Mandiri Tower (10 Lantai)',
      projectLocation: 'Kabupaten Sleman, D.I. Yogyakarta',
      no: 'INS-2026-003',
      tanggal: '2026-10-22',
      area: 'Basement 2 & Area Galian Pondasi Retaining Wall',
      kategori: 'Pengendalian area kerja',
      petugas: 'Hendra Pratama, S.T.',
      status: 'Selesai',
      catatan: 'Pompa dewatering berfungsi normal, tebing galian telah diperkuat shoring kayu dan terpasang tali barikade peringatan.',
      checklist: [
        { id: 'chk_apd', name: 'Kepatuhan Penggunaan APD Wajib', status: 'Aman', note: 'Sepatu boots karet & helm dipakai' },
        { id: 'chk_housekeeping', name: 'Kerapian Area Kerja & Housekeeping', status: 'Aman', note: 'Genangan disedot pompa' },
        { id: 'chk_perancah', name: 'Kondisi Perancah & Akses Kerja', status: 'Aman', note: 'Tangga akses galian kokoh' },
        { id: 'chk_listrik', name: 'Keselamatan Instalasi Listrik', status: 'Aman', note: 'Kabel pompa submersible aman' },
        { id: 'chk_alat_mesin', name: 'Kelaikan Alat Berat & Mesin Kerja', status: 'Aman', note: 'Excavator PC200 SILO aktif' },
        { id: 'chk_proteksi_jatuh', name: 'Proteksi Bahaya Jatuh & Bukaan Void', status: 'Aman', note: 'Tepi galian dipasang barikade' },
        { id: 'chk_rambu_p3k', name: 'Rambu K3, Jalur Evakuasi & Kotak P3K', status: 'Aman', note: 'Rambu batas aman excavator' }
      ]
    },
    {
      id: 'ins_4',
      projectId: 'proj_mandiri',
      projectName: 'Proyek Pembangunan Gedung Mandiri Tower (10 Lantai)',
      projectLocation: 'Kabupaten Sleman, D.I. Yogyakarta',
      no: 'INS-2026-004',
      tanggal: '2026-10-25',
      area: 'Perimeter Tower Crane TC-01 & Area Bongkar Muat',
      kategori: 'Alat dan mesin',
      petugas: 'Zahra Faizatun Najma',
      status: 'Selesai',
      catatan: 'Sertifikat kelaikan TC-01 masih berlaku. Rigger dan operator memiliki SIO resmi, jalur radius putar telah disterilkan.',
      checklist: [
        { id: 'chk_apd', name: 'Kepatuhan Penggunaan APD Wajib', status: 'Aman', note: 'Rigger memakai rompi high-vis' },
        { id: 'chk_housekeeping', name: 'Kerapian Area Kerja & Housekeeping', status: 'Aman', note: 'Zona drop material rapi' },
        { id: 'chk_perancah', name: 'Kondisi Perancah & Akses Kerja', status: 'N/A', note: 'Tidak menggunakan scaffolding' },
        { id: 'chk_listrik', name: 'Keselamatan Instalasi Listrik', status: 'Aman', note: 'Grounding TC terukur < 2 Ohm' },
        { id: 'chk_alat_mesin', name: 'Kelaikan Alat Berat & Mesin Kerja', status: 'Aman', note: 'Kawat seling TC dilumasi & tanpa putus' },
        { id: 'chk_proteksi_jatuh', name: 'Proteksi Bahaya Jatuh & Bukaan Void', status: 'Aman', note: 'Kandang tangga mast section ada rest platform' },
        { id: 'chk_rambu_p3k', name: 'Rambu K3, Jalur Evakuasi & Kotak P3K', status: 'Aman', note: 'Rambu radius ayunan crane ada' }
      ]
    },
    {
      id: 'ins_5',
      projectId: 'proj_mandiri',
      projectName: 'Proyek Pembangunan Gedung Mandiri Tower (10 Lantai)',
      projectLocation: 'Kabupaten Sleman, D.I. Yogyakarta',
      no: 'INS-2026-005',
      tanggal: '2026-10-27',
      area: 'Lantai 7 Zona Bukaan Void Tangga Darurat & Lift Core',
      kategori: 'Rambu dan pengamanan lokasi',
      petugas: 'Budi Santoso (Safety Officer)',
      status: 'Perlu Tindak Lanjut',
      catatan: 'Bukaan void shaft elevator lantai 7 belum dipasang penutup papan tebal dan barikade hard-railing pengaman perimeter.',
      checklist: [
        { id: 'chk_apd', name: 'Kepatuhan Penggunaan APD Wajib', status: 'Aman', note: 'APD standar lengkap' },
        { id: 'chk_housekeeping', name: 'Kerapian Area Kerja & Housekeeping', status: 'Aman', note: 'Lantai bersih dari kerikil' },
        { id: 'chk_perancah', name: 'Kondisi Perancah & Akses Kerja', status: 'Aman', note: 'Tangga darurat permanen bisa dilewati' },
        { id: 'chk_listrik', name: 'Keselamatan Instalasi Listrik', status: 'Aman', note: 'Penerangan koridor cukup' },
        { id: 'chk_alat_mesin', name: 'Kelaikan Alat Berat & Mesin Kerja', status: 'N/A', note: 'Tidak ada mesin aktif di zona ini' },
        { id: 'chk_proteksi_jatuh', name: 'Proteksi Bahaya Jatuh & Bukaan Void', status: 'Tidak Aman', note: 'Void lift terbuka tanpa pembatas!' },
        { id: 'chk_rambu_p3k', name: 'Rambu K3, Jalur Evakuasi & Kotak P3K', status: 'Tidak Aman', note: 'Belum ada rambu bahaya jatuh' }
      ]
    },
    {
      id: 'ins_6',
      projectId: 'proj_mandiri',
      projectName: 'Proyek Pembangunan Gedung Mandiri Tower (10 Lantai)',
      projectLocation: 'Kabupaten Sleman, D.I. Yogyakarta',
      no: 'INS-2026-006',
      tanggal: '2026-10-28',
      area: 'Selasar Pekerjaan Pasangan Dinding Bata Lantai 3',
      kategori: 'Housekeeping',
      petugas: 'Zahra Faizatun Najma',
      status: 'Selesai',
      catatan: 'Puing bekas spesi semen pasir telah dibersihkan ke gerobak dorong dan ditampung di bak sampah sementara.',
      checklist: [
        { id: 'chk_apd', name: 'Kepatuhan Penggunaan APD Wajib', status: 'Aman', note: 'Tukang memakai sarung tangan karet' },
        { id: 'chk_housekeeping', name: 'Kerapian Area Kerja & Housekeeping', status: 'Aman', note: 'Puing disortir dengan tertib' },
        { id: 'chk_perancah', name: 'Kondisi Perancah & Akses Kerja', status: 'Aman', note: 'Perancah rendah stabil' },
        { id: 'chk_listrik', name: 'Keselamatan Instalasi Listrik', status: 'Aman', note: 'Kabel molen teratur di pinggir' },
        { id: 'chk_alat_mesin', name: 'Kelaikan Alat Berat & Mesin Kerja', status: 'Aman', note: 'Molen beton dilindungi cover puli' },
        { id: 'chk_proteksi_jatuh', name: 'Proteksi Bahaya Jatuh & Bukaan Void', status: 'Aman', note: 'Jendela luar berpagar sementara' },
        { id: 'chk_rambu_p3k', name: 'Rambu K3, Jalur Evakuasi & Kotak P3K', status: 'Aman', note: 'Kotak P3K lantai 3 tersedia' }
      ]
    },
    // Proyek 2: Jembatan & Flyover Bandara YIA
    {
      id: 'ins_j1',
      projectId: 'proj_jembatan',
      projectName: 'Proyek Pembangunan Jembatan & Flyover Akses Bandara YIA',
      projectLocation: 'Kabupaten Kulon Progo, D.I. Yogyakarta',
      no: 'INS-2026-101',
      tanggal: '2026-10-20',
      area: 'Pier 3 & Abutment Barat Jembatan Kali Bogowonto',
      kategori: 'Perancah dan akses kerja',
      petugas: 'Zahra Faizatun Najma',
      status: 'Selesai',
      catatan: 'Perancah shoring heavy-duty penahan bekisting pier head telah diuji kekuatannya oleh konsultan MK.',
      checklist: [
        { id: 'chk_apd', name: 'Kepatuhan Penggunaan APD Wajib', status: 'Aman', note: 'Life jacket dan harness terpakai' },
        { id: 'chk_housekeeping', name: 'Kerapian Area Kerja & Housekeeping', status: 'Aman', note: 'Bantaran sungai bersih dari limbah beton' },
        { id: 'chk_perancah', name: 'Kondisi Perancah & Akses Kerja', status: 'Aman', note: 'Shoring pipa tebal terpasang kokoh' },
        { id: 'chk_listrik', name: 'Keselamatan Instalasi Listrik', status: 'Aman', note: 'Genset kedap air berjarak 15 meter' },
        { id: 'chk_alat_mesin', name: 'Kelaikan Alat Berat & Mesin Kerja', status: 'Aman', note: 'Service crane beroperasi normal' },
        { id: 'chk_proteksi_jatuh', name: 'Proteksi Bahaya Jatuh & Bukaan Void', status: 'Aman', note: 'Safety net terpasang di atas aliran air' },
        { id: 'chk_rambu_p3k', name: 'Rambu K3, Jalur Evakuasi & Kotak P3K', status: 'Aman', note: 'Pelampung darurat siap di pos pinggir sungai' }
      ]
    },
    {
      id: 'ins_j2',
      projectId: 'proj_jembatan',
      projectName: 'Proyek Pembangunan Jembatan & Flyover Akses Bandara YIA',
      projectLocation: 'Kabupaten Kulon Progo, D.I. Yogyakarta',
      no: 'INS-2026-102',
      tanggal: '2026-10-24',
      area: 'Zona Erection Balok PCI Girder Span 40m',
      kategori: 'Alat dan mesin',
      petugas: 'Budi Santoso, S.T.',
      status: 'Selesai',
      catatan: 'Dua unit Mobile Crane kapasitas 150 Ton telah lulus uji beban dan plat landasan baja terpasang di bawah outrigger.',
      checklist: [
        { id: 'chk_apd', name: 'Kepatuhan Penggunaan APD Wajib', status: 'Aman', note: 'Helm bersubchin strap kencang' },
        { id: 'chk_housekeeping', name: 'Kerapian Area Kerja & Housekeeping', status: 'Aman', note: 'Area radius ayunan steril dari orang asing' },
        { id: 'chk_perancah', name: 'Kondisi Perancah & Akses Kerja', status: 'N/A', note: 'Pekerjaan di lantai tanah padat' },
        { id: 'chk_listrik', name: 'Keselamatan Instalasi Listrik', status: 'Aman', note: 'Tidak ada kabel udara melintang' },
        { id: 'chk_alat_mesin', name: 'Kelaikan Alat Berat & Mesin Kerja', status: 'Aman', note: 'SILO crane dan sertifikat rigger aktif' },
        { id: 'chk_proteksi_jatuh', name: 'Proteksi Bahaya Jatuh & Bukaan Void', status: 'Aman', note: 'Tangga akses scaffolder berpagar' },
        { id: 'chk_rambu_p3k', name: 'Rambu K3, Jalur Evakuasi & Kotak P3K', status: 'Aman', note: 'Tanda batas radius bahaya dipasang pita kuning' }
      ]
    },
    {
      id: 'ins_j3',
      projectId: 'proj_jembatan',
      projectName: 'Proyek Pembangunan Jembatan & Flyover Akses Bandara YIA',
      projectLocation: 'Kabupaten Kulon Progo, D.I. Yogyakarta',
      no: 'INS-2026-103',
      tanggal: '2026-10-28',
      area: 'Jalan Akses Kerja Dump Truck Tanah Timbunan Oprit Timur',
      kategori: 'Pengendalian area kerja',
      petugas: 'Zahra Faizatun Najma',
      status: 'Perlu Tindak Lanjut',
      catatan: 'Persimpangan perlintasan dump truck ke jalan nasional belum dilengkapi lampu peringatan dan petugas pengatur lalu lintas.',
      checklist: [
        { id: 'chk_apd', name: 'Kepatuhan Penggunaan APD Wajib', status: 'Aman', note: 'Sopir memakai rompi dan sepatu' },
        { id: 'chk_housekeeping', name: 'Kerapian Area Kerja & Housekeeping', status: 'Aman', note: 'Ceceran tanah disemprot mobil tangki' },
        { id: 'chk_perancah', name: 'Kondisi Perancah & Akses Kerja', status: 'N/A', note: 'Pekerjaan tanah' },
        { id: 'chk_listrik', name: 'Keselamatan Instalasi Listrik', status: 'Aman', note: 'Penerangan pos jaga aman' },
        { id: 'chk_alat_mesin', name: 'Kelaikan Alat Berat & Mesin Kerja', status: 'Aman', note: 'Dump truck rem berfungsi normal' },
        { id: 'chk_proteksi_jatuh', name: 'Proteksi Bahaya Jatuh & Bukaan Void', status: 'N/A', note: 'Area datar' },
        { id: 'chk_rambu_p3k', name: 'Rambu K3, Jalur Evakuasi & Kotak P3K', status: 'Tidak Aman', note: 'Belum ada flagman dan lampu peringatan putar' }
      ]
    }
  ];

  // --- DEFAULT DEMO RISKS (HIRADC 5x5) ---
  const DEFAULT_RISKS = [
    // Proyek 1: Gedung Mandiri
    {
      id: 'ra_1',
      projectId: 'proj_mandiri',
      projectName: 'Proyek Pembangunan Gedung Mandiri Tower (10 Lantai)',
      projectLocation: 'Kabupaten Sleman, D.I. Yogyakarta',
      no: 'RA-2026-001',
      aktivitas: 'Pekerjaan Pengecoran Pelat Lantai Ketinggian 16 Meter',
      bahaya: 'Kegagalan sistem bekisting/shoring akibat kelebihan beban beton basah',
      dampak: 'Bekisting ambruk, pekerja tertimpa adukan beton, fatalitas dan kerusakan struktural',
      pengendalianAda: 'Pengecekan visual support shoring pipa oleh pengawas lapangan',
      likelihood: 3,
      severity: 5,
      score: 15,
      level: 'Tinggi',
      rekomendasi: 'Rekayasa Teknik: Perhitungan beban shoring bekisting oleh Structural Engineer, pasang double bracing diagonal, dan terapkan inspeksi pre-pour check sheet wajib tanda tangan HSE.',
      pic: 'Site Engineer & Tim HSE',
      target: '2026-11-05'
    },
    {
      id: 'ra_2',
      projectId: 'proj_mandiri',
      projectName: 'Proyek Pembangunan Gedung Mandiri Tower (10 Lantai)',
      projectLocation: 'Kabupaten Sleman, D.I. Yogyakarta',
      no: 'RA-2026-002',
      aktivitas: 'Perakitan dan Pembongkaran Scaffolding Modular Luar Gedung',
      bahaya: 'Pekerja terjatuh dari ketinggian lebih dari 10 meter saat menyambung pipa',
      dampak: 'Fraktur tulang belakang, cedera kepala berat, fatalitas kematian',
      pengendalianAda: 'Penggunaan safety belt biasa',
      likelihood: 4,
      severity: 4,
      score: 16,
      level: 'Tinggi',
      rekomendasi: 'Wajib 100% tie-off dengan full body harness double lanyard shock absorber terhubung lifeline independen, sertifikasi scaffolder Kemenaker, dan safety net penahan jatuh.',
      pic: 'Scaffolding Supervisor & HSE Lead',
      target: '2026-11-02'
    },
    {
      id: 'ra_3',
      projectId: 'proj_mandiri',
      projectName: 'Proyek Pembangunan Gedung Mandiri Tower (10 Lantai)',
      projectLocation: 'Kabupaten Sleman, D.I. Yogyakarta',
      no: 'RA-2026-003',
      aktivitas: 'Pengangkatan Material Baja WF Menggunakan Tower Crane saat Cuaca Angin',
      bahaya: 'Beban berayun tak terkendali (uncontrolled swing), sling putus, muatan jatuh',
      dampak: 'Menimpa pekerja di lantai bawah, merusak fasilitas umum sekitar proyek',
      pengendalianAda: 'Rigger memberi aba-aba peluit kepada operator crane',
      likelihood: 3,
      severity: 5,
      score: 15,
      level: 'Tinggi',
      rekomendasi: 'Administrasi: Pasang anemometer digital pengukur kecepatan angin di puncak TC, batalkan lifting jika angin > 20 knot, pasang tag line tali kendali ganda, dan sterilkan radius putar.',
      pic: 'Crane Operator & HSE Lead',
      target: '2026-10-31'
    },
    {
      id: 'ra_4',
      projectId: 'proj_mandiri',
      projectName: 'Proyek Pembangunan Gedung Mandiri Tower (10 Lantai)',
      projectLocation: 'Kabupaten Sleman, D.I. Yogyakarta',
      no: 'RA-2026-004',
      aktivitas: 'Pekerjaan Pengelasan Sambungan Kolom Baja di Ketinggian',
      bahaya: 'Percikan bunga api las (spatter) jatuh membakar terpal pelindung & material kayu',
      dampak: 'Kebakaran di area konstruksi, kerusakan struktur, luka bakar pekerja',
      pengendalianAda: 'Tersedia 1 tabung APAR di pos keamanan berjarak 50 meter',
      likelihood: 3,
      severity: 3,
      score: 9,
      level: 'Sedang',
      rekomendasi: 'Pasang fire blanket tahan api di bawah titik las, sediakan APAR CO2 6kg langsung di platform kerja, tunjuk safety watch man selama pengelasan dan 30 menit sesudahnya.',
      pic: 'Subkon Mekanikal / Safety Man',
      target: '2026-11-08'
    },
    {
      id: 'ra_5',
      projectId: 'proj_mandiri',
      projectName: 'Proyek Pembangunan Gedung Mandiri Tower (10 Lantai)',
      projectLocation: 'Kabupaten Sleman, D.I. Yogyakarta',
      no: 'RA-2026-005',
      aktivitas: 'Galian Tanah Basemen Sedalam 4.5 Meter Dekat Saluran Kota',
      bahaya: 'Dinding tanah galian longsor mendadak (cave-in) akibat getaran alat berat & rembesan air',
      dampak: 'Pekerja tertimbun longsoran tanah, robohnya dinding pagar sekitar proyek',
      pengendalianAda: 'Pembuatan kemiringan tanah (sloping) sederhana tanpa perkuatan',
      likelihood: 4,
      severity: 5,
      score: 20,
      level: 'Ekstrem',
      rekomendasi: 'Rekayasa Teknik: Pemasangan sheet pile baja dan struts bracing penahan tanah, dewatering berkala, monitoring inclinometer pergeseran tanah setiap hari sebelum jam kerja dimulai.',
      pic: 'Geotechnical Engineer & Site Safety',
      target: '2026-10-30'
    },
    {
      id: 'ra_6',
      projectId: 'proj_mandiri',
      projectName: 'Proyek Pembangunan Gedung Mandiri Tower (10 Lantai)',
      projectLocation: 'Kabupaten Sleman, D.I. Yogyakarta',
      no: 'RA-2026-006',
      aktivitas: 'Pekerjaan Pemasangan Keramik dan Pemotongan Granit dengan Gerinda',
      bahaya: 'Paparan debu silika respirabel dan pecahan piringan mata gerinda terlempar',
      dampak: 'Gangguan pernapasan kronis (silikosis), luka sobek pada mata/wajah pekerja',
      pengendalianAda: 'Pekerja memakai masker kain tipis',
      likelihood: 2,
      severity: 2,
      score: 4,
      level: 'Rendah',
      rekomendasi: 'Wajib masker respirator partikulat N95/FFP2, pelindung wajah (face shield), pastikan cover pelindung gerinda terpasang kencang dan terapkan metode pemotongan basah (wet cutting).',
      pic: 'Pelaksana Finishing & Logistik',
      target: '2026-11-12'
    },
    // Proyek 2: Jembatan & Flyover Bandara YIA
    {
      id: 'ra_j1',
      projectId: 'proj_jembatan',
      projectName: 'Proyek Pembangunan Jembatan & Flyover Akses Bandara YIA',
      projectLocation: 'Kabupaten Kulon Progo, D.I. Yogyakarta',
      no: 'RA-2026-101',
      aktivitas: 'Erection Balok PCI Girder Panjang 40.8 Meter dengan Dual Mobile Crane',
      bahaya: 'Crane tipping (terguling) atau sling baja putus saat manuver swing balok beton',
      dampak: 'Balok girder runtuh menimpa pekerja, fatalitas jamak, kerusakan crane senilai milyaran',
      pengendalianAda: 'Pengecekan visual sling kawat baja oleh mandor',
      likelihood: 3,
      severity: 5,
      score: 15,
      level: 'Tinggi',
      rekomendasi: 'Wajib steel matting di bawah outrigger crane, perhitungan daya dukung tanah CBR > 10%, persetujuan tertulis lifting plan oleh Lifting Engineer dan HSE Manager.',
      pic: 'Lifting Supervisor & Tim K3 Jembatan',
      target: '2026-11-04'
    },
    {
      id: 'ra_j2',
      projectId: 'proj_jembatan',
      projectName: 'Proyek Pembangunan Jembatan & Flyover Akses Bandara YIA',
      projectLocation: 'Kabupaten Kulon Progo, D.I. Yogyakarta',
      no: 'RA-2026-102',
      aktivitas: 'Pengecoran Pier Head Jembatan di Ketinggian 14 Meter di Atas Sungai',
      bahaya: 'Pekerja terjatuh dari platform bekisting ke aliran air sungai berarus deras',
      dampak: 'Tenggelam, cedera kepala parah akibat benturan batu kali, fatalitas',
      pengendalianAda: 'Pemasangan tali tambang sederhana di sekeliling bekisting',
      likelihood: 3,
      severity: 5,
      score: 15,
      level: 'Tinggi',
      rekomendasi: 'Pasang jaring penahan jatuh (safety net catch-fan) di bawah platform, wajib full body harness ganda terkait ke horizontal lifeline wire rope 10mm, dan sediakan perahu rescue.',
      pic: 'Pelaksana Struktur Jembatan & Safety Officer',
      target: '2026-11-06'
    },
    {
      id: 'ra_j3',
      projectId: 'proj_jembatan',
      projectName: 'Proyek Pembangunan Jembatan & Flyover Akses Bandara YIA',
      projectLocation: 'Kabupaten Kulon Progo, D.I. Yogyakarta',
      no: 'RA-2026-103',
      aktivitas: 'Pemadatan Tanah Timbunan Oprit dengan Vibro Roller 12 Ton Dekat Tebing',
      bahaya: 'Alat pemadat tergelincir atau terguling ke lereng galian sedalam 5 meter',
      dampak: 'Operator terjepit di dalam kabin alat berat, kerusakan fatal alat pemadat',
      pengendalianAda: 'Operator berpengalaman mengemudikan alat',
      likelihood: 2,
      severity: 4,
      score: 8,
      level: 'Sedang',
      rekomendasi: 'Buat tanggul tanah pengaman (windrow) setinggi minimal 1/2 diameter roda di tepi lereng, operator wajib menggunakan sabuk pengaman (seat belt) ROPS.',
      pic: 'Supervisor Tanah & Operator Vibro',
      target: '2026-11-10'
    }
  ];

  // --- DEFAULT DEMO FINDINGS (GEDUNG & JEMBATAN) ---
  const DEFAULT_FINDINGS = [
    // Proyek 1: Gedung Mandiri
    {
      id: 'fnd_1',
      projectId: 'proj_mandiri',
      projectName: 'Proyek Pembangunan Gedung Mandiri Tower (10 Lantai)',
      projectLocation: 'Kabupaten Sleman, D.I. Yogyakarta',
      no: 'FND-2026-001',
      tanggal: '2026-10-18',
      area: 'Workshop Fabrikasi Baja & Pembesian',
      kategori: 'Instalasi listrik',
      jenis: 'Kondisi Tidak Aman (Unsafe Condition)',
      deskripsi: 'Kabel daya sambungan mesin bar bender berisolasi terkelupas melintasi lantai berlumpur basah tanpa pipa pelindung conduit dan tanpa steker standar industri.',
      risiko: 'Tinggi',
      tindakan: 'Matikan arus dari panel utama, ganti kabel dengan jenis serabut heavy duty berinsulasi ganda (NYMHY), pasang steker industri 3-pin, gantung kabel menggunakan tiang S hook setinggi minimal 2 meter.',
      pic: 'Teknisi Listrik Proyek & Mandor Besi',
      target: '2026-10-19',
      status: 'Closed',
      catatanSelesai: 'Kabel telah diganti baru berisolasi ganda dan digantung pada tiang penyangga isolator setinggi 2.2 meter pada tanggal 19 Oktober 2026.',
      refInspeksi: 'INS-2026-002'
    },
    {
      id: 'fnd_2',
      projectId: 'proj_mandiri',
      projectName: 'Proyek Pembangunan Gedung Mandiri Tower (10 Lantai)',
      projectLocation: 'Kabupaten Sleman, D.I. Yogyakarta',
      no: 'FND-2026-002',
      tanggal: '2026-10-20',
      area: 'Lantai 5 Zona Bekisting Tepi Luar',
      kategori: 'Penggunaan APD',
      jenis: 'Tindakan Tidak Aman (Unsafe Act)',
      deskripsi: 'Ditemukan 3 orang pekerja tukang kayu bekisting melepas helm pelindung kepala dan tidak mengaitkan safety harness saat bekerja di tepi perimeter lantai setinggi 18 meter.',
      risiko: 'Ekstrem',
      tindakan: 'Hentikan pekerjaan seketika (Stop Work Order sementara), berikan safety briefing khusus di pos HSE, pasang horizontal lifeline wire rope baja 10mm, wajibkan penggunaan full body harness double hook 100% tied-off.',
      pic: 'Mandor Struktur & Zahra Faizatun Najma',
      target: '2026-10-20',
      status: 'Closed',
      catatanSelesai: 'Pekerja diberikan pembinaan di kantor HSE, wire lifeline perimeter telah dipasang, seluruh tukang kembali bekerja dengan full body harness double hook.',
      refInspeksi: 'INS-2026-001'
    },
    {
      id: 'fnd_3',
      projectId: 'proj_mandiri',
      projectName: 'Proyek Pembangunan Gedung Mandiri Tower (10 Lantai)',
      projectLocation: 'Kabupaten Sleman, D.I. Yogyakarta',
      no: 'FND-2026-003',
      tanggal: '2026-10-24',
      area: 'Tangga Darurat Akses Lantai 2 ke Lantai 3',
      kategori: 'Housekeeping',
      jenis: 'Kondisi Tidak Aman (Unsafe Condition)',
      deskripsi: 'Penumpukan sisa potongan kayu balok bekisting berpaku berkarat mencuat dan potongan kawat bendrat di bordes tangga darurat yang menghalangi jalur evakuasi.',
      risiko: 'Sedang',
      tindakan: 'Lakukan pembersihan menyeluruh (housekeeping), bengkokkan/cabut paku yang mencuat sebelum dibuang ke waste bin kayu, bersihkan jalur evakuasi agar steril dari hambatan.',
      pic: 'Pelaksana Housekeeping & Subkon Bekisting',
      target: '2026-10-25',
      status: 'Closed',
      catatanSelesai: 'Puing kayu dan kawat telah dibersihkan bersih, rambu arah evakuasi hijau telah dipasang di bordes tangga.',
      refInspeksi: 'INS-2026-006'
    },
    {
      id: 'fnd_4',
      projectId: 'proj_mandiri',
      projectName: 'Proyek Pembangunan Gedung Mandiri Tower (10 Lantai)',
      projectLocation: 'Kabupaten Sleman, D.I. Yogyakarta',
      no: 'FND-2026-004',
      tanggal: '2026-10-27',
      area: 'Lantai 7 Zona Void Lift Core',
      kategori: 'Rambu dan pengamanan lokasi',
      jenis: 'Kondisi Tidak Aman (Unsafe Condition)',
      deskripsi: 'Bukaan void shaft lift sedalam 7 lantai (28 meter) terbuka tanpa penutup papan kayu tebal dan tanpa pagar pengaman hard barricade, berisiko tinggi menyebabkan pekerja terjatuh.',
      risiko: 'Ekstrem',
      tindakan: 'Pasang pagar pengaman barikade pipa ganda (top rail 1.1m, mid rail 0.6m, toe board 15cm) yang dicat kuning-hitam serta pasang rambu peringatan BAHAYA JATUH - BUKAAN VOID.',
      pic: 'Mandor Pengaman Void & Tim Safety',
      target: '2026-10-29',
      status: 'In Progress',
      catatanSelesai: 'Pipa galvanis dan klem sedang dirakit di workshop lantai dasar untuk dipasang segera.',
      refInspeksi: 'INS-2026-005'
    },
    {
      id: 'fnd_5',
      projectId: 'proj_mandiri',
      projectName: 'Proyek Pembangunan Gedung Mandiri Tower (10 Lantai)',
      projectLocation: 'Kabupaten Sleman, D.I. Yogyakarta',
      no: 'FND-2026-005',
      tanggal: '2026-10-28',
      area: 'Posko Workshop Fabrikasi & Pengelasan',
      kategori: 'Alat dan mesin',
      jenis: 'Kondisi Tidak Aman (Unsafe Condition)',
      deskripsi: 'Tabung gas asetilen dan tabung oksigen disimpan berdampingan tanpa dirantai pengaman tegak pada troli tabung dan penutup katup silinder (valve cap) tidak terpasang.',
      risiko: 'Tinggi',
      tindakan: 'Pisahkan tabung gas oksigen dan asetilen dengan jarak minimal 6 meter atau sekat tahan api 1.5m, ikat tegak dengan rantai besi kokoh pada troli, pasang tutup katup tabung, sediakan APAR powder 6kg.',
      pic: 'Koordinator Fabrikasi & Safety Officer',
      target: '2026-10-30',
      status: 'Open',
      catatanSelesai: '',
      refInspeksi: 'INS-2026-002'
    },
    {
      id: 'fnd_6',
      projectId: 'proj_mandiri',
      projectName: 'Proyek Pembangunan Gedung Mandiri Tower (10 Lantai)',
      projectLocation: 'Kabupaten Sleman, D.I. Yogyakarta',
      no: 'FND-2026-006',
      tanggal: '2026-10-29',
      area: 'Zona Bongkar Pasang Scaffolding Perimeter Timur',
      kategori: 'Perancah dan akses kerja',
      jenis: 'Kondisi Tidak Aman (Unsafe Condition)',
      deskripsi: 'Papan platform lantai kerja (catwalk) scaffolding pipa lantai 4 renggang lebih dari 10 cm, beberapa papan tidak diikat klem dan toe board penahan material belum dipasang.',
      risiko: 'Tinggi',
      tindakan: 'Pasang papan platform rapat tanpa celah, klem kuat ke pipa transom scaffolding, pasang toe board setinggi 15 cm di sekeliling platform kerja untuk mencegah alat terjatuh.',
      pic: 'Supervisor Scaffolding & Site HSE',
      target: '2026-10-31',
      status: 'Open',
      catatanSelesai: '',
      refInspeksi: 'INS-2026-001'
    },
    // Proyek 2: Jembatan & Flyover Bandara YIA
    {
      id: 'fnd_j1',
      projectId: 'proj_jembatan',
      projectName: 'Proyek Pembangunan Jembatan & Flyover Akses Bandara YIA',
      projectLocation: 'Kabupaten Kulon Progo, D.I. Yogyakarta',
      no: 'FND-2026-101',
      tanggal: '2026-10-23',
      area: 'Tepi Lereng Abutment Barat Jembatan',
      kategori: 'Rambu dan pengamanan lokasi',
      jenis: 'Kondisi Tidak Aman (Unsafe Condition)',
      deskripsi: 'Tepi lereng galian oprit abutment sedalam 6 meter belum dipasang hard barricade pipa dan rambu peringatan bahaya jurang tebing.',
      risiko: 'Ekstrem',
      tindakan: 'Pasang barikade pipa ganda dicat kuning-hitam setinggi 1.1 meter dan pasang terpal penutup lereng untuk mencegah erosi saat hujan lebat.',
      pic: 'Pelaksana Lapangan Abutment',
      target: '2026-10-25',
      status: 'In Progress',
      catatanSelesai: 'Pipa galvanis sedang dipasang dan terpal telah disiapkan.',
      refInspeksi: 'INS-2026-101'
    },
    {
      id: 'fnd_j2',
      projectId: 'proj_jembatan',
      projectName: 'Proyek Pembangunan Jembatan & Flyover Akses Bandara YIA',
      projectLocation: 'Kabupaten Kulon Progo, D.I. Yogyakarta',
      no: 'FND-2026-102',
      tanggal: '2026-10-26',
      area: 'Titik Pengelasan Sambungan Girder Baja',
      kategori: 'Penggunaan APD',
      jenis: 'Tindakan Tidak Aman (Unsafe Act)',
      deskripsi: 'Tukang las (welder) mengelas sambungan plat diafragma tanpa menggunakan kedok las otomatis dan sarung tangan kulit tahan panas robek.',
      risiko: 'Sedang',
      tindakan: 'Ganti kedok las auto-darkening baru dari gudang K3 dan berikan sarung tangan kulit las heavy duty tebal.',
      pic: 'Mandor Fabrikasi & Safety Man',
      target: '2026-10-26',
      status: 'Closed',
      catatanSelesai: 'Pekerja telah diberikan APD baru lengkap dan pengawasan las diperketat.',
      refInspeksi: 'INS-2026-102'
    },
    {
      id: 'fnd_j3',
      projectId: 'proj_jembatan',
      projectName: 'Proyek Pembangunan Jembatan & Flyover Akses Bandara YIA',
      projectLocation: 'Kabupaten Kulon Progo, D.I. Yogyakarta',
      no: 'FND-2026-103',
      tanggal: '2026-10-28',
      area: 'Jalan Akses Material Oprit Timur',
      kategori: 'Pengendalian area kerja',
      jenis: 'Kondisi Tidak Aman (Unsafe Condition)',
      deskripsi: 'Tidak ada petugas pemandu lalu lintas (flagman) saat dump truck pengangkut tanah timbunan bermanuver mundur menyeberangi jalan umum.',
      risiko: 'Tinggi',
      tindakan: 'Tugaskan 2 orang flagman bersertifikat lengkap dengan rompi reflektif, peluit, dan rambu bendera merah/hijau untuk mengatur arus kendaraan.',
      pic: 'Koordinator Traffic Management Proyek',
      target: '2026-10-30',
      status: 'Open',
      catatanSelesai: '',
      refInspeksi: 'INS-2026-103'
    }
  ];

  // --- APPLICATION STATE ---
  const state = {
    projects: [],
    activeProjectId: 'proj_mandiri',
    inspections: [],
    risks: [],
    findings: [],
    currentPage: 'dashboard',
    charts: {
      category: null,
      monthly: null
    },
    pendingAction: null
  };

  // --- STORAGE HELPERS ---
  function loadFromStorage(key, defaultValue) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.error(`Gagal membaca ${key} dari localStorage:`, e);
      return defaultValue;
    }
  }

  function saveToStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Gagal menyimpan ${key} ke localStorage:`, e);
      showToast('Gagal menyimpan ke penyimpanan lokal browser!', 'error');
    }
  }

  // --- PROJECT ACCESSORS & HELPERS ---
  function getActiveProject() {
    const found = state.projects.find(p => p.id === state.activeProjectId);
    return found || state.projects[0] || DEFAULT_PROJECTS[0];
  }

  function getProjectInspections(projId = state.activeProjectId) {
    const defaultId = state.projects[0] ? state.projects[0].id : 'proj_mandiri';
    return state.inspections.filter(i => (i.projectId || defaultId) === projId);
  }

  function getProjectRisks(projId = state.activeProjectId) {
    const defaultId = state.projects[0] ? state.projects[0].id : 'proj_mandiri';
    return state.risks.filter(r => (r.projectId || defaultId) === projId);
  }

  function getProjectFindings(projId = state.activeProjectId) {
    const defaultId = state.projects[0] ? state.projects[0].id : 'proj_mandiri';
    return state.findings.filter(f => (f.projectId || defaultId) === projId);
  }

  // --- INITIALIZE APPLICATION ---
  function initApp() {
    // 1. Load Projects & Active Project
    let storedProjects = loadFromStorage(STORAGE_KEYS.PROJECTS, null);

    if (!storedProjects || storedProjects.length === 0) {
      // Check for legacy single-setting migration
      const legacySettings = loadFromStorage(STORAGE_KEYS.LEGACY_SETTINGS, null);
      if (legacySettings && legacySettings.projectName) {
        const migratedProject = {
          ...DEFAULT_PROJECTS[0],
          projectName: legacySettings.projectName,
          contractor: legacySettings.contractor || DEFAULT_PROJECTS[0].contractor,
          address: legacySettings.location || DEFAULT_PROJECTS[0].address,
          hseOfficer: legacySettings.hseOfficer || DEFAULT_PROJECTS[0].hseOfficer,
          hseNim: legacySettings.hseNim || DEFAULT_PROJECTS[0].hseNim,
          safeHours: legacySettings.safeHours || DEFAULT_PROJECTS[0].safeHours,
          targetHours: legacySettings.targetHours || DEFAULT_PROJECTS[0].targetHours
        };
        state.projects = [migratedProject, DEFAULT_PROJECTS[1]];
      } else {
        state.projects = JSON.parse(JSON.stringify(DEFAULT_PROJECTS));
      }
      saveToStorage(STORAGE_KEYS.PROJECTS, state.projects);
    } else {
      state.projects = storedProjects;
    }

    // Active project ID
    const storedActiveId = loadFromStorage(STORAGE_KEYS.ACTIVE_PROJECT_ID, null);
    if (storedActiveId && state.projects.some(p => p.id === storedActiveId)) {
      state.activeProjectId = storedActiveId;
    } else {
      state.activeProjectId = state.projects[0].id;
      saveToStorage(STORAGE_KEYS.ACTIVE_PROJECT_ID, state.activeProjectId);
    }

    // 2. Load Inspections (with backward compatibility)
    const storedInspections = loadFromStorage(STORAGE_KEYS.INSPECTIONS, null);
    if (!storedInspections || storedInspections.length === 0) {
      state.inspections = JSON.parse(JSON.stringify(DEFAULT_INSPECTIONS));
      saveToStorage(STORAGE_KEYS.INSPECTIONS, state.inspections);
    } else {
      // Ensure all historical records have projectId
      state.inspections = storedInspections.map(i => ({
        ...i,
        projectId: i.projectId || state.projects[0].id,
        projectName: i.projectName || state.projects[0].projectName,
        projectLocation: i.projectLocation || `${state.projects[0].city}, ${state.projects[0].province}`
      }));
    }

    // 3. Load Risks (with backward compatibility)
    const storedRisks = loadFromStorage(STORAGE_KEYS.RISKS, null);
    if (!storedRisks || storedRisks.length === 0) {
      state.risks = JSON.parse(JSON.stringify(DEFAULT_RISKS));
      saveToStorage(STORAGE_KEYS.RISKS, state.risks);
    } else {
      state.risks = storedRisks.map(r => ({
        ...r,
        projectId: r.projectId || state.projects[0].id,
        projectName: r.projectName || state.projects[0].projectName,
        projectLocation: r.projectLocation || `${state.projects[0].city}, ${state.projects[0].province}`
      }));
    }

    // 4. Load Findings (with backward compatibility)
    const storedFindings = loadFromStorage(STORAGE_KEYS.FINDINGS, null);
    if (!storedFindings || storedFindings.length === 0) {
      state.findings = JSON.parse(JSON.stringify(DEFAULT_FINDINGS));
      saveToStorage(STORAGE_KEYS.FINDINGS, state.findings);
    } else {
      state.findings = storedFindings.map(f => ({
        ...f,
        projectId: f.projectId || state.projects[0].id,
        projectName: f.projectName || state.projects[0].projectName,
        projectLocation: f.projectLocation || `${state.projects[0].city}, ${state.projects[0].province}`
      }));
    }

    // 5. Update UI for Active Project
    applySettingsToUI();

    // 6. Start Live Clock
    startLiveClock();

    // 7. Setup Event Listeners
    setupEventListeners();

    // 8. Navigation Route
    const hash = window.location.hash.replace('#', '');
    const validPages = ['dashboard', 'inspeksi', 'risiko', 'temuan', 'laporan', 'pengaturan'];
    const initialPage = validPages.includes(hash) ? hash : 'dashboard';
    navigateTo(initialPage);

    // 9. Initial Render
    renderAllViews();
  }

  // --- UI & SETTINGS SYNC ---
  function applySettingsToUI() {
    const p = getActiveProject();
    if (!p) return;

    // Sidebar Active Project Pill
    const elSidebarProject = document.getElementById('sidebarProjectName');
    const elSidebarType = document.getElementById('sidebarProjectType');
    const elSidebarLoc = document.getElementById('sidebarProjectLocation');
    const elSidebarUser = document.getElementById('sidebarUserName');

    if (elSidebarProject) elSidebarProject.textContent = p.projectName;
    if (elSidebarType) elSidebarType.textContent = p.projectType || 'Konstruksi';
    if (elSidebarLoc) elSidebarLoc.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${escapeHtml(p.city || p.province || 'Indonesia')}`;
    if (elSidebarUser) elSidebarUser.textContent = p.hseOfficer || 'Zahra Faizatun N.';

    // Header Project Quick Switcher
    const headerProjSelect = document.getElementById('headerProjectSelector');
    if (headerProjSelect) {
      headerProjSelect.innerHTML = state.projects.map(proj => `
        <option value="${escapeHtml(proj.id)}" ${proj.id === p.id ? 'selected' : ''}>
          ${escapeHtml(proj.projectName)} [${escapeHtml(proj.projectType || 'Proyek')}]
        </option>
      `).join('');
    }

    // Header Safe Hours
    const elHeaderHours = document.getElementById('headerSafeHours');
    if (elHeaderHours) elHeaderHours.textContent = Number(p.safeHours || 0).toLocaleString('id-ID');

    // Dashboard Project Identity Card (Requirement 4 & 7)
    const dashName = document.getElementById('dashProjName');
    const dashTypeBadge = document.getElementById('dashProjTypeBadge');
    const dashCityBadge = document.getElementById('dashProjCityBadge');
    const dashAddress = document.getElementById('dashProjAddress');
    const dashCityProv = document.getElementById('dashProjCityProv');
    const dashContractor = document.getElementById('dashProjContractor');
    const dashManager = document.getElementById('dashProjManager');
    const dashAvatar = document.getElementById('dashProjTypeAvatar');

    if (dashName) dashName.textContent = p.projectName;
    if (dashTypeBadge) {
      const typeIcons = {
        Gedung: 'fa-building',
        Jalan: 'fa-road',
        Jembatan: 'fa-bridge',
        Lainnya: 'fa-helmet-safety'
      };
      const icon = typeIcons[p.projectType] || 'fa-helmet-safety';
      dashTypeBadge.innerHTML = `<i class="fa-solid ${icon}"></i> Jenis: ${escapeHtml(p.projectType || 'Gedung')}`;
    }
    if (dashCityBadge) dashCityBadge.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${escapeHtml(p.city)}, ${escapeHtml(p.province)}`;
    if (dashAddress) dashAddress.textContent = p.address || '-';
    if (dashCityProv) dashCityProv.textContent = `${p.city || ''}, ${p.province || ''}`;
    if (dashContractor) dashContractor.textContent = p.contractor || '-';
    if (dashManager) dashManager.textContent = p.projectManager || 'Project Manager';
    if (dashAvatar) {
      const typeIcons = {
        Gedung: 'fa-building',
        Jalan: 'fa-road',
        Jembatan: 'fa-bridge',
        Lainnya: 'fa-helmet-safety'
      };
      const icon = typeIcons[p.projectType] || 'fa-building';
      dashAvatar.innerHTML = `<i class="fa-solid ${icon}"></i>`;
    }

    // Context Bars on all other pages
    document.querySelectorAll('.ctx-project-name').forEach(el => el.textContent = p.projectName);
    document.querySelectorAll('.ctx-project-type').forEach(el => el.textContent = p.projectType || 'Konstruksi');
    document.querySelectorAll('.ctx-project-location').forEach(el => el.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${escapeHtml(p.city)}, ${escapeHtml(p.province)}`);
    document.querySelectorAll('.ctx-project-contractor').forEach(el => el.textContent = p.contractor || '-');

    // Settings Form Inputs
    const setProj = document.getElementById('setProjectName');
    const setType = document.getElementById('setProjectType');
    const setAddr = document.getElementById('setAddress');
    const setCity = document.getElementById('setCity');
    const setProv = document.getElementById('setProvince');
    const setCont = document.getElementById('setContractor');
    const setMgr = document.getElementById('setProjectManager');
    const setOff = document.getElementById('setHseOfficer');
    const setNim = document.getElementById('setHseNim');
    const setHours = document.getElementById('setSafeHours');
    const setTarget = document.getElementById('setTargetHours');

    if (setProj) setProj.value = p.projectName || '';
    if (setType) setType.value = p.projectType || 'Gedung';
    if (setAddr) setAddr.value = p.address || '';
    if (setCity) setCity.value = p.city || '';
    if (setProv) setProv.value = p.province || '';
    if (setCont) setCont.value = p.contractor || '';
    if (setMgr) setMgr.value = p.projectManager || '';
    if (setOff) setOff.value = p.hseOfficer || '';
    if (setNim) setNim.value = p.hseNim || '';
    if (setHours) setHours.value = p.safeHours || 0;
    if (setTarget) setTarget.value = p.targetHours || 0;

    // Print Letterhead & Signatures
    const printProject = document.getElementById('printProjectName');
    const printType = document.getElementById('printProjectType');
    const printContractor = document.getElementById('printContractor');
    const printLoc = document.getElementById('printLocation');
    const printMgr = document.getElementById('printProjectManager');
    const printOfficer = document.getElementById('printHseOfficer');
    const sigPreparer = document.getElementById('sigPreparerName');
    const sigManager = document.getElementById('sigManagerName');

    if (printProject) printProject.textContent = p.projectName;
    if (printType) printType.textContent = p.projectType || 'Konstruksi';
    if (printContractor) printContractor.textContent = p.contractor;
    if (printLoc) printLoc.textContent = `${p.address}, ${p.city}, ${p.province}`;
    if (printMgr) printMgr.textContent = p.projectManager || '-';
    if (printOfficer) printOfficer.textContent = `${p.hseOfficer} (${p.hseNim})`;
    if (sigPreparer) sigPreparer.textContent = p.hseOfficer;
    if (sigManager) sigManager.textContent = p.projectManager || 'Project Manager';

    // Multi-Project Table in Settings
    renderProjectsTable();
  }

  // --- RENDER MULTI-PROJECTS TABLE IN SETTINGS ---
  function renderProjectsTable() {
    const tbody = document.getElementById('tableProjectsTbody');
    if (!tbody) return;

    tbody.innerHTML = state.projects.map((proj, idx) => {
      const isActive = proj.id === state.activeProjectId;
      const insCount = state.inspections.filter(i => (i.projectId || state.projects[0].id) === proj.id).length;
      const fndCount = state.findings.filter(f => (f.projectId || state.projects[0].id) === proj.id).length;

      return `
        <tr class="${isActive ? 'row-active-project' : ''}">
          <td>
            <strong>${escapeHtml(proj.projectName)}</strong><br>
            <span class="text-sm text-muted"><i class="fa-solid fa-map-pin"></i> ${escapeHtml(proj.address || '-')}</span>
          </td>
          <td><span class="badge badge-primary">${escapeHtml(proj.projectType || 'Gedung')}</span></td>
          <td><span class="text-sm">${escapeHtml(proj.city || '')}, ${escapeHtml(proj.province || '')}</span></td>
          <td>
            ${isActive
              ? '<span class="status-badge status-closed"><i class="fa-solid fa-circle-check"></i> Aktif</span>'
              : '<span class="status-badge status-open">Tidak Aktif</span>'}
          </td>
          <td class="text-center">
            <div class="table-actions">
              ${!isActive ? `
                <button class="btn btn-primary btn-sm" onclick="app.switchProject('${proj.id}')" title="Jadikan Proyek Aktif">
                  <i class="fa-solid fa-circle-check"></i> Aktifkan
                </button>
              ` : `
                <span class="badge badge-success"><i class="fa-solid fa-check"></i> Sedang Digunakan</span>
              `}
              ${state.projects.length > 1 ? `
                <button class="btn-table-action delete" onclick="app.deleteProject('${proj.id}')" title="Hapus Proyek Ini">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              ` : ''}
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // --- PROJECT SWITCHING & MANAGEMENT (FEATURE 8, 9) ---
  function switchProject(projectId) {
    if (!state.projects.some(p => p.id === projectId)) return;

    state.activeProjectId = projectId;
    saveToStorage(STORAGE_KEYS.ACTIVE_PROJECT_ID, state.activeProjectId);

    applySettingsToUI();
    renderAllViews();

    const targetProj = getActiveProject();
    showToast(`Beralih ke proyek aktif: "${targetProj.projectName}"`, 'info');
  }

  function openProjectSwitchModal() {
    const list = document.getElementById('projectSwitchList');
    if (!list) return;

    list.innerHTML = state.projects.map(proj => {
      const isActive = proj.id === state.activeProjectId;
      const insCount = state.inspections.filter(i => (i.projectId || state.projects[0].id) === proj.id).length;
      const fndCount = state.findings.filter(f => (f.projectId || state.projects[0].id) === proj.id).length;

      return `
        <div class="project-card-option ${isActive ? 'is-active' : ''}" onclick="app.switchProject('${proj.id}'); app.closeModal('modalSwitchProject');">
          <div class="proj-opt-info">
            <strong>${escapeHtml(proj.projectName)}</strong>
            <div class="proj-opt-meta">
              <span><i class="fa-solid fa-helmet-safety"></i> ${escapeHtml(proj.projectType || 'Gedung')}</span>
              <span><i class="fa-solid fa-location-dot"></i> ${escapeHtml(proj.city || '')}, ${escapeHtml(proj.province || '')}</span>
              <span><i class="fa-solid fa-clipboard-check"></i> ${insCount} Inspeksi</span>
              <span><i class="fa-solid fa-triangle-exclamation"></i> ${fndCount} Temuan</span>
            </div>
          </div>
          <div>
            ${isActive
              ? '<span class="badge badge-success"><i class="fa-solid fa-check"></i> Aktif</span>'
              : '<button class="btn btn-outline btn-sm">Pilih Proyek Ini</button>'}
          </div>
        </div>
      `;
    }).join('');

    openModal('modalSwitchProject');
  }

  function openModalNewProject() {
    const form = document.getElementById('formNewProject');
    if (form) form.reset();
    openModal('modalNewProject');
  }

  function handleSaveNewProject(e) {
    e.preventDefault();
    const name = document.getElementById('newProjectName')?.value.trim();
    const type = document.getElementById('newProjectType')?.value;
    const address = document.getElementById('newProjectAddress')?.value.trim();
    const city = document.getElementById('newProjectCity')?.value.trim();
    const province = document.getElementById('newProjectProvince')?.value.trim();
    const contractor = document.getElementById('newProjectContractor')?.value.trim();
    const manager = document.getElementById('newProjectManager')?.value.trim();
    const hseOfficer = document.getElementById('newProjectHseOfficer')?.value.trim();
    const hseNim = document.getElementById('newProjectHseNim')?.value.trim() || '';
    const safeHours = Number(document.getElementById('newProjectSafeHours')?.value || 0);

    // Validation (Requirement 2)
    if (!name || !type || !address || !city || !province || !contractor || !manager || !hseOfficer) {
      showToast('Harap lengkapi semua kolom wajib proyek baru!', 'warning');
      return;
    }

    const newProject = {
      id: 'proj_' + Date.now(),
      projectName: name,
      projectType: type,
      address,
      city,
      province,
      contractor,
      projectManager: manager,
      hseOfficer,
      hseNim,
      safeHours: 0,
      targetHours: safeHours || 500000
    };

    state.projects.push(newProject);
    state.activeProjectId = newProject.id;

    saveToStorage(STORAGE_KEYS.PROJECTS, state.projects);
    saveToStorage(STORAGE_KEYS.ACTIVE_PROJECT_ID, state.activeProjectId);

    closeModal('modalNewProject');
    closeModal('modalSwitchProject');

    applySettingsToUI();
    renderAllViews();

    showToast(`Proyek baru "${name}" berhasil didaftarkan dan diaktifkan!`, 'success');
  }

  function deleteProject(projId) {
    if (state.projects.length <= 1) {
      showToast('Tidak dapat menghapus satu-satunya proyek konstruksi yang ada!', 'warning');
      return;
    }

    const targetProj = state.projects.find(p => p.id === projId);
    if (!targetProj) return;

    openConfirmDialog(
      'Hapus Proyek Konstruksi',
      `Apakah Anda yakin ingin menghapus proyek <strong>${escapeHtml(targetProj.projectName)}</strong> beserta seluruh catatan inspeksi, risiko, dan temuan di dalamnya?`,
      () => {
        // Remove project's data
        state.inspections = state.inspections.filter(i => (i.projectId || state.projects[0].id) !== projId);
        state.risks = state.risks.filter(r => (r.projectId || state.projects[0].id) !== projId);
        state.findings = state.findings.filter(f => (f.projectId || state.projects[0].id) !== projId);

        // Remove project from list
        state.projects = state.projects.filter(p => p.id !== projId);

        // If deleted was active, switch to first available
        if (state.activeProjectId === projId) {
          state.activeProjectId = state.projects[0].id;
        }

        saveToStorage(STORAGE_KEYS.PROJECTS, state.projects);
        saveToStorage(STORAGE_KEYS.ACTIVE_PROJECT_ID, state.activeProjectId);
        saveToStorage(STORAGE_KEYS.INSPECTIONS, state.inspections);
        saveToStorage(STORAGE_KEYS.RISKS, state.risks);
        saveToStorage(STORAGE_KEYS.FINDINGS, state.findings);

        applySettingsToUI();
        renderAllViews();

        showToast(`Proyek "${targetProj.projectName}" telah dihapus!`, 'success');
      }
    );
  }

  // --- SAVE ACTIVE PROJECT IDENTITY & LOCATION (REQUIREMENT 1, 2, 4, 7) ---
  function handleSaveProjectSettings(e) {
    e.preventDefault();

    const projectName = document.getElementById('setProjectName')?.value.trim();
    const projectType = document.getElementById('setProjectType')?.value;
    const address = document.getElementById('setAddress')?.value.trim();
    const city = document.getElementById('setCity')?.value.trim();
    const province = document.getElementById('setProvince')?.value.trim();
    const contractor = document.getElementById('setContractor')?.value.trim();
    const projectManager = document.getElementById('setProjectManager')?.value.trim();
    const hseOfficer = document.getElementById('setHseOfficer')?.value.trim();
    const hseNim = document.getElementById('setHseNim')?.value.trim() || '';
    const safeHours = Number(document.getElementById('setSafeHours')?.value || 0);
    const targetHours = Number(document.getElementById('setTargetHours')?.value || 0);

    // Validation (Requirement 2)
    if (!projectName || !projectType || !address || !city || !province || !contractor || !projectManager || !hseOfficer) {
      showToast('Harap isi semua kolom wajib bertanda bintang (*)!', 'warning');
      return;
    }

    // Confirmation modal before saving (Requirement 7)
    openConfirmDialog(
      'Konfirmasi Perubahan Identitas Proyek',
      `Apakah Anda yakin ingin memperbarui data identitas dan lokasi proyek <strong>"${escapeHtml(projectName)}"</strong>?<br><br>
       Lokasi baru: <strong>${escapeHtml(city)}, ${escapeHtml(province)}</strong><br>
       Kontraktor: <strong>${escapeHtml(contractor)}</strong><br>
       Penanggung Jawab: <strong>${escapeHtml(projectManager)}</strong><br><br>
       <span class="text-sm text-muted">Perubahan ini akan langsung diperbarui di dashboard, header, dan laporan resmi.</span>`,
      () => {
        const curr = getActiveProject();
        curr.projectName = projectName;
        curr.projectType = projectType;
        curr.address = address;
        curr.city = city;
        curr.province = province;
        curr.contractor = contractor;
        curr.projectManager = projectManager;
        curr.hseOfficer = hseOfficer;
        curr.hseNim = hseNim;
        curr.safeHours = safeHours;
        curr.targetHours = targetHours;

        // Save projects array
        saveToStorage(STORAGE_KEYS.PROJECTS, state.projects);

        // Update UI everywhere
        applySettingsToUI();
        renderAllViews();

        showToast('Identitas dan lokasi proyek berhasil diperbarui!', 'success');
      }
    );
  }

  // --- LIVE CLOCK ---
  function startLiveClock() {
    const clockEl = document.getElementById('liveClock');
    const printDateEl = document.getElementById('printDateStr');
    const printDocDateEl = document.getElementById('printDocDate');

    function update() {
      const now = new Date();
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      const dateStr = now.toLocaleDateString('id-ID', options);
      const timeStr = now.toLocaleTimeString('id-ID', { hour12: false }) + ' WIB';

      if (clockEl) clockEl.textContent = `${dateStr} | ${timeStr}`;
      if (printDateEl) printDateEl.textContent = dateStr;
      if (printDocDateEl) printDocDateEl.textContent = now.getFullYear().toString();
    }
    update();
    setInterval(update, 1000);
  }

  // --- NAVIGATION (SPA CONTROLLER) ---
  function navigateTo(pageId) {
    state.currentPage = pageId;

    // Update Navigation links in sidebar
    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
      if (link.dataset.page === pageId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Update Views
    document.querySelectorAll('.page-view').forEach(view => {
      view.classList.remove('active');
    });

    const targetView = document.getElementById(`view-${pageId}`);
    if (targetView) {
      targetView.classList.add('active');
    }

    // Update Header Titles
    const titleMap = {
      dashboard: 'Dashboard K3 Konstruksi',
      inspeksi: 'Modul Inspeksi K3 Lapangan',
      risiko: 'Penilaian Risiko (HIRADC 5×5)',
      temuan: 'Laporan Temuan K3 (Unsafe Act & Condition)',
      laporan: 'Laporan Rekapitulasi & Kinerja K3',
      pengaturan: 'Pengaturan Lokasi & Identitas Proyek'
    };

    const breadcrumbMap = {
      dashboard: 'Dashboard',
      inspeksi: 'Inspeksi K3',
      risiko: 'Penilaian Risiko',
      temuan: 'Temuan K3',
      laporan: 'Laporan Rekapitulasi',
      pengaturan: 'Pengaturan Proyek'
    };

    const pageTitleEl = document.getElementById('pageTitle');
    const breadcrumbEl = document.getElementById('breadcrumbCurrent');

    if (pageTitleEl) pageTitleEl.textContent = titleMap[pageId] || 'SAFEWORK HSE';
    if (breadcrumbEl) breadcrumbEl.textContent = breadcrumbMap[pageId] || pageId;

    closeMobileSidebar();

    // Specific refresh actions
    if (pageId === 'dashboard') {
      renderDashboard();
    } else if (pageId === 'inspeksi') {
      renderTableInspeksi();
    } else if (pageId === 'risiko') {
      renderTableRisiko();
    } else if (pageId === 'temuan') {
      renderTableTemuan();
    } else if (pageId === 'laporan') {
      renderReportView();
    }

    if (window.location.hash !== `#${pageId}`) {
      window.history.pushState(null, '', `#${pageId}`);
    }
  }

  function closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar) sidebar.classList.remove('show');
    if (overlay) overlay.classList.remove('show');
  }

  function openMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar) sidebar.classList.add('show');
    if (overlay) overlay.classList.add('show');
  }

  // --- RENDER ALL VIEWS & COUNTS ---
  function renderAllViews() {
    updateBadges();
    renderDashboard();
    renderTableInspeksi();
    renderTableRisiko();
    renderTableTemuan();
    renderReportView();
  }

  function updateBadges() {
    const curIns = getProjectInspections();
    const curFnd = getProjectFindings();

    const totalInspeksi = curIns.length;
    const openTemuan = curFnd.filter(f => f.status === 'Open' || f.status === 'In Progress').length;

    const bIns = document.getElementById('badgeInspeksiCount');
    const bTem = document.getElementById('badgeTemuanOpenCount');

    if (bIns) bIns.textContent = totalInspeksi;
    if (bTem) bTem.textContent = openTemuan;
  }

  // ==========================================================================
  // 1. DASHBOARD MODULE (ISOLATED TO ACTIVE PROJECT)
  // ==========================================================================
  function renderDashboard() {
    const inspections = getProjectInspections();
    const findings = getProjectFindings();
    const risks = getProjectRisks();

    // Counts
    const totalInspeksi = inspections.length;
    const insSelesai = inspections.filter(i => i.status === 'Selesai').length;
    const insFollowUp = inspections.filter(i => i.status === 'Perlu Tindak Lanjut').length;

    const totalTemuan = findings.length;
    const temuanOpen = findings.filter(f => f.status === 'Open' || f.status === 'In Progress').length;
    const temuanClosed = findings.filter(f => f.status === 'Closed').length;
    const resolutionRate = totalTemuan > 0 ? Math.round((temuanClosed / totalTemuan) * 100) : 100;

    // DOM Updates
    const elTotIns = document.getElementById('dashTotalInspeksi');
    const elSubIns = document.getElementById('dashSubInspeksi');
    const elTotTem = document.getElementById('dashTotalTemuan');
    const elTemOpen = document.getElementById('dashTemuanOpen');
    const elSubTemOpen = document.getElementById('dashSubTemuanOpen');
    const elTemClosed = document.getElementById('dashTemuanClosed');
    const elSubRes = document.getElementById('dashSubResolutionRate');

    if (elTotIns) elTotIns.textContent = totalInspeksi;
    if (elSubIns) elSubIns.textContent = `${insSelesai} selesai, ${insFollowUp} tindak lanjut`;
    if (elTotTem) elTotTem.textContent = totalTemuan;
    if (elTemOpen) elTemOpen.textContent = temuanOpen;
    if (elSubTemOpen) elSubTemOpen.textContent = temuanOpen > 0 ? `${temuanOpen} memerlukan tindakan segera` : 'Semua temuan terselesaikan';
    if (elTemClosed) elTemClosed.textContent = temuanClosed;
    if (elSubRes) elSubRes.textContent = `Tingkat resolusi: ${resolutionRate}%`;

    // Risk Counts
    const riskCounts = { Rendah: 0, Sedang: 0, Tinggi: 0, Ekstrem: 0 };
    risks.forEach(r => {
      if (riskCounts[r.level] !== undefined) riskCounts[r.level]++;
    });

    const elRLow = document.getElementById('dashRiskCountLow');
    const elRMed = document.getElementById('dashRiskCountMed');
    const elRHigh = document.getElementById('dashRiskCountHigh');
    const elRExt = document.getElementById('dashRiskCountExt');

    if (elRLow) elRLow.textContent = riskCounts.Rendah;
    if (elRMed) elRMed.textContent = riskCounts.Sedang;
    if (elRHigh) elRHigh.textContent = riskCounts.Tinggi;
    if (elRExt) elRExt.textContent = riskCounts.Ekstrem;

    // Safety Banner calculation
    const safetyScoreEl = document.getElementById('dashSafetyScore');
    const bannerBadge = document.getElementById('bannerSafetyStatusBadge');
    const bannerMsg = document.getElementById('bannerSafetyMessage');

    let safetyIndex = 100;
    if (totalTemuan > 0) {
      safetyIndex = Math.max(40, Math.min(100, Math.round(50 + (resolutionRate * 0.5) - (riskCounts.Ekstrem * 3))));
    }

    if (safetyScoreEl) safetyScoreEl.textContent = `${safetyIndex}%`;

    if (bannerBadge && bannerMsg) {
      if (totalTemuan === 0 && totalInspeksi === 0) {
        bannerBadge.className = 'badge badge-info';
        bannerBadge.textContent = 'PROYEK BARU';
        bannerMsg.textContent = 'Belum ada catatan inspeksi dan temuan di proyek ini. Anda dapat mulai mencatat inspeksi K3 pertama.';
      } else if (temuanOpen === 0) {
        bannerBadge.className = 'badge badge-success';
        bannerBadge.textContent = 'SANGAT BAIK / KONDUSIF';
        bannerMsg.textContent = 'Semua temuan keselamatan telah berhasil ditindaklanjuti. Proyek beroperasi dalam kondisi aman optimal.';
      } else if (temuanOpen <= 2) {
        bannerBadge.className = 'badge badge-info';
        bannerBadge.textContent = 'TERKENDALI';
        bannerMsg.textContent = `Tingkat penyelesaian temuan mencapai ${resolutionRate}%. Ada ${temuanOpen} temuan yang sedang dalam mitigasi lapangan.`;
      } else {
        bannerBadge.className = 'badge badge-warning';
        bannerBadge.textContent = 'PERHATIAN KHUSUS';
        bannerMsg.textContent = `Terdapat ${temuanOpen} temuan ketidaksesuaian K3 yang masih terbuka. Mandor dan PIC lapangan wajib mempercepat perbaikan.`;
      }
    }

    renderRecentFindingsTable();
    updateDashboardCharts();
  }

  function renderRecentFindingsTable() {
    const tbody = document.getElementById('dashRecentFindingsTbody');
    if (!tbody) return;

    const curFindings = getProjectFindings();
    const recent = [...curFindings].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal)).slice(0, 5);

    if (recent.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="empty-table-row">
            <div class="empty-state-box">
              <i class="fa-regular fa-folder-open"></i>
              <p>Belum ada data temuan K3 pada proyek aktif ini.</p>
            </div>
          </td>
        </tr>`;
      return;
    }

    tbody.innerHTML = recent.map(item => {
      const riskClass = getRiskBadgeClass(item.risiko);
      const statusClass = getStatusBadgeClass(item.status);

      return `
        <tr>
          <td><strong class="font-mono">${escapeHtml(item.no)}</strong></td>
          <td>${formatDateIndo(item.tanggal)}</td>
          <td>${escapeHtml(item.area)}</td>
          <td><span class="badge badge-neutral">${escapeHtml(item.kategori)}</span></td>
          <td style="max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${escapeHtml(item.deskripsi)}">
            ${escapeHtml(item.deskripsi)}
          </td>
          <td><span class="risk-badge ${riskClass}">${escapeHtml(item.risiko)}</span></td>
          <td><span class="status-badge ${statusClass}">${escapeHtml(item.status)}</span></td>
          <td>
            <button class="btn btn-outline btn-sm" onclick="app.showDetailTemuan('${item.id}')" title="Lihat Detail">
              <i class="fa-solid fa-eye"></i> Detail
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  function updateDashboardCharts() {
    if (typeof Chart === 'undefined') return;

    const curFindings = getProjectFindings();
    const curInspections = getProjectInspections();

    // Chart 1: Category Breakdown
    const catCanvas = document.getElementById('chartCategory');
    if (catCanvas) {
      const categories = [
        'Penggunaan APD',
        'Housekeeping',
        'Perancah dan akses kerja',
        'Instalasi listrik',
        'Alat dan mesin',
        'Pengendalian area kerja',
        'Rambu dan pengamanan lokasi'
      ];

      const counts = categories.map(cat => curFindings.filter(f => f.kategori === cat).length);

      if (state.charts.category) {
        state.charts.category.destroy();
      }

      state.charts.category = new Chart(catCanvas, {
        type: 'doughnut',
        data: {
          labels: ['APD', 'Housekeeping', 'Perancah & Akses', 'Instalasi Listrik', 'Alat & Mesin', 'Pengendalian Area', 'Rambu & Barikade'],
          datasets: [{
            data: counts,
            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#64748b'],
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: { boxWidth: 12, font: { size: 11, family: 'Inter' }, padding: 10 }
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const val = context.parsed || 0;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const pct = total > 0 ? Math.round((val / total) * 100) : 0;
                  return ` ${context.label}: ${val} temuan (${pct}%)`;
                }
              }
            }
          },
          cutout: '62%'
        }
      });
    }

    // Chart 2: Monthly Trends
    const monthlyCanvas = document.getElementById('chartMonthly');
    if (monthlyCanvas) {
      const months = ['Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt'];
      // Scale with project count
      const baseIns = Math.max(1, Math.round(curInspections.length / 2));
      const baseFnd = Math.max(1, Math.round(curFindings.length / 2));

      const insCounts = [baseIns, baseIns + 1, baseIns + 2, baseIns + 1, baseIns + 2, curInspections.length];
      const findCounts = [baseFnd, baseFnd + 1, baseFnd, baseFnd + 1, baseFnd, curFindings.length];

      if (state.charts.monthly) {
        state.charts.monthly.destroy();
      }

      state.charts.monthly = new Chart(monthlyCanvas, {
        type: 'bar',
        data: {
          labels: months,
          datasets: [
            {
              label: 'Inspeksi K3',
              data: insCounts,
              backgroundColor: 'rgba(37, 99, 235, 0.85)',
              borderRadius: 6,
              barThickness: 16
            },
            {
              label: 'Temuan K3',
              data: findCounts,
              backgroundColor: 'rgba(239, 68, 68, 0.85)',
              borderRadius: 6,
              barThickness: 16
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top', labels: { boxWidth: 12, font: { size: 12, family: 'Inter' } } }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { stepSize: 2 },
              grid: { color: 'rgba(226, 232, 240, 0.6)' }
            },
            x: { grid: { display: false } }
          }
        }
      });
    }
  }

  // ==========================================================================
  // 2. MODUL INSPEKSI K3
  // ==========================================================================
  function renderTableInspeksi() {
    const tbody = document.getElementById('tableInspeksiTbody');
    const infoEl = document.getElementById('inspeksiCountInfo');
    if (!tbody) return;

    const curInspections = getProjectInspections();
    const searchTerm = (document.getElementById('filterInspeksiSearch')?.value || '').toLowerCase();
    const filterCat = document.getElementById('filterInspeksiCategory')?.value || '';
    const filterStat = document.getElementById('filterInspeksiStatus')?.value || '';

    let filtered = curInspections.filter(item => {
      const matchSearch = item.no.toLowerCase().includes(searchTerm) ||
        item.area.toLowerCase().includes(searchTerm) ||
        item.petugas.toLowerCase().includes(searchTerm);
      const matchCat = !filterCat || item.kategori === filterCat;
      const matchStat = !filterStat || item.status === filterStat;
      return matchSearch && matchCat && matchStat;
    });

    if (infoEl) {
      infoEl.textContent = `Menampilkan ${filtered.length} dari ${curInspections.length} inspeksi pada proyek aktif ini`;
    }

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="empty-table-row">
            <div class="empty-state-box">
              <i class="fa-regular fa-clipboard"></i>
              <p>Tidak ada data inspeksi yang sesuai pada proyek ini.</p>
            </div>
          </td>
        </tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(item => {
      const unsafeCount = (item.checklist || []).filter(c => c.status === 'Tidak Aman').length;
      const amanCount = (item.checklist || []).filter(c => c.status === 'Aman').length;

      let badgeChecklist = `<span class="badge badge-success"><i class="fa-solid fa-check"></i> ${amanCount} Aman</span>`;
      if (unsafeCount > 0) {
        badgeChecklist += ` <span class="badge badge-danger"><i class="fa-solid fa-triangle-exclamation"></i> ${unsafeCount} Tidak Aman</span>`;
      }

      let statusBadge = item.status === 'Selesai'
        ? '<span class="status-badge status-closed">Selesai</span>'
        : (item.status === 'Perlu Tindak Lanjut'
          ? '<span class="status-badge status-open">Perlu Tindak Lanjut</span>'
          : '<span class="status-badge status-progress">Draft</span>');

      return `
        <tr>
          <td><strong class="font-mono">${escapeHtml(item.no)}</strong></td>
          <td>${formatDateIndo(item.tanggal)}</td>
          <td>
            <strong>${escapeHtml(item.area)}</strong><br>
            <span class="text-xs text-muted"><i class="fa-solid fa-location-dot"></i> ${escapeHtml(item.projectLocation || getActiveProject().city)}</span>
          </td>
          <td><span class="badge badge-neutral">${escapeHtml(item.kategori)}</span></td>
          <td>${escapeHtml(item.petugas)}</td>
          <td>${badgeChecklist}</td>
          <td>${statusBadge}</td>
          <td class="text-center">
            <div class="table-actions">
              <button class="btn-table-action" onclick="app.showDetailInspeksi('${item.id}')" title="Lihat Detail Checklist">
                <i class="fa-solid fa-eye"></i>
              </button>
              <button class="btn-table-action" onclick="app.openEditInspeksi('${item.id}')" title="Edit Inspeksi">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button class="btn-table-action delete" onclick="app.confirmDeleteInspeksi('${item.id}')" title="Hapus Inspeksi">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function openModalInspeksi(editId = null) {
    const modal = document.getElementById('modalInspeksi');
    const form = document.getElementById('formInspeksi');
    const title = document.getElementById('modalInspeksiTitle');
    const container = document.getElementById('inspeksiChecklistContainer');
    if (!modal || !form || !container) return;

    form.reset();

    const activeProj = getActiveProject();
    let record = null;
    if (editId) {
      record = state.inspections.find(i => i.id === editId);
    }

    if (record) {
      title.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Edit Data Inspeksi K3';
      document.getElementById('inspeksiId').value = record.id;
      document.getElementById('inspeksiNo').value = record.no;
      document.getElementById('inspeksiTanggal').value = record.tanggal;
      document.getElementById('inspeksiArea').value = record.area;
      document.getElementById('inspeksiKategori').value = record.kategori;
      document.getElementById('inspeksiPetugas').value = record.petugas;
      document.getElementById('inspeksiStatus').value = record.status;
      document.getElementById('inspeksiCatatan').value = record.catatan || '';
    } else {
      title.innerHTML = `<i class="fa-solid fa-clipboard-check"></i> Tambah Inspeksi K3 Baru — [${escapeHtml(activeProj.projectName)}]`;
      document.getElementById('inspeksiId').value = '';
      document.getElementById('inspeksiNo').value = generateNextId('INS', state.inspections);
      document.getElementById('inspeksiTanggal').value = getTodayIsoDate();
      document.getElementById('inspeksiArea').value = '';
      document.getElementById('inspeksiKategori').value = '';
      document.getElementById('inspeksiPetugas').value = activeProj.hseOfficer || 'Zahra Faizatun Najma';
      document.getElementById('inspeksiStatus').value = 'Selesai';
      document.getElementById('inspeksiCatatan').value = '';
    }

    const currentChecklist = record && record.checklist && record.checklist.length > 0
      ? record.checklist
      : STANDARD_CHECKLIST_TEMPLATE;

    container.innerHTML = currentChecklist.map((item, idx) => {
      const isUnsafe = item.status === 'Tidak Aman';
      return `
        <div class="chk-item-card ${isUnsafe ? 'is-unsafe' : ''}" id="chkCard_${item.id}">
          <div class="chk-item-top">
            <span class="chk-item-title">${idx + 1}. ${escapeHtml(item.name)}</span>
            <div class="chk-options-group">
              <label class="chk-option-label opt-aman">
                <input type="radio" name="chk_status_${item.id}" value="Aman" ${item.status === 'Aman' ? 'checked' : ''} onchange="app.handleChecklistChange('${item.id}')"> Aman
              </label>
              <label class="chk-option-label opt-tidak-aman">
                <input type="radio" name="chk_status_${item.id}" value="Tidak Aman" ${item.status === 'Tidak Aman' ? 'checked' : ''} onchange="app.handleChecklistChange('${item.id}')"> Tidak Aman
              </label>
              <label class="chk-option-label opt-na">
                <input type="radio" name="chk_status_${item.id}" value="N/A" ${item.status === 'N/A' ? 'checked' : ''} onchange="app.handleChecklistChange('${item.id}')"> N/A
              </label>
            </div>
          </div>
          <div class="chk-item-note-row">
            <input type="text" class="form-input" id="chkNote_${item.id}" placeholder="Catatan kondisi lapangan / spesifikasi temuan..." value="${escapeHtml(item.note || '')}">
            ${isUnsafe ? `
              <button type="button" class="btn-link-finding" onclick="app.quickCreateFindingFromChecklist('${item.id}', '${escapeHtml(item.name)}')">
                <i class="fa-solid fa-plus"></i> Buat Temuan
              </button>` : ''}
          </div>
        </div>
      `;
    }).join('');

    modal.classList.add('active');
  }

  function handleChecklistChange(itemId) {
    const card = document.getElementById(`chkCard_${itemId}`);
    const selectedRadio = document.querySelector(`input[name="chk_status_${itemId}"]:checked`);
    if (!card || !selectedRadio) return;

    if (selectedRadio.value === 'Tidak Aman') {
      card.classList.add('is-unsafe');
      const noteRow = card.querySelector('.chk-item-note-row');
      if (noteRow && !noteRow.querySelector('.btn-link-finding')) {
        const itemTitle = card.querySelector('.chk-item-title').textContent.replace(/^\d+\.\s*/, '');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn-link-finding';
        btn.innerHTML = '<i class="fa-solid fa-plus"></i> Buat Temuan';
        btn.onclick = () => quickCreateFindingFromChecklist(itemId, itemTitle);
        noteRow.appendChild(btn);
      }
    } else {
      card.classList.remove('is-unsafe');
      const btn = card.querySelector('.btn-link-finding');
      if (btn) btn.remove();
    }
  }

  function quickCreateFindingFromChecklist(chkId, chkName) {
    const inspNo = document.getElementById('inspeksiNo').value;
    const inspArea = document.getElementById('inspeksiArea').value;
    const inspKategori = document.getElementById('inspeksiKategori').value || 'Pengendalian area kerja';
    const noteVal = document.getElementById(`chkNote_${chkId}`)?.value || '';

    closeModal('modalInspeksi');
    openModalTemuan();

    document.getElementById('temuanArea').value = inspArea;
    document.getElementById('temuanKategori').value = inspKategori;
    document.getElementById('temuanDeskripsi').value = `Temuan dari checklist [${chkName}]: ${noteVal}`;
    document.getElementById('temuanRisiko').value = 'Tinggi';
    document.getElementById('temuanRefInspeksi').value = inspNo;

    showToast('Form temuan otomatis diisi dari checklist tidak aman!', 'info');
  }

  function saveInspeksi(e) {
    e.preventDefault();
    const id = document.getElementById('inspeksiId').value;
    const no = document.getElementById('inspeksiNo').value;
    const tanggal = document.getElementById('inspeksiTanggal').value;
    const area = document.getElementById('inspeksiArea').value.trim();
    const kategori = document.getElementById('inspeksiKategori').value;
    const petugas = document.getElementById('inspeksiPetugas').value.trim();
    const status = document.getElementById('inspeksiStatus').value;
    const catatan = document.getElementById('inspeksiCatatan').value.trim();

    if (!tanggal || !area || !kategori || !petugas) {
      showToast('Harap lengkapi semua bidang wajib bertanda *!', 'warning');
      return;
    }

    const checklist = STANDARD_CHECKLIST_TEMPLATE.map(t => {
      const selected = document.querySelector(`input[name="chk_status_${t.id}"]:checked`);
      const noteInput = document.getElementById(`chkNote_${t.id}`);
      return {
        id: t.id,
        name: t.name,
        status: selected ? selected.value : 'Aman',
        note: noteInput ? noteInput.value.trim() : ''
      };
    });

    const activeProj = getActiveProject();

    if (id) {
      const index = state.inspections.findIndex(i => i.id === id);
      if (index !== -1) {
        state.inspections[index] = {
          ...state.inspections[index],
          tanggal,
          area,
          kategori,
          petugas,
          status,
          catatan,
          checklist
        };
        showToast(`Inspeksi ${no} berhasil diperbarui!`, 'success');
      }
    } else {
      // New record stores project location & identity (Requirement 6)
      const newRecord = {
        id: 'ins_' + Date.now(),
        projectId: activeProj.id,
        projectName: activeProj.projectName,
        projectLocation: `${activeProj.city}, ${activeProj.province}`,
        no,
        tanggal,
        area,
        kategori,
        petugas,
        status,
        catatan,
        checklist
      };
      state.inspections.unshift(newRecord);
      showToast(`Inspeksi baru ${no} disimpan pada proyek "${activeProj.projectName}"!`, 'success');
    }

    saveToStorage(STORAGE_KEYS.INSPECTIONS, state.inspections);
    closeModal('modalInspeksi');
    renderAllViews();
  }

  function showDetailInspeksi(id) {
    const item = state.inspections.find(i => i.id === id);
    if (!item) return;

    const content = document.getElementById('detailInspeksiContent');
    if (!content) return;

    let checklistRows = (item.checklist || []).map((c, i) => {
      let badge = c.status === 'Aman'
        ? '<span class="badge badge-success">Aman</span>'
        : (c.status === 'Tidak Aman'
          ? '<span class="badge badge-danger">Tidak Aman</span>'
          : '<span class="badge badge-neutral">N/A</span>');

      return `
        <tr>
          <td>${i + 1}</td>
          <td><strong>${escapeHtml(c.name)}</strong></td>
          <td>${badge}</td>
          <td>${escapeHtml(c.note || '-')}</td>
        </tr>
      `;
    }).join('');

    content.innerHTML = `
      <div class="detail-grid">
        <div class="detail-item">
          <label>Proyek Terkait</label>
          <strong>${escapeHtml(item.projectName || getActiveProject().projectName)}</strong>
        </div>
        <div class="detail-item">
          <label>Lokasi Proyek</label>
          <strong>${escapeHtml(item.projectLocation || getActiveProject().city)}</strong>
        </div>
        <div class="detail-item">
          <label>Nomor Dokumen Inspeksi</label>
          <strong class="font-mono">${escapeHtml(item.no)}</strong>
        </div>
        <div class="detail-item">
          <label>Tanggal Pelaksanaan</label>
          <strong>${formatDateIndo(item.tanggal)}</strong>
        </div>
        <div class="detail-item">
          <label>Area / Lokasi Kerja Spesifik</label>
          <strong>${escapeHtml(item.area)}</strong>
        </div>
        <div class="detail-item">
          <label>Kategori Inspeksi</label>
          <span class="badge badge-neutral">${escapeHtml(item.kategori)}</span>
        </div>
        <div class="detail-item">
          <label>Nama Petugas HSE</label>
          <strong>${escapeHtml(item.petugas)}</strong>
        </div>
        <div class="detail-item">
          <label>Status Inspeksi</label>
          <strong>${escapeHtml(item.status)}</strong>
        </div>
      </div>

      <div class="detail-block">
        <label>Hasil Evaluasi Checklist Lapangan</label>
        <div class="table-responsive">
          <table class="detail-chk-table">
            <thead>
              <tr>
                <th style="width: 40px;">No</th>
                <th>Item Aspek Keselamatan</th>
                <th style="width: 120px;">Kondisi</th>
                <th>Catatan Kondisi Lapangan</th>
              </tr>
            </thead>
            <tbody>
              ${checklistRows}
            </tbody>
          </table>
        </div>
      </div>

      <div class="detail-block">
        <label>Catatan & Rekomendasi Umum Petugas HSE</label>
        <div class="detail-box">
          ${escapeHtml(item.catatan || 'Tidak ada catatan tambahan.')}
        </div>
      </div>
    `;

    openModal('modalDetailInspeksi');
  }

  function confirmDeleteInspeksi(id) {
    const item = state.inspections.find(i => i.id === id);
    if (!item) return;

    openConfirmDialog(
      'Hapus Data Inspeksi K3',
      `Apakah Anda yakin ingin menghapus inspeksi <strong>${item.no}</strong> di area "${item.area}"?`,
      () => {
        state.inspections = state.inspections.filter(i => i.id !== id);
        saveToStorage(STORAGE_KEYS.INSPECTIONS, state.inspections);
        showToast(`Inspeksi ${item.no} telah dihapus!`, 'success');
        renderAllViews();
      }
    );
  }

  // ==========================================================================
  // 3. MODUL PENILAIAN RISIKO (HIRADC 5x5)
  // ==========================================================================
  function calculateRiskScore(l, s) {
    const score = Number(l) * Number(s);
    let level = 'Rendah';
    let badgeClass = 'risk-rendah';

    if (score >= 17) {
      level = 'Ekstrem';
      badgeClass = 'risk-ekstrem';
    } else if (score >= 10) {
      level = 'Tinggi';
      badgeClass = 'risk-tinggi';
    } else if (score >= 5) {
      level = 'Sedang';
      badgeClass = 'risk-sedang';
    } else {
      level = 'Rendah';
      badgeClass = 'risk-rendah';
    }

    return { score, level, badgeClass };
  }

  function updateMatrixCalculatorDisplay() {
    const l = Number(document.getElementById('risikoLikelihood')?.value || 3);
    const s = Number(document.getElementById('risikoSeverity')?.value || 3);
    const { score, level } = calculateRiskScore(l, s);

    const scoreNum = document.getElementById('calcScoreNum');
    const scoreLabel = document.getElementById('calcScoreLabel');
    const scoreBadge = document.getElementById('risikoScoreBadge');

    if (scoreNum) scoreNum.textContent = score;
    if (scoreLabel) scoreLabel.textContent = level;

    if (scoreBadge) {
      scoreBadge.className = 'calc-score-display';
      if (level === 'Ekstrem') {
        scoreBadge.style.backgroundColor = '#fee2e2';
        scoreBadge.style.borderColor = '#fca5a5';
        scoreBadge.style.color = '#991b1b';
      } else if (level === 'Tinggi') {
        scoreBadge.style.backgroundColor = '#ffedd5';
        scoreBadge.style.borderColor = '#fed7aa';
        scoreBadge.style.color = '#9a3412';
      } else if (level === 'Sedang') {
        scoreBadge.style.backgroundColor = '#fef3c7';
        scoreBadge.style.borderColor = '#fde68a';
        scoreBadge.style.color = '#92400e';
      } else {
        scoreBadge.style.backgroundColor = '#d1fae5';
        scoreBadge.style.borderColor = '#a7f3d0';
        scoreBadge.style.color = '#065f46';
      }
    }

    document.querySelectorAll('.mini-matrix-cell').forEach(cell => {
      const cellL = Number(cell.dataset.l);
      const cellS = Number(cell.dataset.s);
      if (cellL === l && cellS === s) {
        cell.classList.add('selected');
      } else {
        cell.classList.remove('selected');
      }
    });
  }

  function renderMiniMatrixGrid() {
    const grid = document.getElementById('miniMatrix5x5');
    if (!grid) return;

    let cellsHtml = '';
    for (let l = 5; l >= 1; l--) {
      for (let s = 1; s <= 5; s++) {
        const { score, level } = calculateRiskScore(l, s);
        let colorClass = 'cell-low';
        if (level === 'Ekstrem') colorClass = 'cell-ext';
        else if (level === 'Tinggi') colorClass = 'cell-high';
        else if (level === 'Sedang') colorClass = 'cell-med';

        cellsHtml += `
          <div class="mini-matrix-cell ${colorClass}" data-l="${l}" data-s="${s}" title="Likelihood ${l} × Severity ${s} = ${score} (${level})">
            ${score}
          </div>
        `;
      }
    }
    grid.innerHTML = cellsHtml;

    grid.querySelectorAll('.mini-matrix-cell').forEach(cell => {
      cell.addEventListener('click', function () {
        const l = this.dataset.l;
        const s = this.dataset.s;
        const lSelect = document.getElementById('risikoLikelihood');
        const sSelect = document.getElementById('risikoSeverity');
        if (lSelect) lSelect.value = l;
        if (sSelect) sSelect.value = s;
        updateMatrixCalculatorDisplay();
      });
    });
  }

  function renderTableRisiko() {
    const tbody = document.getElementById('tableRisikoTbody');
    const infoEl = document.getElementById('tableRisikoFooter');
    if (!tbody) return;

    const curRisks = getProjectRisks();
    const searchTerm = (document.getElementById('filterRisikoSearch')?.value || '').toLowerCase();
    const filterLevel = document.getElementById('filterRisikoLevel')?.value || '';

    let filtered = curRisks.filter(item => {
      const matchSearch = item.no.toLowerCase().includes(searchTerm) ||
        item.aktivitas.toLowerCase().includes(searchTerm) ||
        item.bahaya.toLowerCase().includes(searchTerm) ||
        item.dampak.toLowerCase().includes(searchTerm);
      const matchLevel = !filterLevel || item.level === filterLevel;
      return matchSearch && matchLevel;
    });

    if (infoEl) {
      infoEl.innerHTML = `<span class="text-muted">Menampilkan ${filtered.length} dari ${curRisks.length} penilaian risiko HIRADC pada proyek aktif ini</span>`;
    }

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" class="empty-table-row">
            <div class="empty-state-box">
              <i class="fa-solid fa-triangle-exclamation"></i>
              <p>Tidak ada data penilaian risiko yang cocok pada proyek ini.</p>
            </div>
          </td>
        </tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(item => {
      const riskClass = getRiskBadgeClass(item.level);

      return `
        <tr>
          <td><strong class="font-mono">${escapeHtml(item.no)}</strong></td>
          <td><strong>${escapeHtml(item.aktivitas)}</strong></td>
          <td style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${escapeHtml(item.bahaya)}">
            ${escapeHtml(item.bahaya)}
          </td>
          <td style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${escapeHtml(item.dampak)}">
            ${escapeHtml(item.dampak)}
          </td>
          <td><span class="font-mono">${item.likelihood} × ${item.severity}</span></td>
          <td><span class="risk-badge ${riskClass}">Skor ${item.score}: ${item.level}</span></td>
          <td style="max-width: 220px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${escapeHtml(item.rekomendasi)}">
            ${escapeHtml(item.rekomendasi)}
          </td>
          <td>
            <div style="font-size: 11.5px;">
              <strong>${escapeHtml(item.pic)}</strong><br>
              <span class="text-muted"><i class="fa-regular fa-calendar"></i> ${formatDateIndo(item.target)}</span>
            </div>
          </td>
          <td class="text-center">
            <div class="table-actions">
              <button class="btn-table-action" onclick="app.showDetailRisiko('${item.id}')" title="Lihat Detail HIRADC">
                <i class="fa-solid fa-eye"></i>
              </button>
              <button class="btn-table-action" onclick="app.openEditRisiko('${item.id}')" title="Edit Penilaian Risiko">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button class="btn-table-action delete" onclick="app.confirmDeleteRisiko('${item.id}')" title="Hapus Data">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function openModalRisiko(editId = null) {
    const modal = document.getElementById('modalRisiko');
    const form = document.getElementById('formRisiko');
    const title = document.getElementById('modalRisikoTitle');
    if (!modal || !form) return;

    form.reset();
    renderMiniMatrixGrid();

    const activeProj = getActiveProject();
    let record = null;
    if (editId) {
      record = state.risks.find(r => r.id === editId);
    }

    if (record) {
      title.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Edit Penilaian Risiko HIRADC';
      document.getElementById('risikoId').value = record.id;
      document.getElementById('risikoNo').value = record.no;
      document.getElementById('risikoAktivitas').value = record.aktivitas;
      document.getElementById('risikoBahaya').value = record.bahaya;
      document.getElementById('risikoDampak').value = record.dampak;
      document.getElementById('risikoPengendalianAda').value = record.pengendalianAda || '';
      document.getElementById('risikoLikelihood').value = record.likelihood;
      document.getElementById('risikoSeverity').value = record.severity;
      document.getElementById('risikoPengendalianTambahan').value = record.rekomendasi;
      document.getElementById('risikoPic').value = record.pic;
      document.getElementById('risikoTarget').value = record.target;
    } else {
      title.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Tambah Penilaian Risiko — [${escapeHtml(activeProj.projectName)}]`;
      document.getElementById('risikoId').value = '';
      document.getElementById('risikoNo').value = generateNextId('RA', state.risks);
      document.getElementById('risikoAktivitas').value = '';
      document.getElementById('risikoBahaya').value = '';
      document.getElementById('risikoDampak').value = '';
      document.getElementById('risikoPengendalianAda').value = '';
      document.getElementById('risikoLikelihood').value = 3;
      document.getElementById('risikoSeverity').value = 4;
      document.getElementById('risikoPengendalianTambahan').value = '';
      document.getElementById('risikoPic').value = 'Site Engineer / Pelaksana';
      document.getElementById('risikoTarget').value = getTodayIsoDate();
    }

    updateMatrixCalculatorDisplay();
    modal.classList.add('active');
  }

  function saveRisiko(e) {
    e.preventDefault();
    const id = document.getElementById('risikoId').value;
    const no = document.getElementById('risikoNo').value;
    const aktivitas = document.getElementById('risikoAktivitas').value.trim();
    const bahaya = document.getElementById('risikoBahaya').value.trim();
    const dampak = document.getElementById('risikoDampak').value.trim();
    const pengendalianAda = document.getElementById('risikoPengendalianAda').value.trim();
    const likelihood = Number(document.getElementById('risikoLikelihood').value);
    const severity = Number(document.getElementById('risikoSeverity').value);
    const rekomendasi = document.getElementById('risikoPengendalianTambahan').value.trim();
    const pic = document.getElementById('risikoPic').value.trim();
    const target = document.getElementById('risikoTarget').value;

    if (!aktivitas || !bahaya || !dampak || !rekomendasi || !pic || !target) {
      showToast('Harap lengkapi semua bidang wajib bertanda *!', 'warning');
      return;
    }

    const { score, level } = calculateRiskScore(likelihood, severity);
    const activeProj = getActiveProject();

    if (id) {
      const idx = state.risks.findIndex(r => r.id === id);
      if (idx !== -1) {
        state.risks[idx] = {
          ...state.risks[idx],
          aktivitas,
          bahaya,
          dampak,
          pengendalianAda,
          likelihood,
          severity,
          score,
          level,
          rekomendasi,
          pic,
          target
        };
        showToast(`Penilaian risiko ${no} berhasil diperbarui!`, 'success');
      }
    } else {
      // New record stores project location & identity (Requirement 6)
      const newRec = {
        id: 'ra_' + Date.now(),
        projectId: activeProj.id,
        projectName: activeProj.projectName,
        projectLocation: `${activeProj.city}, ${activeProj.province}`,
        no,
        aktivitas,
        bahaya,
        dampak,
        pengendalianAda,
        likelihood,
        severity,
        score,
        level,
        rekomendasi,
        pic,
        target
      };
      state.risks.unshift(newRec);
      showToast(`Penilaian risiko ${no} berhasil disimpan pada proyek "${activeProj.projectName}"!`, 'success');
    }

    saveToStorage(STORAGE_KEYS.RISKS, state.risks);
    closeModal('modalRisiko');
    renderAllViews();
  }

  function showDetailRisiko(id) {
    const item = state.risks.find(r => r.id === id);
    if (!item) return;

    const content = document.getElementById('detailRisikoContent');
    if (!content) return;

    const riskClass = getRiskBadgeClass(item.level);

    content.innerHTML = `
      <div class="detail-grid">
        <div class="detail-item">
          <label>Proyek Terkait</label>
          <strong>${escapeHtml(item.projectName || getActiveProject().projectName)}</strong>
        </div>
        <div class="detail-item">
          <label>Lokasi Proyek</label>
          <strong>${escapeHtml(item.projectLocation || getActiveProject().city)}</strong>
        </div>
        <div class="detail-item">
          <label>Nomor ID HIRADC</label>
          <strong class="font-mono">${escapeHtml(item.no)}</strong>
        </div>
        <div class="detail-item">
          <label>Tingkat Risiko</label>
          <span class="risk-badge ${riskClass}">Skor ${item.score}: ${item.level}</span>
        </div>
        <div class="detail-item">
          <label>Penanggung Jawab (PIC)</label>
          <strong>${escapeHtml(item.pic)}</strong>
        </div>
        <div class="detail-item">
          <label>Batas Target Penyelesaian</label>
          <strong>${formatDateIndo(item.target)}</strong>
        </div>
      </div>

      <div class="detail-block">
        <label>Aktivitas Pekerjaan Konstruksi</label>
        <div class="detail-box"><strong>${escapeHtml(item.aktivitas)}</strong></div>
      </div>

      <div class="detail-block">
        <label>Identifikasi Potensi Bahaya (Hazard)</label>
        <div class="detail-box">${escapeHtml(item.bahaya)}</div>
      </div>

      <div class="detail-block">
        <label>Konsekuensi / Dampak Kerugian (Impact)</label>
        <div class="detail-box">${escapeHtml(item.dampak)}</div>
      </div>

      <div class="detail-grid mt-3">
        <div class="detail-item">
          <label>Pengendalian Saat Ini (Existing Controls)</label>
          <div>${escapeHtml(item.pengendalianAda || 'Belum ada pengendalian khusus')}</div>
        </div>
        <div class="detail-item">
          <label>Perhitungan Matriks (L × S)</label>
          <div class="font-mono">Likelihood: ${item.likelihood} | Severity: ${item.severity} = <strong>Skor ${item.score}</strong></div>
        </div>
      </div>

      <div class="detail-block mt-3">
        <label>Rekomendasi Pengendalian Tambahan (Hirarki Pengendalian)</label>
        <div class="detail-box" style="border-left: 4px solid var(--primary-blue);">
          ${escapeHtml(item.rekomendasi)}
        </div>
      </div>
    `;

    openModal('modalDetailRisiko');
  }

  function confirmDeleteRisiko(id) {
    const item = state.risks.find(r => r.id === id);
    if (!item) return;

    openConfirmDialog(
      'Hapus Penilaian Risiko',
      `Apakah Anda yakin ingin menghapus penilaian risiko <strong>${item.no}</strong> ("${item.aktivitas}")?`,
      () => {
        state.risks = state.risks.filter(r => r.id !== id);
        saveToStorage(STORAGE_KEYS.RISKS, state.risks);
        showToast(`Penilaian risiko ${item.no} telah dihapus!`, 'success');
        renderAllViews();
      }
    );
  }

  // ==========================================================================
  // 4. MODUL TEMUAN K3 (FINDINGS)
  // ==========================================================================
  function renderTableTemuan() {
    const tbody = document.getElementById('tableTemuanTbody');
    const infoEl = document.getElementById('temuanCountInfo');
    if (!tbody) return;

    const curFindings = getProjectFindings();
    const searchTerm = (document.getElementById('filterTemuanSearch')?.value || '').toLowerCase();
    const filterCat = document.getElementById('filterTemuanCategory')?.value || '';
    const filterRisk = document.getElementById('filterTemuanRisk')?.value || '';
    const filterStat = document.getElementById('filterTemuanStatus')?.value || '';

    let filtered = curFindings.filter(item => {
      const matchSearch = item.no.toLowerCase().includes(searchTerm) ||
        item.area.toLowerCase().includes(searchTerm) ||
        item.deskripsi.toLowerCase().includes(searchTerm);
      const matchCat = !filterCat || item.kategori === filterCat;
      const matchRisk = !filterRisk || item.risiko === filterRisk;
      const matchStat = !filterStat || item.status === filterStat;
      return matchSearch && matchCat && matchRisk && matchStat;
    });

    if (infoEl) {
      infoEl.textContent = `Menampilkan ${filtered.length} dari ${curFindings.length} temuan K3 pada proyek aktif ini`;
    }

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="10" class="empty-table-row">
            <div class="empty-state-box">
              <i class="fa-solid fa-magnifying-glass-chart"></i>
              <p>Tidak ada data temuan K3 yang sesuai kriteria filter pada proyek ini.</p>
            </div>
          </td>
        </tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(item => {
      const riskClass = getRiskBadgeClass(item.risiko);
      const statusClass = getStatusBadgeClass(item.status);

      return `
        <tr>
          <td><strong class="font-mono">${escapeHtml(item.no)}</strong></td>
          <td>${formatDateIndo(item.tanggal)}</td>
          <td>
            <strong>${escapeHtml(item.area)}</strong><br>
            <span class="text-xs text-muted"><i class="fa-solid fa-location-dot"></i> ${escapeHtml(item.projectLocation || getActiveProject().city)}</span>
          </td>
          <td><span class="badge badge-neutral">${escapeHtml(item.kategori)}</span></td>
          <td style="max-width: 220px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${escapeHtml(item.deskripsi)}">
            ${escapeHtml(item.deskripsi)}
          </td>
          <td><span class="risk-badge ${riskClass}">${escapeHtml(item.risiko)}</span></td>
          <td style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${escapeHtml(item.tindakan)}">
            ${escapeHtml(item.tindakan)}
          </td>
          <td>
            <div style="font-size: 11.5px;">
              <strong>${escapeHtml(item.pic)}</strong><br>
              <span class="text-muted"><i class="fa-regular fa-calendar"></i> ${formatDateIndo(item.target)}</span>
            </div>
          </td>
          <td>
            <button class="status-badge ${statusClass}" style="cursor: pointer; border: 1px dashed currentColor;" onclick="app.toggleFindingStatus('${item.id}')" title="Klik untuk mengubah status cepat">
              ${escapeHtml(item.status)}
            </button>
          </td>
          <td class="text-center">
            <div class="table-actions">
              <button class="btn-table-action" onclick="app.showDetailTemuan('${item.id}')" title="Lihat Detail Temuan">
                <i class="fa-solid fa-eye"></i>
              </button>
              <button class="btn-table-action" onclick="app.openEditTemuan('${item.id}')" title="Edit Temuan">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button class="btn-table-action delete" onclick="app.confirmDeleteTemuan('${item.id}')" title="Hapus Temuan">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function populateInspectionReferenceDropdown(selectedRef = '') {
    const sel = document.getElementById('temuanRefInspeksi');
    if (!sel) return;

    const curInspections = getProjectInspections();
    let options = '<option value="">-- Tidak Terhubung / Mandiri --</option>';
    curInspections.forEach(ins => {
      const isSel = ins.no === selectedRef ? 'selected' : '';
      options += `<option value="${escapeHtml(ins.no)}" ${isSel}>${escapeHtml(ins.no)} - ${escapeHtml(ins.area)}</option>`;
    });
    sel.innerHTML = options;
  }

  function openModalTemuan(editId = null) {
    const modal = document.getElementById('modalTemuan');
    const form = document.getElementById('formTemuan');
    const title = document.getElementById('modalTemuanTitle');
    if (!modal || !form) return;

    form.reset();

    const activeProj = getActiveProject();
    let record = null;
    if (editId) {
      record = state.findings.find(f => f.id === editId);
    }

    populateInspectionReferenceDropdown(record ? record.refInspeksi : '');

    if (record) {
      title.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Edit Temuan K3 Lapangan';
      document.getElementById('temuanId').value = record.id;
      document.getElementById('temuanNo').value = record.no;
      document.getElementById('temuanTanggal').value = record.tanggal;
      document.getElementById('temuanArea').value = record.area;
      document.getElementById('temuanKategori').value = record.kategori;
      document.getElementById('temuanJenis').value = record.jenis || 'Kondisi Tidak Aman (Unsafe Condition)';
      document.getElementById('temuanRisiko').value = record.risiko;
      document.getElementById('temuanDeskripsi').value = record.deskripsi;
      document.getElementById('temuanTindakan').value = record.tindakan;
      document.getElementById('temuanPic').value = record.pic;
      document.getElementById('temuanTarget').value = record.target;
      document.getElementById('temuanStatus').value = record.status;
      document.getElementById('temuanRefInspeksi').value = record.refInspeksi || '';
      document.getElementById('temuanCatatanSelesai').value = record.catatanSelesai || '';
    } else {
      title.innerHTML = `<i class="fa-solid fa-magnifying-glass-chart"></i> Catat Temuan K3 — [${escapeHtml(activeProj.projectName)}]`;
      document.getElementById('temuanId').value = '';
      document.getElementById('temuanNo').value = generateNextId('FND', state.findings);
      document.getElementById('temuanTanggal').value = getTodayIsoDate();
      document.getElementById('temuanArea').value = '';
      document.getElementById('temuanKategori').value = '';
      document.getElementById('temuanJenis').value = 'Kondisi Tidak Aman (Unsafe Condition)';
      document.getElementById('temuanRisiko').value = 'Tinggi';
      document.getElementById('temuanDeskripsi').value = '';
      document.getElementById('temuanTindakan').value = '';
      document.getElementById('temuanPic').value = 'Mandor & Pelaksana Lapangan';
      document.getElementById('temuanTarget').value = getTodayIsoDate();
      document.getElementById('temuanStatus').value = 'Open';
      document.getElementById('temuanCatatanSelesai').value = '';
    }

    modal.classList.add('active');
  }

  function saveTemuan(e) {
    e.preventDefault();
    const id = document.getElementById('temuanId').value;
    const no = document.getElementById('temuanNo').value;
    const tanggal = document.getElementById('temuanTanggal').value;
    const area = document.getElementById('temuanArea').value.trim();
    const kategori = document.getElementById('temuanKategori').value;
    const jenis = document.getElementById('temuanJenis').value;
    const risiko = document.getElementById('temuanRisiko').value;
    const deskripsi = document.getElementById('temuanDeskripsi').value.trim();
    const tindakan = document.getElementById('temuanTindakan').value.trim();
    const pic = document.getElementById('temuanPic').value.trim();
    const target = document.getElementById('temuanTarget').value;
    const status = document.getElementById('temuanStatus').value;
    const refInspeksi = document.getElementById('temuanRefInspeksi').value;
    const catatanSelesai = document.getElementById('temuanCatatanSelesai').value.trim();

    if (!tanggal || !area || !kategori || !deskripsi || !tindakan || !pic || !target) {
      showToast('Harap lengkapi semua bidang wajib bertanda *!', 'warning');
      return;
    }

    const activeProj = getActiveProject();

    if (id) {
      const idx = state.findings.findIndex(f => f.id === id);
      if (idx !== -1) {
        state.findings[idx] = {
          ...state.findings[idx],
          tanggal,
          area,
          kategori,
          jenis,
          risiko,
          deskripsi,
          tindakan,
          pic,
          target,
          status,
          refInspeksi,
          catatanSelesai
        };
        showToast(`Temuan K3 ${no} berhasil diperbarui!`, 'success');
      }
    } else {
      // New record stores project location & identity (Requirement 6)
      const newRec = {
        id: 'fnd_' + Date.now(),
        projectId: activeProj.id,
        projectName: activeProj.projectName,
        projectLocation: `${activeProj.city}, ${activeProj.province}`,
        no,
        tanggal,
        area,
        kategori,
        jenis,
        risiko,
        deskripsi,
        tindakan,
        pic,
        target,
        status,
        refInspeksi,
        catatanSelesai
      };
      state.findings.unshift(newRec);
      showToast(`Temuan K3 baru ${no} dicatat pada proyek "${activeProj.projectName}"!`, 'success');
    }

    saveToStorage(STORAGE_KEYS.FINDINGS, state.findings);
    closeModal('modalTemuan');
    renderAllViews();
  }

  function toggleFindingStatus(id) {
    const item = state.findings.find(f => f.id === id);
    if (!item) return;

    if (item.status === 'Open') {
      item.status = 'In Progress';
    } else if (item.status === 'In Progress') {
      item.status = 'Closed';
      if (!item.catatanSelesai) {
        item.catatanSelesai = `Telah diselesaikan dan diverifikasi oleh HSE pada ${getTodayIsoDate()}`;
      }
    } else {
      item.status = 'Open';
    }

    saveToStorage(STORAGE_KEYS.FINDINGS, state.findings);
    showToast(`Status temuan ${item.no} diubah menjadi "${item.status}"`, 'info');
    renderAllViews();
  }

  function showDetailTemuan(id) {
    const item = state.findings.find(f => f.id === id);
    if (!item) return;

    const content = document.getElementById('detailTemuanContent');
    if (!content) return;

    const riskClass = getRiskBadgeClass(item.risiko);
    const statusClass = getStatusBadgeClass(item.status);

    content.innerHTML = `
      <div class="detail-grid">
        <div class="detail-item">
          <label>Proyek Terkait</label>
          <strong>${escapeHtml(item.projectName || getActiveProject().projectName)}</strong>
        </div>
        <div class="detail-item">
          <label>Lokasi Proyek</label>
          <strong>${escapeHtml(item.projectLocation || getActiveProject().city)}</strong>
        </div>
        <div class="detail-item">
          <label>Nomor Temuan</label>
          <strong class="font-mono">${escapeHtml(item.no)}</strong>
        </div>
        <div class="detail-item">
          <label>Tanggal Ditemukan</label>
          <strong>${formatDateIndo(item.tanggal)}</strong>
        </div>
        <div class="detail-item">
          <label>Area / Lokasi Kerja</label>
          <strong>${escapeHtml(item.area)}</strong>
        </div>
        <div class="detail-item">
          <label>Kategori Bahaya</label>
          <span class="badge badge-neutral">${escapeHtml(item.kategori)}</span>
        </div>
        <div class="detail-item">
          <label>Jenis Temuan</label>
          <strong>${escapeHtml(item.jenis || 'Kondisi Tidak Aman')}</strong>
        </div>
        <div class="detail-item">
          <label>Tingkat Risiko</label>
          <span class="risk-badge ${riskClass}">${escapeHtml(item.risiko)}</span>
        </div>
        <div class="detail-item">
          <label>Status Saat Ini</label>
          <span class="status-badge ${statusClass}">${escapeHtml(item.status)}</span>
        </div>
        <div class="detail-item">
          <label>Terkait Dokumen Inspeksi</label>
          <strong>${escapeHtml(item.refInspeksi || 'Pencatatan Temuan Mandiri')}</strong>
        </div>
      </div>

      <div class="detail-block">
        <label>Uraian Deskripsi Temuan Lapangan</label>
        <div class="detail-box">${escapeHtml(item.deskripsi)}</div>
      </div>

      <div class="detail-block">
        <label>Rekomendasi Tindakan Korektif (Corrective Action)</label>
        <div class="detail-box" style="border-left: 4px solid var(--primary-blue);">
          ${escapeHtml(item.tindakan)}
        </div>
      </div>

      <div class="detail-grid mt-3">
        <div class="detail-item">
          <label>Penanggung Jawab Perbaikan (PIC)</label>
          <strong>${escapeHtml(item.pic)}</strong>
        </div>
        <div class="detail-item">
          <label>Target Tanggal Selesai</label>
          <strong>${formatDateIndo(item.target)}</strong>
        </div>
      </div>

      ${item.catatanSelesai ? `
        <div class="detail-block mt-3">
          <label>Catatan Penyelesaian & Verifikasi HSE</label>
          <div class="detail-box" style="border-left: 4px solid var(--accent-green); background-color: var(--accent-green-light);">
            ${escapeHtml(item.catatanSelesai)}
          </div>
        </div>
      ` : ''}
    `;

    openModal('modalDetailTemuan');
  }

  function confirmDeleteTemuan(id) {
    const item = state.findings.find(f => f.id === id);
    if (!item) return;

    openConfirmDialog(
      'Hapus Temuan K3',
      `Apakah Anda yakin ingin menghapus data temuan <strong>${item.no}</strong> di area "${item.area}"?`,
      () => {
        state.findings = state.findings.filter(f => f.id !== id);
        saveToStorage(STORAGE_KEYS.FINDINGS, state.findings);
        showToast(`Temuan ${item.no} telah dihapus!`, 'success');
        renderAllViews();
      }
    );
  }

  // ==========================================================================
  // 5. MODUL LAPORAN & REKAPITULASI (ISOLATED TO ACTIVE PROJECT)
  // ==========================================================================
  function renderReportView() {
    const curFindings = getProjectFindings();
    const curInspections = getProjectInspections();

    const startDate = document.getElementById('reportStartDate')?.value || '';
    const endDate = document.getElementById('reportEndDate')?.value || '';
    const filterStatus = document.getElementById('reportFilterStatus')?.value || '';

    const filteredFindings = curFindings.filter(item => {
      let matchDate = true;
      if (startDate && item.tanggal < startDate) matchDate = false;
      if (endDate && item.tanggal > endDate) matchDate = false;
      let matchStatus = true;
      if (filterStatus && item.status !== filterStatus) matchStatus = false;
      return matchDate && matchStatus;
    });

    const filteredInspections = curInspections.filter(item => {
      let matchDate = true;
      if (startDate && item.tanggal < startDate) matchDate = false;
      if (endDate && item.tanggal > endDate) matchDate = false;
      return matchDate;
    });

    const totalIns = filteredInspections.length;
    const totalFind = filteredFindings.length;
    const closedFind = filteredFindings.filter(f => f.status === 'Closed').length;
    const resRate = totalFind > 0 ? Math.round((closedFind / totalFind) * 100) : 100;
    const highExtCount = filteredFindings.filter(f => f.risiko === 'Tinggi' || f.risiko === 'Ekstrem').length;

    const repIns = document.getElementById('repTotalInspeksi');
    const repFind = document.getElementById('repTotalTemuan');
    const repRate = document.getElementById('repResolutionRate');
    const repClosed = document.getElementById('repClosedCount');
    const repHighExt = document.getElementById('repHighExtremeCount');

    if (repIns) repIns.textContent = totalIns;
    if (repFind) repFind.textContent = totalFind;
    if (repRate) repRate.textContent = `${resRate}%`;
    if (repClosed) repClosed.textContent = `${closedFind} temuan terselesaikan`;
    if (repHighExt) repHighExt.textContent = highExtCount;

    renderReportCategoryBars(filteredFindings);
    renderReportRiskBars(filteredFindings);
    renderReportOpenFindings(filteredFindings);
  }

  function renderReportCategoryBars(findings) {
    const container = document.getElementById('repCategoryBreakdown');
    if (!container) return;

    const categories = [
      { name: 'Penggunaan APD', color: '#3b82f6' },
      { name: 'Housekeeping', color: '#10b981' },
      { name: 'Perancah dan akses kerja', color: '#f59e0b' },
      { name: 'Instalasi listrik', color: '#ef4444' },
      { name: 'Alat dan mesin', color: '#8b5cf6' },
      { name: 'Pengendalian area kerja', color: '#06b6d4' },
      { name: 'Rambu dan pengamanan lokasi', color: '#64748b' }
    ];

    const total = findings.length;

    container.innerHTML = categories.map(cat => {
      const count = findings.filter(f => f.kategori === cat.name).length;
      const pct = total > 0 ? Math.round((count / total) * 100) : 0;

      return `
        <div class="breakdown-row">
          <div class="breakdown-labels">
            <span>${escapeHtml(cat.name)}</span>
            <strong>${count} (${pct}%)</strong>
          </div>
          <div class="breakdown-bar-wrap">
            <div class="breakdown-bar-fill" style="width: ${pct}%; background-color: ${cat.color};"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderReportRiskBars(findings) {
    const container = document.getElementById('repRiskBreakdown');
    if (!container) return;

    const risks = [
      { name: 'Rendah', color: '#10b981' },
      { name: 'Sedang', color: '#f59e0b' },
      { name: 'Tinggi', color: '#ea580c' },
      { name: 'Ekstrem', color: '#dc2626' }
    ];

    const total = findings.length;

    container.innerHTML = risks.map(r => {
      const count = findings.filter(f => f.risiko === r.name).length;
      const pct = total > 0 ? Math.round((count / total) * 100) : 0;

      return `
        <div class="breakdown-row">
          <div class="breakdown-labels">
            <span class="risk-badge ${getRiskBadgeClass(r.name)}">${escapeHtml(r.name)}</span>
            <strong>${count} temuan (${pct}%)</strong>
          </div>
          <div class="breakdown-bar-wrap">
            <div class="breakdown-bar-fill" style="width: ${pct}%; background-color: ${r.color};"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderReportOpenFindings(findings) {
    const tbody = document.getElementById('repOpenFindingsTbody');
    if (!tbody) return;

    const openItems = findings.filter(f => f.status === 'Open' || f.status === 'In Progress');

    if (openItems.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="10" class="empty-table-row">
            <div class="empty-state-box">
              <i class="fa-solid fa-circle-check text-success"></i>
              <p>Hebat! Tidak ada temuan yang terbuka pada periode ini. Semua temuan K3 telah diselesaikan.</p>
            </div>
          </td>
        </tr>`;
      return;
    }

    tbody.innerHTML = openItems.map(item => {
      const riskClass = getRiskBadgeClass(item.risiko);
      const statusClass = getStatusBadgeClass(item.status);

      return `
        <tr>
          <td><strong class="font-mono">${escapeHtml(item.no)}</strong></td>
          <td>${formatDateIndo(item.tanggal)}</td>
          <td><strong>${escapeHtml(item.area)}</strong></td>
          <td><span class="badge badge-neutral">${escapeHtml(item.kategori)}</span></td>
          <td style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${escapeHtml(item.deskripsi)}">
            ${escapeHtml(item.deskripsi)}
          </td>
          <td><span class="risk-badge ${riskClass}">${escapeHtml(item.risiko)}</span></td>
          <td style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${escapeHtml(item.tindakan)}">
            ${escapeHtml(item.tindakan)}
          </td>
          <td>${escapeHtml(item.pic)}</td>
          <td><strong class="text-danger">${formatDateIndo(item.target)}</strong></td>
          <td><span class="status-badge ${statusClass}">${escapeHtml(item.status)}</span></td>
        </tr>
      `;
    }).join('');
  }

  // --- CSV EXPORT FUNCTIONS ---
  function exportToCsv(filename, headers, rows) {
    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      let str = String(val).replaceAll('"', '""');
      return `"${str}"`;
    };

    let csvContent = '\uFEFF';
    csvContent += headers.map(escapeCsv).join(';') + '\r\n';

    rows.forEach(row => {
      csvContent += row.map(escapeCsv).join(';') + '\r\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Berkas ${filename} berhasil diunduh!`, 'success');
  }

  function exportInspeksiCsv() {
    const curIns = getProjectInspections();
    const activeProj = getActiveProject();
    const headers = ['Nomor Inspeksi', 'Nama Proyek', 'Lokasi Proyek', 'Tanggal', 'Area Kerja', 'Kategori', 'Petugas HSE', 'Status', 'Catatan & Rekomendasi'];
    const rows = curIns.map(i => [
      i.no,
      i.projectName || activeProj.projectName,
      i.projectLocation || `${activeProj.city}, ${activeProj.province}`,
      i.tanggal,
      i.area,
      i.kategori,
      i.petugas,
      i.status,
      i.catatan || ''
    ]);
    exportToCsv(`SAFEWORK_HSE_Inspeksi_${activeProj.projectType}_${getTodayIsoDate()}.csv`, headers, rows);
  }

  function exportRisikoCsv() {
    const curRisks = getProjectRisks();
    const activeProj = getActiveProject();
    const headers = ['Nomor ID', 'Nama Proyek', 'Lokasi Proyek', 'Aktivitas Pekerjaan', 'Potensi Bahaya', 'Konsekuensi/Dampak', 'Pengendalian Ada', 'Likelihood (L)', 'Severity (S)', 'Skor Risiko', 'Tingkat Risiko', 'Rekomendasi Pengendalian', 'PIC', 'Target Penyelesaian'];
    const rows = curRisks.map(r => [
      r.no,
      r.projectName || activeProj.projectName,
      r.projectLocation || `${activeProj.city}, ${activeProj.province}`,
      r.aktivitas,
      r.bahaya,
      r.dampak,
      r.pengendalianAda || '',
      r.likelihood,
      r.severity,
      r.score,
      r.level,
      r.rekomendasi,
      r.pic,
      r.target
    ]);
    exportToCsv(`SAFEWORK_HSE_HIRADC_${activeProj.projectType}_${getTodayIsoDate()}.csv`, headers, rows);
  }

  function exportTemuanCsv() {
    const curFindings = getProjectFindings();
    const activeProj = getActiveProject();
    const headers = ['Nomor Temuan', 'Nama Proyek', 'Lokasi Proyek', 'Tanggal', 'Area Lokasi', 'Kategori', 'Jenis Temuan', 'Tingkat Risiko', 'Deskripsi Bahaya', 'Rekomendasi Korektif', 'PIC', 'Target Selesai', 'Status', 'Ref Inspeksi', 'Catatan Penyelesaian'];
    const rows = curFindings.map(f => [
      f.no,
      f.projectName || activeProj.projectName,
      f.projectLocation || `${activeProj.city}, ${activeProj.province}`,
      f.tanggal,
      f.area,
      f.kategori,
      f.jenis || '',
      f.risiko,
      f.deskripsi,
      f.tindakan,
      f.pic,
      f.target,
      f.status,
      f.refInspeksi || '',
      f.catatanSelesai || ''
    ]);
    exportToCsv(`SAFEWORK_HSE_Temuan_${activeProj.projectType}_${getTodayIsoDate()}.csv`, headers, rows);
  }

  function exportAllCsv() {
    exportInspeksiCsv();
    setTimeout(exportRisikoCsv, 400);
    setTimeout(exportTemuanCsv, 800);
  }

  // ==========================================================================
  // 6. BACKUP & RESTORE JSON
  // ==========================================================================
  function backupJson() {
    const backupData = {
      app: 'SAFEWORK HSE',
      version: '1.1.0',
      timestamp: new Date().toISOString(),
      activeProjectId: state.activeProjectId,
      projects: state.projects,
      inspections: state.inspections,
      risks: state.risks,
      findings: state.findings
    };

    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SAFEWORK_HSE_All_Projects_Backup_${getTodayIsoDate()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Cadangan seluruh proyek & data berhasil diunduh!', 'success');
  }

  function restoreJsonFile(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const parsed = JSON.parse(e.target.result);
        if (parsed.inspections && parsed.risks && parsed.findings) {
          if (parsed.projects && Array.isArray(parsed.projects)) {
            state.projects = parsed.projects;
            state.activeProjectId = parsed.activeProjectId || state.projects[0].id;
          } else if (parsed.settings) {
            // Convert single setting to project
            state.projects = [{
              ...DEFAULT_PROJECTS[0],
              ...parsed.settings
            }];
            state.activeProjectId = state.projects[0].id;
          }

          state.inspections = parsed.inspections;
          state.risks = parsed.risks;
          state.findings = parsed.findings;

          saveToStorage(STORAGE_KEYS.PROJECTS, state.projects);
          saveToStorage(STORAGE_KEYS.ACTIVE_PROJECT_ID, state.activeProjectId);
          saveToStorage(STORAGE_KEYS.INSPECTIONS, state.inspections);
          saveToStorage(STORAGE_KEYS.RISKS, state.risks);
          saveToStorage(STORAGE_KEYS.FINDINGS, state.findings);

          applySettingsToUI();
          renderAllViews();
          showToast('Data berhasil dipulihkan dari berkas cadangan JSON!', 'success');
        } else {
          showToast('Format berkas cadangan tidak valid!', 'error');
        }
      } catch (err) {
        console.error('Error parse JSON:', err);
        showToast('Gagal memproses berkas JSON! Pastikan format berkas benar.', 'error');
      }
    };
    reader.readAsText(file);
  }

  function resetToDemoData() {
    openConfirmDialog(
      'Reset ke Data Demo Awal',
      'Apakah Anda yakin ingin memulihkan seluruh proyek bawaan (Proyek Gedung Mandiri Tower & Proyek Jembatan Akses Bandara YIA) beserta seluruh data contoh realistisnya?',
      () => {
        state.projects = JSON.parse(JSON.stringify(DEFAULT_PROJECTS));
        state.activeProjectId = DEFAULT_PROJECTS[0].id;
        state.inspections = JSON.parse(JSON.stringify(DEFAULT_INSPECTIONS));
        state.risks = JSON.parse(JSON.stringify(DEFAULT_RISKS));
        state.findings = JSON.parse(JSON.stringify(DEFAULT_FINDINGS));

        saveToStorage(STORAGE_KEYS.PROJECTS, state.projects);
        saveToStorage(STORAGE_KEYS.ACTIVE_PROJECT_ID, state.activeProjectId);
        saveToStorage(STORAGE_KEYS.INSPECTIONS, state.inspections);
        saveToStorage(STORAGE_KEYS.RISKS, state.risks);
        saveToStorage(STORAGE_KEYS.FINDINGS, state.findings);

        applySettingsToUI();
        renderAllViews();
        showToast('Data demo proyek gedung & jembatan berhasil dipulihkan!', 'success');
      }
    );
  }

  // ==========================================================================
  // CONFIRMATION DIALOG HELPER
  // ==========================================================================
  function openConfirmDialog(title, message, onConfirm) {
    const modal = document.getElementById('modalConfirm');
    const titleEl = document.getElementById('confirmModalTitle');
    const msgEl = document.getElementById('confirmModalMessage');
    const okBtn = document.getElementById('btnOkConfirm');

    if (!modal || !titleEl || !msgEl || !okBtn) return;

    titleEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-danger"></i> ${title}`;
    msgEl.innerHTML = message;
    state.pendingAction = onConfirm;

    modal.classList.add('active');
  }

  // ==========================================================================
  // TOAST NOTIFICATIONS
  // ==========================================================================
  function showToast(message, type = 'info', duration = 3500) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const iconMap = {
      success: 'fa-solid fa-circle-check',
      error: 'fa-solid fa-circle-xmark',
      warning: 'fa-solid fa-triangle-exclamation',
      info: 'fa-solid fa-circle-info'
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <i class="${iconMap[type] || iconMap.info}"></i>
      <span>${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOutToast 0.3s forwards';
      setTimeout(() => {
        if (toast.parentElement) toast.parentElement.removeChild(toast);
      }, 300);
    }, duration);
  }

  // ==========================================================================
  // UTILITY HELPERS
  // ==========================================================================
  function getTodayIsoDate() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function formatDateIndo(dateStr) {
    if (!dateStr) return '-';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        const d = parseInt(parts[2], 10);
        const m = months[parseInt(parts[1], 10) - 1];
        const y = parts[0];
        return `${d} ${m} ${y}`;
      }
      return dateStr;
    } catch (e) {
      return dateStr;
    }
  }

  function generateNextId(prefix, list) {
    const year = new Date().getFullYear();
    let maxNum = 0;
    const regex = new RegExp(`^${prefix}-\\d{4}-(\\d+)$`);

    list.forEach(item => {
      const match = (item.no || '').match(regex);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });

    const next = String(maxNum + 1).padStart(3, '0');
    return `${prefix}-${year}-${next}`;
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function getRiskBadgeClass(level) {
    switch (level) {
      case 'Ekstrem': return 'risk-ekstrem';
      case 'Tinggi': return 'risk-tinggi';
      case 'Sedang': return 'risk-sedang';
      default: return 'risk-rendah';
    }
  }

  function getStatusBadgeClass(status) {
    switch (status) {
      case 'Closed': return 'status-closed';
      case 'In Progress': return 'status-progress';
      default: return 'status-open';
    }
  }

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  }

  // ==========================================================================
  // EVENT LISTENERS REGISTRATION
  // ==========================================================================
  function setupEventListeners() {
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && hash !== state.currentPage) {
        navigateTo(hash);
      }
    });

    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const page = this.dataset.page;
        if (page) navigateTo(page);
      });
    });

    const btnToggle = document.getElementById('btnToggleMenu');
    const btnClose = document.getElementById('btnCloseSidebar');
    const overlay = document.getElementById('sidebarOverlay');

    if (btnToggle) btnToggle.addEventListener('click', openMobileSidebar);
    if (btnClose) btnClose.addEventListener('click', closeMobileSidebar);
    if (overlay) overlay.addEventListener('click', closeMobileSidebar);

    // Sidebar project pill click
    const sidePill = document.getElementById('sidebarProjectPill');
    if (sidePill) {
      sidePill.addEventListener('click', openProjectSwitchModal);
    }

    // Header Project Quick Switcher
    const headerProjSelect = document.getElementById('headerProjectSelector');
    if (headerProjSelect) {
      headerProjSelect.addEventListener('change', function () {
        switchProject(this.value);
      });
    }

    const btnHeaderNewProj = document.getElementById('btnHeaderNewProject');
    if (btnHeaderNewProj) {
      btnHeaderNewProj.addEventListener('click', openModalNewProject);
    }

    const btnDashSwitch = document.getElementById('btnDashSwitchProject');
    if (btnDashSwitch) {
      btnDashSwitch.addEventListener('click', openProjectSwitchModal);
    }

    const btnQuick = document.getElementById('btnQuickAddFinding');
    if (btnQuick) {
      btnQuick.addEventListener('click', () => {
        openModalTemuan();
      });
    }

    // Modal Close Buttons
    document.querySelectorAll('.btn-modal-close, .modal-footer .btn-secondary').forEach(btn => {
      btn.addEventListener('click', function () {
        const modal = this.closest('.modal-overlay');
        if (modal) modal.classList.remove('active');
      });
    });

    const btnCloseSwitchBtn = document.getElementById('btnCloseModalSwitchBtn');
    if (btnCloseSwitchBtn) {
      btnCloseSwitchBtn.addEventListener('click', () => closeModal('modalSwitchProject'));
    }

    // Confirm Dialog OK
    const btnOkConfirm = document.getElementById('btnOkConfirm');
    if (btnOkConfirm) {
      btnOkConfirm.addEventListener('click', () => {
        if (typeof state.pendingAction === 'function') {
          state.pendingAction();
          state.pendingAction = null;
        }
        closeModal('modalConfirm');
      });
    }

    // --- PROJECT SETTINGS FORM (REQUIREMENT 1, 2, 7) ---
    const formSettings = document.getElementById('formSettings');
    if (formSettings) formSettings.addEventListener('submit', handleSaveProjectSettings);

    const btnResetSettings = document.getElementById('btnResetSettings');
    if (btnResetSettings) btnResetSettings.addEventListener('click', applySettingsToUI);

    const btnOpenNewProj = document.getElementById('btnOpenModalNewProject');
    if (btnOpenNewProj) btnOpenNewProj.addEventListener('click', openModalNewProject);

    const btnSwitchAddNew = document.getElementById('btnSwitchAddNew');
    if (btnSwitchAddNew) {
      btnSwitchAddNew.addEventListener('click', () => {
        closeModal('modalSwitchProject');
        openModalNewProject();
      });
    }

    const formNewProject = document.getElementById('formNewProject');
    if (formNewProject) formNewProject.addEventListener('submit', handleSaveNewProject);

    const btnCancelNewProject = document.getElementById('btnCancelNewProject');
    if (btnCancelNewProject) {
      btnCancelNewProject.addEventListener('click', () => closeModal('modalNewProject'));
    }

    // --- INSPEKSI MODULE EVENTS ---
    const btnOpenInspeksi = document.getElementById('btnOpenModalInspeksi');
    if (btnOpenInspeksi) btnOpenInspeksi.addEventListener('click', () => openModalInspeksi());

    const formInspeksi = document.getElementById('formInspeksi');
    if (formInspeksi) formInspeksi.addEventListener('submit', saveInspeksi);

    const filterInsSearch = document.getElementById('filterInspeksiSearch');
    const filterInsCat = document.getElementById('filterInspeksiCategory');
    const filterInsStat = document.getElementById('filterInspeksiStatus');

    if (filterInsSearch) filterInsSearch.addEventListener('input', renderTableInspeksi);
    if (filterInsCat) filterInsCat.addEventListener('change', renderTableInspeksi);
    if (filterInsStat) filterInsStat.addEventListener('change', renderTableInspeksi);

    // --- RISIKO MODULE EVENTS ---
    const btnOpenRisiko = document.getElementById('btnOpenModalRisiko');
    if (btnOpenRisiko) btnOpenRisiko.addEventListener('click', () => openModalRisiko());

    const formRisiko = document.getElementById('formRisiko');
    if (formRisiko) formRisiko.addEventListener('submit', saveRisiko);

    const filterRisikoSearch = document.getElementById('filterRisikoSearch');
    const filterRisikoLevel = document.getElementById('filterRisikoLevel');

    if (filterRisikoSearch) filterRisikoSearch.addEventListener('input', renderTableRisiko);
    if (filterRisikoLevel) filterRisikoLevel.addEventListener('change', renderTableRisiko);

    const lSelect = document.getElementById('risikoLikelihood');
    const sSelect = document.getElementById('risikoSeverity');
    if (lSelect) lSelect.addEventListener('change', updateMatrixCalculatorDisplay);
    if (sSelect) sSelect.addEventListener('change', updateMatrixCalculatorDisplay);

    const btnMatrixGuide = document.getElementById('btnShowMatrixModal');
    if (btnMatrixGuide) {
      btnMatrixGuide.addEventListener('click', () => openModal('modalMatrixGuide'));
    }

    // --- TEMUAN MODULE EVENTS ---
    const btnOpenTemuan = document.getElementById('btnOpenModalTemuan');
    if (btnOpenTemuan) btnOpenTemuan.addEventListener('click', () => openModalTemuan());

    const formTemuan = document.getElementById('formTemuan');
    if (formTemuan) formTemuan.addEventListener('submit', saveTemuan);

    const filterTemSearch = document.getElementById('filterTemuanSearch');
    const filterTemCat = document.getElementById('filterTemuanCategory');
    const filterTemRisk = document.getElementById('filterTemuanRisk');
    const filterTemStat = document.getElementById('filterTemuanStatus');

    if (filterTemSearch) filterTemSearch.addEventListener('input', renderTableTemuan);
    if (filterTemCat) filterTemCat.addEventListener('change', renderTableTemuan);
    if (filterTemRisk) filterTemRisk.addEventListener('change', renderTableTemuan);
    if (filterTemStat) filterTemStat.addEventListener('change', renderTableTemuan);

    // --- LAPORAN MODULE EVENTS ---
    const btnApplyFilter = document.getElementById('btnApplyReportFilter');
    const btnResetFilter = document.getElementById('btnResetReportFilter');

    if (btnApplyFilter) btnApplyFilter.addEventListener('click', renderReportView);
    if (btnResetFilter) {
      btnResetFilter.addEventListener('click', () => {
        const s = document.getElementById('reportStartDate');
        const e = document.getElementById('reportEndDate');
        const st = document.getElementById('reportFilterStatus');
        if (s) s.value = '';
        if (e) e.value = '';
        if (st) st.value = '';
        renderReportView();
      });
    }

    const btnPrint = document.getElementById('btnPrintReport');
    if (btnPrint) {
      btnPrint.addEventListener('click', () => {
        window.print();
      });
    }

    // CSV Dropdown Menu
    const btnExportToggle = document.getElementById('btnExportMenuToggle');
    const exportDropdown = document.getElementById('dropdownCsvMenu');

    if (btnExportToggle && exportDropdown) {
      btnExportToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        exportDropdown.classList.toggle('show');
      });

      document.addEventListener('click', () => {
        exportDropdown.classList.remove('show');
      });
    }

    const btnExpIns = document.getElementById('btnExportInspeksiCsv');
    const btnExpRis = document.getElementById('btnExportRisikoCsv');
    const btnExpTem = document.getElementById('btnExportTemuanCsv');
    const btnExpAll = document.getElementById('btnExportAllCsv');

    if (btnExpIns) btnExpIns.addEventListener('click', exportInspeksiCsv);
    if (btnExpRis) btnExpRis.addEventListener('click', exportRisikoCsv);
    if (btnExpTem) btnExpTem.addEventListener('click', exportTemuanCsv);
    if (btnExpAll) btnExpAll.addEventListener('click', exportAllCsv);

    const btnResetDemoLaporan = document.getElementById('btnResetDataDemo');
    if (btnResetDemoLaporan) btnResetDemoLaporan.addEventListener('click', resetToDemoData);

    // Backup & Restore
    const btnBackup = document.getElementById('btnBackupJson');
    if (btnBackup) btnBackup.addEventListener('click', backupJson);

    const btnTriggerRestore = document.getElementById('btnTriggerRestore');
    const inputRestore = document.getElementById('inputRestoreJson');

    if (btnTriggerRestore && inputRestore) {
      btnTriggerRestore.addEventListener('click', () => inputRestore.click());
      inputRestore.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          restoreJsonFile(e.target.files[0]);
          e.target.value = '';
        }
      });
    }

    const btnResetDemoSettings = document.getElementById('btnResetDemoSettings');
    if (btnResetDemoSettings) btnResetDemoSettings.addEventListener('click', resetToDemoData);
  }

  // --- EXPOSE TO GLOBAL APP SCOPE ---
  window.app = {
    navigateTo,
    switchProject,
    openProjectSwitchModal,
    openModalNewProject,
    deleteProject,
    showDetailInspeksi,
    openEditInspeksi: (id) => openModalInspeksi(id),
    confirmDeleteInspeksi,
    handleChecklistChange,
    quickCreateFindingFromChecklist,
    showDetailRisiko,
    openEditRisiko: (id) => openModalRisiko(id),
    confirmDeleteRisiko,
    showDetailTemuan,
    openEditTemuan: (id) => openModalTemuan(id),
    confirmDeleteTemuan,
    toggleFindingStatus,
    showToast,
    closeModal
  };

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
