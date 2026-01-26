"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { RawRow } from "@/lib/data/employee-stats"

type EmployeeTableProps = {
  rows: RawRow[]
  status: "loading" | "ready" | "error"
  error: string | null
}

type Column = {
  key: string
  label: string
}

type FilterOption = {
  value: string
  label: string
}

const DEFAULT_PAGE_SIZE = 20
const COLUMN_OVERRIDE = process.env.NEXT_PUBLIC_EMPLOYEE_TABLE_COLUMNS
const EDUCATION_KEYS = [
  "pendidikan_terakhir",
  "pendidikan",
  "education",
  "education_level",
  "tingkat_pendidikan",
  "tingkatpendidikan",
]
const CATEGORY_KEYS = [
  "kategori",
  "status",
  "status_pegawai",
  "statuspegawai",
  "status_kepegawaian",
  "jenis_pegawai",
  "kategoripegawai",
]

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
}

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
]

function humanizeKey(key: string) {
  const lower = key.toLowerCase()
  if (COLUMN_LABELS[lower]) {
    return COLUMN_LABELS[lower]
  }
  return lower
    .replace(/_/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase())
}

function buildColumns(rows: RawRow[], override?: string): Column[] {
  if (!rows.length) {
    return []
  }

  const keys = new Set<string>()
  rows.slice(0, 50).forEach((row) => {
    Object.keys(row).forEach((key) => keys.add(key))
  })

  const keyLookup = new Map<string, string>()
  keys.forEach((key) => keyLookup.set(key.toLowerCase(), key))

  const selected: Column[] = []
  const used = new Set<string>()

  if (override) {
    override
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .forEach((rawKey) => {
        const actual = keyLookup.get(rawKey.toLowerCase())
        if (actual && !used.has(actual)) {
          used.add(actual)
          selected.push({ key: actual, label: humanizeKey(actual) })
        }
      })
    if (selected.length) {
      return selected
    }
  }

  COLUMN_PRIORITY.forEach((priorityKey) => {
    const actual = keyLookup.get(priorityKey)
    if (actual && !used.has(actual)) {
      used.add(actual)
      selected.push({ key: actual, label: humanizeKey(actual) })
    }
  })

  Array.from(keys)
    .filter((key) => !used.has(key))
    .sort((a, b) => a.localeCompare(b, "id"))
    .forEach((key) => selected.push({ key, label: humanizeKey(key) }))

  return selected
}

function findKey(rows: RawRow[], candidates: string[]): string | null {
  if (!rows.length) {
    return null
  }
  const keyLookup = new Map<string, string>()
  rows.slice(0, 50).forEach((row) => {
    Object.keys(row).forEach((key) => keyLookup.set(key.toLowerCase(), key))
  })
  for (const candidate of candidates) {
    const actual = keyLookup.get(candidate.toLowerCase())
    if (actual) {
      return actual
    }
  }
  return null
}

function valueToText(value: unknown): string {
  if (value === null || value === undefined) {
    return ""
  }
  if (typeof value === "string") {
    return value
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value)
  }
  if (value instanceof Date) {
    return value.toISOString()
  }
  if (Array.isArray(value)) {
    return value.map((item) => valueToText(item)).join(" ")
  }
  if (typeof value === "object") {
    try {
      return JSON.stringify(value)
    } catch {
      return String(value)
    }
  }
  return String(value)
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "-"
  }
  if (typeof value === "number") {
    return value.toLocaleString("id-ID")
  }
  if (typeof value === "boolean") {
    return value ? "Ya" : "Tidak"
  }
  if (value instanceof Date) {
    return value.toLocaleDateString("id-ID")
  }
  if (Array.isArray(value)) {
    return value.map((item) => formatValue(item)).join(", ")
  }
  if (typeof value === "object") {
    try {
      return JSON.stringify(value)
    } catch {
      return String(value)
    }
  }
  return String(value)
}

function getRowKey(row: RawRow, fallback: number): string {
  const candidateKeys = ["id", "uuid", "nip", "nik", "nup"]
  for (const key of Object.keys(row)) {
    if (candidateKeys.includes(key.toLowerCase())) {
      const value = row[key]
      if (typeof value === "string" || typeof value === "number") {
        return String(value)
      }
    }
  }
  return String(fallback)
}

export function EmployeeTable({ rows, status, error }: EmployeeTableProps) {
  const [search, setSearch] = useState("")
  const [educationFilter, setEducationFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [page, setPage] = useState(1)

  const columns = useMemo(() => buildColumns(rows, COLUMN_OVERRIDE), [rows])
  const educationKey = useMemo(() => findKey(rows, EDUCATION_KEYS), [rows])
  const categoryKey = useMemo(() => findKey(rows, CATEGORY_KEYS), [rows])
  const educationOptions = useMemo<FilterOption[]>(() => {
    if (!educationKey) {
      return []
    }
    const options = new Map<string, string>()
    rows.forEach((row) => {
      const rawValue = row[educationKey]
      if (rawValue === null || rawValue === undefined) {
        return
      }
      const label = String(rawValue).trim()
      if (!label) {
        return
      }
      const key = label.toLowerCase()
      if (!options.has(key)) {
        options.set(key, label)
      }
    })
    return Array.from(options.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label, "id"))
  }, [rows, educationKey])
  const categoryOptions = useMemo<FilterOption[]>(() => {
    if (!categoryKey) {
      return []
    }
    const options = new Map<string, string>()
    rows.forEach((row) => {
      const rawValue = row[categoryKey]
      if (rawValue === null || rawValue === undefined) {
        return
      }
      const label = String(rawValue).trim()
      if (!label) {
        return
      }
      const key = label.toLowerCase()
      if (!options.has(key)) {
        options.set(key, label)
      }
    })
    return Array.from(options.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label, "id"))
  }, [rows, categoryKey])

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase()
    return rows.filter((row) => {
      if (educationKey && educationFilter !== "all") {
        const rawValue = row[educationKey]
        const normalized = rawValue === null || rawValue === undefined ? "" : String(rawValue).trim().toLowerCase()
        if (!normalized || normalized !== educationFilter) {
          return false
        }
      }
      if (categoryKey && categoryFilter !== "all") {
        const rawValue = row[categoryKey]
        const normalized = rawValue === null || rawValue === undefined ? "" : String(rawValue).trim().toLowerCase()
        if (!normalized || normalized !== categoryFilter) {
          return false
        }
      }
      if (!query) {
        return true
      }
      const haystack = columns.map((col) => valueToText(row[col.key]).toLowerCase()).join(" ")
      return haystack.includes(query)
    })
  }, [rows, search, columns, educationFilter, educationKey, categoryFilter, categoryKey])

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / DEFAULT_PAGE_SIZE))
  const safePage = Math.min(page, totalPages)

  useEffect(() => {
    if (page !== safePage) {
      setPage(safePage)
    }
  }, [page, safePage])

  useEffect(() => {
    if (educationFilter === "all") {
      return
    }
    const isValid = educationOptions.some((option) => option.value === educationFilter)
    if (!isValid) {
      setEducationFilter("all")
    }
  }, [educationFilter, educationOptions])

  useEffect(() => {
    if (categoryFilter === "all") {
      return
    }
    const isValid = categoryOptions.some((option) => option.value === categoryFilter)
    if (!isValid) {
      setCategoryFilter("all")
    }
  }, [categoryFilter, categoryOptions])

  const pageRows = useMemo(() => {
    const startIndex = (safePage - 1) * DEFAULT_PAGE_SIZE
    return filteredRows.slice(startIndex, startIndex + DEFAULT_PAGE_SIZE)
  }, [filteredRows, safePage])

  const pageStart = filteredRows.length ? (safePage - 1) * DEFAULT_PAGE_SIZE + 1 : 0
  const pageEnd = filteredRows.length ? Math.min(safePage * DEFAULT_PAGE_SIZE, filteredRows.length) : 0

  if (status === "loading") {
    return (
      <Card className="border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Data Pegawai</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">Memuat data pegawai...</CardContent>
      </Card>
    )
  }

  if (status === "error") {
    return (
      <Card className="border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Data Pegawai</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-red-600">{error || "Gagal memuat data pegawai."}</CardContent>
      </Card>
    )
  }

  if (!rows.length) {
    return (
      <Card className="border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Data Pegawai</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">Belum ada data pegawai.</CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border border-slate-200 shadow-sm">
        <CardHeader>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <CardTitle>Data Pegawai</CardTitle>
            <div className="text-sm text-slate-600">Total: {rows.length} baris</div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full flex-col gap-3 md:flex-row md:items-center">
              <div className="w-full md:max-w-sm">
                <Input
                  placeholder="Cari nama, status, jabatan, atau lainnya..."
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value)
                    setPage(1)
                  }}
                />
              </div>
              <div className="w-full md:w-[220px]">
                <Select
                  value={categoryFilter}
                  onValueChange={(value) => {
                    setCategoryFilter(value)
                    setPage(1)
                  }}
                  disabled={!categoryKey || categoryOptions.length === 0}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter kategori" />
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
              </div>
              <div className="w-full md:w-[220px]">
                <Select
                  value={educationFilter}
                  onValueChange={(value) => {
                    setEducationFilter(value)
                    setPage(1)
                  }}
                  disabled={!educationKey || educationOptions.length === 0}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter pendidikan" />
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
              </div>
            </div>
            <div className="text-sm text-slate-600">
              Menampilkan {pageStart}-{pageEnd} dari {filteredRows.length} data
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>No</TableHead>
                {columns.map((column) => (
                  <TableHead key={column.key}>{column.label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.map((row, index) => (
                <TableRow key={getRowKey(row, pageStart + index)}>
                  <TableCell>{pageStart + index}</TableCell>
                  {columns.map((column) => {
                    const value = row[column.key]
                    const text = formatValue(value)
                    return (
                      <TableCell key={column.key} className="max-w-[240px] truncate" title={text}>
                        {text}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
              {pageRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} className="py-6 text-center text-slate-500">
                    Tidak ada data yang cocok.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="outline" disabled={safePage <= 1} onClick={() => setPage((prev) => Math.max(1, prev - 1))}>
              Sebelumnya
            </Button>
            <div className="text-sm text-slate-600">
              Halaman {safePage} dari {totalPages}
            </div>
            <Button
              variant="outline"
              disabled={safePage >= totalPages}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            >
              Selanjutnya
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
