import { Eye, Pencil, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  filterSelectClassname,
  tableClassname,
  tableColumnsClassname,
  tableFirstColumnClassname,
} from "@app/styles/styles";
import { CustomSelect, SearchInput } from "@shared/components/Form";
import { Pagination } from "@shared/components/Pagination";
import { CustomTable } from "@shared/components/Table";

import type { TableColumnProps } from "@shared/components/Table";
import type {
  AcademicPeriodListParamsT,
  AcademicPeriodOrderingT,
  AcademicPeriodT,
} from "../academic-period.types";

const OrderingOptions: { label: string; value: AcademicPeriodOrderingT }[] = [
  { label: "Nombre (A-Z)", value: "name" },
  { label: "Nombre (Z-A)", value: "-name" },
  { label: "Inicio (asc)", value: "start_date" },
  { label: "Inicio (desc)", value: "-start_date" },
  { label: "Fin (asc)", value: "end_date" },
  { label: "Fin (desc)", value: "-end_date" },
  { label: "Peso (asc)", value: "year_weight" },
  { label: "Peso (desc)", value: "-year_weight" },
];

interface AcademicPeriodTableProps {
  academicPeriods: AcademicPeriodT[];
  totalCount: number;
  isLoading: boolean;
  loadAcademicPeriods: (params?: AcademicPeriodListParamsT) => void;
  schoolYearOptions: { label: string; value: string }[];
  periodTypeOptions: { label: string; value: string }[];
  onEdit: (academicPeriod: AcademicPeriodT) => void;
  onView: (academicPeriod: AcademicPeriodT) => void;
  onDelete: (academicPeriod: AcademicPeriodT) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export const AcademicPeriodTable: React.FC<AcademicPeriodTableProps> = ({
  academicPeriods,
  totalCount,
  isLoading,
  loadAcademicPeriods,
  schoolYearOptions,
  periodTypeOptions,
  onEdit,
  onView,
  onDelete,
  canEdit = true,
  canDelete = true,
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [ordering, setOrdering] = useState<AcademicPeriodOrderingT>("name");
  const [schoolYear, setSchoolYear] = useState<number | undefined>(undefined);
  const [periodType, setPeriodType] = useState<number | undefined>(undefined);
  const [hasSearched, setHasSearched] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const buildFilters = useCallback(
    (overrides?: { school_year?: number; period_type?: number }) => {
      const next = {
        school_year: overrides?.school_year ?? schoolYear,
        period_type: overrides?.period_type ?? periodType,
      };
      return next;
    },
    [schoolYear, periodType],
  );

  const fetchData = useCallback(
    (params?: AcademicPeriodListParamsT) => {
      loadAcademicPeriods(params);
    },
    [loadAcademicPeriods],
  );

  useEffect(() => {
    fetchData({ page: 1, pageSize });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearch(value);
      setPage(1);
      setHasSearched(true);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        fetchData({
          page: 1,
          pageSize,
          search: value || undefined,
          ordering,
          filters: buildFilters(),
        });
      }, 400);
    },
    [fetchData, pageSize, ordering, buildFilters],
  );

  const handleOrdering = useCallback(
    (value: AcademicPeriodOrderingT) => {
      setOrdering(value);
      setPage(1);
      fetchData({
        page: 1,
        pageSize,
        search: search || undefined,
        ordering: value,
        filters: buildFilters(),
      });
    },
    [fetchData, pageSize, search, buildFilters],
  );

  const handleSchoolYearChange = useCallback(
    (value: number | undefined) => {
      setSchoolYear(value);
      setPage(1);
      fetchData({
        page: 1,
        pageSize,
        search: search || undefined,
        ordering,
        filters: buildFilters({ school_year: value }),
      });
    },
    [fetchData, pageSize, search, ordering, buildFilters],
  );

  const handlePeriodTypeChange = useCallback(
    (value: number | undefined) => {
      setPeriodType(value);
      setPage(1);
      fetchData({
        page: 1,
        pageSize,
        search: search || undefined,
        ordering,
        filters: buildFilters({ period_type: value }),
      });
    },
    [fetchData, pageSize, search, ordering, buildFilters],
  );

  const hasNextPage = totalCount > page * pageSize;

  const columns: TableColumnProps<AcademicPeriodT>[] = [
    {
      key: "name",
      label: "Periodo",
      className: tableFirstColumnClassname,
      render: (p) => <span>{p.name}</span>,
    },
    {
      key: "period_type_name",
      label: "Tipo",
      className: tableColumnsClassname,
      render: (p) => <span>{p.period_type_name}</span>,
    },
    {
      key: "school_year_name",
      label: "Año Escolar",
      className: tableColumnsClassname,
    },
    {
      key: "start_date",
      label: "Inicio",
      className: tableColumnsClassname,
    },
    {
      key: "end_date",
      label: "Fin",
      className: tableColumnsClassname,
    },
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
          placeholder="Filtrar periodos..."
        />

        <CustomSelect
          name="ordering"
          label=""
          placeholder="Ordenar por"
          value={ordering}
          options={OrderingOptions}
          onChange={(option) =>
            handleOrdering(option.value as AcademicPeriodOrderingT)
          }
          className={filterSelectClassname}
        />

        <CustomSelect
          name="school_year"
          label=""
          placeholder="Año escolar"
          value={schoolYear ? String(schoolYear) : ""}
          options={schoolYearOptions}
          onChange={(option) =>
            handleSchoolYearChange(
              option.value ? Number(option.value) : undefined,
            )
          }
          className={filterSelectClassname}
        />

        <CustomSelect
          name="period_type"
          label=""
          placeholder="Tipo de periodo"
          value={periodType ? String(periodType) : ""}
          options={periodTypeOptions}
          onChange={(option) =>
            handlePeriodTypeChange(
              option.value ? Number(option.value) : undefined,
            )
          }
          className={filterSelectClassname}
        />
      </div>

      <CustomTable<AcademicPeriodT>
        data={academicPeriods}
        columns={columns}
        isLoading={isLoading && academicPeriods.length === 0}
        emptyMessage={
          hasSearched
            ? "No se encontraron periodos con los filtros aplicados"
            : "No se encontraron periodos academicos"
        }
        actionsTitle="Acciones"
        className={tableClassname}
        loadingMessage="Cargando periodos academicos..."
        rowActions={(p) => (
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => onView(p)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              title="Ver detalle"
            >
              <Eye className="size-4" />
            </button>
            {canEdit && (
              <button
                type="button"
                onClick={() => onEdit(p)}
                className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                title="Editar"
              >
                <Pencil className="size-4" />
              </button>
            )}
            {canDelete && (
              <button
                type="button"
                onClick={() => onDelete(p)}
                className="inline-flex items-center justify-center rounded-md p-2 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
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
        totalItems={totalCount}
        isLoading={isLoading}
        hasNextPage={hasNextPage}
        onPageChange={(newPage) => {
          setPage(newPage);
          fetchData({
            page: newPage,
            pageSize,
            search: search || undefined,
            ordering,
            filters: buildFilters(),
          });
        }}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPage(1);
          fetchData({
            page: 1,
            pageSize: newSize,
            search: search || undefined,
            ordering,
            filters: buildFilters(),
          });
        }}
      />
    </div>
  );
};
