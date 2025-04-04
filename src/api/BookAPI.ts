import Category from "../interface/Category";
import Book from "../models/BookModel";
import Image from "../models/ImageModel"; // Import class Image
import { my_request } from "./Request";

export async function getCategoriesOfBook(bookId: number): Promise<Category[]> {
    const url = `http://localhost:8080/books/${bookId}/categories`;
    const response = await fetch(url);
    return await response.json();
}

export async function getAllBook(): Promise<Book[]> {
    const path: string = 'http://localhost:8080/books';
    const result: Book[] = [];

    const response = await my_request(path);
    const responseData = response._embedded.books;

    

    for(const key in responseData) {
        
        result.push({
            bookId: responseData[key].bookId,
            bookName: responseData[key].bookName ?? "Chưa có tên",
            authorName: responseData[key].authorName ?? "Không rõ",
            description: responseData[key].description ?? "Không có mô tả",
            isbn: responseData[key].isbn ?? "N/A",
            averageRating: responseData[key].averageRating ?? 0,
            listedPrice: responseData[key].listedPrice ?? 0,
            quantity: responseData[key].quantity ?? 0,
            salePrice: responseData[key].salePrice ?? responseData[key].listedPrice,
            
        })
    }

    return result;

 
}

