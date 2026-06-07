import { useEffect } from "react";

import {
  tableClassname,
  tableColumnsClassname,
  tableFirstColumnClassname,
} from "@app/styles/styles";
import { CustomTable } from "@shared/components/Table";

import { useSubjectProjectController } from "../../presentation/hooks/useSubjectProjectController";

import type { TableColumnProps } from "@shared/components/Table";
import type { SubjectProjectT } from "../../domain/entities/subject-project.types";

export const SubjectProjectTable = () => {
  const { subjectProjects, isLoading, loadSubjectProjects } =
    useSubjectProjectController();

  useEffect(() => {
    loadSubjectProjects();
  }, [loadSubjectProjects]);

  const columns: TableColumnProps<SubjectProjectT>[] = [
    {
      key: "interdisciplinary_project_title",
      label: "Proyecto",
      className: tableFirstColumnClassname,
    },
    {
      key: "subject_offering_name",
      label: "Oferta de Materia",
      className: tableColumnsClassname,
    },
  ];

  return (
    <CustomTable<SubjectProjectT>
      data={subjectProjects}
      columns={columns}
      isLoading={isLoading && subjectProjects.length === 0}
      emptyMessage="No se encontraron vinculaciones"
      className={tableClassname}
      loadingMessage="Cargando vinculaciones..."
    />
  );
};
