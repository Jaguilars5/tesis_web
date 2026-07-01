import { useEffect, useState } from "react";

import { activityTypeService } from "@features/grading/activity-types/activity-types.service";
import { subjectOfferingService } from "@features/academic/subject-offering/subject-offering.service";
import { useAcademicPeriodOptions } from "@shared/hooks/useAcademicPeriodOptions";

interface Option {
  label: string;
  value: string;
}

/**
 * Opciones para los filtros de la página de calificaciones del estudiante.
 *
 * Las opciones NO se construyen a partir de las actividades cargadas, sino que
 * se obtienen de sus catálogos/servicios:
 *  - Períodos: catálogo de períodos académicos.
 *  - Tipos de actividad: catálogo de tipos de actividad.
 *  - Materias: ofertas de materia de la sección en la que el estudiante está
 *    matriculado (por eso se filtran por `sectionId`).
 */
export const useStudentGradeOptions = (sectionId: number | null) => {
  const { academicPeriodOptions } = useAcademicPeriodOptions();
  const [activityTypeOptions, setActivityTypeOptions] = useState<Option[]>([]);
  const [subjectOptions, setSubjectOptions] = useState<Option[]>([]);

  useEffect(() => {
    let cancelled = false;
    activityTypeService
      .list({ page: 1, pageSize: 100 })
      .then(({ items }) => {
        if (cancelled) return;
        setActivityTypeOptions(
          items
            .filter((i) => i.is_active)
            .map((i) => ({ label: i.name, value: String(i.id) })),
        );
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!sectionId) {
      setSubjectOptions([]);
      return;
    }
    let cancelled = false;
    subjectOfferingService
      .list({ page: 1, pageSize: 100, filters: { section: sectionId } })
      .then(({ items }) => {
        if (cancelled) return;
        setSubjectOptions(
          items.map((i) => ({
            label: i.subject_academic_config_name,
            value: String(i.id),
          })),
        );
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [sectionId]);

  return {
    periodOptions: academicPeriodOptions,
    activityTypeOptions,
    subjectOptions,
  };
};
