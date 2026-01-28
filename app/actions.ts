"use server";

import { supabase } from "@/lib/supabase/client";
import { revalidatePath } from "next/cache";

export type EmployeeFormValues = {
  nama: string;
  nik: string;
  nip?: string;
  tempat_lahir?: string;
  tanggal_lahir: string;
  jenis_kelamin: "Laki-laki" | "Perempuan";
  email: string;
  status_kepegawaian: "PNS" | "CPNS" | "PPPK" | "KI" | "PPnPN";
  jenis_jabatan: "Struktural" | "JFT" | "JFU";
  eselon?: string;
  nama_jabatan: string;
  golongan?: string;
  bidang?: string;
  unit_kerja: string;
  instansi?: string;
  pendidikan_terakhir: "SLTA" | "D1-D3" | "S1-D4" | "S2" | "S3";
};

export async function addEmployee(data: EmployeeFormValues) {
  const tableName =
    process.env.NEXT_PUBLIC_SUPABASE_EMPLOYEE_TABLE || "employees";

  // Map form values to database columns
  const payload = {
    nama: data.nama,
    nik: data.nik,
    nip: data.nip,
    tempat_lahir: data.tempat_lahir,
    tanggal_lahir: data.tanggal_lahir,
    jenis_kelamin: data.jenis_kelamin,
    email: data.email,
    status_kepegawaian: data.status_kepegawaian,
    jenis_jabatan: data.jenis_jabatan,
    eselon: data.eselon === "Non-Eselon" ? null : data.eselon,
    jabatan: data.nama_jabatan, // Mapped to 'jabatan'
    golongan: data.golongan,
    bidang: data.bidang,
    unit_kerja: data.unit_kerja,
    instansi: data.instansi,
    pendidikan_terakhir: data.pendidikan_terakhir,
    created_at: new Date().toISOString(),
  };

  try {
    const { error } = await supabase.from(tableName).insert([payload]);

    if (error) {
      console.error("Supabase insert error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/"); // Revalidate the home page to show new data
    return { success: true };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}
