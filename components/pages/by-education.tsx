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

type EmployeeByEducationProps = {
  stats: EmployeeStats;
};

export function EmployeeByEducation({ stats }: EmployeeByEducationProps) {
  const { educationData, educationChart, summary } = stats;

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

  const getEducationValue = (level: string) =>
    educationChart.find((item) => item.name === level)?.value ?? 0;
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
            label: "S1-D4",
            value: getEducationValue("S1-D4"),
            color: "from-pink-500 to-pink-600",
          },
          {
            label: "D1-D3",
            value: getEducationValue("D1-D3"),
            color: "from-purple-500 to-purple-600",
          },
          {
            label: "SLTA",
            value: getEducationValue("SLTA"),
            color: "from-indigo-500 to-indigo-600",
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
            <CardTitle>Distribusi per Tingkat Pendidikan</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={educationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="level" />
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
                      const pns =
                        (payload.find((p) => p.name === "PNS")
                          ?.value as number) || 0;
                      const cpns =
                        (payload.find((p) => p.name === "CPNS")
                          ?.value as number) || 0;
                      const pppk =
                        (payload.find((p) => p.name === "PPPK")
                          ?.value as number) || 0;
                      const ki =
                        (payload.find((p) => p.name === "KI")
                          ?.value as number) || 0;

                      const total = pns + cpns + pppk + ki;

                      const pnsPercent = total
                        ? ((pns / total) * 100).toFixed(1)
                        : "0.0";
                      const cpnsPercent = total
                        ? ((cpns / total) * 100).toFixed(1)
                        : "0.0";
                      const pppkPercent = total
                        ? ((pppk / total) * 100).toFixed(1)
                        : "0.0";
                      const kiPercent = total
                        ? ((ki / total) * 100).toFixed(1)
                        : "0.0";

                      return (
                        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
                          <p className="font-bold text-sm mb-2">{label}</p>
                          <div className="space-y-1 text-xs">
                            <p className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-green-500"></span>
                              <span className="text-slate-600">PNS:</span>
                              <span className="font-semibold">
                                {pns} ({pnsPercent}%)
                              </span>
                            </p>
                            <p className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                              <span className="text-slate-600">CPNS:</span>
                              <span className="font-semibold">
                                {cpns} ({cpnsPercent}%)
                              </span>
                            </p>
                            <p className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                              <span className="text-slate-600">PPPK:</span>
                              <span className="font-semibold">
                                {pppk} ({pppkPercent}%)
                              </span>
                            </p>
                            <p className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                              <span className="text-slate-600">KI:</span>
                              <span className="font-semibold">
                                {ki} ({kiPercent}%)
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

        <Card className="border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Komposisi Pendidikan</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Legend />
                <Pie
                  data={educationChart}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={renderCustomLabel}
                  labelLine={false}
                >
                  {educationChart.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => {
                    const total = educationChart.reduce(
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
          <CardTitle>Detail Distribusi per Tingkat Pendidikan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    Pendidikan
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
                {educationData.map((row) => (
                  <tr
                    key={row.level}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-slate-700">
                      {row.level}
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
