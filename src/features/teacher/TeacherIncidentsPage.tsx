import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";

import { tableClassname, tableColumnsClassname, tableFirstColumnClassname } from "@app/styles/styles";
import { CustomTable } from "@shared/components/Table";
import { conductIncidentService } from "@features/behavior/conduct-incident";
import type { ConductIncidentT } from "@features/behavior/conduct-incident/conduct-incident.types";
import type { TableColumnProps } from "@shared/components/Table";

export default function TeacherIncidentsPage() {
  const [incidents, setIncidents] = useState<ConductIncidentT[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let c = false;
    conductIncidentService.list({ page: 1, pageSize: 100 }).then((items) => { if (!c) setIncidents(items); }).catch((err) => { if (!c) setError(err.message); });
    return () => { c = true; };
  }, []);

  const severityBadge = (severity: string) => {
    const s = severity?.toLowerCase() ?? "";
    if (s.includes("alto") || s.includes("grave")) return "bg-red-100 text-red-700";
    if (s.includes("medio") || s.includes("moderado")) return "bg-amber-100 text-amber-700";
    return "bg-slate-100 text-slate-600";
  };

  const cols: TableColumnProps<ConductIncidentT>[] = [
    { key: "incident_type_name", label: "Tipo", className: tableFirstColumnClassname },
    { key: "enrollment_name", label: "Estudiante", className: tableColumnsClassname },
    { key: "severity_name", label: "Gravedad", className: tableColumnsClassname, render: (i) => (<span className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ${severityBadge(i.severity_name)}`}><span className={`size-1.5 rounded-full ${i.severity_name?.toLowerCase().includes("alto") ? "bg-red-500" : i.severity_name?.toLowerCase().includes("medio") ? "bg-amber-500" : "bg-slate-400"}`} />{i.severity_name}</span>) },
    { key: "incident_date", label: "Fecha", className: tableColumnsClassname, render: (i) => (<span className="inline-flex items-center gap-1"><Calendar className="size-3.5 text-slate-400" />{i.incident_date}</span>) },
    { key: "description", label: "Descripción", className: tableColumnsClassname, render: (i) => <span className="line-clamp-1 text-slate-500">{i.description ?? "—"}</span> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Incidentes de Conducta</h1>
          <p className="mt-1 text-sm text-slate-500">Registro de incidentes de conducta de los estudiantes</p>
        </div>
      </div>
      {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>}
      <div className="overflow-visible rounded-xl border border-slate-200 bg-white shadow-sm">
        <CustomTable<ConductIncidentT> data={incidents} columns={cols} isLoading={incidents.length === 0} emptyMessage="No se encontraron incidentes registrados" className={tableClassname} loadingMessage="Cargando incidentes..." />
      </div>
    </div>
  );
}
