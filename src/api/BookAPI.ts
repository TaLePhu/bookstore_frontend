import Book from "../models/Book";
import { my_request } from "./Request";

export async function getAllBook(): Promise<Book[]> {
    const path: string = 'http://localhost:8080/books';

    try {
        const response = await my_request(path);

        // Kiểm tra dữ liệu từ API có hợp lệ không
        if (!response || !response._embedded || !Array.isArray(response._embedded.books)) {
            console.error("❌ API không trả về dữ liệu hợp lệ:", response);
            return []; // Trả về mảng rỗng nếu API lỗi
        }

        const books = response._embedded.books;
        console.log("✅ Dữ liệu API nhận được:", books);

        // Chuyển đổi dữ liệu sang danh sách Book[]
        return books.map((book: any) => ({
            bookId: book.bookId,
            bookName: book.bookName ?? "Chưa có tên",
            authorName: book.authorName ?? "Không rõ",
            description: book.description ?? "Không có mô tả",
            isbn: book.isbn ?? "N/A",
            averageRating: book.averageRating ?? 0,
            listedPrice: book.listedPrice ?? 0,
            quantity: book.quantity ?? 0,
            salePrice: book.salePrice ?? book.listedPrice, // Nếu không có salePrice, lấy listedPrice
            image: book.image ?? "/default-book.jpg", // Nếu không có ảnh, dùng ảnh mặc định
        }));

    } catch (error) {
        console.error("❌ Lỗi khi gọi API sách:", error);
        return [];
    }
}
