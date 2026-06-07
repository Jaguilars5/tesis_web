import { Pencil } from "lucide-react";
import { useEffect } from "react";

import {
  tableClassname,
  tableColumnsClassname,
  tableFirstColumnClassname,
} from "@app/styles/styles";
import { Badge } from "@shared/components/Badge";
import { CustomTable } from "@shared/components/Table";

import { useActivityTypesController } from "../../presentation/hooks/useActivityTypesController";

import type { TableColumnProps } from "@shared/components/Table";
import type { ActivityTypeT } from "../../domain/entities/activity-types.types";

type ActivityTypesTableProps = {
  onEdit: (activityType: ActivityTypeT) => void;
};

export const ActivityTypesTable = ({ onEdit }: ActivityTypesTableProps) => {
  const { activityTypes, isLoading, loadActivityTypes } = useActivityTypesController();

  useEffect(() => {
    loadActivityTypes();
  }, [loadActivityTypes]);

  const columns: TableColumnProps<ActivityTypeT>[] = [
    {
      key: "code",
      label: "Código",
      className: tableFirstColumnClassname,
      render: (s) => <span>{s.code}</span>,
    },
    {
      key: "name",
      label: "Nombre",
      className: tableColumnsClassname,
      render: (s) => <span>{s.name}</span>,
    },
    {
      key: "description",
      label: "Descripción",
      className: tableColumnsClassname,
      render: (s) => <span>{s.description ?? "-"}</span>,
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
    <CustomTable<ActivityTypeT>
      data={activityTypes}
      columns={columns}
      isLoading={isLoading && activityTypes.length === 0}
      emptyMessage="No se encontraron tipos de actividad"
      actionsTitle="Acciones"
      className={tableClassname}
      loadingMessage="Cargando tipos de actividad..."
      rowActions={(s) => (
        <div className="flex items-center justify-end gap-1">
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
