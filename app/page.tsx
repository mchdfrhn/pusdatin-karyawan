"use client";

import { useState } from "react";
import { EmployeeDashboard } from "@/components/pages/dashboard";
import { EmployeeByAge } from "@/components/pages/by-age";
import { EmployeeByGender } from "@/components/pages/by-gender";
import { EmployeeByEducation } from "@/components/pages/by-education";
import { EmployeeByPosition } from "@/components/pages/by-position";
import { EmployeeByDepartment } from "@/components/pages/by-department";
import { EmployeeTable } from "@/components/pages/employee-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEmployeeStats } from "@/hooks/use-employee-stats";

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
  const { stats, rows, status, error } = useEmployeeStats();

  const handlePrintPDF = () => {
    window.print();
  };

  const renderContent = () => {
    if (activeTab === "tabel") {
      return <EmployeeTable rows={rows} status={status} error={error} />;
    }

    if (status === "loading") {
      return (
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Data Pegawai</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            Memuat data dari database...
          </CardContent>
        </Card>
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
            <Button
              onClick={handlePrintPDF}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-md print:hidden"
            >
              Print PDF
            </Button>
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
