"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Users, UserCheck, UserCheck as UserClock, UserMinus, Building2, Award } from "lucide-react"

interface EmployeeType {
  name: string
  label: string
  value: number
  icon: React.ReactNode
  color: string
  bgColor: string
}

export function EmployeeCompositionDashboard() {
  const employeeTypes: EmployeeType[] = [
    {
      name: "PNS",
      label: "Pegawai Negeri Sipil",
      value: 41,
      icon: <Users className="w-5 h-5" />,
      color: "#3b82f6",
      bgColor: "bg-blue-50",
    },
    {
      name: "CPNS",
      label: "Calon Pegawai Negeri Sipil",
      value: 12,
      icon: <UserClock className="w-5 h-5" />,
      color: "#06b6d4",
      bgColor: "bg-cyan-50",
    },
    {
      name: "PPPK",
      label: "Pegawai Pemerintah dengan Perjanjian Kerja",
      value: 23,
      icon: <UserCheck className="w-5 h-5" />,
      color: "#8b5cf6",
      bgColor: "bg-purple-50",
    },
    {
      name: "PPnPN",
      label: "Pegawai Pemerintah non Pegawai Negara",
      value: 0,
      icon: <UserMinus className="w-5 h-5" />,
      color: "#f59e0b",
      bgColor: "bg-amber-50",
    },
    {
      name: "KI",
      label: "Karyawan Insidental",
      value: 105,
      icon: <Building2 className="w-5 h-5" />,
      color: "#10b981",
      bgColor: "bg-emerald-50",
    },
  ]

  const totalEmployees = employeeTypes.reduce((sum, type) => sum + type.value, 0)

  const chartData = employeeTypes.map((type) => ({
    name: type.name,
    value: type.value,
  }))

  const pieColors = employeeTypes.map((type) => type.color)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-slate-900">Komposisi Pegawai</h1>
        <p className="text-slate-600">Dashboard statistik kepegawaian organisasi Anda</p>
      </div>

      {/* Total Employees Summary */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-700 border-0 text-white shadow-lg">
        <CardContent className="pt-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 mb-2">Total Pegawai</p>
              <p className="text-5xl font-bold">{totalEmployees}</p>
            </div>
            <Award className="w-24 h-24 text-blue-400 opacity-50" />
          </div>
        </CardContent>
      </Card>

      {/* Employee Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {employeeTypes.map((type) => (
          <Card
            key={type.name}
            className={`border-2 border-slate-200 ${type.bgColor} hover:shadow-lg transition-all duration-300`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-slate-900">{type.name}</CardTitle>
                <div className="p-2 rounded-lg" style={{ backgroundColor: type.color, color: "white" }}>
                  {type.icon}
                </div>
              </div>
              <CardDescription className="text-xs text-slate-600 mt-1">{type.label}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold" style={{ color: type.color }}>
                {type.value}
              </p>
              <p className="text-xs text-slate-500 mt-2">
                {((type.value / totalEmployees) * 100).toFixed(1)}% dari total
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <Card className="border-2 border-slate-200 shadow-md">
          <CardHeader>
            <CardTitle className="text-slate-900">Distribusi Pegawai (Bar Chart)</CardTitle>
            <CardDescription>Perbandingan jumlah pegawai per kategori</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#f8fafc",
                    border: "2px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => [value, "Jumlah"]}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="border-2 border-slate-200 shadow-md">
          <CardHeader>
            <CardTitle className="text-slate-900">Proporsi Pegawai (Pie Chart)</CardTitle>
            <CardDescription>Persentase distribusi status kepegawaian</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, "Pegawai"]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary Statistics */}
      <Card className="border-2 border-slate-200 shadow-md">
        <CardHeader>
          <CardTitle className="text-slate-900">Ringkasan Statistik</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {employeeTypes.map((type) => (
              <div
                key={type.name}
                className="text-center p-4 rounded-lg"
                style={{ backgroundColor: type.bgColor, borderLeft: `4px solid ${type.color}` }}
              >
                <p className="text-sm text-slate-600 mb-2">{type.name}</p>
                <p className="text-2xl font-bold" style={{ color: type.color }}>
                  {type.value}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {type.name === "KI" ? "Terbanyak" : type.value === 0 ? "Tidak ada" : "Aktif"}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
