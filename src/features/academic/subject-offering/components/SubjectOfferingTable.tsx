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
  SubjectOfferingListParamsT,
  SubjectOfferingOrderingT,
  SubjectOfferingT,
} from "../subject-offering.types";

const OrderingOptions: { label: string; value: SubjectOfferingOrderingT }[] = [
  { label: "Mas recientes", value: "-id" },
  { label: "Mas antiguos", value: "id" },
];

interface SubjectOfferingTableProps {
  subjectOfferings: SubjectOfferingT[];
  totalCount: number;
  isLoading: boolean;
  loadSubjectOfferings: (params?: SubjectOfferingListParamsT) => void;
  schoolYearOptions: { label: string; value: string }[];
  sectionOptions: { label: string; value: string }[];
  subjectAcademicConfigOptions: { label: string; value: string }[];
  onEdit: (offering: SubjectOfferingT) => void;
  onView: (offering: SubjectOfferingT) => void;
  onDelete: (offering: SubjectOfferingT) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export const SubjectOfferingTable: React.FC<SubjectOfferingTableProps> = ({
  subjectOfferings,
  totalCount,
  isLoading,
  loadSubjectOfferings,
  schoolYearOptions,
  sectionOptions,
  subjectAcademicConfigOptions,
  onEdit,
  onView,
  onDelete,
  canEdit = true,
  canDelete = true,
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [ordering, setOrdering] = useState<SubjectOfferingOrderingT>("-id");
  const [schoolYear, setSchoolYear] = useState<number | undefined>(undefined);
  const [section, setSection] = useState<number | undefined>(undefined);
  const [subjectAcademicConfig, setSubjectAcademicConfig] = useState<
    number | undefined
  >(undefined);
  const [hasSearched, setHasSearched] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const buildFilters = useCallback(
    (overrides?: {
      school_year?: number;
      section?: number;
      subject_academic_config?: number;
    }): SubjectOfferingListParamsT["filters"] => {
      const nextSchoolYear =
        overrides?.school_year !== undefined
          ? overrides.school_year
          : schoolYear;
      const nextSection =
        overrides?.section !== undefined ? overrides.section : section;
      const nextSubjectAcademicConfig =
        overrides?.subject_academic_config !== undefined
          ? overrides.subject_academic_config
          : subjectAcademicConfig;
      const filters: NonNullable<SubjectOfferingListParamsT["filters"]> = {};
      if (nextSchoolYear) filters.school_year = nextSchoolYear;
      if (nextSection) filters.section = nextSection;
      if (nextSubjectAcademicConfig)
        filters.subject_academic_config = nextSubjectAcademicConfig;
      return Object.keys(filters).length > 0 ? filters : undefined;
    },
    [schoolYear, section, subjectAcademicConfig],
  );

  const fetchData = useCallback(
    (params?: SubjectOfferingListParamsT) => {
      loadSubjectOfferings(params);
    },
    [loadSubjectOfferings],
  );

  useEffect(() => {
    fetchData({ page: 1, pageSize: 10, ordering: "-id" });
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
    (value: SubjectOfferingOrderingT) => {
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
        filters: buildFilters({ school_year: value ?? 0 }),
      });
    },
    [fetchData, pageSize, search, ordering, buildFilters],
  );

  const handleSectionChange = useCallback(
    (value: number | undefined) => {
      setSection(value);
      setPage(1);
      fetchData({
        page: 1,
        pageSize,
        search: search || undefined,
        ordering,
        filters: buildFilters({ section: value ?? 0 }),
      });
    },
    [fetchData, pageSize, search, ordering, buildFilters],
  );

  const handleSubjectAcademicConfigChange = useCallback(
    (value: number | undefined) => {
      setSubjectAcademicConfig(value);
      setPage(1);
      fetchData({
        page: 1,
        pageSize,
        search: search || undefined,
        ordering,
        filters: buildFilters({ subject_academic_config: value ?? 0 }),
      });
    },
    [fetchData, pageSize, search, ordering, buildFilters],
  );

  const hasNextPage = totalCount > page * pageSize;

  const columns: TableColumnProps<SubjectOfferingT>[] = [
    {
      key: "school_year_name",
      label: "Ano Escolar",
      className: tableFirstColumnClassname,
    },
    {
      key: "section_name",
      label: "Seccion",
      className: tableColumnsClassname,
    },
    {
      key: "subject_academic_config_name",
      label: "Configuracion",
      className: tableColumnsClassname,
    },
    {
      key: "is_active",
      label: "Estado",
      className: tableColumnsClassname,
      render: (offering) =>
        offering.is_active ? (
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
          placeholder="Filtrar ofertas..."
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
          name="section"
          label=""
          placeholder="Sección"
          value={section ? String(section) : ""}
          options={sectionOptions}
          onChange={(option) =>
            handleSectionChange(option.value ? Number(option.value) : undefined)
          }
          className={filterSelectClassname}
        />

        <CustomSelect
          name="subject_academic_config"
          label=""
          placeholder="Configuración"
          value={subjectAcademicConfig ? String(subjectAcademicConfig) : ""}
          options={subjectAcademicConfigOptions}
          onChange={(option) =>
            handleSubjectAcademicConfigChange(
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
            handleOrdering(option.value as SubjectOfferingOrderingT)
          }
          className={filterSelectClassname}
        />
      </div>

      <CustomTable<SubjectOfferingT>
        data={subjectOfferings}
        columns={columns}
        isLoading={isLoading && subjectOfferings.length === 0}
        emptyMessage={
          hasSearched
            ? "No se encontraron ofertas con los filtros aplicados"
            : "No se encontraron ofertas de materia"
        }
        actionsTitle="Acciones"
        className={tableClassname}
        loadingMessage="Cargando ofertas..."
        rowActions={(offering) => (
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => onView(offering)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              title="Ver detalle"
            >
              <Eye className="size-4" />
            </button>
            {canEdit && (
              <button
                type="button"
                onClick={() => onEdit(offering)}
                className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                title="Editar"
              >
                <Pencil className="size-4" />
              </button>
            )}
            {canDelete && (
              <button
                type="button"
                onClick={() => onDelete(offering)}
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
