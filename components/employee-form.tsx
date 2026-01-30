"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { useEffect, useTransition } from "react";
import { toast } from "sonner";
import { addEmployee, updateEmployee } from "@/app/actions";
import {
  employeeFormSchema,
  EmployeeFormValues,
  defaultEmployeeValues,
} from "@/lib/schemas";

interface EmployeeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (message: string) => void;
  initialData?: EmployeeFormValues;
  employeeId?: string;
}

export function EmployeeForm({
  open,
  onOpenChange,
  onSuccess,
  initialData,
  employeeId,
}: EmployeeFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: initialData || defaultEmployeeValues,
  });

  // Reset form when initialData changes or open state changes
  useEffect(() => {
    if (open) {
      form.reset(initialData || defaultEmployeeValues);
    }
  }, [initialData, open, form]);

  // Watch jenis_jabatan to conditionally show/hide/reset eselon
  const jenisJabatan = form.watch("jenis_jabatan");

  useEffect(() => {
    if (jenisJabatan !== "Struktural") {
      form.setValue("eselon", undefined);
    }
  }, [jenisJabatan, form]);

  function handleSubmit(data: EmployeeFormValues) {
    startTransition(async () => {
      let result;
      if (employeeId) {
        result = await updateEmployee(employeeId, data);
      } else {
        result = await addEmployee(data);
      }

      if (result.success) {
        const message = result.message || "Data pegawai berhasil disimpan";

        if (onSuccess) {
          onSuccess(message);
        } else {
          sessionStorage.setItem("toast_message", message);
          window.location.reload();
        }

        onOpenChange(false);
        form.reset();
      } else {
        toast.error(result.error || "Gagal menyimpan data pegawai");
      }
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] p-0 flex flex-col h-full bg-white">
        <SheetHeader className="px-6 py-4 border-b border-slate-100 flex-none bg-white z-10">
          <SheetTitle className="text-xl font-bold text-slate-900">
            {employeeId ? "Ubah Data Pegawai" : "Tambah Pegawai Baru"}
          </SheetTitle>
          <SheetDescription className="text-slate-500">
            {employeeId
              ? "Perbarui informasi data pegawai."
              : "Isi formulir berikut untuk menambahkan data pegawai ke dalam sistem."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <Form {...form}>
            <form
              id="employee-form"
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider border-b pb-2">
                  Identitas Diri
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nama"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Lengkap</FormLabel>
                        <FormControl>
                          <Input placeholder="Nama Lengkap" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nik"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>NIK</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="16 digit NIK"
                            maxLength={16}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nip"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>NIP / NRP</FormLabel>
                        <FormControl>
                          <Input placeholder="NIP / NRP" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="npwp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>NPWP</FormLabel>
                        <FormControl>
                          <Input placeholder="NPWP" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="gelar_belakang"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gelar Belakang</FormLabel>
                        <FormControl>
                          <Input placeholder="Contoh: S.Kom" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nama_tanpa_gelar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Tanpa Gelar</FormLabel>
                        <FormControl>
                          <Input placeholder="Nama tanpa gelar" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tempat_lahir"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tempat Lahir</FormLabel>
                        <FormControl>
                          <Input placeholder="Kota Lahir" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tanggal_lahir"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tanggal Lahir</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="jenis_kelamin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jenis Kelamin</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                            <SelectItem value="Perempuan">Perempuan</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="agama"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Agama</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Agama" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Islam">Islam</SelectItem>
                            <SelectItem value="Kristen">Kristen</SelectItem>
                            <SelectItem value="Katolik">Katolik</SelectItem>
                            <SelectItem value="Hindu">Hindu</SelectItem>
                            <SelectItem value="Buddha">Buddha</SelectItem>
                            <SelectItem value="Konghucu">Konghucu</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="email@contoh.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="no_handphone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>No. Handphone</FormLabel>
                        <FormControl>
                          <Input placeholder="0812..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="alamat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat Lengkap</FormLabel>
                      <FormControl>
                        <Input placeholder="Alamat domisili" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* KEPEGAWAIAN */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider border-b pb-2 pt-2">
                  Status Kepegawaian
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="status_kepegawaian"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status Keaktifan</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="PNS">PNS</SelectItem>
                            <SelectItem value="CPNS">CPNS</SelectItem>
                            <SelectItem value="PPPK">PPPK</SelectItem>
                            <SelectItem value="KI">KI</SelectItem>
                            <SelectItem value="PPnPN">PPnPN</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tahun_pengangkatan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tahun Pengangkatan</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="2024" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="grade_tukin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grade Tukin</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Grade" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bidang"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bidang / Unit</FormLabel>
                        <FormControl>
                          <Input placeholder="Nama Bidang" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* JABATAN */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider border-b pb-2 pt-2">
                  Jabatan
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="jenis_jabatan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jenis Jabatan</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Jenis" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Struktural">
                              Struktural
                            </SelectItem>
                            <SelectItem value="JFT">JFT</SelectItem>
                            <SelectItem value="JFU">JFU</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nama_jabatan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Jabatan</FormLabel>
                        <FormControl>
                          <Input placeholder="Nama Jabatan" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {jenisJabatan === "Struktural" && (
                  <FormField
                    control={form.control}
                    name="eselon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Eselon</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Eselon" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="II.a">II.a</SelectItem>
                            <SelectItem value="II.b">II.b</SelectItem>
                            <SelectItem value="III.a">III.a</SelectItem>
                            <SelectItem value="III.b">III.b</SelectItem>
                            <SelectItem value="IV.a">IV.a</SelectItem>
                            <SelectItem value="IV.b">IV.b</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tmt_jabatan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>TMT Jabatan</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lama_menjabat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lama Menjabat</FormLabel>
                        <FormControl>
                          <Input placeholder="Contoh: 2 Tahun" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* PANGKAT */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider border-b pb-2 pt-2">
                  Pangkat / Golongan
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="golongan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Golongan</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="III/a">III/a</SelectItem>
                            <SelectItem value="III/b">III/b</SelectItem>
                            <SelectItem value="III/c">III/c</SelectItem>
                            <SelectItem value="III/d">III/d</SelectItem>
                            <SelectItem value="IV/a">IV/a</SelectItem>
                            <SelectItem value="IV/b">IV/b</SelectItem>
                            <SelectItem value="IV/c">IV/c</SelectItem>
                            <SelectItem value="IV/d">IV/d</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tmt_pangkat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>TMT Pangkat</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="masa_kerja"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Masa Kerja</FormLabel>
                        <FormControl>
                          <Input placeholder="Contoh: 10 Tahun" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* PENDIDIKAN */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider border-b pb-2 pt-2">
                  Pendidikan Terakhir
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="pendidikan_terakhir"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jenjang</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Jenjang" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="SLTA">SLTA</SelectItem>
                            <SelectItem value="D3">D3</SelectItem>
                            <SelectItem value="D4">D4</SelectItem>
                            <SelectItem value="S1">S1</SelectItem>
                            <SelectItem value="S2">S2</SelectItem>
                            <SelectItem value="S3">S3</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tahun_lulus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tahun Lulus</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="2010" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="nama_sekolah"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Institusi / Sekolah</FormLabel>
                      <FormControl>
                        <Input placeholder="Nama Kampus / Sekolah" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="jurusan_prodi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jurusan / Prodi</FormLabel>
                        <FormControl>
                          <Input placeholder="Jurusan" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="no_ijazah_sttb"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>No. Ijazah</FormLabel>
                        <FormControl>
                          <Input placeholder="Nomor Ijazah" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </form>
          </Form>
        </div>

        <SheetFooter className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex-none">
          <SheetClose asChild>
            <Button variant="outline" className="mr-2" disabled={isPending}>
              Batal
            </Button>
          </SheetClose>
          <Button
            type="submit"
            form="employee-form"
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isPending}
          >
            {isPending
              ? "Menyimpan..."
              : employeeId
                ? "Simpan Perubahan"
                : "Simpan Data"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
