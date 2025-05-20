import Category from '../models/Category';
import { my_request } from './Request';

export async function getAllCategories(): Promise<Category[]> {
    const res = await my_request('http://localhost:8080/categories');
    return res; 
}

export async function addCategory(categoryName: string): Promise<boolean> {
    try {
        const response = await my_request(
            'http://localhost:8080/categories',
            'POST',
            { categoryName }
        );
        return true;
    } catch (error) {
        console.error('Error adding category:', error);
        return false;
    }
}

export async function updateCategory(categoryId: number, categoryName: string): Promise<boolean> {
    try {
        const response = await my_request(
            `http://localhost:8080/categories/${categoryId}`,
            'PUT',
            { categoryName }
        );
        return true;
    } catch (error) {
        console.error('Error updating category:', error);
        return false;
    }
}

export async function deleteCategory(categoryId: number): Promise<boolean> {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No authentication token found');
            return false;
        }

        const response = await fetch(
            `http://localhost:8080/categories/${categoryId}`,
            {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return true;
    } catch (error) {
        console.error('Error deleting category:', error);
        return false;
    }
}
