import { renderHook, waitFor } from "@testing-library/react";
import { useEmployeeStats } from "../use-employee-stats";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { supabase } from "@/lib/supabase/client";

// Mock supabase client
vi.mock("@/lib/supabase/client", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(),
    })),
  },
}));

describe("useEmployeeStats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns initial loading state", () => {
    // Mock implementation to delay or just generic return
    const selectMock = vi.fn().mockReturnValue(new Promise(() => {}));
    const fromMock = vi
      .mocked(supabase.from)
      .mockReturnValue({ select: selectMock } as any);

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

    const selectMock = vi
      .fn()
      .mockResolvedValue({ data: mockData, error: null });
    const fromMock = vi
      .mocked(supabase.from)
      .mockReturnValue({ select: selectMock } as any);

    const { result } = renderHook(() => useEmployeeStats());

    await waitFor(() => {
      expect(result.current.status).toBe("ready");
    });

    expect(result.current.rows).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it("handles error state", async () => {
    const mockError = { message: "Network error" };

    const selectMock = vi
      .fn()
      .mockResolvedValue({ data: null, error: mockError });
    const fromMock = vi
      .mocked(supabase.from)
      .mockReturnValue({ select: selectMock } as any);

    const { result } = renderHook(() => useEmployeeStats());

    await waitFor(() => {
      expect(result.current.status).toBe("error");
    });

    expect(result.current.error).toContain("Network error");
  });
});
