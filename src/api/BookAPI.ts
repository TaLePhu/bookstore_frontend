import { serialize } from 'v8';
import Book from '../models/BookModel';
import { my_request, phu_request } from './Request';
import Category from '../models/Category';
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
// export async function layToanBoSach(trang: number): Promise<ResultInterface> {
//     // Xác định endpoint
//     const duongDan: string = `http://localhost:8080/books?sort=bookId,desc&size=8&page=${trang}`;

//     return getBook(duongDan);
// }

export async function layToanBoSach(trang: number, size: number = 5): Promise<ResultInterface> {
    const duongDan: string = `http://localhost:8080/books?sort=bookId,desc&size=${size}&page=${trang}`;
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
// export async function findBook(searchKey: string, categoryId: number): Promise<ResultInterface> {
//     // Xác định endpoint
//     let duongDan: string = `http://localhost:8080/books?desc&size=8&page=0`;

//     if (searchKey !== '' && categoryId === 0) {
//         duongDan = `http://localhost:8080/books/search/findByBookNameContaining?sort=bookId,desc&size=8&bookName=${searchKey}`;
//     }

//     if (searchKey === '' && categoryId > 0) {
//         duongDan = `http://localhost:8080/books/search/findByCategories_CategoryId?sort=bookId,desc&size=8&categoryId=${categoryId}`;
//     }

//     if (searchKey !== '' && categoryId > 0) {
//         duongDan = `http://localhost:8080/books/search/findByBookNameContainingAndCategories_CategoryId?sort=bookId,desc&size=8&categoryId=${categoryId}&bookName=${searchKey}`;
//     }

//     return getBook(duongDan);
// }
export async function findBook(
    searchKey: string,
    categoryId: number,
    trang: number = 0,
    size: number = 5
): Promise<ResultInterface> {
    let duongDan: string = `http://localhost:8080/books?sort=bookId,desc&size=${size}&page=${trang}`;

    if (searchKey !== '' && categoryId === 0) {
        duongDan = `http://localhost:8080/books/search/findByBookNameContaining?sort=bookId,desc&size=${size}&page=${trang}&bookName=${searchKey}`;
    }

    if (searchKey === '' && categoryId > 0) {
        duongDan = `http://localhost:8080/books/search/findByCategories_CategoryId?sort=bookId,desc&size=${size}&page=${trang}&categoryId=${categoryId}`;
    }

    if (searchKey !== '' && categoryId > 0) {
        duongDan = `http://localhost:8080/books/search/findByBookNameContainingAndCategories_CategoryId?sort=bookId,desc&size=${size}&page=${trang}&categoryId=${categoryId}&bookName=${searchKey}`;
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
        const response = await fetch(`http://localhost:8080/books/${bookId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
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
        const response = await fetch(`http://localhost:8080/books/${bookId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return true;
    } catch (error) {
        console.error('Error updating book:', error);
        return false;
    }
}

/**
 * Lấy thông tin một cuốn sách theo ID
 * @param bookId ID của sách cần lấy
 * @returns BookModel nếu tìm thấy, null nếu lỗi
 */
export async function getBookById(bookId: number): Promise<Book | null> {
    try {
        const response = await fetch(`http://localhost:8080/books/${bookId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const book: Book = {
            bookId: data.bookId,
            bookName: data.bookName,
            authorName: data.authorName,
            isbn: data.isbn,
            description: data.description,
            listedPrice: data.listedPrice,
            salePrice: data.salePrice,
            quantity: data.quantity,
            averageRating: data.averageRating,
        };

        return book;
    } catch (error) {
        console.error('Lỗi khi lấy sách theo ID:', error);
        return null;
    }
}

/**
 * Tìm kiếm sách theo từ khóa và danh sách ID thể loại
 * @param searchKey Từ khóa tìm kiếm
 * @param categoryIds Danh sách ID thể loại
 * @param trang Số trang (mặc định là 0)
 * @param size Kích thước trang (mặc định là 5)
 * @returns Promise<ResultInterface> Kết quả tìm kiếm
 */
export async function findBookCategory(
    searchKey: string,
    categoryIds: number[],
    trang: number = 0,
    size: number = 5
): Promise<ResultInterface> {
    const categoryParams = categoryIds.map(id => `categoryId=${id}`).join('&');
    const duongDan = `http://localhost:8080/books/search/findByBookNameContainingAndCategoryIds?sort=bookId,desc&size=${size}&page=${trang}&${categoryParams}&bookName=${searchKey}`;
    return getBook(duongDan);
}