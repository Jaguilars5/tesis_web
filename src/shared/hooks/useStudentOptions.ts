import { useCatalogOptions } from "./useCatalogOptions";
import { studentService } from "@features/students/student/student.service";

export const useStudentOptions = () => {
  const { options, loading } = useCatalogOptions(
    () => studentService.list({ page: 1, pageSize: 100 }),
    [],
    (student) => ({
      label: student.full_name,
      value: String(student.id),
    }),
  );
  return { studentOptions: options, loading };
};
