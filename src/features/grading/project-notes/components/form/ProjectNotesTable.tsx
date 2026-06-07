import { Pencil } from "lucide-react";
import { useEffect } from "react";

import {
  tableClassname,
  tableColumnsClassname,
  tableFirstColumnClassname,
} from "@app/styles/styles";
import { Badge } from "@shared/components/Badge";
import { CustomTable } from "@shared/components/Table";

import { useProjectNotesController } from "../../presentation/hooks/useProjectNotesController";

import type { TableColumnProps } from "@shared/components/Table";
import type { ProjectNoteT } from "../../domain/entities/project-notes.types";

type ProjectNotesTableProps = {
  onEdit: (projectNote: ProjectNoteT) => void;
};

export const ProjectNotesTable = ({ onEdit }: ProjectNotesTableProps) => {
  const { projectNotes, isLoading, loadProjectNotes } = useProjectNotesController();

  useEffect(() => {
    loadProjectNotes();
  }, [loadProjectNotes]);

  const columns: TableColumnProps<ProjectNoteT>[] = [
    {
      key: "enrollment_name",
      label: "Matrícula",
      className: tableFirstColumnClassname,
      render: (s) => <span>{s.enrollment_name}</span>,
    },
    {
      key: "interdisciplinary_project_title",
      label: "Proyecto Interdisciplinario",
      className: tableColumnsClassname,
      render: (s) => <span>{s.interdisciplinary_project_title}</span>,
    },
    {
      key: "product_score",
      label: "Nota Producto",
      className: tableColumnsClassname,
      render: (s) => <span>{s.product_score}</span>,
    },
    {
      key: "presentation_score",
      label: "Nota Exposición",
      className: tableColumnsClassname,
      render: (s) => <span>{s.presentation_score}</span>,
    },
    {
      key: "final_score",
      label: "Nota Final",
      className: tableColumnsClassname,
      render: (s) => <span>{s.final_score}</span>,
    },
    {
      key: "sync_status",
      label: "Estado Sincronización",
      className: tableColumnsClassname,
      render: (s) => {
        const variant =
          s.sync_status === "SINCRONIZADO"
            ? "default"
            : s.sync_status === "ERROR"
              ? "outline"
              : "secondary";
        return <Badge variant={variant}>{s.sync_status}</Badge>;
      },
    },
  ];

  return (
    <CustomTable<ProjectNoteT>
      data={projectNotes}
      columns={columns}
      isLoading={isLoading && projectNotes.length === 0}
      emptyMessage="No se encontraron notas de proyectos interdisciplinarios"
      actionsTitle="Acciones"
      className={tableClassname}
      loadingMessage="Cargando notas de proyectos interdisciplinarios..."
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
