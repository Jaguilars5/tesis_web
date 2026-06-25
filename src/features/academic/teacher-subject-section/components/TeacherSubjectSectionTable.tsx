import { ChevronDown, ChevronRight, Eye, Pencil, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  tableClassname,
  tableColumnsClassname,
  tableFirstColumnClassname,
} from "@app/styles/styles";
import { Badge } from "@shared/components/Badge";
import { SearchInput } from "@shared/components/Form";
import { CustomSelect } from "@shared/components/Form/CustomSelect/CustomSelect";
import { Pagination } from "@shared/components/Pagination";
import { CustomTable } from "@shared/components/Table";

import { useTeacherAssignmentFilters } from "../hooks/useTeacherAssignmentFilters";
import type {
  GradeFilterValue,
  SchoolYearFilterValue,
  SectionFilterValue,
  StatusFilterValue,
  SubjectFilterValue,
  TeacherFilterValue,
} from "../hooks/useTeacherAssignmentFilters";

import type { SelectOptionT } from "@shared/components/Form/CustomSelect/CustomSelectProps";
import type { TableColumnProps } from "@shared/components/Table";
import type {
  TeacherSubjectSectionFiltersT,
  TeacherSubjectSectionListParamsT,
  TeacherSubjectSectionOrderingT,
  TeacherSubjectSectionT,
} from "../teacher-subject-section.types";


const ORDERING_OPTIONS: {
  label: string;
  value: TeacherSubjectSectionOrderingT;
}[] = [
  { label: "Mas recientes", value: "-id" },
  { label: "Mas antiguos", value: "id" },
  { label: "Activos primero", value: "-is_active" },
  { label: "Inactivos primero", value: "is_active" },
];

type TeacherSubjectSectionTableProps = {
  teacherSubjectSections: TeacherSubjectSectionT[];
  isLoading: boolean;
  loadTeacherSubjectSections: (params?: TeacherSubjectSectionListParamsT) => void;
  onEdit: (assignment: TeacherSubjectSectionT) => void;
  onView: (assignment: TeacherSubjectSectionT) => void;
  onDelete: (assignment: TeacherSubjectSectionT) => void;
  canEdit?: boolean;
  canDelete?: boolean;
};

type GroupedRow = {
  id: number;
  userName: string;
  total: number;
  active: number;
  assignments: TeacherSubjectSectionT[];
};

const groupByUser = (rows: TeacherSubjectSectionT[]): GroupedRow[] => {
  const map = new Map<number, GroupedRow>();
  for (const row of rows) {
    const existing = map.get(row.user);
    if (existing) {
      existing.assignments.push(row);
      if (row.is_active) existing.active += 1;
    } else {
      map.set(row.user, {
        id: row.user,
        userName: row.user_name,
        total: 1,
        active: row.is_active ? 1 : 0,
        assignments: [row],
      });
    }
  }
  return Array.from(map.values()).sort((a, b) =>
    a.userName.localeCompare(b.userName),
  );
};

const selectClassNames = {
  container: "min-w-40",
  label: "mb-1 block text-xs font-medium text-slate-600",
  select:
    "block w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 shadow-sm transition focus:border-primary focus:ring-1 focus:ring-primary",
};

export const TeacherSubjectSectionTable = ({
  teacherSubjectSections,
  isLoading,
  loadTeacherSubjectSections,
  onEdit,
  onView,
  onDelete,
  canEdit = true,
  canDelete = true,
}: TeacherSubjectSectionTableProps) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [ordering, setOrdering] =
    useState<TeacherSubjectSectionOrderingT>("-id");
  const [hasSearched, setHasSearched] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<number, boolean>>(
    {},
  );

  const [gradeFilter, setGradeFilter] = useState<GradeFilterValue>(0);
  const [schoolYearFilter, setSchoolYearFilter] =
    useState<SchoolYearFilterValue>(0);
  const [sectionFilter, setSectionFilter] =
    useState<SectionFilterValue>(0);
  const [subjectFilter, setSubjectFilter] =
    useState<SubjectFilterValue>(0);
  const [teacherFilter, setTeacherFilter] =
    useState<TeacherFilterValue>(0);
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("");

  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const {
    gradeOptions,
    schoolYearOptions,
    sectionOptions,
    subjectOptions,
    teacherOptions,
    statusOptions,
  } = useTeacherAssignmentFilters();

  const groupedRows = useMemo(() => groupByUser(teacherSubjectSections), [teacherSubjectSections]);

  const buildFilters = useCallback(
    (overrides?: Partial<Record<string, GradeFilterValue | SchoolYearFilterValue | SectionFilterValue | SubjectFilterValue | TeacherFilterValue | StatusFilterValue>>): TeacherSubjectSectionFiltersT | undefined => {
      const f = {
        academic_grade: overrides?.academic_grade ?? gradeFilter,
        school_year: overrides?.school_year ?? schoolYearFilter,
        section: overrides?.section ?? sectionFilter,
        subject: overrides?.subject ?? subjectFilter,
        user: overrides?.user ?? teacherFilter,
        is_active: overrides?.is_active ?? statusFilter,
      };
      const cleaned: Record<string, number | boolean> = {};
      for (const [key, value] of Object.entries(f)) {
        if (value === 0 || value === "") continue;
        if ((key === "is_active") && typeof value === "string") {
          cleaned[key] = value === "active";
          continue;
        }
        cleaned[key] = Number(value);
      }
      return Object.keys(cleaned).length > 0 ? cleaned : undefined;
    },
    [gradeFilter, schoolYearFilter, sectionFilter, subjectFilter, teacherFilter, statusFilter],
  );

  const fetchData = useCallback(
    (overrides?: {
      page?: number;
      pageSize?: number;
      search?: string;
      ordering?: TeacherSubjectSectionOrderingT;
      filters?: TeacherSubjectSectionFiltersT;
    }) => {
      loadTeacherSubjectSections({
        page: overrides?.page ?? page,
        pageSize: overrides?.pageSize ?? pageSize,
        search:
          overrides?.search !== undefined
            ? overrides.search
            : search || undefined,
        ordering: overrides?.ordering ?? ordering,
        filters: overrides?.filters ?? buildFilters(),
      });
    },
    [loadTeacherSubjectSections, page, pageSize, search, ordering, buildFilters],
  );

  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearchChange = useCallback(
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

  const handleOrderingChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newOrdering = e.target.value as TeacherSubjectSectionOrderingT;
      setOrdering(newOrdering);
      setPage(1);
      fetchData({ page: 1, ordering: newOrdering });
    },
    [fetchData],
  );

  const makeFilterHandler = (key: string) =>
    (option: SelectOptionT) => {
      const val = Number(option.value);
      const rawVal = String(option.value);
      if (key === "academic_grade") setGradeFilter(val);
      else if (key === "school_year") setSchoolYearFilter(val);
      else if (key === "section") setSectionFilter(val);
      else if (key === "subject") setSubjectFilter(val);
      else if (key === "user") setTeacherFilter(val);
      else if (key === "is_active") setStatusFilter(rawVal as StatusFilterValue);
      setPage(1);
    };

  useEffect(() => {
    fetchData({ page: 1 });
  }, [gradeFilter, schoolYearFilter, sectionFilter, subjectFilter, teacherFilter, statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleGroup = useCallback((id: number) => {
    setExpandedGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const hasNextPage = teacherSubjectSections.length >= pageSize;

  const groupColumns: TableColumnProps<GroupedRow>[] = useMemo(
    () => [
      {
        key: "user",
        label: "Docente",
        className: {
          th: tableFirstColumnClassname.th,
          td: "py-3 pl-4 pr-3 text-sm",
        },
        render: (group) => (
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              onClick={() => toggleGroup(group.id)}
              aria-expanded={!!expandedGroups[group.id]}
              aria-label={
                expandedGroups[group.id]
                  ? "Contraer asignaciones"
                  : "Expandir asignaciones"
              }
            >
              {expandedGroups[group.id] ? (
                <ChevronDown className="size-4" />
              ) : (
                <ChevronRight className="size-4" />
              )}
            </button>
            <span className="font-semibold text-slate-900">
              {group.userName || `Docente #${group.id}`}
            </span>
          </div>
        ),
      },
      {
        key: "total",
        label: "Asignaturas",
        className: {
          th: tableColumnsClassname.th,
          td: "px-3 py-3 text-sm text-slate-600",
        },
        render: (group) => (
          <div className="flex items-center gap-2">
            <Badge variant="default">{group.total}</Badge>
            {group.active < group.total && (
              <span className="text-xs text-slate-500">
                ({group.active} activa{group.active === 1 ? "" : "s"})
              </span>
            )}
          </div>
        ),
      },
    ],
    [expandedGroups, toggleGroup],
  );

  const assignmentColumns: TableColumnProps<TeacherSubjectSectionT>[] = useMemo(
    () => [
      {
        key: "subject_offering_subject_name",
        label: "Materia",
        className: {
          th: "px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-500",
          td: "whitespace-nowrap px-3 py-2 text-sm font-medium text-slate-900",
        },
        render: (row) => (
          <span>{row.subject_offering_subject_name ?? "—"}</span>
        ),
      },
      {
        key: "subject_offering_config_name",
        label: "Curso",
        className: {
          th: "px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-500",
          td: "whitespace-nowrap px-3 py-2 text-sm text-slate-600",
        },
        render: (row) => <span>{row.subject_offering_config_name ?? "—"}</span>,
      },
      {
        key: "subject_offering_section_name",
        label: "Sección",
        className: {
          th: "px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-500",
          td: "whitespace-nowrap px-3 py-2 text-sm text-slate-600",
        },
        render: (row) => (
          <span>{row.subject_offering_section_name ?? "—"}</span>
        ),
      },
      {
        key: "subject_offering_school_year_name",
        label: "Año lectivo",
        className: {
          th: "px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-500",
          td: "whitespace-nowrap px-3 py-2 text-sm text-slate-600",
        },
        render: (row) => (
          <span>{row.subject_offering_school_year_name ?? "—"}</span>
        ),
      },
      {
        key: "is_active",
        label: "Estado",
        className: {
          th: "px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-500",
          td: "whitespace-nowrap px-3 py-2 text-sm",
        },
        render: (row) =>
          row.is_active ? (
            <Badge variant="default">Activo</Badge>
          ) : (
            <Badge variant="outline">Inactivo</Badge>
          ),
      },
    ],
    [],
  );

  return (
    <div className="overflow-visible rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50/50 px-4 py-4 lg:flex-row lg:flex-wrap lg:items-end">
        <div className="min-w-50 flex-1">
          <SearchInput
            name="search"
            type="text"
            onChange={handleSearchChange}
            value={search}
            className="relative w-full"
            placeholder="Filtrar por nombre, materia, sección..."
          />
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <CustomSelect
            name="filter-school-year"
            label="Año lectivo"
            placeholder="Todos"
            value={schoolYearFilter as string | number}
            options={schoolYearOptions}
            onChange={makeFilterHandler("school_year")}
            className={selectClassNames}
          />
          <CustomSelect
            name="filter-grade"
            label="Grado"
            placeholder="Todos"
            value={gradeFilter as string | number}
            options={gradeOptions}
            onChange={makeFilterHandler("academic_grade")}
            className={selectClassNames}
          />
          <CustomSelect
            name="filter-section"
            label="Sección"
            placeholder="Todas"
            value={sectionFilter as string | number}
            options={sectionOptions}
            onChange={makeFilterHandler("section")}
            className={selectClassNames}
          />
          <CustomSelect
            name="filter-subject"
            label="Materia"
            placeholder="Todas"
            value={subjectFilter as string | number}
            options={subjectOptions}
            onChange={makeFilterHandler("subject")}
            className={selectClassNames}
          />
          <CustomSelect
            name="filter-teacher"
            label="Docente"
            placeholder="Todos"
            value={teacherFilter as string | number}
            options={teacherOptions}
            onChange={makeFilterHandler("user")}
            className={selectClassNames}
          />
          <CustomSelect
            name="filter-status"
            label="Estado"
            placeholder="Todos"
            value={statusFilter as string}
            options={statusOptions}
            onChange={makeFilterHandler("is_active")}
            className={selectClassNames}
          />
          <div className="flex flex-col">
            <label
              htmlFor="ordering"
              className="mb-1 block text-xs font-medium text-slate-600"
            >
              Ordenar
            </label>
            <select
              id="ordering"
              value={ordering}
              onChange={handleOrderingChange}
              className="block rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary"
              aria-label="Ordenar por"
            >
              {ORDERING_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <CustomTable<GroupedRow>
        data={groupedRows}
        columns={groupColumns}
        isLoading={isLoading && groupedRows.length === 0}
        emptyMessage={
          hasSearched ||
          gradeFilter !== 0 ||
          schoolYearFilter !== 0 ||
          sectionFilter !== 0 ||
          subjectFilter !== 0 ||
          teacherFilter !== 0 ||
          statusFilter !== ""
            ? "No se encontraron docentes con los filtros aplicados"
            : "No se encontraron asignaciones docente-materia"
        }
        className={tableClassname}
        loadingMessage="Cargando asignaciones..."
      />

      {groupedRows.length === 0 || isLoading ? null : (
        <div className="divide-y divide-slate-100">
          {groupedRows
            .filter((group) => expandedGroups[group.id])
            .map((group) => (
              <div key={group.id} className="bg-slate-50/40 px-4 py-3">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Asignaciones de {group.userName}
                  </h3>
                  <span className="text-xs text-slate-400">
                    {group.assignments.length} resultado
                    {group.assignments.length === 1 ? "" : "s"}
                  </span>
                </div>
                <CustomTable<TeacherSubjectSectionT>
                  data={group.assignments}
                  columns={assignmentColumns}
                  isLoading={false}
                  emptyMessage="Sin asignaciones"
                  actionsTitle="Acciones"
                  className={{
                    ...tableClassname,
                    container: "border border-slate-200 bg-white",
                  }}
                  rowActions={(row) => (
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onView(row)}
                        className="inline-flex items-center justify-center rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                        title="Ver detalle"
                      >
                        <Eye className="size-4" />
                      </button>
                      {canEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(row)}
                          className="inline-flex items-center justify-center rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                          title="Editar"
                        >
                          <Pencil className="size-4" />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(row)}
                          className="inline-flex items-center justify-center rounded-md p-1.5 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          title="Desactivar"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      )}
                    </div>
                  )}
                />
              </div>
            ))}
        </div>
      )}

      <Pagination
        page={page}
        pageSize={pageSize}
        totalItems={teacherSubjectSections.length}
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
      />
    </div>
  );
};
