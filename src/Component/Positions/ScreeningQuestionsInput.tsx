import { Plus, X } from "lucide-react";
import type { ScreeningQuestion } from "../../types/jobPosition.type";

interface ScreeningQuestionsInputProps {
  questions: ScreeningQuestion[];
  onChange: (questions: ScreeningQuestion[]) => void;
}

const ScreeningQuestionsInput = ({
  questions,
  onChange,
}: ScreeningQuestionsInputProps) => {
  const handleAddQuestion = () => {
    onChange([...questions, { id: crypto.randomUUID(), question: "" }]);
  };

  const handleQuestionChange = (id: string, value: string) => {
    onChange(
      questions.map((q) => (q.id === id ? { ...q, question: value } : q)),
    );
  };

  const handleRemoveQuestion = (id: string) => {
    onChange(questions.filter((q) => q.id !== id));
  };

  return (
    <div>
      <label className="text-sm font-semibold text-slate-700 mb-2 block">
        Screening Questions
      </label>

      <div className="space-y-3">
        {questions.map((q, index) => (
          <div
            key={q.id}
            className="border border-gray-200 rounded-lg p-3 flex items-start gap-3"
          >
            <span className="w-6 h-6 shrink-0 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center mt-1">
              {index + 1}
            </span>
            <input
              type="text"
              value={q.question}
              onChange={(e) => handleQuestionChange(q.id, e.target.value)}
              placeholder="Type a screening question..."
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => handleRemoveQuestion(q.id)}
              className="text-gray-300 hover:text-rose-500 mt-1.5 shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleAddQuestion}
        className="mt-3 w-full border border-dashed border-gray-300 rounded-lg py-2 text-sm text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors flex items-center justify-center gap-1"
      >
        <Plus size={14} />
        Add question
      </button>
    </div>
  );
};

export default ScreeningQuestionsInput;
