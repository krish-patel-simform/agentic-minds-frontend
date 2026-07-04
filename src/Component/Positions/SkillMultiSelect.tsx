import { useMemo, useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";

const DEFAULT_SKILL_OPTIONS = [
  "Python",
  "React",
  "Node.js",
  "TypeScript",
  "JavaScript",
  "Java",
  "Kubernetes",
  "Docker",
  "AWS",
  "Azure",
  "DevOps",
  "SQL",
  "Go",
  "GraphQL",
];

interface SkillMultiSelectProps {
  value: string[];
  onChange: (skills: string[]) => void;
  options?: string[];
  placeholder?: string;
}

const SkillMultiSelect = ({
  value,
  onChange,
  options = DEFAULT_SKILL_OPTIONS,
  placeholder = "Search or add a skill...",
}: SkillMultiSelectProps) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const trimmedQuery = query.trim();

  const filteredOptions = useMemo(() => {
    const q = trimmedQuery.toLowerCase();
    return options.filter(
      (option) =>
        !value.some((v) => v.toLowerCase() === option.toLowerCase()) &&
        (q === "" || option.toLowerCase().includes(q)),
    );
  }, [options, trimmedQuery, value]);

  const exactMatchExists =
    trimmedQuery !== "" &&
    (options.some((option) => option.toLowerCase() === trimmedQuery.toLowerCase()) ||
      value.some((v) => v.toLowerCase() === trimmedQuery.toLowerCase()));

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    if (!value.some((v) => v.toLowerCase() === trimmed.toLowerCase())) {
      onChange([...value, trimmed]);
    }
    setQuery("");
  };

  const removeSkill = (skill: string) => {
    onChange(value.filter((v) => v !== skill));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (trimmedQuery) addSkill(trimmedQuery);
    } else if (e.key === "Backspace" && query === "" && value.length > 0) {
      removeSkill(value[value.length - 1]);
    }
  };

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(true)}
        className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm flex flex-wrap gap-1.5 items-center focus-within:ring-2 focus-within:ring-indigo-500"
      >
        {value.map((skill) => (
          <span
            key={skill}
            className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full text-xs font-medium"
          >
            {skill}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeSkill(skill);
              }}
              className="text-indigo-400 hover:text-indigo-700"
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 min-w-25 outline-none py-0.5"
        />
      </div>

      {isOpen && (filteredOptions.length > 0 || trimmedQuery !== "") && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filteredOptions.map((option) => (
            <button
              key={option}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => addSkill(option)}
              className="w-full text-left px-3 py-2 text-sm hover:bg-indigo-50 text-slate-700"
            >
              {option}
            </button>
          ))}
          {trimmedQuery !== "" && !exactMatchExists && (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => addSkill(trimmedQuery)}
              className="w-full text-left px-3 py-2 text-sm hover:bg-indigo-50 text-indigo-600 font-medium border-t border-gray-100"
            >
              + Add "{trimmedQuery}"
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SkillMultiSelect;
