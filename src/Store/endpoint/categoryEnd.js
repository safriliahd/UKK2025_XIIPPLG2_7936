import API_URL from "../api/api"

export const getCategories = async (userId) => {
    try {
        const response = await API_URL.get(`/categories?userId=${userId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch categories" };
    }
};

export const addCategory = async (categoryData) => {
    try {
        const response = await API_URL.post("/categories/add", categoryData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to add category" };
    }
};

export const editCategory = async (id, categoryData) => {
    try {
        const response = await API_URL.put(`/categories/${id}`, categoryData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to edit category" };
    }
};

export const deleteCategory = async (id) => {
    try {
        const response = await API_URL.delete(`/categories/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to delete category" };
    }
};
