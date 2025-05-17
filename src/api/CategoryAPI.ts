import Category from '../interface/Category';
import { my_request } from './Request';

export async function getAllCategories(): Promise<Category[]> {
    const res = await my_request('http://localhost:8080/categories');
    return res._embedded.categories;
}
