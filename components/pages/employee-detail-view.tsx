"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pencil,
  Trash2,
  ArrowLeft,
  Loader2,
  Briefcase,
  GraduationCap,
  Award,
  FileText,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { EmployeeForm } from "@/components/employee-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteEmployee, updateEmployee } from "@/app/actions";
import { EmployeeFormValues } from "@/lib/schemas";
import { TabPribadi } from "@/components/tabs/tab-pribadi";
import { TabKepegawaian } from "@/components/tabs/tab-kepegawaian";
import { TabPendidikan } from "@/components/tabs/tab-pendidikan";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface EmployeeDetailViewProps {
  employee: any; // Raw nested Supabase data
}

function formatDate(dateString: string | null | undefined) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function EmployeeDetailView({ employee }: EmployeeDetailViewProps) {
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Flatten data for Form
  const formData: EmployeeFormValues = {
    nama: employee.nama_lengkap || "",
    nik: employee.nik_ktp || "",
    nip: employee.nip_nrp || "",
    npwp: employee.npwp || "",
    nama_tanpa_gelar: employee.nama_tanpa_gelar || "",
    gelar_belakang: employee.gelar_belakang || "",

    tempat_lahir: employee.tempat_lahir || "",
    tanggal_lahir: employee.tgl_lahir || "",
    jenis_kelamin: employee.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan",
    agama: employee.agama || "Islam",

    alamat: employee.alamat || "",
    no_handphone: employee.no_handphone || "",
    email: employee.email || "",

    tahun_pengangkatan: employee.tahun_pengangkatan || undefined,

    // Status Kepegawaian
    status_kepegawaian:
      employee.status_kepegawaian?.[0]?.status_keaktifan || "PNS",
    status_jabatan: employee.status_kepegawaian?.[0]?.status_jabatan || "Aktif",
    grade_tukin: employee.status_kepegawaian?.[0]?.grade_tukin || undefined,
    bidang: employee.status_kepegawaian?.[0]?.bidang_unit || undefined,
    bup: employee.status_kepegawaian?.[0]?.bup || undefined,
    usia_pensiun_2025:
      employee.status_kepegawaian?.[0]?.usia_pensiun_2025 || undefined,

    // Jabatan Checks (Naive check for "current" - assuming latest ID or logic)
    // Here we just check availability as per previous logic
    jenis_jabatan:
      employee.jabatan_struktural?.length > 0
        ? "Struktural"
        : employee.jabatan_fungsional?.length > 0
          ? "JFT"
          : employee.jabatan_umum?.length > 0
            ? "JFU"
            : "Struktural",

    nama_jabatan:
      employee.jabatan_struktural?.[0]?.nama_jabatan ||
      employee.jabatan_fungsional?.[0]?.nama_jabatan ||
      employee.jabatan_umum?.[0]?.nama_jabatan ||
      "",

    eselon: employee.jabatan_struktural?.[0]?.eselon || undefined,
    tmt_jabatan:
      employee.jabatan_struktural?.[0]?.tmt_jabatan ||
      employee.jabatan_fungsional?.[0]?.tmt_jabatan ||
      employee.jabatan_umum?.[0]?.tmt_jabatan ||
      undefined,

    lama_menjabat:
      employee.jabatan_struktural?.[0]?.lama_menjabat ||
      employee.jabatan_fungsional?.[0]?.lama_menjabat ||
      undefined,

    jenjang_jabatan:
      employee.jabatan_fungsional?.[0]?.jenjang_jabatan || undefined,
    nama_jft_tukin:
      employee.jabatan_fungsional?.[0]?.nama_jft_tukin || undefined,

    unit_eselon_3: employee.jabatan_umum?.[0]?.unit_eselon_3 || undefined,
    unit_tugas_adhoc: employee.jabatan_umum?.[0]?.unit_tugas_adhoc || undefined,
    atasan_langsung: employee.jabatan_umum?.[0]?.atasan_langsung || undefined,
    uraian_tugas_utama:
      employee.jabatan_umum?.[0]?.uraian_tugas_utama || undefined,
    sk_kapusdatin: employee.jabatan_umum?.[0]?.sk_kapusdatin || undefined,

    golongan:
      employee.riwayat_pangkat?.find((p: any) => p.is_current)?.gol_ruang || "",
    tmt_pangkat:
      employee.riwayat_pangkat?.find((p: any) => p.is_current)?.tmt_pangkat ||
      undefined,
    masa_kerja:
      employee.riwayat_pangkat?.find((p: any) => p.is_current)?.masa_kerja ||
      undefined,

    pendidikan_terakhir:
      employee.riwayat_pendidikan?.find((p: any) => p.is_latest)?.jenjang ||
      "S1",
    nama_sekolah:
      employee.riwayat_pendidikan?.find((p: any) => p.is_latest)
        ?.nama_sekolah || undefined,
    kota_negara:
      employee.riwayat_pendidikan?.find((p: any) => p.is_latest)?.kota_negara ||
      undefined,
    jurusan_prodi:
      employee.riwayat_pendidikan?.find((p: any) => p.is_latest)
        ?.jurusan_prodi || undefined,
    tahun_lulus:
      employee.riwayat_pendidikan?.find((p: any) => p.is_latest)?.tahun_lulus ||
      undefined,
    no_ijazah_sttb:
      employee.riwayat_pendidikan?.find((p: any) => p.is_latest)
        ?.no_ijazah_sttb || undefined,
    tanggal_lulus:
      employee.riwayat_pendidikan?.find((p: any) => p.is_latest)
        ?.tanggal_lulus || undefined,
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteEmployee(employee.id);
    if (result.success) {
      toast.success("Data pegawai berhasil dihapus.");
      router.push("/dashboard");
    } else {
      toast.error(result.error);
    }
    setIsDeleting(false);
  };

  const InfoRow = ({
    label,
    value,
    fullWidth = false,
  }: {
    label: string;
    value: string | undefined | null;
    fullWidth?: boolean;
  }) => (
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

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-slate-600 hover:text-slate-900 group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Kembali
        </Button>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsEditOpen(true)}
            variant="outline"
            className="shadow-sm"
          >
            <Pencil className="mr-2 h-4 w-4" />
            Ubah Data
          </Button>
          <Button
            onClick={() => setIsDeleteDialogOpen(true)}
            variant="destructive"
            className="shadow-sm"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Hapus Data
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1 shadow-md border-slate-200 h-fit">
          <CardHeader className="text-center pb-2">
            <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-slate-400">
              {formData.nama.charAt(0)}
            </div>
            <CardTitle className="text-xl leading-snug">
              {formData.nama}
            </CardTitle>
            {formData.gelar_belakang && (
              <div className="text-sm text-slate-500">
                {formData.gelar_belakang}
              </div>
            )}
            <div className="text-sm text-slate-500 font-medium mt-1">
              {formData.nip}
            </div>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <div className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                {formData.status_kepegawaian}
              </div>
              {formData.status_jabatan && (
                <div className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                  {formData.status_jabatan}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4 border-t border-slate-100 mt-4">
            <div className="space-y-1">
              <div className="text-xs text-slate-400 uppercase font-semibold tracking-wider">
                Jabatan
              </div>
              <div className="text-sm font-medium">{formData.nama_jabatan}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-slate-400 uppercase font-semibold tracking-wider">
                Unit / Bidang
              </div>
              <div className="text-sm font-medium">
                {formData.bidang || "-"}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-slate-400 uppercase font-semibold tracking-wider">
                Masa Kerja
              </div>
              <div className="text-sm font-medium">
                {formData.masa_kerja || "-"}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Tabs */}
        <Card className="md:col-span-2 shadow-md border-slate-200">
          <Tabs defaultValue="pribadi" className="w-full">
            <CardHeader className="border-b border-slate-100 pb-0">
              <TabsList className="bg-transparent w-full justify-start p-0 h-auto flex-wrap gap-2">
                <TabsTrigger
                  value="pribadi"
                  className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-none px-3 py-2 h-auto text-xs sm:text-sm"
                >
                  Data Pribadi
                </TabsTrigger>
                <TabsTrigger
                  value="kepegawaian"
                  className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-none px-3 py-2 h-auto text-xs sm:text-sm"
                >
                  Kepegawaian
                </TabsTrigger>
                <TabsTrigger
                  value="pendidikan"
                  className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-none px-3 py-2 h-auto text-xs sm:text-sm"
                >
                  Pendidikan
                </TabsTrigger>
                <TabsTrigger
                  value="diklat"
                  className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-none px-3 py-2 h-auto text-xs sm:text-sm"
                >
                  Diklat
                </TabsTrigger>
                <TabsTrigger
                  value="tugas"
                  className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-none px-3 py-2 h-auto text-xs sm:text-sm"
                >
                  Tugas Tambahan
                </TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent className="pt-6 min-h-[400px]">
              <TabsContent value="pribadi" className="space-y-1">
                <TabPribadi
                  employee={employee}
                  formData={formData}
                  employeeId={employee.id}
                />
              </TabsContent>

              <TabsContent value="kepegawaian" className="space-y-1">
                <TabKepegawaian
                  employee={employee}
                  formData={formData}
                  employeeId={employee.id}
                />
              </TabsContent>

              <TabsContent
                value="pendidikan"
                className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300"
              >
                <div className="overflow-x-auto rounded-md border border-slate-200">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead>Jenjang</TableHead>
                        <TableHead>Nama Sekolah / Institusi</TableHead>
                        <TableHead>Jurusan / Prodi</TableHead>
                        <TableHead>Tahun Lulus</TableHead>
                        <TableHead>No. Ijazah</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employee.riwayat_pendidikan &&
                      employee.riwayat_pendidikan.length > 0 ? (
                        employee.riwayat_pendidikan
                          .sort(
                            (a: any, b: any) =>
                              (b.tahun_lulus || 0) - (a.tahun_lulus || 0),
                          )
                          .map((edu: any) => (
                            <TableRow key={edu.id}>
                              <TableCell className="font-medium">
                                {edu.jenjang}
                                {edu.is_latest && (
                                  <span className="ml-2 text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                                    Latest
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>{edu.nama_sekolah || "-"}</TableCell>
                              <TableCell>{edu.jurusan_prodi || "-"}</TableCell>
                              <TableCell>{edu.tahun_lulus || "-"}</TableCell>
                              <TableCell className="text-xs text-slate-500">
                                {edu.no_ijazah_sttb || "-"}
                              </TableCell>
                            </TableRow>
                          ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center py-8 text-slate-500"
                          >
                            Belum ada data pendidikan.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent
                value="diklat"
                className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300"
              >
                <div className="overflow-x-auto rounded-md border border-slate-200">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead>Nama Diklat</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead>Lokasi</TableHead>
                        <TableHead>Tanggal Mulai</TableHead>
                        <TableHead>Tanggal Selesai</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employee.riwayat_diklat &&
                      employee.riwayat_diklat.length > 0 ? (
                        employee.riwayat_diklat
                          .sort(
                            (a: any, b: any) =>
                              new Date(b.tgl_mulai).getTime() -
                              new Date(a.tgl_mulai).getTime(),
                          )
                          .map((diklat: any) => (
                            <TableRow key={diklat.id}>
                              <TableCell className="font-medium">
                                {diklat.nama_diklat}
                              </TableCell>
                              <TableCell>{diklat.kategori}</TableCell>
                              <TableCell>{diklat.lokasi || "-"}</TableCell>
                              <TableCell>
                                {formatDate(diklat.tgl_mulai)}
                              </TableCell>
                              <TableCell>
                                {formatDate(diklat.tgl_selesai)}
                              </TableCell>
                            </TableRow>
                          ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center py-8 text-slate-500"
                          >
                            Belum ada data diklat.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent
                value="tugas"
                className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300"
              >
                <div className="overflow-x-auto rounded-md border border-slate-200">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead>Nama Tugas Tambahan</TableHead>
                        <TableHead>SK Referensi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employee.tugas_tambahan &&
                      employee.tugas_tambahan.length > 0 ? (
                        employee.tugas_tambahan.map((tugas: any) => (
                          <TableRow key={tugas.id}>
                            <TableCell className="font-medium">
                              {tugas.nama_tugas}
                            </TableCell>
                            <TableCell>{tugas.sk_referensi || "-"}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={2}
                            className="text-center py-8 text-slate-500"
                          >
                            Belum ada data tugas tambahan.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>

      <EmployeeForm
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        initialData={formData}
        employeeId={employee.id}
        onSuccess={() => {
          window.location.reload();
        }}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Data Pegawai?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data pegawai{" "}
              <b>{formData.nama}</b> beserta riwayatnya akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Ya, Hapus"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
