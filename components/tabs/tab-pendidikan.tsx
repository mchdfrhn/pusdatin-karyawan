"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Save, X, GraduationCap } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmployeeFormValues, employeeFormSchema } from "@/lib/schemas";
import { Form } from "@/components/ui/form";
import { EducationFields } from "@/components/form-sections/education-fields";
import { updateEmployee } from "@/app/actions";
import { toast } from "sonner";

interface TabPendidikanProps {
  employee: any;
  formData: EmployeeFormValues;
  employeeId: string;
}

function formatDate(dateString: string | null | undefined) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function InfoRow({
  label,
  value,
  fullWidth = false,
}: {
  label: string;
  value: string | undefined | null;
  fullWidth?: boolean;
}) {
  return (
    <div
      className={`py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 px-2 transition-colors ${fullWidth ? "block" : "grid grid-cols-1 sm:grid-cols-3"}`}
    >
      <div className="font-medium text-slate-500 text-sm mb-1 sm:mb-0">
        {label}
      </div>
      <div
        className={`text-slate-900 font-medium ${fullWidth ? "" : "sm:col-span-2"}`}
      >
        {value || "-"}
      </div>
    </div>
  );
}

export function TabPendidikan({
  employee,
  formData,
  employeeId,
}: TabPendidikanProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: formData,
  });

  const onSubmit = (data: EmployeeFormValues) => {
    startTransition(async () => {
      const result = await updateEmployee(employeeId, data);
      if (result.success) {
        toast.success("Data pendidikan berhasil diperbarui.");
        setIsEditing(false);
      } else {
        toast.error(result.error || "Gagal memperbarui data.");
      }
    });
  };

  if (isEditing) {
    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300">
        <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4">
          <h4 className="font-semibold text-blue-900 text-sm">
            Mode Ubah Data Pendidikan (Terakhir)
          </h4>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                form.reset(formData);
                setIsEditing(false);
              }}
              disabled={isPending}
              className="h-8 text-slate-500"
            >
              <X className="w-4 h-4 mr-1" /> Batal
            </Button>
            <Button
              size="sm"
              onClick={form.handleSubmit(onSubmit)}
              disabled={isPending}
              className="h-8 bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-1" />
              {isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </div>

        <Form {...form}>
          <form className="p-1">
            <EducationFields form={form} />
          </form>
        </Form>
      </div>
    );
  }

  // View Mode: Display the latest education from formData (which corresponds to is_latest)
  // We also show the list of history below it, but the edit mode only edits the "Latest" per current backend logic.

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300 relative">
      <div className="absolute right-0 top-0 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(true)}
          className="h-8 bg-white/50 hover:bg-white text-slate-500"
        >
          <Pencil className="w-3.5 h-3.5 mr-1" /> Ubah
        </Button>
      </div>

      <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
        <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
          <GraduationCap className="w-4 h-4 mr-2" />
          Pendidikan Terakhir (Latest)
        </h4>
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-2">
          <InfoRow label="Jenjang" value={formData.pendidikan_terakhir} />
          <InfoRow
            label="Tahun Lulus"
            value={String(formData.tahun_lulus || "-")}
          />
          <InfoRow label="Nama Sekolah/Univ" value={formData.nama_sekolah} />
          <InfoRow label="Jurusan/Prodi" value={formData.jurusan_prodi} />
          <InfoRow label="No. Ijazah" value={formData.no_ijazah_sttb} />
          <InfoRow
            label="Tanggal Lulus"
            value={formatDate(formData.tanggal_lulus)}
          />
          <InfoRow label="Kota / Negara" value={formData.kota_negara} />
        </div>
      </div>

      {/* Riwayat Table */}
      <div>
        <h4 className="font-semibold text-slate-900 mb-3 text-sm border-b pb-2">
          Riwayat Pendidikan Lengkap
        </h4>
        <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-100 text-slate-600 font-medium">
              <tr>
                <th className="px-4 py-2">Jenjang</th>
                <th className="px-4 py-2">Nama Sekolah</th>
                <th className="px-4 py-2">Jurusan</th>
                <th className="px-4 py-2">Tahun</th>
                <th className="px-4 py-2">Ijazah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employee.riwayat_pendidikan?.length > 0 ? (
                employee.riwayat_pendidikan.map((edu: any, index: number) => (
                  <tr key={index} className="hover:bg-slate-50">
                    <td className="px-4 py-2">{edu.jenjang}</td>
                    <td className="px-4 py-2">{edu.nama_sekolah}</td>
                    <td className="px-4 py-2">{edu.jurusan_prodi}</td>
                    <td className="px-4 py-2">{edu.tahun_lulus}</td>
                    <td className="px-4 py-2 text-slate-500">
                      {edu.no_ijazah_sttb}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-3 text-center text-slate-500"
                  >
                    Tidak ada data riwayat pendidikan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
