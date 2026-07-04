import { Plus } from "lucide-react";
import type { JobPosition } from "../types/jobPosition.type";
import JobPositionCard from "../Component/Card/JobPositionCard/JobPositionCard";
import { useEffect, useState } from "react";
import { config } from "../config";

// const jobData: JobPosition[] = [
//   {
//     id: "1",
//     title: "Junior Python Developer",
//     tech: "Python",
//     status: "Active",
//     applicants: 5,
//     description:
//       "Entry-level Python role building backend services and APIs for our data platform team.",
//     experience: "0-5 yrs",
//     noticePeriod: "30d / 60d max",
//     questions: 5,
//     interviewer: "Gwen",
//   },
//   {
//     id: "2",
//     title: "Senior React Engineer",
//     tech: "React",
//     status: "Active",
//     applicants: 2,
//     description:
//       "Lead frontend development for our SaaS platform with React, TypeScript and a modern component system.",
//     experience: "4-8 yrs",
//     noticePeriod: "30d / 90d max",
//     questions: 4,
//     interviewer: "Priya",
//   },
//   {
//     id: "3",
//     title: "DevOps Engineer",
//     tech: "Kubernetes",
//     status: "Active",
//     applicants: 3,
//     description:
//       "Own our CI/CD pipeline and cloud infrastructure on Azure, ensuring reliability and developer velocity.",
//     experience: "3-7 yrs",
//     noticePeriod: "30d / 60d max",
//     questions: 4,
//     interviewer: "Admin",
//   },
// ];

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
        if (error instanceof Error) console.log(error.message);
        setError(error);
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
    return <p>Loading...</p>;
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
        {}
      </div>
    </div>
  );
};

export default JobPositionPage;
