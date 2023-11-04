import React, { useEffect, useState } from "react";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
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
  const [searchTag, setSearchTag] = useState("");

  useEffect(() => {
    fetchTasks().then((response) => setTasks(response));
  }, []);

  const handleUpdateTask = (taskId: number, data: any) => {
    console.log(taskId);
    console.log(data);
    updateTask(taskId, data).then(() => {
      fetchTasks().then((response) => setTasks(response));
    });
  };

  const handleCreateTask = (data: any) => {
    createTask(data).then(() => {
      fetchTasks().then((response) => setTasks(response));
    });
  };

  const handleDeleteTask = (taskId: number) => {
    deleteTask(taskId).then(() => {
      fetchTasks().then((response) => setTasks(response));
    });
  };

  const handleShowEditModal = (task: {
    id: number;
    name: string;
    tags: string[];
  }) => {
    setCurrentTask({ id: task.id, name: task.name, tags: task.tags });
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
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

  const handleSearch = () => {
    setFilterTags(searchTag ? [searchTag] : []);
  };

  // ends

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
            value={searchTag}
            onChange={(e) => setSearchTag(e.target.value)}
            placeholder="Type a tag..."
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            Search
          </button>
        </div>
      <div className="flex flex-wrap">
        {uniqueTags.map((tag) => (
          <TagFilterButton tag={tag} />
        ))}
      </div>

      {/* <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <label>
          Task Name:
          <input type="text" name="taskName" />
        </label>
        <label>
          Tags (comma-separated):
          <input type="text" name="taskTags" />
        </label>
        <button
          onClick={() =>
            handleCreateTask({
              name: (
                document.querySelector('[name="taskName"]') as HTMLInputElement
              ).value,
              tags: (
                document.querySelector('[name="taskTags"]') as HTMLInputElement
              ).value.split(","),
            })
          }
        >
          Create Task
        </button>
      </form> */}

      <TaskEdit
        show={isEditModalOpen}
        onClose={handleCloseEditModal}
        taskId={currentTask.id}
        onSubmit={handleUpdateTask}
        currentTask={currentTask}
      />
      <ul role="list" className="divide-y divide-gray-100">
        {getFilteredTasks().map((task) => (
          <Task
            key={task.id}
            name={task.name}
            tags={task.tags.join(",")}
            onDelete={() => handleDeleteTask(task.id)}
            onEdit={() => handleShowEditModal(task)}
          />
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
