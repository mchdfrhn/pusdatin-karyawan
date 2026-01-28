# Dashboard Visualisasi Data Karyawan

Aplikasi dashboard interaktif untuk memvisualisasikan data statistik pegawai (Pusdatin) Kemenkumham. Dibangun menggunakan Next.js dan Tailwind CSS dengan fokus pada visualisasi data yang bersih dan responsif.

## 🚀 Fitur Utama

- **Visualisasi Statistik Pegawai Lengkap**:
  - **Gender**: Distribusi Laki-laki vs Perempuan per kelompok usia.
  - **Usia**: Sebaran pegawai berdasarkan rentang usia dan kategori (PNS, CPNS, PPPK, KI).
  - **Pendidikan**: Distribusi tingkat pendidikan (S1-D4, D1-D3, SLTA).
  - **Jabatan**: Komposisi jabatan Struktural, JFT, dan JFU.
  - **Golongan**: Sebaran pegawai per golongan/pangkat.
- **Tabel Pegawai Interaktif**:
  - **Pencarian Real-time**: Cari berdasarkan Nama, NIP, atau Jabatan.
  - **Filter Multi-Kategori**: Filter data berdasarkan Kategori (PNS/PPPK/dll), Pendidikan, dan Gender.
  - **Pagination**: Navigasi data yang efisien dengan pilihan jumlah baris per halaman.
- **Chart Interaktif**:
  - Grafik Batang (Bar Chart) dan Grafik Lingkaran (Pie Chart) yang responsif.
  - **Tooltip Informatif**: Menampilkan detail jumlah dan persentase saat di-hover.
  - **Legend & Label**: Keterangan warna dan label data yang jelas langsung pada grafik.
- **Desain Modern**: Antarmuka pengguna yang bersih menggunakan shadcn/ui dan Tailwind CSS.

## 🛠️ Teknologi yang Digunakan

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL & Auth)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- **Visualisasi Data**: [Recharts](https://recharts.org/)
- **State Management**: React 19 Hooks
- **Icon**: [Lucide React](https://lucide.dev/)

## 📂 Struktur Project

```
├── app/                  # Halaman aplikasi (Next.js App Router)
├── components/
│   ├── ui/               # Komponen UI dasar (Button, Card, dll)
│   └── pages/            # Komponen spesifik halaman
│       ├── dashboard.tsx     # Layout Utama Dashboard
│       ├── employee-table.tsx # Tabel Data Pegawai
│       ├── by-gender.tsx     # Visualisasi Gender
│       ├── by-age.tsx        # Visualisasi Usia
│       ├── by-education.tsx  # Visualisasi Pendidikan
│       ├── by-position.tsx   # Visualisasi Jabatan
│       └── by-department.tsx # Visualisasi Golongan
├── hooks/                # Custom React Hooks (useEmployeeStats, dll)
├── lib/
│   ├── data/             # Definisi tipe data dan helper statistik
│   └── supabase/         # Konfigurasi Client Supabase
└── public/               # Aset statis
```

## 📦 Instalasi dan Menjalankan Project

Pastikan Anda telah menginstal [Node.js](https://nodejs.org/) (versi 18+ direkomendasikan).

1.  **Clone repository ini:**

    ```bash
    git clone https://github.com/username/dashboard-karyawan.git
    cd dashboard-karyawan
    ```

2.  **Instal dependensi:**

    ```bash
    npm install
    # atau
    yarn install
    # atau
    pnpm install
    ```

3.  **Konfigurasi Environment Variable:**

    Buat file `.env.local` di root project dan tambahkan konfigurasi Supabase Anda:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

    # Opsional: Nama tabel custom (Default: employees)
    NEXT_PUBLIC_SUPABASE_EMPLOYEE_TABLE=employees
    ```

4.  **Jalankan server development:**

    ```bash
    npm run dev
    ```

5.  **Buka browser:**
    Kunjungi [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi.

## 📝 Lisensi

[MIT License](LICENSE)
