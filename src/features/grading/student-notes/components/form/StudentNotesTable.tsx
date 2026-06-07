import { Pencil } from "lucide-react";
import { useEffect } from "react";

import {
  tableClassname,
  tableColumnsClassname,
  tableFirstColumnClassname,
} from "@app/styles/styles";
import { Badge } from "@shared/components/Badge";
import { CustomTable } from "@shared/components/Table";

import { useStudentNotesController } from "../../presentation/hooks/useStudentNotesController";

import type { TableColumnProps } from "@shared/components/Table";
import type { StudentNoteT } from "../../domain/entities/student-notes.types";

type StudentNotesTableProps = {
  onEdit: (studentNote: StudentNoteT) => void;
};

export const StudentNotesTable = ({ onEdit }: StudentNotesTableProps) => {
  const { studentNotes, isLoading, loadStudentNotes } = useStudentNotesController();

  useEffect(() => {
    loadStudentNotes();
  }, [loadStudentNotes]);

  const columns: TableColumnProps<StudentNoteT>[] = [
    {
      key: "enrollment_name",
      label: "Matrícula",
      className: tableFirstColumnClassname,
      render: (s) => <span>{s.enrollment_name}</span>,
    },
    {
      key: "evaluative_activity_title",
      label: "Actividad Evaluativa",
      className: tableColumnsClassname,
      render: (s) => <span>{s.evaluative_activity_title}</span>,
    },
    {
      key: "numeric_score",
      label: "Puntaje",
      className: tableColumnsClassname,
      render: (s) => <span>{s.numeric_score ?? "-"}</span>,
    },
    {
      key: "grade_type_name",
      label: "Tipo de Calificación",
      className: tableColumnsClassname,
      render: (s) => <span>{s.grade_type_name}</span>,
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
    <CustomTable<StudentNoteT>
      data={studentNotes}
      columns={columns}
      isLoading={isLoading && studentNotes.length === 0}
      emptyMessage="No se encontraron notas de estudiantes"
      actionsTitle="Acciones"
      className={tableClassname}
      loadingMessage="Cargando notas de estudiantes..."
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
