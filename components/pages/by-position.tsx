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

type EmployeeByPositionProps = {
  stats: EmployeeStats;
};

export function EmployeeByPosition({ stats }: EmployeeByPositionProps) {
  const { positionData, positionCategory, summary } = stats;

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

  const renderPieLabel = (entry: any) => {
    return `${entry.value}`;
  };

  const getPositionValue = (label: string) =>
    positionCategory.find(
      (item) => item.name.toLowerCase() === label.toLowerCase(),
    )?.value ?? 0;
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4 print:grid-cols-4">
        <div className="rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-4 text-white shadow-md">
          <p className="text-xs font-medium opacity-90">Total Pegawai</p>
          <p className="mt-2 text-3xl font-bold">{summary.totalEmployees}</p>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 p-4 text-white shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium opacity-90">Struktural</p>
              <p className="mt-2 text-3xl font-bold">
                {getPositionValue("Eselon II") +
                  getPositionValue("Eselon III") +
                  getPositionValue("Eselon IV")}
              </p>
            </div>
            <div className="text-xs text-indigo-100 space-y-1 text-right">
              <p>Eselon II: {getPositionValue("Eselon II")}</p>
              <p>Eselon III: {getPositionValue("Eselon III")}</p>
              <p>Eselon IV: {getPositionValue("Eselon IV")}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 p-4 text-white shadow-md">
          <p className="text-xs font-medium opacity-90">JFT</p>
          <p className="mt-2 text-3xl font-bold">{getPositionValue("JFT")}</p>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 p-4 text-white shadow-md">
          <p className="text-xs font-medium opacity-90">JFU</p>
          <p className="mt-2 text-3xl font-bold">{getPositionValue("JFU")}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2 print:block">
        <Card className="border border-slate-200 shadow-sm print-break-inside-avoid print:mb-6">
          <CardHeader>
            <CardTitle>Distribusi Gender per Jabatan</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={positionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="position" fontSize={11} interval={0} />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                  itemStyle={{ fontSize: "12px" }}
                  labelStyle={{ fontWeight: "bold", marginBottom: "5px" }}
                  cursor={{ fill: "#f1f5f9" }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const male =
                        (payload.find((p) => p.name === "Laki-laki")
                          ?.value as number) || 0;
                      const female =
                        (payload.find((p) => p.name === "Perempuan")
                          ?.value as number) || 0;
                      const total = male + female;
                      const malePercent = total
                        ? ((male / total) * 100).toFixed(1)
                        : "0.0";
                      const femalePercent = total
                        ? ((female / total) * 100).toFixed(1)
                        : "0.0";

                      return (
                        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
                          <p className="font-bold text-sm mb-2">{label}</p>
                          <div className="space-y-1 text-xs">
                            <p className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                              <span className="text-slate-600">Laki-laki:</span>
                              <span className="font-semibold">
                                {male} ({malePercent}%)
                              </span>
                            </p>
                            <p className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                              <span className="text-slate-600">Perempuan:</span>
                              <span className="font-semibold">
                                {female} ({femalePercent}%)
                              </span>
                            </p>
                            <div className="border-t border-slate-100 my-1 pt-1">
                              <p className="flex items-center gap-2 font-medium">
                                <span className="text-slate-700">Total:</span>
                                <span className="font-bold text-slate-900">
                                  {total}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Bar
                  dataKey="male"
                  fill="#3b82f6"
                  name="Laki-laki"
                  label={renderBarLabel}
                  animationBegin={0}
                  animationDuration={1000}
                />
                <Bar
                  dataKey="female"
                  fill="#ec4899"
                  name="Perempuan"
                  label={renderBarLabel}
                  animationBegin={0}
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm print-break-inside-avoid print:mb-6">
          <CardHeader>
            <CardTitle>Komposisi Jabatan</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Legend />
                <Pie
                  data={positionCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={renderPieLabel}
                  labelLine={false}
                  animationBegin={0}
                  animationDuration={1000}
                >
                  {positionCategory.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => {
                    const total = positionCategory.reduce(
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
      <Card className="border border-slate-200 shadow-sm print:break-inside-auto print-break-before">
        <CardHeader className="print:hidden">
          <CardTitle>Detail Distribusi Gender per Jabatan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="hidden print:block mb-4 font-bold text-lg print-break-after-avoid">
            Detail Distribusi Gender per Jabatan
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="print-break-after-avoid">
                <tr className="border-b border-slate-200 bg-slate-50 print-break-inside-avoid">
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    Jabatan
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700">
                    Laki-laki
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700">
                    Perempuan
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700">
                    Total
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700">
                    % dari Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {positionData.map((row) => (
                  <tr
                    key={row.position}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-slate-700">
                      {row.position}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-600">
                      {row.male}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-600">
                      {row.female}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-blue-600">
                      {row.male + row.female}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-600">
                      {(
                        ((row.male + row.female) / summary.totalEmployees) *
                        100
                      ).toFixed(1)}
                      %
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
