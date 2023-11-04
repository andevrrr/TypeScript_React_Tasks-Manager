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

  return (
    <div>
      <h1>Tasks Page</h1>

      <form
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
      </form>
      
      <TaskEdit
        show={isEditModalOpen}
        onClose={handleCloseEditModal}
        taskId={currentTask.id}
        onSubmit={handleUpdateTask}
        currentTask={currentTask}
      />
      <div>
        {tasks &&
          tasks.map((task) => (
            <Task
              key={task.id}
              name={task.name}
              tags={task.tags.join(",")}
              onDelete={() => handleDeleteTask(task.id)}
              onEdit={() => handleShowEditModal(task)}
            />
          ))}
      </div>

    </div>
  );
};

export default Tasks;
