import { serialize } from 'v8';
import Book from '../models/BookModel';
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
