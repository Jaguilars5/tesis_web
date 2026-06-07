import { Pencil, Trash2 } from "lucide-react";
import { useEffect } from "react";

import { CustomTable } from "@shared/components/Table";
import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";

import {
  selectStudents,
  selectStudentsStatus,
} from "../redux/student.selectors";
import { deleteStudent, fetchStudents } from "../redux/student.thunks";

import type { TableColumnProps } from "@shared/components/Table";
import type { Student } from "../types/student.types";

type StudentTableProps = {
  onEdit: (student: Student) => void;
};

export function StudentTable({ onEdit }: StudentTableProps) {
  const dispatch = useAppDispatch();
  const students = useAppSelector(selectStudents);
  const status = useAppSelector(selectStudentsStatus);

  const tableData = Array.isArray(students) ? students : [];

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  const columns: TableColumnProps<Student>[] = [
    {
      key: "dni",
      label: "Cedula",
    },
    {
      key: "full_name",
      label: "Nombres",
      render: (s) => (
        <span className="font-semibold text-slate-800">{s.full_name}</span>
      ),
    },
    {
      key: "section_name",
      label: "Seccion",
    },
    {
      key: "birth_date",
      label: "Fecha Nac.",
    },
    {
      key: "enrollment_number",
      label: "No. Matricula",
      render: (s) => s.enrollment_number ?? "-",
    },
  ];

  return (
    <CustomTable<Student>
      data={tableData}
      columns={columns}
      isLoading={status === "loading" && tableData.length === 0}
      emptyMessage="No se encontraron estudiantes"
      rowActions={(s) => (
        <>
          <button
            type="button"
            onClick={() => onEdit(s)}
            className="btn-action primary"
            title="Editar"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => dispatch(deleteStudent({ id: s.id }))}
            className="btn-action danger"
            title="Eliminar"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </>
      )}
    />
  );
}
