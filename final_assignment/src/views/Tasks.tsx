import React, { useEffect, useState } from "react";
import { fetchTasks, createTask, updateTask } from "../services/api";

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    fetchTasks().then((response) => setTasks(response.data));
  }, []);

  const handleUpdateTask = (taskId: number, data: any) => {
    updateTask(taskId, data).then(() => {
      fetchTasks().then((response) => setTasks(response.data));
    });
  };

  const handleCreateTask = (data: any) => {
    createTask(data).then(() => {
      fetchTasks().then((response) => setTasks(response.data));
    });
  };

  return (
    <div>
      <h1>Tasks Page</h1>
      <ul>
        {tasks &&
          tasks.map((task) => (
            <div key={task.id}>{task.name}</div>
          ))}
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
    </div>
  );
};

export default Tasks;
