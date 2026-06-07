import { Eye, Pencil } from "lucide-react";
import { useEffect } from "react";

import {
  tableClassname,
  tableColumnsClassname,
  tableFirstColumnClassname,
} from "@app/styles/styles";
import { Badge } from "@shared/components/Badge";
import { CustomTable } from "@shared/components/Table";

import { useSubjectController } from "../../presentation/hooks/useSubjectController";

import type { TableColumnProps } from "@shared/components/Table";
import type { SubjectT } from "../../domain/entities/subject.types";

type SubjectTableProps = {
  onEdit: (subject: SubjectT) => void;
};

export const SubjectTable = ({ onEdit }: SubjectTableProps) => {
  const { subjects, isLoading, loadSubjects } = useSubjectController();

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  const columns: TableColumnProps<SubjectT>[] = [
    {
      key: "name",
      label: "Materia",
      className: tableFirstColumnClassname,
      render: (s) => <span>{s.name}</span>,
    },
    {
      key: "code",
      label: "Código",
      className: tableColumnsClassname,
    },
    {
      key: "is_active",
      label: "Estado",
      className: tableColumnsClassname,
      render: (s) =>
        s.is_active ? (
          <Badge variant="default">Activo</Badge>
        ) : (
          <Badge variant="outline">Inactivo</Badge>
        ),
    },
  ];

  return (
    <CustomTable<SubjectT>
      data={subjects}
      columns={columns}
      isLoading={isLoading && subjects.length === 0}
      emptyMessage="No se encontraron materias"
      actionsTitle="Acciones"
      className={tableClassname}
      loadingMessage="Cargando materias..."
      rowActions={(s) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onEdit(s)}
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            title="Ver detalle"
          >
            <Eye className="size-4" />
          </button>
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
