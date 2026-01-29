import { render, screen } from "@testing-library/react";
import LoginPage from "../page";
import { describe, it, expect, vi } from "vitest";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: (key: string) => {
      if (key === "error") return "Invalid credentials";
      return null;
    },
  }),
}));

// Mock the login action - we just need it to exist
vi.mock("../login.actions", () => ({
  login: vi.fn(),
}));

describe("Login Page", () => {
  it("renders the login form elements", () => {
    render(<LoginPage />);

    expect(screen.getByText("Selamat Datang Kembali")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Masuk Dashboard/i }),
    ).toBeInTheDocument();

    // Check for links
    expect(screen.getByText("Lupa password?")).toBeInTheDocument();
    expect(screen.getByText("Syarat & Ketentuan")).toBeInTheDocument();
  });

  it("renders the side panel content", () => {
    render(<LoginPage />);
    expect(screen.getByText("Dashboard Pegawai")).toBeInTheDocument();
    expect(
      screen.getByText("Kelola Data Kepegawaian dengan Mudah & Cepat."),
    ).toBeInTheDocument();
  });

  it("displays error message when error param is present", () => {
    render(<LoginPage />);
    expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
  });
});
