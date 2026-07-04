import axiosInstance from "./axiosInstance";
import { config } from "../config";
import type { JobPosition } from "../types/jobPosition.type";

const JOBS_ENDPOINT = config.endpoints.jobs;

export const jobPositionApi = {
  getAll: async (): Promise<JobPosition[]> => {
    const { data } = await axiosInstance.get<JobPosition[]>(JOBS_ENDPOINT);
    return data;
  },

  getById: async (id: string): Promise<JobPosition> => {
    const { data } = await axiosInstance.get<JobPosition>(
      `${JOBS_ENDPOINT}/${id}`,
    );
    return data;
  },

  create: async (job: JobPosition): Promise<JobPosition> => {
    const { data } = await axiosInstance.post<JobPosition>(JOBS_ENDPOINT, job);
    return data;
  },

  update: async (id: string, job: JobPosition): Promise<JobPosition> => {
    const { data } = await axiosInstance.put<JobPosition>(
      `${JOBS_ENDPOINT}/${id}`,
      job,
    );
    return data;
  },

  patch: async (
    id: string,
    job: Partial<JobPosition>,
  ): Promise<JobPosition> => {
    const { data } = await axiosInstance.patch<JobPosition>(
      `${JOBS_ENDPOINT}/${id}`,
      job,
    );
    return data;
  },

  remove: async (id: string): Promise<void> => {
    await axiosInstance.delete(`${JOBS_ENDPOINT}/${id}`);
  },
};
