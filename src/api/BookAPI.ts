import { Link } from 'react-router-dom';
import Category from '../interface/Category';
import Book from '../models/BookModel';
import Image from '../models/ImageModel'; // Import class Image
import { my_request, phu_request } from './Request';

//phu-add
interface ResultInterface {
    result: Book[];
    totalPages: number;
    totalBook: number;
}

/**
 *
 * @param link
 * @description Hàm này dùng để lấy danh sách sách từ server
 * @returns result: Danh sách sách, totalPages: Tổng số trang, totalBook: Tổng số sách
 * @author phu
 */
async function getBook(link: string): Promise<ResultInterface> {
    const result: Book[] = [];

    const res = await phu_request(link);

    const responseData = res._embedded.books;

    const totalPages = res.page.totalPages;
    const totalBook = res.page.totalElements;

    for (const key in responseData) {
        result.push({
            bookId: responseData[key].bookId,
            bookName: responseData[key].bookName,
            authorName: responseData[key].authorName,
            isbn: responseData[key].isbn,
            description: responseData[key].description,
            listedPrice: responseData[key].listedPrice,
            salePrice: responseData[key].salePrice,
            quantity: responseData[key].quantity,
            averageRating: responseData[key].averageRating,
        });
    }

    return { result: result, totalPages: totalPages, totalBook: totalBook };
}

/*  
* author: phu
   @param trang: số trang cần lấy
    @description: Hàm này dùng để lấy danh sách sách từ server
    @return: Danh sách sách, tổng số trang, tổng số sách
*/
export async function layToanBoSach(trang: number): Promise<ResultInterface> {
    // Xác định endpoint
    const duongDan: string = `http://localhost:8080/books?sort=bookId,desc&size=8&page=${trang}`;

    return getBook(duongDan);
}

// export async function getCategoriesOfBook(bookId: number): Promise<Category[]> {
//     const url = `http://localhost:8080/books/${bookId}/categories`;
//     const response = await fetch(url);
//     return await response.json();
// }

// export async function getAllBook(): Promise<Book[]> {
//     const path: string = 'http://localhost:8080/books';
//     const result: Book[] = [];

//     const response = await my_request(path);
//     const responseData = response._embedded.books;

//     for (const key in responseData) {
//         result.push({
//             bookId: responseData[key].bookId,
//             bookName: responseData[key].bookName ?? 'Chưa có tên',
//             authorName: responseData[key].authorName ?? 'Không rõ',
//             description: responseData[key].description ?? 'Không có mô tả',
//             isbn: responseData[key].isbn ?? 'N/A',
//             averageRating: responseData[key].averageRating ?? 0,
//             listedPrice: responseData[key].listedPrice ?? 0,
//             quantity: responseData[key].quantity ?? 0,
//             salePrice: responseData[key].salePrice ?? responseData[key].listedPrice,
//         });
//     }

//     return result;
// }
