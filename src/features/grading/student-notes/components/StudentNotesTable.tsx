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
import type { SelectOptionT } from "@shared/components/Form/CustomSelect/CustomSelectProps";
import type { TableColumnProps } from "@shared/components/Table";
import type {
  StudentNoteListParamsT,
  StudentNoteOrderingT,
  StudentNoteT,
} from "../student-notes.types";

const OrderingOptions: { label: string; value: StudentNoteOrderingT }[] = [
  { label: "Matrícula (A-Z)", value: "enrollment_name" },
  { label: "Matrícula (Z-A)", value: "-enrollment_name" },
  { label: "Actividad (A-Z)", value: "evaluative_activity_title" },
  { label: "Actividad (Z-A)", value: "-evaluative_activity_title" },
  { label: "Puntaje (asc)", value: "numeric_score" },
  { label: "Puntaje (desc)", value: "-numeric_score" },
  { label: "Fecha (asc)", value: "created_at" },
  { label: "Fecha (desc)", value: "-created_at" },
];

interface Props {
  studentNotes: StudentNoteT[];
  isLoading: boolean;
  loadStudentNotes: (params?: StudentNoteListParamsT) => void;
  onEdit: (entity: StudentNoteT) => void;
  onView: (entity: StudentNoteT) => void;
  onDelete: (entity: StudentNoteT) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export const StudentNotesTable: React.FC<Props> = ({
  studentNotes,
  isLoading,
  loadStudentNotes,
  onEdit,
  onView,
  onDelete,
  canEdit = true,
  canDelete = true,
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [ordering, setOrdering] = useState<StudentNoteOrderingT>("created_at");
  const [hasSearched, setHasSearched] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const fetchData = useCallback(
    (options?: {
      page?: number;
      pageSize?: number;
      search?: string;
      ordering?: StudentNoteOrderingT;
    }) => {
      loadStudentNotes({
        page: options?.page ?? page,
        pageSize: options?.pageSize ?? pageSize,
        search: options?.search !== undefined ? options.search : search || undefined,
        ordering: options?.ordering ?? ordering,
      });
    },
    [loadStudentNotes, page, pageSize, search, ordering],
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
      const newOrdering = option.value as StudentNoteOrderingT;
      setOrdering(newOrdering);
      setPage(1);
      fetchData({ page: 1, ordering: newOrdering });
    },
    [fetchData],
  );

  const hasNextPage = studentNotes.length >= pageSize;

  const columns: TableColumnProps<StudentNoteT>[] = [
    { key: "enrollment_name", label: "Matrícula", className: tableFirstColumnClassname },
    { key: "evaluative_activity_title", label: "Actividad", className: tableColumnsClassname },
    { key: "numeric_score", label: "Puntaje", className: tableColumnsClassname },
    { key: "grading_mode", label: "Tipo", className: tableColumnsClassname },
    {
      key: "sync_status",
      label: "Sinc.",
      className: tableColumnsClassname,
      render: (entity) => {
        const variant =
          entity.sync_status === "SINCRONIZADO"
            ? "default"
            : entity.sync_status === "ERROR"
              ? "outline"
              : "secondary";
        return <Badge variant={variant}>{entity.sync_status}</Badge>;
      },
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
          placeholder="Filtrar notas..."
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

      <CustomTable<StudentNoteT>
        data={studentNotes}
        columns={columns}
        isLoading={isLoading && studentNotes.length === 0}
        emptyMessage={
          hasSearched
            ? "No se encontraron notas con los filtros"
            : "No se encontraron notas de estudiantes"
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
        totalItems={studentNotes.length}
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
