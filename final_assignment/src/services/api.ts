import axios from 'axios';

const API_BASE_URL = 'http://localhost:3010';

export const fetchTasks = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tasks`);
    return response.data; // Access the 'data' property
  } catch (error) {
    // Handle errors appropriately (e.g., log them or show a user-friendly message)
    console.error('Error fetching tasks:', error);
    throw error; // Rethrow the error to propagate it
  }
};

export const updateTask = async (taskId: number, data: any) => {
  try {
    await axios.patch(`${API_BASE_URL}/tasks/${taskId}`, data);
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const createTask = async (data: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/tasks`, data);
    return response.data; // If you want to return the created task
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export const deleteTask = async (taskId: number) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/tasks/${taskId}`);
    console.log(response);
    return response; 
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};
