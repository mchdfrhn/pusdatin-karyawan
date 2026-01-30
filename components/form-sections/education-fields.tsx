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

export function EducationFields({ form }: FormSectionProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="pendidikan_terakhir"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jenjang</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                <Input
                  type="number"
                  placeholder="2010"
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
        name="nama_sekolah"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nama Institusi / Sekolah</FormLabel>
            <FormControl>
              <Input
                placeholder="Nama Kampus / Sekolah"
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="kota_negara"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kota / Negara</FormLabel>
              <FormControl>
                <Input
                  placeholder="Kota / Negara"
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
          name="jurusan_prodi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jurusan / Prodi</FormLabel>
              <FormControl>
                <Input
                  placeholder="Jurusan"
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
          name="no_ijazah_sttb"
          render={({ field }) => (
            <FormItem>
              <FormLabel>No. Ijazah</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nomor Ijazah"
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
          name="tanggal_lulus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tanggal Lulus</FormLabel>
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
