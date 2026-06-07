import { Eye, Pencil } from "lucide-react";
import { useEffect } from "react";

import {
  tableClassname,
  tableColumnsClassname,
  tableFirstColumnClassname,
} from "@app/styles/styles";
import { Badge } from "@shared/components/Badge";
import { CustomTable } from "@shared/components/Table";

import { useTeacherSubjectSections } from "../../application/teacher-subject-section.hooks";

import type { TableColumnProps } from "@shared/components/Table";
import type { TeacherSubjectSectionT } from "../../domain/teacher-subject-section.entity";

type TeacherSubjectSectionTableProps = {
  onEdit: (assignment: TeacherSubjectSectionT) => void;
};

export const TeacherSubjectSectionTable = ({
  onEdit,
}: TeacherSubjectSectionTableProps) => {
  const { teacherSubjectSections, isLoading, loadTeacherSubjectSections } =
    useTeacherSubjectSections();

  useEffect(() => {
    loadTeacherSubjectSections();
  }, [loadTeacherSubjectSections]);

  const columns: TableColumnProps<TeacherSubjectSectionT>[] = [
    {
      key: "user_name",
      label: "Docente",
      className: tableFirstColumnClassname,
    },
    {
      key: "subject_offering_name",
      label: "Oferta Materia",
      className: tableColumnsClassname,
    },
    {
      key: "is_active",
      label: "Estado",
      className: tableColumnsClassname,
      render: (t) =>
        t.is_active ? (
          <Badge variant="default">Activo</Badge>
        ) : (
          <Badge variant="outline">Inactivo</Badge>
        ),
    },
  ];

  return (
    <CustomTable<TeacherSubjectSectionT>
      data={teacherSubjectSections}
      columns={columns}
      isLoading={isLoading && teacherSubjectSections.length === 0}
      emptyMessage="No se encontraron asignaciones docente-materia"
      actionsTitle="Acciones"
      className={tableClassname}
      loadingMessage="Cargando asignaciones..."
      rowActions={(t) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onEdit(t)}
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            title="Ver detalle"
          >
            <Eye className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(t)}
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
