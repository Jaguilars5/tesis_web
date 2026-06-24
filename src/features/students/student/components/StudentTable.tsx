import { Eye, Pencil, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  filterSelectClassname,
  tableClassname,
  tableColumnsClassname,
  tableFirstColumnClassname,
} from "@app/styles/styles";
import { Badge } from "@shared/components/Badge";
import { CustomSelect } from "@shared/components/Form/CustomSelect/CustomSelect";
import { SearchInput } from "@shared/components/Form";
import { Pagination } from "@shared/components/Pagination";
import { CustomTable } from "@shared/components/Table";
import { STATUS_OPTIONS } from "@shared/hooks/useStatusOptions";
import type { SelectOptionT } from "@shared/components/Form/CustomSelect/CustomSelectProps";
import type { TableColumnProps } from "@shared/components/Table";
import type {
  StudentListParamsT,
  StudentOrderingT,
  StudentT,
} from "../student.types";
const O: { label: string; value: StudentOrderingT }[] = [
  { label: "Apellidos (A-Z)", value: "user__person__last_names" },
  { label: "Apellidos (Z-A)", value: "-user__person__last_names" },
  { label: "Estado", value: "is_active" },
  { label: "Estado (desc)", value: "-is_active" },
];
type Props = {
  students: StudentT[];
  isLoading: boolean;
  loadStudents: (p?: StudentListParamsT) => void;
  onEdit: (s: StudentT) => void;
  onView: (s: StudentT) => void;
  onDelete: (s: StudentT) => void;
};
export const StudentTable = ({
  students,
  isLoading,
  loadStudents,
  onEdit,
  onView,
  onDelete,
}: Props) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [ordering, setOrdering] = useState<StudentOrderingT>(
    "user__person__last_names",
  );
  const [hasSearched, setHasSearched] = useState(false);
  const [isActiveFilter, setIsActiveFilter] = useState<string>("");
  const dr = useRef<ReturnType<typeof setTimeout>>(undefined);
  const fetchData = useCallback(
    (o?: {
      page?: number;
      pageSize?: number;
      search?: string;
      ordering?: StudentOrderingT;
      is_active?: boolean;
    }) => {
      loadStudents({
        page: o?.page ?? page,
        pageSize: o?.pageSize ?? pageSize,
        search: o?.search !== undefined ? o.search : search || undefined,
        ordering: o?.ordering ?? ordering,
        is_active:
          o?.is_active !== undefined
            ? o.is_active
            : isActiveFilter
              ? isActiveFilter === "active"
              : undefined,
      });
    },
    [loadStudents, page, pageSize, search, ordering, isActiveFilter],
  );
  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const hSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setSearch(v);
      setPage(1);
      setHasSearched(true);
      if (dr.current) clearTimeout(dr.current);
      dr.current = setTimeout(() => {
        fetchData({ page: 1, search: v || undefined });
      }, 400);
    },
    [fetchData],
  );
  const hOrder = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const n = e.target.value as StudentOrderingT;
      setOrdering(n);
      setPage(1);
      fetchData({ page: 1, ordering: n });
    },
    [fetchData],
  );
  const hIsActive = useCallback((o: SelectOptionT) => {
    setIsActiveFilter(o.value as string);
    setPage(1);
  }, []);
  useEffect(() => {
    fetchData({ page: 1 });
  }, [isActiveFilter]); // eslint-disable-line react-hooks/exhaustive-deps
  const hnp = students.length >= pageSize;
  const cols: TableColumnProps<StudentT>[] = [
    {
      key: "full_name",
      label: "Nombre Completo",
      className: tableFirstColumnClassname,
    },
    {
      key: "primary_representative",
      label: "Representante",
      className: tableColumnsClassname,
      render: (s) =>
        s.primary_representative ? (
          <span className="text-sm text-slate-700">
            {s.primary_representative.user_names}
            <span className="ml-1 text-xs text-slate-400">
              ({s.primary_representative.kinship_name})
            </span>
          </span>
        ) : (
          <span className="text-sm text-slate-400">—</span>
        ),
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
    <div className="overflow-visible rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-slate-50/50 px-4 py-3">
        <SearchInput
          name="search"
          type="text"
          onChange={hSearch}
          value={search}
          className="relative min-w-50 flex-1"
          placeholder="Filtrar estudiantes..."
        />
        <CustomSelect
          name="filter-is_active"
          label=""
          placeholder="Todos"
          value={isActiveFilter}
          options={STATUS_OPTIONS}
          onChange={hIsActive}
          className={filterSelectClassname}
        />
        <select
          value={ordering}
          onChange={hOrder}
          className="block w-auto rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {O.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <CustomTable<StudentT>
        data={students}
        columns={cols}
        isLoading={isLoading && students.length === 0}
        emptyMessage={
          hasSearched
            ? "No se encontraron estudiantes con los filtros"
            : "No se encontraron estudiantes"
        }
        actionsTitle="Acciones"
        className={tableClassname}
        loadingMessage="Cargando..."
        rowActions={(s) => (
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => onView(s)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-100"
              title="Ver"
            >
              <Eye className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => onEdit(s)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-100"
              title="Editar"
            >
              <Pencil className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(s)}
              className="inline-flex items-center justify-center rounded-md p-2 text-red-400 hover:bg-red-50"
              title="Desactivar"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        )}
      />
      <Pagination
        page={page}
        pageSize={pageSize}
        totalItems={students.length}
        isLoading={isLoading}
        hasNextPage={hnp}
        onPageChange={(np) => {
          setPage(np);
          fetchData({ page: np });
        }}
        onPageSizeChange={(ns) => {
          setPageSize(ns);
          setPage(1);
          fetchData({ page: 1, pageSize: ns });
        }}
      />
    </div>
  );
};
