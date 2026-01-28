"use client";

import { useState, useEffect } from "react";
import { EmployeeDashboard } from "@/components/pages/dashboard";
import { EmployeeByAge } from "@/components/pages/by-age";
import { EmployeeByGender } from "@/components/pages/by-gender";
import { EmployeeByEducation } from "@/components/pages/by-education";
import { EmployeeByPosition } from "@/components/pages/by-position";
import { EmployeeByDepartment } from "@/components/pages/by-department";
import { EmployeeTable } from "@/components/pages/employee-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEmployeeStats } from "@/hooks/use-employee-stats";
import { EmployeeForm } from "@/components/employee-form";
import { Plus } from "lucide-react";
import { toast } from "sonner"; // Import toast

const tabs = [
  { id: "dashboard", label: "Dashboard" },
  { id: "jenis", label: "Jenis" },
  { id: "usia", label: "Usia" },
  { id: "pendidikan", label: "Pendidikan" },
  { id: "jabatan", label: "Jabatan" },
  { id: "golongan", label: "Golongan" },
  { id: "tabel", label: "Tabel" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { stats, rows, status, error } = useEmployeeStats();

  useEffect(() => {
    // Check for success message from sessionStorage after reload
    const storedMessage = sessionStorage.getItem("toast_message");
    if (storedMessage) {
      // Use a small timeout to ensure the Toaster is ready
      setTimeout(() => {
        toast.success(storedMessage);
      }, 100);
      sessionStorage.removeItem("toast_message");
    }
  }, []);

  const handlePrintPDF = () => {
    window.print();
  };

  const renderContent = () => {
    if (activeTab === "tabel") {
      return (
        <EmployeeTable
          rows={rows}
          status={status}
          error={error}
          isEditMode={isEditMode}
        />
      );
    }

    if (status === "loading") {
      return (
        <div className="space-y-6 animate-in fade-in duration-500">
          {/* Summary Cards Skeleton */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border border-slate-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Skeleton */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 border border-slate-200 shadow-sm">
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="pl-2">
                <Skeleton className="h-[350px] w-full rounded-md bg-slate-100" />
              </CardContent>
            </Card>
            <Card className="col-span-3 border border-slate-200 shadow-sm">
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[350px] w-full rounded-full bg-slate-100 mx-auto" />
              </CardContent>
            </Card>
          </div>
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
            {error || "Gagal memuat data dari database."}
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
            Belum ada data pegawai di database.
          </CardContent>
        </Card>
      );
    }

    switch (activeTab) {
      case "jenis":
        return <EmployeeByGender stats={stats} />;
      case "usia":
        return <EmployeeByAge stats={stats} />;
      case "pendidikan":
        return <EmployeeByEducation stats={stats} />;
      case "jabatan":
        return <EmployeeByPosition stats={stats} />;
      case "golongan":
        return <EmployeeByDepartment stats={stats} />;
      default:
        return <EmployeeDashboard stats={stats} />;
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 print:bg-white">
      <EmployeeForm
        open={isAddEmployeeOpen}
        onOpenChange={setIsAddEmployeeOpen}
        onSuccess={(message) => {
          sessionStorage.setItem("toast_message", message);
          window.location.reload();
        }}
      />

      {/* Header */}
      <div className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Sistem Informasi Kepegawaian
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Dashboard Manajemen Data Pegawai
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={isEditMode ? "destructive" : "outline"}
                onClick={() => {
                  if (!isEditMode) setActiveTab("tabel");
                  setIsEditMode(!isEditMode);
                }}
                className="shadow-md print:hidden"
              >
                {isEditMode ? "Selesai Ubah" : "Ubah Data"}
              </Button>
              <Button
                onClick={() => setIsAddEmployeeOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md print:hidden"
              >
                <Plus className="mr-2 h-4 w-4" />
                Tambah Pegawai
              </Button>
              <Button
                onClick={handlePrintPDF}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-md print:hidden"
              >
                Print PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 bg-white print:hidden">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap border-b-2 px-4 py-4 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        id="dashboard-content"
        className="mx-auto max-w-7xl px-4 py-8 md:px-8 print:p-0 print:max-w-none"
      >
        {renderContent()}
      </div>
    </main>
  );
}
