import { Eye, Pencil } from "lucide-react";
import { useEffect } from "react";

import {
  tableClassname,
  tableColumnsClassname,
  tableFirstColumnClassname,
} from "@app/styles/styles";
import { Badge } from "@shared/components/Badge";
import { CustomTable } from "@shared/components/Table";

import { useSchoolYearController } from "../../presentation/hooks/useSchoolYearController";

import type { TableColumnProps } from "@shared/components/Table";
import type { SchoolYearT } from "../../domain/entities/school-year.types";

type SchoolYearTableProps = {
  onEdit: (schoolYear: SchoolYearT) => void;
};

export const SchoolYearTable = ({ onEdit }: SchoolYearTableProps) => {
  const { schoolYears, isLoading, loadSchoolYears } = useSchoolYearController();

  useEffect(() => {
    loadSchoolYears();
  }, [loadSchoolYears]);

  const columns: TableColumnProps<SchoolYearT>[] = [
    {
      key: "name",
      label: "Año Escolar",
      className: tableFirstColumnClassname,
      render: (sy) => <span>{sy.name}</span>,
    },
    {
      key: "start_date",
      label: "Fecha Inicio",
      className: tableColumnsClassname,
    },
    {
      key: "end_date",
      label: "Fecha Fin",
      className: tableColumnsClassname,
    },
    {
      key: "is_active",
      label: "Estado",
      className: tableColumnsClassname,
      render: (sy) =>
        sy.is_active ? (
          <Badge variant="default">Activo</Badge>
        ) : (
          <Badge variant="outline">Inactivo</Badge>
        ),
    },
  ];

  return (
    <CustomTable<SchoolYearT>
      data={schoolYears}
      columns={columns}
      isLoading={isLoading && schoolYears.length === 0}
      emptyMessage="No se encontraron años escolares"
      actionsTitle="Acciones"
      className={tableClassname}
      loadingMessage="Cargando años escolares..."
      rowActions={(sy) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onEdit(sy)}
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            title="Ver detalle"
          >
            <Eye className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(sy)}
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
