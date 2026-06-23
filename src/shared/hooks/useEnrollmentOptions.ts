import { useCatalogOptions } from "./useCatalogOptions";
import { enrollmentService } from "@features/students/enrollments/enrollments.service";

export const useEnrollmentOptions = () => {
  const { options, loading } = useCatalogOptions(
    () => enrollmentService.list({ page: 1, pageSize: 100 }),
    [],
    (enrollment) => ({
      label: enrollment.student_name ?? `Matrícula ${enrollment.id}`,
      value: String(enrollment.id),
    }),
  );
  return { enrollmentOptions: options, loading };
};
