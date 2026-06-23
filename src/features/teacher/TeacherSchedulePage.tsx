import { Calendar, Clock, Loader2, MapPin } from "lucide-react";
import { useEffect, useReducer } from "react";

import { teacherService } from "./teacher.service";

import type { ScheduleEntryT } from "./teacher.types";

interface State {
  entries: ScheduleEntryT[];
  loading: boolean;
  error: string | null;
}

type Action =
  | { type: "loading" }
  | { type: "success"; entries: ScheduleEntryT[] }
  | { type: "error"; error: string };

function reducer(_state: State, action: Action): State {
  switch (action.type) {
    case "loading":
      return { entries: [], loading: true, error: null };
    case "success":
      return { entries: action.entries, loading: false, error: null };
    case "error":
      return { entries: [], loading: false, error: action.error };
  }
}

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const HOURS = Array.from({ length: 10 }, (_, i) => `${7 + i}:00`);

export default function TeacherSchedulePage() {
  const [state, dispatch] = useReducer(reducer, {
    entries: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    teacherService
      .getSchedule()
      .then((entries) => {
        if (!cancelled) dispatch({ type: "success", entries });
      })
      .catch((err) => {
        if (!cancelled)
          dispatch({
            type: "error",
            error: err instanceof Error ? err.message : "Error al cargar",
          });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const getEntry = (day: number, hour: string) =>
    state.entries.filter(
      (e) => e.dayOfWeek === day && e.startTime <= hour && e.endTime > hour,
    );

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Mi Horario</h1>
          <p className="mt-1 text-sm text-slate-500">
            Horario de clases semanal
          </p>
        </div>
        <span className="text-sm text-slate-400">
          {state.entries.length} clase(s) programada(s)
        </span>
      </div>

      {state.loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      )}

      {!state.loading && state.error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {state.error}
        </div>
      )}

      {!state.loading && !state.error && (
        <>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr className="bg-slate-50">
                  {["Hora", ...DAYS].map((d) => (
                    <th
                      key={d}
                      className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500"
                    >
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {HOURS.map((hour) => (
                  <tr key={hour} className="hover:bg-slate-50/50">
                    <td className="whitespace-nowrap px-3 py-2 text-xs font-medium text-slate-400">
                      {hour}
                    </td>
                    {DAYS.map((_, i) => {
                      const entries = getEntry(i + 1, hour);
                      return (
                        <td key={i} className="px-3 py-2">
                          {entries.map((e) => (
                            <div
                              key={e.id}
                              className="rounded-lg border border-primary/20 bg-primary/10 p-2 text-xs"
                            >
                              <p className="font-semibold text-primary">
                                {e.subjectOfferingName}
                              </p>
                              <p className="mt-0.5 text-slate-600">
                                {e.sectionName}
                              </p>
                              <p className="mt-0.5 text-slate-400">
                                {e.startTime} - {e.endTime}
                              </p>
                            </div>
                          ))}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {state.entries.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Detalle de Clases
              </h2>
              {state.entries.map((e) => (
                <div
                  key={e.id}
                  className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Calendar className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900">
                      {e.subjectOfferingName}
                    </p>
                    <p className="text-xs text-slate-500">{e.sectionName}</p>
                    <div className="mt-2 flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3.5" />
                        {e.startTime} - {e.endTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3.5" />
                        {e.dayName}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
