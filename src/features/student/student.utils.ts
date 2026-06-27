import type { PeriodGradeSummaryRaw } from "./student.types";
export const averageBadge = (avg: number): string => avg >= 7 ? "bg-emerald-100 text-emerald-800" : avg >= 5 ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800";
export const scoreBadge = (score: number | null): string => score !== null ? (score >= 7 ? "bg-emerald-100 text-emerald-800" : score >= 5 ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800") : "bg-slate-100 text-slate-500";
export const statusBadge = (status: string): string => { const m: Record<string, string> = { Presente: "bg-emerald-100 text-emerald-700", Ausente: "bg-red-100 text-red-700", Tardanza: "bg-amber-100 text-amber-700", "Falta Justificada": "bg-blue-100 text-blue-700" }; return m[status] ?? "bg-slate-100 text-slate-600"; };
export const severityBadge = (severity: string): string => severity?.toLowerCase().includes("alto") ? "bg-red-100 text-red-700" : severity?.toLowerCase().includes("medio") ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600";
export const severityDot = (severity: string): string => severity?.toLowerCase().includes("alto") ? "bg-red-500" : severity?.toLowerCase().includes("medio") ? "bg-amber-500" : "bg-slate-400";
export function promotionBadge(status: string): string { const s = status.toLowerCase(); if (s.includes("aprobado") || s.includes("aprovado")) return "bg-green-100 text-green-700"; if (s.includes("reprobado") || s.includes("perdido")) return "bg-red-100 text-red-700"; return "bg-slate-100 text-slate-600"; }

export function mapGradeActivities(summaries: PeriodGradeSummaryRaw[]): { subjects: { name: string; average: number; qualitativeScale: string | null; isFailing: boolean }[]; overallAverage: number | null; recoveryCount: number } {
  const subjects = summaries.map((s) => ({ name: s.subject_offering_name, average: s.final_avg_truncated, qualitativeScale: s.qualitative_scale_name, isFailing: s.is_failing }));
  const validAverages = subjects.filter((s) => s.average !== null).map((s) => s.average as number);
  const overallAverage = validAverages.length > 0 ? Math.round((validAverages.reduce((a, b) => a + b, 0) / validAverages.length) * 10) / 10 : null;
  return { subjects, overallAverage, recoveryCount: subjects.filter((s) => s.isFailing).length };
}
