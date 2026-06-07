import { Eye, Pencil } from "lucide-react";
import { useEffect } from "react";

import {
  tableClassname,
  tableColumnsClassname,
  tableFirstColumnClassname,
} from "@app/styles/styles";
import { Badge } from "@shared/components/Badge";
import { CustomTable } from "@shared/components/Table";

import { useAcademicGradeController } from "../../presentation/hooks/useAcademicGradeController";

import type { TableColumnProps } from "@shared/components/Table";
import type { AcademicGradeT } from "../../domain/entities/academic-grade.types";

type AcademicGradeTableProps = {
  onEdit: (academicGrade: AcademicGradeT) => void;
};

export const AcademicGradeTable = ({ onEdit }: AcademicGradeTableProps) => {
  const { academicGrades, isLoading, loadAcademicGrades } = useAcademicGradeController();

  useEffect(() => {
    loadAcademicGrades();
  }, [loadAcademicGrades]);

  const columns: TableColumnProps<AcademicGradeT>[] = [
    {
      key: "name",
      label: "Grado",
      className: tableFirstColumnClassname,
      render: (g) => <span>{g.name}</span>,
    },
    {
      key: "academic_level_name",
      label: "Nivel Académico",
      className: tableColumnsClassname,
    },
    {
      key: "sequence_order",
      label: "Orden",
      className: tableColumnsClassname,
    },
    {
      key: "is_active",
      label: "Estado",
      className: tableColumnsClassname,
      render: (g) =>
        g.is_active ? (
          <Badge variant="default">Activo</Badge>
        ) : (
          <Badge variant="outline">Inactivo</Badge>
        ),
    },
  ];

  return (
    <CustomTable<AcademicGradeT>
      data={academicGrades}
      columns={columns}
      isLoading={isLoading && academicGrades.length === 0}
      emptyMessage="No se encontraron grados académicos"
      actionsTitle="Acciones"
      className={tableClassname}
      loadingMessage="Cargando grados académicos..."
      rowActions={(g) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onEdit(g)}
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            title="Ver detalle"
          >
            <Eye className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(g)}
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
