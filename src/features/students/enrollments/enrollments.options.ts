import { useSectionOptions } from "@shared/hooks/useSectionOptions";
import { useStudentOptions } from "@shared/hooks/useStudentOptions";

export const useEnrollmentFilterCatalogs = () => {
  const { sectionOptions } = useSectionOptions();
  const { studentOptions } = useStudentOptions();

  const statusOptions = [
    { label: "Activo", value: "ACT" },
    { label: "Retirado", value: "WIT" },
    { label: "Egresado", value: "GRD" },
  ];

  return { sectionOptions, studentOptions, statusOptions };
};
