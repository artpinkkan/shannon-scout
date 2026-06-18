import type { AuditEntry, AuditEntityType } from "./types";
import { CURRENT_USER } from "./mock-data";

const STORAGE_KEY = "shannon_audit_entries";

export function getStoredAuditEntries(): AuditEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuditEntry[]) : [];
  } catch {
    return [];
  }
}

export function addAuditEntry(
  entry: Omit<AuditEntry, "id" | "timestamp" | "actor">
): void {
  if (typeof window === "undefined") return;
  const entries = getStoredAuditEntries();
  const newEntry: AuditEntry = {
    ...entry,
    id: `dyn_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
    actor: CURRENT_USER.name,
  };
  entries.unshift(newEntry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function getStoredAuditEntriesByJobId(jobId: string): AuditEntry[] {
  return getStoredAuditEntries().filter((e) => e.jobId === jobId);
}
