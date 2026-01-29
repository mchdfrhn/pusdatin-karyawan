import { render, screen } from "@testing-library/react";
import Home from "../page";
import { describe, it, expect, vi } from "vitest";

// Mock the hook
vi.mock("@/hooks/use-employee-stats", () => ({
  useEmployeeStats: () => ({
    stats: {},
    rows: [{ id: 1, nama: "Test Employee" }],
    status: "success",
    error: null,
  }),
}));

// Mock complex sub-components to isolate the page test
vi.mock("@/components/pages/dashboard", () => ({
  EmployeeDashboard: () => <div data-testid="dashboard">Dashboard Content</div>,
}));
vi.mock("@/components/pages/by-age", () => ({
  EmployeeByAge: () => <div>By Age</div>,
}));
vi.mock("@/components/pages/by-gender", () => ({
  EmployeeByGender: () => <div>By Gender</div>,
}));
vi.mock("@/components/pages/by-education", () => ({
  EmployeeByEducation: () => <div>By Education</div>,
}));
vi.mock("@/components/pages/by-position", () => ({
  EmployeeByPosition: () => <div>By Position</div>,
}));
vi.mock("@/components/pages/by-department", () => ({
  EmployeeByDepartment: () => <div>By Department</div>,
}));
vi.mock("@/components/pages/employee-table", () => ({
  EmployeeTable: () => <div>Employee Table</div>,
}));

describe("Home Page", () => {
  it("renders the dashboard title", () => {
    render(<Home />);
    expect(
      screen.getByText("Sistem Informasi Kepegawaian"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Dashboard Manajemen Data Pegawai"),
    ).toBeInTheDocument();
  });

  it("renders the dashboard content by default", () => {
    render(<Home />);
    expect(screen.getByTestId("dashboard")).toBeInTheDocument();
  });
});
