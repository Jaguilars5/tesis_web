import { useCatalogOptions } from "./useCatalogOptions";
import { sectionService } from "@features/institutions/section/section.service";

export const useSectionOptions = () => {
  const { options, loading } = useCatalogOptions(
    () => sectionService.list({ page: 1, pageSize: 100 }),
    [],
    (section) => {
      const parts = [section.school_year_name, section.academic_grade_name, section.parallel]
        .filter(Boolean)
        .join(" - ");
      return { label: parts || `Sección ${section.id}`, value: String(section.id) };
    },
  );
  return { sectionOptions: options, loading };
};
