import { apiClient, getApiErrorMessage } from "@shared/services/api.client";
import type { PaginatedData, PaginatedResult, ResponseApi } from "@shared/types/api.response.types";
import type { SoftDeleteResponseT } from "@shared/types/soft-delete.types";
import { BLOCK_COMPONENTS_ENDPOINTS } from "./block-components.constants";
import type {
  BlockComponentCreateParamsT,
  BlockComponentDeleteParamsT,
  BlockComponentGetParamsT,
  BlockComponentListParamsT,
  BlockComponentServiceT,
  BlockComponentT,
  BlockComponentUpdateParamsT,
} from "./block-components.types";

class BlockComponentService implements BlockComponentServiceT {
  async list(params?: BlockComponentListParamsT): Promise<PaginatedResult<BlockComponentT>> {
    try {
      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 100;
      const searchQuery = params?.search
        ? `&search=${encodeURIComponent(params.search)}`
        : "";
      const orderingQuery = params?.ordering
        ? `&ordering=${encodeURIComponent(params.ordering)}`
        : "";
      const filtersQuery = params?.filters
        ? `&${Object.entries(params.filters)
            .filter(([, value]) => value !== undefined && value !== null)
            .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
            .join("&")}`
        : "";
      const { data } = await apiClient.get<
        ResponseApi<PaginatedData<BlockComponentT>>
      >(
        `${BLOCK_COMPONENTS_ENDPOINTS.LIST}?page=${page}&page_size=${pageSize}${searchQuery}${orderingQuery}${filtersQuery}`,
      );
      return { items: data.data.results, count: data.data.count };
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async listByTeacherSubjectSection(
    teacherSubjectSectionId: number,
    academicPeriodId: number,
  ): Promise<BlockComponentT[]> {
    try {
      const { data } = await apiClient.get<ResponseApi<BlockComponentT[]>>(
        `${BLOCK_COMPONENTS_ENDPOINTS.BY_TEACHER_SUBJECT_SECTION}?teacher_subject_section=${teacherSubjectSectionId}&academic_period=${academicPeriodId}`,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async get(params: BlockComponentGetParamsT): Promise<BlockComponentT> {
    try {
      const { data } = await apiClient.get<ResponseApi<BlockComponentT>>(
        BLOCK_COMPONENTS_ENDPOINTS.GET(params.id),
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async create(payload: BlockComponentCreateParamsT): Promise<BlockComponentT> {
    try {
      const { data } = await apiClient.post<ResponseApi<BlockComponentT>>(
        BLOCK_COMPONENTS_ENDPOINTS.CREATE,
        payload,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async update(params: BlockComponentUpdateParamsT): Promise<BlockComponentT> {
    try {
      const { data } = await apiClient.patch<ResponseApi<BlockComponentT>>(
        BLOCK_COMPONENTS_ENDPOINTS.UPDATE(params.id),
        params.data,
      );
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }

  async softDelete(
    params: BlockComponentDeleteParamsT,
  ): Promise<SoftDeleteResponseT> {
    try {
      const body = params.confirm ? { confirm: true } : undefined;
      const { data } = await apiClient.post<
        ResponseApi<SoftDeleteResponseT>
      >(BLOCK_COMPONENTS_ENDPOINTS.SOFT_DELETE(params.id), body);
      return data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error), { cause: error });
    }
  }
}

export const blockComponentService = new BlockComponentService();
