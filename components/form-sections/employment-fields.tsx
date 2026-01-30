"use client";

import {
  FormControl,
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
import { UseFormReturn } from "react-hook-form";
import { EmployeeFormValues } from "@/lib/schemas";

interface FormSectionProps {
  form: UseFormReturn<EmployeeFormValues>;
}

export function EmploymentFields({ form }: FormSectionProps) {
  const jenisJabatan = form.watch("jenis_jabatan");

  return (
    <div className="space-y-6">
      {/* STATUS KEPEGAWAIAN */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider border-b pb-2">
          Status & Tukin
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NIP / NRP</FormLabel>
                <FormControl>
                  <Input
                    placeholder="NIP / NRP"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="status_jabatan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status Jabatan</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Aktif / Tugas Belajar"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="grade_tukin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grade Tukin</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Grade"
                    {...field}
                    value={field.value ?? ""}
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
            name="bup"
            render={({ field }) => (
              <FormItem>
                <FormLabel>BUP (Pensiun)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Usia (Tahun)"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="usia_pensiun_2025"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Usia Pensiun 2025</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Usia (Tahun)"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* JABATAN */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider border-b pb-2">
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
                    <SelectItem value="Struktural">Struktural</SelectItem>
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
                  <Input
                    placeholder="Nama Jabatan"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="bidang"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bidang / Unit</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nama Bidang"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Dynamic Fields based on Jenis Jabatan */}
        {jenisJabatan === "Struktural" && (
          <div className="grid grid-cols-2 gap-4">
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
          </div>
        )}

        {jenisJabatan === "JFT" && (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="jenjang_jabatan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenjang Jabatan</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ahli Muda..."
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nama_jft_tukin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama JFT Tukin</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nama di Tukin"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {jenisJabatan === "JFU" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="unit_eselon_3"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit Eselon 3</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nama Unit"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit_tugas_adhoc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit Tugas Adhoc</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Unit Adhoc"
                        {...field}
                        value={field.value ?? ""}
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
                name="atasan_langsung"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Atasan Langsung</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nama Atasan"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sk_kapusdatin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SK Kapusdatin</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nomor SK"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="uraian_tugas_utama"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Uraian Tugas Utama</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Deskripsi Tugas"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="tmt_jabatan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>TMT Jabatan</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value ?? ""} />
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
                  <Input
                    placeholder="Contoh: 2 Tahun"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* PANGKAT */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider border-b pb-2">
          Pangkat & Golongan
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="golongan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Golongan Ruang</FormLabel>
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
            name="masa_kerja"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Masa Kerja</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Contoh: 10 Tahun"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="tmt_pangkat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>TMT Pangkat</FormLabel>
              <FormControl>
                <Input type="date" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
