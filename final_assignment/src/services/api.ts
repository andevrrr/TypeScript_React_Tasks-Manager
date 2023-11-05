import axios from 'axios';

const API_BASE_URL = 'http://localhost:3010';

export const fetchTasks = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tasks`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error; 
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
    return response.data; 
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export const deleteTask = async (taskId: number) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/tasks/${taskId}`);
    if (response.status !== 200) {
      throw new Error('Failed to delete task.');
    }
    return response;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

export const updateTasksLineIds = async (taskId: number, lineId: number) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/tasks/${taskId}`, { lineId: lineId });
    return response.data;
  } catch (error) {
    console.error('Error updating tasks lineIds:', error);
    throw error;
  }
};
//tags 

export const fetchTags = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tags`);
    return response.data; 
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error; 
  }
};

export const createTag = async (data: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/tags`, data);
    return response.data; 
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};