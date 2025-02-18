import API_URL from "../api/api";

export const getTasks = async () => {
    try {
      const response = await API_URL.get("/tasks");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch tasks" };
    }
  };
  
  export const getTasksByCategoryId = async (categoryId) => {
    try {
      const response = await API_URL.get(`/tasks/category/${categoryId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch tasks for the given category" };
    }
  };
  
  export const addTask = async (taskData) => {
    try {
      const response = await API_URL.post("/tasks/add", taskData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to add task" };
    }
  };
  
  export const editTask = async (id, taskData) => {
    try {
      const response = await API_URL.put(`/tasks/${id}`, taskData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to edit task" };
    }
  };
  
  export const deleteTask = async (id) => {
    try {
      const response = await API_URL.delete(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to delete task" };
    }
  };
  
  export const completeTask = async (id) => {
    try {
      const response = await API_URL.patch(`/tasks/${id}/complete`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to complete task" };
    }
  };
  
  export const undoTask = async (id) => {
    try {
      const response = await API_URL.patch(`/tasks/${id}/undo`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to undo task" };
    }
  };