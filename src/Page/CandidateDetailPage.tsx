import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { Candidate } from "../types/candidate.type";
import { candidateApi } from "../api/candidate.api";
import { ApiError } from "../api/axiosInstance";
import CandidateDetail from "../Component/Candidate/CandidateDetail";
import Loader from "../Component/Loader/Loader";

const CandidateDetailPage = () => {
  const { candidateId } = useParams<{ candidateId: string }>();
  const navigate = useNavigate();
  const id = Number(candidateId);

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const isValidId = Number.isFinite(id);

  useEffect(() => {
    if (!isValidId) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await candidateApi.getById(id);
        if (cancelled) return;
        setCandidate(data);
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof ApiError
            ? err.message
            : "Failed to load candidate details.",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id, isValidId, refreshKey]);

  if (loading) {
    return <Loader label="Loading candidate..." fullPage />;
  }

  if (!isValidId || error) {
    return (
      <div className="flex items-center gap-3">
        <p className="text-sm text-rose-500">
          {isValidId ? error : "Invalid candidate id."}
        </p>
        {isValidId && (
          <button
            type="button"
            onClick={() => setRefreshKey((key) => key + 1)}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Retry
          </button>
        )}
        <button
          type="button"
          onClick={() => navigate("/candidates")}
          className="text-sm font-semibold text-slate-500 hover:text-slate-700"
        >
          Back to Candidates
        </button>
      </div>
    );
  }

  if (!candidate) return null;

  return (
    <CandidateDetail
      candidate={candidate}
      onBack={() => navigate("/candidates")}
    />
  );
};

export default CandidateDetailPage;
