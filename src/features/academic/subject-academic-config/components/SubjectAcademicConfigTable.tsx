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
  SubjectAcademicConfigListParamsT,
  SubjectAcademicConfigOrderingT,
  SubjectAcademicConfigT,
} from "../subject-academic-config.types";

const OrderingOptions: {
  label: string;
  value: SubjectAcademicConfigOrderingT;
}[] = [
  { label: "Horas (asc)", value: "weekly_hours" },
  { label: "Horas (desc)", value: "-weekly_hours" },
];

interface SubjectAcademicConfigTableProps {
  subjectAcademicConfigs: SubjectAcademicConfigT[];
  totalCount: number;
  isLoading: boolean;
  loadSubjectAcademicConfigs: (
    params?: SubjectAcademicConfigListParamsT,
  ) => void;
  subjectOptions: { label: string; value: string }[];
  academicGradeOptions: { label: string; value: string }[];
  onEdit: (config: SubjectAcademicConfigT) => void;
  onView: (config: SubjectAcademicConfigT) => void;
  onDelete: (config: SubjectAcademicConfigT) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export const SubjectAcademicConfigTable: React.FC<
  SubjectAcademicConfigTableProps
> = ({
  subjectAcademicConfigs,
  totalCount,
  isLoading,
  loadSubjectAcademicConfigs,
  subjectOptions,
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
  const [ordering, setOrdering] =
    useState<SubjectAcademicConfigOrderingT>("weekly_hours");
  const [subject, setSubject] = useState<number | undefined>(undefined);
  const [academicGrade, setAcademicGrade] = useState<number | undefined>(
    undefined,
  );
  const [hasSearched, setHasSearched] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const buildFilters = useCallback(
    (overrides?: {
      subject?: number;
      academic_grade?: number;
    }): SubjectAcademicConfigListParamsT["filters"] => {
      const nextSubject =
        overrides?.subject !== undefined ? overrides.subject : subject;
      const nextAcademicGrade =
        overrides?.academic_grade !== undefined
          ? overrides.academic_grade
          : academicGrade;
      const filters: NonNullable<SubjectAcademicConfigListParamsT["filters"]> =
        {};
      if (nextSubject) filters.subject = nextSubject;
      if (nextAcademicGrade) filters.academic_grade = nextAcademicGrade;
      return Object.keys(filters).length > 0 ? filters : undefined;
    },
    [subject, academicGrade],
  );

  const fetchData = useCallback(
    (params?: SubjectAcademicConfigListParamsT) => {
      loadSubjectAcademicConfigs(params);
    },
    [loadSubjectAcademicConfigs],
  );

  useEffect(() => {
    fetchData({ page: 1, pageSize: 10, ordering: "weekly_hours" });
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
    (value: SubjectAcademicConfigOrderingT) => {
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

  const handleSubjectChange = useCallback(
    (value: number | undefined) => {
      setSubject(value);
      setPage(1);
      fetchData({
        page: 1,
        pageSize,
        search: search || undefined,
        ordering,
        filters: buildFilters({ subject: value ?? 0 }),
      });
    },
    [fetchData, pageSize, search, ordering, buildFilters],
  );

  const handleAcademicGradeChange = useCallback(
    (value: number | undefined) => {
      setAcademicGrade(value);
      setPage(1);
      fetchData({
        page: 1,
        pageSize,
        search: search || undefined,
        ordering,
        filters: buildFilters({ academic_grade: value ?? 0 }),
      });
    },
    [fetchData, pageSize, search, ordering, buildFilters],
  );

  const hasNextPage = totalCount > page * pageSize;

  const columns: TableColumnProps<SubjectAcademicConfigT>[] = [
    {
      key: "subject_name",
      label: "Materia",
      className: tableFirstColumnClassname,
    },
    {
      key: "academic_grade_name",
      label: "Grado",
      className: tableColumnsClassname,
    },
    {
      key: "weekly_hours",
      label: "Horas",
      className: tableColumnsClassname,
    },
    {
      key: "is_required",
      label: "Obligatorio",
      className: tableColumnsClassname,
      render: (config) =>
        config.is_required ? (
          <Badge variant="default">Si</Badge>
        ) : (
          <Badge variant="outline">No</Badge>
        ),
    },
    {
      key: "is_active",
      label: "Estado",
      className: tableColumnsClassname,
      render: (config) =>
        config.is_active ? (
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
          placeholder="Filtrar configuraciones..."
        />

        <CustomSelect
          name="subject"
          label=""
          placeholder="Materia"
          value={subject ? String(subject) : ""}
          options={subjectOptions}
          onChange={(option) =>
            handleSubjectChange(option.value ? Number(option.value) : undefined)
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
            handleOrdering(option.value as SubjectAcademicConfigOrderingT)
          }
          className={filterSelectClassname}
        />
      </div>

      <CustomTable<SubjectAcademicConfigT>
        data={subjectAcademicConfigs}
        columns={columns}
        isLoading={isLoading && subjectAcademicConfigs.length === 0}
        emptyMessage={
          hasSearched
            ? "No se encontraron configuraciones con los filtros aplicados"
            : "No se encontraron configuraciones"
        }
        actionsTitle="Acciones"
        className={tableClassname}
        loadingMessage="Cargando configuraciones..."
        rowActions={(config) => (
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => onView(config)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              title="Ver detalle"
            >
              <Eye className="size-4" />
            </button>
            {canEdit && (
              <button
                type="button"
                onClick={() => onEdit(config)}
                className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                title="Editar"
              >
                <Pencil className="size-4" />
              </button>
            )}
            {canDelete && (
              <button
                type="button"
                onClick={() => onDelete(config)}
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
