import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import type {
  JobPosition,
  JobPositionFormData,
} from "../../types/jobPosition.type";
import JobPositionCard from "../Card/JobPositionCard/JobPositionCard";
import CreateJobPositionModal from "./CreateJobPositionModal";
import JobPositionDetail from "./JobPositionDetail";
import { config } from "../../config";

const INITIAL_JOBS: JobPosition[] = [
  {
    id: "1",
    title: "Junior Python Developer",
    tech: "Python",
    tags: ["Python"],
    status: "Active",
    applicants: 5,
    description:
      "Entry-level Python role building backend services and APIs for our data platform team.",
    experience: "0-5 yrs",
    noticePeriod: "30d / 60d max",
    questions: 5,
    interviewer: "Gwen",
    screeningQuestions: [],
    applicantsList: [],
  },
  {
    id: "2",
    title: "Senior React Engineer",
    tech: "React",
    tags: ["React"],
    status: "Active",
    applicants: 2,
    description:
      "Lead frontend development for our SaaS platform with React, TypeScript and a modern component system.",
    experience: "4-8 yrs",
    noticePeriod: "30d / 90d max",
    questions: 4,
    interviewer: "Priya",
    screeningQuestions: [],
    applicantsList: [],
  },
  {
    id: "3",
    title: "DevOps Engineer",
    tech: "Kubernetes",
    tags: ["Kubernetes"],
    status: "Active",
    applicants: 3,
    description:
      "Own our CI/CD pipeline and cloud infrastructure on Azure, ensuring reliability and developer velocity.",
    experience: "3-7 yrs",
    noticePeriod: "30d / 60d max",
    questions: 4,
    interviewer: "Admin",
    screeningQuestions: [
      {
        id: crypto.randomUUID(),
        question:
          "Describe how you would set up a production-ready Kubernetes cluster on Azure.",
      },
      {
        id: crypto.randomUUID(),
        question:
          "Walk me through your ideal CI/CD pipeline design using GitHub Actions.",
      },
    ],
    applicantsList: [
      {
        id: "a1",
        name: "Snehal Joshi",
        email: "snehal.j@devops.io",
        phone: "+91 99001 12233",
        status: "Pending",
        appliedDate: "Jun 14, 2026",
        score: null,
      },
      {
        id: "a2",
        name: "Karan Mehta",
        email: "karan.m@gmail.com",
        phone: "+91 99001 12234",
        status: "Partial (Dropped)",
        appliedDate: "Jun 13, 2026",
        score: null,
      },
      {
        id: "a3",
        name: "Pooja Desai",
        email: "pooja.d@infra.ai",
        phone: "+91 99001 12235",
        status: "Pending",
        appliedDate: "Jun 12, 2026",
        score: null,
      },
    ],
  },
];

const JobPositions = () => {
      const [loading, setLoading] = useState(false);
  const [jobData, setJobData] = useState<JobPosition[] | null>(null);
  const [error, setError] = useState<Error | undefined>(undefined);
//   const [jobs, setJobs] = useState<JobPosition[]>(INITIAL_JOBS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const selectedJob = jobData?.find((job) => job.id === selectedJobId) ?? null;
  const totalCandidates = jobData?.reduce((sum, job) => sum + job.applicants, 0);
  const activeCount = jobData?.filter((job) => job.status === "Active").length;


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
 

  const handleCreate = (data: JobPositionFormData) => {
    const newJob: JobPosition = {
      id: crypto.randomUUID(),
      title: data.title,
      tech: data.primarySkill,
      tags: data.primarySkill ? [data.primarySkill] : [],
      status: "Active",
      applicants: 0,
      description: data.description,
      experience: data.experience,
      noticePeriod: `${data.noticePeriod} max`,
      questions: data.screeningQuestions.length,
      interviewer: data.interviewer,
      screeningQuestions: data.screeningQuestions,
      applicantsList: [],
    };

    setJobData((prev) => [newJob, ...prev]);
    setIsModalOpen(false);
  };

  if (selectedJob) {
    return (
      <JobPositionDetail
        job={selectedJob}
        onBack={() => setSelectedJobId(null)}
        onCreateNew={() => setIsModalOpen(true)}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Job Positions</h2>
          <p className="text-gray-500 text-sm">
            {activeCount} active positions • {totalCandidates} total
            candidates
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold text-sm transition-colors"
        >
          <Plus size={18} />
          Create Position
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobData?.map((job) => (
          <JobPositionCard
            key={job.id}
            job={job}
            onClick={() => setSelectedJobId(job.id)}
          />
        ))}
      </div>

      {isModalOpen && (
        <CreateJobPositionModal
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
};

export default JobPositions;
