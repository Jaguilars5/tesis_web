import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { ResponseApi } from "@shared/types/api.response.types";
import { GRADEBOOK_ENDPOINTS } from "./gradebook.constants";
import type {
  GradebookServiceT,
  TakeByActivityResponseT,
  TakeByActivitySavePayloadT,
  TakeByActivitySaveResultT,
} from "./gradebook.types";

class GradebookService implements GradebookServiceT {
  async getRoster(params: {
    evaluativeActivityId: number;
    teacherSubjectSectionId: number;
  }): Promise<TakeByActivityResponseT> {
    try {
      const { data } = await apiClient.get<ResponseApi<TakeByActivityResponseT>>(
        GRADEBOOK_ENDPOINTS.TAKE_BY_ACTIVITY,
        {
          params: {
            evaluative_activity_id: params.evaluativeActivityId,
            teacher_subject_section_id: params.teacherSubjectSectionId,
          },
        },
      );
      if (!data?.data) {
        throw new Error("Respuesta inválida al cargar el listado de calificaciones.");
      }
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async saveGrades(
    payload: TakeByActivitySavePayloadT,
  ): Promise<TakeByActivitySaveResultT | unknown[]> {
    try {
      const { data } = await apiClient.post<
        ResponseApi<TakeByActivitySaveResultT | unknown[]>
      >(
        GRADEBOOK_ENDPOINTS.TAKE_BY_ACTIVITY,
        payload,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const gradebookService = new GradebookService();
