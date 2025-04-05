
export interface Book {
    id: number;
    title: string;
    price: number;
    salePrice?: number;
    authorName?: string;
    quantity?: number;
    description: string;
    imageUrl?: string;
    averageRating?: number;
    isbn?: string;
}

export default Book;