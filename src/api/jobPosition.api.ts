import axiosInstance from "./axiosInstance";
import { config } from "../config";
import type {
  JobPosition,
  JobPositionCreateRequest,
  JobPositionUpdateRequest,
  JobStatusUpdateRequest,
  JobListParams,
  PaginatedResponse,
} from "../types/jobPosition.type";

const JOBS_ENDPOINT = config.endpoints.jobs;

export const jobPositionApi = {
  list: async (
    params: JobListParams = {},
  ): Promise<PaginatedResponse<JobPosition>> => {
    const { data } = await axiosInstance.get<PaginatedResponse<JobPosition>>(
      JOBS_ENDPOINT,
      { params },
    );
    return data;
  },

  getById: async (id: number): Promise<JobPosition> => {
    const { data } = await axiosInstance.get<JobPosition>(
      `${JOBS_ENDPOINT}/${id}`,
    );
    return data;
  },

  create: async (job: JobPositionCreateRequest): Promise<JobPosition> => {
    const { data } = await axiosInstance.post<JobPosition>(JOBS_ENDPOINT, job);
    return data;
  },

  update: async (
    id: number,
    job: JobPositionUpdateRequest,
  ): Promise<JobPosition> => {
    const { data } = await axiosInstance.patch<JobPosition>(
      `${JOBS_ENDPOINT}/${id}`,
      job,
    );
    return data;
  },

  remove: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${JOBS_ENDPOINT}/${id}`);
  },

  changeStatus: async (
    id: number,
    body: JobStatusUpdateRequest,
  ): Promise<JobPosition> => {
    const { data } = await axiosInstance.post<JobPosition>(
      `${JOBS_ENDPOINT}/${id}/status`,
      body,
    );
    return data;
  },

  archive: async (id: number): Promise<JobPosition> => {
    const { data } = await axiosInstance.post<JobPosition>(
      `${JOBS_ENDPOINT}/${id}/archive`,
    );
    return data;
  },
};
