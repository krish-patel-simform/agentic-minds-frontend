import axiosInstance from "./axiosInstance";
import { config } from "../config";
import type {
  Candidate,
  CandidateListParams,
  PaginatedResponse,
} from "../types/candidate.type";

const CANDIDATES_ENDPOINT = config.endpoints.candidates;

export const candidateApi = {
  list: async (
    params: CandidateListParams = {},
  ): Promise<PaginatedResponse<Candidate>> => {
    const { data } = await axiosInstance.get<PaginatedResponse<Candidate>>(
      CANDIDATES_ENDPOINT,
      { params },
    );
    return data;
  },

  getById: async (id: number): Promise<Candidate> => {
    const { data } = await axiosInstance.get<Candidate>(
      `${CANDIDATES_ENDPOINT}/${id}`,
    );
    return data;
  },
};
