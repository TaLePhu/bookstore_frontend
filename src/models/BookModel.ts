

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
      }

}

export default Book;
