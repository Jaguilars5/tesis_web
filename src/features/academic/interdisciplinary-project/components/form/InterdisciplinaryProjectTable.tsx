import { Eye, Pencil } from "lucide-react";
import { useEffect } from "react";

import {
  tableClassname,
  tableColumnsClassname,
  tableFirstColumnClassname,
} from "@app/styles/styles";
import { Badge } from "@shared/components/Badge";
import { CustomTable } from "@shared/components/Table";

import { useInterdisciplinaryProjectController } from "../../presentation/hooks/useInterdisciplinaryProjectController";

import type { TableColumnProps } from "@shared/components/Table";
import type { InterdisciplinaryProjectT } from "../../domain/entities/interdisciplinary-project.types";

type InterdisciplinaryProjectTableProps = {
  onEdit: (project: InterdisciplinaryProjectT) => void;
};

export const InterdisciplinaryProjectTable = ({
  onEdit,
}: InterdisciplinaryProjectTableProps) => {
  const { interdisciplinaryProjects, isLoading, loadInterdisciplinaryProjects } =
    useInterdisciplinaryProjectController();

  useEffect(() => {
    loadInterdisciplinaryProjects();
  }, [loadInterdisciplinaryProjects]);

  const columns: TableColumnProps<InterdisciplinaryProjectT>[] = [
    {
      key: "title",
      label: "Titulo",
      className: tableFirstColumnClassname,
    },
    {
      key: "start_date",
      label: "Fecha inicio",
      className: tableColumnsClassname,
    },
    {
      key: "delivery_date",
      label: "Fecha entrega",
      className: tableColumnsClassname,
    },
    {
      key: "is_active",
      label: "Estado",
      className: tableColumnsClassname,
      render: (p) =>
        p.is_active ? (
          <Badge variant="default">Activo</Badge>
        ) : (
          <Badge variant="outline">Inactivo</Badge>
        ),
    },
  ];

  return (
    <CustomTable<InterdisciplinaryProjectT>
      data={interdisciplinaryProjects}
      columns={columns}
      isLoading={isLoading && interdisciplinaryProjects.length === 0}
      emptyMessage="No se encontraron proyectos interdisciplinarios"
      actionsTitle="Acciones"
      className={tableClassname}
      loadingMessage="Cargando proyectos..."
      rowActions={(p) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onEdit(p)}
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            title="Ver detalle"
          >
            <Eye className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(p)}
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
