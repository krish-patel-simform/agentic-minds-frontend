import { Search } from "lucide-react";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { config } from "../config";
import type { Candidate, CandidateStatus } from "../types/candidate.type";
import CandidateCard from "../Component/Card/CandidateCard";

const TABS: { label: string; value: CandidateStatus | "All" }[] = [
  { label: "All", value: "All" },
  { label: "Completed", value: "Completed" },
  { label: "Pending", value: "Pending" },
  { label: "Scheduled", value: "Scheduled" },
  { label: "Partial (Dropped)", value: "Partial (Dropped)" },
];

const CandidatePage = () => {
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[] | null>(null);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<CandidateStatus | "All">("All");
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearchTerm = useDeferredValue(searchTerm);

  useEffect(() => {
    async function fetchCandidates() {
      try {
        setLoading(true);
        const response = await fetch(
          `${config.baseURL}${config.endpoints.candidates}`,
        );
        if (!response.ok) throw new Error("Error in fetching data");

        const data: Candidate[] = await response.json();
        setCandidates(data);
      } catch (error) {
        if (error instanceof Error) console.log(error.message);
        setError(error instanceof Error ? error : new Error(String(error)));
      } finally {
        setLoading(false);
      }
    }

    fetchCandidates();
  }, []);

  if (error) {
    throw Error(error.message);
  }

  const filteredCandidates = useMemo(() => {
    if (!candidates) return [];

    const query = deferredSearchTerm.trim().toLowerCase();

    return candidates.filter((candidate) => {
      const matchesTab = activeTab === "All" || candidate.status === activeTab;
      const matchesSearch =
        !query ||
        candidate.name.toLowerCase().includes(query) ||
        candidate.email.toLowerCase().includes(query) ||
        candidate.position.toLowerCase().includes(query);

      return matchesTab && matchesSearch;
    });
  }, [candidates, activeTab, deferredSearchTerm]);

  const totalPositions = useMemo(() => {
    if (!candidates) return 0;
    return new Set(candidates.map((candidate) => candidate.position)).size;
  }, [candidates]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Candidates</h2>
        <p className="text-gray-500 text-sm">
          {candidates?.length ?? 0} total candidates across {totalPositions}{" "}
          positions
        </p>
      </div>

      <div className="flex justify-between items-center mb-6 gap-4">
        <div className="flex gap-2 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                activeTab === tab.value
                  ? "border-indigo-600 text-indigo-700 bg-indigo-50"
                  : "border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search candidates..."
            className="pl-9 pr-4 py-2 w-64 rounded-lg border border-gray-200 text-sm outline-none focus:border-indigo-400"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-indigo-50/40 text-[11px] uppercase text-gray-400 font-bold">
              <th className="py-3 px-6">Candidate</th>
              <th className="py-3 px-6">Position</th>
              <th className="py-3 px-6">Phone</th>
              <th className="py-3 px-6">Status</th>
              <th className="py-3 px-6">Applied</th>
              <th className="py-3 px-6">Score</th>
              <th className="py-3 px-6"></th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.map((candidate) => (
              <CandidateCard key={candidate.id} candidate={candidate} />
            ))}
          </tbody>
        </table>

        {filteredCandidates.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-10">
            No candidates found.
          </p>
        )}
      </div>
    </div>
  );
};

export default CandidatePage;
