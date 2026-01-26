"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EmployeeStats } from "@/lib/data/employee-stats";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type EmployeeByAgeProps = {
  stats: EmployeeStats;
};

export function EmployeeByAge({ stats }: EmployeeByAgeProps) {
  const { ageData, ageCategoryData, summary } = stats;

  const renderCustomLabel = (entry: any) => {
    return `${entry.value}`;
  };

  const renderBarLabel = (props: any) => {
    const { x, y, width, value } = props;
    return (
      <text
        x={x + width / 2}
        y={y - 5}
        fill="#374151"
        textAnchor="middle"
        fontSize={12}
        fontWeight="500"
      >
        {value}
      </text>
    );
  };
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          {
            label: "Total Pegawai",
            value: summary.totalEmployees,
            color: "from-blue-500 to-blue-600",
          },
          {
            label: "PNS",
            value: summary.statusCounts.PNS,
            color: "from-green-500 to-green-600",
          },
          {
            label: "CPNS",
            value: summary.statusCounts.CPNS,
            color: "from-purple-500 to-purple-600",
          },
          {
            label: "PPPK",
            value: summary.statusCounts.PPPK,
            color: "from-amber-500 to-amber-600",
          },
        ].map((item) => (
          <div
            key={item.label}
            className={`rounded-lg bg-gradient-to-br ${item.color} p-4 text-white shadow-md`}
          >
            <p className="text-xs font-medium opacity-90">{item.label}</p>
            <p className="mt-2 text-3xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bar Chart */}
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Distribusi Pegawai per Kelompok Usia</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => {
                    const total = ageData.reduce(
                      (sum, item) => sum + item.total,
                      0,
                    );
                    const percent = total
                      ? ((value / total) * 100).toFixed(1)
                      : "0.0";
                    return `${value} (${percent}%)`;
                  }}
                />
                <Legend />
                <Bar
                  dataKey="pns"
                  fill="#10b981"
                  name="PNS"
                  label={renderBarLabel}
                />
                <Bar
                  dataKey="cpns"
                  fill="#a855f7"
                  name="CPNS"
                  label={renderBarLabel}
                />
                <Bar
                  dataKey="pppk"
                  fill="#f59e0b"
                  name="PPPK"
                  label={renderBarLabel}
                />
                <Bar
                  dataKey="ki"
                  fill="#06b6d4"
                  name="KI"
                  label={renderBarLabel}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Komposisi per Kategori</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Legend />
                <Pie
                  data={ageCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={renderCustomLabel}
                  labelLine={false}
                >
                  {ageCategoryData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => {
                    const total = ageCategoryData.reduce(
                      (sum, item) => sum + item.value,
                      0,
                    );
                    const percent = total
                      ? ((value / total) * 100).toFixed(1)
                      : "0.0";
                    return `${value} (${percent}%)`;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Detail Distribusi per Usia dan Kategori</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    Usia
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700">
                    PNS
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700">
                    CPNS
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700">
                    PPPK
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700">
                    KI
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {ageData.map((row) => (
                  <tr
                    key={row.range}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-slate-700">
                      {row.range}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-600">
                      {row.pns}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-600">
                      {row.cpns}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-600">
                      {row.pppk}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-600">
                      {row.ki}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-blue-600">
                      {row.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
