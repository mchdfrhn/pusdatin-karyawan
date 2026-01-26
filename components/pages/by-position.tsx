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

  const getPositionValue = (label: string) =>
    positionCategory.find(
      (item) => item.name.toLowerCase() === label.toLowerCase(),
    )?.value ?? 0;
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
            label: "JFT",
            value: getPositionValue("JFT"),
            color: "from-cyan-500 to-cyan-600",
          },
          {
            label: "JFU",
            value: getPositionValue("JFU"),
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
            <CardTitle>Distribusi Gender per Jabatan</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={positionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="position" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => {
                    const totalEmployees = positionData.reduce(
                      (sum, item) => sum + item.male + item.female,
                      0,
                    );
                    const percent = totalEmployees
                      ? ((value / totalEmployees) * 100).toFixed(1)
                      : "0.0";
                    return `${value} (${percent}%)`;
                  }}
                />
                <Legend />
                <Bar
                  dataKey="male"
                  fill="#3b82f6"
                  name="Laki-laki"
                  label={renderBarLabel}
                />
                <Bar
                  dataKey="female"
                  fill="#ec4899"
                  name="Perempuan"
                  label={renderBarLabel}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Komposisi Jabatan</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
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
      <Card className="border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Detail Distribusi Gender per Jabatan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
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
