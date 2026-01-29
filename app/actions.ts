"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export type EmployeeFormValues = {
  nama: string;
  nik: string;
  nip?: string;

  tanggal_lahir: string;
  jenis_kelamin: "Laki-laki" | "Perempuan";
  email: string;
  status_kepegawaian: "PNS" | "CPNS" | "PPPK" | "KI" | "PPnPN";
  jenis_jabatan: "Struktural" | "JFT" | "JFU";
  eselon?: string;
  nama_jabatan: string;
  golongan?: string;
  bidang?: string;

  pendidikan_terakhir: "SLTA" | "D1-D3" | "S1-D4" | "S2" | "S3";
};

export async function addEmployee(data: EmployeeFormValues) {
  const tableName =
    process.env.NEXT_PUBLIC_SUPABASE_EMPLOYEE_TABLE || "employees";

  // Map form values to database columns
  const payload = {
    nama_lengkap: data.nama,
    nik: data.nik,
    nip: data.nip || null,

    tanggal_lahir: data.tanggal_lahir,
    jenis_kelamin: data.jenis_kelamin,
    email: data.email,
    kategori: data.status_kepegawaian,
    jenis_jabatan: data.jenis_jabatan,
    eselon: data.jenis_jabatan === "Struktural" ? data.eselon || null : null,
    jabatan: data.nama_jabatan,
    golongan: data.golongan,
    bidang: data.bidang,
    pendidikan: data.pendidikan_terakhir,
  };

  try {
    // Use supabaseAdmin to bypass RLS
    const { error } = await supabaseAdmin.from(tableName).insert([payload]);

    if (error) {
      console.error("Supabase insert error:", error);
      // Handle duplicate unique constraint (e.g., NIK or NIP already exists)
      if (error.code === "23505") {
        return {
          success: false,
          error: "Gagal: NIK atau NIP sudah terdaftar.",
        };
      }
      return { success: false, error: `Gagal: ${error.message}` };
    }

    revalidatePath("/"); // Revalidate the home page to show new data
    return {
      success: true,
      message: `Pegawai ${payload.nama_lengkap} berhasil ditambahkan.`,
    };
  } catch (err) {
    console.error("Unexpected error:", err);
    return {
      success: false,
      error: "Terjadi kesalahan yang tidak terduga saat menyimpan data.",
    };
  }
}

export async function deleteEmployee(
  identifier: string,
  key: "id" | "nip" | "nik" = "id",
) {
  const tableName =
    process.env.NEXT_PUBLIC_SUPABASE_EMPLOYEE_TABLE || "pegawai";

  try {
    const { error } = await supabaseAdmin
      .from(tableName)
      .delete()
      .eq(key, identifier);

    if (error) {
      console.error("Supabase delete error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    return { success: true, message: "Data pegawai berhasil dihapus." };
  } catch (err) {
    console.error("Unexpected error:", err);
    return {
      success: false,
      error: "Terjadi kesalahan yang tidak terduga saat menghapus data.",
    };
  }
}

export async function updateEmployee(id: string, data: EmployeeFormValues) {
  const tableName =
    process.env.NEXT_PUBLIC_SUPABASE_EMPLOYEE_TABLE || "pegawai";

  // Map form values to database columns
  const payload = {
    nama_lengkap: data.nama,
    nik: data.nik,
    nip: data.nip || null,

    tanggal_lahir: data.tanggal_lahir,
    jenis_kelamin: data.jenis_kelamin,
    email: data.email,
    kategori: data.status_kepegawaian,
    jenis_jabatan: data.jenis_jabatan,
    eselon: data.jenis_jabatan === "Struktural" ? data.eselon || null : null,
    jabatan: data.nama_jabatan,
    golongan: data.golongan,
    bidang: data.bidang,
    pendidikan: data.pendidikan_terakhir,
  };

  try {
    const { error } = await supabaseAdmin
      .from(tableName)
      .update(payload)
      .eq("id", id);

    if (error) {
      console.error("Supabase update error:", error);
      // Handle duplicate unique constraint
      if (error.code === "23505") {
        return {
          success: false,
          error: "Gagal: NIK atau NIP sudah terdaftar.",
        };
      }
      return { success: false, error: `Gagal: ${error.message}` };
    }

    revalidatePath("/");
    return {
      success: true,
      message: `Data pegawai ${payload.nama_lengkap} berhasil diperbarui.`,
    };
  } catch (err) {
    console.error("Unexpected error:", err);
    return {
      success: false,
      error: "Terjadi kesalahan yang tidak terduga saat memperbarui data.",
    };
  }
}
