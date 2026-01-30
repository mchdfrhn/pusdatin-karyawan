"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Save, X, Briefcase, Award } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmployeeFormValues, employeeFormSchema } from "@/lib/schemas";
import { Form } from "@/components/ui/form";
import { EmploymentFields } from "@/components/form-sections/employment-fields";
import { updateEmployee } from "@/app/actions";
import { toast } from "sonner";

interface TabKepegawaianProps {
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

export function TabKepegawaian({
  employee,
  formData,
  employeeId,
}: TabKepegawaianProps) {
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
        toast.success("Data kepegawaian berhasil diperbarui.");
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
            Mode Ubah Data Kepegawaian
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
            <EmploymentFields form={form} />
          </form>
        </Form>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300 relative">
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
          <Briefcase className="w-4 h-4 mr-2" />
          Status & Jabatan Saat Ini
        </h4>
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-2">
          <InfoRow
            label="Status Kepegawaian"
            value={formData.status_kepegawaian}
          />
          <InfoRow label="Status Jabatan" value={formData.status_jabatan} />
          <InfoRow label="Jenis Jabatan" value={formData.jenis_jabatan} />
          <InfoRow label="Nama Jabatan" value={formData.nama_jabatan} />
          <InfoRow
            label="Grade Tukin"
            value={String(formData.grade_tukin || "-")}
          />
          <InfoRow
            label="BUP (Pensiun)"
            value={String(formData.bup || "-") + " Tahun"}
          />
          <InfoRow
            label="Usia Pensiun 2025"
            value={String(formData.usia_pensiun_2025 || "-") + " Tahun"}
          />
        </div>
      </div>

      {formData.jenis_jabatan === "Struktural" && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h4 className="font-semibold text-blue-900 mb-3 text-sm">
            Detail Struktural
          </h4>
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-2">
            <InfoRow label="Eselon" value={formData.eselon} />
            <InfoRow
              label="TMT Jabatan"
              value={formatDate(formData.tmt_jabatan)}
            />
            <InfoRow label="Lama Menjabat" value={formData.lama_menjabat} />
          </div>
        </div>
      )}
      {formData.jenis_jabatan === "JFT" && (
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <h4 className="font-semibold text-green-900 mb-3 text-sm">
            Detail Fungsional Tertentu
          </h4>
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-2">
            <InfoRow label="Jenjang Jabatan" value={formData.jenjang_jabatan} />
            <InfoRow label="Nama JFT Tukin" value={formData.nama_jft_tukin} />
            <InfoRow
              label="TMT Jabatan"
              value={formatDate(formData.tmt_jabatan)}
            />
          </div>
        </div>
      )}
      {formData.jenis_jabatan === "JFU" && (
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
          <h4 className="font-semibold text-orange-900 mb-3 text-sm">
            Detail Fungsional Umum (Pelaksana)
          </h4>
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-2">
            <InfoRow label="Unit Eselon 3" value={formData.unit_eselon_3} />
            <InfoRow
              label="Unit Tugas Adhoc"
              value={formData.unit_tugas_adhoc}
            />
            <InfoRow label="Atasan Langsung" value={formData.atasan_langsung} />
            <InfoRow label="SK Kapusdatin" value={formData.sk_kapusdatin} />
            <InfoRow
              label="Uraian Tugas"
              value={formData.uraian_tugas_utama}
              fullWidth
            />
          </div>
        </div>
      )}

      <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
        <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
          <Award className="w-4 h-4 mr-2" />
          Pangkat & Golongan
        </h4>
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-2">
          <InfoRow label="Golongan Ruang" value={formData.golongan} />
          <InfoRow
            label="TMT Pangkat"
            value={formatDate(formData.tmt_pangkat)}
          />
          <InfoRow label="Masa Kerja" value={formData.masa_kerja} />
        </div>
      </div>
    </div>
  );
}
