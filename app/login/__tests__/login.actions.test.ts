import { describe, it, expect, vi, beforeEach } from "vitest";
import { login, signOut } from "../login.actions";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Mock dependencies
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("Login Actions", () => {
  let mockSupabase: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup mock supabase client
    mockSupabase = {
      auth: {
        signInWithPassword: vi.fn(),
        signOut: vi.fn(),
      },
    };
    (createClient as any).mockResolvedValue(mockSupabase);
  });

  describe("login", () => {
    it("redirects with error when login fails", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const formData = new FormData();
      formData.append("email", "test@example.com");
      formData.append("password", "password");

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        error: { message: "Invalid credentials" },
      });

      await login(formData);

      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password",
      });
      expect(consoleSpy).toHaveBeenCalledWith(
        "Login error:",
        "Invalid credentials",
      );
      // Should redirect to login page with error param
      expect(redirect).toHaveBeenCalledWith(
        expect.stringContaining("/login?error=Invalid%20credentials"),
      );
      consoleSpy.mockRestore();
    });

    it("redirects to home on success", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      const formData = new FormData();
      formData.append("email", "test@example.com");
      formData.append("password", "password");

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        error: null,
      });

      await login(formData);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Login successful, redirecting to /",
      );
      expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
      expect(redirect).toHaveBeenCalledWith("/");
      consoleSpy.mockRestore();
    });
  });

  describe("signOut", () => {
    it("signs out and redirects to login", async () => {
      await signOut();

      expect(mockSupabase.auth.signOut).toHaveBeenCalled();
      expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
      expect(redirect).toHaveBeenCalledWith("/login");
    });
  });
});
