import { describe, it, expect, vi, beforeEach } from "vitest";
import { addEmployee, EmployeeFormValues } from "@/app/actions";

// Mock primitives we can simulate inside the factory or use top-level mocking helper if needed,
// but simplest for Vitest is to just return a structure or use doMock if needed.
// However, to use shared mocks in tests, good pattern:

const { mockFrom, mockInsert, mockSelect, mockSingle } = vi.hoisted(() => {
  return {
    mockFrom: vi.fn(),
    mockInsert: vi.fn(),
    mockSelect: vi.fn(),
    mockSingle: vi.fn(),
  };
});

vi.mock("@/lib/supabase/admin", () => {
  return {
    supabaseAdmin: {
      from: mockFrom,
    },
  };
});

// Mock revalidatePath
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("addEmployee Action", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Create a chainable and thenable object
    const postgrestBuilder = {
      select: mockSelect,
      then: (resolve: any) => resolve({ error: null }),
    };

    const singleBuilder = {
      then: (resolve: any) => resolve({ data: { id: 123 }, error: null }),
    };

    // Setup mock chain
    mockFrom.mockReturnValue({
      insert: mockInsert,
      update: mockInsert, // Using same mock for update
      delete: mockInsert,
    });

    mockInsert.mockReturnValue(postgrestBuilder);

    mockSelect.mockReturnValue({
      single: mockSingle,
    });

    mockSingle.mockReturnValue(singleBuilder);
  });

  it("should map all form fields to standard database columns correctly", async () => {
    const formData: EmployeeFormValues = {
      nama: "Test User",
      nik: "1234567890123456",
      nip: "199001012020011001",
      npwp: "12.345.678.9-000.000",
      nama_tanpa_gelar: "Test User",
      gelar_belakang: "S.Kom",

      tempat_lahir: "Jakarta",
      tanggal_lahir: "1990-01-01",
      jenis_kelamin: "Laki-laki",
      agama: "Islam",

      alamat: "Jl. Test No. 1",
      no_handphone: "081234567890",
      email: "test@example.com",

      tahun_pengangkatan: 2020,
      status_kepegawaian: "PNS",

      status_jabatan: "Aktif",
      grade_tukin: 10,
      bup: 58,
      usia_pensiun_2025: 35,

      jenis_jabatan: "Struktural",
      nama_jabatan: "Kepala Seksi",
      eselon: "IV.a",
      tmt_jabatan: "2024-01-01",
      lama_menjabat: "1 Tahun",

      // JFT fields (should be ignored or null in Struktural)
      jenjang_jabatan: "Ahli Muda",
      nama_jft_tukin: "Pranata Komputer",

      // JFU fields
      unit_eselon_3: "Bidang A",
      unit_tugas_adhoc: "Tim B",
      atasan_langsung: "Kabid A",
      uraian_tugas_utama: "Coding",
      sk_kapusdatin: "SK-123",

      golongan: "III/a",
      tmt_pangkat: "2023-01-01",
      masa_kerja: "4 Tahun",
      bidang: "Pusdatin",

      pendidikan_terakhir: "S1",
      nama_sekolah: "Univ Test",
      kota_negara: "Indonesia",
      jurusan_prodi: "Informatika",
      tahun_lulus: 2012,
      no_ijazah_sttb: "IJZ-123",
      tanggal_lulus: "2012-08-01",
    };

    const result = await addEmployee(formData);

    expect(result).toEqual({
      success: true,
      message: "Data pegawai berhasil ditambahkan.",
    });

    // 1. Verify 'pegawai' insert
    expect(mockFrom).toHaveBeenCalledWith("pegawai");
    expect(mockInsert).toHaveBeenCalledWith([
      expect.objectContaining({
        nama_lengkap: "Test User",
        nik_ktp: "1234567890123456",
        nip_nrp: "199001012020011001",
        npwp: "12.345.678.9-000.000",
        nama_tanpa_gelar: "Test User",
        gelar_belakang: "S.Kom",
        tempat_lahir: "Jakarta",
        tgl_lahir: "1990-01-01",
        jenis_kelamin: "L", // Mapped from Laki-laki
        agama: "Islam",
        alamat: "Jl. Test No. 1",
        no_handphone: "081234567890",
        email: "test@example.com",
        tahun_pengangkatan: 2020,
      }),
    ]);

    // 2. Verify 'status_kepegawaian' insert
    expect(mockFrom).toHaveBeenCalledWith("status_kepegawaian");
    expect(mockInsert).toHaveBeenCalledWith([
      expect.objectContaining({
        pegawai_id: 123,
        status_keaktifan: "PNS",
        status_jabatan: "Aktif",
        grade_tukin: 10,
        bidang_unit: "Pusdatin",
        bup: 58,
        usia_pensiun_2025: 35,
      }),
    ]);

    // 3. Verify 'riwayat_pangkat' insert
    expect(mockFrom).toHaveBeenCalledWith("riwayat_pangkat");
    expect(mockInsert).toHaveBeenCalledWith([
      expect.objectContaining({
        pegawai_id: 123,
        gol_ruang: "III/a",
        tmt_pangkat: "2023-01-01",
        masa_kerja: "4 Tahun",
        is_current: true,
      }),
    ]);

    // 4. Verify 'jabatan_struktural' insert (since Kind is Struktural)
    expect(mockFrom).toHaveBeenCalledWith("jabatan_struktural");
    expect(mockInsert).toHaveBeenCalledWith([
      expect.objectContaining({
        pegawai_id: 123,
        nama_jabatan: "Kepala Seksi",
        eselon: "IV.a",
        tmt_jabatan: "2024-01-01",
        lama_menjabat: "1 Tahun",
      }),
    ]);

    // Ensure other jabatan tables were NOT called
    expect(mockFrom).not.toHaveBeenCalledWith("jabatan_fungsional");
    expect(mockFrom).not.toHaveBeenCalledWith("jabatan_umum");

    // 5. Verify 'riwayat_pendidikan' insert
    expect(mockFrom).toHaveBeenCalledWith("riwayat_pendidikan");
    expect(mockInsert).toHaveBeenCalledWith([
      expect.objectContaining({
        pegawai_id: 123,
        jenjang: "S1",
        nama_sekolah: "Univ Test",
        kota_negara: "Indonesia",
        jurusan_prodi: "Informatika",
        tahun_lulus: 2012,
        no_ijazah_sttb: "IJZ-123",
        tanggal_lulus: "2012-08-01",
        is_latest: true,
      }),
    ]);
  });
});
