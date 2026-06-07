import { Pencil } from "lucide-react";
import { useEffect } from "react";

import {
  tableClassname,
  tableColumnsClassname,
  tableFirstColumnClassname,
} from "@app/styles/styles";
import { Badge } from "@shared/components/Badge";
import { CustomTable } from "@shared/components/Table";

import { usePromotionStatusesController } from "../../presentation/hooks/usePromotionStatusesController";

import type { TableColumnProps } from "@shared/components/Table";
import type { PromotionStatusT } from "../../domain/entities/promotion-statuses.types";

type PromotionStatusesTableProps = {
  onEdit: (promotionStatus: PromotionStatusT) => void;
};

export const PromotionStatusesTable = ({ onEdit }: PromotionStatusesTableProps) => {
  const { promotionStatuses, isLoading, loadPromotionStatuses } = usePromotionStatusesController();

  useEffect(() => {
    loadPromotionStatuses();
  }, [loadPromotionStatuses]);

  const columns: TableColumnProps<PromotionStatusT>[] = [
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
    <CustomTable<PromotionStatusT>
      data={promotionStatuses}
      columns={columns}
      isLoading={isLoading && promotionStatuses.length === 0}
      emptyMessage="No se encontraron estados de promoción"
      actionsTitle="Acciones"
      className={tableClassname}
      loadingMessage="Cargando estados de promoción..."
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
