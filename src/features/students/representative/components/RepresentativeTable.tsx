import { Pencil, Trash2 } from "lucide-react";
import { useEffect } from "react";

import { CustomTable } from "@shared/components/Table";
import { useAppDispatch, useAppSelector } from "@shared/redux/hooks";

import {
  selectRepresentatives,
  selectRepresentativesStatus,
} from "../redux/representative.selectors";
import {
  deleteRepresentative,
  fetchRepresentatives,
} from "../redux/representative.thunks";

import type { TableColumnProps } from "@shared/components/Table";
import type { Representative } from "../types/representative.types";

type RepresentativeTableProps = {
  onEdit: (representative: Representative) => void;
};

export function RepresentativeTable({ onEdit }: RepresentativeTableProps) {
  const dispatch = useAppDispatch();
  const representatives = useAppSelector(selectRepresentatives);
  const status = useAppSelector(selectRepresentativesStatus);

  const tableData = Array.isArray(representatives) ? representatives : [];

  useEffect(() => {
    dispatch(fetchRepresentatives());
  }, [dispatch]);

  const columns: TableColumnProps<Representative>[] = [
    {
      key: "dni",
      label: "Cedula",
    },
    {
      key: "full_name",
      label: "Nombres",
      render: (r) => (
        <span className="font-semibold text-slate-800">{r.full_name}</span>
      ),
    },
    {
      key: "phone",
      label: "Telefono",
    },
    {
      key: "email",
      label: "Email",
      render: (r) => r.email ?? "-",
    },
    {
      key: "address",
      label: "Direccion",
      render: (r) => r.address ?? "-",
    },
  ];

  return (
    <CustomTable<Representative>
      data={tableData}
      columns={columns}
      isLoading={status === "loading" && tableData.length === 0}
      emptyMessage="No se encontraron representantes"
      rowActions={(r) => (
        <>
          <button
            type="button"
            onClick={() => onEdit(r)}
            className="btn-action primary"
            title="Editar"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => dispatch(deleteRepresentative({ id: r.id }))}
            className="btn-action danger"
            title="Eliminar"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </>
      )}
    />
  );
}
