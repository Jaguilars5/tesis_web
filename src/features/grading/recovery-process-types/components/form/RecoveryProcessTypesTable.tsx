import { Pencil } from "lucide-react";
import { useEffect } from "react";

import {
  tableClassname,
  tableColumnsClassname,
  tableFirstColumnClassname,
} from "@app/styles/styles";
import { Badge } from "@shared/components/Badge";
import { CustomTable } from "@shared/components/Table";

import { useRecoveryProcessTypesController } from "../../presentation/hooks/useRecoveryProcessTypesController";

import type { TableColumnProps } from "@shared/components/Table";
import type { RecoveryProcessTypeT } from "../../domain/entities/recovery-process-types.types";

type RecoveryProcessTypesTableProps = {
  onEdit: (recoveryProcessType: RecoveryProcessTypeT) => void;
};

export const RecoveryProcessTypesTable = ({ onEdit }: RecoveryProcessTypesTableProps) => {
  const { recoveryProcessTypes, isLoading, loadRecoveryProcessTypes } = useRecoveryProcessTypesController();

  useEffect(() => {
    loadRecoveryProcessTypes();
  }, [loadRecoveryProcessTypes]);

  const columns: TableColumnProps<RecoveryProcessTypeT>[] = [
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
    <CustomTable<RecoveryProcessTypeT>
      data={recoveryProcessTypes}
      columns={columns}
      isLoading={isLoading && recoveryProcessTypes.length === 0}
      emptyMessage="No se encontraron tipos de proceso de recuperación"
      actionsTitle="Acciones"
      className={tableClassname}
      loadingMessage="Cargando tipos de proceso de recuperación..."
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
