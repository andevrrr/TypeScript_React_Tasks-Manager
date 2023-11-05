import React, { useEffect, useState } from "react";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  createTag,
  fetchTags,
  updateTasksLineIds,
  fetchTasksDates,
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

  const [tags, setTags] = useState<{ id: number; name: string }[]>([]);

  const [newTag, setNewTag] = useState("");

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    fetchTasks().then((response) => {
      const sortedTasks = response.sort(
        (a: any, b: any) => a.lineId - b.lineId
      );
      setTasks(sortedTasks);
    });
    fetchTags().then((response) => setTags(response));
    const timerInterval = setInterval(() => {
      setTasks((prevTasks) => [...prevTasks]);
    }, 1000);

    return () => {
      clearInterval(timerInterval);
    };
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

  // Activity

  const handleToggleTaskActive = async (taskId: number) => {
    const task = tasks.find((task) => task.id === taskId);
    if (!task) return;

    const now = new Date().toISOString();

    let elapsedTime = task.elapsedTime;

    if (task.activeSincePause) {
      // Calculate from the last pause time
      elapsedTime +=
        new Date(now).getTime() - new Date(task.activeSincePause).getTime();
    } else if (task.activeSince) {
      // Calculate from the start time (but only if the task was previously started)
      elapsedTime +=
        new Date(now).getTime() - new Date(task.activeSince).getTime();
    }

    const updatedTask = {
      ...task,
      elapsedTime: elapsedTime,
      activeSince: task.activeSince === null ? now : task.activeSince,
      activeSincePause: now,
    };

    await updateTask(taskId, {
      elapsedTime: updatedTask.elapsedTime,
      activeSince: updatedTask.activeSince,
      activeSincePause: updatedTask.activeSincePause,
    });

    setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));
  };

  const handleToggleTaskPause = async (taskId: number) => {
    const task = tasks.find((task) => task.id === taskId);
    if (!task || !task.activeSincePause) return;

    const now = new Date().toISOString();
    const elapsedTime =
      task.elapsedTime +
      (new Date(now).getTime() - new Date(task.activeSince).getTime());

    const updatedTask = {
      ...task,
      elapsedTime: elapsedTime,
      activeSincePause: null,
    };

    await updateTask(taskId, {
      elapsedTime: updatedTask.elapsedTime,
      activeSincePause: null,
    });

    setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));
  };

  const handleToggleTaskStop = async (taskId: number) => {
    const updatedTask = {
      ...tasks.find((task) => task.id === taskId),
      elapsedTime: 0,
      activeSince: null,
      activeSincePause: null,
    };

    await updateTask(taskId, {
      elapsedTime: 0,
      activeSince: null,
      activeSincePause: null,
    });

    setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));
  };

  //

  // Module I

  // Tasks of interest: tasks with elapsedTime more than 30 minutes
  const tasksOfInterest = tasks.filter((task) => task.elapsedTime > 30);

  // Tags of interest: tags with a cumulative elapsedTime of associated tasks more than 60 minutes
  const tagsOfInterest = tags.filter((tag) => {
    const associatedTasks = tasks.filter((task) => task.tags.includes(tag.id));
    const cumulativeTime = associatedTasks.reduce(
      (total, task) => total + task.elapsedTime,
      0
    );
    return cumulativeTime > 60;
  });

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

      <div className="flex items-center space-x-2 mt-5">
        <input
          type="datetime-local"
          value={startDate.toISOString().slice(0, -8)}
          onChange={(e) => setStartDate(new Date(e.target.value))}
        />
        <input
          type="datetime-local"
          value={endDate.toISOString().slice(0, -8)}
          onChange={(e) => setEndDate(new Date(e.target.value))}
        />
        <button
          type="button"
          onClick={() => {
            fetchTasksDates(startDate, endDate).then((response) =>
              setTasks(response)
            );
          }}
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          Filter
        </button>
      </div>
      <div>
        <h3>Summary</h3>
        <div>
          <h4>Tasks of Interest:</h4>
          {tasksOfInterest.map((task) => (
            <div key={task.id}>
              {task.name}: {task.elapsedTime} minutes
            </div>
          ))}
        </div>
        <div>
          <h4>Tags of Interest:</h4>
          {tagsOfInterest.map((tag) => (
            <div key={tag.id}>{tag.name}</div>
          ))}
        </div>
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
                          id={task.id}
                          onToggleStart={() => handleToggleTaskActive(task.id)}
                          onTogglePause={() => handleToggleTaskPause(task.id)}
                          onToggleStop={() => handleToggleTaskStop(task.id)}
                          activeSince={task.activeSince}
                          activeSincePause={task.activeSincePause}
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
