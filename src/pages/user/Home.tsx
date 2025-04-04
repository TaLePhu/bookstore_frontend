import { useState, useEffect } from "react";
import "../../assets/styles/Home.css";
import "../../assets/styles/ProductCard.css";
import Banner from "../../components/Banner";
import CategorySection from "../../components/CategorySection";
import { getAllBook } from "../../api/BookAPI";
//import { Book, ApiBook, Category } from "../../types"; // Import từ types.ts
import {Book} from "../../interface/Book";
import { ApiBook } from "../../interface/ApiBook";
import { Category } from "../../interface/Category";


const Home = () => {
    // const [categories, setCategories] = useState<Category[]>([]);

    // useEffect(() => {
    //     const fetchBooks = async () => {
    //         try {
    //             const booksFromAPI: ApiBook[] = await getAllBook();
                

    //             if (!Array.isArray(booksFromAPI)) {
    //                 throw new Error("API không trả về mảng");
    //             }

    //             console.log("Books from API:", booksFromAPI);
    //             const formattedBooks: Book[] = booksFromAPI.map((book) => ({
    //                 id: book.bookId,
    //                 title: book.bookName ?? "Không có tiêu đề",
    //                 price: book.listedPrice ?? 0,
    //                 salePrice: book.salePrice, 
    //                 authorName: book.authorName ?? "Không rõ",
    //                 description: book.description ?? "Không có mô tả",
    //                 quantity: book.quantity ?? 0,
                    
    //                 images: book.images ?? []
    //             }));



    //             // Phân loại sách thành danh mục
    //             const categorizedBooks: Category[] = [
    //                 {
    //                     category: "Bí ẩn",
    //                     items: formattedBooks.filter(book =>
    //                         book.title.toLowerCase().includes("mystery")
    //                     ),
    //                 },
    //                 {
    //                     category: "Tiểu thuyết",
    //                     items: formattedBooks.filter(book =>
    //                         book.title.toLowerCase().includes("novel")
    //                     ),
    //                 },
    //                 {
    //                     category: "Tâm lý",
    //                     items: formattedBooks.filter(book =>
    //                         book.title.toLowerCase().includes("psychology")
    //                     ),
    //                 },
    //                 {
    //                     category: "Khoa học",
    //                     items: formattedBooks.filter(book =>
    //                         book.title.toLowerCase().includes("science")
    //                     ),
    //                 },
    //                 {
    //                     category: "Lịch sử",
    //                     items: formattedBooks.filter(book =>
    //                         book.title.toLowerCase().includes("history")
    //                     ),
    //                 }
    //             ].filter(category => category.items.length > 0); // Loại bỏ danh mục rỗng

    //             setCategories(categorizedBooks);
    //         } catch (error) {
    //             console.error("Lỗi khi lấy dữ liệu sách:", error);
    //         }
    //     };

    //     fetchBooks();
    // }, []);

    return (
        <div className="container-home">
            <Banner />
            {/* {categories.length > 0 ? (
                categories.map(category => (
                    <CategorySection key={category.category} category={category} />
                ))
            ) : (
                <p>Không có sách nào để hiển thị.</p>
            )} */}
            <CategorySection />
        </div>
    );
};

export default Home;
