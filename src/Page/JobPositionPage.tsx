import { Plus } from "lucide-react";
import type { JobPosition } from "../types/jobPosition.type";
import { useEffect, useState } from "react";
import { config } from "../config";
import JobPositionCard from "../Component/Card/JobPositionCard";
import Loader from "../Component/Loader/Loader";

const JobPositionPage = () => {
  const [loading, setLoading] = useState(false);
  const [jobData, setJobData] = useState<JobPosition[] | null>(null);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    async function fetchJobdata() {
      try {
        setLoading(true);
        console.log(import.meta.env.VITE_JSON_SERVER_BASE_URL);
        const response = await fetch(
          `${config.baseURL}${config.endpoints.jobs}`,
        );
        if (!response.ok) throw new Error("Error in fetching data");

        const data: JobPosition[] = await response.json();
        setJobData(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchJobdata();
  }, []);

  if (error) {
    console.log("Error Catch");
    throw Error(error.message);
  }

  if (loading) {
    return <Loader label="Loading job positions..." fullPage />;
  }

  return (
    <div>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Job Positions</h2>
          <p className="text-gray-500 text-sm">
            3 active positions • 10 total candidates
          </p>
        </div>
        <button className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold text-sm transition-colors">
          <Plus size={18} />
          Create Position
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobData
          ? jobData.map((job) => <JobPositionCard key={job.id} job={job} />)
          : null}
      </div>
    </div>
  );
};

export default JobPositionPage;
