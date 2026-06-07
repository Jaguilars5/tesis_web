import { Eye, Pencil } from "lucide-react";
import { useEffect } from "react";

import {
  tableClassname,
  tableColumnsClassname,
  tableFirstColumnClassname,
} from "@app/styles/styles";
import { CustomTable } from "@shared/components/Table";

import { useAcademicPeriodController } from "../../presentation/hooks/useAcademicPeriodController";

import type { TableColumnProps } from "@shared/components/Table";
import type { AcademicPeriodT } from "../../domain/entities/academic-period.types";

type AcademicPeriodTableProps = {
  onEdit: (academicPeriod: AcademicPeriodT) => void;
};

export const AcademicPeriodTable = ({
  onEdit,
}: AcademicPeriodTableProps) => {
  const { academicPeriods, isLoading, loadAcademicPeriods } =
    useAcademicPeriodController();

  useEffect(() => {
    loadAcademicPeriods();
  }, [loadAcademicPeriods]);

  const columns: TableColumnProps<AcademicPeriodT>[] = [
    {
      key: "name",
      label: "Periodo",
      className: tableFirstColumnClassname,
      render: (p) => <span>{p.name}</span>,
    },
    {
      key: "period_type",
      label: "Tipo",
      className: tableColumnsClassname,
    },
    {
      key: "school_year_name",
      label: "Año Escolar",
      className: tableColumnsClassname,
    },
    {
      key: "start_date",
      label: "Inicio",
      className: tableColumnsClassname,
    },
    {
      key: "end_date",
      label: "Fin",
      className: tableColumnsClassname,
    },
  ];

  return (
    <CustomTable<AcademicPeriodT>
      data={academicPeriods}
      columns={columns}
      isLoading={isLoading && academicPeriods.length === 0}
      emptyMessage="No se encontraron periodos academicos"
      actionsTitle="Acciones"
      className={tableClassname}
      loadingMessage="Cargando periodos academicos..."
      rowActions={(p) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onEdit(p)}
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            title="Ver detalle"
          >
            <Eye className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(p)}
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
