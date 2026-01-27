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

type EmployeeByDepartmentProps = {
  stats: EmployeeStats;
};

export function EmployeeByDepartment({ stats }: EmployeeByDepartmentProps) {
  const { departmentData, departmentCategory, summary } = stats;
  const totalEmployees = departmentData.reduce(
    (sum, item) => sum + item.male + item.female,
    0,
  );

  const renderBarLabel = (props: any) => {
    const { x, y, width, value } = props;
    return (
      <text
        x={x + width / 2}
        y={y - 5}
        fill="#374151"
        textAnchor="middle"
        fontSize={11}
        fontWeight="500"
      >
        {value}
      </text>
    );
  };

  const renderPieLabel = (entry: any) => {
    return `${entry.value}`;
  };

  const topDepartment = departmentCategory.reduce<{
    name: string;
    value: number;
  } | null>((acc, item) => {
    if (!acc || item.value > acc.value) {
      return { name: item.name, value: item.value };
    }
    return acc;
  }, null);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            label: "Total Pegawai",
            value: summary.totalEmployees,
            color: "from-blue-500 to-blue-600",
          },
          {
            label: "Golongan Terbanyak",
            value: topDepartment?.name ?? "-",
            color: "from-cyan-500 to-cyan-600",
          },
          {
            label: "Jumlah Golongan",
            value: departmentCategory.length,
            color: "from-purple-500 to-purple-600",
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
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Distribusi Gender per Golongan</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="dept" fontSize={11} interval={0} />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                  itemStyle={{ fontSize: "12px" }}
                  labelStyle={{ fontWeight: "bold", marginBottom: "5px" }}
                  cursor={{ fill: "transparent" }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const male =
                        (payload.find((p) => p.name === "Laki-laki")
                          ?.value as number) || 0;
                      const female =
                        (payload.find((p) => p.name === "Perempuan")
                          ?.value as number) || 0;
                      const total = male + female;
                      const percent = totalEmployees
                        ? ((total / totalEmployees) * 100).toFixed(1)
                        : "0.0";

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
                                  {total} ({percent}%)
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

        <Card className="border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Komposisi Golongan</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Legend />
                <Pie
                  data={departmentCategory.slice(0, 8)}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={renderPieLabel}
                  labelLine={false}
                  animationBegin={0}
                  animationDuration={1000}
                >
                  {departmentCategory.slice(0, 8).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => {
                    const total = departmentCategory.reduce(
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
          <CardTitle>Detail Distribusi Gender per Golongan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    Golongan
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
                {departmentData.map((row) => {
                  const total = row.male + row.female;
                  return (
                    <tr
                      key={row.dept}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-slate-700">
                        {row.dept}
                      </td>
                      <td className="px-4 py-3 text-center text-slate-600">
                        {row.male}
                      </td>
                      <td className="px-4 py-3 text-center text-slate-600">
                        {row.female}
                      </td>
                      <td className="px-4 py-3 text-center font-semibold text-blue-600">
                        {total}
                      </td>
                      <td className="px-4 py-3 text-center text-slate-600">
                        {((total / totalEmployees) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
