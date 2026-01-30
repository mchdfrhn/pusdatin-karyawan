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
import { PersonalFields } from "./form-sections/personal-fields";
import { EmploymentFields } from "./form-sections/employment-fields";
import { EducationFields } from "./form-sections/education-fields";

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
                <PersonalFields form={form} />
              </div>

              {/* KEPEGAWAIAN, JABATAN, PANGKAT merged in EmploymentFields */}
              <EmploymentFields form={form} />

              {/* PENDIDIKAN */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider border-b pb-2 pt-2">
                  Pendidikan Terakhir
                </h3>
                <EducationFields form={form} />
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
