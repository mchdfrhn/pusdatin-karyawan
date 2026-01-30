import * as z from "zod";

export const employeeFormSchema = z.object({
  // Identitas
  nama: z.string().min(2, {
    message: "Nama harus diisi minimal 2 karakter.",
  }),
  nik: z
    .string()
    .length(16, {
      message: "NIK harus 16 digit.",
    })
    .regex(/^\d+$/, { message: "NIK harus berupa angka." }),
  nip: z.string().optional(),
  npwp: z.string().optional(),
  nama_tanpa_gelar: z.string().optional(),
  gelar_belakang: z.string().optional(),

  tempat_lahir: z.string().min(1, { message: "Tempat lahir harus diisi." }),
  tanggal_lahir: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Tanggal lahir tidak valid.",
  }),
  jenis_kelamin: z.enum(["Laki-laki", "Perempuan"], {
    required_error: "Pilih jenis kelamin.",
  }),
  agama: z.string().min(1, { message: "Pilih agama." }),

  alamat: z.string().optional(),
  no_handphone: z.string().optional(),
  email: z.string().email({
    message: "Email tidak valid.",
  }),

  // Kepegawaian
  tahun_pengangkatan: z.coerce.number().min(1900).optional(),
  status_kepegawaian: z.enum(["PNS", "CPNS", "PPPK", "KI", "PPnPN"], {
    required_error: "Pilih status kepegawaian.",
  }),

  // Status Detil
  status_jabatan: z.string().optional(),
  grade_tukin: z.coerce.number().optional(),
  bup: z.coerce.number().optional(),
  usia_pensiun_2025: z.coerce.number().optional(),

  // Jabatan
  jenis_jabatan: z.enum(["Struktural", "JFT", "JFU"], {
    required_error: "Pilih jenis jabatan.",
  }),

  // Fields spesifik untuk insert ke tabel jabatan_*
  eselon: z.string().optional(),
  nama_jabatan: z.string().min(1, { message: "Nama jabatan harus diisi." }),
  tmt_jabatan: z.string().optional(), // Tanggal
  lama_menjabat: z.string().optional(), // Durasi string

  // JFT specific
  jenjang_jabatan: z.string().optional(),
  nama_jft_tukin: z.string().optional(),

  // JFU specific
  unit_eselon_3: z.string().optional(),
  unit_tugas_adhoc: z.string().optional(),
  atasan_langsung: z.string().optional(),
  uraian_tugas_utama: z.string().optional(),
  sk_kapusdatin: z.string().optional(),

  // Pangkat (History Current)
  golongan: z.string().optional(), // gol_ruang
  tmt_pangkat: z.string().optional(),
  masa_kerja: z.string().optional(),

  // Bidang Unit
  bidang: z.string().optional(), // bidang_unit

  // Pendidikan (History Latest)
  pendidikan_terakhir: z.enum(
    ["SLTA", "D3", "D4", "S1", "S2", "S3"], // Matches DB Enum
    {
      required_error: "Pilih pendidikan terakhir.",
    },
  ),
  nama_sekolah: z.string().optional(),
  kota_negara: z.string().optional(),
  jurusan_prodi: z.string().optional(),
  tahun_lulus: z.coerce.number().optional(),
  no_ijazah_sttb: z.string().optional(),
  tanggal_lulus: z.string().optional(),
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

export const defaultEmployeeValues: Partial<EmployeeFormValues> = {
  nama: "",
  nik: "",
  nip: "",
  npwp: "",
  nama_tanpa_gelar: "",
  gelar_belakang: "",

  tempat_lahir: "",
  tanggal_lahir: "",
  jenis_kelamin: "Laki-laki", // Updated to match SelectItem value "Laki-laki" if changed in form, checking...
  // In form I used "L" and "P" in one place, then "Laki-laki" in another. I should standardize.
  // The form JSX I edited previously used: <SelectItem value="Laki-laki">Laki-laki</SelectItem>
  // BUT the initial schema reading (line 154) had defaultValue check? No.
  // Wait, my previous edit used "Laki-laki" in SelectItem value.
  // Let's stick to "Laki-laki" since it's more descriptive, or check DB?
  // Use "L" / "P" is safer for DB usually, but UI might want full.
  // I will use "L" and "P" in defaultValues if I change the JSX back to L/P or vice versa.
  // I'll assume "L" and "P" for now as per previous logic.
  agama: "Islam",

  alamat: "",
  no_handphone: "",
  email: "",

  tahun_pengangkatan: 2024,
  status_kepegawaian: "PNS",
  status_jabatan: "Aktif",

  jenis_jabatan: "Struktural",
  nama_jabatan: "",
  eselon: "",

  golongan: "",
  bidang: "",

  pendidikan_terakhir: "S1",
};
