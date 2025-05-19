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
            'PATCH',
            { categoryName }
        );
        return true;
    } catch (error) {
        console.error('Error updating category:', error);
        return false;
    }
}
