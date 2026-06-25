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
  AcademicGradeListParamsT,
  AcademicGradeOrderingT,
  AcademicGradeT,
} from "../academic-grade.types";

const OrderingOptions: { label: string; value: AcademicGradeOrderingT }[] = [
  { label: "Nombre (A-Z)", value: "name" },
  { label: "Nombre (Z-A)", value: "-name" },
];

interface AcademicGradeTableProps {
  academicGrades: AcademicGradeT[];
  isLoading: boolean;
  loadAcademicGrades: (params?: AcademicGradeListParamsT) => void;
  academicSubLevelOptions: { label: string; value: string }[];
  onEdit: (grade: AcademicGradeT) => void;
  onView: (grade: AcademicGradeT) => void;
  onDelete: (grade: AcademicGradeT) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export const AcademicGradeTable: React.FC<AcademicGradeTableProps> = ({
  academicGrades,
  isLoading,
  loadAcademicGrades,
  academicSubLevelOptions,
  onEdit,
  onView,
  onDelete,
  canEdit = true,
  canDelete = true,
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [ordering, setOrdering] = useState<AcademicGradeOrderingT>("name");
  const [academicSubLevel, setAcademicSubLevel] = useState<number | undefined>(
    undefined,
  );
  const [hasSearched, setHasSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const fetchData = useCallback(
    (params?: AcademicGradeListParamsT) => {
      loadAcademicGrades(params);
    },
    [loadAcademicGrades],
  );

  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
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
    (value: AcademicGradeOrderingT) => {
      setOrdering(value);
      setPage(1);
      fetchData({ page: 1, ordering: value });
    },
    [fetchData],
  );

  const handleAcademicSubLevelChange = useCallback(
    (value: number) => {
      setAcademicSubLevel(value);
      setPage(1);
      fetchData({ page: 1, filters: { academic_sublevel: value } });
    },
    [fetchData],
  );

  const hasNextPage = academicGrades.length >= pageSize;
  const columns: TableColumnProps<AcademicGradeT>[] = [
    { key: "name", label: "Grado", className: tableFirstColumnClassname },
    {
      key: "academic_sublevel_name",
      label: "Subnivel",
      className: tableColumnsClassname,
      render: (grade) => grade.academic_sublevel_name || "—",
    },
    {
      key: "is_active",
      label: "Estado",
      className: tableColumnsClassname,
      render: (grade) =>
        grade.is_active ? (
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
          placeholder="Filtrar grados..."
        />
        <CustomSelect
          name="ordering"
          label=""
          placeholder="Ordenar por"
          value={ordering}
          options={OrderingOptions}
          onChange={(option) =>
            handleOrdering(option.value as AcademicGradeOrderingT)
          }
          className={filterSelectClassname}
        />
        <CustomSelect
          name="academic_sublevel"
          label=""
          placeholder="Subnivel"
          value={academicSubLevel ?? ""}
          options={academicSubLevelOptions}
          onChange={(option) =>
            handleAcademicSubLevelChange(option.value as number)
          }
          className={filterSelectClassname}
        />
      </div>
      <CustomTable<AcademicGradeT>
        data={academicGrades}
        columns={columns}
        isLoading={isLoading && academicGrades.length === 0}
        emptyMessage={
          hasSearched
            ? "No se encontraron grados con los filtros"
            : "No se encontraron grados académicos"
        }
        actionsTitle="Acciones"
        className={tableClassname}
        loadingMessage="Cargando..."
        rowActions={(grade) => (
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => onView(grade)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-100"
              title="Ver"
            >
              <Eye className="size-4" />
            </button>
            {canEdit && (
              <button
                type="button"
                onClick={() => onEdit(grade)}
                className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-100"
                title="Editar"
              >
                <Pencil className="size-4" />
              </button>
            )}
            {canDelete && (
              <button
                type="button"
                onClick={() => onDelete(grade)}
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
        totalItems={academicGrades.length}
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
