import { Book } from './Book';

export interface Category {
    categoryName: string;
    items: Book[]; 
}
export default Category;