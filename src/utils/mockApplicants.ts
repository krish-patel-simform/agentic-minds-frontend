import type { Applicant } from "../types/jobPosition.type";

// The real job API has no applicants/candidates field yet - this generates
// stable placeholder data (seeded by job id) until that API exists.

const SAMPLE_NAMES = [
  "Snehal Joshi",
  "Karan Mehta",
  "Pooja Desai",
  "Aarav Shah",
  "Isha Kulkarni",
  "Rohan Verma",
  "Meera Iyer",
  "Vikram Nair",
];

const STATUSES: Applicant["status"][] = [
  "Pending",
  "Partial (Dropped)",
  "Completed",
];

function seededRandom(seed: number) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

export function getMockApplicantCount(jobId: number): number {
  const random = seededRandom(jobId + 1);
  return Math.floor(random() * 9);
}

export function getMockApplicants(jobId: number): Applicant[] {
  const count = getMockApplicantCount(jobId);
  const random = seededRandom(jobId + 1);
  random();

  return Array.from({ length: count }, (_, index) => {
    const name = SAMPLE_NAMES[Math.floor(random() * SAMPLE_NAMES.length)];
    const status = STATUSES[Math.floor(random() * STATUSES.length)];
    const day = 1 + Math.floor(random() * 28);

    return {
      id: `mock-${jobId}-${index}`,
      name,
      email: `${name.toLowerCase().replace(" ", ".")}@example.com`,
      phone: `+91 90${String(1000000 + jobId * 7 + index).slice(0, 8)}`,
      status,
      appliedDate: `Jul ${day}, 2026`,
      score: status === "Completed" ? Math.floor(random() * 10) : null,
    };
  });
}
