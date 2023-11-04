import React from "react";

import { PencilIcon, TrashIcon } from "@heroicons/react/20/solid";

interface TaskProps {
  name: string;
  tags: string;
  onDelete: () => void;
  onEdit: () => void;
}

const Task: React.FC<TaskProps> = (props) => (
  <li key={props.name} className="flex justify-between gap-x-6 py-5">
    <div className="flex min-w-0 gap-x-4">
      <div className="min-w-0 flex-auto">
        <p className="text-lg font-semibold leading-6 text-gray-900 ml-2">
          {props.name}
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
      <button onClick={props.onEdit}>
        <PencilIcon
          className="-ml-0.5 mr-2 h-5 w-5 text-gray-400"
          aria-hidden="true"
        />
      </button>
      <button onClick={props.onDelete}>
        <TrashIcon
          className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
          aria-hidden="true"
        />
      </button>
    </div>
  </li>
);

export default Task;
