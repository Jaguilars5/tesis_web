import { useEffect } from "react";

import {
  tableClassname,
  tableColumnsClassname,
  tableFirstColumnClassname,
} from "@app/styles/styles";
import { CustomTable } from "@shared/components/Table";

import { useGradeHistoryController } from "../presentation/hooks/useGradeHistoryController";

import type { TableColumnProps } from "@shared/components/Table";
import type { GradeChangeHistoryT } from "../domain/entities/grade-history.types";

export const GradeHistoryTable = () => {
  const { gradeHistoryItems, isLoading, loadGradeHistory } =
    useGradeHistoryController();

  useEffect(() => {
    loadGradeHistory();
  }, [loadGradeHistory]);

  const columns: TableColumnProps<GradeChangeHistoryT>[] = [
    {
      key: "student_note_name",
      label: "Nota",
      className: tableFirstColumnClassname,
      render: (s) => <span>{s.student_note_name}</span>,
    },
    {
      key: "modified_by_user_name",
      label: "Modificado por",
      className: tableColumnsClassname,
      render: (s) => <span>{s.modified_by_user_name}</span>,
    },
    {
      key: "previous_score",
      label: "Puntaje anterior",
      className: tableColumnsClassname,
      render: (s) => <span>{s.previous_score}</span>,
    },
    {
      key: "new_score",
      label: "Nuevo puntaje",
      className: tableColumnsClassname,
      render: (s) => <span>{s.new_score}</span>,
    },
    {
      key: "reason",
      label: "Motivo",
      className: tableColumnsClassname,
      render: (s) => <span>{s.reason}</span>,
    },
    {
      key: "modified_at",
      label: "Fecha de modificación",
      className: tableColumnsClassname,
      render: (s) => <span>{s.modified_at}</span>,
    },
  ];

  return (
    <CustomTable<GradeChangeHistoryT>
      data={gradeHistoryItems}
      columns={columns}
      isLoading={isLoading && gradeHistoryItems.length === 0}
      emptyMessage="No se encontraron registros de historial"
      className={tableClassname}
      loadingMessage="Cargando historial de calificaciones..."
    />
  );
};
