import React, { useEffect, useState } from "react";

interface TaskEditProps {
  show: boolean;
  onClose: () => void;
  taskId: number;
  onSubmit: (taskId: number, data: { name: string; tags: string[] }) => void;
  currentTask: { name: string; tags: string[] };
}

const TaskEdit: React.FC<TaskEditProps> = ({
  show,
  onClose,
  taskId,
  onSubmit,
  currentTask,
}) => {
  const [name, setName] = useState(currentTask.name);
  const [tags, setTags] = useState(currentTask.tags.join(","));

  useEffect(() => {   // to watch for changes in currentTask
    setName(currentTask.name);
    setTags(currentTask.tags.join(","));
  }, [currentTask]);  

  const handleSubmit = () => {
    onSubmit(taskId, {
      name,
      tags: tags.split(","),
    });
    onClose();
  };

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1000,
        backgroundColor: "white",
        padding: "20px",
        boxShadow: "0 0 10px rgba(0,0,0,0.2)",
      }}
    >
      <label>
        Task Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)} 
        />
      </label>
      <label>
        Tags (comma-separated):
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)} 
        />
      </label>

      <button onClick={handleSubmit}>Submit</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default TaskEdit;
