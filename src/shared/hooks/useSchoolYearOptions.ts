import { useCatalogOptions } from "./useCatalogOptions";
import { schoolYearService } from "@features/institutions/school-year/school-year.service";

export const useSchoolYearOptions = () => {
  const { options, loading } = useCatalogOptions(
    () => schoolYearService.list({ page: 1, pageSize: 100 }),
    [],
    (y) => ({ label: y.name, value: String(y.id) }),
  );
  return { schoolYearOptions: options, loading };
};
