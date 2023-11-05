import React, { useEffect, useState } from "react";

interface TaskEditProps {
  show: boolean;
  onClose: () => void;
  taskId: number;
  onSubmit: (taskId: number, data: { name: string; tags: string[] }) => void;
  currentTask: { name: string; tags: string[] };
  mode: "create" | "edit";
}

const TaskEdit: React.FC<TaskEditProps> = ({
  show,
  onClose,
  taskId,
  onSubmit,
  currentTask,
  mode,
}) => {
  const [name, setName] = useState(currentTask.name);
  const [tags, setTags] = useState(currentTask.tags.join(","));

  useEffect(() => {
    // to watch for changes in currentTask
    setName(currentTask.name);
    setTags(currentTask.tags.join(","));
  }, [currentTask]);

  const handleSubmit = () => {
    if (mode === "create") {
      // Logic for creating a new task
      onSubmit(0, {
        name,
        tags: tags.split(","),
      });
    } else {
      // Logic for editing an existing task
      onSubmit(taskId, {
        name,
        tags: tags.split(","),
      });
    }
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-white p-6 shadow-lg rounded-lg">
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

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="tags"
        >
          Tags (comma-separated):
        </label>
        <input
          id="tags"
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div className="flex justify-between">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
