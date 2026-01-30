import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmployeeFormValues, employeeFormSchema } from "@/lib/schemas";
import { Form } from "@/components/ui/form";
import { PersonalFields } from "@/components/form-sections/personal-fields";
import { updateEmployee } from "@/app/actions";
import { toast } from "sonner";

interface TabPribadiProps {
  employee: any; // Raw
  formData: EmployeeFormValues; // Flattened
  employeeId: string;
}

export function TabPribadi({
  employee,
  formData,
  employeeId,
}: TabPribadiProps) {
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
        toast.success("Data pribadi berhasil diperbarui.");
        setIsEditing(false);
      } else {
        toast.error(result.error || "Gagal memperbarui data.");
      }
    });
  };

  if (isEditing) {
    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300">
        <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg border border-blue-100">
          <h4 className="font-semibold text-blue-900 text-sm">
            Mode Ubah Data Pribadi
          </h4>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                form.reset(formData); // Reset to original
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
            <PersonalFields form={form} />
          </form>
        </Form>
      </div>
    );
  }

  return (
    <div className="space-y-1 animate-in fade-in slide-in-from-right-2 duration-300 relative">
      <div className="absolute right-0 top-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(true)}
          className="h-8 bg-white/50 hover:bg-white text-slate-500"
        >
          <Pencil className="w-3.5 h-3.5 mr-1" /> Ubah
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <InfoRow label="Nama Lengkap" value={employee.nama_lengkap} />
          <InfoRow label="Nama Tanpa Gelar" value={employee.nama_tanpa_gelar} />
          <InfoRow label="Gelar Belakang" value={employee.gelar_belakang} />
          <InfoRow label="NIK" value={formData.nik} />
          <InfoRow label="NPWP" value={formData.npwp} />
        </div>
        <div className="space-y-1">
          <InfoRow label="Tempat Lahir" value={formData.tempat_lahir} />
          <InfoRow
            label="Tanggal Lahir"
            value={formatDate(formData.tanggal_lahir)}
          />
          <InfoRow label="Jenis Kelamin" value={formData.jenis_kelamin} />
          <InfoRow label="Agama" value={formData.agama} />
          <InfoRow
            label="Tahun Pengangkatan"
            value={String(formData.tahun_pengangkatan || "-")}
          />
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-100">
        <h4 className="font-semibold text-slate-900 mb-2">Kontak & Alamat</h4>
        <InfoRow label="Alamat Lengkap" value={formData.alamat} />
        <InfoRow label="Email" value={formData.email} />
        <InfoRow label="No. Handphone" value={formData.no_handphone} />
      </div>
    </div>
  );
}

// Inline InfoRow for now to avoid multiple files if not needed globally yet
function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string | undefined | null;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 px-2 transition-colors">
      <div className="font-medium text-slate-500 text-sm mb-1 sm:mb-0">
        {label}
      </div>
      <div className="sm:col-span-2 text-slate-900 font-medium">
        {value || "-"}
      </div>
    </div>
  );
}

// Helper for date formatting
function formatDate(dateString: string | null | undefined) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
