import { selectSections } from "@features/institutions/section/reducers/section.selectors";
import { fetchSections } from "@features/institutions/section/reducers/section.reducer";
import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

import { StudentFormModal } from "../components/StudentFormModal";
import { StudentTable } from "../components/StudentTable";
import type { StudentFormValues } from "../helpers/student.helpers";
import { createStudent, updateStudent } from "../redux/student.thunks";
import type { Student } from "../types/student.types";

export default function StudentPage() {
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const sections = useAppSelector(selectSections);

  useEffect(() => {
    dispatch(fetchSections({ page: 1, pageSize: 100 }));
  }, [dispatch]);

  const handleOpenModal = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: StudentFormValues) => {
    let result;
    if (editingStudent) {
      result = await dispatch(
        updateStudent({ ...values, id: editingStudent.id })
      );
    } else {
      result = await dispatch(createStudent(values));
    }

    if (
      createStudent.fulfilled.match(result) ||
      updateStudent.fulfilled.match(result)
    ) {
      handleCloseModal();
    }
  };

  const getInitialValues = (): StudentFormValues => {
    if (editingStudent) {
      return {
        dni: editingStudent.dni,
        names: editingStudent.names,
        last_names: editingStudent.last_names,
        birth_date: editingStudent.birth_date,
        section: editingStudent.section,
        enrollment_number: editingStudent.enrollment_number,
      };
    }
    return {
      dni: "",
      names: "",
      last_names: "",
      birth_date: "",
      section: 0,
      enrollment_number: null,
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">
            Estudiantes
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Gestiona los estudiantes del ano lectivo
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenModal}
          className="inline-flex items-center justify-center text-white bg-primary rounded-lg text-sm font-bold gap-2 px-4 py-2.5 transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60 shadow-sm"
        >
          <Plus className="size-4" />
          Nuevo Estudiante
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <StudentTable onEdit={handleEdit} />
      </div>

      <StudentFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialValues={getInitialValues()}
        isEdit={!!editingStudent}
        sections={sections}
      />
    </div>
  );
}
