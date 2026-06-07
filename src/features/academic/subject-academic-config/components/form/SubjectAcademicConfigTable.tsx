import { Eye, Pencil } from "lucide-react";
import { useEffect } from "react";

import {
  tableClassname,
  tableColumnsClassname,
  tableFirstColumnClassname,
} from "@app/styles/styles";
import { Badge } from "@shared/components/Badge";
import { CustomTable } from "@shared/components/Table";

import { useSubjectAcademicConfigController } from "../../presentation/hooks/useSubjectAcademicConfigController";

import type { TableColumnProps } from "@shared/components/Table";
import type { SubjectAcademicConfigT } from "../../domain/entities/subject-academic-config.entity";

type SubjectAcademicConfigTableProps = {
  onEdit: (config: SubjectAcademicConfigT) => void;
};

export const SubjectAcademicConfigTable = ({
  onEdit,
}: SubjectAcademicConfigTableProps) => {
  const { subjectAcademicConfigs, isLoading, loadSubjectAcademicConfigs } =
    useSubjectAcademicConfigController();

  useEffect(() => {
    loadSubjectAcademicConfigs();
  }, [loadSubjectAcademicConfigs]);

  const columns: TableColumnProps<SubjectAcademicConfigT>[] = [
    {
      key: "subject_name",
      label: "Materia",
      className: tableFirstColumnClassname,
    },
    {
      key: "academic_grade_name",
      label: "Grado",
      className: tableColumnsClassname,
    },
    {
      key: "weekly_hours",
      label: "Horas",
      className: tableColumnsClassname,
    },
    {
      key: "pedagogical_order",
      label: "Orden",
      className: tableColumnsClassname,
    },
    {
      key: "is_required",
      label: "Obligatorio",
      className: tableColumnsClassname,
      render: (c) =>
        c.is_required ? (
          <Badge variant="default">Si</Badge>
        ) : (
          <Badge variant="outline">No</Badge>
        ),
    },
    {
      key: "is_active",
      label: "Estado",
      className: tableColumnsClassname,
      render: (c) =>
        c.is_active ? (
          <Badge variant="default">Activo</Badge>
        ) : (
          <Badge variant="outline">Inactivo</Badge>
        ),
    },
  ];

  return (
    <CustomTable<SubjectAcademicConfigT>
      data={subjectAcademicConfigs}
      columns={columns}
      isLoading={isLoading && subjectAcademicConfigs.length === 0}
      emptyMessage="No se encontraron configuraciones"
      actionsTitle="Acciones"
      className={tableClassname}
      loadingMessage="Cargando configuraciones..."
      rowActions={(c) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onEdit(c)}
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            title="Ver detalle"
          >
            <Eye className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(c)}
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
