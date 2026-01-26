# Dashboard Visualisasi Data Karyawan

Aplikasi dashboard interaktif untuk memvisualisasikan data statistik pegawai (Pusdatin) Kemenkumham. Dibangun menggunakan Next.js dan Tailwind CSS dengan fokus pada visualisasi data yang bersih dan responsif.

## 🚀 Fitur Utama

- **Visualisasi Statistik Pegawai Lengkap**:
  - **Gender**: Distribusi Laki-laki vs Perempuan per kelompok usia.
  - **Usia**: Sebaran pegawai berdasarkan rentang usia dan kategori (PNS, CPNS, PPPK, KI).
  - **Pendidikan**: Distribusi tingkat pendidikan (S1-D4, D1-D3, SLTA).
  - **Jabatan**: Komposisi jabatan Struktural, JFT, dan JFU.
  - **Golongan**: Sebaran pegawai per golongan/pangkat.
- **Chart Interaktif**:
  - Grafik Batang (Bar Chart) dan Grafik Lingkaran (Pie Chart) yang responsif.
  - **Tooltip Informatif**: Menampilkan detail jumlah dan persentase saat di-hover.
  - **Legend & Label**: Keterangan warna dan label data yang jelas langsung pada grafik.
- **Desain Modern**: Antarmuka pengguna yang bersih menggunakan shadcn/ui dan Tailwind CSS.

## 🛠️ Teknologi yang Digunakan

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- **Visualisasi Data**: [Recharts](https://recharts.org/)
- **Icon**: [Lucide React](https://lucide.dev/)

## 📂 Struktur Project

```
├── app/                  # Halaman aplikasi (Next.js App Router)
├── components/
│   ├── ui/               # Komponen UI dasar (Button, Card, dll)
│   └── pages/            # Komponen spesifik halaman (Chart, Tabel)
│       ├── by-gender.tsx     # Visualisasi Gender
│       ├── by-age.tsx        # Visualisasi Usia
│       ├── by-education.tsx  # Visualisasi Pendidikan
│       ├── by-position.tsx   # Visualisasi Jabatan
│       └── by-department.tsx # Visualisasi Golongan
├── lib/
│   └── data/             # Definisi tipe data dan mock data
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

3.  **Jalankan server development:**

    ```bash
    npm run dev
    ```

4.  **Buka browser:**
    Kunjungi [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi.

## 📝 Lisensi

[MIT License](LICENSE)
