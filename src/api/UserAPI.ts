import axios from 'axios';
import UserModel from '../models/UserModel';

const API_URL = 'http://localhost:8080/admin/users';

// Hàm helper để lấy token từ localStorage
const getAuthToken = () => {
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token); // Debug log
    return token;
};

// Cấu hình axios instance với token mặc định
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    }
});

// Thêm interceptor để tự động thêm token vào mọi request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        console.log('Token in interceptor:', token); // Debug log
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Headers after adding token:', config.headers); // Debug log
        }
        return config;
    },
    (error) => {
        console.error('Interceptor error:', error); // Debug log
        return Promise.reject(error);
    }
);

// Thêm interceptor để xử lý response
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            console.log('Unauthorized access. Token might be invalid or expired.');
            // Có thể thêm logic để refresh token hoặc logout ở đây
        }
        return Promise.reject(error);
    }
);

export const getAllUsers = async (): Promise<UserModel[]> => {
    try {
        const response = await axiosInstance.get('/admin/users');
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const getUserById = async (id: number): Promise<UserModel> => {
    try {
        const response = await axiosInstance.get(`/admin/users/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};

export const createUser = async (user: UserModel): Promise<UserModel> => {
    try {
        const response = await axiosInstance.post('/admin/users', user);
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

export const updateUser = async (id: number, user: UserModel): Promise<UserModel> => {
    try {
        const response = await axiosInstance.put(`/admin/users/${id}`, user);
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

export const deleteUser = async (id: number): Promise<boolean> => {
    try {
        console.log('Attempting to delete user with ID:', id); // Debug log
        const response = await axiosInstance.delete(`/admin/users/${id}`);
        console.log('Delete response:', response); // Debug log
        return true;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
}; 