import { cn } from "../utils";
import { describe, it, expect } from "vitest";

describe("utils", () => {
  describe("cn", () => {
    it("merges class names correctly", () => {
      expect(cn("w-full", "h-full")).toBe("w-full h-full");
    });

    it("handles conditional classes", () => {
      expect(cn("w-full", true && "h-full", false && "bg-red-500")).toBe(
        "w-full h-full",
      );
    });

    it("merges tailwind classes", () => {
      expect(cn("p-4", "p-8")).toBe("p-8");
    });
  });
});
