-- ========================================
-- SISTEM INFORMASI KEPEGAWAIAN
-- Database Schema untuk Supabase
-- ========================================

-- Aktifkan ekstensi UUID jika belum ada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- 1. TABEL UTAMA: PEGAWAI
-- Menyimpan identitas statis personal pegawai
-- ========================================

CREATE TABLE pegawai (
    id SERIAL PRIMARY KEY,
    nip_nrp VARCHAR(50) UNIQUE NOT NULL,
    nik_ktp VARCHAR(20),
    npwp VARCHAR(25),
    
    -- Detail Nama
    nama_lengkap VARCHAR(255),
    gelar_depan VARCHAR(50),
    nama_tanpa_gelar VARCHAR(255),
    gelar_belakang VARCHAR(50),
    
    -- Data Demografis
    jenis_kelamin CHAR(1) CHECK (jenis_kelamin IN ('L', 'P')),
    agama VARCHAR(50),
    tempat_lahir VARCHAR(100),
    tgl_lahir DATE,
    usia_saat_ini VARCHAR(50), -- Bisa calculated, tapi disimpan sebagai cache
    
    -- Kontak
    alamat TEXT,
    no_handphone VARCHAR(20),
    email VARCHAR(100),
    
    -- Info Dasar Kepegawaian
    tahun_pengangkatan INTEGER, -- Tahun pertama kali pengangkatan
    
    -- Timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk pencarian cepat
CREATE INDEX idx_pegawai_nip ON pegawai(nip_nrp);
CREATE INDEX idx_pegawai_nama ON pegawai(nama_lengkap);
CREATE INDEX idx_pegawai_nik ON pegawai(nik_ktp);

-- Komentar tabel
COMMENT ON TABLE pegawai IS 'Tabel utama yang menyimpan data identitas pegawai';
COMMENT ON COLUMN pegawai.nip_nrp IS 'Nomor Induk Pegawai/Nomor Registrasi Pokok';
COMMENT ON COLUMN pegawai.usia_saat_ini IS 'Usia pegawai saat ini (cached value)';

-- ========================================
-- 2. STATUS KEPEGAWAIAN
-- Menyimpan status kedudukan, unit, dan masa pensiun
-- ========================================

CREATE TABLE status_kepegawaian (
    id SERIAL PRIMARY KEY,
    pegawai_id INTEGER NOT NULL REFERENCES pegawai(id) ON DELETE CASCADE,
    
    grade_tukin INTEGER,
    bidang_unit VARCHAR(100), -- Bidang tempat pegawai bertugas
    status_jabatan VARCHAR(50), -- Aktif, Tugas Belajar, dll
    status_keaktifan VARCHAR(50), -- Status keaktifan rinci
    
    bup INTEGER, -- Batas Usia Pensiun
    usia_pensiun_2025 INTEGER,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk relasi
CREATE INDEX idx_status_pegawai ON status_kepegawaian(pegawai_id);

COMMENT ON TABLE status_kepegawaian IS 'Status kepegawaian aktif pegawai termasuk grade dan info pensiun';
COMMENT ON COLUMN status_kepegawaian.bup IS 'Batas Usia Pensiun';
COMMENT ON COLUMN status_kepegawaian.grade_tukin IS 'Grade untuk perhitungan tunjangan kinerja';

-- ========================================
-- 3. RIWAYAT PANGKAT & GOLONGAN
-- Menyimpan data golongan ruang terakhir dan historisnya
-- ========================================

CREATE TABLE riwayat_pangkat (
    id SERIAL PRIMARY KEY,
    pegawai_id INTEGER NOT NULL REFERENCES pegawai(id) ON DELETE CASCADE,
    
    gol_ruang VARCHAR(10), -- Contoh: III/a, IV/b
    tmt_pangkat DATE, -- Tanggal Mulai Terhitung pangkat
    masa_kerja VARCHAR(50), -- Jangka waktu setelah TMT
    
    is_current BOOLEAN DEFAULT FALSE, -- Penanda apakah ini pangkat saat ini
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk pencarian
CREATE INDEX idx_pangkat_pegawai ON riwayat_pangkat(pegawai_id);
CREATE INDEX idx_pangkat_current ON riwayat_pangkat(pegawai_id, is_current) WHERE is_current = TRUE;

COMMENT ON TABLE riwayat_pangkat IS 'Riwayat pangkat dan golongan ruang pegawai';
COMMENT ON COLUMN riwayat_pangkat.tmt_pangkat IS 'Tanggal Mulai Terhitung pangkat';
COMMENT ON COLUMN riwayat_pangkat.is_current IS 'TRUE jika ini adalah pangkat aktif saat ini';

-- ========================================
-- 4. JABATAN STRUKTURAL
-- Khusus pejabat struktural (Eselon)
-- ========================================

CREATE TABLE jabatan_struktural (
    id SERIAL PRIMARY KEY,
    pegawai_id INTEGER NOT NULL REFERENCES pegawai(id) ON DELETE CASCADE,
    
    nama_jabatan VARCHAR(255),
    eselon VARCHAR(10), -- Contoh: II.a, III.b, IV.a
    tmt_jabatan DATE, -- Tanggal Mulai Terhitung jabatan
    lama_menjabat VARCHAR(50), -- Jangka waktu setelah TMT
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk pencarian
CREATE INDEX idx_struktural_pegawai ON jabatan_struktural(pegawai_id);
CREATE INDEX idx_struktural_eselon ON jabatan_struktural(eselon);

COMMENT ON TABLE jabatan_struktural IS 'Data jabatan struktural untuk pejabat eselon';
COMMENT ON COLUMN jabatan_struktural.eselon IS 'Tingkat eselon jabatan (II, III, IV, dst)';

-- ========================================
-- 5. JABATAN FUNGSIONAL TERTENTU (JFT)
-- Khusus JFT seperti Pranata Komputer, Statistisi, Surveyor
-- ========================================

CREATE TABLE jabatan_fungsional (
    id SERIAL PRIMARY KEY,
    pegawai_id INTEGER NOT NULL REFERENCES pegawai(id) ON DELETE CASCADE,
    
    nama_jabatan VARCHAR(255),
    jenjang_jabatan VARCHAR(50), -- Ahli Muda, Ahli Madya, Ahli Utama, dll
    gol_ruang VARCHAR(10),
    tmt_jabatan DATE,
    lama_menjabat VARCHAR(50),
    
    nama_jft_tukin VARCHAR(255), -- Nama jabatan untuk pembayaran Tukin
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk pencarian
CREATE INDEX idx_fungsional_pegawai ON jabatan_fungsional(pegawai_id);
CREATE INDEX idx_fungsional_jenjang ON jabatan_fungsional(jenjang_jabatan);

COMMENT ON TABLE jabatan_fungsional IS 'Jabatan Fungsional Tertentu (JFT) seperti Pranata Komputer, Statistisi';
COMMENT ON COLUMN jabatan_fungsional.jenjang_jabatan IS 'Jenjang JFT: Terampil/Mahir/Penyelia atau Pertama/Muda/Madya/Utama';
COMMENT ON COLUMN jabatan_fungsional.nama_jft_tukin IS 'Nama jabatan yang digunakan untuk perhitungan tunjangan kinerja';

-- ========================================
-- 6. JABATAN FUNGSIONAL UMUM (JFU/PELAKSANA)
-- Khusus Pelaksana/Staf
-- ========================================

CREATE TABLE jabatan_umum (
    id SERIAL PRIMARY KEY,
    pegawai_id INTEGER NOT NULL REFERENCES pegawai(id) ON DELETE CASCADE,
    
    nama_jabatan VARCHAR(255), -- Sesuai Kepmen PUPR No. 41
    tmt_jabatan DATE,
    
    unit_eselon_3 VARCHAR(100),
    unit_tugas_adhoc VARCHAR(100),
    atasan_langsung VARCHAR(255),
    uraian_tugas_utama TEXT,
    
    sk_kapusdatin VARCHAR(100), -- Nomor SK referensi dari Kapusdatin
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk pencarian
CREATE INDEX idx_umum_pegawai ON jabatan_umum(pegawai_id);
CREATE INDEX idx_umum_unit ON jabatan_umum(unit_eselon_3);

COMMENT ON TABLE jabatan_umum IS 'Jabatan Fungsional Umum (JFU) atau Pelaksana/Staf';
COMMENT ON COLUMN jabatan_umum.sk_kapusdatin IS 'Nomor SK dari Kepala Pusat Data dan Teknologi Informasi';

-- ========================================
-- 7. TUGAS TAMBAHAN / PERBENDAHARAAN
-- Khusus Bendahara, PPK, PPSPM, dll
-- ========================================

CREATE TABLE tugas_tambahan (
    id SERIAL PRIMARY KEY,
    pegawai_id INTEGER NOT NULL REFERENCES pegawai(id) ON DELETE CASCADE,
    
    nama_tugas VARCHAR(255), -- Jabatan Perbendaharaan & Kesatkeran
    sk_referensi VARCHAR(255), -- SK Menteri/Kaba/Kapusdatin
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk pencarian
CREATE INDEX idx_tugas_tambahan_pegawai ON tugas_tambahan(pegawai_id);

COMMENT ON TABLE tugas_tambahan IS 'Tugas tambahan seperti Bendahara, PPK, PPSPM, dan tugas perbendaharaan lainnya';
COMMENT ON COLUMN tugas_tambahan.sk_referensi IS 'Nomor SK penugasan dari Menteri/Kepala Badan/Kapusdatin';

-- ========================================
-- 8. RIWAYAT PENDIDIKAN
-- Normalisasi dari kolom S3, S2, S1, D4, D3, SLTA, SLTP, SD
-- ========================================

-- Tipe enum untuk jenjang pendidikan
CREATE TYPE jenjang_pendidikan AS ENUM ('SD', 'SLTP', 'SLTA', 'D3', 'D4', 'S1', 'S2', 'S3');

CREATE TABLE riwayat_pendidikan (
    id SERIAL PRIMARY KEY,
    pegawai_id INTEGER NOT NULL REFERENCES pegawai(id) ON DELETE CASCADE,
    
    jenjang jenjang_pendidikan NOT NULL,
    
    -- Data Institusi
    nama_sekolah VARCHAR(255), -- Perguruan Tinggi / Sekolah
    kota_negara VARCHAR(100),
    
    -- Data Akademik
    jurusan_prodi VARCHAR(255),
    spesialisasi_topik VARCHAR(255), -- Topik Disertasi/Tesis/Skripsi
    bidang_keilmuan VARCHAR(100),
    kategori_ilmu VARCHAR(50), -- Teknik / Non-Teknik
    
    -- Data Kelulusan
    no_ijazah_sttb VARCHAR(100),
    tanggal_lulus DATE,
    tahun_lulus INTEGER, -- Jika tanggal lengkap tidak tersedia
    
    is_latest BOOLEAN DEFAULT FALSE, -- Penanda Pendidikan Terakhir
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk pencarian
CREATE INDEX idx_pendidikan_pegawai ON riwayat_pendidikan(pegawai_id);
CREATE INDEX idx_pendidikan_jenjang ON riwayat_pendidikan(jenjang);
CREATE INDEX idx_pendidikan_latest ON riwayat_pendidikan(pegawai_id, is_latest) WHERE is_latest = TRUE;

COMMENT ON TABLE riwayat_pendidikan IS 'Riwayat pendidikan formal pegawai dari SD hingga S3';
COMMENT ON COLUMN riwayat_pendidikan.spesialisasi_topik IS 'Topik penelitian untuk Disertasi (S3), Tesis (S2), atau Skripsi (S1)';
COMMENT ON COLUMN riwayat_pendidikan.is_latest IS 'TRUE jika ini adalah pendidikan terakhir/tertinggi pegawai';

-- ========================================
-- 9. RIWAYAT DIKLAT
-- Data pelatihan dan pengembangan kompetensi
-- ========================================

-- Tipe enum untuk kategori diklat
CREATE TYPE kategori_diklat AS ENUM ('S', 'P', 'KP');

CREATE TABLE riwayat_diklat (
    id SERIAL PRIMARY KEY,
    pegawai_id INTEGER NOT NULL REFERENCES pegawai(id) ON DELETE CASCADE,
    
    nama_diklat VARCHAR(255),
    kategori kategori_diklat, -- S=Substantif, P=Pendukung, KP=Konsultan Perorangan
    lokasi VARCHAR(100),
    
    tgl_mulai DATE,
    tgl_selesai DATE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk pencarian
CREATE INDEX idx_diklat_pegawai ON riwayat_diklat(pegawai_id);
CREATE INDEX idx_diklat_kategori ON riwayat_diklat(kategori);
CREATE INDEX idx_diklat_tanggal ON riwayat_diklat(tgl_mulai, tgl_selesai);

COMMENT ON TABLE riwayat_diklat IS 'Riwayat pendidikan dan pelatihan (diklat) pegawai';
COMMENT ON COLUMN riwayat_diklat.kategori IS 'S=Substantif, P=Pendukung, KP=Konsultan Perorangan';

-- ========================================
-- TRIGGER UNTUK AUTO UPDATE TIMESTAMP
-- ========================================

-- Fungsi untuk update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Terapkan trigger ke semua tabel
CREATE TRIGGER update_pegawai_updated_at BEFORE UPDATE ON pegawai 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_status_updated_at BEFORE UPDATE ON status_kepegawaian 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pangkat_updated_at BEFORE UPDATE ON riwayat_pangkat 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_struktural_updated_at BEFORE UPDATE ON jabatan_struktural 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fungsional_updated_at BEFORE UPDATE ON jabatan_fungsional 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_umum_updated_at BEFORE UPDATE ON jabatan_umum 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tugas_updated_at BEFORE UPDATE ON tugas_tambahan 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pendidikan_updated_at BEFORE UPDATE ON riwayat_pendidikan 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_diklat_updated_at BEFORE UPDATE ON riwayat_diklat 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- VIEWS UNTUK KEMUDAHAN QUERY
-- ========================================

-- View untuk data lengkap pegawai dengan jabatan aktif
CREATE OR REPLACE VIEW v_pegawai_lengkap AS
SELECT 
    p.*,
    sk.grade_tukin,
    sk.bidang_unit,
    sk.status_jabatan,
    sk.status_keaktifan,
    sk.bup,
    rp.gol_ruang AS pangkat_terakhir,
    rp.tmt_pangkat,
    rpd.jenjang AS pendidikan_terakhir,
    rpd.nama_sekolah,
    rpd.jurusan_prodi
FROM pegawai p
LEFT JOIN status_kepegawaian sk ON p.id = sk.pegawai_id
LEFT JOIN riwayat_pangkat rp ON p.id = rp.pegawai_id AND rp.is_current = TRUE
LEFT JOIN riwayat_pendidikan rpd ON p.id = rpd.pegawai_id AND rpd.is_latest = TRUE;

COMMENT ON VIEW v_pegawai_lengkap IS 'View gabungan data pegawai dengan status, pangkat, dan pendidikan terakhir';

-- ========================================
-- ROW LEVEL SECURITY (RLS) - OPSIONAL
-- Uncomment jika ingin mengaktifkan RLS
-- ========================================

-- ALTER TABLE pegawai ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE status_kepegawaian ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE riwayat_pangkat ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE jabatan_struktural ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE jabatan_fungsional ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE jabatan_umum ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE tugas_tambahan ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE riwayat_pendidikan ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE riwayat_diklat ENABLE ROW LEVEL SECURITY;

-- Contoh policy untuk akses public (sesuaikan dengan kebutuhan)
-- CREATE POLICY "Enable read access for all users" ON pegawai FOR SELECT USING (true);

-- ========================================
-- SELESAI
-- ========================================

-- Tampilkan semua tabel yang telah dibuat
SELECT 
    tablename, 
    schemaname 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;