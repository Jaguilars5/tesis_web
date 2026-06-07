import { Eye, Pencil } from "lucide-react";
import { useEffect } from "react";

import {
  tableClassname,
  tableColumnsClassname,
  tableFirstColumnClassname,
} from "@app/styles/styles";
import { Badge } from "@shared/components/Badge";
import { CustomTable } from "@shared/components/Table";

import { useSubjectOfferingController } from "../../presentation/hooks/useSubjectOfferingController";

import type { TableColumnProps } from "@shared/components/Table";
import type { SubjectOfferingT } from "../../domain/entities/subject-offering.types";

type SubjectOfferingTableProps = {
  onEdit: (offering: SubjectOfferingT) => void;
};

export const SubjectOfferingTable = ({
  onEdit,
}: SubjectOfferingTableProps) => {
  const { subjectOfferings, isLoading, loadSubjectOfferings } =
    useSubjectOfferingController();

  useEffect(() => {
    loadSubjectOfferings();
  }, [loadSubjectOfferings]);

  const columns: TableColumnProps<SubjectOfferingT>[] = [
    {
      key: "school_year_name",
      label: "Ano Escolar",
      className: tableFirstColumnClassname,
    },
    {
      key: "section_name",
      label: "Seccion",
      className: tableColumnsClassname,
    },
    {
      key: "subject_academic_config_name",
      label: "Configuracion",
      className: tableColumnsClassname,
    },
    {
      key: "is_active",
      label: "Estado",
      className: tableColumnsClassname,
      render: (o) =>
        o.is_active ? (
          <Badge variant="default">Activo</Badge>
        ) : (
          <Badge variant="outline">Inactivo</Badge>
        ),
    },
  ];

  return (
    <CustomTable<SubjectOfferingT>
      data={subjectOfferings}
      columns={columns}
      isLoading={isLoading && subjectOfferings.length === 0}
      emptyMessage="No se encontraron ofertas de materia"
      actionsTitle="Acciones"
      className={tableClassname}
      loadingMessage="Cargando ofertas..."
      rowActions={(o) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onEdit(o)}
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            title="Ver detalle"
          >
            <Eye className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(o)}
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            title="Editar"
          >
            <Pencil className="size-4" />
          </button>
        </div>
      )}
    />
  );
};
