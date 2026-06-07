import { Pencil } from "lucide-react";
import { useEffect } from "react";

import {
  tableClassname,
  tableColumnsClassname,
  tableFirstColumnClassname,
} from "@app/styles/styles";
import { CustomTable } from "@shared/components/Table";

import { useQualitativeScalesController } from "../../presentation/hooks/useQualitativeScalesController";

import type { TableColumnProps } from "@shared/components/Table";
import type { QualitativeScaleT } from "../../domain/entities/qualitative-scales.types";

type QualitativeScalesTableProps = {
  onEdit: (qualitativeScale: QualitativeScaleT) => void;
};

export const QualitativeScalesTable = ({ onEdit }: QualitativeScalesTableProps) => {
  const { qualitativeScales, isLoading, loadQualitativeScales } = useQualitativeScalesController();

  useEffect(() => {
    loadQualitativeScales();
  }, [loadQualitativeScales]);

  const columns: TableColumnProps<QualitativeScaleT>[] = [
    {
      key: "code",
      label: "Código",
      className: tableFirstColumnClassname,
      render: (s) => <span>{s.code}</span>,
    },
    {
      key: "description",
      label: "Descripción",
      className: tableColumnsClassname,
      render: (s) => <span>{s.description}</span>,
    },
    {
      key: "numeric_equivalence",
      label: "Equivalencia Numérica",
      className: tableColumnsClassname,
      render: (s) => <span>{s.numeric_equivalence}</span>,
    },
  ];

  return (
    <CustomTable<QualitativeScaleT>
      data={qualitativeScales}
      columns={columns}
      isLoading={isLoading && qualitativeScales.length === 0}
      emptyMessage="No se encontraron escalas cualitativas"
      actionsTitle="Acciones"
      className={tableClassname}
      loadingMessage="Cargando escalas cualitativas..."
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
