import { useCatalogOptions } from "./useCatalogOptions";
import { academicPeriodService } from "@features/academic/academic-period/academic-period.service";

export const useAcademicPeriodOptions = () => {
  const { options, loading } = useCatalogOptions(
    () => academicPeriodService.list({ page: 1, pageSize: 100 }).then((r) => r.items),
    [],
    (period) => ({ label: period.name, value: String(period.id) }),
  );
  return { academicPeriodOptions: options, loading };
};
