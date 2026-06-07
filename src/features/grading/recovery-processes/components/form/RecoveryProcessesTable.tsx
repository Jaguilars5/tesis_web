import { Pencil, Trash2 } from "lucide-react";
import { useEffect } from "react";

import {
  tableClassname,
  tableColumnsClassname,
  tableFirstColumnClassname,
} from "@app/styles/styles";
import { Badge } from "@shared/components/Badge";
import { CustomTable } from "@shared/components/Table";

import { useRecoveryProcessesController } from "../../presentation/hooks/useRecoveryProcessesController";

import type { TableColumnProps } from "@shared/components/Table";
import type { RecoveryProcessT } from "../../domain/entities/recovery-processes.types";

type RecoveryProcessesTableProps = {
  onEdit: (recoveryProcess: RecoveryProcessT) => void;
  onDelete: (id: number) => void;
};

export const RecoveryProcessesTable = ({ onEdit, onDelete }: RecoveryProcessesTableProps) => {
  const { recoveryProcesses, isLoading, loadRecoveryProcesses } = useRecoveryProcessesController();

  useEffect(() => {
    loadRecoveryProcesses();
  }, [loadRecoveryProcesses]);

  const columns: TableColumnProps<RecoveryProcessT>[] = [
    {
      key: "period_grade_summary_name",
      label: "Resumen de Calificaciones",
      className: tableFirstColumnClassname,
      render: (s) => <span>{s.period_grade_summary_name}</span>,
    },
    {
      key: "managed_by_user_name",
      label: "Usuario Gestor",
      className: tableColumnsClassname,
      render: (s) => <span>{s.managed_by_user_name}</span>,
    },
    {
      key: "initial_grade",
      label: "Nota Inicial",
      className: tableColumnsClassname,
      render: (s) => <span>{s.initial_grade}</span>,
    },
    {
      key: "reinforcement_grade",
      label: "Refuerzo",
      className: tableColumnsClassname,
      render: (s) => <span>{s.reinforcement_grade ?? "-"}</span>,
    },
    {
      key: "final_calculated_grade",
      label: "Nota Final",
      className: tableColumnsClassname,
      render: (s) => <span>{s.final_calculated_grade ?? "-"}</span>,
    },
    {
      key: "family_notified",
      label: "Notificado",
      className: tableColumnsClassname,
      render: (s) =>
        s.family_notified ? (
          <Badge variant="default">Sí</Badge>
        ) : (
          <Badge variant="outline">No</Badge>
        ),
    },
    {
      key: "start_date",
      label: "Fecha de Inicio",
      className: tableColumnsClassname,
      render: (s) => <span>{s.start_date}</span>,
    },
  ];

  return (
    <CustomTable<RecoveryProcessT>
      data={recoveryProcesses}
      columns={columns}
      isLoading={isLoading && recoveryProcesses.length === 0}
      emptyMessage="No se encontraron procesos de recuperación"
      actionsTitle="Acciones"
      className={tableClassname}
      loadingMessage="Cargando procesos de recuperación..."
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
          <button
            type="button"
            onClick={() => onDelete(s.id)}
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
            title="Eliminar"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      )}
    />
  );
};
