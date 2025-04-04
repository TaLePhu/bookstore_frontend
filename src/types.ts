export interface ApiBook {
    bookId: number;
    bookName?: string;
    authorName?: string;
    description?: string;
    listedPrice?: number;
    salePrice?: number;
    quantity?: number;
    image?: string;
}

export interface Book {
    id: number;
    title: string;
    price: number;
    salePrice?: number;
    authorName?: string,
    quantity?: number;
    description: string;
    image: string;
}

export interface Category {
    category: string;
    items: Book[]; 
}
