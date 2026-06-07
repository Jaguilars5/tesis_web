import { Pencil } from "lucide-react";
import { useEffect } from "react";

import {
  tableClassname,
  tableColumnsClassname,
  tableFirstColumnClassname,
} from "@app/styles/styles";
import { Badge } from "@shared/components/Badge";
import { CustomTable } from "@shared/components/Table";

import { usePeriodTypeController } from "../../presentation/hooks/usePeriodTypeController";

import type { TableColumnProps } from "@shared/components/Table";
import type { PeriodTypeT } from "../../domain/entities/period-types.types";

type PeriodTypeTableProps = {
  onEdit: (periodType: PeriodTypeT) => void;
};

export const PeriodTypeTable = ({ onEdit }: PeriodTypeTableProps) => {
  const { periodTypes, isLoading, loadPeriodTypes } = usePeriodTypeController();

  useEffect(() => {
    loadPeriodTypes();
  }, [loadPeriodTypes]);

  const columns: TableColumnProps<PeriodTypeT>[] = [
    {
      key: "name",
      label: "Nombre",
      className: tableFirstColumnClassname,
      render: (s) => <span>{s.name}</span>,
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
    <CustomTable<PeriodTypeT>
      data={periodTypes}
      columns={columns}
      isLoading={isLoading && periodTypes.length === 0}
      emptyMessage="No se encontraron tipos de periodo"
      actionsTitle="Acciones"
      className={tableClassname}
      loadingMessage="Cargando tipos de periodo..."
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
