import React from 'react';

interface TaskProps {
    name: string;
  }

const Task: React.FC<TaskProps> = (props) => (
	<div>
        <h3>{props.name}</h3>
    </div>
);

export default Task;