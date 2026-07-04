import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { Candidate, CandidateStatus } from "../types/candidate.type";
import { candidateApi } from "../api/candidate.api";
import { ApiError } from "../api/axiosInstance";
import CandidateCard from "../Component/Card/CandidateCard";

const PAGE_SIZE = 20;

const STATUS_FILTER_OPTIONS: { value: CandidateStatus | ""; label: string }[] =
  [
    { value: "", label: "All statuses" },
    { value: "new", label: "New" },
    { value: "screening", label: "Screening" },
    { value: "shortlisted", label: "Shortlisted" },
    { value: "on_hold", label: "On Hold" },
    { value: "rejected", label: "Rejected" },
    { value: "hired", label: "Hired" },
    { value: "withdrawn", label: "Withdrawn" },
  ];

const CandidatePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Candidate[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<CandidateStatus | "">("");
  const [error, setError] = useState<string | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = () => setRefreshKey((key) => key + 1);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const response = await candidateApi.list({
          page,
          size: PAGE_SIZE,
          q: searchInput.trim() || undefined,
          status: statusFilter || undefined,
        });
        if (cancelled) return;
        setItems(response.items);
        setTotal(response.total);
        setPages(response.pages);
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof ApiError ? err.message : "Failed to load candidates.",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [page, searchInput, statusFilter, refreshKey]);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Candidates</h2>
        <p className="text-gray-500 text-sm">{total} total candidates</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-56">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => {
              setPage(1);
              setSearchInput(e.target.value);
            }}
            placeholder="Search name or email..."
            className="pl-9 pr-4 py-2 w-full rounded-lg border border-gray-200 text-sm outline-none focus:border-indigo-400"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setPage(1);
            setStatusFilter(e.target.value as CandidateStatus | "");
          }}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-indigo-400"
        >
          {STATUS_FILTER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <p className="text-sm text-gray-400">Loading candidates...</p>
      )}

      {error && !loading && (
        <div className="flex items-center gap-3 mb-4">
          <p className="text-sm text-rose-500">{error}</p>
          <button
            type="button"
            onClick={triggerRefresh}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <p className="text-sm text-gray-400 py-12 text-center">
          No candidates found.
        </p>
      )}

      {!loading && !error && items.length > 0 && (
        <>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-indigo-50/40 text-[11px] uppercase text-gray-400 font-bold">
                  <th className="py-3 px-6">Candidate</th>
                  <th className="py-3 px-6">Current Role</th>
                  <th className="py-3 px-6">Experience</th>
                  <th className="py-3 px-6">Phone</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((candidate) => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    onClick={() => navigate(`/candidates/${candidate.id}`)}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {pages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-semibold text-slate-600 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-gray-500">
                Page {page} of {pages} ({total} total)
              </span>
              <button
                type="button"
                disabled={page >= pages}
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-semibold text-slate-600 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CandidatePage;
