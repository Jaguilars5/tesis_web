import { Pencil } from "lucide-react";
import { useEffect } from "react";

import {
  tableClassname,
  tableColumnsClassname,
  tableFirstColumnClassname,
} from "@app/styles/styles";
import { Badge } from "@shared/components/Badge";
import { CustomTable } from "@shared/components/Table";

import { usePeriodGradeSummariesController } from "../../presentation/hooks/usePeriodGradeSummariesController";

import type { TableColumnProps } from "@shared/components/Table";
import type { PeriodGradeSummaryT } from "../../domain/entities/period-grade-summaries.types";

type PeriodGradeSummariesTableProps = {
  onEdit: (periodGradeSummary: PeriodGradeSummaryT) => void;
};

export const PeriodGradeSummariesTable = ({ onEdit }: PeriodGradeSummariesTableProps) => {
  const { periodGradeSummaries, isLoading, loadPeriodGradeSummaries } = usePeriodGradeSummariesController();

  useEffect(() => {
    loadPeriodGradeSummaries();
  }, [loadPeriodGradeSummaries]);

  const columns: TableColumnProps<PeriodGradeSummaryT>[] = [
    {
      key: "enrollment_name",
      label: "Matrícula",
      className: tableFirstColumnClassname,
      render: (s) => <span>{s.enrollment_name}</span>,
    },
    {
      key: "subject_offering_name",
      label: "Oferta de Materia",
      className: tableColumnsClassname,
      render: (s) => <span>{s.subject_offering_name}</span>,
    },
    {
      key: "academic_period_name",
      label: "Período Académico",
      className: tableColumnsClassname,
      render: (s) => <span>{s.academic_period_name}</span>,
    },
    {
      key: "formative_avg",
      label: "Prom. Formativo",
      className: tableColumnsClassname,
      render: (s) => <span>{s.formative_avg}</span>,
    },
    {
      key: "summative_avg",
      label: "Prom. Sumativo",
      className: tableColumnsClassname,
      render: (s) => <span>{s.summative_avg}</span>,
    },
    {
      key: "final_avg_truncated",
      label: "Prom. Final",
      className: tableColumnsClassname,
      render: (s) => <span>{s.final_avg_truncated}</span>,
    },
    {
      key: "requires_recovery",
      label: "Requiere Recuperación",
      className: tableColumnsClassname,
      render: (s) =>
        s.requires_recovery ? (
          <Badge variant="default">Sí</Badge>
        ) : (
          <Badge variant="outline">No</Badge>
        ),
    },
  ];

  return (
    <CustomTable<PeriodGradeSummaryT>
      data={periodGradeSummaries}
      columns={columns}
      isLoading={isLoading && periodGradeSummaries.length === 0}
      emptyMessage="No se encontraron resúmenes de calificaciones"
      actionsTitle="Acciones"
      className={tableClassname}
      loadingMessage="Cargando resúmenes de calificaciones..."
      rowActions={(s) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onEdit(s)}
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            title="Editar"
          >
            <Pencil className="size-4" />
          </button>
        </div>
      )}
    />
  );
};
