import { Pencil, Trash2 } from "lucide-react";
import { useEffect } from "react";

import {
  tableClassname,
  tableColumnsClassname,
  tableFirstColumnClassname,
} from "@app/styles/styles";
import { Badge } from "@shared/components/Badge";
import { CustomTable } from "@shared/components/Table";

import { useEvaluationBlockController } from "../../presentation/hooks/useEvaluationBlockController";

import type { TableColumnProps } from "@shared/components/Table";
import type { EvaluationBlockT } from "../../domain/entities/evaluation-block.types";

type EvaluationBlockTableProps = {
  onEdit: (evaluationBlock: EvaluationBlockT) => void;
};

export const EvaluationBlockTable = ({ onEdit }: EvaluationBlockTableProps) => {
  const { evaluationBlocks, isLoading, loadEvaluationBlocks } = useEvaluationBlockController();

  useEffect(() => {
    loadEvaluationBlocks();
  }, [loadEvaluationBlocks]);

  const columns: TableColumnProps<EvaluationBlockT>[] = [
    {
      key: "name",
      label: "Nombre",
      className: tableFirstColumnClassname,
      render: (eb) => <span>{eb.name}</span>,
    },
    {
      key: "academic_period_name",
      label: "Periodo Academico",
      className: tableColumnsClassname,
    },
    {
      key: "weight_percentage",
      label: "Porcentaje",
      className: tableColumnsClassname,
      render: (eb) => <span>{eb.weight_percentage}%</span>,
    },
    {
      key: "is_active",
      label: "Estado",
      className: tableColumnsClassname,
      render: (eb) =>
        eb.is_active ? (
          <Badge variant="default">Activo</Badge>
        ) : (
          <Badge variant="outline">Inactivo</Badge>
        ),
    },
  ];

  return (
    <CustomTable<EvaluationBlockT>
      data={evaluationBlocks}
      columns={columns}
      isLoading={isLoading && evaluationBlocks.length === 0}
      emptyMessage="No se encontraron bloques de evaluacion"
      actionsTitle="Acciones"
      className={tableClassname}
      loadingMessage="Cargando bloques de evaluacion..."
      rowActions={(eb) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onEdit(eb)}
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            title="Editar"
          >
            <Pencil className="size-4" />
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
            title="Eliminar"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      )}
    />
  );
};
