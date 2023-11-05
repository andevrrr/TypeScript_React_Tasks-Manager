import React, { useEffect, useState } from "react";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  createTag,
  fetchTags,
  updateTasksLineIds,
} from "../services/api";

import Task from "../components/Task/Task";
import TaskEdit from "../components/Task/TaskEdit";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<{
    id: number;
    name: string;
    tags: string[];
    lineId: number;
  }>({ id: 0, name: "", tags: [], lineId: 0 });
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [mode, setMode] = useState<"create" | "edit">("edit");

  const [tags, setTags] = useState<{ name: string }[]>([]);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    fetchTasks().then((response) => {
      const sortedTasks = response.sort(
        (a: any, b: any) => a.lineId - b.lineId
      );
      setTasks(sortedTasks);
    });
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
    console.log(data);
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
    lineId: number;
    id: number;
    name: string;
    tags: string[];
  }) => {
    if (task) {
      setCurrentTask({
        id: task.id,
        name: task.name,
        tags: task.tags,
        lineId: task.lineId,
      });
      setMode("edit");
    } else {
      setCurrentTask({ id: 0, name: "", tags: [], lineId: 0 }); // Reset for new task
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

  // ends

  // Tags creation

  const handleCreateTag = () => {
    createTag({ name: newTag }).then(() => {
      fetchTags().then((response) => setTags(response));
    });
  };

  //

  // Dragable tasks

  const onDragEnd = async (result: any) => {
    if (!result.destination) return; // Dropped outside the list

    const reorderedTasks = Array.from(tasks);
    const [removed] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, removed);

    // Assign lineIds based on the new order
    const updatedTasks = reorderedTasks.map((task, index) => ({
      ...task,
      lineId: index + 1,
    }));

    // First, update the local state
    setTasks(updatedTasks);

    const updateTaskLineIds = async () => {
      const results = [];

      for (let task of updatedTasks) {
        try {
          await updateTasksLineIds(task.id, task.lineId);
          results.push(task);
        } catch (error) {
          console.error("Failed to update tasks lineIds:", error);
        }
      }

      setTasks(results);
    };

    updateTaskLineIds();
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
        {tags.map((tag, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleTagFilterChange(tag.name)}
            className={`mt-5 px-3 py-2 text-sm font-semibold rounded-full ${
              filterTags.includes(tag.name)
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            } m-1`}
          >
            {tag.name}
          </button>
        ))}
      </div>

      <TaskEdit
        show={isEditModalOpen}
        onClose={handleCloseEditModal}
        taskId={currentTask.id}
        mode={mode} // Pass the mode here
        onSubmit={mode === "edit" ? handleUpdateTask : handleCreateTask}
        currentTask={currentTask}
        tags={tags.map((tag) => tag.name)}
      />
      <div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="tasksDroppable">
            {(provided) => (
              <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                role="list"
                className="divide-y divide-gray-100 tasks"
              >
                {getFilteredTasks().map((task, index) => (
                  <Draggable
                    key={task.id}
                    draggableId={String(task.id)}
                    index={index}
                  >
                    {(provided) => (
                      <li
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                      >
                        <Task
                          name={task.name}
                          tags={task.tags.join(",")}
                          onDelete={() => handleDeleteTask(task.id)}
                          onEdit={() => handleShowModal(task)}
                        />
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default Tasks;
