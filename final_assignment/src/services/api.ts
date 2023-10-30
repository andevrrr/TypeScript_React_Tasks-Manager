import axios from 'axios';

const API_BASE_URL = 'http://localhost:3010'; 

export const fetchTasks = () => {
    axios.get(`${API_BASE_URL}/tasks`);
}
export const updateTask = (taskId: number, data: any) => {
    axios.patch(`${API_BASE_URL}/tasks/${taskId}`, data)
};

