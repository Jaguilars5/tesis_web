import { Eye, Pencil } from "lucide-react";
import { useEffect } from "react";

import {
  tableClassname,
  tableColumnsClassname,
  tableFirstColumnClassname,
} from "@app/styles/styles";
import { Badge } from "@shared/components/Badge";
import { CustomTable } from "@shared/components/Table";

import { useSectionController } from "../../presentation/hooks/useSectionController";

import type { TableColumnProps } from "@shared/components/Table";
import type { SectionT } from "../../domain/entities/section.types";

type SectionTableProps = {
  onEdit: (section: SectionT) => void;
};

export const SectionTable = ({ onEdit }: SectionTableProps) => {
  const { sections, isLoading, loadSections } = useSectionController();

  useEffect(() => {
    loadSections();
  }, [loadSections]);

  const columns: TableColumnProps<SectionT>[] = [
    {
      key: "parallel",
      label: "Paralelo",
      className: tableFirstColumnClassname,
      render: (s) => <span>{s.parallel}</span>,
    },
    {
      key: "capacity",
      label: "Capacidad",
      className: tableColumnsClassname,
    },
    {
      key: "school_year",
      label: "Ano Escolar",
      className: tableColumnsClassname,
      render: (s) => <span>{s.school_year_name ?? s.school_year}</span>,
    },
    {
      key: "academic_grade",
      label: "Grado Academico",
      className: tableColumnsClassname,
      render: (s) => (
        <span>{s.academic_grade_name ?? s.academic_grade ?? "--"}</span>
      ),
    },
    {
      key: "is_active",
      label: "Estado",
      className: tableColumnsClassname,
      render: (s) =>
        s.is_active ? (
          <Badge variant="default">Activo</Badge>
        ) : (
          <Badge variant="outline">Inactivo</Badge>
        ),
    },
  ];

  return (
    <CustomTable<SectionT>
      data={sections}
      columns={columns}
      isLoading={isLoading && sections.length === 0}
      emptyMessage="No se encontraron secciones"
      actionsTitle="Acciones"
      className={tableClassname}
      loadingMessage="Cargando secciones..."
      rowActions={(s) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onEdit(s)}
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            title="Ver detalle"
          >
            <Eye className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(s)}
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
