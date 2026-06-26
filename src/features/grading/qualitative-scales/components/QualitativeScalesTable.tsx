import { Eye, Pencil, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  filterSelectClassname,
  tableClassname,
  tableColumnsClassname,
  tableFirstColumnClassname,
} from "@app/styles/styles";
import { CustomSelect } from "@shared/components/Form/CustomSelect/CustomSelect";
import { SearchInput } from "@shared/components/Form";
import { Pagination } from "@shared/components/Pagination";
import { CustomTable } from "@shared/components/Table";
import type { SelectOptionT } from "@shared/components/Form/CustomSelect/CustomSelectProps";
import type { TableColumnProps } from "@shared/components/Table";
import type {
  QualitativeScaleListParamsT,
  QualitativeScaleOrderingT,
  QualitativeScaleT,
} from "../qualitative-scales.types";

const OrderingOptions: { label: string; value: QualitativeScaleOrderingT }[] = [
  { label: "Código (A-Z)", value: "code" },
  { label: "Código (Z-A)", value: "-code" },
  { label: "Nombre (A-Z)", value: "name" },
  { label: "Nombre (Z-A)", value: "-name" },
  { label: "Equivalencia (asc)", value: "numeric_equivalence" },
  { label: "Equivalencia (desc)", value: "-numeric_equivalence" },
];

interface Props {
  qualitativeScales: QualitativeScaleT[];
  isLoading: boolean;
  loadQualitativeScales: (params?: QualitativeScaleListParamsT) => void;
  onEdit: (entity: QualitativeScaleT) => void;
  onView: (entity: QualitativeScaleT) => void;
  onDelete: (entity: QualitativeScaleT) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export const QualitativeScalesTable: React.FC<Props> = ({
  qualitativeScales,
  isLoading,
  loadQualitativeScales,
  onEdit,
  onView,
  onDelete,
  canEdit = true,
  canDelete = true,
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [ordering, setOrdering] = useState<QualitativeScaleOrderingT>("code");
  const [hasSearched, setHasSearched] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const fetchData = useCallback(
    (options?: {
      page?: number;
      pageSize?: number;
      search?: string;
      ordering?: QualitativeScaleOrderingT;
    }) => {
      loadQualitativeScales({
        page: options?.page ?? page,
        pageSize: options?.pageSize ?? pageSize,
        search: options?.search !== undefined ? options.search : search || undefined,
        ordering: options?.ordering ?? ordering,
      });
    },
    [loadQualitativeScales, page, pageSize, search, ordering],
  );

  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setSearch(value);
      setPage(1);
      setHasSearched(true);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        fetchData({ page: 1, search: value || undefined });
      }, 400);
    },
    [fetchData],
  );

  const handleOrdering = useCallback(
    (option: SelectOptionT) => {
      const newOrdering = option.value as QualitativeScaleOrderingT;
      setOrdering(newOrdering);
      setPage(1);
      fetchData({ page: 1, ordering: newOrdering });
    },
    [fetchData],
  );

  const hasNextPage = qualitativeScales.length >= pageSize;

  const columns: TableColumnProps<QualitativeScaleT>[] = [
    { key: "code", label: "Código", className: tableFirstColumnClassname },
    { key: "description", label: "Descripción", className: tableColumnsClassname },
    { key: "numeric_equivalence", label: "Equivalencia", className: tableColumnsClassname },
  ];

  return (
    <div className="overflow-visible rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-slate-50/50 px-4 py-3">
        <SearchInput
          name="search"
          type="text"
          onChange={handleSearch}
          value={search}
          className="relative min-w-50 flex-1"
          placeholder="Filtrar escalas..."
        />
        <CustomSelect
          name="ordering"
          label=""
          placeholder="Ordenar por..."
          value={ordering}
          options={OrderingOptions.map((option) => ({
            label: option.label,
            value: option.value,
          }))}
          onChange={handleOrdering}
          className={filterSelectClassname}
        />
      </div>

      <CustomTable<QualitativeScaleT>
        data={qualitativeScales}
        columns={columns}
        isLoading={isLoading && qualitativeScales.length === 0}
        emptyMessage={
          hasSearched
            ? "No se encontraron escalas con los filtros"
            : "No se encontraron escalas cualitativas"
        }
        actionsTitle="Acciones"
        className={tableClassname}
        loadingMessage="Cargando..."
        rowActions={(entity) => (
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => onView(entity)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-100"
              title="Ver"
            >
              <Eye className="size-4" />
            </button>
            {canEdit && (
              <button
                type="button"
                onClick={() => onEdit(entity)}
                className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-100"
                title="Editar"
              >
                <Pencil className="size-4" />
              </button>
            )}
            {canDelete && (
              <button
                type="button"
                onClick={() => onDelete(entity)}
                className="inline-flex items-center justify-center rounded-md p-2 text-red-400 hover:bg-red-50"
                title="Desactivar"
              >
                <Trash2 className="size-4" />
              </button>
            )}
          </div>
        )}
      />

      <Pagination
        page={page}
        pageSize={pageSize}
        totalItems={qualitativeScales.length}
        isLoading={isLoading}
        hasNextPage={hasNextPage}
        onPageChange={(newPage) => {
          setPage(newPage);
          fetchData({ page: newPage });
        }}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(1);
          fetchData({ page: 1, pageSize: newSize });
        }}
        pageSizeOptions={[10, 25, 50]}
      />
    </div>
  );
};
