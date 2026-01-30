"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { EmployeeFormValues } from "@/lib/schemas";
export type { EmployeeFormValues };

export async function addEmployee(data: EmployeeFormValues) {
  // Map 'Laki-laki' -> 'L', 'Perempuan' -> 'P'
  const jenis_kelamin_db = data.jenis_kelamin === "Laki-laki" ? "L" : "P";

  // 1. Insert into 'pegawai'
  const pegawaiPayload = {
    nama_lengkap: data.nama,
    nik_ktp: data.nik,
    nip_nrp: data.nip || null,
    npwp: data.npwp || null,
    nama_tanpa_gelar: data.nama_tanpa_gelar || null,
    gelar_belakang: data.gelar_belakang || null,
    tempat_lahir: data.tempat_lahir,
    tgl_lahir: data.tanggal_lahir,
    jenis_kelamin: jenis_kelamin_db,
    agama: data.agama,
    alamat: data.alamat || null,
    no_handphone: data.no_handphone || null,
    email: data.email,
    tahun_pengangkatan: data.tahun_pengangkatan || null,
  };

  try {
    const { data: pegawaiData, error: pegawaiError } = await supabaseAdmin
      .from("pegawai")
      .insert([pegawaiPayload])
      .select("id")
      .single();

    if (pegawaiError) {
      console.error("Error inserting pegawai:", pegawaiError);
      return { error: pegawaiError.message };
    }

    const pegawaiId = pegawaiData.id;

    // 2. Insert into 'status_kepegawaian'
    const statusPayload = {
      pegawai_id: pegawaiId,
      status_keaktifan: data.status_kepegawaian, // Mapping from form 'status_kepegawaian' (PNS etc) to 'status_keaktifan'?
      // Form 'status_kepegawaian' has values PNS, CPNS... Schema has 'status_keaktifan' and 'status_jabatan'.
      // Usually PNS/CPNS is status_kepegawaian or categorical.
      // Schema comment says: "-- Status keaktifan rinci", "-- Status kepegawaian...".
      // Let's assume 'status_keaktifan' stores "PNS", "CPNS" etc.
      // And 'status_jabatan' stores "Aktif", "Tugas Belajar" etc.
      status_jabatan: data.status_jabatan || "Aktif",
      grade_tukin: data.grade_tukin || null,
      bidang_unit: data.bidang || null,
      bup: data.bup || null,
      usia_pensiun_2025: data.usia_pensiun_2025 || null,
    };

    const { error: statusError } = await supabaseAdmin
      .from("status_kepegawaian")
      .insert([statusPayload]);

    if (statusError) console.error("Error inserting status:", statusError);

    // 3. Insert into 'riwayat_pangkat' (Current)
    if (data.golongan) {
      const pangkatPayload = {
        pegawai_id: pegawaiId,
        gol_ruang: data.golongan,
        tmt_pangkat: data.tmt_pangkat || null,
        masa_kerja: data.masa_kerja || null,
        is_current: true,
      };
      const { error: pangkatError } = await supabaseAdmin
        .from("riwayat_pangkat")
        .insert([pangkatPayload]);
      if (pangkatError) console.error("Error inserting pangkat:", pangkatError);
    }

    // 4. Insert into Jabatan Table based on jenis_jabatan
    if (data.jenis_jabatan === "Struktural") {
      const strukturalPayload = {
        pegawai_id: pegawaiId,
        nama_jabatan: data.nama_jabatan,
        eselon: data.eselon || null,
        tmt_jabatan: data.tmt_jabatan || null,
        lama_menjabat: data.lama_menjabat || null,
      };
      const { error: jabError } = await supabaseAdmin
        .from("jabatan_struktural")
        .insert([strukturalPayload]);
      if (jabError)
        console.error("Error inserting jabatan_struktural:", jabError);
    } else if (data.jenis_jabatan === "JFT") {
      const fungsionalPayload = {
        pegawai_id: pegawaiId,
        nama_jabatan: data.nama_jabatan,
        jenjang_jabatan: data.jenjang_jabatan || null,
        gol_ruang: data.golongan || null, // JFT table has gol_ruang too
        tmt_jabatan: data.tmt_jabatan || null,
        lama_menjabat: data.lama_menjabat || null,
        nama_jft_tukin: data.nama_jft_tukin || null,
      };
      const { error: jabError } = await supabaseAdmin
        .from("jabatan_fungsional")
        .insert([fungsionalPayload]);
      if (jabError)
        console.error("Error inserting jabatan_fungsional:", jabError);
    } else if (data.jenis_jabatan === "JFU") {
      const umumPayload = {
        pegawai_id: pegawaiId,
        nama_jabatan: data.nama_jabatan,
        tmt_jabatan: data.tmt_jabatan || null,
        unit_eselon_3: data.unit_eselon_3 || null,
        unit_tugas_adhoc: data.unit_tugas_adhoc || null,
        atasan_langsung: data.atasan_langsung || null,
        uraian_tugas_utama: data.uraian_tugas_utama || null,
        sk_kapusdatin: data.sk_kapusdatin || null,
      };
      const { error: jabError } = await supabaseAdmin
        .from("jabatan_umum")
        .insert([umumPayload]);
      if (jabError) console.error("Error inserting jabatan_umum:", jabError);
    }

    // 5. Insert into 'riwayat_pendidikan' (Latest)
    if (data.pendidikan_terakhir) {
      const pendidikanPayload = {
        pegawai_id: pegawaiId,
        jenjang: data.pendidikan_terakhir,
        nama_sekolah: data.nama_sekolah || null,
        kota_negara: data.kota_negara || null,
        jurusan_prodi: data.jurusan_prodi || null,
        tahun_lulus: data.tahun_lulus || null,
        no_ijazah_sttb: data.no_ijazah_sttb || null,
        tanggal_lulus: data.tanggal_lulus || null,
        is_latest: true,
      };
      const { error: pendError } = await supabaseAdmin
        .from("riwayat_pendidikan")
        .insert([pendidikanPayload]);
      if (pendError) console.error("Error inserting pendidikan:", pendError);
    }

    revalidatePath("/dashboard");
    return { success: true, message: "Data pegawai berhasil ditambahkan." };
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return { error: err.message || "An unexpected error occurred." };
  }
}

export async function deleteEmployee(
  id: string,
  key: "id" | "nip" | "nik" = "id",
) {
  const tableName = process.env.NEXT_PUBLIC_TABLE_PEGAWAI || "pegawai";

  try {
    const { error } = await supabaseAdmin.from(tableName).delete().eq("id", id);

    if (error) {
      console.error("Supabase delete error:", error);
      return { error: error.message };
    }

    revalidatePath("/dashboard");
    return { success: true, message: "Data pegawai berhasil dihapus." };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { error: "An unexpected error occurred." };
  }
}

export async function updateEmployee(id: string, data: EmployeeFormValues) {
  const tableName = process.env.NEXT_PUBLIC_TABLE_PEGAWAI || "pegawai";

  // Map 'Laki-laki' -> 'L', 'Perempuan' -> 'P'
  const jenis_kelamin_db = data.jenis_kelamin === "Laki-laki" ? "L" : "P";

  const pegawaiPayload = {
    nama_lengkap: data.nama,
    nik_ktp: data.nik,
    nip_nrp: data.nip || null,
    npwp: data.npwp || null,
    nama_tanpa_gelar: data.nama_tanpa_gelar || null,
    gelar_belakang: data.gelar_belakang || null,
    tempat_lahir: data.tempat_lahir,
    tgl_lahir: data.tanggal_lahir,
    jenis_kelamin: jenis_kelamin_db,
    agama: data.agama,
    alamat: data.alamat || null,
    no_handphone: data.no_handphone || null,
    email: data.email,
    tahun_pengangkatan: data.tahun_pengangkatan || null,
  };

  try {
    const { error: pegawaiError } = await supabaseAdmin
      .from(tableName)
      .update(pegawaiPayload)
      .eq("id", id);

    if (pegawaiError) {
      console.error("Error updating pegawai:", pegawaiError);
      return { error: pegawaiError.message };
    }

    // Update related tables (assuming existence, updating by pegawai_id)

    // Status Kepegawaian
    const statusPayload = {
      status_keaktifan: data.status_kepegawaian,
      status_jabatan: data.status_jabatan || "Aktif",
      grade_tukin: data.grade_tukin || null,
      bidang_unit: data.bidang || null,
      bup: data.bup || null,
      usia_pensiun_2025: data.usia_pensiun_2025 || null,
    };
    // Update status_kepegawaian linked to this pegawai
    await supabaseAdmin
      .from("status_kepegawaian")
      .update(statusPayload)
      .eq("pegawai_id", id);

    // Riwayat Pangkat (Update Current only)
    if (data.golongan) {
      const pangkatPayload = {
        gol_ruang: data.golongan,
        tmt_pangkat: data.tmt_pangkat || null,
        masa_kerja: data.masa_kerja || null,
      };
      await supabaseAdmin
        .from("riwayat_pangkat")
        .update(pangkatPayload)
        .eq("pegawai_id", id)
        .eq("is_current", true);
    }

    // Jabatan: Update based on type
    if (data.jenis_jabatan === "Struktural") {
      await supabaseAdmin
        .from("jabatan_struktural")
        .update({
          nama_jabatan: data.nama_jabatan,
          eselon: data.eselon || null,
          tmt_jabatan: data.tmt_jabatan || null,
          lama_menjabat: data.lama_menjabat || null,
        })
        .eq("pegawai_id", id);
    } else if (data.jenis_jabatan === "JFT") {
      await supabaseAdmin
        .from("jabatan_fungsional")
        .update({
          nama_jabatan: data.nama_jabatan,
          jenjang_jabatan: data.jenjang_jabatan || null,
          gol_ruang: data.golongan || null,
          tmt_jabatan: data.tmt_jabatan || null,
          lama_menjabat: data.lama_menjabat || null,
          nama_jft_tukin: data.nama_jft_tukin || null,
        })
        .eq("pegawai_id", id);
    } else if (data.jenis_jabatan === "JFU") {
      await supabaseAdmin
        .from("jabatan_umum")
        .update({
          nama_jabatan: data.nama_jabatan,
          tmt_jabatan: data.tmt_jabatan || null,
          unit_eselon_3: data.unit_eselon_3 || null,
          unit_tugas_adhoc: data.unit_tugas_adhoc || null,
          atasan_langsung: data.atasan_langsung || null,
          uraian_tugas_utama: data.uraian_tugas_utama || null,
          sk_kapusdatin: data.sk_kapusdatin || null,
        })
        .eq("pegawai_id", id);
    }

    // Pendidikan (Update Latest only)
    if (data.pendidikan_terakhir) {
      await supabaseAdmin
        .from("riwayat_pendidikan")
        .update({
          jenjang: data.pendidikan_terakhir,
          nama_sekolah: data.nama_sekolah || null,
          kota_negara: data.kota_negara || null,
          jurusan_prodi: data.jurusan_prodi || null,
          tahun_lulus: data.tahun_lulus || null,
          no_ijazah_sttb: data.no_ijazah_sttb || null,
          tanggal_lulus: data.tanggal_lulus || null,
        })
        .eq("pegawai_id", id)
        .eq("is_latest", true);
    }

    revalidatePath("/dashboard");
    return {
      success: true,
      message: `Data pegawai berhasil diperbarui.`,
    };
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return {
      success: false,
      error: "Terjadi kesalahan saat memperbarui data.",
    };
  }
}
// ... existing code ...

export async function getEmployeeById(id: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from("pegawai")
      .select(
        `
        *,
        status_kepegawaian(*),
        riwayat_pangkat(*),
        jabatan_struktural(*),
        jabatan_fungsional(*),
        jabatan_umum(*),
        riwayat_pendidikan(*),
        riwayat_diklat(*),
        tugas_tambahan(*)
      `,
      )
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching employee:", error);
      return { error: error.message };
    }

    // Transform to flat structure if needed, or return nested
    // For the detail view, nested is actually fine, but our Form expects a flat structure.
    // Let's return the nested data and let the frontend flatten it if it wants to use the Form,
    // OR we can flatten it here to match EmployeeFormValues which is easier for the "Edit" feature.

    // Let's try to flatten it to EmployeeFormValues roughly, but keep raw data too?
    // Actually, for the Detail View, we might want to show history.
    // But for now, let's just return the raw payload.
    return { success: true, data };
  } catch (err: any) {
    console.error("Unexpected error fetching employee:", err);
    return { error: "An unexpected error occurred." };
  }
}
