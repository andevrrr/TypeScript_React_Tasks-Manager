import React, { useEffect, useState } from "react";

import {
  PencilIcon,
  TrashIcon,
  PauseIcon,
  PlayIcon,
  StopIcon,
} from "@heroicons/react/20/solid";

interface TaskProps {
  id: number;
  name: string;
  tags: string;
  onDelete: () => void;
  onEdit: () => void;
  onToggleStart: (id: number) => void;
  onTogglePause: (id: number) => void;
  onToggleStop: (id: number) => void;
  activeSince?: string;
  activeSincePause?: string;
}

const Task: React.FC<TaskProps> = (props) => {
  const [taskStatus, setTaskStatus] = useState<
    "running" | "paused" | "stopped"
  >(props.activeSincePause ? "running" : "stopped");

  const initialElapsedSeconds = props.activeSincePause
  ? Math.floor((Date.now() - new Date(props.activeSincePause).getTime()) / 1000)
  : 0;

const [elapsedTime, setElapsedTime] = useState<number>(initialElapsedSeconds);

useEffect(() => {
  let interval: number;

  if (taskStatus === "running") {
    interval = window.setInterval(() => {
      setElapsedTime((prevElapsedTime) => prevElapsedTime + 1);
    }, 1000);
  } else if (taskStatus === "stopped") {
    setElapsedTime(0);
    interval = 0;
  }

  return () => {
    window.clearInterval(interval);
  };
}, [taskStatus]);


  return (
    <div key={props.name} className="flex justify-between gap-x-6 py-5">
      <div className="flex min-w-0 gap-x-4">
        <div className="min-w-0 flex-auto">
          <p className="text-lg font-semibold leading-6 text-gray-900 ml-2">
            {props.name}
          </p>
          <p className="text-sm text-gray-500 ml-2">
            {formatDurationFromSeconds(elapsedTime)}
          </p>
          <div className="mt-3">
            {props.tags.split(",").map((tag, index) => (
              <span
                key={index}
                className="truncate text-xs leading-5 text-gray-600 mr-2 bg-l-gray px-3 py-2 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="hidden shrink-0 sm:flex sm:flex-row sm:items-center">
        <button
          onClick={() => {
            props.onToggleStart(props.id);
            setTaskStatus("running");
          }}
        >
          <PlayIcon
            className="h-5 w-5 mr-2 text-green-500"
            aria-hidden="true"
          />
        </button>
        <button
          onClick={() => {
            props.onTogglePause(props.id);
            setTaskStatus("paused");
          }}
        >
          <PauseIcon
            className="h-5 w-5 mr-2 text-yellow-500"
            aria-hidden="true"
          />
        </button>
        <button
          onClick={() => {
            props.onToggleStop(props.id);
            setTaskStatus("stopped");
          }}
        >
          <StopIcon
            className="h-5 w-5 mr-2 text-yellow-500"
            aria-hidden="true"
          />
        </button>
        <button onClick={props.onEdit}>
          <PencilIcon
            className="ml-1 mr-2 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </button>
        <button onClick={props.onDelete}>
          <TrashIcon
            className="ml-1 mr-1.5 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
};

function formatDurationFromSeconds(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(remainingSeconds).padStart(2, "0")}`;
}

export default Task;
