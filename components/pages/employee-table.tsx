"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Filter,
  Users,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  Plus,
  Trash2,
  Pencil,
} from "lucide-react";
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
import { deleteEmployee } from "@/app/actions";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { RawRow } from "@/lib/data/employee-stats";

type EmployeeTableProps = {
  rows: RawRow[];
  status: "loading" | "ready" | "error";
  error: string | null;
  isEditMode?: boolean;
  onEdit?: (row: RawRow) => void;
};

type Column = {
  key: string;
  label: string;
};

type FilterOption = {
  value: string;
  label: string;
};

const DEFAULT_PAGE_SIZE = 20;
const COLUMN_OVERRIDE = process.env.NEXT_PUBLIC_EMPLOYEE_TABLE_COLUMNS;
const EDUCATION_KEYS = [
  "pendidikan_terakhir",
  "pendidikan",
  "education",
  "education_level",
  "tingkat_pendidikan",
  "tingkatpendidikan",
];
const CATEGORY_KEYS = [
  "kategori",
  "status",
  "status_pegawai",
  "statuspegawai",
  "status_kepegawaian",
  "jenis_pegawai",
  "kategoripegawai",
];
const GENDER_KEYS = ["gender", "jenis_kelamin", "jeniskelamin", "jk", "sex"];

const COLUMN_LABELS: Record<string, string> = {
  nama: "Nama",
  name: "Nama",
  nip: "NIP",
  nik: "NIK",
  nup: "NUP",
  status: "Status",
  status_pegawai: "Status",
  statuspegawai: "Status",
  status_kepegawaian: "Status",
  jenis_pegawai: "Jenis Pegawai",
  kategori: "Kategori",
  gender: "Gender",
  jenis_kelamin: "Gender",
  jeniskelamin: "Gender",
  jk: "Gender",
  usia: "Usia",
  umur: "Usia",
  age: "Usia",
  tanggal_lahir: "Tanggal Lahir",
  tgl_lahir: "Tanggal Lahir",
  birth_date: "Tanggal Lahir",
  pendidikan: "Pendidikan",
  pendidikan_terakhir: "Pendidikan",
  pendidikanterakhir: "Pendidikan",
  jabatan: "Jabatan",
  position: "Jabatan",
  job_title: "Jabatan",
  golongan: "Golongan",
  department: "Golongan",
  golongan_ruang: "Golongan",
  unit_kerja: "Unit Kerja",
  unitkerja: "Unit Kerja",
  instansi: "Instansi",
  created_at: "Dibuat",
  updated_at: "Diubah",
};

const COLUMN_PRIORITY = [
  "nama",
  "name",
  "nip",
  "nik",
  "nup",
  "status",
  "status_pegawai",
  "status_kepegawaian",
  "jenis_pegawai",
  "kategori",
  "gender",
  "jenis_kelamin",
  "jk",
  "usia",
  "umur",
  "age",
  "tanggal_lahir",
  "tgl_lahir",
  "birth_date",
  "pendidikan",
  "pendidikan_terakhir",
  "jabatan",
  "position",
  "job_title",
  "golongan",
  "department",
  "golongan_ruang",
  "unit_kerja",
  "instansi",
  "created_at",
  "updated_at",
];

function humanizeKey(key: string) {
  const lower = key.toLowerCase();
  if (COLUMN_LABELS[lower]) {
    return COLUMN_LABELS[lower];
  }
  return lower
    .replace(/_/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function buildColumns(rows: RawRow[], override?: string): Column[] {
  if (!rows.length) {
    return [];
  }

  const keys = new Set<string>();
  rows.slice(0, 50).forEach((row) => {
    Object.keys(row).forEach((key) => keys.add(key));
  });

  const keyLookup = new Map<string, string>();
  keys.forEach((key) => keyLookup.set(key.toLowerCase(), key));

  const selected: Column[] = [];
  const used = new Set<string>();

  if (override) {
    override
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .forEach((rawKey) => {
        const actual = keyLookup.get(rawKey.toLowerCase());
        if (actual && !used.has(actual)) {
          used.add(actual);
          selected.push({ key: actual, label: humanizeKey(actual) });
        }
      });
    if (selected.length) {
      return selected;
    }
  }

  COLUMN_PRIORITY.forEach((priorityKey) => {
    const actual = keyLookup.get(priorityKey);
    if (actual && !used.has(actual)) {
      used.add(actual);
      selected.push({ key: actual, label: humanizeKey(actual) });
    }
  });

  Array.from(keys)
    .filter((key) => !used.has(key))
    .sort((a, b) => a.localeCompare(b, "id"))
    .forEach((key) => selected.push({ key, label: humanizeKey(key) }));

  return selected;
}

function findKey(rows: RawRow[], candidates: string[]): string | null {
  if (!rows.length) {
    return null;
  }
  const keyLookup = new Map<string, string>();
  rows.slice(0, 50).forEach((row) => {
    Object.keys(row).forEach((key) => keyLookup.set(key.toLowerCase(), key));
  });
  for (const candidate of candidates) {
    const actual = keyLookup.get(candidate.toLowerCase());
    if (actual) {
      return actual;
    }
  }
  return null;
}

function valueToText(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (Array.isArray(value)) {
    return value.map((item) => valueToText(item)).join(" ");
  }
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  if (typeof value === "number") {
    return value.toLocaleString("id-ID");
  }
  if (typeof value === "boolean") {
    return value ? "Ya" : "Tidak";
  }
  if (value instanceof Date) {
    return value.toLocaleDateString("id-ID");
  }
  if (Array.isArray(value)) {
    return value.map((item) => formatValue(item)).join(", ");
  }
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

function getRowKey(row: RawRow, fallback: number): string {
  const candidateKeys = ["id", "uuid", "nip", "nik", "nup"];
  for (const key of Object.keys(row)) {
    if (candidateKeys.includes(key.toLowerCase())) {
      const value = row[key];
      if (typeof value === "string" || typeof value === "number") {
        return String(value);
      }
    }
  }
  return String(fallback);
}

export function EmployeeTable({
  rows,
  status,
  error,
  isEditMode = false,
  onEdit,
}: EmployeeTableProps) {
  const [search, setSearch] = useState("");
  const [educationFilter, setEducationFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Delete state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");

  // Handle delete
  const handleDelete = async () => {
    if (!deleteId) return;
    if (confirmationText !== "hapus") return;

    // Determine identifier (NIP usually)
    // We need to look up the row to find the NIP or ID
    // But here we only have the ID passed to setDeleteId
    // Assuming deleteId IS the identifier

    setIsDeleting(true);
    // Use "id" if available, or fallback to "nip" if you adjusted `deleteEmployee`
    // Since rows might not have clean 'id', we should ensure we pass the right thing.
    // For now, let's assume we pass the ID.
    const result = await deleteEmployee(deleteId, "id");

    if (result.success) {
      sessionStorage.setItem(
        "toast_message",
        result.message || "Data pegawai berhasil dihapus.",
      );
      window.location.reload();
    } else {
      toast.error(result.error);
    }
    setIsDeleting(false);
    setDeleteId(null);
    setConfirmationText("");
  };

  const columns = useMemo(() => buildColumns(rows, COLUMN_OVERRIDE), [rows]);
  const educationKey = useMemo(() => findKey(rows, EDUCATION_KEYS), [rows]);
  const categoryKey = useMemo(() => findKey(rows, CATEGORY_KEYS), [rows]);
  const genderKey = useMemo(() => findKey(rows, GENDER_KEYS), [rows]);
  const educationOptions = useMemo<FilterOption[]>(() => {
    if (!educationKey) {
      return [];
    }
    const options = new Map<string, string>();
    rows.forEach((row) => {
      const rawValue = row[educationKey];
      if (rawValue === null || rawValue === undefined) {
        return;
      }
      const label = String(rawValue).trim();
      if (!label) {
        return;
      }
      const key = label.toLowerCase();
      if (!options.has(key)) {
        options.set(key, label);
      }
    });
    return Array.from(options.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label, "id"));
  }, [rows, educationKey]);
  const categoryOptions = useMemo<FilterOption[]>(() => {
    if (!categoryKey) {
      return [];
    }
    const options = new Map<string, string>();
    rows.forEach((row) => {
      const rawValue = row[categoryKey];
      if (rawValue === null || rawValue === undefined) {
        return;
      }
      const label = String(rawValue).trim();
      if (!label) {
        return;
      }
      const key = label.toLowerCase();
      if (!options.has(key)) {
        options.set(key, label);
      }
    });
    return Array.from(options.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label, "id"));
  }, [rows, categoryKey]);
  const genderOptions = useMemo<FilterOption[]>(() => {
    if (!genderKey) {
      return [];
    }
    const options = new Map<string, string>();
    rows.forEach((row) => {
      const rawValue = row[genderKey];
      if (rawValue === null || rawValue === undefined) {
        return;
      }
      const label = String(rawValue).trim();
      if (!label) {
        return;
      }
      const key = label.toLowerCase();
      if (!options.has(key)) {
        options.set(key, label);
      }
    });
    return Array.from(options.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label, "id"));
  }, [rows, genderKey]);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return rows.filter((row) => {
      if (educationKey && educationFilter !== "all") {
        const rawValue = row[educationKey];
        const normalized =
          rawValue === null || rawValue === undefined
            ? ""
            : String(rawValue).trim().toLowerCase();
        if (!normalized || normalized !== educationFilter) {
          return false;
        }
      }
      if (categoryKey && categoryFilter !== "all") {
        const rawValue = row[categoryKey];
        const normalized =
          rawValue === null || rawValue === undefined
            ? ""
            : String(rawValue).trim().toLowerCase();
        if (!normalized || normalized !== categoryFilter) {
          return false;
        }
      }
      if (genderKey && genderFilter !== "all") {
        const rawValue = row[genderKey];
        const normalized =
          rawValue === null || rawValue === undefined
            ? ""
            : String(rawValue).trim().toLowerCase();
        if (!normalized || normalized !== genderFilter) {
          return false;
        }
      }
      if (!query) {
        return true;
      }
      const haystack = columns
        .map((col) => valueToText(row[col.key]).toLowerCase())
        .join(" ");
      return haystack.includes(query);
    });
  }, [
    rows,
    search,
    columns,
    educationFilter,
    educationKey,
    categoryFilter,
    categoryKey,
    genderFilter,
    genderKey,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const safePage = Math.min(page, totalPages);

  useEffect(() => {
    if (page !== safePage) {
      setPage(safePage);
    }
  }, [page, safePage]);

  // Reset page when pageSize changes
  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    if (educationFilter === "all") {
      return;
    }
    const isValid = educationOptions.some(
      (option) => option.value === educationFilter,
    );
    if (!isValid) {
      setEducationFilter("all");
    }
  }, [educationFilter, educationOptions]);

  useEffect(() => {
    if (categoryFilter === "all") {
      return;
    }
    const isValid = categoryOptions.some(
      (option) => option.value === categoryFilter,
    );
    if (!isValid) {
      setCategoryFilter("all");
    }
  }, [categoryFilter, categoryOptions]);

  useEffect(() => {
    if (genderFilter === "all") {
      return;
    }
    const isValid = genderOptions.some(
      (option) => option.value === genderFilter,
    );
    if (!isValid) {
      setGenderFilter("all");
    }
  }, [genderFilter, genderOptions]);

  const pageRows = useMemo(() => {
    const startIndex = (safePage - 1) * pageSize;
    return filteredRows.slice(startIndex, startIndex + pageSize);
  }, [filteredRows, safePage, pageSize]);

  const pageStart = filteredRows.length ? (safePage - 1) * pageSize + 1 : 0;
  const pageEnd = filteredRows.length
    ? Math.min(safePage * pageSize, filteredRows.length)
    : 0;

  if (status === "loading") {
    return (
      <div className="space-y-6">
        <Card className="border border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  <Skeleton className="h-5 w-5 bg-blue-200" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
              <Skeleton className="h-8 w-32 rounded-full" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Filters Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5 lg:col-span-4">
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="md:col-span-7 lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            {/* Table Skeleton */}
            <div className="rounded-md border border-slate-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/80">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <TableHead key={i}>
                        <Skeleton className="h-4 w-24" />
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Skeleton */}
            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-9 w-24" />
              <div className="hidden sm:flex gap-1">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
              <Skeleton className="h-9 w-24" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "error") {
    return (
      <Card className="border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Data Pegawai</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-red-600">
          {error || "Gagal memuat data pegawai."}
        </CardContent>
      </Card>
    );
  }

  if (!rows.length) {
    return (
      <Card className="border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Data Pegawai</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          Belum ada data pegawai.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border border-slate-200 shadow-sm overflow-hidden print:overflow-visible print:shadow-sm print:border-slate-200">
        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Data Pegawai</CardTitle>
                <div className="text-sm text-slate-500 font-normal">
                  Total {rows.length.toLocaleString("id-ID")} pegawai terdaftar
                </div>
              </div>
            </div>
            <div className="text-sm font-medium text-slate-600 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
              Halaman {safePage} dari {totalPages}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 print:hidden">
            <div className="md:col-span-5 lg:col-span-4 relative">
              <div className="absolute left-3 top-2.5 text-slate-400">
                <Search className="h-4 w-4" />
              </div>
              <Input
                placeholder="Cari nama, NIP, atau jabatan..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                className="pl-9 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
              />
            </div>
            <div className="md:col-span-7 lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Select
                value={categoryFilter}
                onValueChange={(value) => {
                  setCategoryFilter(value);
                  setPage(1);
                }}
                disabled={!categoryKey || categoryOptions.length === 0}
              >
                <SelectTrigger className="w-full bg-slate-50 border-slate-200 focus:bg-white">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Filter className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">
                      {categoryFilter === "all"
                        ? "Kategori"
                        : categoryOptions.find(
                            (o) => o.value === categoryFilter,
                          )?.label}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={educationFilter}
                onValueChange={(value) => {
                  setEducationFilter(value);
                  setPage(1);
                }}
                disabled={!educationKey || educationOptions.length === 0}
              >
                <SelectTrigger className="w-full bg-slate-50 border-slate-200 focus:bg-white">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Filter className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">
                      {educationFilter === "all"
                        ? "Pendidikan"
                        : educationOptions.find(
                            (o) => o.value === educationFilter,
                          )?.label}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Pendidikan</SelectItem>
                  {educationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={genderFilter}
                onValueChange={(value) => {
                  setGenderFilter(value);
                  setPage(1);
                }}
                disabled={!genderKey || genderOptions.length === 0}
              >
                <SelectTrigger className="w-full bg-slate-50 border-slate-200 focus:bg-white">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Filter className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">
                      {genderFilter === "all"
                        ? "Gender"
                        : genderOptions.find((o) => o.value === genderFilter)
                            ?.label}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Gender</SelectItem>
                  {genderOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 px-1 print:hidden">
            <span>
              Menampilkan {pageStart}-{pageEnd} dari {filteredRows.length} data
            </span>
          </div>

          <div className="rounded-md border border-slate-200 overflow-hidden print:overflow-visible">
            <Table className="print:text-[10px] print:w-full">
              <TableHeader>
                <TableRow className="bg-slate-50/80 hover:bg-slate-50 text-slate-700 print:bg-slate-100 print:text-[10px]">
                  <TableHead className="w-[50px] font-semibold text-center print:w-[30px] print:p-1 print:h-auto">
                    No
                  </TableHead>
                  {columns.map((column) => (
                    <TableHead
                      key={column.key}
                      className="font-semibold whitespace-nowrap print:p-1 print:h-auto print:whitespace-normal print:align-top"
                    >
                      {column.label}
                    </TableHead>
                  ))}
                  {isEditMode && (
                    <TableHead className="w-[80px] font-semibold text-center print:hidden">
                      Aksi
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageRows.map((row, index) => (
                  <TableRow
                    key={getRowKey(row, pageStart + index)}
                    className="hover:bg-blue-50/50 transition-colors print-break-inside-avoid"
                  >
                    <TableCell className="text-center text-slate-500 text-xs print:text-[10px] print:p-1 print:align-top">
                      {pageStart + index}
                    </TableCell>
                    {columns.map((column) => {
                      const value = row[column.key];
                      const text = formatValue(value);
                      return (
                        <TableCell
                          key={column.key}
                          className="max-w-[200px] truncate text-slate-700 text-sm whitespace-nowrap print:whitespace-normal print:break-words print:max-w-none print:p-1 print:text-[10px] print:align-top"
                          title={text}
                        >
                          {text}
                        </TableCell>
                      );
                    })}
                    {isEditMode && (
                      <TableCell className="text-center print:hidden">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => onEdit?.(row)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={isDeleting}
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => {
                              // Try to find the best ID. 'id' is standard, 'uuid' might exist, or 'nip'
                              const id =
                                (row.id as string) ||
                                (row.uuid as string) ||
                                (row.nip as string);
                              if (id) setDeleteId(String(id));
                              else
                                toast.error(
                                  "Tidak dapat menemukan ID untuk pegawai ini.",
                                );
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
                {pageRows.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length + 1}
                      className="h-32 text-center"
                    >
                      <div className="flex flex-col items-center justify-center text-slate-500 gap-2">
                        <FileSpreadsheet className="h-10 w-10 text-slate-300" />
                        <p>
                          Tidak ada data yang cocok dengan filter pencarian.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 print:hidden">
            {/* Page Size Selector */}
            <div className="flex items-center gap-2 order-2 sm:order-1">
              <p className="text-sm text-slate-500">Baris per halaman</p>
              <Select
                value={String(pageSize)}
                onValueChange={(value) => setPageSize(Number(value))}
              >
                <SelectTrigger className="h-9 w-[80px] bg-white border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Pagination Buttons */}
            <div className="flex items-center gap-2 order-1 sm:order-2 w-full sm:w-auto justify-between sm:justify-end">
              <Button
                variant="outline"
                size="sm"
                disabled={safePage <= 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="h-9 px-4 text-xs font-medium"
              >
                <ChevronLeft className="h-3.5 w-3.5 mr-2" />
                Sebelumnya
              </Button>

              <div className="flex sm:hidden text-xs text-slate-500 font-medium bg-slate-100 px-3 py-1.5 rounded-full">
                {safePage} / {totalPages}
              </div>

              <div className="hidden sm:flex text-xs text-slate-500 font-medium bg-slate-100 px-3 py-1.5 rounded-full">
                Page {safePage} / {totalPages}
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={safePage >= totalPages}
                onClick={() =>
                  setPage((prev) => Math.min(totalPages, prev + 1))
                }
                className="h-9 px-4 text-xs font-medium"
              >
                Selanjutnya
                <ChevronRight className="h-3.5 w-3.5 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteId(null);
            setConfirmationText("");
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data pegawai ini akan dihapus
              permanen dari database.
              <br />
              <br />
              Ketik <strong>hapus</strong> di bawah ini untuk konfirmasi:
            </AlertDialogDescription>
            <Input
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder='Ketik "hapus" disini...'
              className="mt-2"
            />
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting || confirmationText !== "hapus"}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
