"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { EmployeeStats } from "@/lib/data/employee-stats"

const employeeCategories = [
  { label: "Total Pegawai", value: 181, color: "from-blue-500 to-blue-600", icon: "👥" },
  { label: "PNS", value: 41, color: "from-green-500 to-green-600", icon: "📋" },
  { label: "CPNS", value: 12, color: "from-purple-500 to-purple-600", icon: "📝" },
  { label: "PPPK", value: 23, color: "from-amber-500 to-amber-600", icon: "⚡" },
  { label: "PPnPN", value: 0, color: "from-pink-500 to-pink-600", icon: "🎯" },
  { label: "KI", value: 105, color: "from-cyan-500 to-cyan-600", icon: "🔷" },
]

type EmployeeDashboardProps = {
  stats: EmployeeStats
}

export function EmployeeDashboard({ stats }: EmployeeDashboardProps) {
  const { summary } = stats
  const totalEmployees = summary.totalEmployees
  const maleEmployees = summary.maleEmployees
  const femaleEmployees = summary.femaleEmployees
  const categoryValues: Record<string, number> = {
    "Total Pegawai": summary.totalEmployees,
    PNS: summary.statusCounts.PNS,
    CPNS: summary.statusCounts.CPNS,
    PPPK: summary.statusCounts.PPPK,
    PPnPN: summary.statusCounts.PPnPN,
    KI: summary.statusCounts.KI,
  }

  const ratioText = femaleEmployees ? `${(maleEmployees / femaleEmployees).toFixed(2)} : 1` : "-"

  return (
    <div className="space-y-8">
      {/* Main Statistics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {employeeCategories.map((category) => {
          const value = categoryValues[category.label] ?? 0
          const percentText = totalEmployees ? ((value / totalEmployees) * 100).toFixed(1) : "0.0"
          return (
            <div
              key={category.label}
              className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${category.color} p-6 text-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105`}
            >
              <div className="absolute right-0 top-0 opacity-10 text-6xl">{category.icon}</div>
              <div className="relative z-10">
                <p className="text-sm font-medium opacity-90">{category.label}</p>
                <p className="mt-2 text-4xl font-bold">{value}</p>
                {category.label !== "Total Pegawai" && (
                  <p className="mt-2 text-xs font-semibold opacity-75">{percentText}% dari total</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Gender Statistics */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Gender Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg bg-blue-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-700">Laki-laki</span>
                  <span className="text-2xl font-bold text-blue-600">{maleEmployees}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${totalEmployees ? (maleEmployees / totalEmployees) * 100 : 0}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-slate-600">
                  {totalEmployees ? ((maleEmployees / totalEmployees) * 100).toFixed(1) : "0.0"}% dari total
                </p>
              </div>

              <div className="rounded-lg bg-pink-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-700">Perempuan</span>
                  <span className="text-2xl font-bold text-pink-600">{femaleEmployees}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full bg-pink-500"
                    style={{ width: `${totalEmployees ? (femaleEmployees / totalEmployees) * 100 : 0}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-slate-600">
                  {totalEmployees ? ((femaleEmployees / totalEmployees) * 100).toFixed(1) : "0.0"}% dari total
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 p-4">
                <span className="font-medium text-slate-700">Total Pegawai</span>
                <span className="text-2xl font-bold text-blue-600">{totalEmployees}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-slate-50 to-slate-100 p-4">
                <span className="font-medium text-slate-700">Ratio Laki-laki : Perempuan</span>
                <span className="font-mono text-sm font-bold text-slate-700">{ratioText}</span>
              </div>
              <div className="mt-4 rounded-lg bg-gradient-to-r from-indigo-50 to-indigo-100 p-4">
                <p className="text-xs font-semibold text-indigo-900">Keterangan Status Pegawai:</p>
                <ul className="mt-3 space-y-1 text-xs text-indigo-800">
                  <li>
                    • <strong>PNS</strong>: Pegawai Negeri Sipil
                  </li>
                  <li>
                    • <strong>CPNS</strong>: Calon Pegawai Negeri Sipil
                  </li>
                  <li>
                    • <strong>PPPK</strong>: Pegawai Pemerintah dengan Perjanjian Kerja
                  </li>
                  <li>
                    • <strong>PPnPN</strong>: Pegawai tidak Tetap Pemerintah Non PNS
                  </li>
                  <li>
                    • <strong>KI</strong>: Kesejahteraan Instruktur
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
