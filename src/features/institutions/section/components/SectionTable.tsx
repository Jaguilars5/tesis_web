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
  SectionListParamsT,
  SectionOrderingT,
  SectionT,
} from "../section.types";

const OrderingOptions: { label: string; value: SectionOrderingT }[] = [
  { label: "Paralelo (A-Z)", value: "parallel" },
  { label: "Paralelo (Z-A)", value: "-parallel" },
  { label: "Año (A-Z)", value: "school_year__start_date" },
  { label: "Año (Z-A)", value: "-school_year__start_date" },
  { label: "Grado (A-Z)", value: "academic_grade__name" },
  { label: "Grado (Z-A)", value: "-academic_grade__name" },
];

interface SectionTableProps {
  sections: SectionT[];
  isLoading: boolean;
  loadSections: (params?: SectionListParamsT) => void;
  schoolYearOptions: { label: string; value: string }[];
  academicGradeOptions: { label: string; value: string }[];
  onEdit: (section: SectionT) => void;
  onView: (section: SectionT) => void;
  onDelete: (section: SectionT) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export const SectionTable: React.FC<SectionTableProps> = ({
  sections,
  isLoading,
  loadSections,
  schoolYearOptions,
  academicGradeOptions,
  onEdit,
  onView,
  onDelete,
  canEdit = true,
  canDelete = true,
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [ordering, setOrdering] = useState<SectionOrderingT>("parallel");
  const [schoolYear, setSchoolYear] = useState<number | undefined>(undefined);
  const [academicGrade, setAcademicGrade] = useState<number | undefined>(
    undefined,
  );
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | undefined>(
    undefined,
  );
  const [hasSearched, setHasSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const buildFilters = useCallback(
    (overrides?: {
      school_year?: number;
      academic_grade?: number;
      is_active?: boolean;
    }): SectionListParamsT["filters"] => {
      const nextSchoolYear =
        overrides?.school_year !== undefined
          ? overrides.school_year
          : schoolYear;
      const nextAcademicGrade =
        overrides?.academic_grade !== undefined
          ? overrides.academic_grade
          : academicGrade;
      const nextActive =
        overrides?.is_active !== undefined
          ? overrides.is_active
          : isActiveFilter;
      const filters: NonNullable<SectionListParamsT["filters"]> = {};
      if (nextSchoolYear) filters.school_year = nextSchoolYear;
      if (nextAcademicGrade) filters.academic_grade = nextAcademicGrade;
      if (nextActive !== undefined) filters.is_active = nextActive;
      return Object.keys(filters).length > 0 ? filters : undefined;
    },
    [schoolYear, academicGrade, isActiveFilter],
  );

  const fetchData = useCallback(
    (params?: SectionListParamsT) => {
      loadSections(params);
    },
    [loadSections],
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
        fetchData({
          page: 1,
          search: value || undefined,
          ordering,
          filters: buildFilters(),
        });
      }, 400);
    },
    [fetchData, ordering, buildFilters],
  );

  const handleOrdering = useCallback(
    (value: SectionOrderingT) => {
      setOrdering(value);
      setPage(1);
      fetchData({
        page: 1,
        ordering: value,
        search: search || undefined,
        filters: buildFilters(),
      });
    },
    [fetchData, search, buildFilters],
  );

  const handleSchoolYearChange = useCallback(
    (value: number | undefined) => {
      setSchoolYear(value);
      setPage(1);
      fetchData({
        page: 1,
        ordering,
        search: search || undefined,
        filters: buildFilters({ school_year: value ?? 0 }),
      });
    },
    [fetchData, ordering, search, buildFilters],
  );

  const handleAcademicGradeChange = useCallback(
    (value: number | undefined) => {
      setAcademicGrade(value);
      setPage(1);
      fetchData({
        page: 1,
        ordering,
        search: search || undefined,
        filters: buildFilters({ academic_grade: value ?? 0 }),
      });
    },
    [fetchData, ordering, search, buildFilters],
  );

  const handleIsActiveChange = useCallback(
    (value: string) => {
      const parsed = value === "" ? undefined : value === "true";
      setIsActiveFilter(parsed);
      setPage(1);
      fetchData({
        ordering,
        search: search || undefined,
        filters: buildFilters({ is_active: parsed }),
      });
    },
    [fetchData, ordering, search, buildFilters],
  );

  const hasNextPage = sections.length >= pageSize;
  const columns: TableColumnProps<SectionT>[] = [
    { key: "parallel", label: "Paralelo", className: tableFirstColumnClassname },
    {
      key: "school_year_name",
      label: "Año Escolar",
      className: tableColumnsClassname,
    },
    {
      key: "academic_grade_name",
      label: "Grado",
      className: tableColumnsClassname,
    },
    {
      key: "is_active",
      label: "Estado",
      className: tableColumnsClassname,
      render: (section) =>
        section.is_active ? (
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
          placeholder="Filtrar secciones..."
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
          name="academic_grade"
          label=""
          placeholder="Grado"
          value={academicGrade ? String(academicGrade) : ""}
          options={academicGradeOptions}
          onChange={(option) =>
            handleAcademicGradeChange(
              option.value ? Number(option.value) : undefined,
            )
          }
          className={filterSelectClassname}
        />
        <CustomSelect
          name="ordering"
          label=""
          placeholder="Ordenar por"
          value={ordering}
          options={OrderingOptions}
          onChange={(option) =>
            handleOrdering(option.value as SectionOrderingT)
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
      <CustomTable<SectionT>
        data={sections}
        columns={columns}
        isLoading={isLoading && sections.length === 0}
        emptyMessage={
          hasSearched
            ? "No se encontraron secciones con los filtros"
            : "No se encontraron secciones"
        }
        actionsTitle="Acciones"
        className={tableClassname}
        loadingMessage="Cargando..."
        rowActions={(section) => (
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => onView(section)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-100"
              title="Ver"
            >
              <Eye className="size-4" />
            </button>
            {canEdit && (
              <button
                type="button"
                onClick={() => onEdit(section)}
                className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-100"
                title="Editar"
              >
                <Pencil className="size-4" />
              </button>
            )}
            {canDelete && (
              <button
                type="button"
                onClick={() => onDelete(section)}
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
        totalItems={sections.length}
        isLoading={isLoading}
        hasNextPage={hasNextPage}
        onPageChange={(np) => {
          setPage(np);
          fetchData({
            page: np,
            ordering,
            search: search || undefined,
            filters: buildFilters(),
          });
        }}
        onPageSizeChange={(ns) => {
          setPageSize(ns);
          setPage(1);
          fetchData({
            page: 1,
            pageSize: ns,
            ordering,
            search: search || undefined,
            filters: buildFilters(),
          });
        }}
      />
    </div>
  );
};
