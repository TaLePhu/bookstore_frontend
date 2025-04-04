import Book from "./BookModel";

export interface Category {
    categoryName: string;
    items: Book[]; 
}