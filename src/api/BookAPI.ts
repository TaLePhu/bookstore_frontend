import { serialize } from 'v8';
import Book from '../models/BookModel';
import { my_request, phu_request } from './Request';
import Category from '../interface/Category';
// import { getCategoriesOfBook } from "./CategoryAPI"; 

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

/**
 *
 * @param searchKey
 * @description dùng lấy danh sách sách theo tên sách, mã thể loại
 * @returns result: Danh sách sách, totalPages: Tổng số trang, totalBook: Tổng số sách
 * @author phu
 * endpoint:http://localhost:8080/books/search/findByBookNameContainingAndCategories_CategoryId?categoryId=1&bookName=k
 * endpoint: http://localhost:8080/books/search/findByCategories_CategoryId?categoryId=1
 */
export async function findBook(searchKey: string, categoryId: number): Promise<ResultInterface> {
    // Xác định endpoint
    let duongDan: string = `http://localhost:8080/books?desc&size=8&page=0`;

    if (searchKey !== '' && categoryId === 0) {
        duongDan = `http://localhost:8080/books/search/findByBookNameContaining?sort=bookId,desc&size=8&bookName=${searchKey}`;
    }

    if (searchKey === '' && categoryId > 0) {
        duongDan = `http://localhost:8080/books/search/findByCategories_CategoryId?sort=bookId,desc&size=8&categoryId=${categoryId}`;
    }

    if (searchKey !== '' && categoryId > 0) {
        duongDan = `http://localhost:8080/books/search/findByBookNameContainingAndCategories_CategoryId?sort=bookId,desc&size=8&categoryId=${categoryId}&bookName=${searchKey}`;
    }

    return getBook(duongDan);
}

/**
 * Xóa một cuốn sách theo ID
 * @param bookId ID của cuốn sách cần xóa
 * @returns Promise<boolean> true nếu xóa thành công, false nếu thất bại
 */
export async function deleteBook(bookId: number): Promise<boolean> {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No authentication token found');
            return false;
        }

        const response = await fetch(`http://localhost:8080/books/${bookId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Delete failed with status:', response.status);
            console.error('Error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        return true;
    } catch (error) {
        console.error('Error deleting book:', error);
        return false;
    }
}

/**
 * Cập nhật thông tin một cuốn sách theo ID
 * @param bookId ID của cuốn sách cần cập nhật
 * @param bookData Dữ liệu cập nhật của cuốn sách
 * @returns Promise<boolean> true nếu cập nhật thành công, false nếu thất bại
 */
export async function updateBook(bookId: number, bookData: Book): Promise<boolean> {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No authentication token found');
            return false;
        }

        console.log('Updating book with data:', bookData);
        const response = await fetch(`http://localhost:8080/books/${bookId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(bookData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Update failed with status:', response.status);
            console.error('Error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const responseData = await response.json();
        console.log('Update successful. Response:', responseData);
        return true;
    } catch (error) {
        console.error('Error updating book:', error);
        if (error instanceof Error) {
            console.error('Error details:', error.message);
            console.error('Error stack:', error.stack);
        }
        return false;
    }
}
