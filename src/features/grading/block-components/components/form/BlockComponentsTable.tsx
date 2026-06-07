import { Pencil } from "lucide-react";
import { useEffect } from "react";

import { tableClassname, tableColumnsClassname, tableFirstColumnClassname } from "@app/styles/styles";
import { CustomTable } from "@shared/components/Table";

import { useBlockComponentsController } from "../../presentation/hooks/useBlockComponentsController";

import type { TableColumnProps } from "@shared/components/Table";
import type { BlockComponentT } from "../../domain/entities/block-components.types";

type BlockComponentsTableProps = {
  onEdit: (blockComponent: BlockComponentT) => void;
};

export const BlockComponentsTable = ({ onEdit }: BlockComponentsTableProps) => {
  const { blockComponents, isLoading, loadBlockComponents } = useBlockComponentsController();

  useEffect(() => {
    loadBlockComponents();
  }, [loadBlockComponents]);

  const columns: TableColumnProps<BlockComponentT>[] = [
    {
      key: "name",
      label: "Nombre",
      className: tableFirstColumnClassname,
      render: (s) => <span>{s.name}</span>,
    },
    {
      key: "evaluation_block_name",
      label: "Bloque de Evaluación",
      className: tableColumnsClassname,
      render: (s) => <span>{s.evaluation_block_name}</span>,
    },
    {
      key: "internal_weight",
      label: "Ponderación",
      className: tableColumnsClassname,
      render: (s) => <span>{s.internal_weight}%</span>,
    },
  ];

  return (
    <CustomTable<BlockComponentT>
      data={blockComponents}
      columns={columns}
      isLoading={isLoading && blockComponents.length === 0}
      emptyMessage="No se encontraron componentes de bloque"
      actionsTitle="Acciones"
      className={tableClassname}
      loadingMessage="Cargando componentes de bloque..."
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
