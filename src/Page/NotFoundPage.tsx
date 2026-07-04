import { CompassIcon } from "lucide-react";
import { Link } from "react-router";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24">
      <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
        <CompassIcon size={28} />
      </div>
      <p className="text-sm font-bold text-indigo-600 mb-1">404 error</p>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">
        Page not found
      </h2>
      <p className="text-gray-500 text-sm mb-8 max-w-sm">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link
        to="/"
        className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
      >
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;
