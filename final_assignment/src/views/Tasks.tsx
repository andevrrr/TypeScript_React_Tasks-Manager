import React, { useEffect, useState } from "react";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  createTag,
  fetchTags,
} from "../services/api";

import Task from "../components/Task/Task";
import TaskEdit from "../components/Task/TaskEdit";

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<{
    id: number;
    name: string;
    tags: string[];
  }>({ id: 0, name: "", tags: [] });
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [mode, setMode] = useState<"create" | "edit">("edit");

  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    fetchTasks().then((response) => setTasks(response));
    fetchTags().then((response) => setTags(response));
  }, []);

  const handleUpdateTask = (taskId: number, data: any) => {
    console.log(taskId);
    console.log(data);
    updateTask(taskId, data).then(() => {
      fetchTasks().then((response) => setTasks(response));
    });
  };

  const handleCreateTask = (taskId: number, data: any) => {
    createTask(data).then(() => {
      fetchTasks().then((response) => setTasks(response));
    });
  };

  const handleDeleteTask = (taskId: number) => {
    deleteTask(taskId).then(() => {
      fetchTasks().then((response) => setTasks(response));
    });
  };

  const handleShowModal = (task?: {
    id: number;
    name: string;
    tags: string[];
  }) => {
    if (task) {
      setCurrentTask({ id: task.id, name: task.name, tags: task.tags });
      setMode("edit");
    } else {
      setCurrentTask({ id: 0, name: "", tags: [] }); // Reset for new task
      setMode("create");
    }
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleNewTaskClick = () => {
    handleShowModal();
  };

  // filter by tags start
  type TagFilterButtonProps = {
    tag: string;
  };

  const handleTagFilterChange = (tag: string) => {
    setFilterTags((prevTags) => {
      if (prevTags.includes(tag)) {
        return prevTags.filter((t) => t !== tag);
      } else {
        return [...prevTags, tag];
      }
    });
  };

  const getFilteredTasks = () => {
    if (filterTags.length === 0) return tasks;

    return tasks.filter((task) =>
      filterTags.every((filterTag) => task.tags.includes(filterTag))
    );
  };

  const uniqueTags = Array.from(
    new Set(tasks.reduce((acc, task) => [...acc, ...task.tags], [] as string[]))
  );

  const TagFilterButton: React.FC<TagFilterButtonProps> = ({ tag }) => (
    <button
      type="button"
      onClick={() => handleTagFilterChange(tag)}
      className={`mt-5 px-3 py-2 text-sm font-semibold rounded-full ${
        filterTags.includes(tag)
          ? "bg-blue-500 text-white"
          : "bg-gray-200 text-black"
      } m-1`}
    >
      {tag}
    </button>
  );

  // ends

  // Tags creation

  const handleCreateTag = () => {
    createTag({ name: newTag }).then(() => { // make sure to construct the data object correctly
      fetchTags().then((response) => setTags(response));
    });
  };
  //

  return (
    <div>
      <div className="h-24 p-5 rounded-lg bg-head lg:flex lg:items-center lg:justify-between">
        <div className="flex-1">
          <h2 className="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">
            Your tasks
          </h2>
        </div>
        <div className="mt-5 flex lg:ml-4 lg:mt-0">
          <span className="sm:ml-3">
            <button
              onClick={handleNewTaskClick}
              type="button"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              New Task
            </button>
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-2 mt-5">
      <input
  type="text"
  value={newTag}
  onChange={(e) => setNewTag(e.target.value)}
  placeholder="Type a tag..."
  className="rounded-md border border-gray-300 px-3 py-2 text-sm"
/>
        <button
          type="button"
          onClick={handleCreateTag}
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          Create
        </button>
      </div>
      <div className="flex flex-wrap">
        {uniqueTags.map((tag) => (
          <TagFilterButton tag={tag} />
        ))}
      </div>

      <TaskEdit
        show={isEditModalOpen}
        onClose={handleCloseEditModal}
        taskId={currentTask.id}
        mode={mode} // Pass the mode here
        onSubmit={mode === "edit" ? handleUpdateTask : handleCreateTask}
        currentTask={currentTask}
      />
      <ul role="list" className="divide-y divide-gray-100">
        {getFilteredTasks().map((task) => (
          <Task
            key={task.id}
            name={task.name}
            tags={task.tags.join(",")}
            onDelete={() => handleDeleteTask(task.id)}
            onEdit={() => handleShowModal(task)}
          />
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
