import { Loader2 } from "lucide-react";
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
const START_HOUR = 7;
const HOURS = Array.from({ length: 10 }, (_, i) => START_HOUR + i);

const toMinutes = (time: string): number => {
  const [h, m] = time.split(":");
  return Number(h) * 60 + Number(m ?? 0);
};

const formatTime = (time: string): string => {
  const [h, m] = time.split(":");
  return `${Number(h)}:${(m ?? "00").padStart(2, "0")}`;
};

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

  const getEntries = (day: number, hour: number) => {
    const slotStart = hour * 60;
    const slotEnd = slotStart + 60;
    return state.entries.filter((e) => {
      if (e.dayOfWeek !== day) return false;
      const start = toMinutes(e.startTime);
      return start >= slotStart && start < slotEnd;
    });
  };

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
                    <td className="whitespace-nowrap px-3 py-2 align-top text-xs font-medium text-slate-400">
                      {hour}:00
                    </td>
                    {DAYS.map((_, i) => {
                      const entries = getEntries(i + 1, hour);
                      return (
                        <td key={i} className="space-y-1 px-3 py-2 align-top">
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
                                {formatTime(e.startTime)} -{" "}
                                {formatTime(e.endTime)}
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
        </>
      )}
    </div>
  );
}
