import { Image } from "./Image";

export interface ApiBook {
    bookId: number;
    bookName?: string;
    authorName?: string;
    description?: string;
    listedPrice?: number;
    salePrice?: number;
    quantity?: number;
    images: Image[];
}
