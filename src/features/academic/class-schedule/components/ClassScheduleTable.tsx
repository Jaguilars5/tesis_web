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

import { DAY_OF_WEEK_OPTIONS } from "../class-schedule.constants";
import type {
  ClassScheduleListParamsT,
  ClassScheduleOrderingT,
  ClassScheduleT,
} from "../class-schedule.types";

import type { TableColumnProps } from "@shared/components/Table";

const dayOfWeekMap = Object.fromEntries(
  DAY_OF_WEEK_OPTIONS.map((opt) => [opt.value, opt.label]),
);

const OrderingOptions: { label: string; value: ClassScheduleOrderingT }[] = [
  { label: "Día (asc)", value: "day_of_week" },
  { label: "Día (desc)", value: "-day_of_week" },
  { label: "Hora inicio (asc)", value: "start_time" },
  { label: "Hora inicio (desc)", value: "-start_time" },
];

const dayFilterOptions = DAY_OF_WEEK_OPTIONS.map((opt) => ({
  label: opt.label,
  value: opt.value,
}));

interface ClassScheduleTableProps {
  classSchedules: ClassScheduleT[];
  totalCount: number;
  isLoading: boolean;
  loadClassSchedules: (params?: ClassScheduleListParamsT) => void;
  teacherSubjectSectionOptions: { label: string; value: string }[];
  onEdit: (schedule: ClassScheduleT) => void;
  onView: (schedule: ClassScheduleT) => void;
  onDelete: (schedule: ClassScheduleT) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export const ClassScheduleTable: React.FC<ClassScheduleTableProps> = ({
  classSchedules,
  totalCount,
  isLoading,
  loadClassSchedules,
  teacherSubjectSectionOptions,
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
    useState<ClassScheduleOrderingT>("day_of_week");
  const [teacherSubjectSection, setTeacherSubjectSection] = useState<
    number | undefined
  >(undefined);
  const [dayOfWeek, setDayOfWeek] = useState<number | undefined>(undefined);
  const [hasSearched, setHasSearched] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const buildFilters = useCallback(
    (overrides?: { teacher_subject_section?: number; day_of_week?: number }) => ({
      teacher_subject_section:
        overrides?.teacher_subject_section ?? teacherSubjectSection,
      day_of_week: overrides?.day_of_week ?? dayOfWeek,
    }),
    [teacherSubjectSection, dayOfWeek],
  );

  const fetchData = useCallback(
    (params?: ClassScheduleListParamsT) => {
      loadClassSchedules(params);
    },
    [loadClassSchedules],
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
    (value: ClassScheduleOrderingT) => {
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

  const handleTeacherSubjectSectionChange = useCallback(
    (value: number | undefined) => {
      setTeacherSubjectSection(value);
      setPage(1);
      fetchData({
        page: 1,
        pageSize,
        search: search || undefined,
        ordering,
        filters: buildFilters({ teacher_subject_section: value }),
      });
    },
    [fetchData, pageSize, search, ordering, buildFilters],
  );

  const handleDayOfWeekChange = useCallback(
    (value: number | undefined) => {
      setDayOfWeek(value);
      setPage(1);
      fetchData({
        page: 1,
        pageSize,
        search: search || undefined,
        ordering,
        filters: buildFilters({ day_of_week: value }),
      });
    },
    [fetchData, pageSize, search, ordering, buildFilters],
  );

  const hasNextPage = totalCount > page * pageSize;

  const columns: TableColumnProps<ClassScheduleT>[] = [
    {
      key: "subject_offering_name",
      label: "Asignación",
      className: tableFirstColumnClassname,
    },
    {
      key: "day_of_week",
      label: "Día",
      className: tableColumnsClassname,
      render: (s) => (
        <span>{dayOfWeekMap[String(s.day_of_week)] ?? s.day_of_week_name}</span>
      ),
    },
    {
      key: "start_time",
      label: "Inicio",
      className: tableColumnsClassname,
    },
    {
      key: "end_time",
      label: "Fin",
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
          placeholder="Filtrar horarios..."
        />

        <CustomSelect
          name="ordering"
          label=""
          placeholder="Ordenar por"
          value={ordering}
          options={OrderingOptions}
          onChange={(option) =>
            handleOrdering(option.value as ClassScheduleOrderingT)
          }
          className={filterSelectClassname}
        />

        <CustomSelect
          name="teacher_subject_section"
          label=""
          placeholder="Asignación"
          value={teacherSubjectSection ? String(teacherSubjectSection) : ""}
          options={teacherSubjectSectionOptions}
          onChange={(option) =>
            handleTeacherSubjectSectionChange(
              option.value ? Number(option.value) : undefined,
            )
          }
          className={filterSelectClassname}
        />

        <CustomSelect
          name="day_of_week"
          label=""
          placeholder="Día"
          value={dayOfWeek ? String(dayOfWeek) : ""}
          options={dayFilterOptions}
          onChange={(option) =>
            handleDayOfWeekChange(
              option.value ? Number(option.value) : undefined,
            )
          }
          className={filterSelectClassname}
        />
      </div>

      <CustomTable<ClassScheduleT>
        data={classSchedules}
        columns={columns}
        isLoading={isLoading && classSchedules.length === 0}
        emptyMessage={
          hasSearched
            ? "No se encontraron horarios con los filtros aplicados"
            : "No se encontraron horarios"
        }
        actionsTitle="Acciones"
        className={tableClassname}
        loadingMessage="Cargando horarios..."
        rowActions={(s) => (
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => onView(s)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              title="Ver detalle"
            >
              <Eye className="size-4" />
            </button>
            {canEdit && (
              <button
                type="button"
                onClick={() => onEdit(s)}
                className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                title="Editar"
              >
                <Pencil className="size-4" />
              </button>
            )}
            {canDelete && (
              <button
                type="button"
                onClick={() => onDelete(s)}
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
