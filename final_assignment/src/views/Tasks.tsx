import React, { useEffect, useState } from "react";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/api";
import Task from "../components/Task/Task";

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);

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

  return (
    <div>
      <h1>Tasks Page</h1>
      <ul>
        {tasks && tasks.map((task) => <Task key={task.id} name={task.name} />)}
      </ul>

      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <label>
          Task ID:
          <input type="number" name="taskId" />
        </label>
        <label>
          New Task Name:
          <input type="text" name="newTaskName" />
        </label>
        <button
          onClick={() =>
            handleUpdateTask(
              parseInt(
                (document.querySelector('[name="taskId"]') as HTMLInputElement)
                  .value
              ),
              {
                name: (
                  document.querySelector(
                    '[name="newTaskName"]'
                  ) as HTMLInputElement
                ).value,
              }
            )
          }
        >
          Update Task
        </button>
      </form>

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

      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <label>
          Task id:
          <input type="number" name="DeleteTaskId" />
        </label>
        <button
          onClick={() =>
            handleDeleteTask(
              parseInt(
                (document.querySelector('[name="DeleteTaskId"]') as HTMLInputElement).value
              )
            )
          }
        >
          
          Delete Task
        </button>
      </form>
    </div>
  );
};

export default Tasks;
