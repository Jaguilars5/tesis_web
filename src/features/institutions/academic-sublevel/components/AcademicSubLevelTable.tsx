import { Eye, Pencil, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  filterSelectClassname,
  tableClassname,
  tableColumnsClassname,
  tableFirstColumnClassname,
} from "@app/styles/styles";
import { Badge } from "@shared/components/Badge";
import { CustomSelect, SearchInput } from "@shared/components/Form";
import { Pagination } from "@shared/components/Pagination";
import { CustomTable } from "@shared/components/Table";
import type { TableColumnProps } from "@shared/components/Table";
import type {
  AcademicSubLevelListParamsT,
  AcademicSubLevelOrderingT,
  AcademicSubLevelT,
} from "../academic-sublevel.types";

const OrderingOptions: {
  label: string;
  value: AcademicSubLevelOrderingT;
}[] = [
  { label: "Nombre (A-Z)", value: "name" },
  { label: "Nombre (Z-A)", value: "-name" },
  { label: "Código (A-Z)", value: "code" },
  { label: "Código (Z-A)", value: "-code" },
];

interface AcademicSubLevelTableProps {
  academicSubLevels: AcademicSubLevelT[];
  isLoading: boolean;
  loadAcademicSubLevels: (p?: AcademicSubLevelListParamsT) => void;
  academicLevelOptions: { label: string; value: string }[];
  onEdit: (s: AcademicSubLevelT) => void;
  onView: (s: AcademicSubLevelT) => void;
  onDelete: (s: AcademicSubLevelT) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export const AcademicSubLevelTable: React.FC<AcademicSubLevelTableProps> = ({
  academicSubLevels,
  isLoading,
  loadAcademicSubLevels,
  academicLevelOptions,
  onEdit,
  onView,
  onDelete,
  canEdit = true,
  canDelete = true,
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [ordering, setOrdering] = useState<AcademicSubLevelOrderingT>("name");
  const [academicLevel, setAcademicLevel] = useState<number | undefined>(
    undefined,
  );
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | undefined>(
    undefined,
  );
  const [hasSearched, setHasSearched] = useState(false);
  const dr = useRef<ReturnType<typeof setTimeout>>(undefined);

  const buildParams = useCallback(
    (overrides?: Partial<AcademicSubLevelListParamsT>): AcademicSubLevelListParamsT => {
      const filters: AcademicSubLevelListParamsT["filters"] = {};
      const lvl = overrides?.filters?.academic_level ?? academicLevel;
      const active = overrides?.filters?.is_active ?? isActiveFilter;
      if (lvl) filters.academic_level = lvl;
      if (active !== undefined) filters.is_active = active;

      return {
        page: overrides?.page ?? page,
        pageSize: overrides?.pageSize ?? pageSize,
        search: (overrides?.search ?? search) || undefined,
        ordering: overrides?.ordering ?? ordering,
        ...(Object.keys(filters).length > 0 ? { filters } : {}),
      };
    },
    [search, page, pageSize, ordering, academicLevel, isActiveFilter],
  );

  const fetchData = useCallback(
    (overrides?: Partial<AcademicSubLevelListParamsT>) => {
      loadAcademicSubLevels(buildParams(overrides));
    },
    [loadAcademicSubLevels, buildParams],
  );

  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = useCallback(
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

  const handleOrdering = useCallback(
    (value: AcademicSubLevelOrderingT) => {
      setOrdering(value);
      setPage(1);
      fetchData({ ordering: value });
    },
    [fetchData],
  );

  const handleAcademicLevelChange = useCallback(
    (value: number) => {
      setAcademicLevel(value);
      setPage(1);
      fetchData({ filters: { academic_level: value } });
    },
    [fetchData],
  );

  const handleIsActiveChange = useCallback(
    (value: string) => {
      const parsed = value === "" ? undefined : value === "true";
      setIsActiveFilter(parsed);
      setPage(1);
      fetchData({ filters: { is_active: parsed } });
    },
    [fetchData],
  );

  const hasNextPage = academicSubLevels.length >= pageSize;

  const columns: TableColumnProps<AcademicSubLevelT>[] = [
    { key: "name", label: "Nombre", className: tableFirstColumnClassname },

    {
      key: "academic_level_name",
      label: "Nivel",
      className: tableColumnsClassname,
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
          onChange={handleSearch}
          value={search}
          className="relative min-w-50 flex-1"
          placeholder="Filtrar subniveles..."
        />
        <CustomSelect
          name="ordering"
          label=""
          placeholder="Ordenar por"
          value={ordering}
          options={OrderingOptions}
          onChange={(option) =>
            handleOrdering(option.value as AcademicSubLevelOrderingT)
          }
          className={filterSelectClassname}
        />
        <CustomSelect
          name="academic_level"
          label=""
          placeholder="Nivel"
          value={academicLevel ?? ""}
          options={academicLevelOptions}
          onChange={(option) =>
            handleAcademicLevelChange(option.value as number)
          }
          className={filterSelectClassname}
        />
        <CustomSelect
          name="is_active"
          label=""
          placeholder="Estado"
          value={isActiveFilter === undefined ? "" : String(isActiveFilter)}
          options={[
            { label: "Activos", value: "true" },
            { label: "Inactivos", value: "false" },
          ]}
          onChange={(option) => handleIsActiveChange(option.value as string)}
          className={filterSelectClassname}
        />
      </div>
      <CustomTable<AcademicSubLevelT>
        data={academicSubLevels}
        columns={columns}
        isLoading={isLoading && academicSubLevels.length === 0}
        emptyMessage={
          hasSearched
            ? "No se encontraron subniveles con los filtros"
            : "No se encontraron subniveles académicos"
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
            {canEdit && (
              <button
                type="button"
                onClick={() => onEdit(s)}
                className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-100"
                title="Editar"
              >
                <Pencil className="size-4" />
              </button>
            )}
            {canDelete && (
              <button
                type="button"
                onClick={() => onDelete(s)}
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
        totalItems={academicSubLevels.length}
        isLoading={isLoading}
        hasNextPage={hasNextPage}
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
