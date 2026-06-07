import { Pencil } from "lucide-react";
import { useEffect } from "react";

import {
  tableClassname,
  tableColumnsClassname,
  tableFirstColumnClassname,
} from "@app/styles/styles";
import { Badge } from "@shared/components/Badge";
import { CustomTable } from "@shared/components/Table";

import { useEvaluationTypesController } from "../../presentation/hooks/useEvaluationTypesController";

import type { TableColumnProps } from "@shared/components/Table";
import type { EvaluationTypeT } from "../../domain/entities/evaluation-types.types";

type EvaluationTypesTableProps = {
  onEdit: (evaluationType: EvaluationTypeT) => void;
};

export const EvaluationTypesTable = ({ onEdit }: EvaluationTypesTableProps) => {
  const { evaluationTypes, isLoading, loadEvaluationTypes } = useEvaluationTypesController();

  useEffect(() => {
    loadEvaluationTypes();
  }, [loadEvaluationTypes]);

  const columns: TableColumnProps<EvaluationTypeT>[] = [
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
    <CustomTable<EvaluationTypeT>
      data={evaluationTypes}
      columns={columns}
      isLoading={isLoading && evaluationTypes.length === 0}
      emptyMessage="No se encontraron tipos de evaluación"
      actionsTitle="Acciones"
      className={tableClassname}
      loadingMessage="Cargando tipos de evaluación..."
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
