import {
  AlertTriangle,
  CalendarCheck,
  GraduationCap,
  HeartHandshake,
  UserCheck,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAcademicPeriodController } from "@features/academic/academic-period";
import { useDirectorDashboard } from "@features/analytics";
import { Badge } from "@shared/components/Badge";
import { PageHeader } from "@shared/components/PageHeader";

const RISK_COLORS: Record<string, string> = {
  rojo: "bg-red-600",
  amarillo: "bg-amber-400",
  verde: "bg-emerald-500",
};
const RISK_LABELS: Record<string, string> = {
  rojo: "Crítico",
  amarillo: "Alto",
  verde: "Medio",
};
const URGENCY_BADGE: Record<string, string> = {
  critical: "bg-red-600 text-white",
  high: "bg-orange-600 text-white",
  medium: "bg-amber-500 text-white",
  low: "bg-slate-200 text-slate-700",
};

function formatPercent(v: number | undefined): string {
  return v !== undefined && v !== null ? `${v.toFixed(1)}%` : "—";
}
function formatNumber(v: number | undefined): string {
  return v !== undefined && v !== null ? v.toLocaleString("es-EC") : "—";
}
function formatMonth(ym: string): string {
  const [y, m] = ym.split("-");
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString("es-EC", {
    month: "short",
  });
}
function formatDate(iso: string | null | undefined): string {
  return iso
    ? new Date(iso).toLocaleDateString("es-EC", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "—";
}

export function DirectorDashboard() {
  const { academicPeriods, loadAcademicPeriods } =
    useAcademicPeriodController();
  const {
    overview,
    riskDistribution,
    enrollmentTrend,
    criticalAlerts,
    isLoading,
    error,
    loadDirectorDashboard,
  } = useDirectorDashboard();
  const defaultPeriodId = useMemo(() => {
    if (academicPeriods.length === 0) return null;
    return (
      academicPeriods.find((p) => p.is_active)?.id ??
      academicPeriods[0]?.id ??
      null
    );
  }, [academicPeriods]);
  const [selectedPeriodId, setSelectedPeriodId] = useState<number | null>(null);
  const effectivePeriodId = selectedPeriodId ?? defaultPeriodId;

  useEffect(() => {
    loadAcademicPeriods({ page: 1, pageSize: 100 });
  }, [loadAcademicPeriods]);
  useEffect(() => {
    if (effectivePeriodId !== null)
      loadDirectorDashboard({ period_id: effectivePeriodId });
  }, [effectivePeriodId, loadDirectorDashboard]);

  const riskBreakdown = useMemo(() => {
    if (!riskDistribution) return [];
    return Object.entries(riskDistribution)
      .map(([label, value]) => ({
        label,
        value: value.rojo + value.amarillo + value.verde,
        color: RISK_COLORS[label] ?? "bg-slate-400",
      }))
      .filter((r) => r.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [riskDistribution]);
  const totalAtRisk = useMemo(() => {
    if (!overview) return 0;
    const d = overview.risk_distribution;
    return d.rojo + d.amarillo + d.verde;
  }, [overview]);
  const enrollmentData = useMemo(
    () =>
      enrollmentTrend.map((p) => ({
        month: formatMonth(p.month),
        count: p.count,
      })),
    [enrollmentTrend],
  );

  const stats = useMemo(() => {
    if (!overview)
      return [
        { label: "Estudiantes", value: "—", icon: Users, trend: "Cargando…" },
        { label: "Asistencia Global", value: "—", icon: UserCheck, trend: "—" },
        {
          label: "Promedio Formativo",
          value: "—",
          icon: GraduationCap,
          trend: "—",
        },
        {
          label: "Alertas Activas",
          value: "—",
          icon: AlertTriangle,
          trend: "—",
        },
      ];
    return [
      {
        label: "Estudiantes",
        value: formatNumber(overview.total_students),
        icon: Users,
      },
      {
        label: "Asistencia Global",
        value: formatPercent(overview.attendance_rate_avg),
        icon: UserCheck,
      },
      {
        label: "Promedio Formativo",
        value: `${overview.formative_avg.toFixed(1)}`,
        icon: GraduationCap,
      },
      {
        label: "Alertas Activas",
        value: formatNumber(overview.active_alerts),
        icon: AlertTriangle,
      },
    ];
  }, [overview, totalAtRisk]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6">
        <PageHeader
          title="Dashboard"
          description="Resumen general del año escolar en curso"
        />
        <div className="flex items-center gap-2">
          <label
            htmlFor="period-select"
            className="text-sm font-medium text-slate-600"
          >
            Período:
          </label>
          <select
            id="period-select"
            value={effectivePeriodId ?? ""}
            onChange={(e) => setSelectedPeriodId(Number(e.target.value))}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-800 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            disabled={isLoading || academicPeriods.length === 0}
          >
            {academicPeriods.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} {p.is_active ? "· activo" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="rounded-xl border border-slate-200 bg-white p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{s.label}</p>
                  <p className="mt-2 text-2xl font-bold text-slate-800">
                    {s.value}
                  </p>
                  {/* <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                    <TrendingUp className="size-3" /> {s.trend}
                  </p> */}
                </div>
                <div className="rounded-lg bg-slate-100 p-2">
                  <Icon className="size-5 text-primary" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2">
          <h3 className="font-bold text-slate-800">Evolución de Matrículas</h3>
          {enrollmentData.length === 0 ? (
            <p className="mt-6 text-sm text-slate-500">
              Sin datos de matrículas registrados.
            </p>
          ) : (
            <div className="mt-4 flex items-end gap-2" style={{ height: 200 }}>
              {enrollmentData.map((d) => {
                const maxCount = Math.max(
                  ...enrollmentData.map((x) => x.count),
                );
                const h = maxCount > 0 ? (d.count / maxCount) * 100 : 0;
                return (
                  <div
                    key={d.month}
                    className="flex flex-1 flex-col items-center gap-1"
                  >
                    <span className="text-xs text-slate-500">{d.count}</span>
                    <div
                      className="w-full rounded-t-md bg-blue-600 transition-all"
                      style={{ height: `${h}%` }}
                    />
                    <span className="text-xs text-slate-500">{d.month}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="font-bold text-slate-800">
            Alertas por Nivel de Riesgo
          </h3>
          {riskBreakdown.length === 0 ? (
            <p className="mt-6 text-sm text-slate-500">
              Sin distribución calculada.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {riskBreakdown.map((r) => (
                <div key={r.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">
                      {RISK_LABELS[r.label] ?? r.label}
                    </span>
                    <span className="font-medium">{r.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${r.color}`}
                      style={{
                        width: `${totalAtRisk > 0 ? (r.value / totalAtRisk) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 font-bold text-slate-800">
            <AlertTriangle className="size-5 text-red-600" />
            Alertas Tempranas Críticas
          </h3>
          {criticalAlerts.length === 0 ? (
            <p className="mt-6 text-sm text-slate-500">
              Sin alertas activas en este período.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {criticalAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between rounded-lg bg-slate-50 p-3"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <p className="truncate text-sm font-medium">
                      {alert.enrollment_name}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {alert.description}
                    </p>
                  </div>
                  <Badge
                    className={
                      URGENCY_BADGE[alert.urgency_level ?? "low"] ??
                      "bg-slate-200 text-slate-700"
                    }
                  >
                    {alert.urgency_level
                      ? alert.urgency_level.charAt(0).toUpperCase() +
                        alert.urgency_level.slice(1)
                      : "—"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="flex items-center gap-2 font-bold text-slate-800">
            <HeartHandshake className="size-5" />
            Incidentes Recientes
          </h3>
          {criticalAlerts.length === 0 ? (
            <p className="mt-6 text-sm text-slate-500">
              Sin incidentes registrados.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {criticalAlerts.slice(0, 4).map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 rounded-lg bg-slate-50 p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {alert.enrollment_name}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {alert.description}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                      <CalendarCheck className="size-3" />{" "}
                      {formatDate(alert.detected_at)}
                    </p>
                  </div>
                  <Badge
                    className={
                      URGENCY_BADGE[alert.urgency_level ?? "low"] ??
                      "bg-slate-200 text-slate-700"
                    }
                  >
                    {alert.urgency_level
                      ? alert.urgency_level.charAt(0).toUpperCase() +
                        alert.urgency_level.slice(1)
                      : "—"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
