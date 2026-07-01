import { useCatalogOptions } from "./useCatalogOptions";
import { academicPeriodService } from "@features/academic/academic-period/academic-period.service";

import type { AcademicPeriodT } from "@features/academic/academic-period/academic-period.types";
import type { AcademicPeriodRangeOption } from "@features/academic/academic-period/academic-period.utils";

export const useAcademicPeriodOptions = () => {
  const { options, loading } = useCatalogOptions<
    AcademicPeriodT,
    AcademicPeriodRangeOption
  >(
    () => academicPeriodService.list({ page: 1, pageSize: 100 }).then((r) => r.items),
    [],
    (period): AcademicPeriodRangeOption => ({
      label: period.name,
      value: String(period.id),
      startDate: period.start_date,
      endDate: period.end_date,
    }),
  );
  return { academicPeriodOptions: options, loading };
};
