import { Eye, Pencil } from "lucide-react";
import { useEffect } from "react";

import {
  tableClassname,
  tableColumnsClassname,
  tableFirstColumnClassname,
} from "@app/styles/styles";
import { Badge } from "@shared/components/Badge";
import { CustomTable } from "@shared/components/Table";

import { useAcademicLevelController } from "../../presentation/hooks/useAcademicLevelController";

import type { TableColumnProps } from "@shared/components/Table";
import type { AcademicLevelT } from "../../domain/entities/academic-level.types";

type AcademicLevelTableProps = {
  onEdit: (academicLevel: AcademicLevelT) => void;
};

export const AcademicLevelTable = ({ onEdit }: AcademicLevelTableProps) => {
  const { academicLevels, isLoading, loadAcademicLevels } =
    useAcademicLevelController();

  useEffect(() => {
    loadAcademicLevels();
  }, [loadAcademicLevels]);

  const columns: TableColumnProps<AcademicLevelT>[] = [
    {
      key: "name",
      label: "Nivel Académico",
      className: tableFirstColumnClassname,
      render: (l) => <span>{l.name}</span>,
    },
    {
      key: "is_active",
      label: "Estado",
      className: tableColumnsClassname,
      render: (l) =>
        l.is_active ? (
          <Badge variant="default">Activo</Badge>
        ) : (
          <Badge variant="outline">Inactivo</Badge>
        ),
    },
  ];

  return (
    <CustomTable<AcademicLevelT>
      data={academicLevels}
      columns={columns}
      isLoading={isLoading && academicLevels.length === 0}
      emptyMessage="No se encontraron niveles academicos"
      actionsTitle="Acciones"
      className={tableClassname}
      loadingMessage="Cargando niveles academicos..."
      rowActions={(l) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onEdit(l)}
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            title="Ver detalle"
          >
            <Eye className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(l)}
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
