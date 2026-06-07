import { Pencil } from "lucide-react";
import { useEffect } from "react";

import {
  tableClassname,
  tableColumnsClassname,
  tableFirstColumnClassname,
} from "@app/styles/styles";
import { CustomTable } from "@shared/components/Table";

import { useComponentIndicatorsController } from "../../presentation/hooks/useComponentIndicatorsController";

import type { TableColumnProps } from "@shared/components/Table";
import type { ComponentIndicatorT } from "../../domain/entities/component-indicators.types";

type ComponentIndicatorsTableProps = {
  onEdit: (componentIndicator: ComponentIndicatorT) => void;
};

export const ComponentIndicatorsTable = ({ onEdit }: ComponentIndicatorsTableProps) => {
  const { componentIndicators, isLoading, loadComponentIndicators } = useComponentIndicatorsController();

  useEffect(() => {
    loadComponentIndicators();
  }, [loadComponentIndicators]);

  const columns: TableColumnProps<ComponentIndicatorT>[] = [
    {
      key: "name",
      label: "Nombre",
      className: tableFirstColumnClassname,
      render: (s) => <span>{s.name}</span>,
    },
    {
      key: "block_component_name",
      label: "Componente de Bloque",
      className: tableColumnsClassname,
      render: (s) => <span>{s.block_component_name}</span>,
    },
    {
      key: "internal_weight",
      label: "Ponderación",
      className: tableColumnsClassname,
      render: (s) => <span>{s.internal_weight}%</span>,
    },
  ];

  return (
    <CustomTable<ComponentIndicatorT>
      data={componentIndicators}
      columns={columns}
      isLoading={isLoading && componentIndicators.length === 0}
      emptyMessage="No se encontraron indicadores de componente"
      actionsTitle="Acciones"
      className={tableClassname}
      loadingMessage="Cargando indicadores de componente..."
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
