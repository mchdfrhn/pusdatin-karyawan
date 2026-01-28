CREATE TABLE pegawai (
    id SERIAL PRIMARY KEY, -- ID otomatis sebagai primary key
    nip VARCHAR(50) UNIQUE, -- NIP sebagai identitas unik
    nama_lengkap TEXT NOT NULL,
    bidang TEXT,
    nik VARCHAR(20),
    jenis_kelamin VARCHAR(20), -- Laki-laki / Perempuan
    email TEXT,
    kategori TEXT, -- PNS / CPNS / PPPK
    golongan TEXT, -- Contoh: Pembina (IV/b)
    jabatan TEXT,
    jenis_jabatan TEXT, -- Struktural / Fungsional
    eselon VARCHAR(10), -- Contoh: II.a, III.b, dsb.
    pendidikan TEXT, -- Jenjang pendidikan terakhir
    tanggal_lahir DATE, -- Format YYYY-MM-DD
    created_at TIMESTAMPTZ DEFAULT NOW() -- Mencatat waktu data dibuat
);

-- Tambahkan index pada NIP agar pencarian data pegawai lebih cepat
CREATE INDEX idx_pegawai_nip ON pegawai(nip);