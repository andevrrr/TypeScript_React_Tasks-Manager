import React, { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";

interface TaskEditProps {
  show: boolean;
  onClose: () => void;
  taskId: number;
  onSubmit: (taskId: number, data: { name: string; tags: string[] }) => void;
  currentTask: { name: string; tags: string[] };
  mode: "create" | "edit";
  tags: string[];
}

const TaskEdit: React.FC<TaskEditProps> = ({
  show,
  onClose,
  taskId,
  onSubmit,
  currentTask,
  mode,
  tags,
}) => {
  const [name, setName] = useState(currentTask.name);
  const [selectedTags, setSelectedTags] = useState<string[]>(currentTask.tags);

  useEffect(() => {
    // to watch for changes in currentTask
    setName(currentTask.name);
    setSelectedTags(currentTask.tags);
  }, [currentTask]);

  const handleTagSelect = (tag: string) => {
    setSelectedTags((prevSelectedTags) => {
      if (prevSelectedTags.includes(tag)) return prevSelectedTags;
      return [...prevSelectedTags, tag];
    });
  };

  const handleTagRemove = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const handleSubmit = () => {
    if (mode === "create") {
      // Logic for creating a new task
      onSubmit(0, {
        name,
        tags: selectedTags,
      });
    } else {
      // Logic for editing an existing task
      onSubmit(taskId, {
        name,
        tags: selectedTags,
      });
    }
    onClose();
  };

  if (!show) return null;

  return (
    <div className="mx-10 my-20">
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="taskName"
        >
          Task Name:
        </label>
        <input
          id="taskName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div>
        <div className="group relative inline-block">
          <div className="relative inline-block">
            <button className="bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 rounded-md focus:outline-none">
              Choose Tags
            </button>
            <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-md">
              {tags.map((tag) => (
                <div
                  className="text-black px-4 py-3 hover:bg-indigo-100 cursor-pointer"
                  key={tag}
                  onClick={() => handleTagSelect(tag)}
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 mb-5">
        {selectedTags.map((tag) => (
          <span className="px-3 py-2 text-sm font-semibold rounded-full bg-gray-200 text-black inline-flex mx-2" key={tag}>
            {tag}
            <button onClick={() => handleTagRemove(tag)}><XMarkIcon className="h-5 w-5" aria-hidden="true" /></button>
          </span>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-5"
        >
          {mode === "create" ? "Create Task" : "Submit Changes"}
        </button>
        <button
          onClick={onClose}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TaskEdit;
