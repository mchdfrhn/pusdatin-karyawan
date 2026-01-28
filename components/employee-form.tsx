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
import { addEmployee } from "@/app/actions";

const formSchema = z.object({
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
  tempat_lahir: z.string().optional(),
  tanggal_lahir: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Tanggal lahir tidak valid.",
  }),
  jenis_kelamin: z.enum(["Laki-laki", "Perempuan"], {
    required_error: "Pilih jenis kelamin.",
  }),
  email: z.string().email({
    message: "Email tidak valid.",
  }),

  // Kepegawaian
  status_kepegawaian: z.enum(["PNS", "CPNS", "PPPK", "KI", "PPnPN"], {
    required_error: "Pilih status kepegawaian.",
  }),
  jenis_jabatan: z.enum(["Struktural", "JFT", "JFU"], {
    required_error: "Pilih jenis jabatan.",
  }),
  eselon: z.string().optional(),
  nama_jabatan: z.string().min(1, { message: "Nama jabatan harus diisi." }),
  golongan: z.string().optional(),
  bidang: z.string().optional(),
  unit_kerja: z.string().min(1, { message: "Unit kerja harus diisi." }),
  instansi: z.string().optional(),

  // Pendidikan
  pendidikan_terakhir: z.enum(["SLTA", "D1-D3", "S1-D4", "S2", "S3"], {
    required_error: "Pilih pendidikan terakhir.",
  }),
});

type EmployeeFormValues = z.infer<typeof formSchema>;

interface EmployeeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: EmployeeFormValues) => void;
}

export function EmployeeForm({
  open,
  onOpenChange,
  onSubmit,
}: EmployeeFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: "",
      nik: "",
      nip: "",
      tempat_lahir: "",
      tanggal_lahir: "",
      email: "",
      nama_jabatan: "",
      golongan: "",
      bidang: "",
      unit_kerja: "",
      instansi: "",
    },
  });

  // Watch jenis_jabatan to conditionally show/hide/reset eselon
  const jenisJabatan = form.watch("jenis_jabatan");

  useEffect(() => {
    if (jenisJabatan !== "Struktural") {
      form.setValue("eselon", undefined);
    }
  }, [jenisJabatan, form]);

  function handleSubmit(data: EmployeeFormValues) {
    startTransition(async () => {
      const result = await addEmployee(data);

      if (result.success) {
        toast.success("Data pegawai berhasil disimpan");
        if (onSubmit) {
          onSubmit(data);
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
            Tambah Pegawai Baru
          </SheetTitle>
          <SheetDescription className="text-slate-500">
            Isi formulir berikut untuk menambahkan data pegawai ke dalam sistem.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <Form {...form}>
            <form
              id="employee-form"
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              {/* Section Identitas */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider border-b pb-2">
                  Identitas Diri
                </h3>

                <FormField
                  control={form.control}
                  name="nama"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Lengkap</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nama lengkap beserta gelar"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
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
                  <FormField
                    control={form.control}
                    name="nip"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>NIP</FormLabel>
                        <FormControl>
                          <Input placeholder="Nomor Induk Pegawai" {...field} />
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
                          <Input placeholder="Kota kelahiran" {...field} />
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
                </div>
              </div>

              {/* Section Kepegawaian */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider border-b pb-2 pt-2">
                  Data Kepegawaian
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="status_kepegawaian"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status Pegawai</FormLabel>
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
                            <SelectItem value="II">Eselon II</SelectItem>
                            <SelectItem value="III">Eselon III</SelectItem>
                            <SelectItem value="IV">Eselon IV</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="nama_jabatan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Jabatan</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Contoh: Analis Kebijakan Ahli Muda"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
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
                              <SelectValue placeholder="Pilih Golongan" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="I/a">I/a</SelectItem>
                            <SelectItem value="I/b">I/b</SelectItem>
                            <SelectItem value="I/c">I/c</SelectItem>
                            <SelectItem value="I/d">I/d</SelectItem>
                            <SelectItem value="II/a">II/a</SelectItem>
                            <SelectItem value="II/b">II/b</SelectItem>
                            <SelectItem value="II/c">II/c</SelectItem>
                            <SelectItem value="II/d">II/d</SelectItem>
                            <SelectItem value="III">III</SelectItem>
                            <SelectItem value="III/a">III/a</SelectItem>
                            <SelectItem value="III/b">III/b</SelectItem>
                            <SelectItem value="III/c">III/c</SelectItem>
                            <SelectItem value="III/d">III/d</SelectItem>
                            <SelectItem value="IV/a">IV/a</SelectItem>
                            <SelectItem value="IV/b">IV/b</SelectItem>
                            <SelectItem value="IV/c">IV/c</SelectItem>
                            <SelectItem value="IV/d">IV/d</SelectItem>
                            <SelectItem value="IV/e">IV/e</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bidang"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bidang</FormLabel>
                        <FormControl>
                          <Input placeholder="Nama Bidang" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="unit_kerja"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit Kerja</FormLabel>
                        <FormControl>
                          <Input placeholder="Nama Unit Kerja" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="instansi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instansi</FormLabel>
                        <FormControl>
                          <Input placeholder="Nama Instansi" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Section Pendidikan */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider border-b pb-2 pt-2">
                  Pendidikan
                </h3>

                <FormField
                  control={form.control}
                  name="pendidikan_terakhir"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pendidikan Terakhir</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Pendidikan" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="SLTA">SLTA / SMA / SMK</SelectItem>
                          <SelectItem value="D1-D3">
                            Diploma (D1 - D3)
                          </SelectItem>
                          <SelectItem value="S1-D4">
                            Sarjana (S1) / D4
                          </SelectItem>
                          <SelectItem value="S2">Magister (S2)</SelectItem>
                          <SelectItem value="S3">Doktor (S3)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
            {isPending ? "Menyimpan..." : "Simpan Data"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
