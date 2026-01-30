"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  buildStatsFromRows,
  type EmployeeStats,
  type RawRow,
} from "@/lib/data/employee-stats";

type LoadStatus = "loading" | "ready" | "error";

const emptyStats = buildStatsFromRows([]);

type ErrorPayload = {
  message?: string;
  details?: string;
  hint?: string;
  error?: string;
  error_description?: string;
};

function formatLoadError(err: unknown, tableName: string): string {
  if (typeof err === "string") {
    return err;
  }

  if (err && typeof err === "object") {
    const payload = err as ErrorPayload;
    const base = payload.message || payload.error || payload.error_description;
    const details = payload.details ? ` (${payload.details})` : "";
    const hint = payload.hint ? ` Hint: ${payload.hint}` : "";
    if (base) {
      return `${base}${details}${hint}`;
    }
  }

  return `Failed to load data from table "${tableName}".`;
}

export function useEmployeeStats() {
  const [stats, setStats] = useState<EmployeeStats>(emptyStats);
  const [rows, setRows] = useState<RawRow[]>([]);
  const [status, setStatus] = useState<LoadStatus>("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const tableName =
      process.env.NEXT_PUBLIC_VIEW_PEGAWAI_LENGKAP || "v_pegawai_lengkap";

    const load = async () => {
      const supabase = createClient();
      try {
        const { data, error } = await supabase.from(tableName).select("*");
        if (error) {
          throw error;
        }
        if (!cancelled) {
          const safeData = (data ?? []) as RawRow[];
          setRows(safeData);
          setStats(buildStatsFromRows(safeData));
          setStatus("ready");
        }
      } catch (err) {
        if (!cancelled) {
          setError(formatLoadError(err, tableName));
          setRows([]);
          setStats(emptyStats);
          setStatus("error");
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { stats, rows, status, error };
}
