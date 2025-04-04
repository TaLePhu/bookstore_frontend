
export interface Book {
    id: number;
    title: string;
    price: number;
    salePrice?: number;
    authorName?: string;
    quantity?: number;
    description: string;
    imageUrl?: string;
}

export default Book;