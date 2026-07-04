import JobPositions from "../Component/Positions/JobPositions";
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary";

const JobPositionPage = () => {
  return
  <ErrorBoundary>
    <JobPositions />;
  </ErrorBoundary>
};

export default JobPositionPage;
