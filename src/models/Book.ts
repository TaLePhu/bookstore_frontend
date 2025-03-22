class Book {
    bookId: number;
    bookName?: string; // maybe null
    authorName?: string;
    isbn?: string;
    description?: string;
    listedPrice?: number;
    salePrice?: number;
    quantity?: number;
    averageRating?: number;
    image?: string; // ✅ Thêm image

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
        image?: string // ✅ Thêm vào constructor
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
        this.image = image; // ✅ Gán giá trị
    }
}

export default Book;
