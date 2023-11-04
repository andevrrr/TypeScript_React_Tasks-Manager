import React from "react";

interface TaskProps {
  name: string;
  tags: string;
  onDelete: () => void;
  onEdit: () => void;
}

const Task: React.FC<TaskProps> = (props) => (
  <div>
    <h3>{props.name}</h3>
    <p>{props.tags}</p>
    <div>
      <button onClick={props.onEdit}>Edit</button>
      <button onClick={props.onDelete}>Delete</button>
    </div>
  </div>
);

export default Task;
