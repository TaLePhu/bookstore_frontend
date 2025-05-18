import { Category } from "./Category";


    class Book {
        bookId: number;
        bookName?: string;
        authorName?: string;
        isbn?: string;
        description?: string;
        listedPrice?: number;
        salePrice?: number;
        quantity?: number;
        averageRating?: number;
        categories?: Category[];

        constructor(
            bookId: number,
            bookName?: string,
            authorName?: string,
            isbn?: string,
            description?: string,
            listedPrice?: number,
            salePrice?: number,
            quantity?: number,
            averageRating?: number,
            categories?: Category[]
        ) {
            this.bookId = bookId;
            this.bookName = bookName;
            this.authorName = authorName;
            this.isbn = isbn;
            this.description = description;
            this.listedPrice = listedPrice;
            this.salePrice = salePrice;
            this.quantity = quantity;
            this.averageRating = averageRating;
            this.categories = categories;
        }

    }

    export default Book;
