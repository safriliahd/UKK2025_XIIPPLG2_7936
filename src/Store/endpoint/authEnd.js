import API_URL from "../api/api";


export const register = async (userData) => {
  try {
    const response = await API_URL.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Registration failed" };
  }
};

export const login = async (user) => {
  try {
    const response = await API_URL.post("/auth/login", user);
    localStorage.setItem("userId", response.data.user.id);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};

export const logout = async () => {
  try {
    const response = await API_URL.post("/auth/logout");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Logout failed" };
  }
};

export const getUserById = async (id) => {
  if (!id) throw new Error("User ID is required");
  
  try{
    const response = await API_URL.get(`/auth/user/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || {message: "Failed to fetch user data"}
  }
};