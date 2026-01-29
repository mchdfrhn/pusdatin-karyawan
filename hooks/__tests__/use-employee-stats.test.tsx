import { renderHook, waitFor } from "@testing-library/react";
import { useEmployeeStats } from "../use-employee-stats";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Define mock functions outside to be accessible
const mockSelect = vi.fn();
const mockFrom = vi.fn(() => ({
  select: mockSelect,
}));

// Mock supabase client
vi.mock("@/lib/supabase/client", () => ({
  createClient: vi.fn(() => ({
    from: mockFrom,
  })),
}));

describe("useEmployeeStats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns initial loading state", () => {
    // Mock implementation to delay or just generic return
    mockSelect.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useEmployeeStats());

    expect(result.current.status).toBe("loading");
    expect(result.current.rows).toEqual([]);
    expect(result.current.stats).toBeDefined();
  });

  it("loads data successfully", async () => {
    const mockData = [
      {
        id: 1,
        nama_lengkap: "John Doe",
        kategori: "PNS",
        jenis_kelamin: "Laki-laki",
      },
    ];

    mockSelect.mockResolvedValue({ data: mockData, error: null });

    const { result } = renderHook(() => useEmployeeStats());

    await waitFor(() => {
      expect(result.current.status).toBe("ready");
    });

    expect(result.current.rows).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it("handles error state", async () => {
    const mockError = { message: "Network error" };

    mockSelect.mockResolvedValue({ data: null, error: mockError });

    const { result } = renderHook(() => useEmployeeStats());

    await waitFor(() => {
      expect(result.current.status).toBe("error");
    });

    expect(result.current.error).toContain("Network error");
  });
});
