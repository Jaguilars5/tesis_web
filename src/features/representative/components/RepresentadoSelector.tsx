import { Loader2, Users } from "lucide-react";
import { useMemo } from "react";
import { selectClassname } from "@app/styles/styles";
import { CustomSelect } from "@shared/components/Form";
import type { SelectOptionT } from "@shared/components/Form/CustomSelect/CustomSelectProps";
import type { RepresentadoT } from "../representative.types";

interface RepresentadoSelectorProps {
  title: string;
  description: string;
  representados: RepresentadoT[];
  selectedStudentId: number | null;
  onSelect: (studentId: number | null) => void;
  loading: boolean;
  error: string | null;
}

export function RepresentadoSelector({
  title,
  description,
  representados,
  selectedStudentId,
  onSelect,
  loading,
  error,
}: RepresentadoSelectorProps) {
  const options = useMemo<SelectOptionT[]>(
    () =>
      representados.map((r) => ({
        value: String(r.studentId),
        label: r.sectionName ? `${r.name} — ${r.sectionName}` : r.name,
      })),
    [representados],
  );

  return (
    <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>

      <div className="w-full sm:w-72">
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="size-4 animate-spin text-primary" />
            Cargando representados...
          </div>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : representados.length === 0 ? (
          <p className="text-sm text-slate-500">
            No tienes representados asignados
          </p>
        ) : (
          <div className="flex items-center gap-2">
            <Users className="size-4 shrink-0 text-primary" />
            <div className="flex-1">
              <CustomSelect
                label=""
                name="representado"
                placeholder="Selecciona un representado"
                value={selectedStudentId ?? ""}
                onChange={(opt: SelectOptionT) =>
                  onSelect(opt.value ? Number(opt.value) : null)
                }
                options={options}
                className={selectClassname}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
