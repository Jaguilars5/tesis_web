import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { ResponseApi } from "@shared/types/api.response.types";
import { REPRESENTADOS_ENDPOINT } from "./representative.constants";
import type {
  RepresentadoRawT,
  RepresentadoT,
  RepresentativeSelfServiceT,
} from "./representative.types";

function mapRepresentado(raw: RepresentadoRawT): RepresentadoT | null {
  const studentId = raw.student_id ?? raw.student ?? raw.id ?? null;
  if (studentId == null) return null;
  const name =
    raw.student_name ??
    raw.full_name ??
    raw.name ??
    [raw.names, raw.last_names].filter(Boolean).join(" ").trim() ??
    `Estudiante #${studentId}`;
  return {
    studentId,
    name: name || `Estudiante #${studentId}`,
    sectionName: raw.section_name ?? null,
  };
}

class RepresentativeSelfService implements RepresentativeSelfServiceT {
  async getRepresentados(): Promise<RepresentadoT[]> {
    try {
      const { data } = await apiClient.get<
        ResponseApi<{ results?: RepresentadoRawT[] } | RepresentadoRawT[]>
      >(REPRESENTADOS_ENDPOINT);
      const payload = data.data;
      const rows = Array.isArray(payload) ? payload : (payload?.results ?? []);
      const mapped: RepresentadoT[] = [];
      for (const row of rows) {
        const item = mapRepresentado(row);
        if (item) mapped.push(item);
      }
      // De-duplicar por studentId (un representado puede aparecer en varias matrículas)
      const seen = new Set<number>();
      return mapped.filter((r) => {
        if (seen.has(r.studentId)) return false;
        seen.add(r.studentId);
        return true;
      });
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const representativeSelfService = new RepresentativeSelfService();
