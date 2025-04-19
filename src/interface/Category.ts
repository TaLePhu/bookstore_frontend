// import Book from '../models/BookModel';

import { Book } from "../types";

export interface Category {
    // categoryId: number;
    // categoryName: string;
    categoryName: string;
    items: Book[]; 
}
export default Category;