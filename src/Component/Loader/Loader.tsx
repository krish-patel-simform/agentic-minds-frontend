import { Loader2 } from "lucide-react";

interface LoaderProps {
  label?: string;
  fullPage?: boolean;
}

const Loader = ({ label = "Loading...", fullPage = false }: LoaderProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 text-gray-400 ${
        fullPage ? "min-h-[60vh]" : "py-16"
      }`}
    >
      <Loader2 size={28} className="animate-spin text-indigo-500" />
      {label && <p className="text-sm font-medium">{label}</p>}
    </div>
  );
};

export default Loader;
